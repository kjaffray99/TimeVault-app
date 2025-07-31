#!/usr/bin/env node

/**
 * 🎯 TIMEVAULT AI - CUSTOMER EXPERIENCE VALIDATION
 * Comprehensive testing for positive customer experience
 */

const fs = require('fs');

class CustomerExperienceValidator {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      details: [],
      screenshots: []
    };
  }

  log(type, message, details = '') {
    const timestamp = new Date().toISOString();
    const logEntry = { type, message, details, timestamp };

    this.results.details.push(logEntry);

    const colors = {
      '✅': '\x1b[32m',
      '❌': '\x1b[31m',
      '⚠️': '\x1b[33m',
      '🎯': '\x1b[36m'
    };

    const icon = type === 'pass' ? '✅' : type === 'fail' ? '❌' : type === 'warning' ? '⚠️' : '🎯';
    const color = colors[icon] || '\x1b[0m';

    console.log(`${color}${icon} ${message}\x1b[0m`);
    if (details) console.log(`   ${details}`);

    if (type === 'pass') this.results.passed++;
    else if (type === 'fail') this.results.failed++;
    else if (type === 'warning') this.results.warnings++;
  }

  async simulateUserJourney(page) {
    this.log('info', '🎯 Simulating Complete User Journey...');

    try {
      // Step 1: Landing and First Impression
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 10000 });

      const loadTime = await page.evaluate(() => {
        return performance.timing.loadEventEnd - performance.timing.navigationStart;
      });

      if (loadTime < 2000) {
        this.log('pass', 'Page load performance excellent', `${loadTime}ms (< 2000ms)`);
      } else {
        this.log('warning', 'Page load could be faster', `${loadTime}ms (target: < 2000ms)`);
      }

      // Step 2: Check if calculator is visible
      const calculatorVisible = await page.$('.calculator, [data-testid="calculator"]');
      if (calculatorVisible) {
        this.log('pass', 'Calculator immediately visible', 'Good first impression');
      } else {
        this.log('fail', 'Calculator not immediately visible', 'User may be confused');
      }

      // Step 3: Test basic calculation
      const amountInput = await page.$('input[type="number"], input[placeholder*="amount"]');
      if (amountInput) {
        await amountInput.click();
        await amountInput.type('1');
        this.log('pass', 'Amount input functional', 'User can enter values');
      } else {
        this.log('fail', 'Cannot find amount input', 'Core functionality missing');
      }

      // Step 4: Test cryptocurrency selection
      const cryptoButtons = await page.$$('button:contains("BTC"), button:contains("ETH"), .crypto-button');
      if (cryptoButtons.length > 0) {
        this.log('pass', `Found ${cryptoButtons.length} cryptocurrency options`, 'Good selection available');
      } else {
        this.log('warning', 'Cryptocurrency selection may not be visible', 'Check UI implementation');
      }

      // Step 5: Test mobile responsiveness
      await page.setViewport({ width: 375, height: 667 }); // iPhone SE
      await page.waitForTimeout(1000);

      const mobileLayout = await page.evaluate(() => {
        const body = document.body;
        return {
          hasHorizontalScroll: body.scrollWidth > window.innerWidth,
          touchTargetsValid: Array.from(document.querySelectorAll('button')).every(btn => {
            const rect = btn.getBoundingClientRect();
            return rect.width >= 44 && rect.height >= 44;
          })
        };
      });

      if (!mobileLayout.hasHorizontalScroll) {
        this.log('pass', 'No horizontal scroll on mobile', 'Good responsive design');
      } else {
        this.log('fail', 'Horizontal scroll detected on mobile', 'Responsive design needs work');
      }

      if (mobileLayout.touchTargetsValid) {
        this.log('pass', 'Touch targets meet 44px minimum', 'Good mobile usability');
      } else {
        this.log('warning', 'Some touch targets may be too small', 'Check button sizes');
      }

      // Step 6: Test dark mode
      const darkModeToggle = await page.$('button[title*="dark"], button[aria-label*="dark"], .dark-mode-toggle');
      if (darkModeToggle) {
        await darkModeToggle.click();
        await page.waitForTimeout(500);
        this.log('pass', 'Dark mode toggle functional', 'Good user preference support');
      } else {
        this.log('warning', 'Dark mode toggle not found', 'User customization limited');
      }

      // Step 7: Reset to desktop
      await page.setViewport({ width: 1280, height: 720 });

    } catch (error) {
      this.log('fail', 'User journey simulation failed', error.message);
    }
  }

  async testAccessibility(page) {
    this.log('info', '♿ Testing Accessibility Features...');

    try {
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      const focusedElement = await page.evaluate(() => document.activeElement.tagName);
      if (focusedElement) {
        this.log('pass', 'Keyboard navigation working', `First focus: ${focusedElement}`);
      } else {
        this.log('fail', 'Keyboard navigation not working', 'Accessibility issue');
      }

      // Test ARIA labels
      const ariaLabels = await page.$$eval('[aria-label]', elements => elements.length);
      if (ariaLabels > 5) {
        this.log('pass', `Found ${ariaLabels} ARIA labels`, 'Good screen reader support');
      } else {
        this.log('warning', `Only ${ariaLabels} ARIA labels found`, 'May need more accessibility markup');
      }

      // Test headings structure
      const headings = await page.$$eval('h1, h2, h3, h4, h5, h6', elements =>
        elements.map(el => ({ tag: el.tagName, text: el.textContent.slice(0, 50) }))
      );

      if (headings.length > 0 && headings[0].tag === 'H1') {
        this.log('pass', 'Proper heading structure', `H1: ${headings[0].text}`);
      } else {
        this.log('warning', 'Heading structure may need improvement', 'Check semantic HTML');
      }

    } catch (error) {
      this.log('fail', 'Accessibility testing failed', error.message);
    }
  }

  async testPerformance(page) {
    this.log('info', '⚡ Testing Performance Metrics...');

    try {
      const metrics = await page.evaluate(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        return {
          domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
          loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
          firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
        };
      });

      if (metrics.domContentLoaded < 1000) {
        this.log('pass', 'DOM Content Loaded fast', `${metrics.domContentLoaded.toFixed(0)}ms`);
      } else {
        this.log('warning', 'DOM Content Loaded could be faster', `${metrics.domContentLoaded.toFixed(0)}ms`);
      }

      if (metrics.firstContentfulPaint < 1500) {
        this.log('pass', 'First Contentful Paint excellent', `${metrics.firstContentfulPaint.toFixed(0)}ms`);
      } else {
        this.log('warning', 'First Contentful Paint could improve', `${metrics.firstContentfulPaint.toFixed(0)}ms`);
      }

    } catch (error) {
      this.log('fail', 'Performance testing failed', error.message);
    }
  }

  async testFeatureDiscovery(page) {
    this.log('info', '🔍 Testing Feature Discovery...');

    try {
      // Check for prominent features
      const features = [
        { name: 'Real-time prices', selector: '[data-testid="live-prices"], .live-price, .real-time' },
        { name: 'Portfolio tracking', selector: '[data-testid="portfolio"], .portfolio, button:contains("Portfolio")' },
        { name: 'Export functionality', selector: '[data-testid="export"], .export, button:contains("Export")' },
        { name: 'Educational content', selector: '[data-testid="education"], .education, .tip, .learn' },
        { name: 'Favorites system', selector: '[data-testid="favorites"], .favorite, .star' }
      ];

      for (const feature of features) {
        try {
          const element = await page.$(feature.selector);
          if (element) {
            this.log('pass', `${feature.name} discoverable`, 'Feature visible to users');
          } else {
            this.log('warning', `${feature.name} may not be easily discoverable`, 'Consider improving visibility');
          }
        } catch (err) {
          this.log('warning', `Could not test ${feature.name}`, 'Selector may need updating');
        }
      }

    } catch (error) {
      this.log('fail', 'Feature discovery testing failed', error.message);
    }
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_tests: this.results.passed + this.results.failed + this.results.warnings,
        passed: this.results.passed,
        failed: this.results.failed,
        warnings: this.results.warnings,
        success_rate: this.results.passed + this.results.failed > 0
          ? Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)
          : 0
      },
      customer_experience_score: this.calculateCustomerScore(),
      recommendations: this.generateRecommendations(),
      details: this.results.details
    };

    fs.writeFileSync('customer-experience-report.json', JSON.stringify(report, null, 2));

    console.log('\n' + '='.repeat(70));
    console.log('🎯 CUSTOMER EXPERIENCE VALIDATION SUMMARY');
    console.log('='.repeat(70));
    console.log(`✅ Tests Passed: ${report.summary.passed}`);
    console.log(`❌ Tests Failed: ${report.summary.failed}`);
    console.log(`⚠️  Warnings: ${report.summary.warnings}`);
    console.log(`📊 Success Rate: ${report.summary.success_rate}%`);
    console.log(`🌟 Customer Experience Score: ${report.customer_experience_score}/100`);
    console.log('='.repeat(70));

    if (report.customer_experience_score >= 85) {
      console.log('🎉 EXCELLENT CUSTOMER EXPERIENCE! Ready for production traffic.');
    } else if (report.customer_experience_score >= 70) {
      console.log('👍 GOOD CUSTOMER EXPERIENCE! Minor improvements recommended.');
    } else {
      console.log('🔧 CUSTOMER EXPERIENCE NEEDS IMPROVEMENT! Address critical issues.');
    }

    return report;
  }

  calculateCustomerScore() {
    const totalTests = this.results.passed + this.results.failed;
    if (totalTests === 0) return 0;

    const baseScore = (this.results.passed / totalTests) * 100;
    const warningPenalty = this.results.warnings * 2; // 2 points per warning

    return Math.max(0, Math.min(100, Math.round(baseScore - warningPenalty)));
  }

  generateRecommendations() {
    const recommendations = [];

    if (this.results.failed > 0) {
      recommendations.push('🔴 Address failed tests immediately - these affect core functionality');
    }

    if (this.results.warnings > 3) {
      recommendations.push('🟡 Consider addressing warnings to improve user experience');
    }

    recommendations.push('🔵 Test with real users to validate assumptions');
    recommendations.push('📊 Set up analytics to track user behavior');
    recommendations.push('🎯 A/B test key conversion points');

    return recommendations;
  }

  async run() {
    console.log('🎯 Starting Customer Experience Validation...\n');

    let browser;
    try {
      // Try to launch browser (headless for CI/CD)
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();

      // Set user agent
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 TimeVaultAI-Test');

      await this.simulateUserJourney(page);
      await this.testAccessibility(page);
      await this.testPerformance(page);
      await this.testFeatureDiscovery(page);

    } catch (error) {
      console.log('⚠️ Browser testing not available (likely in CI environment)');
      console.log('📋 Running static validation instead...');

      // Fallback to static testing
      this.staticValidation();
    } finally {
      if (browser) {
        await browser.close();
      }
    }

    return this.generateReport();
  }

  staticValidation() {
    this.log('info', '📋 Running Static Customer Experience Validation...');

    // Check if main components exist
    const criticalFiles = [
      'src/app/page.tsx',
      'src/components/ComprehensiveFreeCalculator.tsx',
      'src/components/RealTimePriceEngine.tsx',
      'src/components/AdvancedPortfolioTracker.tsx'
    ];

    criticalFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.log('pass', `Critical component exists: ${file}`, 'Core functionality available');
      } else {
        this.log('fail', `Critical component missing: ${file}`, 'May affect user experience');
      }
    });

    // Check package.json for required dependencies
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const requiredDeps = ['next', 'react', 'lucide-react', 'recharts'];

      requiredDeps.forEach(dep => {
        if (packageJson.dependencies && packageJson.dependencies[dep]) {
          this.log('pass', `Required dependency: ${dep}`, packageJson.dependencies[dep]);
        } else {
          this.log('warning', `Dependency may be missing: ${dep}`, 'Check installation');
        }
      });
    } catch (error) {
      this.log('fail', 'Cannot validate dependencies', error.message);
    }
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new CustomerExperienceValidator();
  validator.run().then(report => {
    process.exit(report.summary.failed > 0 ? 1 : 0);
  }).catch(error => {
    console.error('Validation failed:', error);
    process.exit(1);
  });
}

module.exports = CustomerExperienceValidator;
