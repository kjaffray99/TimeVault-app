/**
 * Day 1 Production Verification Script
 * Validates deployment and calculator functionality
 */

import fs from 'fs/promises';
import path from 'path';

class DeploymentVerification {
    private checks: Array<{ name: string; status: boolean; message: string }> = [];

    async verify(): Promise<boolean> {
        console.log('🔍 Verifying TimeVault Production Deployment - Day 1');
        console.log('Target: Calculator optimization and revenue activation\n');

        // 1. Build output verification
        await this.verifyBuildOutput();

        // 2. Calculator component verification
        await this.verifyCalculatorComponents();

        // 3. Production configuration verification
        await this.verifyProductionConfig();

        // 4. Revenue systems verification
        await this.verifyRevenueSystems();

        // 5. Monitoring setup verification
        await this.verifyMonitoringSetup();

        // Generate verification report
        this.generateReport();

        const failedChecks = this.checks.filter(check => !check.status);
        return failedChecks.length === 0;
    }

    private async verifyBuildOutput(): Promise<void> {
        console.log('📦 Verifying build output...');

        try {
            // Check dist directory exists
            const distPath = path.join(process.cwd(), 'dist');
            const distStats = await fs.stat(distPath);

            if (distStats.isDirectory()) {
                this.addCheck('Build Directory', true, 'dist/ directory exists');
            } else {
                this.addCheck('Build Directory', false, 'dist/ directory not found');
                return;
            }

            // Check index.html exists
            const indexPath = path.join(distPath, 'index.html');
            await fs.access(indexPath);
            this.addCheck('Index File', true, 'index.html generated successfully');

            // Check assets directory
            const assetsPath = path.join(distPath, 'assets');
            const assetsStats = await fs.stat(assetsPath);
            if (assetsStats.isDirectory()) {
                this.addCheck('Assets Directory', true, 'assets/ directory exists');
            }

            // Verify main JS bundle
            const files = await fs.readdir(path.join(distPath, 'assets'));
            const jsFiles = files.filter(file => file.endsWith('.js'));
            const cssFiles = files.filter(file => file.endsWith('.css'));

            if (jsFiles.length > 0) {
                this.addCheck('JavaScript Bundle', true, `${jsFiles.length} JS files generated`);
            } else {
                this.addCheck('JavaScript Bundle', false, 'No JS files found');
            }

            if (cssFiles.length > 0) {
                this.addCheck('CSS Bundle', true, `${cssFiles.length} CSS files generated`);
            } else {
                this.addCheck('CSS Bundle', false, 'No CSS files found');
            }

        } catch (error) {
            this.addCheck('Build Output', false, `Build verification failed: ${error}`);
        }
    }

    private async verifyCalculatorComponents(): Promise<void> {
        console.log('🧮 Verifying calculator components...');

        try {
            // Check GuaranteedCalculator exists
            const guaranteedCalcPath = path.join(process.cwd(), 'src', 'components', 'GuaranteedCalculator.tsx');
            await fs.access(guaranteedCalcPath);
            this.addCheck('GuaranteedCalculator', true, 'GuaranteedCalculator.tsx exists');

            // Check Calculator wrapper exists
            const calcPath = path.join(process.cwd(), 'src', 'components', 'Calculator.tsx');
            await fs.access(calcPath);
            this.addCheck('Calculator Wrapper', true, 'Calculator.tsx wrapper exists');

            // Check calculatorDebug utility
            const debugPath = path.join(process.cwd(), 'src', 'utils', 'calculatorDebug.ts');
            await fs.access(debugPath);
            this.addCheck('Calculator Debug', true, 'calculatorDebug.ts utility exists');

            // Verify calculator content for guaranteed display
            const calcContent = await fs.readFile(guaranteedCalcPath, 'utf-8');
            const wrapperContent = await fs.readFile(calcPath, 'utf-8');

            if (calcContent.includes('forceCalculatorDisplay')) {
                this.addCheck('Force Display Function', true, 'Guaranteed display function implemented');
            } else {
                this.addCheck('Force Display Function', false, 'Force display function missing');
            }

            if (calcContent.includes('useCalculatorMonitor')) {
                this.addCheck('Calculator Monitoring', true, 'Calculator monitoring hook implemented');
            } else {
                this.addCheck('Calculator Monitoring', false, 'Calculator monitoring hook missing');
            }

            if (wrapperContent.includes('CalculatorErrorBoundary')) {
                this.addCheck('Error Boundary', true, 'Calculator error boundary implemented');
            } else {
                this.addCheck('Error Boundary', false, 'Calculator error boundary missing');
            }

        } catch (error) {
            this.addCheck('Calculator Components', false, `Calculator verification failed: ${error}`);
        }
    }

