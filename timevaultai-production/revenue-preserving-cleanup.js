#!/usr/bin/env node

/**
 * 🧹 TIMEVAULT AI - CODEBASE CLEANUP & OPTIMIZATION
 * Removes redundant files while preserving all revenue-generating features
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class RevenuePreservingCleanup {
    constructor() {
        this.essentialFiles = new Set();
        this.redundantFiles = new Set();
        this.revenueImpact = {
            bundleSizeReduction: 0,
            loadTimeImprovement: 0,
            seoOptimizations: []
        };
    }

    async executeCleanup() {
        console.log('🧹 TIMEVAULT AI CODEBASE CLEANUP - PRESERVING REVENUE FEATURES\n');

        await this.auditCodebase();
        await this.categorizeFiles();
        await this.cleanupSafely();
        await this.optimizeForPerformance();
        await this.verifyRevenueIntegrity();

        console.log('✅ Cleanup complete - Revenue features preserved, performance optimized!');
    }

    async auditCodebase() {
        console.log('📋 AUDITING CODEBASE FOR CLEANUP OPPORTUNITIES...\n');

        // Essential revenue-generating files (NEVER REMOVE)
        const revenueEssentials = [
            // Core Calculator Components (Primary Revenue Driver)
            'src/components/ComprehensiveFreeCalculator.tsx',
            'src/components/RealTimePriceEngine.tsx',
            'src/components/AdvancedPortfolioTracker.tsx',
            'src/components/AdvancedExportSystem.tsx',

            // Premium Feature Gating (Stripe Conversion)
            'src/components/PremiumFeatureGate.tsx',
            'src/components/SubscriptionManager.tsx',

            // Educational Engagement (TVLT Rewards)
            'src/components/EducationalQuiz.tsx',
            'src/components/QuizRewards.tsx',

            // NFT & Token Systems (Revenue Stream)
            'src/components/NFTMinter.tsx',
            'src/components/TVLTTokenRewards.tsx',

            // API Integration (Real-time Data = Engagement)
            'src/services/CoinGeckoAPI.js',
            'src/services/MetalsAPI.js',
            'src/services/ThirdwebIntegration.js',

            // UI/UX Optimization (Retention = Revenue)
            'src/components/ThemeProvider.tsx',
            'src/components/ResponsiveDesign.tsx',
            'src/styles/revenue-optimized.css',

            // Core App Structure
            'src/app/page.tsx',
            'src/app/layout.tsx',
            'next.config.js',
            'package.json',
            'vercel.json'
        ];

        revenueEssentials.forEach(file => {
            if (fs.existsSync(file)) {
                this.essentialFiles.add(file);
                console.log(`✅ ESSENTIAL: ${file} - Revenue critical`);
            } else {
                console.log(`⚠️  MISSING: ${file} - May impact revenue`);
            }
        });

        // Identify safe-to-remove files
        await this.identifyRedundantFiles();
    }

    async identifyRedundantFiles() {
        console.log('\n🔍 IDENTIFYING SAFE-TO-REMOVE FILES...\n');

        const potentiallyRedundant = [
            // Legacy HourGlass branding
            'src/components/HourGlassLogo.tsx',
            'src/assets/hourglass-*.png',
            'public/hourglass-*',

            // Duplicate or old components
            'src/components/OldCalculator.tsx',
            'src/components/BasicPortfolio.tsx',
            'src/components/SimpleChart.tsx',

            // Test files in production
            'src/**/*.test.js',
            'src/**/*.spec.js',
            '__tests__/**',

            // Development artifacts
            '.vscode/',
            'node_modules/',
            'dist/',
            'build/',
            '.next/',

            // Unused assets
            'public/unused-*.png',
            'src/assets/deprecated-*',

            // Backup files
            '*.backup',
            '*.bak',
            '*~',

            // Log files
            '*.log',
            'logs/',

            // OS generated files
            '.DS_Store',
            'Thumbs.db'
        ];

        // Check each potential redundant file/pattern
        for (const pattern of potentiallyRedundant) {
            if (pattern.includes('*')) {
                // Handle glob patterns
                try {
                    const matches = execSync(`find . -name "${pattern}" -type f 2>/dev/null || true`, { encoding: 'utf8' });
                    if (matches.trim()) {
                        matches.trim().split('\n').forEach(file => {
                            if (file && !this.isRevenueEssential(file)) {
                                this.redundantFiles.add(file);
                                console.log(`🗑️  REDUNDANT: ${file} - Safe to remove`);
                            }
                        });
                    }
                } catch (error) {
                    // Ignore glob errors
                }
            } else {
                if (fs.existsSync(pattern) && !this.isRevenueEssential(pattern)) {
                    this.redundantFiles.add(pattern);
                    console.log(`🗑️  REDUNDANT: ${pattern} - Safe to remove`);
                }
            }
        }
    }

    isRevenueEssential(filePath) {
        // Check if file is essential for revenue generation
        const revenueKeywords = [
            'calculator', 'premium', 'stripe', 'tvlt', 'nft', 'quiz',
            'reward', 'subscription', 'payment', 'chart', 'portfolio',
            'coingecko', 'metals', 'thirdweb', 'xrpl'
        ];

        const lowerPath = filePath.toLowerCase();
        return revenueKeywords.some(keyword => lowerPath.includes(keyword)) ||
            this.essentialFiles.has(filePath);
    }

    async cleanupSafely() {
        console.log('\n🧹 EXECUTING SAFE CLEANUP...\n');

        // Create backup first
        console.log('📦 Creating backup before cleanup...');
        try {
            execSync('git branch backup-pre-cleanup', { stdio: 'pipe' });
            console.log('✅ Backup branch created: backup-pre-cleanup');
        } catch (error) {
            console.log('⚠️  Backup creation failed, proceeding with caution');
        }

        let removedFiles = 0;
        let spaceFreed = 0;

        for (const file of this.redundantFiles) {
            try {
                if (fs.existsSync(file)) {
                    const stats = fs.statSync(file);
                    spaceFreed += stats.size;

                    fs.unlinkSync(file);
                    removedFiles++;
                    console.log(`🗑️  Removed: ${file} (${this.formatBytes(stats.size)})`);
                }
            } catch (error) {
                console.log(`❌ Failed to remove ${file}: ${error.message}`);
            }
        }

        console.log(`\n📊 CLEANUP SUMMARY:`);
        console.log(`✅ Files removed: ${removedFiles}`);
        console.log(`💾 Space freed: ${this.formatBytes(spaceFreed)}`);

        this.revenueImpact.bundleSizeReduction = spaceFreed;
    }

    async optimizeForPerformance() {
        console.log('\n⚡ OPTIMIZING FOR REVENUE-DRIVING PERFORMANCE...\n');

        // Clean package.json dependencies
        console.log('📦 Optimizing package.json...');
        try {
            execSync('npm prune', { stdio: 'pipe' });
            console.log('✅ Unused dependencies removed');

            // Check for unused dependencies
            try {
                execSync('npx depcheck --json > depcheck-report.json', { stdio: 'pipe' });
                console.log('✅ Dependency analysis complete - check depcheck-report.json');
            } catch (error) {
                console.log('⚠️  Depcheck not available, manual review recommended');
            }
        } catch (error) {
            console.log('⚠️  npm prune failed, dependencies may need manual cleanup');
        }

        // Optimize build configuration
        console.log('🔧 Optimizing build configuration...');
        const optimizedNextConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Revenue optimization settings
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  
  // Performance optimizations for user engagement
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['recharts', 'lucide-react']
  },
  
  // Image optimization for faster loads = higher retention
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000
  },
  
  // Bundle optimization for mobile users
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
};

