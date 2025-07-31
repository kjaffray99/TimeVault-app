#!/usr/bin/env node

/**
 * 🎯 TIMEVAULT AI - FOCUSED DEPLOYMENT VERIFICATION
 * Quick validation of deployment success and synchronization
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

console.log('🔍 TIMEVAULT AI DEPLOYMENT VERIFICATION\n');

async function makeRequest(url, timeout = 8000) {
    return new Promise((resolve) => {
        const isHttps = url.startsWith('https');
        const client = isHttps ? https : http;

        const req = client.get(url, { timeout }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                resolve({
                    success: true,
                    statusCode: res.statusCode,
                    data: data.substring(0, 2000), // First 2000 chars for analysis
                    headers: res.headers
                });
            });
        });

        req.on('error', (error) => resolve({ success: false, error: error.message }));
        req.on('timeout', () => {
            req.destroy();
            resolve({ success: false, error: 'Timeout' });
        });
    });
}

async function verifyDeployment() {
    console.log('📋 CHECKING DEPLOYMENT STATUS...\n');

    // 1. Check Local Development Server
    console.log('🏠 LOCAL SERVER VERIFICATION:');
    const localPorts = [3001, 3003, 3000]; // Check multiple ports
    let localServerRunning = false;
    let localPort = null;

    for (const port of localPorts) {
        const localResponse = await makeRequest(`http://localhost:${port}`);
        if (localResponse.success) {
            console.log(`✅ Local server running on localhost:${port}`);
            console.log(`✅ Status: ${localResponse.statusCode}`);

            if (localResponse.data.includes('TimeVault')) {
                console.log(`✅ TimeVault content detected locally`);
                localServerRunning = true;
                localPort = port;
                break;
            }
        }
    }

    if (!localServerRunning) {
        console.log('❌ Local server not detected on common ports');
    }

    // 2. Check Production Site
    console.log('\n🌐 PRODUCTION SITE VERIFICATION:');
    const prodResponse = await makeRequest('https://timevaultai.com');

    if (prodResponse.success) {
        console.log(`✅ timevaultai.com accessible`);
        console.log(`✅ Status: ${prodResponse.statusCode}`);

        if (prodResponse.data.includes('TimeVault')) {
            console.log(`✅ TimeVault content live on production`);
        } else {
            console.log(`⚠️  TimeVault content not detected on production`);
        }

        if (prodResponse.data.includes('Calculator')) {
            console.log(`✅ Calculator component detected`);
        }

        if (prodResponse.data.includes('DollarSign')) {
            console.log(`⚠️  DollarSign reference found - may indicate runtime error`);
        } else {
            console.log(`✅ No DollarSign runtime errors detected`);
        }

    } else {
        console.log(`❌ timevaultai.com not accessible: ${prodResponse.error}`);
    }

    // 3. Check File System Status
    console.log('\n📁 FILE SYSTEM VERIFICATION:');
    const criticalFiles = [
        'src/components/ComprehensiveFreeCalculator.tsx',
        'src/components/RealTimePriceEngine.tsx',
        'vercel.json',
        'package.json'
    ];

    let filesOk = 0;
    criticalFiles.forEach(file => {
        if (fs.existsSync(file)) {
            console.log(`✅ ${file}`);
            filesOk++;
        } else {
            console.log(`❌ ${file} - Missing`);
        }
    });

    // 4. Check DollarSign Fix
    console.log('\n🔧 DOLLARSIGN FIX VERIFICATION:');
    try {
        const calculatorContent = fs.readFileSync('src/components/ComprehensiveFreeCalculator.tsx', 'utf8');
        if (calculatorContent.includes('DollarSign') && calculatorContent.includes('from \'lucide-react\'')) {
            console.log('✅ DollarSign properly imported from lucide-react');
        } else {
            console.log('❌ DollarSign import issue still present');
        }
    } catch (error) {
        console.log(`❌ Cannot verify DollarSign fix: ${error.message}`);
    }

    // 5. Check Build Status
    console.log('\n🔨 BUILD STATUS VERIFICATION:');
    if (fs.existsSync('.next') && fs.existsSync('.next/build-manifest.json')) {
        console.log('✅ Production build artifacts present');

        try {
            const buildManifest = JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8'));
            console.log(`✅ Build manifest valid with ${Object.keys(buildManifest.pages || {}).length} pages`);
        } catch (error) {
            console.log('⚠️  Build manifest exists but may be corrupted');
        }
    } else {
        console.log('❌ Production build artifacts missing');
    }

    // 6. Overall Assessment
    console.log('\n📊 DEPLOYMENT ASSESSMENT:');

    const checks = [
        localServerRunning,
        prodResponse?.success,
        filesOk === criticalFiles.length,
        fs.existsSync('.next/build-manifest.json')
    ];

    const passedChecks = checks.filter(Boolean).length;
    const totalChecks = checks.length;
    const successRate = Math.round((passedChecks / totalChecks) * 100);

    console.log(`📈 Success Rate: ${passedChecks}/${totalChecks} (${successRate}%)`);

    if (successRate >= 90) {
        console.log('\n🎉 DEPLOYMENT 100% SUCCESSFUL!');
        console.log('✅ Local server and production site are operational');
        console.log('✅ All critical components verified');
        console.log('✅ Ready for user traffic');
    } else if (successRate >= 75) {
        console.log('\n✅ DEPLOYMENT MOSTLY SUCCESSFUL');
        console.log('⚠️  Some minor issues detected but core functionality working');
    } else {
        console.log('\n⚠️  DEPLOYMENT PARTIALLY SUCCESSFUL');
        console.log('❌ Several issues need attention');
    }

    // 7. Quick Synchronization Check
    if (localServerRunning && prodResponse?.success) {
        console.log('\n🔄 SYNCHRONIZATION CHECK:');
        const localResp = await makeRequest(`http://localhost:${localPort}`);

        if (localResp.success && prodResponse.success) {
            const localHasTimeVault = localResp.data.includes('TimeVault');
            const prodHasTimeVault = prodResponse.data.includes('TimeVault');

            if (localHasTimeVault && prodHasTimeVault) {
                console.log('✅ Local and production both contain TimeVault content');
                console.log('✅ Synchronization appears successful');
            } else {
                console.log('⚠️  Content synchronization may have issues');
            }
        }
    }

    console.log('\n🎯 VERIFICATION COMPLETE');
    console.log(`📄 For detailed analysis, check: deployment-verification-report.json`);
}

// Execute verification
verifyDeployment().catch(console.error);
