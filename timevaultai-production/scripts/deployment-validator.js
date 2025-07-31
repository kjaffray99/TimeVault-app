#!/usr/bin/env node
/**
 * 🚀 TIMEVAULT COMPREHENSIVE DEPLOYMENT VALIDATOR
 * Final validation and deployment preparation for Vercel
 */

const fs = require('fs');
const path = require('path');

class DeploymentValidator {
    constructor() {
        this.checksPassed = 0;
        this.checksTotal = 0;
        this.warnings = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',    // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m',   // Red
            reset: '\x1b[0m'     // Reset
        };

        const prefix = {
            info: '📋',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        console.log(`${colors[type]}${prefix[type]} ${message}${colors.reset}`);
    }

    async checkFile(filePath, description) {
        this.checksTotal++;
        try {
            if (fs.existsSync(filePath)) {
                this.log(`${description}: Found`, 'success');
                this.checksPassed++;
                return true;
            } else {
                this.log(`${description}: Missing`, 'error');
                this.errors.push(`Missing file: ${filePath}`);
                return false;
            }
        } catch (error) {
            this.log(`${description}: Error checking`, 'error');
            this.errors.push(`Error checking ${filePath}: ${error.message}`);
            return false;
        }
    }

    async checkBuildArtifacts() {
        this.log('\n🏗️ Checking Build Artifacts...', 'info');

        await this.checkFile('.next/build-manifest.json', 'Build Manifest');
        await this.checkFile('.next/prerender-manifest.json', 'Prerender Manifest');
        await this.checkFile('.next/routes-manifest.json', 'Routes Manifest');
        await this.checkFile('.next/static', 'Static Assets Directory');
        await this.checkFile('.next/server', 'Server Directory');
    }

    async checkConfiguration() {
        this.log('\n⚙️ Checking Configuration Files...', 'info');

        await this.checkFile('package.json', 'Package Configuration');
        await this.checkFile('next.config.js', 'Next.js Configuration');
        await this.checkFile('vercel.json', 'Vercel Configuration');
        await this.checkFile('tsconfig.json', 'TypeScript Configuration');
        await this.checkFile('.env.production', 'Production Environment');
    }

    async checkSourceFiles() {
        this.log('\n📁 Checking Source Files...', 'info');

        await this.checkFile('src/app/page.tsx', 'Main Page Component');
        await this.checkFile('src/app/layout.tsx', 'Root Layout');
        await this.checkFile('src/app/globals.css', 'Global Styles');
        await this.checkFile('src/components/CleanTimeVaultCalculator.tsx', 'Calculator Component');
        await this.checkFile('src/hooks/useApiIntegration.ts', 'API Integration Hook');
    }

    async checkPackageIntegrity() {
        this.log('\n📦 Checking Package Integrity...', 'info');

        try {
            const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

            // Check critical dependencies
            const criticalDeps = ['next', 'react', 'react-dom'];
            for (const dep of criticalDeps) {
                this.checksTotal++;
                if (packageJson.dependencies[dep]) {
                    this.log(`Dependency ${dep}: ${packageJson.dependencies[dep]}`, 'success');
                    this.checksPassed++;
                } else {
                    this.log(`Missing critical dependency: ${dep}`, 'error');
                    this.errors.push(`Missing dependency: ${dep}`);
                }
            }

            // Check scripts
            const requiredScripts = ['build', 'start', 'dev'];
            for (const script of requiredScripts) {
                this.checksTotal++;
                if (packageJson.scripts[script]) {
                    this.log(`Script ${script}: Available`, 'success');
                    this.checksPassed++;
                } else {
                    this.log(`Missing script: ${script}`, 'error');
                    this.errors.push(`Missing script: ${script}`);
                }
            }

        } catch (error) {
            this.log(`Package.json validation failed: ${error.message}`, 'error');
            this.errors.push(`Package.json error: ${error.message}`);
        }
    }

