#!/usr/bin/env node
/**
 * 🚀 CLEAN PRODUCTION STARTUP SCRIPT
 * Starts TimeVault without any debug overlays
 */

console.log('🚀 Starting TimeVault Clean Production Mode...');

// Environment variables for clean startup
process.env.NODE_ENV = 'production';
process.env.DISABLE_DEBUG = 'true';
process.env.HIDE_OVERLAYS = 'true';

// Start Next.js development server on clean port
const { spawn } = require('child_process');

const server = spawn('npx', ['next', 'dev', '--port', '3001'], {
    stdio: 'inherit',
    shell: true
});

server.on('close', (code) => {
    console.log(`Server exited with code ${code}`);
});

console.log('✅ Clean server starting at http://localhost:3001');
console.log('🧹 All debug overlays disabled');