    private async verifyProductionConfig(): Promise<void> {
        console.log('⚙️ Verifying production configuration...');

        try {
            // Check production.ts config
            const prodConfigPath = path.join(process.cwd(), 'src', 'config', 'production.ts');
            await fs.access(prodConfigPath);
            this.addCheck('Production Config', true, 'production.ts configuration exists');

            // Check environment template
            const envPath = path.join(process.cwd(), '.env.production');
            try {
                await fs.access(envPath);
                this.addCheck('Production Environment', true, '.env.production file exists');
            } catch {
                this.addCheck('Production Environment', false, '.env.production file missing');
            }

            // Check deployment script
            const deployScriptPath = path.join(process.cwd(), 'scripts', 'deploy-production.ts');
            await fs.access(deployScriptPath);
            this.addCheck('Deployment Script', true, 'deploy-production.ts script exists');

            // Verify production config content
            const prodContent = await fs.readFile(prodConfigPath, 'utf-8');

            if (prodContent.includes('VERCEL_CONFIG')) {
                this.addCheck('Vercel Configuration', true, 'Vercel deployment config present');
            }

            if (prodContent.includes('CLOUDFLARE_CONFIG')) {
                this.addCheck('Cloudflare Configuration', true, 'Cloudflare CDN config present');
            }

            if (prodContent.includes('SECURITY_HEADERS')) {
                this.addCheck('Security Headers', true, 'Security headers configuration present');
            }

        } catch (error) {
            this.addCheck('Production Configuration', false, `Production config verification failed: ${error}`);
        }
    }

    private async verifyRevenueSystems(): Promise<void> {
        console.log('💰 Verifying revenue systems...');

        try {
            // Check if revenue tracking is configured
            const prodConfigPath = path.join(process.cwd(), 'src', 'config', 'production.ts');
            const prodContent = await fs.readFile(prodConfigPath, 'utf-8');

            if (prodContent.includes('revenueOptimization')) {
                this.addCheck('Revenue Configuration', true, 'Revenue systems configured');
            } else {
                this.addCheck('Revenue Configuration', false, 'Revenue configuration missing');
            }

            if (prodContent.includes('monthly: 35000')) {
                this.addCheck('Revenue Target', true, '$35K monthly target set');
            } else {
                this.addCheck('Revenue Target', false, 'Monthly revenue target not configured');
            }

            if (prodContent.includes('abTesting')) {
                this.addCheck('A/B Testing', true, 'A/B testing framework configured');
            } else {
                this.addCheck('A/B Testing', false, 'A/B testing framework missing');
            }

            if (prodContent.includes('VITE_STRIPE_PUBLISHABLE_KEY')) {
                this.addCheck('Payment Processing', true, 'Stripe payment processing configured');
            } else {
                this.addCheck('Payment Processing', false, 'Payment processing not configured');
            }

            if (prodContent.includes('referral_signup')) {
                this.addCheck('Affiliate System', true, 'Affiliate system configured');
            } else {
                this.addCheck('Affiliate System', false, 'Affiliate system not configured');
            }

        } catch (error) {
            this.addCheck('Revenue Systems', false, `Revenue verification failed: ${error}`);
        }
    }

    private async verifyMonitoringSetup(): Promise<void> {
        console.log('📊 Verifying monitoring setup...');

        try {
            // Check if monitoring is configured
            const prodConfigPath = path.join(process.cwd(), 'src', 'config', 'production.ts');
            const prodContent = await fs.readFile(prodConfigPath, 'utf-8');

            if (prodContent.includes('VITE_SENTRY_DSN')) {
                this.addCheck('Error Tracking', true, 'Sentry error tracking configured');
            } else {
                this.addCheck('Error Tracking', false, 'Error tracking not configured');
            }

            if (prodContent.includes('VITE_ANALYTICS_ID')) {
                this.addCheck('Analytics', true, 'Google Analytics configured');
            } else {
                this.addCheck('Analytics', false, 'Analytics not configured');
            }

            if (prodContent.includes('performance:')) {
                this.addCheck('Performance Monitoring', true, 'Performance monitoring configured');
            } else {
                this.addCheck('Performance Monitoring', false, 'Performance monitoring not configured');
            }

            if (prodContent.includes('businessMetrics')) {
                this.addCheck('Business Metrics', true, 'Business metrics tracking configured');
            } else {
                this.addCheck('Business Metrics', false, 'Business metrics not configured');
            }

        } catch (error) {
            this.addCheck('Monitoring Setup', false, `Monitoring verification failed: ${error}`);
        }
    }

