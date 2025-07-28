#!/usr/bin/env node

/**
 * TimeVault Troubleshooting & Fix Script
 * Comprehensive system diagnosis and automatic fixing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class TimeVaultTroubleshooter {
    constructor() {
        this.issues = [];
        this.fixes = [];
        this.projectRoot = process.cwd();
    }

    async runDiagnostics() {
        console.log('🔍 Starting TimeVault System Diagnostics...\n');

        // Check 1: Verify package.json integrity
        this.checkPackageJson();

        // Check 2: Verify TypeScript configuration
        this.checkTypeScriptConfig();

        // Check 3: Check for missing dependencies
        this.checkDependencies();

        // Check 4: Verify environment configuration
        this.checkEnvironmentConfig();

        // Check 5: Check for file structure issues
        this.checkFileStructure();

        // Check 6: Verify build configuration
        this.checkBuildConfig();

        // Check 7: Check for security vulnerabilities
        this.checkSecurity();

        // Generate report
        this.generateReport();

        // Apply fixes
        await this.applyFixes();
    }

    checkPackageJson() {
        console.log('📦 Checking package.json...');

        try {
            const packagePath = path.join(this.projectRoot, 'package.json');
            const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

            // Check required dependencies
            const requiredDeps = [
                'react', 'react-dom', 'typescript', 'vite',
                'dompurify', 'validator', 'axios'
            ];

            const missingDeps = requiredDeps.filter(dep =>
                !packageJson.dependencies?.[dep] && !packageJson.devDependencies?.[dep]
            );

            if (missingDeps.length > 0) {
                this.issues.push({
                    type: 'missing_dependencies',
                    severity: 'high',
                    description: `Missing dependencies: ${missingDeps.join(', ')}`,
                    fix: () => this.installMissingDependencies(missingDeps)
                });
            }

            // Check scripts
            const requiredScripts = ['dev', 'build', 'type-check'];
            const missingScripts = requiredScripts.filter(script => !packageJson.scripts?.[script]);

            if (missingScripts.length > 0) {
                this.issues.push({
                    type: 'missing_scripts',
                    severity: 'medium',
                    description: `Missing scripts: ${missingScripts.join(', ')}`,
                    fix: () => this.addMissingScripts(missingScripts)
                });
            }

            console.log('✅ package.json check completed');
        } catch (error) {
            this.issues.push({
                type: 'package_json_error',
                severity: 'critical',
                description: `package.json error: ${error.message}`,
                fix: () => this.fixPackageJson()
            });
        }
    }

    checkTypeScriptConfig() {
        console.log('🔧 Checking TypeScript configuration...');

        const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');

        if (!fs.existsSync(tsconfigPath)) {
            this.issues.push({
                type: 'missing_tsconfig',
                severity: 'high',
                description: 'tsconfig.json is missing',
                fix: () => this.createTsConfig()
            });
        } else {
            try {
                const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

                // Check for essential compiler options
                const requiredOptions = {
                    target: 'ES2020',
                    lib: ['ES2020', 'DOM', 'DOM.Iterable'],
                    allowJs: true,
                    skipLibCheck: true,
                    esModuleInterop: true,
                    allowSyntheticDefaultImports: true,
                    strict: true,
                    forceConsistentCasingInFileNames: true,
                    moduleResolution: 'node',
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    jsx: 'react-jsx'
                };

                const missingOptions = Object.entries(requiredOptions)
                    .filter(([key, value]) => tsconfig.compilerOptions?.[key] !== value)
                    .map(([key]) => key);

                if (missingOptions.length > 0) {
                    this.issues.push({
                        type: 'tsconfig_incomplete',
                        severity: 'medium',
                        description: `TypeScript config missing options: ${missingOptions.join(', ')}`,
                        fix: () => this.updateTsConfig(requiredOptions)
                    });
                }

                console.log('✅ TypeScript configuration check completed');
            } catch (error) {
                this.issues.push({
                    type: 'tsconfig_invalid',
                    severity: 'high',
                    description: `Invalid tsconfig.json: ${error.message}`,
                    fix: () => this.createTsConfig()
                });
            }
        }
    }

    checkDependencies() {
        console.log('📚 Checking dependencies...');

        try {
            execSync('npm list', { stdio: 'pipe' });
            console.log('✅ Dependencies check completed');
        } catch (error) {
            this.issues.push({
                type: 'dependency_issues',
                severity: 'high',
                description: 'Dependency conflicts or missing packages detected',
                fix: () => this.fixDependencies()
            });
        }
    }

    checkEnvironmentConfig() {
        console.log('⚙️ Checking environment configuration...');

        const envPath = path.join(this.projectRoot, '.env');
        const envExamplePath = path.join(this.projectRoot, '.env.example');

        if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
            this.issues.push({
                type: 'missing_env',
                severity: 'medium',
                description: '.env file is missing',
                fix: () => this.createEnvFile()
            });
        }

        console.log('✅ Environment configuration check completed');
    }

    checkFileStructure() {
        console.log('📁 Checking file structure...');

        const requiredFiles = [
            'src/main.tsx',
            'src/App.tsx',
            'src/index.css',
            'src/vite-env.d.ts'
        ];

        const missingFiles = requiredFiles.filter(file =>
            !fs.existsSync(path.join(this.projectRoot, file))
        );

        if (missingFiles.length > 0) {
            this.issues.push({
                type: 'missing_files',
                severity: 'high',
                description: `Missing required files: ${missingFiles.join(', ')}`,
                fix: () => this.createMissingFiles(missingFiles)
            });
        }

        console.log('✅ File structure check completed');
    }

    checkBuildConfig() {
        console.log('🏗️ Checking build configuration...');

        const viteConfigPath = path.join(this.projectRoot, 'vite.config.ts');

        if (!fs.existsSync(viteConfigPath)) {
            this.issues.push({
                type: 'missing_vite_config',
                severity: 'high',
                description: 'vite.config.ts is missing',
                fix: () => this.createViteConfig()
            });
        }

        console.log('✅ Build configuration check completed');
    }

    checkSecurity() {
        console.log('🔒 Checking security...');

        try {
            execSync('npm audit --audit-level=high', { stdio: 'pipe' });
            console.log('✅ Security check completed - no high-risk vulnerabilities');
        } catch (error) {
            this.issues.push({
                type: 'security_vulnerabilities',
                severity: 'high',
                description: 'High-risk security vulnerabilities detected',
                fix: () => this.fixSecurityIssues()
            });
        }
    }

    generateReport() {
        console.log('\n📊 DIAGNOSTIC REPORT');
        console.log('='.repeat(50));

        if (this.issues.length === 0) {
            console.log('🎉 No issues detected! TimeVault is ready to go.');
            return;
        }

        console.log(`Found ${this.issues.length} issue(s):\n`);

        this.issues.forEach((issue, index) => {
            const severityIcon = {
                critical: '🔴',
                high: '🟠',
                medium: '🟡',
                low: '🟢'
            }[issue.severity];

            console.log(`${index + 1}. ${severityIcon} [${issue.severity.toUpperCase()}] ${issue.type}`);
            console.log(`   ${issue.description}\n`);
        });
    }

    async applyFixes() {
        if (this.issues.length === 0) return;

        console.log('🔧 APPLYING FIXES');
        console.log('='.repeat(50));

        for (const issue of this.issues) {
            try {
                console.log(`Fixing: ${issue.description}...`);
                await issue.fix();
                console.log('✅ Fixed successfully\n');
                this.fixes.push(issue.type);
            } catch (error) {
                console.log(`❌ Failed to fix: ${error.message}\n`);
            }
        }

        console.log(`🎉 Applied ${this.fixes.length} fixes successfully!`);

        if (this.fixes.length > 0) {
            console.log('\n🚀 Running final verification...');
            try {
                execSync('npm run type-check', { stdio: 'inherit' });
                console.log('✅ TypeScript compilation successful');

                execSync('npm run build', { stdio: 'inherit' });
                console.log('✅ Build successful');

                console.log('\n🎉 TimeVault is now fully operational!');
            } catch (error) {
                console.log('⚠️ Some issues may remain. Please check the output above.');
            }
        }
    }

    // Fix methods
    installMissingDependencies(deps) {
        execSync(`npm install ${deps.join(' ')}`, { stdio: 'inherit' });
    }

    addMissingScripts(scripts) {
        const packagePath = path.join(this.projectRoot, 'package.json');
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

        const defaultScripts = {
            dev: 'vite',
            build: 'tsc && vite build',
            'type-check': 'tsc --noEmit'
        };

        scripts.forEach(script => {
            if (defaultScripts[script]) {
                packageJson.scripts[script] = defaultScripts[script];
            }
        });

        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    }

    fixPackageJson() {
        // Create a minimal working package.json
        const packageJson = {
            name: "timevault-mvp",
            private: true,
            version: "1.0.0",
            type: "module",
            scripts: {
                dev: "vite",
                build: "tsc && vite build",
                preview: "vite preview",
                "type-check": "tsc --noEmit"
            },
            dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0"
            },
            devDependencies: {
                "@types/react": "^18.2.43",
                "@types/react-dom": "^18.2.17",
                "@vitejs/plugin-react": "^4.2.1",
                typescript: "^5.2.2",
                vite: "^5.0.8"
            }
        };

        fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
    }

    createTsConfig() {
        const tsconfig = {
            compilerOptions: {
                target: "ES2020",
                useDefineForClassFields: true,
                lib: ["ES2020", "DOM", "DOM.Iterable"],
                module: "ESNext",
                skipLibCheck: true,
                moduleResolution: "node",
                allowImportingTsExtensions: true,
                resolveJsonModule: true,
                isolatedModules: true,
                noEmit: true,
                jsx: "react-jsx",
                strict: true,
                noUnusedLocals: true,
                noUnusedParameters: true,
                noFallthroughCasesInSwitch: true
            },
            include: ["src"],
            references: [{ path: "./tsconfig.node.json" }]
        };

        fs.writeFileSync('tsconfig.json', JSON.stringify(tsconfig, null, 2));
    }

    updateTsConfig(options) {
        const tsconfigPath = path.join(this.projectRoot, 'tsconfig.json');
        const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

        tsconfig.compilerOptions = { ...tsconfig.compilerOptions, ...options };

        fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
    }

    fixDependencies() {
        execSync('npm install', { stdio: 'inherit' });
    }

    createEnvFile() {
        const envContent = `# TimeVault Environment Configuration
VITE_APP_NAME=TimeVault
VITE_APP_VERSION=1.0.0
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_METALS_API_URL=https://api.metals.live/v1
VITE_API_TIMEOUT=10000
VITE_CACHE_ENABLED=true
VITE_ENHANCED_SECURITY=true
`;
        fs.writeFileSync('.env', envContent);
    }

    createMissingFiles(files) {
        const templates = {
            'src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`,
            'src/App.tsx': `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>TimeVault</h1>
      <p>Convert crypto to precious metals and time</p>
    </div>
  );
}

export default App;`,
            'src/index.css': `body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: linear-gradient(135deg, #001F3F 0%, #003366 100%);
  color: white;
}`,
            'src/vite-env.d.ts': `/// <reference types="vite/client" />`
        };

        files.forEach(file => {
            const filePath = path.join(this.projectRoot, file);
            const dir = path.dirname(filePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            if (templates[file]) {
                fs.writeFileSync(filePath, templates[file]);
            }
        });
    }

    createViteConfig() {
        const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
});`;

        fs.writeFileSync('vite.config.ts', viteConfig);
    }

    fixSecurityIssues() {
        try {
            execSync('npm audit fix', { stdio: 'inherit' });
        } catch (error) {
            console.log('Auto-fix failed. Manual review may be required.');
        }
    }
}

// Run the troubleshooter
if (require.main === module) {
    const troubleshooter = new TimeVaultTroubleshooter();
    troubleshooter.runDiagnostics().catch(console.error);
}

module.exports = TimeVaultTroubleshooter;
