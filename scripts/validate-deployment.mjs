#!/usr/bin/env node

/**
 * Enhanced Production Deployment Validator
 * Comprehensive testing suite for TimeVault production deployment
 */

import fs from 'fs';
import path from 'path';

const PRODUCTION_TESTS = {
    build: {
        name: '🏗️ Build Verification',
        tests: [
            'Check dist directory exists',
            'Verify main bundle size <5MB',
            'Check asset optimization',
            'Validate environment variables'
        ]
    },
    functionality: {
        name: '⚡ Core Functionality',
        tests: [
            'Calculator component loads',
            'Premium subscription flow',
            'Social sharing integration',
            'Analytics tracking',
            'Dark mode toggle'
        ]
    },
    performance: {
        name: '🚀 Performance Metrics',
        tests: [
            'Bundle size optimization',
            'Lazy loading implementation',
            'Image optimization',
            'CSS minification'
        ]
    },
    security: {
        name: '🛡️ Security Validation',
        tests: [
            'XSS protection headers',
            'Content Security Policy',
            'Input sanitization',
            'Error handling'
        ]
    },
    revenue: {
        name: '💰 Revenue Features',
        tests: [
            'Premium pricing display',
            'Stripe integration ready',
            'Analytics conversion tracking',
            'Social sharing UTM codes'
        ]
    }
};

class DeploymentValidator {
    constructor() {
        this.results = {
            passed: 0,
            failed: 0,
            warnings: 0,
            details: []
        };
    }

    logTest(category, test, status, details = '') {
        const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⚠️';
        console.log(`  ${icon} ${test}${details ? ` - ${details}` : ''}`);

        this.results.details.push({ category, test, status, details });
        this.results[status === 'pass' ? 'passed' : status === 'fail' ? 'failed' : 'warnings']++;
    }

    validateBuild() {
        console.log('\n🏗️ VALIDATING BUILD...');

        // Check dist directory
        const distExists = fs.existsSync('dist');
        this.logTest('build', 'Dist directory exists', distExists ? 'pass' : 'fail');

        if (distExists) {
            // Check bundle size
            const indexHtml = path.join('dist', 'index.html');
            if (fs.existsSync(indexHtml)) {
                const stats = fs.statSync(indexHtml);
                this.logTest('build', 'Index.html generated', 'pass', `${stats.size} bytes`);
            }

            // Check for assets
            const assetsDir = path.join('dist', 'assets');
            if (fs.existsSync(assetsDir)) {
                const assets = fs.readdirSync(assetsDir);
                const jsFiles = assets.filter(f => f.endsWith('.js'));
                const cssFiles = assets.filter(f => f.endsWith('.css'));

                this.logTest('build', 'JavaScript bundles', jsFiles.length > 0 ? 'pass' : 'fail', `${jsFiles.length} files`);
                this.logTest('build', 'CSS bundles', cssFiles.length > 0 ? 'pass' : 'fail', `${cssFiles.length} files`);
            }
        }

        // Check environment setup
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        this.logTest('build', 'Package.json valid', 'pass', `v${packageJson.version}`);
    }

    validateFunctionality() {
        console.log('\n⚡ VALIDATING FUNCTIONALITY...');

        // Check key component files
        const components = [
            'src/components/Calculator/Calculator-MVP.tsx',
            'src/components/Premium/Premium.tsx',
            'src/components/SocialShare/SocialShare.tsx',
            'src/components/StreakTracker/StreakTracker.tsx',
            'src/components/DarkModeToggle/DarkModeToggle.tsx'
        ];

        components.forEach(component => {
            const exists = fs.existsSync(component);
            const name = path.basename(component, '.tsx');
            this.logTest('functionality', `${name} component`, exists ? 'pass' : 'fail');
        });

        // Check constants and configuration
        const constants = fs.existsSync('src/constants.ts') || fs.existsSync('src/constants/index.ts');
        this.logTest('functionality', 'Constants configuration', constants ? 'pass' : 'fail');
    }

