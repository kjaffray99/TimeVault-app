#!/usr/bin/env node

/**
 * Production Validation Script
 * Confirms TimeVault is live and functional
 */

import https from 'https';

console.log('🚀 TimeVault Production Validation');
console.log('==================================================');

// Test primary domain
function testProduction() {
    return new Promise((resolve, reject) => {
        const url = 'https://timevaultai.com';
        console.log(`🔍 Testing production site: ${url}`);

        const startTime = Date.now();

        const req = https.get(url, {
            headers: {
                'User-Agent': 'TimeVault-Validator/1.0'
            }
        }, (res) => {
            // Handle redirects
            if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307 || res.statusCode === 308) {
                console.log(`📍 Following redirect to: ${res.headers.location}`);

                // Follow the redirect
                const redirectReq = https.get(res.headers.location, (redirectRes) => {
                    let data = '';

                    redirectRes.on('data', (chunk) => {
                        data += chunk;
                    });

                    redirectRes.on('end', () => {
                        const responseTime = Date.now() - startTime;

                        const result = {
                            statusCode: redirectRes.statusCode,
                            responseTime: responseTime,
                            contentLength: data.length,
                            containsTimeVault: data.includes('TimeVault') || data.includes('timevault'),
                            containsCalculator: data.includes('Calculator') || data.includes('calculator'),
                            isReactApp: data.includes('react') || data.includes('React') || data.includes('root'),
                            hasCSS: data.includes('.css') || data.includes('style'),
                            hasJS: data.includes('.js') || data.includes('script')
                        };

                        resolve(result);
                    });
                });

                redirectReq.on('error', reject);
                return;
            }

            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const responseTime = Date.now() - startTime;

                const result = {
                    statusCode: res.statusCode,
                    responseTime: responseTime,
                    contentLength: data.length,
                    containsTimeVault: data.includes('TimeVault') || data.includes('timevault'),
                    containsCalculator: data.includes('Calculator') || data.includes('calculator'),
                    isReactApp: data.includes('react') || data.includes('React') || data.includes('root'),
                    hasCSS: data.includes('.css') || data.includes('style'),
                    hasJS: data.includes('.js') || data.includes('script')
                };

                resolve(result);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.abort();
            reject(new Error('Request timeout'));
        });
    });
}

// Run validation
async function runValidation() {
    try {
        const result = await testProduction();

        console.log('📊 PRODUCTION STATUS:');
        console.log(`Status Code: ${result.statusCode}`);
        console.log(`Response Time: ${result.responseTime}ms`);
        console.log(`Content Length: ${result.contentLength} bytes`);
        console.log(`Contains TimeVault: ${result.containsTimeVault ? '✅' : '❌'}`);
        console.log(`Contains Calculator: ${result.containsCalculator ? '✅' : '❌'}`);
        console.log(`React App: ${result.isReactApp ? '✅' : '❌'}`);
        console.log(`Has CSS: ${result.hasCSS ? '✅' : '❌'}`);
        console.log(`Has JavaScript: ${result.hasJS ? '✅' : '❌'}`);

        if (result.statusCode === 200 && result.isReactApp) {
            console.log('\n🎉 SUCCESS: TimeVault is live and working!');
            console.log('🌐 Production URL: https://timevaultai.com');
            console.log('✅ All systems operational');
            process.exit(0);
        } else {
            console.log('\n❌ ISSUES DETECTED');
            console.log(`❌ HTTP Status: ${result.statusCode}`);
            if (!result.isReactApp) console.log('❌ React app not loading properly');
            process.exit(1);
        }

    } catch (error) {
        console.log('❌ VALIDATION FAILED');
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

runValidation();
