/**
 * TimeVault Development Initialization Script
 * 
 * Automatically sets up the API system for development
 * Includes health monitoring, debugging tools, and optimization
 */

import { ApiHealthMonitor, ApiMigrationManager, ApiOrchestrator } from '../api';

// Development configuration
const DEV_CONFIG = {
    environment: 'development' as const,
    version: '3.0.0',
    features: {
        customerExperience: true,
        proactiveSupport: true,
        advancedAnalytics: true,
        realTimeMetrics: true
    },
    endpoints: {
        coinGecko: 'https://api.coingecko.com/api/v3',
        metalsApi: 'https://metals-api.com/api',
        supportApi: '/api/support',
        analyticsApi: '/api/analytics'
    },
    limits: {
        requestsPerMinute: 100, // Higher limit for development
        cacheTtl: 60000, // 1 minute for faster testing
        maxRetries: 2,
        timeoutMs: 5000
    },
    security: {
        enableAuditLogging: true,
        enableEncryption: false, // Disabled for easier debugging
        enableRateLimit: false, // Disabled for development
        enableCors: true
    }
};

// Enhanced logging for development
const setupDevLogging = () => {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => {
        originalLog(`[${new Date().toISOString()}] 🔵 LOG:`, ...args);
    };

    console.warn = (...args) => {
        originalWarn(`[${new Date().toISOString()}] 🟡 WARN:`, ...args);
    };

    console.error = (...args) => {
        originalError(`[${new Date().toISOString()}] 🔴 ERROR:`, ...args);
    };

    // Add custom debug logger
    (window as any).tvDebug = {
        health: () => ApiHealthMonitor.checkHealth(),
        metrics: () => ApiOrchestrator.getMetrics(),
        diagnostics: () => ApiOrchestrator.runDiagnostics(),
        recommendations: () => ApiOrchestrator.getOptimizationRecommendations(),
        config: () => ApiOrchestrator.getConfiguration(),
        activeRequests: () => ApiOrchestrator.getActiveRequests()
    };

    console.log('🛠️ Development debugging tools available at window.tvDebug');
};

// Performance monitoring for development
const setupPerformanceMonitoring = () => {
    let performanceWarnings = 0;
    const maxWarnings = 5;

    setInterval(async () => {
        try {
            const health = await ApiHealthMonitor.checkHealth();
            const metrics = ApiOrchestrator.getMetrics();

            // Check for performance issues
            const marketMetrics = metrics.get('market_data');
            if (marketMetrics && marketMetrics.averageResponseTime > 2000) {
                performanceWarnings++;
                console.warn(`⚠️ Slow response detected: ${marketMetrics.averageResponseTime}ms`);

                if (performanceWarnings >= maxWarnings) {
                    console.error('🚨 Multiple performance warnings detected!');
                    const recommendations = await ApiOrchestrator.getOptimizationRecommendations();
                    console.log('💡 Optimization recommendations:', recommendations);
                    performanceWarnings = 0; // Reset counter
                }
            }

            // Log system status periodically
            if (health.status !== 'healthy') {
                console.warn('🔍 System health check:', health);
            }
        } catch (error) {
            console.error('❌ Performance monitoring error:', error);
        }
    }, 30000); // Check every 30 seconds
};

// Automatic compatibility and migration checks
const setupMigrationChecks = async () => {
    try {
        console.log('🔍 Checking system compatibility...');

        const compatibility = await ApiMigrationManager.checkCompatibility();

        if (!compatibility.compatible) {
            console.warn('⚠️ Compatibility issues detected:', compatibility.issues);

            // Auto-fix if possible
            const needsUpgrade = await ApiMigrationManager.needsUpgrade();
            if (needsUpgrade) {
                console.log('🔧 Attempting automatic upgrade...');
                try {
                    await ApiMigrationManager.autoUpgrade();
                    console.log('✅ Automatic upgrade completed');
                } catch (error) {
                    console.error('❌ Automatic upgrade failed:', error);
                    console.log('💡 Manual intervention may be required');
                }
            }
        } else {
            console.log('✅ System compatibility confirmed');
        }
    } catch (error) {
        console.error('❌ Migration check failed:', error);
    }
};

