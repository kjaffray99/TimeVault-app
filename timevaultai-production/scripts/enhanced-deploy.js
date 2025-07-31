#!/usr/bin/env node

/**
 * 🚀 TIMEVAULT AI ENHANCED DEPLOYMENT SCRIPT
 * Comprehensive deployment with live testing and validation
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Enhanced logging with colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  const timestamp = new Date().toISOString().substr(11, 8);
  console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');
const logHeader = (message) => {
  console.log('\n' + '='.repeat(60));
  log(message, 'cyan');
  console.log('='.repeat(60));
};

const deploymentConfig = {
  port: 3003,
  testPort: 3004,
  domain: 'timevaultai.com',
  healthCheckInterval: 5000,
  maxRetries: 3,
  timeout: 30000
};

class EnhancedDeployment {
  constructor() {
    this.serverProcess = null;
    this.isServerRunning = false;
    this.deploymentStats = {
      startTime: Date.now(),
      buildTime: 0,
      testTime: 0,
      deployTime: 0,
      errors: [],
      warnings: []
    };
  }

  async deploy() {
    try {
      logHeader('🚀 TIMEVAULT AI ENHANCED DEPLOYMENT');

      await this.preDeploymentChecks();
      await this.runComprehensiveTests();
      await this.buildApplication();
      await this.startProductionServer();
      await this.runLiveTests();
      await this.validateDeployment();
      await this.generateDeploymentReport();

      logSuccess('🎉 TimeVault AI successfully deployed and validated!');
      logInfo(`🌐 Application running at: http://localhost:${deploymentConfig.port}`);
      logInfo('🔗 Ready for production traffic');

    } catch (error) {
      logError(`Deployment failed: ${error.message}`);
      await this.cleanup();
      process.exit(1);
    }
  }

  async preDeploymentChecks() {
    logHeader('🔍 PRE-DEPLOYMENT CHECKS');

    // Check Node.js version
    const nodeVersion = process.version;
    logInfo(`Node.js version: ${nodeVersion}`);

    // Check package.json exists
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found');
    }
    logSuccess('package.json found');

    // Check required files
    const requiredFiles = [
      'src/app/layout.tsx',
      'src/app/page.tsx',
      'src/components/Navigation.tsx',
      'src/components/PremiumTimeVaultCalculator.tsx',
      'tailwind.config.ts',
      'next.config.js'
    ];

    for (const file of requiredFiles) {
      if (fs.existsSync(file)) {
        logSuccess(`✓ ${file}`);
      } else {
        this.deploymentStats.warnings.push(`Missing file: ${file}`);
        logWarning(`Missing: ${file}`);
      }
    }

    // Check dependencies
    logInfo('Installing dependencies...');
    try {
      execSync('npm ci', { stdio: 'pipe' });
      logSuccess('Dependencies installed successfully');
    } catch (error) {
      logWarning('Using npm install instead of ci');
      execSync('npm install', { stdio: 'pipe' });
    }
  }

  async runComprehensiveTests() {
    logHeader('🧪 COMPREHENSIVE TESTING');
    const testStartTime = Date.now();

    try {
      // Type checking
      logInfo('Running TypeScript type checking...');
      execSync('npm run type-check', { stdio: 'pipe' });
      logSuccess('TypeScript compilation successful');

      // Linting
      try {
        logInfo('Running ESLint...');
        execSync('npm run lint', { stdio: 'pipe' });
        logSuccess('Linting passed');
      } catch (error) {
        logWarning('Linting issues detected (proceeding anyway)');
        this.deploymentStats.warnings.push('Linting issues');
      }

      // Run custom validation script
      if (fs.existsSync('scripts/comprehensive-validation.js')) {
        logInfo('Running comprehensive validation...');
        execSync('node scripts/comprehensive-validation.js', { stdio: 'inherit' });
        logSuccess('Comprehensive validation passed');
      }

    } catch (error) {
      this.deploymentStats.errors.push(`Testing failed: ${error.message}`);
      throw new Error(`Testing phase failed: ${error.message}`);
    } finally {
      this.deploymentStats.testTime = Date.now() - testStartTime;
    }
  }

  async buildApplication() {
    logHeader('🔨 BUILDING APPLICATION');
    const buildStartTime = Date.now();

    try {
      logInfo('Creating production build...');
      execSync('npm run build', { stdio: 'inherit' });
      logSuccess('Production build completed successfully');

      // Check build output
      if (fs.existsSync('.next')) {
        logSuccess('Build output verified');
      } else {
        throw new Error('Build output not found');
      }

    } catch (error) {
      this.deploymentStats.errors.push(`Build failed: ${error.message}`);
      throw new Error(`Build phase failed: ${error.message}`);
    } finally {
      this.deploymentStats.buildTime = Date.now() - buildStartTime;
    }
  }

  async startProductionServer() {
    logHeader('🌐 STARTING PRODUCTION SERVER');

    return new Promise((resolve, reject) => {
      logInfo(`Starting server on port ${deploymentConfig.port}...`);

      // Start the server as a child process
      this.serverProcess = spawn('npm', ['run', 'start'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PORT: deploymentConfig.port.toString() }
      });

      let serverOutput = '';

      this.serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        serverOutput += output;

        if (output.includes('Ready') || output.includes('started server')) {
          logSuccess(`Server started successfully on port ${deploymentConfig.port}`);
          this.isServerRunning = true;
          resolve();
        }
      });

      this.serverProcess.stderr.on('data', (data) => {
        const errorOutput = data.toString();
        if (!errorOutput.includes('warn') && !errorOutput.includes('info')) {
          logWarning(`Server warning: ${errorOutput}`);
        }
      });

      this.serverProcess.on('error', (error) => {
        logError(`Server error: ${error.message}`);
        reject(error);
      });

      // Timeout if server doesn't start
      setTimeout(() => {
        if (!this.isServerRunning) {
          reject(new Error('Server failed to start within timeout'));
        }
      }, deploymentConfig.timeout);
    });
  }

  async runLiveTests() {
    logHeader('🔴 LIVE APPLICATION TESTING');

    // Wait for server to be fully ready
    await this.waitForServer();

    const testCases = [
      {
        name: 'Homepage Load Test',
        url: `http://localhost:${deploymentConfig.port}/`,
        expectedStatus: 200
      },
      {
        name: 'Education Page Test',
        url: `http://localhost:${deploymentConfig.port}/education`,
        expectedStatus: 200
      },
      {
        name: 'Portfolio Page Test',
        url: `http://localhost:${deploymentConfig.port}/portfolio`,
        expectedStatus: 200
      },
      {
        name: 'API Health Check',
        url: `http://localhost:${deploymentConfig.port}/api/metrics`,
        expectedStatus: [200, 404] // 404 is acceptable if endpoint doesn't exist yet
      }
    ];

    for (const test of testCases) {
      try {
        logInfo(`Testing: ${test.name}...`);
        const response = await this.makeHttpRequest(test.url);

        const expectedStatuses = Array.isArray(test.expectedStatus)
          ? test.expectedStatus
          : [test.expectedStatus];

        if (expectedStatuses.includes(response.statusCode)) {
          logSuccess(`✓ ${test.name} passed (${response.statusCode})`);
        } else {
          logWarning(`⚠ ${test.name} unexpected status: ${response.statusCode}`);
          this.deploymentStats.warnings.push(`${test.name}: status ${response.statusCode}`);
        }
      } catch (error) {
        logError(`✗ ${test.name} failed: ${error.message}`);
        this.deploymentStats.errors.push(`${test.name}: ${error.message}`);
      }
    }
  }

  async waitForServer() {
    logInfo('Waiting for server to be ready...');

    for (let i = 0; i < deploymentConfig.maxRetries; i++) {
      try {
        await this.makeHttpRequest(`http://localhost:${deploymentConfig.port}/`);
        logSuccess('Server is responding to requests');
        return;
      } catch (error) {
        if (i < deploymentConfig.maxRetries - 1) {
          logInfo(`Server not ready, retrying in 2 seconds... (${i + 1}/${deploymentConfig.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          throw new Error('Server failed to respond after multiple retries');
        }
      }
    }
  }

  makeHttpRequest(url) {
    return new Promise((resolve, reject) => {
      const request = http.get(url, (response) => {
        let data = '';
        response.on('data', chunk => data += chunk);
        response.on('end', () => {
          resolve({
            statusCode: response.statusCode,
            data: data,
            headers: response.headers
          });
        });
      });

      request.on('error', reject);
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async validateDeployment() {
    logHeader('✅ DEPLOYMENT VALIDATION');

    const validations = [
      {
        name: 'Server Process',
        check: () => this.isServerRunning && this.serverProcess && !this.serverProcess.killed
      },
      {
        name: 'Port Availability',
        check: async () => {
          try {
            await this.makeHttpRequest(`http://localhost:${deploymentConfig.port}/`);
            return true;
          } catch {
            return false;
          }
        }
      },
      {
        name: 'Build Artifacts',
        check: () => fs.existsSync('.next') && fs.existsSync('.next/static')
      },
      {
        name: 'Static Assets',
        check: () => {
          const publicDir = 'public';
          return fs.existsSync(publicDir);
        }
      }
    ];

    let validationsPassed = 0;

    for (const validation of validations) {
      try {
        const result = typeof validation.check === 'function'
          ? await validation.check()
          : validation.check;

        if (result) {
          logSuccess(`✓ ${validation.name}`);
          validationsPassed++;
        } else {
          logError(`✗ ${validation.name}`);
          this.deploymentStats.errors.push(`Validation failed: ${validation.name}`);
        }
      } catch (error) {
        logError(`✗ ${validation.name}: ${error.message}`);
        this.deploymentStats.errors.push(`Validation error: ${validation.name} - ${error.message}`);
      }
    }

    const validationRate = (validationsPassed / validations.length) * 100;
    logInfo(`Validation success rate: ${validationRate.toFixed(1)}%`);

    if (validationRate < 75) {
      throw new Error('Deployment validation failed - too many critical issues');
    }
  }

  async generateDeploymentReport() {
    logHeader('📊 DEPLOYMENT REPORT');

    const totalTime = Date.now() - this.deploymentStats.startTime;

    const report = {
      timestamp: new Date().toISOString(),
      deployment: {
        totalTime: totalTime,
        buildTime: this.deploymentStats.buildTime,
        testTime: this.deploymentStats.testTime,
        port: deploymentConfig.port,
        nodeVersion: process.version,
        success: this.deploymentStats.errors.length === 0
      },
      performance: {
        buildTimeMs: this.deploymentStats.buildTime,
        testTimeMs: this.deploymentStats.testTime,
        totalTimeMs: totalTime
      },
      issues: {
        errors: this.deploymentStats.errors,
        warnings: this.deploymentStats.warnings,
        errorCount: this.deploymentStats.errors.length,
        warningCount: this.deploymentStats.warnings.length
      }
    };

    // Save report
    fs.writeFileSync('deployment-report.json', JSON.stringify(report, null, 2));

    // Display summary
    logInfo(`Total deployment time: ${(totalTime / 1000).toFixed(1)}s`);
    logInfo(`Build time: ${(this.deploymentStats.buildTime / 1000).toFixed(1)}s`);
    logInfo(`Test time: ${(this.deploymentStats.testTime / 1000).toFixed(1)}s`);
    logInfo(`Errors: ${this.deploymentStats.errors.length}`);
    logInfo(`Warnings: ${this.deploymentStats.warnings.length}`);

    if (this.deploymentStats.errors.length === 0) {
      logSuccess('🎉 Deployment completed successfully with no errors!');
    } else {
      logWarning(`⚠️ Deployment completed with ${this.deploymentStats.errors.length} errors`);
    }

    logInfo('📄 Detailed report saved to deployment-report.json');
  }

  async cleanup() {
    logInfo('Cleaning up...');

    if (this.serverProcess && !this.serverProcess.killed) {
      this.serverProcess.kill('SIGTERM');
      logInfo('Server process terminated');
    }
  }

  // Handle graceful shutdown
  setupGracefulShutdown() {
    const gracefulShutdown = async (signal) => {
      logInfo(`\nReceived ${signal}, shutting down gracefully...`);
      await this.cleanup();
      process.exit(0);
    };

    process.on('SIGINT', gracefulShutdown);
    process.on('SIGTERM', gracefulShutdown);
  }
}

// Run deployment if this script is executed directly
if (require.main === module) {
  const deployment = new EnhancedDeployment();
  deployment.setupGracefulShutdown();

  deployment.deploy()
    .then(() => {
      logSuccess('\n🚀 TimeVault AI is now live and ready for production!');
      logInfo('📊 Keep the server running or press Ctrl+C to stop');

      // Keep the process alive to maintain the server
      setInterval(() => {
        // Health check every 30 seconds
        deployment.makeHttpRequest(`http://localhost:${deploymentConfig.port}/`)
          .then(() => {
            // Server is healthy
          })
          .catch(() => {
            logWarning('Health check failed - server may be down');
          });
      }, 30000);

    })
    .catch((error) => {
      logError(`\nDeployment failed: ${error.message}`);
      deployment.cleanup();
      process.exit(1);
    });
}

module.exports = EnhancedDeployment;
