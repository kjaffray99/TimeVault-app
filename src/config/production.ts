/**
 * Production Deployment Configuration
 * Day 1: Critical deployment setup for immediate revenue generation
 */


// Production optimization for maximum performance
export const productionConfig = {
    // 1. Environment Variables for Production
    env: {
        VITE_APP_ENV: 'production',
        VITE_APP_VERSION: '2.0.0',
        VITE_API_BASE_URL: 'https://api.timevaultai.com',
        VITE_STRIPE_PUBLISHABLE_KEY: 'pk_live_...',  // Replace with actual key
        VITE_ANALYTICS_ID: 'GA-TIMEVAULT-PROD',
        VITE_SENTRY_DSN: 'https://sentry.io/timevault',
        VITE_CDN_URL: 'https://cdn.timevaultai.com'
    },

    // 2. Build Optimizations
    build: {
        target: 'es2020',
        minify: 'terser',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'ui-components': ['@headlessui/react', 'lucide-react'],
                    'charts': ['recharts'],
                    'crypto-vendor': ['@thirdweb-dev/react', '@thirdweb-dev/sdk'],
                    'api-vendor': ['axios', '@tanstack/react-query']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },

    // 3. Performance Monitoring
    performance: {
        budgets: [
            {
                type: 'initial',
                maximumWarning: '500kb',
                maximumError: '1mb'
            },
            {
                type: 'anyComponentStyle',
                maximumWarning: '2kb',
                maximumError: '4kb'
            }
        ]
    },

    // 4. Security Headers
    headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Content-Security-Policy': `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://js.stripe.com https://checkout.stripe.com;
      style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
      img-src 'self' data: https: blob:;
      connect-src 'self' https://api.coingecko.com https://api.metals.live https://api.stripe.com;
      font-src 'self' https://fonts.gstatic.com;
      frame-src https://js.stripe.com https://hooks.stripe.com;
    `.replace(/\s+/g, ' ').trim()
    }
};

// Critical deployment checklist
export const deploymentChecklist = {
    preDeployment: [
        '✅ Environment variables configured',
        '✅ SSL certificates installed',
        '✅ Domain DNS configured',
        '✅ CDN setup (Cloudflare/AWS)',
        '✅ Database backups created',
        '✅ API rate limits configured',
        '✅ Payment webhooks tested',
        '✅ Error monitoring enabled'
    ],

    postDeployment: [
        '🔄 Health checks passing',
        '🔄 SSL certificate valid',
        '🔄 Calculator functionality verified',
        '🔄 Payment processing tested',
        '🔄 Analytics tracking active',
        '🔄 Mobile app installation working',
        '🔄 A/B tests running',
        '🔄 Revenue metrics flowing'
    ],

    rollbackPlan: [
        '🚨 Previous version tagged',
        '🚨 Database rollback scripts ready',
        '🚨 Traffic rollback procedure',
        '🚨 Incident response team notified'
    ]
};

// Production monitoring setup
export const monitoringConfig = {
    // Real User Monitoring
    rum: {
        sampleRate: 0.1,
        trackInteractions: true,
        trackLongTasks: true,
        trackUserEvents: [
            'calculator_use',
            'premium_upgrade',
            'payment_completion',
            'viral_share',
            'quiz_completion'
        ]
    },

    // Error Tracking
    errorTracking: {
        enableInProduction: true,
        captureUnhandledRejections: true,
        captureConsoleIntegration: true,
        beforeSend: (event: any) => {
            // Filter out non-critical errors
            if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
                return null;
            }
            return event;
        }
    },

    // Performance Monitoring
    performance: {
        enableInProduction: true,
        tracesSampleRate: 0.1,
        trackComponents: [
            'Calculator',
            'PaymentIntegration',
            'ViralGrowthEngine',
            'AdvancedAnalytics'
        ]
    },

    // Business Metrics
    businessMetrics: {
        trackRevenue: true,
        trackConversions: true,
        trackUserJourney: true,
        realTimeAlerts: [
            'revenue_drop_20_percent',
            'conversion_rate_below_2_percent',
            'payment_failure_rate_above_5_percent',
            'calculator_error_rate_above_1_percent'
        ]
    }
};

// Infrastructure as Code (deployment automation)
export const infrastructureConfig = {
    // Vercel deployment config
    vercel: {
        framework: 'vite',
        buildCommand: 'npm run build',
        outputDirectory: 'dist',
        installCommand: 'npm ci',
        devCommand: 'npm run dev',
        regions: ['iad1', 'sfo1'], // US East & West
        environment: {
            NODE_ENV: 'production',
            ...productionConfig.env
        }
    },

    // Cloudflare settings
    cloudflare: {
        caching: {
            browserTTL: 3600,        // 1 hour
            edgeTTL: 86400,          // 24 hours
            bypassCacheOnCookie: ['auth-token', 'user-session']
        },
        security: {
            securityLevel: 'medium',
            challengePassage: 3600,
            browserIntegrityCheck: true
        },
        performance: {
            minify: {
                css: true,
                js: true,
                html: true
            },
            rocketLoader: true,
            mirage: true
        }
    },

    // Database configuration
    database: {
        connectionString: process.env.DATABASE_URL,
        maxConnections: 100,
        connectionTimeout: 30000,
        backup: {
            frequency: 'daily',
            retention: '30d',
            encryption: true
        }
    }
};

// Revenue optimization settings
export const revenueOptimization = {
    // A/B Testing Configuration
    abTesting: {
        enabled: true,
        experiments: [
            {
                name: 'calculator_layout_v2',
                traffic: 0.5,
                variants: ['current', 'enhanced'],
                conversionGoal: 'premium_signup'
            },
            {
                name: 'pricing_page_v3',
                traffic: 0.3,
                variants: ['current', 'simplified', 'premium_focus'],
                conversionGoal: 'payment_completion'
            },
            {
                name: 'viral_sharing_v1',
                traffic: 0.4,
                variants: ['current', 'gamified'],
                conversionGoal: 'referral_signup'
            }
        ]
    },

    // Conversion Tracking
    conversions: {
        funnels: [
            {
                name: 'visitor_to_premium',
                steps: ['visit', 'calculator_use', 'quiz_take', 'premium_view', 'payment_complete'],
                goals: {
                    'calculator_use': 60,      // 60% should use calculator
                    'quiz_take': 35,           // 35% should take quiz
                    'premium_view': 15,        // 15% should view premium
                    'payment_complete': 5      // 5% should complete payment
                }
            },
            {
                name: 'viral_growth',
                steps: ['visit', 'calculator_use', 'share_content', 'referral_signup'],
                goals: {
                    'calculator_use': 60,
                    'share_content': 25,
                    'referral_signup': 8
                }
            }
        ]
    },

    // Revenue Tracking
    revenue: {
        goals: {
            daily: 1000,     // $1,000/day target
            weekly: 7500,    // $7,500/week target
            monthly: 35000   // $35,000/month target
        },
        alerts: {
            dailyMissBy: 0.2,    // Alert if 20% below daily goal
            weeklyMissBy: 0.15,  // Alert if 15% below weekly goal
            monthlyMissBy: 0.1   // Alert if 10% below monthly goal
        }
    }
};

// Export deployment commands
export const deploymentCommands = {
    build: 'npm run build',
    test: 'npm run test:production',
    deploy: 'vercel --prod',
    monitor: 'npm run monitor:production',
    rollback: 'vercel rollback'
};

export default {
    productionConfig,
    deploymentChecklist,
    monitoringConfig,
    infrastructureConfig,
    revenueOptimization,
    deploymentCommands
};
