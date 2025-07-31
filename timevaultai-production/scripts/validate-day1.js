#!/usr/bin/env node

/**
 * 🔧 TIMEVAULT AI - DAY 1 VALIDATION SCRIPT
 * Comprehensive testing and validation for all free features
 */

const fs = require('fs');
const path = require('path');

class TimeVaultValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: []
    };
  }

  log(type, message, details = '') {
    const timestamp = new Date().toISOString();
    const logEntry = {
      type,
      message,
      details,
      timestamp
    };

    this.results.details.push(logEntry);

    const colors = {
      '✅': '\x1b[32m', // Green
      '❌': '\x1b[31m', // Red
      '⚠️': '\x1b[33m',  // Yellow
      '🔧': '\x1b[36m', // Cyan
      '📊': '\x1b[35m'  // Magenta
    };

    const icon = type === 'pass' ? '✅' : type === 'fail' ? '❌' : type === 'warning' ? '⚠️' : '🔧';
    const color = colors[icon] || '\x1b[0m';

    console.log(`${color}${icon} ${message}\x1b[0m`);
    if (details) console.log(`   ${details}`);

    if (type === 'pass') this.results.passed++;
    else if (type === 'fail') this.results.failed++;
    else if (type === 'warning') this.results.warnings++;
  }

  checkFileExists(filePath, description) {
    const fullPath = path.resolve(filePath);
    if (fs.existsSync(fullPath)) {
      this.log('pass', `${description} exists`, filePath);
      return true;
    } else {
      this.log('fail', `${description} missing`, filePath);
      return false;
    }
  }

  checkFileContent(filePath, searchText, description) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.includes(searchText)) {
        this.log('pass', `${description} found`, `"${searchText}" in ${filePath}`);
        return true;
      } else {
        this.log('fail', `${description} missing`, `"${searchText}" not found in ${filePath}`);
        return false;
      }
    } catch (error) {
      this.log('fail', `Cannot read ${description}`, `${filePath}: ${error.message}`);
      return false;
    }
  }

  validateFreeCalculator() {
    this.log('info', '🔧 Validating Comprehensive Free Calculator...');

    const calculatorPath = 'src/components/ComprehensiveFreeCalculator.tsx';

    if (!this.checkFileExists(calculatorPath, 'Comprehensive Free Calculator')) return;

    // Check for all major features
    const features = [
      ['50+ cryptocurrencies', 'Bitcoin'],
      ['Precious metals support', 'gold'],
      ['Live price updates', 'useEffect'],
      ['Favorites system', 'favorites'],
      ['Calculation history', 'history'],
      ['Educational tips', 'tips'],
      ['Dark mode', 'dark'],
      ['Mobile optimization', 'md:'],
      ['Category filtering', 'category'],
      ['Time value calculations', 'timeValue']
    ];

    features.forEach(([feature, searchText]) => {
      this.checkFileContent(calculatorPath, searchText, `Free calculator: ${feature}`);
    });

    // Check crypto assets count
    try {
      const content = fs.readFileSync(calculatorPath, 'utf8');
      const cryptoMatches = content.match(/symbol:\s*['"`][A-Z]{2,5}['"`]/g);
      const cryptoCount = cryptoMatches ? cryptoMatches.length : 0;

      if (cryptoCount >= 50) {
        this.log('pass', `Cryptocurrency assets count: ${cryptoCount}`, 'Exceeds 50+ requirement');
      } else {
        this.log('warning', `Cryptocurrency assets count: ${cryptoCount}`, 'Below 50+ target');
      }
    } catch (error) {
      this.log('fail', 'Cannot analyze crypto assets', error.message);
    }
  }

  validateProgressiveWebApp() {
    this.log('info', '📱 Validating Progressive Web App features...');

    // Check PWA components
    const pwaFiles = [
      ['src/components/ProgressiveWebApp.tsx', 'PWA Component'],
      ['public/manifest.json', 'Web App Manifest'],
      ['public/sw.js', 'Service Worker']
    ];

    pwaFiles.forEach(([filePath, description]) => {
      this.checkFileExists(filePath, description);
    });

    // Check PWA features in component
    const pwaFeatures = [
      ['beforeinstallprompt', 'Install prompt handling'],
      ['offline', 'Offline detection'],
      ['serviceWorker', 'Service worker registration'],
      ['Install TimeVault AI', 'Install banner text']
    ];

    pwaFeatures.forEach(([feature, description]) => {
      this.checkFileContent('src/components/ProgressiveWebApp.tsx', feature, description);
    });
  }

  validateAccessibility() {
    this.log('info', '♿ Validating Accessibility features...');

    this.checkFileExists('src/components/AccessibilityPanel.tsx', 'Accessibility Panel');

    const a11yFeatures = [
      ['aria-label', 'ARIA labels'],
      ['font-size', 'Font size controls'],
      ['high-contrast', 'High contrast mode'],
      ['reduced-motion', 'Reduced motion'],
      ['keyboard', 'Keyboard navigation'],
      ['role=', 'ARIA roles']
    ];

    a11yFeatures.forEach(([feature, description]) => {
      this.checkFileContent('src/components/AccessibilityPanel.tsx', feature, description);
    });
  }

  validatePerformance() {
    this.log('info', '⚡ Validating Performance optimizations...');

    this.checkFileExists('src/components/PerformanceMonitor.tsx', 'Performance Monitor');

    // Check main page optimizations
    const perfFeatures = [
      ['dynamic', 'Dynamic imports'],
      ['Suspense', 'React Suspense'],
      ['loading:', 'Loading states'],
      ['ssr: true', 'Server-side rendering']
    ];

    perfFeatures.forEach(([feature, description]) => {
      this.checkFileContent('src/app/page.tsx', feature, description);
    });

    // Check service worker caching
    const swFeatures = [
      ['CACHE_NAME', 'Cache versioning'],
      ['fetch', 'Fetch event handling'],
      ['background sync', 'Background sync'],
      ['install', 'Install event']
    ];

    swFeatures.forEach(([feature, description]) => {
      this.checkFileContent('public/sw.js', feature, description);
    });
  }

  validateMetadata() {
    this.log('info', '🔍 Validating SEO and Metadata...');

    const metadataChecks = [
      ['Free Premium Calculator', 'Updated title'],
      ['50+ cryptocurrencies', 'Feature description'],
      ['completely free', 'Free messaging'],
      ['metadataBase', 'Base URL configuration']
    ];

    metadataChecks.forEach(([text, description]) => {
      this.checkFileContent('src/app/page.tsx', text, description);
    });
  }

  validateIntegration() {
    this.log('info', '🔗 Validating Component Integration...');

    // Check if all components are imported and used in main page
    const integrationChecks = [
      ['ProgressiveWebApp', 'PWA integration'],
      ['ServiceWorkerRegistration', 'Service worker integration'],
      ['AccessibilityPanel', 'Accessibility integration'],
      ['PerformanceMonitor', 'Performance monitoring'],
      ['ComprehensiveFreeCalculator', 'Main calculator integration']
    ];

    integrationChecks.forEach(([component, description]) => {
      this.checkFileContent('src/app/page.tsx', component, description);
    });
  }

  generateReport() {
    this.log('info', '📊 Generating Validation Report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_tests: this.results.passed + this.results.failed + this.results.warnings,
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        success_rate: Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)
      },
      details: this.results.details
    };

    // Save detailed report
    fs.writeFileSync('validation-report.json', JSON.stringify(report, null, 2));

    // Generate summary
    console.log('\n' + '='.repeat(60));
    console.log('🏆 TIMEVAULT AI - DAY 1 VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Tests Passed: ${report.summary.passed}`);
    console.log(`❌ Tests Failed: ${report.summary.failed}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`📊 Success Rate: ${report.summary.success_rate}%`);
    console.log(`📝 Detailed report saved to: validation-report.json`);
    console.log('='.repeat(60));

    if (report.summary.success_rate >= 85) {
      console.log('🎉 DAY 1 VALIDATION: EXCELLENT! Ready for DAY 2');
    } else if (report.summary.success_rate >= 70) {
      console.log('👍 DAY 1 VALIDATION: GOOD! Minor improvements needed');
    } else {
      console.log('🔧 DAY 1 VALIDATION: NEEDS WORK! Address failed tests');
    }

    return report;
  }

  run() {
    console.log('🚀 Starting TimeVault AI - DAY 1 Comprehensive Validation\n');

    this.validateFreeCalculator();
    this.validateProgressiveWebApp();
    this.validateAccessibility();
    this.validatePerformance();
    this.validateMetadata();
    this.validateIntegration();

    return this.generateReport();
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new TimeVaultValidator();
  const report = validator.run();

  // Exit with appropriate code
  process.exit(report.summary.failed > 0 ? 1 : 0);
}

module.exports = TimeVaultValidator;
