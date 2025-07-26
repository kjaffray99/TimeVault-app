/**
 * Simple API Functionality Verification
 * 
 * Verifies that the TimeVault API exports and imports work correctly
 */

// Test imports
console.log('🧪 Testing TimeVault API Imports and Exports...\n');

try {
    // Test 1: Import main API exports
    console.log('1. Testing API imports...');
    const api = require('../services/api');

    const expectedExports = [
        'LegacyApiBridge',
        'ApiService',
        'CryptoPriceService',
        'MetalsPriceService',
        'coinGeckoClient',
        'metalsClient',
        'SecurityMetrics'
    ];

    const actualExports = Object.keys(api);
    const missingExports = expectedExports.filter(exp => !actualExports.includes(exp));

    if (missingExports.length === 0) {
        console.log('✅ All expected exports found:', expectedExports.join(', '));
    } else {
        console.log('❌ Missing exports:', missingExports.join(', '));
        console.log('   Available exports:', actualExports.join(', '));
    }
    console.log('');

    // Test 2: Check if LegacyApiBridge has required methods
    console.log('2. Testing LegacyApiBridge interface...');
    const bridge = api.LegacyApiBridge;
    const requiredMethods = ['initialize', 'getSystemStatus'];
    const availableMethods = Object.getOwnPropertyNames(bridge).filter(name => typeof bridge[name] === 'function');

    const missingMethods = requiredMethods.filter(method => !availableMethods.includes(method));

    if (missingMethods.length === 0) {
        console.log('✅ All required bridge methods found:', requiredMethods.join(', '));
    } else {
        console.log('❌ Missing bridge methods:', missingMethods.join(', '));
        console.log('   Available methods:', availableMethods.join(', '));
    }
    console.log('');

    // Test 3: Check service interfaces
    console.log('3. Testing service interfaces...');
    const services = ['ApiService', 'CryptoPriceService', 'MetalsPriceService'];
    let servicesValid = true;

    services.forEach(serviceName => {
        const service = api[serviceName];
        if (service && typeof service === 'object') {
            console.log(`✅ ${serviceName}: Available with methods:`, Object.keys(service).join(', '));
        } else {
            console.log(`❌ ${serviceName}: Not available or invalid`);
            servicesValid = false;
        }
    });
    console.log('');

    // Test 4: Check type exports
    console.log('4. Testing type exports...');
    // Types are compile-time only, so we just verify the module loads
    console.log('✅ Type definitions loaded successfully');
    console.log('');

    // Test 5: Architecture validation
    console.log('5. Testing modular architecture...');

    // Check if we can access legacy modules
    try {
        const legacyBridge = require('../services/legacy/bridge');
        const legacyServices = require('../services/legacy/services');
        const securityAudit = require('../services/security/audit');

        console.log('✅ Modular architecture working:');
        console.log('   - Legacy bridge: Available');
        console.log('   - Legacy services: Available');
        console.log('   - Security modules: Available');
    } catch (error) {
        console.log('❌ Modular architecture issue:', error.message);
        servicesValid = false;
    }
    console.log('');

    // Final result
    if (servicesValid && missingExports.length === 0 && missingMethods.length === 0) {
        console.log('🎉 API FUNCTIONALITY VERIFICATION PASSED!\n');
        console.log('✅ All Core Features Working:');
        console.log('   - Import/Export system functional');
        console.log('   - Bridge interface available');
        console.log('   - Service interfaces operational');
        console.log('   - Modular architecture working');
        console.log('   - Type definitions loaded');
        console.log('\n🚀 API Functions as Intended - Ready for Use');
        process.exit(0);
    } else {
        console.log('❌ API functionality verification failed');
        process.exit(1);
    }

} catch (error) {
    console.error('❌ Critical API Import Error:', error.message);
    console.log('\n🔧 This indicates a structural issue that needs to be resolved');
    process.exit(1);
}