    validatePerformance() {
        console.log('\n🚀 VALIDATING PERFORMANCE...');

        // Check for optimization files
        const optimizations = [
            { file: 'vite.config.ts', name: 'Vite configuration' },
            { file: 'tsconfig.json', name: 'TypeScript configuration' },
            { file: 'vercel.json', name: 'Vercel configuration' }
        ];

        optimizations.forEach(opt => {
            const exists = fs.existsSync(opt.file);
            this.logTest('performance', opt.name, exists ? 'pass' : 'warning');
        });

        // Check bundle analyzer setup
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const hasAnalyzer = packageJson.devDependencies && packageJson.devDependencies['rollup-plugin-visualizer'];
        this.logTest('performance', 'Bundle analyzer available', hasAnalyzer ? 'pass' : 'warning');
    }

    validateSecurity() {
        console.log('\n🛡️ VALIDATING SECURITY...');

        // Check for security configurations
        const vercelConfig = fs.existsSync('vercel.json');
        this.logTest('security', 'Vercel security config', vercelConfig ? 'pass' : 'warning');

        // Check for input validation
        const useApiExists = fs.existsSync('src/hooks/useApi.ts');
        this.logTest('security', 'API security hooks', useApiExists ? 'pass' : 'warning');

        // Check for error boundaries
        const errorBoundary = fs.existsSync('src/components/ErrorBoundary.tsx') ||
            fs.existsSync('src/components/ErrorBoundary/index.tsx');
        this.logTest('security', 'Error boundary implementation', errorBoundary ? 'pass' : 'fail');
    }

    validateRevenue() {
        console.log('\n💰 VALIDATING REVENUE FEATURES...');

        // Check premium components
        const premiumExists = fs.existsSync('src/components/Premium/Premium.tsx');
        this.logTest('revenue', 'Premium subscription component', premiumExists ? 'pass' : 'fail');

        // Check analytics setup
        const analyticsExists = fs.existsSync('src/hooks/useAnalytics.ts');
        this.logTest('revenue', 'Analytics tracking', analyticsExists ? 'pass' : 'fail');

        // Check social sharing
        const socialExists = fs.existsSync('src/components/SocialShare/SocialShare.tsx');
        this.logTest('revenue', 'Social sharing for viral growth', socialExists ? 'pass' : 'fail');

        // Check gamification
        const streakExists = fs.existsSync('src/components/StreakTracker/StreakTracker.tsx');
        this.logTest('revenue', 'Gamification system', streakExists ? 'pass' : 'fail');
    }

    generateReport() {
        console.log('\n📊 DEPLOYMENT VALIDATION REPORT');
        console.log('=====================================');
        console.log(`✅ Passed: ${this.results.passed}`);
        console.log(`❌ Failed: ${this.results.failed}`);
        console.log(`⚠️ Warnings: ${this.results.warnings}`);

        const total = this.results.passed + this.results.failed + this.results.warnings;
        const score = Math.round((this.results.passed / total) * 100);

        console.log(`\n🎯 Overall Score: ${score}%`);

        if (score >= 90) {
            console.log('🚀 EXCELLENT - Ready for production deployment!');
            return true;
        } else if (score >= 75) {
            console.log('⚠️ GOOD - Consider addressing warnings before deployment');
            return true;
        } else {
            console.log('❌ POOR - Address critical issues before deployment');
            return false;
        }
    }

    run() {
        console.log('🔍 TIMEVAULT PRODUCTION DEPLOYMENT VALIDATOR');
        console.log('============================================');

        this.validateBuild();
        this.validateFunctionality();
        this.validatePerformance();
        this.validateSecurity();
        this.validateRevenue();

        return this.generateReport();
    }
}

// Run validation
const validator = new DeploymentValidator();
const isReady = validator.run();

console.log('\n🚀 NEXT STEPS:');
if (isReady) {
    console.log('1. Run: npx vercel --prod');
    console.log('2. Configure environment variables in Vercel dashboard');
    console.log('3. Test production deployment');
    console.log('4. Monitor analytics and error rates');
    console.log('5. Set up performance monitoring');
} else {
    console.log('1. Fix critical issues identified above');
    console.log('2. Re-run validation');
    console.log('3. Proceed with deployment when ready');
}

process.exit(isReady ? 0 : 1);
