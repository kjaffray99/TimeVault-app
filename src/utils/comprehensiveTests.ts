/**
 * TimeVault Performance & Functionality Test Suite
 * Comprehensive validation for production deployment
 */

// Test Calculator API Integration
async function testCalculatorAPI() {
    console.log('🧮 Testing Calculator API Integration...');

    try {
        // Test CoinGecko API
        const cryptoResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
        const cryptoData = await cryptoResponse.json();

        if (cryptoData.bitcoin?.usd) {
            console.log('✅ CoinGecko API: Working -', `BTC: $${cryptoData.bitcoin.usd}`);
        } else {
            console.error('❌ CoinGecko API: Failed');
        }

        // Test Metals API
        const metalsResponse = await fetch('https://api.metals.live/v1/spot/gold');
        const metalsData = await metalsResponse.json();

        if (metalsData.price) {
            console.log('✅ Metals API: Working -', `Gold: $${metalsData.price}/oz`);
        } else {
            console.error('❌ Metals API: Failed');
        }

    } catch (error) {
        console.error('🔴 API Test Failed:', error);
    }
}

// Test Performance Metrics
function testPerformanceMetrics() {
    console.log('⚡ Testing Performance Metrics...');

    const performance = window.performance;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

    const metrics = {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        totalPageLoad: navigation.loadEventEnd - navigation.fetchStart,
        timeToFirstByte: navigation.responseStart - navigation.requestStart,
    };

    console.log('📊 Performance Metrics:');
    console.log(`   Load Time: ${metrics.loadTime}ms`);
    console.log(`   DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`   Total Page Load: ${metrics.totalPageLoad}ms`);
    console.log(`   Time to First Byte: ${metrics.timeToFirstByte}ms`);

    // Check if we meet performance targets
    const targetLoadTime = 1500; // 1.5 seconds
    if (metrics.totalPageLoad < targetLoadTime) {
        console.log('✅ Performance Target: MET (sub-1.5s load time)');
    } else {
        console.log('⚠️ Performance Target: MISSED (>1.5s load time)');
    }
}

// Test Revenue Features
function testRevenueFunctionality() {
    console.log('💰 Testing Revenue Functionality...');

    // Check if premium elements exist
    const premiumButton = document.querySelector('[data-testid="premium-upgrade"], .premium-button, button:contains("UPGRADE")');
    const calculator = document.querySelector('[data-testid="calculator"], .calculator-container, input[type="number"]');
    const header = document.querySelector('header, .header, nav');

    const results = {
        premiumCTA: !!premiumButton,
        calculatorPresent: !!calculator,
        headerNavigation: !!header,
    };

    console.log('🎯 Revenue Elements:');
    console.log(`   Premium CTA: ${results.premiumCTA ? '✅' : '❌'}`);
    console.log(`   Calculator: ${results.calculatorPresent ? '✅' : '❌'}`);
    console.log(`   Header Navigation: ${results.headerNavigation ? '✅' : '❌'}`);

    return results;
}

// Test Theme Consistency
function testThemeConsistency() {
    console.log('🎨 Testing Theme Consistency...');

    const root = document.documentElement;
    const styles = getComputedStyle(root);

    const themeColors = {
        navyPrimary: styles.getPropertyValue('--tv-navy-primary') || 'not found',
        goldPrimary: styles.getPropertyValue('--tv-gold-primary') || 'not found',
        white: styles.getPropertyValue('--tv-white') || 'not found',
    };

    console.log('🎨 Theme Colors:');
    console.log(`   Navy Primary: ${themeColors.navyPrimary}`);
    console.log(`   Gold Primary: ${themeColors.goldPrimary}`);
    console.log(`   White: ${themeColors.white}`);

    const hasCorrectTheme = themeColors.navyPrimary.includes('#001F3F') &&
        themeColors.goldPrimary.includes('#D4AF37');

    if (hasCorrectTheme) {
        console.log('✅ Theme: Correctly applied');
    } else {
        console.log('⚠️ Theme: May have issues');
    }
}

// Test Security Headers
async function testSecurityHeaders() {
    console.log('🔒 Testing Security Headers...');

    try {
        const response = await fetch(window.location.href, { method: 'HEAD' });
        const headers = response.headers;

        const securityHeaders = {
            csp: headers.get('content-security-policy'),
            xFrameOptions: headers.get('x-frame-options'),
            xContentTypeOptions: headers.get('x-content-type-options'),
            strictTransportSecurity: headers.get('strict-transport-security'),
        };

        console.log('🛡️ Security Headers:');
        console.log(`   CSP: ${securityHeaders.csp ? '✅' : '❌'}`);
        console.log(`   X-Frame-Options: ${securityHeaders.xFrameOptions ? '✅' : '❌'}`);
        console.log(`   X-Content-Type-Options: ${securityHeaders.xContentTypeOptions ? '✅' : '❌'}`);
        console.log(`   HSTS: ${securityHeaders.strictTransportSecurity ? '✅' : '❌'}`);

    } catch (error) {
        console.error('🔴 Security Headers Test Failed:', error);
    }
}

// Run Comprehensive Test Suite
export async function runComprehensiveTests() {
    console.log('🚀 Starting TimeVault Comprehensive Testing...\n');

    try {
        await testCalculatorAPI();
        console.log('');

        testPerformanceMetrics();
        console.log('');

        testRevenueFunctionality();
        console.log('');

        testThemeConsistency();
        console.log('');

        await testSecurityHeaders();
        console.log('');

        console.log('✅ Comprehensive Testing Complete!');
        console.log('📊 Results: Check individual test outputs above');

    } catch (error) {
        console.error('🔴 Testing Suite Failed:', error);
    }
}

// Auto-run tests when imported
if (typeof window !== 'undefined') {
    // Wait for page load before running tests
    if (document.readyState === 'complete') {
        setTimeout(runComprehensiveTests, 1000);
    } else {
        window.addEventListener('load', () => {
            setTimeout(runComprehensiveTests, 1000);
        });
    }
}