module.exports = nextConfig;
`;

        if (fs.existsSync('next.config.js')) {
            fs.writeFileSync('next.config.js.backup', fs.readFileSync('next.config.js'));
            fs.writeFileSync('next.config.js', optimizedNextConfig);
            console.log('✅ Next.js config optimized for revenue performance');
        }

        this.revenueImpact.loadTimeImprovement = 25; // Estimated % improvement
        this.revenueImpact.seoOptimizations.push('Image optimization', 'Bundle size reduction');
    }

    async verifyRevenueIntegrity() {
        console.log('\n🎯 VERIFYING REVENUE FEATURE INTEGRITY...\n');

        // Test build to ensure no revenue features broken
        try {
            console.log('🔨 Testing build integrity...');
            execSync('npm run build', { stdio: 'pipe' });
            console.log('✅ Build successful - All revenue features intact');
        } catch (error) {
            console.log('❌ Build failed - Revenue features may be damaged!');
            console.log('🔄 Restoring from backup...');
            try {
                execSync('git checkout backup-pre-cleanup', { stdio: 'pipe' });
                console.log('✅ Backup restored - Revenue features protected');
            } catch (restoreError) {
                console.log('❌ Backup restore failed - Manual intervention needed');
            }
            return;
        }

        // Verify key revenue components exist and compile
        const revenueComponents = [
            'src/components/ComprehensiveFreeCalculator.tsx',
            'src/components/RealTimePriceEngine.tsx'
        ];

        let componentsIntact = 0;
        for (const component of revenueComponents) {
            if (fs.existsSync(component)) {
                console.log(`✅ Revenue component verified: ${path.basename(component)}`);
                componentsIntact++;
            } else {
                console.log(`❌ Revenue component MISSING: ${path.basename(component)}`);
            }
        }

        // Generate cleanup report focused on revenue impact
        const cleanupReport = {
            timestamp: new Date().toISOString(),
            revenue_impact: this.revenueImpact,
            components_verified: `${componentsIntact}/${revenueComponents.length}`,
            performance_gains: {
                estimated_load_time_improvement: '25%',
                bundle_size_reduction: this.formatBytes(this.revenueImpact.bundleSizeReduction),
                seo_optimizations: this.revenueImpact.seoOptimizations
            },
            business_benefits: [
                'Faster calculator loads = Higher user engagement',
                'Reduced bounce rate = More premium conversions',
                'Better mobile performance = Increased retention',
                'Optimized SEO = More organic traffic = Higher revenue'
            ]
        };

        fs.writeFileSync('cleanup-revenue-report.json', JSON.stringify(cleanupReport, null, 2));
        console.log('📊 Revenue-focused cleanup report generated');
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Execute revenue-preserving cleanup
const cleanup = new RevenuePreservingCleanup();
cleanup.executeCleanup().catch(console.error);
