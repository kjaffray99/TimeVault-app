const http = require('http');

console.log('🔍 Testing TimeVault AI Application Status...\n');

// Test if localhost:3003 is responding
const options = {
    hostname: 'localhost',
    port: 3003,
    path: '/',
    method: 'GET',
    timeout: 5000
};

const req = http.request(options, (res) => {
    console.log('✅ Server Response:', res.statusCode);
    console.log('📊 Headers:', JSON.stringify(res.headers, null, 2));

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (data.includes('TimeVault')) {
            console.log('✅ TimeVault AI is loading successfully!');
            console.log('🎯 Page includes TimeVault branding');
        } else {
            console.log('⚠️  Response received but no TimeVault content detected');
        }

        if (data.includes('error') || data.includes('Error')) {
            console.log('❌ Potential errors detected in page content');
        } else {
            console.log('✅ No obvious errors detected');
        }

        console.log('\n📊 Response length:', data.length, 'bytes');
        console.log('🔍 Application Status: RUNNING');
    });
});

req.on('error', (err) => {
    console.log('❌ Connection Error:', err.message);
    console.log('🔍 Application Status: NOT RUNNING or PORT BLOCKED');
});

req.on('timeout', () => {
    console.log('⏰ Request Timeout - Server may be slow to respond');
    req.destroy();
});

req.end();
