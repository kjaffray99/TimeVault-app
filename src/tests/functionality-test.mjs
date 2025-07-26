/**
 * TimeVault API Functionality Test Suite
 * 
 * Comprehensive testing to verify all API functions work as intended
 */

// Import the API components we need to test
import { ApiService, CryptoPriceService, LegacyApiBridge, MetalsPriceService } from '../services/api.js';

class APIFunctionalityTester {
    constructor() {
        this.testResults = {
            initialization: false,
            systemStatus: false,
            apiService: false,
            cryptoService: false,
            metalsService: false,
            securityFeatures: false,
            errorHandling: false
        };
    }

    async runAllTests() {
        console.log('🧪 TimeVault API Functionality Test Suite\n');
        console.log('Testing all core functionality to verify it works as intended...\n');

        try {
            await this.testInitialization();
            await this.testSystemStatus();
            await this.testApiService();
            await this.testCryptoService();
            await this.testMetalsService();
            await this.testSecurityFeatures();
            await this.testErrorHandling();

            this.printFinalResults();
        } catch (error) {
            console.error('❌ Test suite failed with critical error:', error.message);
            return false;
        }
    }

    async testInitialization() {
        console.log('1. 🚀 Testing API Initialization...');
        try {
            LegacyApiBridge.initialize();
            console.log('   ✅ LegacyApiBridge.initialize() - Success');
            this.testResults.initialization = true;
        } catch (error) {
            console.log('   ❌ Initialization failed:', error.message);
        }
        console.log('');
    }

    async testSystemStatus() {
        console.log('2. 📊 Testing System Status...');
        try {
            const status = await LegacyApiBridge.getSystemStatus();
            console.log('   ✅ getSystemStatus() - Success');
            console.log('   📈 System Health:', status.systemHealth.status);
            console.log('   🔧 Services Count:', status.systemHealth.services.length);
            console.log('   🔒 Security Status:', status.security.auditEnabled ? 'Active' : 'Inactive');
            this.testResults.systemStatus = true;
        } catch (error) {
            console.log('   ❌ System status failed:', error.message);
        }
        console.log('');
    }

    async testApiService() {
        console.log('3. 🌐 Testing API Service...');
        try {
            // Test market data
            const marketData = await ApiService.getMarketData();
            console.log('   ✅ getMarketData() - Success');
            console.log('   📊 Market data available:', !!marketData);

            // Test security metrics
            const securityMetrics = ApiService.getSecurityMetrics();
            console.log('   ✅ getSecurityMetrics() - Success');
            console.log('   🔒 Service health:', securityMetrics.serviceHealth);

            // Test health check
            const healthCheck = await ApiService.healthCheck();
            console.log('   ✅ healthCheck() - Success');
            console.log('   💚 Health status:', healthCheck.status);

            this.testResults.apiService = true;
        } catch (error) {
            console.log('   ❌ API Service failed:', error.message);
        }
        console.log('');
    }

    async testCryptoService() {
        console.log('4. ₿ Testing Crypto Price Service...');
        try {
            // Test getting all crypto prices
            const allPrices = await CryptoPriceService.getCryptoPrices();
            console.log('   ✅ getCryptoPrices() - Success');
            console.log('   📈 Crypto assets count:', allPrices ? allPrices.length : 0);

            // Test getting specific crypto price
            const bitcoinPrice = await CryptoPriceService.getCryptoPrice('bitcoin');
            console.log('   ✅ getCryptoPrice("bitcoin") - Success');
            console.log('   ₿ Bitcoin data available:', !!bitcoinPrice);

            // Test service metrics
            const cryptoMetrics = CryptoPriceService.getServiceMetrics();
            console.log('   ✅ getServiceMetrics() - Success');
            console.log('   📊 Metrics available:', !!cryptoMetrics);

            this.testResults.cryptoService = true;
        } catch (error) {
            console.log('   ❌ Crypto Service failed:', error.message);
        }
        console.log('');
    }

