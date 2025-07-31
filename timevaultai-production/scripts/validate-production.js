/**
 * 🔍 PRODUCTION BUILD VALIDATOR
 * Comprehensive testing and validation for TimeVault deployment
 */

const fs = require('fs').promises;
const path = require('path');
const http = require('http');

// ANSI color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
};

class ProductionValidator {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
        };
    }

    log(message, color = 'reset') {
        console.log(`${colors[color]}${message}${colors.reset}`);
    }

    async validateBuildArtifacts() {
        this.log('\n🔍 Validating Build Artifacts...', 'cyan');

        const requiredFiles = [
            '.next/static',
            '.next/server',
            '.next/BUILD_ID',
            'package.json',
            'next.config.js',
        ];

        for (const file of requiredFiles) {
            try {
                await fs.access(file);
                this.log(`✅ ${file} exists`, 'green');
                this.results.passed++;
            } catch (error) {
                this.log(`❌ ${file} missing`, 'red');
                this.results.failed++;
            }
        }
    }

    async validateEnvironmentConfig() {
        this.log('\n🌍 Validating Environment Configuration...', 'cyan');

        const requiredEnvVars = [
            'NODE_ENV',
            'SITE_URL',
        ];

        const optionalEnvVars = [
            'COINGECKO_API_KEY',
            'METALS_API_KEY',
            'THIRDWEB_CLIENT_ID',
            'STRIPE_PUBLISHABLE_KEY',
        ];

        // Check required variables
        for (const envVar of requiredEnvVars) {
            if (process.env[envVar]) {
                this.log(`✅ ${envVar} is set`, 'green');
                this.results.passed++;
            } else {
                this.log(`❌ ${envVar} is missing`, 'red');
                this.results.failed++;
            }
        }

        // Check optional variables
        for (const envVar of optionalEnvVars) {
            if (process.env[envVar]) {
                this.log(`✅ ${envVar} is configured`, 'green');
                this.results.passed++;
            } else {
                this.log(`⚠️ ${envVar} not set (optional)`, 'yellow');
                this.results.warnings++;
            }
        }
    }

    async validateBundleSize() {
        this.log('\n📦 Analyzing Bundle Size...', 'cyan');

        try {
            const nextDir = '.next';
            const staticDir = path.join(nextDir, 'static');

            // Calculate total bundle size
            const calculateDirSize = async (dirPath) => {
                const files = await fs.readdir(dirPath, { withFileTypes: true });
                let totalSize = 0;

                for (const file of files) {
                    const fullPath = path.join(dirPath, file.name);
                    if (file.isDirectory()) {
                        totalSize += await calculateDirSize(fullPath);
                    } else {
                        const stats = await fs.stat(fullPath);
                        totalSize += stats.size;
                    }
                }
                return totalSize;
            };

            const totalSize = await calculateDirSize(staticDir);
            const sizeInMB = (totalSize / (1024 * 1024)).toFixed(2);

            if (totalSize < 5 * 1024 * 1024) { // Less than 5MB
                this.log(`✅ Bundle size: ${sizeInMB} MB (Excellent)`, 'green');
                this.results.passed++;
            } else if (totalSize < 10 * 1024 * 1024) { // Less than 10MB
                this.log(`⚠️ Bundle size: ${sizeInMB} MB (Good)`, 'yellow');
                this.results.warnings++;
            } else {
                this.log(`❌ Bundle size: ${sizeInMB} MB (Too large)`, 'red');
                this.results.failed++;
            }
        } catch (error) {
            this.log(`❌ Bundle size analysis failed: ${error.message}`, 'red');
            this.results.failed++;
        }
    }

    async validateServerResponse() {
        this.log('\n🌐 Testing Server Response...', 'cyan');

        return new Promise((resolve) => {
            const options = {
                hostname: 'localhost',
                port: 3003,
                path: '/',
                method: 'GET',
                timeout: 10000,
            };

            const req = http.request(options, (res) => {
                if (res.statusCode === 200) {
                    this.log(`✅ Server responding with status ${res.statusCode}`, 'green');
                    this.results.passed++;
                } else {
                    this.log(`⚠️ Server responding with status ${res.statusCode}`, 'yellow');
                    this.results.warnings++;
                }
                resolve();
            });

            req.on('error', (error) => {
                this.log(`❌ Server test failed: ${error.message}`, 'red');
                this.results.failed++;
                resolve();
            });

            req.on('timeout', () => {
                this.log(`❌ Server response timeout`, 'red');
                this.results.failed++;
                req.destroy();
                resolve();
            });

            req.end();
        });
    }

    async validateDependencies() {
        this.log('\n📚 Validating Dependencies...', 'cyan');

        try {
            const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
            const dependencies = Object.keys(packageJson.dependencies || {});
            const devDependencies = Object.keys(packageJson.devDependencies || {});

            this.log(`✅ Production dependencies: ${dependencies.length}`, 'green');
            this.log(`✅ Development dependencies: ${devDependencies.length}`, 'green');

            // Check for critical dependencies
            const criticalDeps = ['next', 'react', 'react-dom'];
            for (const dep of criticalDeps) {
                if (dependencies.includes(dep)) {
                    this.log(`✅ Critical dependency ${dep} present`, 'green');
                    this.results.passed++;
                } else {
                    this.log(`❌ Critical dependency ${dep} missing`, 'red');
                    this.results.failed++;
                }
            }
        } catch (error) {
            this.log(`❌ Dependency validation failed: ${error.message}`, 'red');
            this.results.failed++;
        }
    }

    async validateSecurity() {
        this.log('\n🔒 Security Validation...', 'cyan');

        try {
            // Check for environment files that shouldn't be in production
            const sensitiveFiles = ['.env.local', '.env.development'];

            for (const file of sensitiveFiles) {
                try {
                    await fs.access(file);
                    this.log(`⚠️ Sensitive file ${file} present`, 'yellow');
                    this.results.warnings++;
                } catch {
                    this.log(`✅ Sensitive file ${file} not in production`, 'green');
                    this.results.passed++;
                }
            }

            // Check Next.js config for security headers
            const nextConfigContent = await fs.readFile('next.config.js', 'utf8');
            if (nextConfigContent.includes('X-Frame-Options')) {
                this.log(`✅ Security headers configured`, 'green');
                this.results.passed++;
            } else {
                this.log(`⚠️ Security headers not found`, 'yellow');
                this.results.warnings++;
            }

        } catch (error) {
            this.log(`❌ Security validation failed: ${error.message}`, 'red');
            this.results.failed++;
        }
    }

    async runAllValidations() {
        this.log('🚀 TimeVault Production Validation Starting...', 'bright');
        this.log('=' * 50, 'cyan');

        await this.validateBuildArtifacts();
        await this.validateEnvironmentConfig();
        await this.validateBundleSize();
        await this.validateDependencies();
        await this.validateSecurity();

        // Only test server if it might be running
        if (process.env.TEST_SERVER === 'true') {
            await this.validateServerResponse();
        }

        this.displayResults();
    }

    displayResults() {
        this.log('\n📊 VALIDATION RESULTS', 'bright');
        this.log('=' * 30, 'cyan');
        this.log(`✅ Passed: ${this.results.passed}`, 'green');
        this.log(`⚠️ Warnings: ${this.results.warnings}`, 'yellow');
        this.log(`❌ Failed: ${this.results.failed}`, 'red');

        const total = this.results.passed + this.results.warnings + this.results.failed;
        const successRate = ((this.results.passed / total) * 100).toFixed(1);

        this.log(`\n📈 Success Rate: ${successRate}%`, 'cyan');

        if (this.results.failed === 0) {
            this.log('\n🎉 PRODUCTION READY! ✨', 'green');
            this.log('TimeVault is ready for deployment to timevaultai.com', 'green');
        } else {
            this.log('\n⚠️ ISSUES DETECTED', 'yellow');
            this.log('Please fix the failed validations before deployment', 'yellow');
        }

        this.log('\n🚀 Next Steps:', 'cyan');
        this.log('1. Fix any failed validations', 'reset');
        this.log('2. Run: npm run production', 'reset');
        this.log('3. Deploy to timevaultai.com', 'reset');
        this.log('4. Configure domain and SSL', 'reset');
    }
}

// Run validation if this file is executed directly
if (require.main === module) {
    const validator = new ProductionValidator();
    validator.runAllValidations().catch(console.error);
}

module.exports = ProductionValidator;
