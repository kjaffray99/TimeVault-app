#!/usr/bin/env node

/**
 * TimeVault Security Validation Script
 * Validates security configuration before deployment
 */

import { exec } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import { promisify } from 'util';

const execAsync = promisify(exec);

class SecurityValidator {
    constructor() {
        this.results = {
            passed: [],
            failed: [],
            warnings: []
        };
    }

    log(type, message) {
        const timestamp = new Date().toISOString();
        const prefix = {
            'PASS': '✅',
            'FAIL': '❌',
            'WARN': '⚠️',
            'INFO': 'ℹ️'
        }[type] || 'ℹ️';

        console.log(`${prefix} [${timestamp}] ${message}`);

        if (type === 'PASS') this.results.passed.push(message);
        if (type === 'FAIL') this.results.failed.push(message);
        if (type === 'WARN') this.results.warnings.push(message);
    }

    async checkEnvironmentConfig() {
        this.log('INFO', 'Checking environment configuration...');

        try {
            const envContent = await fs.readFile('.env.production', 'utf8');

            // Check for required security settings
            const requiredSettings = [
                'VITE_SECURITY_ENABLED=true',
                'VITE_CSP_ENABLED=true',
                'VITE_DISABLE_CONSOLE=true'
            ];

            for (const setting of requiredSettings) {
                if (envContent.includes(setting)) {
                    this.log('PASS', `Environment setting validated: ${setting}`);
                } else {
                    this.log('FAIL', `Missing required environment setting: ${setting}`);
                }
            }

            // Check for sensitive data
            const sensitivePatterns = [
                /password\s*=\s*["']?[^"'\s]+/i,
                /secret\s*=\s*["']?[^"'\s]+/i,
                /api[_-]?key\s*=\s*["']?[^"'\s]+/i
            ];

            for (const pattern of sensitivePatterns) {
                if (pattern.test(envContent)) {
                    this.log('WARN', 'Potential sensitive data found in environment file');
                }
            }

        } catch (error) {
            this.log('FAIL', `Environment file not found: ${error.message}`);
        }
    }

    async checkSecurityFiles() {
        this.log('INFO', 'Checking security implementation files...');

        const securityFiles = [
            'src/security/SecurityManager.ts',
            'src/security/InputSanitizer.ts'
        ];

        for (const file of securityFiles) {
            try {
                await fs.access(file);
                this.log('PASS', `Security file exists: ${file}`);

                const content = await fs.readFile(file, 'utf8');

                // Check for common security patterns
                if (content.includes('sanitize') || content.includes('validate')) {
                    this.log('PASS', `Security functions found in ${file}`);
                } else {
                    this.log('WARN', `No security functions detected in ${file}`);
                }

            } catch (error) {
                this.log('FAIL', `Security file missing: ${file}`);
            }
        }
    }

    async checkDependencyVulnerabilities() {
        this.log('INFO', 'Checking for dependency vulnerabilities...');

        try {
            const { stdout, stderr } = await execAsync('npm audit --audit-level=high --json');
            const auditResult = JSON.parse(stdout);

            if (auditResult.metadata.vulnerabilities.high > 0 ||
                auditResult.metadata.vulnerabilities.critical > 0) {
                this.log('FAIL', `High/Critical vulnerabilities found: ${auditResult.metadata.vulnerabilities.high + auditResult.metadata.vulnerabilities.critical}`);
            } else {
                this.log('PASS', 'No high or critical vulnerabilities found');
            }

            if (auditResult.metadata.vulnerabilities.moderate > 0) {
                this.log('WARN', `Moderate vulnerabilities found: ${auditResult.metadata.vulnerabilities.moderate}`);
            }

        } catch (error) {
            if (error.code === 1) {
                // npm audit returns exit code 1 when vulnerabilities are found
                this.log('FAIL', 'Vulnerabilities detected in dependencies');
            } else {
                this.log('WARN', `Could not run dependency audit: ${error.message}`);
            }
        }
    }

    async checkBuildConfiguration() {
        this.log('INFO', 'Checking build configuration...');

        try {
            const viteConfig = await fs.readFile('vite.config.ts', 'utf8');

            // Check for production optimizations
            if (viteConfig.includes('minify')) {
                this.log('PASS', 'Code minification enabled');
            } else {
                this.log('WARN', 'Code minification not explicitly configured');
            }

            // Check for source map configuration
            if (viteConfig.includes('sourcemap: false') || viteConfig.includes('"sourcemap":false')) {
                this.log('PASS', 'Source maps disabled for production');
            } else {
                this.log('WARN', 'Source maps may be enabled in production');
            }

        } catch (error) {
            this.log('WARN', `Could not read Vite config: ${error.message}`);
        }
    }

    async checkSecurityHeaders() {
        this.log('INFO', 'Checking security headers configuration...');

        try {
            // Check for Vercel configuration
            try {
                const vercelConfig = await fs.readFile('vercel.json', 'utf8');
                const config = JSON.parse(vercelConfig);

                if (config.headers && config.headers.length > 0) {
                    this.log('PASS', 'Vercel security headers configured');

                    const headers = config.headers[0].headers || [];
                    const securityHeaderNames = ['Content-Security-Policy', 'Strict-Transport-Security', 'X-Frame-Options'];

                    for (const headerName of securityHeaderNames) {
                        const found = headers.some(h => h.key === headerName);
                        if (found) {
                            this.log('PASS', `Security header configured: ${headerName}`);
                        } else {
                            this.log('FAIL', `Missing security header: ${headerName}`);
                        }
                    }
                } else {
                    this.log('FAIL', 'No security headers configured in vercel.json');
                }
            } catch (vercelError) {
                this.log('INFO', 'No Vercel configuration found');
            }

            // Check for Netlify configuration
            try {
                const netlifyHeaders = await fs.readFile('_headers', 'utf8');
                if (netlifyHeaders.includes('Content-Security-Policy')) {
                    this.log('PASS', 'Netlify security headers configured');
                }
            } catch (netlifyError) {
                this.log('INFO', 'No Netlify headers configuration found');
            }

        } catch (error) {
            this.log('WARN', `Could not check security headers: ${error.message}`);
        }
    }

    async checkCodeQuality() {
        this.log('INFO', 'Checking code quality...');

        try {
            // Check if TypeScript compilation succeeds
            await execAsync('npx tsc --noEmit');
            this.log('PASS', 'TypeScript compilation successful');
        } catch (error) {
            this.log('FAIL', 'TypeScript compilation failed');
        }

        try {
            // Check for TODO/FIXME comments
            const { stdout } = await execAsync('grep -r "TODO\\|FIXME\\|XXX\\|HACK" src/ || true');
            if (stdout.trim()) {
                this.log('WARN', 'TODO/FIXME comments found in code');
            } else {
                this.log('PASS', 'No TODO/FIXME comments found');
            }
        } catch (error) {
            this.log('INFO', 'Could not check for TODO comments');
        }
    }

    async validateBuild() {
        this.log('INFO', 'Validating production build...');

        try {
            // Run production build
            await execAsync('npm run build');
            this.log('PASS', 'Production build successful');

            // Check build output
            const distStats = await fs.stat('dist');
            if (distStats.isDirectory()) {
                this.log('PASS', 'Build output directory created');

                // Check for critical files
                const criticalFiles = ['index.html', 'assets'];
                for (const file of criticalFiles) {
                    try {
                        await fs.access(path.join('dist', file));
                        this.log('PASS', `Critical build file exists: ${file}`);
                    } catch (error) {
                        this.log('FAIL', `Missing critical build file: ${file}`);
                    }
                }
            }

        } catch (error) {
            this.log('FAIL', `Production build failed: ${error.message}`);
        }
    }

    async runAllChecks() {
        console.log('🔒 TimeVault Security Validation Started\n');

        await this.checkEnvironmentConfig();
        await this.checkSecurityFiles();
        await this.checkDependencyVulnerabilities();
        await this.checkBuildConfiguration();
        await this.checkSecurityHeaders();
        await this.checkCodeQuality();
        await this.validateBuild();

        console.log('\n📊 Security Validation Results:');
        console.log(`✅ Passed: ${this.results.passed.length}`);
        console.log(`❌ Failed: ${this.results.failed.length}`);
        console.log(`⚠️  Warnings: ${this.results.warnings.length}`);

        if (this.results.failed.length === 0) {
            console.log('\n🎉 Security validation PASSED! Ready for deployment.');
            process.exit(0);
        } else {
            console.log('\n🚨 Security validation FAILED! Please fix issues before deployment.');
            console.log('\nFailed checks:');
            this.results.failed.forEach(failure => console.log(`  ❌ ${failure}`));
            process.exit(1);
        }
    }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new SecurityValidator();
    validator.runAllChecks().catch(error => {
        console.error('❌ Validation script error:', error);
        process.exit(1);
    });
}

export { SecurityValidator };
