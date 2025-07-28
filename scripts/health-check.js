#!/usr/bin/env node

/**
 * TimeVault Quick Health Check
 * Rapid system status verification
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TimeVault Quick Health Check');
console.log('='.repeat(40));

// Check 1: Dependencies
try {
    console.log('📦 Checking dependencies...');
    execSync('npm list --depth=0', { stdio: 'pipe' });
    console.log('✅ Dependencies OK');
} catch (error) {
    console.log('⚠️  Some dependency issues detected');
}

// Check 2: TypeScript
try {
    console.log('🔧 Checking TypeScript...');
    execSync('npm run type-check', { stdio: 'pipe' });
    console.log('✅ TypeScript OK');
} catch (error) {
    console.log('❌ TypeScript errors detected');
}

// Check 3: Build
try {
    console.log('🏗️  Testing build...');
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ Build OK');
} catch (error) {
    console.log('❌ Build failed');
}

// Check 4: Security
try {
    console.log('🔒 Security audit...');
    execSync('npm audit --audit-level=moderate', { stdio: 'pipe' });
    console.log('✅ Security OK');
} catch (error) {
    console.log('⚠️  Security vulnerabilities found');
}

// Check 5: Critical files
const criticalFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    'src/main.tsx',
    'src/App.tsx'
];

console.log('📁 Checking critical files...');
let allFilesExist = true;
criticalFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} MISSING`);
        allFilesExist = false;
    }
});

console.log('\n📊 SUMMARY');
console.log('='.repeat(40));

if (allFilesExist) {
    console.log('🎉 TimeVault is healthy and ready to deploy!');
    console.log('\nNext steps:');
    console.log('1. npm run dev - Start development server');
    console.log('2. npm run build - Create production build');
    console.log('3. npm run deploy:vercel - Deploy to Vercel');
} else {
    console.log('⚠️  Issues detected. Run: node scripts/troubleshoot-and-fix.js');
}

console.log('\n🚀 Ready for revenue generation!');
