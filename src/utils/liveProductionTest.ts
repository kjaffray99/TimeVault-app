/**
 * Live Production Test Suite
 * Comprehensive validation for timevaultai.com
 */

interface TestResult {
    name: string;
    status: 'PASS' | 'FAIL' | 'WARNING';
    details: string;
    timestamp: string;
}

class ProductionValidator {
    private results: TestResult[] = [];
    private baseUrl = 'https://timevaultai.com';

    private logResult(name: string, status: 'PASS' | 'FAIL' | 'WARNING', details: string) {
        this.results.push({
            name,
            status,
            details,
            timestamp: new Date().toISOString()
        });
    }

    async validateSiteAccessibility(): Promise<void> {
        try {
            const response = await fetch(this.baseUrl);
            if (response.ok) {
                this.logResult('Site Accessibility', 'PASS', `HTTP ${response.status} - Site is live and accessible`);
            } else {
                this.logResult('Site Accessibility', 'FAIL', `HTTP ${response.status} - Site access failed`);
                return;
            }

            const html = await response.text();

            // Content validation
            if (html.includes('TimeVault')) {
                this.logResult('Brand Presence', 'PASS', 'TimeVault branding found');
            } else {
                this.logResult('Brand Presence', 'FAIL', 'TimeVault branding missing');
            }

            if (html.includes('Calculator')) {
                this.logResult('Calculator Component', 'PASS', 'Calculator functionality present');
            } else {
                this.logResult('Calculator Component', 'WARNING', 'Calculator text not found in initial HTML');
            }

            // Check for React mounting
            if (html.includes('id="root"')) {
                this.logResult('React App Mount', 'PASS', 'React mount point available');
            } else {
                this.logResult('React App Mount', 'FAIL', 'React mount point missing');
            }

            // JavaScript loading
            const scriptCount = (html.match(/<script/g) || []).length;
            if (scriptCount > 0) {
                this.logResult('JavaScript Loading', 'PASS', `${scriptCount} script tags found`);
            } else {
                this.logResult('JavaScript Loading', 'FAIL', 'No JavaScript found');
            }

            // CSS loading
            const cssCount = (html.match(/\.css/g) || []).length;
            if (cssCount > 0) {
                this.logResult('CSS Styling', 'PASS', `${cssCount} CSS references found`);
            } else {
                this.logResult('CSS Styling', 'WARNING', 'Limited CSS detected');
            }

            // Performance check
            const pageSize = html.length;
            if (pageSize > 5000 && pageSize < 50000) {
                this.logResult('Page Size Optimization', 'PASS', `${pageSize} chars - Optimal size`);
            } else if (pageSize < 5000) {
                this.logResult('Page Size Optimization', 'WARNING', `${pageSize} chars - Potentially missing content`);
            } else {
                this.logResult('Page Size Optimization', 'WARNING', `${pageSize} chars - Large page size`);
            }

        } catch (error) {
            this.logResult('Site Accessibility', 'FAIL', `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateSecurityHeaders(): Promise<void> {
        try {
            const response = await fetch(this.baseUrl, { method: 'HEAD' });

            // Security headers check
            const csp = response.headers.get('content-security-policy');
            if (csp) {
                this.logResult('Security Headers - CSP', 'PASS', 'Content Security Policy present');
            } else {
                this.logResult('Security Headers - CSP', 'WARNING', 'CSP header missing');
            }

            const cors = response.headers.get('access-control-allow-origin');
            if (cors) {
                this.logResult('Security Headers - CORS', 'PASS', `CORS configured: ${cors}`);
            } else {
                this.logResult('Security Headers - CORS', 'WARNING', 'CORS header missing');
            }

        } catch (error) {
            this.logResult('Security Headers', 'FAIL', `Header check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateDebugMode(): Promise<void> {
        try {
            const debugResponse = await fetch(`${this.baseUrl}?debug=true`);
            if (debugResponse.ok) {
                this.logResult('Debug Mode Access', 'PASS', 'Debug URL accessible');
            } else {
                this.logResult('Debug Mode Access', 'WARNING', 'Debug mode may not be available');
            }
        } catch (error) {
            this.logResult('Debug Mode Access', 'FAIL', `Debug test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async validateAPIConnectivity(): Promise<void> {
        // Test external API connectivity that TimeVault relies on
        try {
            const coinGeckoTest = await fetch('https://api.coingecko.com/api/v3/ping');
            if (coinGeckoTest.ok) {
                this.logResult('External API - CoinGecko', 'PASS', 'CoinGecko API accessible');
            } else {
                this.logResult('External API - CoinGecko', 'WARNING', 'CoinGecko API issues detected');
            }
        } catch (error) {
            this.logResult('External API - CoinGecko', 'WARNING', `CoinGecko connectivity: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        try {
            const metalsTest = await fetch('https://api.metals.live/v1/spot/gold');
            if (metalsTest.ok) {
                this.logResult('External API - Metals.live', 'PASS', 'Metals API accessible');
            } else {
                this.logResult('External API - Metals.live', 'WARNING', 'Metals API issues detected');
            }
        } catch (error) {
            this.logResult('External API - Metals.live', 'WARNING', `Metals API connectivity: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async runFullValidation(): Promise<TestResult[]> {
        console.log('🚀 Starting TimeVault Production Validation...');
        console.log('='.repeat(50));

        await this.validateSiteAccessibility();
        await this.validateSecurityHeaders();
        await this.validateDebugMode();
        await this.validateAPIConnectivity();

        return this.results;
    }

    generateReport(): string {
        const passCount = this.results.filter(r => r.status === 'PASS').length;
        const failCount = this.results.filter(r => r.status === 'FAIL').length;
        const warningCount = this.results.filter(r => r.status === 'WARNING').length;

        let report = '\n🎯 TIMEVAULT PRODUCTION VALIDATION REPORT\n';
        report += '='.repeat(50) + '\n';
        report += `✅ PASSED: ${passCount}\n`;
        report += `⚠️  WARNINGS: ${warningCount}\n`;
        report += `❌ FAILED: ${failCount}\n`;
        report += `📊 TOTAL TESTS: ${this.results.length}\n\n`;

        this.results.forEach(result => {
            const icon = result.status === 'PASS' ? '✅' : result.status === 'WARNING' ? '⚠️' : '❌';
            report += `${icon} ${result.name}: ${result.details}\n`;
        });

        report += '\n🔗 Live Site: https://timevaultai.com\n';
        report += `📅 Validation Time: ${new Date().toLocaleString()}\n`;

        const overallStatus = failCount === 0 ?
            (warningCount === 0 ? '🎉 FULLY OPERATIONAL' : '⚡ OPERATIONAL WITH NOTES') :
            '🚨 ISSUES DETECTED';

        report += `🏆 Overall Status: ${overallStatus}\n`;

        return report;
    }
}

// Export for manual testing
export default ProductionValidator;

// Auto-run if in browser environment
if (typeof window !== 'undefined') {
    const validator = new ProductionValidator();
    validator.runFullValidation().then(() => {
        console.log(validator.generateReport());
    });
}