    async checkBundleSize() {
        this.log('\n📊 Analyzing Bundle Size...', 'info');

        try {
            const staticDir = '.next/static';
            if (fs.existsSync(staticDir)) {
                const calculateSize = (dirPath) => {
                    let totalSize = 0;
                    const files = fs.readdirSync(dirPath);

                    for (const file of files) {
                        const fullPath = path.join(dirPath, file);
                        const stats = fs.statSync(fullPath);

                        if (stats.isDirectory()) {
                            totalSize += calculateSize(fullPath);
                        } else {
                            totalSize += stats.size;
                        }
                    }
                    return totalSize;
                };

                const totalSize = calculateSize(staticDir);
                const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

                this.checksTotal++;
                if (totalSize < 5 * 1024 * 1024) { // Less than 5MB
                    this.log(`Bundle size: ${sizeInMB} MB (Excellent)`, 'success');
                    this.checksPassed++;
                } else if (totalSize < 10 * 1024 * 1024) { // Less than 10MB
                    this.log(`Bundle size: ${sizeInMB} MB (Good)`, 'warning');
                    this.warnings.push(`Bundle size is ${sizeInMB} MB - consider optimization`);
                    this.checksPassed++;
                } else {
                    this.log(`Bundle size: ${sizeInMB} MB (Too large)`, 'error');
                    this.errors.push(`Bundle size too large: ${sizeInMB} MB`);
                }
            }
        } catch (error) {
            this.log(`Bundle size analysis failed: ${error.message}`, 'warning');
            this.warnings.push(`Bundle analysis error: ${error.message}`);
        }
    }

    async generateDeploymentReport() {
        this.log('\n📋 Generating Deployment Report...', 'info');

        const successRate = ((this.checksPassed / this.checksTotal) * 100).toFixed(1);

        const report = {
            timestamp: new Date().toISOString(),
            validation: {
                total_checks: this.checksTotal,
                passed: this.checksPassed,
                success_rate: `${successRate}%`
            },
            status: this.errors.length === 0 ? 'READY' : 'ISSUES_DETECTED',
            errors: this.errors,
            warnings: this.warnings,
            next_steps: this.errors.length === 0 ? [
                'git add .',
                'git commit -m "🚀 Production deployment ready"',
                'git push origin main',
                'Deploy to Vercel'
            ] : [
                'Fix the reported errors',
                'Re-run validation',
                'Proceed with deployment'
            ]
        };

        fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));
        this.log('Deployment report saved to deployment-report.json', 'success');

        return report;
    }

    async runValidation() {
        this.log('🚀 TimeVault Comprehensive Deployment Validation', 'info');
        this.log('=' * 55, 'info');

        await this.checkBuildArtifacts();
        await this.checkConfiguration();
        await this.checkSourceFiles();
        await this.checkPackageIntegrity();
        await this.checkBundleSize();

        const report = await this.generateDeploymentReport();

        this.log('\n📊 VALIDATION RESULTS', 'info');
        this.log('=' * 25, 'info');
        this.log(`Total Checks: ${this.checksTotal}`, 'info');
        this.log(`Passed: ${this.checksPassed}`, 'success');
        this.log(`Warnings: ${this.warnings.length}`, 'warning');
        this.log(`Errors: ${this.errors.length}`, this.errors.length > 0 ? 'error' : 'success');
        this.log(`Success Rate: ${report.validation.success_rate}`, 'info');

        if (this.errors.length === 0) {
            this.log('\n🎉 DEPLOYMENT READY!', 'success');
            this.log('TimeVault is validated and ready for production deployment', 'success');
            this.log('\n📋 Next Steps:', 'info');
            report.next_steps.forEach(step => this.log(`   ${step}`, 'info'));
        } else {
            this.log('\n⚠️ ISSUES DETECTED', 'warning');
            this.log('Please fix the following issues before deployment:', 'warning');
            this.errors.forEach(error => this.log(`   ${error}`, 'error'));
        }

        return report.status === 'READY';
    }
}

// Run validation if this file is executed directly
if (require.main === module) {
    const validator = new DeploymentValidator();
    validator.runValidation().then(isReady => {
        process.exit(isReady ? 0 : 1);
    }).catch(error => {
        console.error('❌ Validation failed:', error);
        process.exit(1);
    });
}

module.exports = DeploymentValidator;
