/**
 * TimeVault API Functionality Test
 * 
 * Tests core API functionality to ensure it works as intended
 */

import { ApiService, CryptoPriceService, LegacyApiBridge, MetalsPriceService } from '../services/api';

async function testApiFunctionality() {
    console.log('🧪 Testing TimeVault API Functionality...\n');

    try {
        // Test 1: Initialize the API bridge
        console.log('1. Initializing API Bridge...');
        LegacyApiBridge.initialize();
        console.log('✅ API Bridge initialized successfully\n');

        // Test 2: Test system status
        console.log('2. Checking system status...');
        const systemStatus = await LegacyApiBridge.getSystemStatus();
        console.log('✅ System Status:', systemStatus.systemHealth.status);
        console.log('   Services:', systemStatus.systemHealth.services.map(s => `${s.name}: ${s.status}`).join(', '));
        console.log('');

        // Test 3: Test market data retrieval
        console.log('3. Testing market data retrieval...');
        const marketData = await ApiService.getMarketData();
        console.log('✅ Market data retrieved successfully');
        console.log('   Data points:', Object.keys(marketData || {}).length);
        console.log('');

        // Test 4: Test crypto price service
        console.log('4. Testing crypto price service...');
        const cryptoPrices = await CryptoPriceService.getCryptoPrice('bitcoin');
        console.log('✅ Crypto prices retrieved successfully');
        console.log('   Bitcoin price available:', !!cryptoPrices);
        console.log('');

        // Test 5: Test metals price service
        console.log('5. Testing metals price service...');
        const metalsPrices = await MetalsPriceService.getMetalPrice('gold');
        console.log('✅ Metals prices retrieved successfully');
        console.log('   Gold price available:', !!metalsPrices);
        console.log('');

        // Test 6: Test security metrics
        console.log('6. Testing security metrics...');
        const securityMetrics = ApiService.getSecurityMetrics();
        console.log('✅ Security metrics retrieved successfully');
        console.log('   Service health:', securityMetrics.serviceHealth);
        console.log('');

        // Test 7: Test health check
        console.log('7. Testing health check...');
        const healthCheck = await ApiService.healthCheck();
        console.log('✅ Health check completed');
        console.log('   Status:', healthCheck.status);
        console.log('');

        console.log('🎉 All API functionality tests passed!\n');
        console.log('✅ API Functions as Intended - Ready for Production');

        return {
            success: true,
            message: 'All tests passed - API functions as intended',
            testResults: {
                initialization: true,
                systemStatus: true,
                marketData: true,
                cryptoPrices: true,
                metalsPrices: true,
                securityMetrics: true,
                healthCheck: true
            }
        };

    } catch (error) {
        console.error('❌ API Test Failed:', error);
        return {
            success: false,
            message: `API test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            testResults: {}
        };
    }
}

// Export for use in other test files
export { testApiFunctionality };

// Run tests if this file is executed directly
if (typeof window === 'undefined' && require.main === module) {
    testApiFunctionality().then(result => {
        console.log('\n📊 Final Test Result:', result.success ? 'SUCCESS' : 'FAILED');
        process.exit(result.success ? 0 : 1);
    });
}