// Error boundary for development
const setupErrorHandling = () => {
    window.addEventListener('error', (event) => {
        console.error('🚨 Global error caught:', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('🚨 Unhandled promise rejection:', event.reason);
    });
};

// Customer experience monitoring for development
const setupCustomerExperienceMonitoring = () => {
    // Add development-specific customer experience hooks
    (window as any).tvCustomerExperience = {
        reportFriction: (level: number, context?: string) => {
            console.log(`🎯 Friction reported: ${level} (${context})`);
        },
        triggerHelp: (context?: string) => {
            console.log(`💬 Help triggered for: ${context}`);
        },
        logInteraction: (type: string, data?: any) => {
            console.log(`👆 User interaction: ${type}`, data);
        }
    };
};

// Hot reload support for development
const setupHotReload = () => {
    if (module.hot) {
        module.hot.accept('../api', () => {
            console.log('🔄 Hot reloading API modules...');
        });

        module.hot.accept('../services/customerExperience', () => {
            console.log('🔄 Hot reloading customer experience...');
        });
    }
};

// Main initialization function
export const initializeDevelopment = async (): Promise<void> => {
    console.log('🚀 Initializing TimeVault API for Development');
    console.log('=====================================');

    try {
        // Set up development utilities
        setupDevLogging();
        setupErrorHandling();
        setupCustomerExperienceMonitoring();
        setupHotReload();

        // Initialize API system
        console.log('🔧 Initializing API Orchestrator...');
        await ApiOrchestrator.initialize(DEV_CONFIG);

        // Run compatibility checks
        await setupMigrationChecks();

        // Set up monitoring
        setupPerformanceMonitoring();

        // Test system health
        console.log('🏥 Running initial health check...');
        const health = await ApiHealthMonitor.checkHealth();
        console.log(`📊 System Status: ${health.status}`);
        console.log(`⏱️ Uptime: ${Math.round(health.uptime / 1000)}s`);

        // Log configuration
        console.log('⚙️ Development Configuration:');
        console.log('  - Environment:', DEV_CONFIG.environment);
        console.log('  - Rate Limiting:', DEV_CONFIG.security.enableRateLimit ? 'Enabled' : 'Disabled');
        console.log('  - Cache TTL:', DEV_CONFIG.limits.cacheTtl / 1000, 'seconds');
        console.log('  - Customer Experience:', DEV_CONFIG.features.customerExperience ? 'Enabled' : 'Disabled');

        // Show debugging help
        console.log('\n🛠️ Development Tools:');
        console.log('  window.tvDebug.health() - Get system health');
        console.log('  window.tvDebug.metrics() - Get performance metrics');
        console.log('  window.tvDebug.diagnostics() - Run full diagnostics');
        console.log('  window.tvDebug.recommendations() - Get optimization tips');
        console.log('  window.tvCustomerExperience.reportFriction(level) - Test friction detection');

        console.log('\n✅ Development environment ready!');
        console.log('=====================================\n');

        // Optional: Run initial diagnostics
        if (process.env.NODE_ENV === 'development') {
            setTimeout(async () => {
                const diagnostics = await ApiOrchestrator.runDiagnostics();
                console.log('📊 Initial Diagnostics Complete:', {
                    totalRequests: diagnostics.performance?.totalRequests || 0,
                    averageResponseTime: diagnostics.performance?.averageResponseTime || 0,
                    errorRate: diagnostics.performance?.errorRate || 0
                });
            }, 5000); // Wait 5 seconds for initial requests
        }

    } catch (error) {
        console.error('❌ Development initialization failed:', error);
        console.log('🔧 Attempting minimal initialization...');

        try {
            // Fallback initialization
            await ApiOrchestrator.initialize({
                environment: 'development',
                features: {
                    customerExperience: false,
                    proactiveSupport: false,
                    advancedAnalytics: false,
                    realTimeMetrics: false
                }
            });
            console.log('⚠️ Minimal initialization successful');
        } catch (fallbackError) {
            console.error('💥 Complete initialization failure:', fallbackError);
            throw fallbackError;
        }
    }
};

// Auto-initialize if in development mode
if (process.env.NODE_ENV === 'development') {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDevelopment);
    } else {
        initializeDevelopment();
    }
}

export default initializeDevelopment;
