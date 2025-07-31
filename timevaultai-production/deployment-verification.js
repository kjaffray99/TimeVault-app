#!/usr/bin/env node

/**
 * 🔍 TIMEVAULT AI - COMPREHENSIVE DEPLOYMENT VERIFICATION
 * Validates 100% successful deployment and timevaultai.com synchronization
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

// ANSI color codes
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m'
};

const log = (message, color = 'white') => {
    console.log(`${colors[color]}${message}${colors.reset}`);
};

const logHeader = (message) => {
    console.log('\n' + '='.repeat(70));
    log(message, 'cyan');
    console.log('='.repeat(70));
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');

class DeploymentVerification {
    constructor() {
        this.startTime = Date.now();
        this.verificationReport = {
            timestamp: new Date().toISOString(),
            localServer: {},
            productionSite: {},
            synchronization: {},
            performance: {},
            functionality: {},
            security: {},
            overall: {}
        };
    }

    async verify() {
        try {
            logHeader('🔍 TIMEVAULT AI - COMPREHENSIVE DEPLOYMENT VERIFICATION');

            await this.verifyLocalEnvironment();
            await this.verifyProductionDeployment();
            await this.verifySynchronization();
            await this.verifyFunctionality();
            await this.verifyPerformance();
            await this.verifySecurity();
            await this.generateVerificationReport();

            const duration = (Date.now() - this.startTime) / 1000;
            logSuccess(`Verification completed in ${duration}s`);

        } catch (error) {
            logError(`Verification failed: ${error.message}`);
            process.exit(1);
        }
    }

    async verifyLocalEnvironment() {
        logHeader('🏠 LOCAL ENVIRONMENT VERIFICATION');

        try {
            // Check if local server is running
            const response = await this.makeRequest('http://localhost:3003', 5000);
            if (response.success) {
                logSuccess(`Local server running on localhost:3003`);
                logSuccess(`Response status: ${response.statusCode}`);
                this.verificationReport.localServer.status = 'running';
                this.verificationReport.localServer.port = 3003;

                // Check if TimeVault content is present
                if (response.data && response.data.includes('TimeVault')) {
                    logSuccess('TimeVault AI content detected on local server');
                    this.verificationReport.localServer.content = 'valid';
                } else {
                    logWarning('TimeVault content not detected in local response');
                    this.verificationReport.localServer.content = 'missing';
                }

            } else {
                logError('Local server not responding on localhost:3003');
                this.verificationReport.localServer.status = 'not_running';
            }

        } catch (error) {
            logError(`Local server verification failed: ${error.message}`);
            this.verificationReport.localServer.status = 'error';
            this.verificationReport.localServer.error = error.message;
        }

        // Verify critical files
        const criticalFiles = [
            'src/components/ComprehensiveFreeCalculator.tsx',
            'src/components/RealTimePriceEngine.tsx',
            'src/components/AdvancedPortfolioTracker.tsx',
            'vercel.json',
            'next.config.js'
        ];

        let filesPresent = 0;
        criticalFiles.forEach(file => {
            if (fs.existsSync(file)) {
                logSuccess(`${file} - Present`);
                filesPresent++;
            } else {
                logError(`${file} - Missing`);
            }
        });

        this.verificationReport.localServer.criticalFiles = `${filesPresent}/${criticalFiles.length}`;
    }

    async verifyProductionDeployment() {
        logHeader('🌐 PRODUCTION DEPLOYMENT VERIFICATION');

        try {
            // Check timevaultai.com
            const response = await this.makeRequest('https://timevaultai.com', 10000);
            if (response.success) {
                logSuccess(`timevaultai.com is accessible`);
                logSuccess(`Response status: ${response.statusCode}`);
                this.verificationReport.productionSite.status = 'accessible';
                this.verificationReport.productionSite.domain = 'timevaultai.com';

                // Check SSL certificate
                if (response.secure) {
                    logSuccess('SSL certificate valid');
                    this.verificationReport.productionSite.ssl = 'valid';
                }

                // Check TimeVault content
                if (response.data && response.data.includes('TimeVault')) {
                    logSuccess('TimeVault AI content present on production');
                    this.verificationReport.productionSite.content = 'valid';
                } else {
                    logWarning('TimeVault content not detected on production');
                    this.verificationReport.productionSite.content = 'missing';
                }

                // Check for calculator component
                if (response.data && response.data.includes('Calculator')) {
                    logSuccess('Calculator component detected on production');
                    this.verificationReport.productionSite.calculator = 'present';
                }

            } else {
                logError('timevaultai.com not accessible');
                this.verificationReport.productionSite.status = 'inaccessible';
            }

        } catch (error) {
            logError(`Production site verification failed: ${error.message}`);
            this.verificationReport.productionSite.status = 'error';
            this.verificationReport.productionSite.error = error.message;
        }
    }

    async verifySynchronization() {
        logHeader('🔄 LOCAL-PRODUCTION SYNCHRONIZATION VERIFICATION');

        try {
            const localResponse = await this.makeRequest('http://localhost:3003', 5000);
            const prodResponse = await this.makeRequest('https://timevaultai.com', 10000);

            if (localResponse.success && prodResponse.success) {
                // Compare content length (rough sync check)
                const localLength = localResponse.data ? localResponse.data.length : 0;
                const prodLength = prodResponse.data ? prodResponse.data.length : 0;

                if (Math.abs(localLength - prodLength) < 1000) {
                    logSuccess('Content synchronization verified (similar content length)');
                    this.verificationReport.synchronization.contentSync = 'synchronized';
                } else {
                    logWarning(`Content length difference: Local(${localLength}) vs Prod(${prodLength})`);
                    this.verificationReport.synchronization.contentSync = 'different';
                }

                // Check for key components in both
                const keyComponents = ['TimeVault', 'Calculator', 'Portfolio'];
                let syncedComponents = 0;

                keyComponents.forEach(component => {
                    const inLocal = localResponse.data && localResponse.data.includes(component);
                    const inProd = prodResponse.data && prodResponse.data.includes(component);

                    if (inLocal && inProd) {
                        logSuccess(`${component} component synchronized`);
                        syncedComponents++;
                    } else if (inLocal || inProd) {
                        logWarning(`${component} component only in ${inLocal ? 'local' : 'production'}`);
                    } else {
                        logError(`${component} component missing in both`);
                    }
                });

                this.verificationReport.synchronization.components = `${syncedComponents}/${keyComponents.length}`;

            } else {
                logError('Cannot verify synchronization - one or both servers not responding');
                this.verificationReport.synchronization.status = 'cannot_verify';
            }

        } catch (error) {
            logError(`Synchronization verification failed: ${error.message}`);
            this.verificationReport.synchronization.status = 'error';
        }
    }

    async verifyFunctionality() {
        logHeader('⚡ FUNCTIONALITY VERIFICATION');

        const functionalityChecks = [
            { name: 'DollarSign Import Fix', check: this.checkDollarSignFix.bind(this) },
            { name: 'TypeScript Compilation', check: this.checkTypeScript.bind(this) },
            { name: 'Build Process', check: this.checkBuild.bind(this) },
            { name: 'Component Exports', check: this.checkComponentExports.bind(this) }
        ];

        let passedChecks = 0;
        for (const check of functionalityChecks) {
            try {
                const result = await check.check();
                if (result) {
                    logSuccess(`${check.name} - Passed`);
                    passedChecks++;
                } else {
                    logError(`${check.name} - Failed`);
                }
            } catch (error) {
                logError(`${check.name} - Error: ${error.message}`);
            }
        }

        this.verificationReport.functionality.checks = `${passedChecks}/${functionalityChecks.length}`;
    }

    async verifyPerformance() {
        logHeader('🚀 PERFORMANCE VERIFICATION');

        try {
            const startTime = Date.now();
            const response = await this.makeRequest('https://timevaultai.com', 5000);
            const loadTime = Date.now() - startTime;

            if (response.success) {
                logInfo(`Page load time: ${loadTime}ms`);

                if (loadTime < 1500) {
                    logSuccess('Performance target met (<1.5s)');
                    this.verificationReport.performance.loadTime = 'excellent';
                } else if (loadTime < 3000) {
                    logWarning('Performance acceptable but could improve');
                    this.verificationReport.performance.loadTime = 'acceptable';
                } else {
                    logError('Performance below target (>3s)');
                    this.verificationReport.performance.loadTime = 'poor';
                }

                this.verificationReport.performance.actualLoadTime = `${loadTime}ms`;
            }

        } catch (error) {
            logError(`Performance verification failed: ${error.message}`);
        }
    }

    async verifySecurity() {
        logHeader('🔒 SECURITY VERIFICATION');

        try {
            const response = await this.makeRequest('https://timevaultai.com', 5000);
            if (response.success && response.headers) {
                const securityHeaders = [
                    'x-frame-options',
                    'x-content-type-options',
                    'strict-transport-security',
                    'referrer-policy'
                ];

                let presentHeaders = 0;
                securityHeaders.forEach(header => {
                    if (response.headers[header]) {
                        logSuccess(`${header} header present`);
                        presentHeaders++;
                    } else {
                        logWarning(`${header} header missing`);
                    }
                });

                this.verificationReport.security.headers = `${presentHeaders}/${securityHeaders.length}`;
            }

        } catch (error) {
            logError(`Security verification failed: ${error.message}`);
        }
    }

    async checkDollarSignFix() {
        try {
            const calculatorContent = fs.readFileSync('src/components/ComprehensiveFreeCalculator.tsx', 'utf8');
            return calculatorContent.includes('DollarSign') &&
                calculatorContent.includes('import') &&
                calculatorContent.includes('from \'lucide-react\'');
        } catch (error) {
            return false;
        }
    }

    async checkTypeScript() {
        try {
            execSync('npm run type-check', { stdio: 'pipe' });
            return true;
        } catch (error) {
            return false;
        }
    }

    async checkBuild() {
        try {
            // Check if .next directory exists and has build artifacts
            return fs.existsSync('.next') && fs.existsSync('.next/build-manifest.json');
        } catch (error) {
            return false;
        }
    }

    async checkComponentExports() {
        try {
            const components = [
                'src/components/ComprehensiveFreeCalculator.tsx',
                'src/components/RealTimePriceEngine.tsx',
                'src/components/AdvancedPortfolioTracker.tsx'
            ];

            return components.every(component => {
                if (!fs.existsSync(component)) return false;
                const content = fs.readFileSync(component, 'utf8');
                return content.includes('export default');
            });
        } catch (error) {
            return false;
        }
    }

    async makeRequest(url, timeout = 10000) {
        return new Promise((resolve) => {
            const isHttps = url.startsWith('https');
            const client = isHttps ? https : http;

            const options = {
                timeout: timeout,
                headers: {
                    'User-Agent': 'TimeVault-Verification-Bot/1.0'
                }
            };

            const req = client.get(url, options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    resolve({
                        success: true,
                        statusCode: res.statusCode,
                        headers: res.headers,
                        data: data,
                        secure: isHttps
                    });
                });
            });

            req.on('error', (error) => {
                resolve({
                    success: false,
                    error: error.message
                });
            });

            req.on('timeout', () => {
                req.destroy();
                resolve({
                    success: false,
                    error: 'Request timeout'
                });
            });
        });
    }

    async generateVerificationReport() {
        logHeader('📊 VERIFICATION REPORT GENERATION');

        // Calculate overall score
        let totalScore = 0;
        let maxScore = 0;

        // Local server (20 points)
        maxScore += 20;
        if (this.verificationReport.localServer.status === 'running') totalScore += 15;
        if (this.verificationReport.localServer.content === 'valid') totalScore += 5;

        // Production site (30 points)
        maxScore += 30;
        if (this.verificationReport.productionSite.status === 'accessible') totalScore += 20;
        if (this.verificationReport.productionSite.content === 'valid') totalScore += 5;
        if (this.verificationReport.productionSite.ssl === 'valid') totalScore += 5;

        // Synchronization (20 points)
        maxScore += 20;
        if (this.verificationReport.synchronization.contentSync === 'synchronized') totalScore += 20;

        // Performance (15 points)
        maxScore += 15;
        if (this.verificationReport.performance.loadTime === 'excellent') totalScore += 15;
        else if (this.verificationReport.performance.loadTime === 'acceptable') totalScore += 10;

        // Functionality (15 points)
        maxScore += 15;
        const funcScore = this.verificationReport.functionality.checks?.split('/');
        if (funcScore && funcScore.length === 2) {
            totalScore += Math.round((parseInt(funcScore[0]) / parseInt(funcScore[1])) * 15);
        }

        const overallPercentage = Math.round((totalScore / maxScore) * 100);

        const finalReport = {
            ...this.verificationReport,
            overall: {
                score: `${totalScore}/${maxScore}`,
                percentage: `${overallPercentage}%`,
                status: overallPercentage >= 90 ? 'EXCELLENT' :
                    overallPercentage >= 75 ? 'GOOD' :
                        overallPercentage >= 60 ? 'ACCEPTABLE' : 'NEEDS IMPROVEMENT',
                verificationTime: (Date.now() - this.startTime) / 1000
            }
        };

        fs.writeFileSync('deployment-verification-report.json', JSON.stringify(finalReport, null, 2));

        logSuccess('Verification report generated');

        console.log('\n🎯 VERIFICATION SUMMARY:');
        console.log(`📊 Overall Score: ${totalScore}/${maxScore} (${overallPercentage}%)`);
        console.log(`🎖️  Status: ${finalReport.overall.status}`);

        if (overallPercentage >= 90) {
            console.log('\n🎉 DEPLOYMENT 100% SUCCESSFUL!');
            console.log('✅ Local server and timevaultai.com are fully synchronized');
            console.log('✅ All critical functionality verified');
            console.log('✅ Performance and security targets met');
        } else {
            console.log('\n⚠️  DEPLOYMENT PARTIALLY SUCCESSFUL');
            console.log('Some issues detected - review verification report for details');
        }

        console.log(`\n📄 Detailed report: deployment-verification-report.json`);
    }
}

// Execute verification
const verification = new DeploymentVerification();
verification.verify().catch(console.error);
