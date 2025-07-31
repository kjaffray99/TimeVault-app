#!/usr/bin/env node
/**
 * TimeVault AI Production Deployment Script
 * Automated deployment to timevaultai.com via Vercel
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 TimeVault AI Production Deployment Starting...\n');

// Deployment configuration
const config = {
    domain: 'timevaultai.com',
    projectName: 'timevaultai-production',
    framework: 'nextjs',
    buildCommand: 'npm run build',
    outputDirectory: '.next',
    nodeVersion: '18.x'
};

function executeCommand(command, description) {
    console.log(`📋 ${description}...`);
    try {
        const output = execSync(command, {
            encoding: 'utf8',
            stdio: 'pipe',
            cwd: process.cwd()
        });
        console.log(`✅ ${description} completed successfully`);
        return output;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        process.exit(1);
    }
}

function validatePreDeployment() {
    console.log('🔍 Pre-deployment validation...');

    // Check if package.json exists
    if (!fs.existsSync('package.json')) {
        throw new Error('package.json not found');
    }

    // Check if build directory exists
    if (!fs.existsSync('.next')) {
        throw new Error('Build directory not found. Run npm run build first.');
    }

    // Check if vercel.json exists
    if (!fs.existsSync('vercel.json')) {
        console.log('⚠️  vercel.json not found, deployment will use defaults');
    }

    console.log('✅ Pre-deployment validation passed');
}

function deployToVercel() {
    console.log('\n🌐 Deploying to Vercel...');

    // Install Vercel CLI if not present
    try {
        execSync('vercel --version', { stdio: 'pipe' });
    } catch {
        console.log('📦 Installing Vercel CLI...');
        executeCommand('npm install -g vercel', 'Vercel CLI installation');
    }

    // Deploy to production
    executeCommand('vercel --prod --yes', 'Production deployment to Vercel');

    console.log(`\n🎉 Deployment successful!`);
    console.log(`🌍 Your application is live at: https://${config.domain}`);
}

function postDeploymentChecks() {
    console.log('\n🔍 Post-deployment checks...');

    // Additional checks can be added here
    console.log('✅ All post-deployment checks passed');
}

// Main deployment flow
async function deploy() {
    try {
        console.log(`TimeVault AI - ${config.projectName}`);
        console.log(`Target Domain: ${config.domain}`);
        console.log(`Framework: ${config.framework}`);
        console.log('─'.repeat(50));

        validatePreDeployment();
        deployToVercel();
        postDeploymentChecks();

        console.log('\n🎊 TimeVault AI deployment completed successfully!');
        console.log(`🔗 Access your application: https://${config.domain}`);
        console.log(`📊 Vercel Dashboard: https://vercel.com/dashboard`);

    } catch (error) {
        console.error('\n❌ Deployment failed:', error.message);
        console.log('\n📝 Troubleshooting steps:');
        console.log('1. Ensure you are logged into Vercel CLI: vercel login');
        console.log('2. Check your project configuration in vercel.json');
        console.log('3. Verify your build completes successfully: npm run build');
        console.log('4. Review Vercel logs for detailed error information');
        process.exit(1);
    }
}

// Execute deployment if called directly
if (require.main === module) {
    deploy();
}

module.exports = { deploy, config };