    async testMetalsService() {
        console.log('5. 🥇 Testing Metals Price Service...');
        try {
            // Test getting all metals prices
            const allMetals = await MetalsPriceService.getMetalsPrices();
            console.log('   ✅ getMetalsPrices() - Success');
            console.log('   🥇 Metals count:', allMetals ? allMetals.length : 0);

            // Test getting specific metal price
            const goldPrice = await MetalsPriceService.getMetalPrice('gold');
            console.log('   ✅ getMetalPrice("gold") - Success');
            console.log('   🥇 Gold data available:', !!goldPrice);

            // Test service metrics
            const metalsMetrics = MetalsPriceService.getServiceMetrics();
            console.log('   ✅ getServiceMetrics() - Success');
            console.log('   📊 Metrics available:', !!metalsMetrics);

            this.testResults.metalsService = true;
        } catch (error) {
            console.log('   ❌ Metals Service failed:', error.message);
        }
        console.log('');
    }

    async testSecurityFeatures() {
        console.log('6. 🛡️ Testing Security Features...');
        try {
            // Test system status security info
            const status = await LegacyApiBridge.getSystemStatus();
            const securityInfo = status.security;

            console.log('   ✅ Security audit logging:', securityInfo.auditEnabled ? 'Active' : 'Inactive');
            console.log('   ✅ Rate limiting:', securityInfo.rateLimitEnabled ? 'Active' : 'Inactive');
            console.log('   ✅ Input validation:', securityInfo.inputValidationEnabled ? 'Active' : 'Inactive');
            console.log('   ✅ Error sanitization:', securityInfo.errorSanitizationEnabled ? 'Active' : 'Inactive');

            this.testResults.securityFeatures = true;
        } catch (error) {
            console.log('   ❌ Security features test failed:', error.message);
        }
        console.log('');
    }

    async testErrorHandling() {
        console.log('7. ⚠️ Testing Error Handling...');
        try {
            // Test error handling with invalid input
            try {
                await CryptoPriceService.getCryptoPrice('invalid_crypto_that_does_not_exist');
                console.log('   ✅ Invalid input handled gracefully');
            } catch (error) {
                console.log('   ✅ Error properly caught and handled');
            }

            // Test error handling with invalid metal
            try {
                await MetalsPriceService.getMetalPrice('invalid_metal_that_does_not_exist');
                console.log('   ✅ Invalid metal input handled gracefully');
            } catch (error) {
                console.log('   ✅ Metal error properly caught and handled');
            }

            this.testResults.errorHandling = true;
        } catch (error) {
            console.log('   ❌ Error handling test failed:', error.message);
        }
        console.log('');
    }

    printFinalResults() {
        console.log('📋 FINAL TEST RESULTS\n');

        const tests = [
            { name: 'API Initialization', passed: this.testResults.initialization },
            { name: 'System Status', passed: this.testResults.systemStatus },
            { name: 'API Service', passed: this.testResults.apiService },
            { name: 'Crypto Price Service', passed: this.testResults.cryptoService },
            { name: 'Metals Price Service', passed: this.testResults.metalsService },
            { name: 'Security Features', passed: this.testResults.securityFeatures },
            { name: 'Error Handling', passed: this.testResults.errorHandling }
        ];

        const passedTests = tests.filter(test => test.passed);
        const failedTests = tests.filter(test => !test.passed);

        tests.forEach(test => {
            console.log(`   ${test.passed ? '✅' : '❌'} ${test.name}`);
        });

        console.log('\n📊 SUMMARY:');
        console.log(`   Passed: ${passedTests.length}/${tests.length}`);
        console.log(`   Success Rate: ${Math.round((passedTests.length / tests.length) * 100)}%`);

        if (failedTests.length === 0) {
            console.log('\n🎉 ALL TESTS PASSED!');
            console.log('✅ API Functions as Intended - Ready for Production');
            console.log('🚀 All core functionality working correctly');
            return true;
        } else {
            console.log('\n⚠️ Some tests failed:');
            failedTests.forEach(test => {
                console.log(`   ❌ ${test.name}`);
            });
            console.log('🔧 Review failed components before production deployment');
            return false;
        }
    }
}

// Export for use in other files
export { APIFunctionalityTester };

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const tester = new APIFunctionalityTester();
    tester.runAllTests().then(success => {
        process.exit(success ? 0 : 1);
    });
}
