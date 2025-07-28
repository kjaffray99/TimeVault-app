#!/usr/bin/env node

/**
 * Quick deployment validation script
 * Tests the new deployment for basic functionality
 */

import https from 'https';

// Primary domain - will be the main production URL
const PRIMARY_URL = 'https://timevaultai.com';
// Backup Vercel URL for testing
const BACKUP_URL = 'https://timevault-hwf62eyua-time-vault.vercel.app';

function testDeployment(url) {
    return new Promise((resolve, reject) => {
        console.log(`🔍 Testing deployment at: ${url}`);

        const startTime = Date.now();

        const req = https.get(url, (res) => {
            const endTime = Date.now();
            const responseTime = endTime - startTime;

            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                const result = {
                    url,
                    statusCode: res.statusCode,
                    responseTime: `${responseTime}ms`,
                    contentLength: data.length,
                    hasTimeVault: data.includes('TimeVault'),
                    hasCalculator: data.includes('Calculator') || data.includes('calculator'),
                    hasReact: data.includes('react'),
                    hasError: data.includes('error') || data.includes('Error') || data.includes('Loading Error'),
                    headers: res.headers
                };

                resolve(result);
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

async function main() {
    console.log('🚀 TimeVault Deployment Validation');
    console.log('='.repeat(50));

    try {
        // Test primary domain first
        console.log('Testing PRIMARY domain: timevaultai.com');
        let result = await testDeployment(PRIMARY_URL);

        // If primary fails, test backup Vercel URL
        if (result.statusCode !== 200) {
            console.log('\n⚠️ Primary domain failed, testing backup Vercel URL...');
            result = await testDeployment(BACKUP_URL);
        }

        console.log('\n📊 DEPLOYMENT STATUS:');
        console.log(`Status Code: ${result.statusCode}`);
        console.log(`Response Time: ${result.responseTime}`);
        console.log(`Content Length: ${result.contentLength} bytes`);
        console.log(`Contains TimeVault: ${result.hasTimeVault ? '✅' : '❌'}`);
        console.log(`Contains Calculator: ${result.hasCalculator ? '✅' : '❌'}`);
        console.log(`React App: ${result.hasReact ? '✅' : '❌'}`);
        console.log(`Has Errors: ${result.hasError ? '❌' : '✅'}`);

        if (result.statusCode === 200 && !result.hasError) {
            console.log('\n🎉 DEPLOYMENT SUCCESSFUL!');
            console.log('✅ Site is loading correctly');
            console.log('✅ No loading errors detected');
            console.log(`✅ Response time: ${result.responseTime}`);

            console.log('\n🌐 LIVE URL:');
            console.log(NEW_URL);

            return 0;
        } else {
            console.log('\n❌ DEPLOYMENT ISSUES DETECTED');
            if (result.statusCode !== 200) {
                console.log(`❌ HTTP Status: ${result.statusCode}`);
            }
            if (result.hasError) {
                console.log('❌ Loading errors still present');
            }
            return 1;
        }

    } catch (error) {
        console.log('\n❌ DEPLOYMENT TEST FAILED');
        console.error('Error:', error.message);
        return 1;
    }
}

main().then(process.exit);