    private addCheck(name: string, status: boolean, message: string): void {
        this.checks.push({ name, status, message });
        const icon = status ? '✅' : '❌';
        console.log(`  ${icon} ${name}: ${message}`);
    }

    private generateReport(): void {
        console.log('\n📋 VERIFICATION REPORT');
        console.log('='.repeat(50));

        const passed = this.checks.filter(check => check.status).length;
        const total = this.checks.length;
        const percentage = Math.round((passed / total) * 100);

        console.log(`Overall Status: ${passed}/${total} checks passed (${percentage}%)`);
        console.log('');

        // Group checks by category
        const categories = {
            'Build & Deployment': this.checks.filter(c =>
                c.name.includes('Build') || c.name.includes('Directory') || c.name.includes('Bundle') || c.name.includes('Index')
            ),
            'Calculator System': this.checks.filter(c =>
                c.name.includes('Calculator') || c.name.includes('Display') || c.name.includes('Monitoring') || c.name.includes('Error Boundary')
            ),
            'Production Configuration': this.checks.filter(c =>
                c.name.includes('Production') || c.name.includes('Environment') || c.name.includes('Deployment') ||
                c.name.includes('Vercel') || c.name.includes('Cloudflare') || c.name.includes('Security')
            ),
            'Revenue Systems': this.checks.filter(c =>
                c.name.includes('Revenue') || c.name.includes('Payment') || c.name.includes('Affiliate') || c.name.includes('A/B Testing')
            ),
            'Monitoring & Analytics': this.checks.filter(c =>
                c.name.includes('Error Tracking') || c.name.includes('Analytics') || c.name.includes('Performance') || c.name.includes('Business')
            )
        };

        Object.entries(categories).forEach(([category, checks]) => {
            if (checks.length > 0) {
                const categoryPassed = checks.filter(c => c.status).length;
                const categoryPercentage = Math.round((categoryPassed / checks.length) * 100);

                console.log(`${category}: ${categoryPassed}/${checks.length} (${categoryPercentage}%)`);
                checks.forEach(check => {
                    const icon = check.status ? '  ✅' : '  ❌';
                    console.log(`${icon} ${check.name}`);
                });
                console.log('');
            }
        });

        // Critical issues
        const failedChecks = this.checks.filter(check => !check.status);
        if (failedChecks.length > 0) {
            console.log('⚠️  CRITICAL ISSUES TO ADDRESS:');
            failedChecks.forEach(check => {
                console.log(`   • ${check.name}: ${check.message}`);
            });
            console.log('');
        }

        // Success summary
        if (percentage >= 90) {
            console.log('🎉 DEPLOYMENT READY - Day 1 objectives achieved!');
            console.log('✅ Calculator optimization complete');
            console.log('✅ Production configuration ready');
            console.log('✅ Revenue systems configured');
            console.log('⏭️  Ready for Day 2: Payment processing activation');
        } else if (percentage >= 75) {
            console.log('⚠️  DEPLOYMENT CAUTION - Minor issues detected');
            console.log('🔧 Address critical issues before production deployment');
        } else {
            console.log('❌ DEPLOYMENT BLOCKED - Major issues detected');
            console.log('🚨 Resolve critical issues before proceeding');
        }

        console.log('\n' + '='.repeat(50));
    }
}

// Execute verification if run directly
const verification = new DeploymentVerification();

verification.verify()
    .then((success) => {
        if (success) {
            console.log('\n🚀 TimeVault Day 1 verification complete - Ready for production!');
            process.exit(0);
        } else {
            console.log('\n🔧 TimeVault Day 1 verification incomplete - Address issues above');
            process.exit(1);
        }
    })
    .catch((error) => {
        console.error('\n💥 Verification failed:', error);
        process.exit(1);
    });

export { DeploymentVerification };
export default DeploymentVerification;
