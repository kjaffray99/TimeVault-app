/**
 * TimeVault Security Validation Script
 * Validates security configuration before deployment
 */

import { execSync } from 'child_process';
import fs from 'fs';

class SecurityValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0
        };
    }

    log(type, message) {
        const prefix = {
            'PASS': '✅',
            'FAIL': '❌',
            'WARN': '⚠️',
            'INFO': 'ℹ️'
        }[type] || 'ℹ️';

        console.log(`${prefix} ${message}`);

        if (type === 'PASS') this.results.passed++;
        if (type === 'FAIL') this.results.failed++;
        if (type === 'WARN') this.results.warnings++;
    }

    checkFile(filePath, description) {
        try {
            if (fs.existsSync(filePath)) {
                this.log('PASS', `${description}: ${filePath}`);
                return true;
            } else {
                this.log('FAIL', `Missing ${description}: ${filePath}`);
                return false;
            }
        } catch (error) {
            this.log('FAIL', `Error checking ${description}: ${error.message}`);
            return false;
        }
    }

    checkSecurityFiles() {
        this.log('INFO', 'Checking security implementation files...');

        this.checkFile('src/security/SecurityManager.ts', 'Security Manager');
        this.checkFile('src/security/InputSanitizer.ts', 'Input Sanitizer');
        this.checkFile('.env.production', 'Production Environment');
        this.checkFile('DEPLOYMENT.md', 'Deployment Documentation');
        this.checkFile('SECURITY-CHECKLIST.md', 'Security Checklist');
    }

    checkBuildOutput() {
        this.log('INFO', 'Checking build output...');

        if (fs.existsSync('dist')) {
            this.log('PASS', 'Build directory exists');

            if (fs.existsSync('dist/index.html')) {
                this.log('PASS', 'Build output contains index.html');
            } else {
                this.log('FAIL', 'Missing index.html in build output');
            }

            if (fs.existsSync('dist/assets')) {
                this.log('PASS', 'Build output contains assets directory');
            } else {
                this.log('WARN', 'No assets directory in build output');
            }
        } else {
            this.log('FAIL', 'Build directory not found - run npm run build first');
        }
    }

    checkTypeScriptCompilation() {
        this.log('INFO', 'Checking TypeScript compilation...');

        try {
            execSync('npx tsc --noEmit', { stdio: 'pipe' });
            this.log('PASS', 'TypeScript compilation successful');
        } catch (error) {
            this.log('FAIL', 'TypeScript compilation failed');
        }
    }

    checkSecurityConfiguration() {
        this.log('INFO', 'Checking security configuration...');

        // Check main.tsx for security initialization
        if (fs.existsSync('src/main.tsx')) {
            const mainContent = fs.readFileSync('src/main.tsx', 'utf8');
            if (mainContent.includes('SecurityManager')) {
                this.log('PASS', 'Security Manager integrated in main.tsx');
            } else {
                this.log('WARN', 'Security Manager not found in main.tsx');
            }
        }

        // Check for security headers configuration
        this.checkFile('vercel.json', 'Vercel Configuration');
        this.checkFile('_headers', 'Netlify Headers');
    }

    runValidation() {
        console.log('🔒 TimeVault Security Validation Started\n');

        this.checkSecurityFiles();
        this.checkBuildOutput();
        this.checkTypeScriptCompilation();
        this.checkSecurityConfiguration();

        console.log('\n📊 Security Validation Results:');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️  Warnings: ${this.results.warnings}`);

        if (this.results.failed === 0) {
            console.log('\n🎉 Security validation PASSED! Ready for deployment.');
            console.log('\n🚀 To deploy:');
            console.log('   Vercel: npm run deploy:vercel');
            console.log('   Netlify: npm run deploy:netlify');
            return true;
        } else {
            console.log('\n🚨 Security validation FAILED! Please fix issues before deployment.');
            return false;
        }
    }
}

// Run validation
const validator = new SecurityValidator();
const success = validator.runValidation();
process.exit(success ? 0 : 1);
