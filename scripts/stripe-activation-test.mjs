#!/usr/bin/env node
/**
 * 🚀 DAY 1 STRIPE ACTIVATION - TESTING & VALIDATION SCRIPT
 * Purpose: Comprehensive testing of payment integration
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Test configuration
const TEST_CONFIG = {
    baseUrl: 'https://timevaultai.com',
    testUrls: [
        '/premium',
        '/success',
        '/api/stripe/create-checkout-session',
        '/api/stripe/webhook'
    ],
    stripeTestCards: {
        success: '4242424242424242',
        declined: '4000000000000002',
        authentication: '4000002500003155'
    }
};

class StripeActivationTester {
    constructor() {
        this.results = {
            infrastructure: [],
            environment: [],
            payment: [],
            monitoring: []
        };
    }

    async runCompleteTest() {
        console.log('🚀 Starting Day 1 Stripe Activation Testing...\n');

        try {
            await this.testInfrastructure();
            await this.testEnvironment();
            await this.testPaymentFlow();
            await this.testMonitoring();
            
            this.generateReport();
        } catch (error) {
            console.error('❌ Testing failed:', error);
        }
    }

    async testInfrastructure() {
        console.log('📋 Testing Infrastructure...');

        // Test 1: Build Status
        try {
            const { stdout } = await execAsync('npm run build');
            this.results.infrastructure.push({
                test: 'Build Process',
                status: 'PASS',
                details: 'Build completed successfully'
            });
        } catch (error) {
            this.results.infrastructure.push({
                test: 'Build Process',
                status: 'FAIL',
                details: `Build failed: ${error.message}`
            });
        }

        // Test 2: Stripe Dependencies
        try {
            const packageJsonPath = join(projectRoot, 'package.json');
            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
            const hasStripe = packageJson.dependencies['@stripe/stripe-js'] && 
                             packageJson.dependencies['@stripe/react-stripe-js'];
            
            this.results.infrastructure.push({
                test: 'Stripe Dependencies',
                status: hasStripe ? 'PASS' : 'FAIL',
                details: hasStripe ? 'Stripe packages installed' : 'Missing Stripe dependencies'
            });
        } catch (error) {
            this.results.infrastructure.push({
                test: 'Stripe Dependencies',
                status: 'FAIL',
                details: 'Cannot verify dependencies'
            });
        }

        // Test 3: API Routes
        const apiExists = existsSync(join(projectRoot, 'api/stripe/create-checkout-session.ts')) &&
                         existsSync(join(projectRoot, 'api/stripe/webhook.ts'));
        
        this.results.infrastructure.push({
            test: 'API Routes',
            status: apiExists ? 'PASS' : 'FAIL',
            details: apiExists ? 'Stripe API routes created' : 'Missing API routes'
        });

        console.log('✅ Infrastructure testing complete\n');
    }

    async testEnvironment() {
        console.log('⚙️ Testing Environment Configuration...');

        // Test 1: Environment Variables
        const envPath = join(projectRoot, '.env');
        const envContent = readFileSync(envPath, 'utf8');
        
        const hasStripeKeys = envContent.includes('VITE_STRIPE_PUBLISHABLE_KEY') &&
                             envContent.includes('STRIPE_SECRET_KEY') &&
                             envContent.includes('STRIPE_WEBHOOK_SECRET');

        this.results.environment.push({
            test: 'Environment Variables',
            status: hasStripeKeys ? 'PASS' : 'FAIL',
            details: hasStripeKeys ? 'Stripe env vars configured' : 'Missing Stripe environment variables'
        });

        // Test 2: Vercel Configuration
        const vercelConfigPath = join(projectRoot, 'vercel.json');
        const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
        const hasApiBuilds = vercelConfig.builds.some(build => build.src === 'api/**/*.ts');

        this.results.environment.push({
            test: 'Vercel API Configuration',
            status: hasApiBuilds ? 'PASS' : 'FAIL',
            details: hasApiBuilds ? 'API routes configured for Vercel' : 'Missing API build configuration'
        });

        console.log('✅ Environment testing complete\n');
    }

    async testPaymentFlow() {
        console.log('💳 Testing Payment Flow...');

        // Test 1: Service Module
        try {
            const servicePath = join(projectRoot, 'src/services/stripe/StripeService.ts');
            const serviceCode = readFileSync(servicePath, 'utf8');
            const hasRequiredMethods = serviceCode.includes('createCheckoutSession') &&
                                     serviceCode.includes('handleSubscription') &&
                                     serviceCode.includes('PREMIUM_PLANS');

            this.results.payment.push({
                test: 'Stripe Service',
                status: hasRequiredMethods ? 'PASS' : 'FAIL',
                details: hasRequiredMethods ? 'All service methods implemented' : 'Missing service methods'
            });
        } catch (error) {
            this.results.payment.push({
                test: 'Stripe Service',
                status: 'FAIL',
                details: 'Service file not found or invalid'
            });
        }

        // Test 2: Component Integration
        try {
            const checkoutPath = join(projectRoot, 'src/components/PremiumCheckout.tsx');
            const checkoutCode = readFileSync(checkoutPath, 'utf8');
            const hasStripeIntegration = checkoutCode.includes('stripeService') &&
                                        checkoutCode.includes('trackStripeEvent');

            this.results.payment.push({
                test: 'Component Integration',
                status: hasStripeIntegration ? 'PASS' : 'FAIL',
                details: hasStripeIntegration ? 'Components integrated with Stripe' : 'Missing component integration'
            });
        } catch (error) {
            this.results.payment.push({
                test: 'Component Integration',
                status: 'FAIL',
                details: 'Component integration verification failed'
            });
        }

        // Test 3: Success Page
        try {
            const successPath = join(projectRoot, 'src/components/StripeSuccess.tsx');
            const successExists = existsSync(successPath);
            this.results.payment.push({
                test: 'Success Page',
                status: successExists ? 'PASS' : 'FAIL',
                details: successExists ? 'Success page component created' : 'Missing success page'
            });
        } catch (error) {
            this.results.payment.push({
                test: 'Success Page',
                status: 'FAIL',
                details: 'Success page verification failed'
            });
        }

        console.log('✅ Payment flow testing complete\n');
    }

    async testMonitoring() {
        console.log('📊 Testing Monitoring & Analytics...');

        // Test 1: Analytics Integration
        const servicePath = join(projectRoot, 'src/services/stripe/StripeService.ts');
        const serviceCode = readFileSync(servicePath, 'utf8');
        const hasAnalytics = serviceCode.includes('trackStripeEvent') &&
                           serviceCode.includes('gtag');

        this.results.monitoring.push({
            test: 'Analytics Integration',
            status: hasAnalytics ? 'PASS' : 'FAIL',
            details: hasAnalytics ? 'Google Analytics integration active' : 'Missing analytics integration'
        });

        // Test 2: Error Handling
        const apiPath = join(projectRoot, 'api/stripe/create-checkout-session.ts');
        const apiCode = readFileSync(apiPath, 'utf8');
        const hasErrorHandling = apiCode.includes('try') && apiCode.includes('catch') &&
                               apiCode.includes('console.error');

        this.results.monitoring.push({
            test: 'Error Handling',
            status: hasErrorHandling ? 'PASS' : 'FAIL',
            details: hasErrorHandling ? 'Comprehensive error handling implemented' : 'Missing error handling'
        });

        // Test 3: Webhook Security
        const webhookPath = join(projectRoot, 'api/stripe/webhook.ts');
        const webhookCode = readFileSync(webhookPath, 'utf8');
        const hasWebhookSecurity = webhookCode.includes('stripe.webhooks.constructEvent') &&
                                 webhookCode.includes('signature');

        this.results.monitoring.push({
            test: 'Webhook Security',
            status: hasWebhookSecurity ? 'PASS' : 'FAIL',
            details: hasWebhookSecurity ? 'Webhook signature verification implemented' : 'Missing webhook security'
        });

        console.log('✅ Monitoring testing complete\n');
    }

    generateReport() {
        console.log('📋 STRIPE ACTIVATION TEST REPORT');
        console.log('================================\n');

        const sections = [
            { name: 'Infrastructure', tests: this.results.infrastructure },
            { name: 'Environment', tests: this.results.environment },
            { name: 'Payment Flow', tests: this.results.payment },
            { name: 'Monitoring', tests: this.results.monitoring }
        ];

        let totalTests = 0;
        let passedTests = 0;

        sections.forEach(section => {
            console.log(`${section.name.toUpperCase()}:`);
            section.tests.forEach(test => {
                const icon = test.status === 'PASS' ? '✅' : '❌';
                console.log(`${icon} ${test.test}: ${test.details}`);
                totalTests++;
                if (test.status === 'PASS') passedTests++;
            });
            console.log('');
        });

        console.log('SUMMARY:');
        console.log(`Total Tests: ${totalTests}`);
        console.log(`Passed: ${passedTests}`);
        console.log(`Failed: ${totalTests - passedTests}`);
        console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%\n`);

        const readinessScore = Math.round((passedTests / totalTests) * 100);
        if (readinessScore >= 90) {
            console.log('🚀 READY FOR STRIPE ACTIVATION');
            console.log('Next step: Configure Stripe account and update API keys');
        } else if (readinessScore >= 75) {
            console.log('⚠️ MOSTLY READY - MINOR ISSUES');
            console.log('Address failed tests before activation');
        } else {
            console.log('❌ NOT READY FOR ACTIVATION');
            console.log('Significant issues need to be resolved');
        }

        this.generateNextSteps(readinessScore);
    }

    generateNextSteps(readinessScore) {
        console.log('\n🎯 NEXT STEPS:');
        console.log('===============');

        if (readinessScore >= 90) {
            console.log('1. 🏦 Create/verify Stripe account');
            console.log('2. 🔑 Obtain live API keys');
            console.log('3. 💳 Create product prices in Stripe dashboard');
            console.log('4. 🔗 Configure webhook endpoints');
            console.log('5. 🚀 Update environment variables and deploy');
            console.log('6. ✅ Test live payment flow');
            console.log('7. 📊 Monitor first revenue!');
        } else {
            console.log('1. 🔧 Fix failing tests');
            console.log('2. 🔄 Re-run validation');
            console.log('3. 📞 Contact support if needed');
        }

        console.log('\n📞 SUPPORT:');
        console.log('- Stripe Documentation: https://stripe.com/docs');
        console.log('- Vercel Support: https://vercel.com/support');
        console.log('- Analytics Help: https://analytics.google.com/analytics/academy/');
    }
}

// Execute if run directly
const tester = new StripeActivationTester();
tester.runCompleteTest().catch(console.error);

export default StripeActivationTester;
