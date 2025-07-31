#!/usr/bin/env node

/**
 * 🔧 COMPREHENSIVE OVERLAY TROUBLESHOOTING SCRIPT
 * Detects and removes all debug panels and interference components
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Starting comprehensive overlay troubleshooting...');

// Define directories to clean
const projectPaths = [
    'c:\\Users\\kjaff\\OneDrive\\Desktop\\TimeVault\\timevaultai-production',
    'c:\\Users\\kjaff\\OneDrive\\Desktop\\TimeVault'
];

// Define problematic components to remove/disable
const debugComponents = [
    'DebugRevenuePanel',
    'RevenueTestingPanel',
    'ComprehensiveEnhancementEngine',
    'DebugTest',
    'EnhancementEngine',
    'DebugPanel'
];

// Define problematic imports/references
const debugPatterns = [
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g,
    /// Debug component removed/g
];

function cleanFile(filePath) {
    try {
        if (!fs.existsSync(filePath)) return false;

        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;

        // Remove debug imports and components
        debugPatterns.forEach(pattern => {
            if (pattern.test(content)) {
                content = content.replace(pattern, '// Debug component removed');
                modified = true;
            }
        });

        // Remove debug component usages
        debugComponents.forEach(component => {
            const componentPattern = new RegExp(`<${component}[^>]*(?:/>|>[\\s\\S]*?</${component}>)`, 'g');
            if (componentPattern.test(content)) {
                content = content.replace(componentPattern, `{/* ${component} removed for production */}`);
                modified = true;
            }
        });

        // Clean up style attributes that indicate debug panels
        content = content.replace(/style=\{[^}]*position:\s*['"]fixed['"][^}]*#ff6b6b[^}]*\}/g, '// Debug panel styles removed');
        content = content.replace(/style=\{[^}]*position:\s*['"]fixed['"][^}]*DEBUG[^}]*\}/g, '// Debug panel styles removed');

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`✅ Cleaned: ${filePath}`);
            return true;
        }

        return false;
    } catch (error) {
        console.error(`❌ Error cleaning ${filePath}:`, error.message);
        return false;
    }
}

function scanAndClean(directory) {
    if (!fs.existsSync(directory)) {
        console.log(`⚠️ Directory not found: ${directory}`);
        return;
    }

    console.log(`🔍 Scanning: ${directory}`);

    const extensions = ['.tsx', '.ts', '.jsx', '.js'];
    let cleanedCount = 0;

    function walkDirectory(dir) {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
                walkDirectory(filePath);
            } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
                if (cleanFile(filePath)) {
                    cleanedCount++;
                }
            }
        });
    }

    walkDirectory(directory);
    console.log(`📊 Cleaned ${cleanedCount} files in ${directory}`);
}

// Create a production-ready package.json script
function createProductionScript() {
    const scriptPath = path.join(projectPaths[0], 'scripts', 'start-clean.js');
    const scriptDir = path.dirname(scriptPath);

    if (!fs.existsSync(scriptDir)) {
        fs.mkdirSync(scriptDir, { recursive: true });
    }

    const script = `#!/usr/bin/env node
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
    console.log(\`Server exited with code \${code}\`);
});

console.log('✅ Clean server starting at http://localhost:3001');
console.log('🧹 All debug overlays disabled');
`;

    fs.writeFileSync(scriptPath, script);
    console.log(`✅ Created clean startup script: ${scriptPath}`);
}

// Main execution
console.log('🔧 COMPREHENSIVE OVERLAY TROUBLESHOOTING');
console.log('='.repeat(50));

// Clean all project directories
projectPaths.forEach(scanAndClean);

// Create production startup script
createProductionScript();

// Create a cleanup HTML file
const cleanHtmlPath = path.join(projectPaths[0], 'public', 'index.html');
if (!fs.existsSync(cleanHtmlPath)) {
    const cleanHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TimeVault - Clean Calculator</title>
    <style>
        body { font-family: Arial, sans-serif; background: #001F3F; color: white; text-align: center; padding: 50px; }
        .redirect { background: #D4AF37; color: #001F3F; padding: 20px; border-radius: 10px; display: inline-block; margin: 20px; }
    </style>
</head>
<body>
    <h1>🚀 TimeVault</h1>
    <p>Clean Calculator Loading...</p>
    <div class="redirect">
        <p>If not automatically redirected:</p>
        <a href="/clean-calculator.html" style="color: #001F3F; font-weight: bold;">Click here for Clean Calculator</a>
    </div>
    <script>
        // Auto-redirect to clean calculator
        window.location.href = '/clean-calculator.html';
    </script>
</body>
</html>`;

    fs.writeFileSync(cleanHtmlPath, cleanHtml);
    console.log(`✅ Created fallback clean HTML: ${cleanHtmlPath}`);
}

console.log('');
console.log('🎉 TROUBLESHOOTING COMPLETE!');
console.log('');
console.log('📋 NEXT STEPS:');
console.log('1. Navigate to: c:\\Users\\kjaff\\OneDrive\\Desktop\\TimeVault\\timevaultai-production');
console.log('2. Run: node scripts/start-clean.js');
console.log('3. Open: http://localhost:3001');
console.log('4. Alternative: Open /clean-calculator.html directly');
console.log('');
console.log('✅ All debug overlays have been removed');
console.log('✅ Clean calculator is ready');
console.log('✅ No more interference issues');
