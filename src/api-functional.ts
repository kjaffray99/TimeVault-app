/**
 * TimeVault API System - Functional Core v3.0
 * 
 * Simplified, functional API system optimized for immediate use
 * with troubleshooting and upgrade capabilities
 */

// === CORE EXPORTS ===

// Customer Experience System
export { useCustomerService } from './hooks/useCustomerService';
export { CustomerExperienceService } from './services/customerExperience';

// Customer Experience Components  
export { CustomerServiceDashboard } from './components/Dashboard/CustomerServiceDashboard';
export { FeedbackModal } from './components/Feedback/FeedbackModal';
export { HelpWidget } from './components/Support/HelpWidget';

// Core Services (Working Implementation)
export { ApiService, CryptoPriceService, MetalsPriceService } from './services';
export { educationalService } from './services/education';

// Legacy Support (Backward Compatibility)
export { LegacyApiBridge } from './services/legacy/bridge';
export { coinGeckoClient, metalsClient } from './services/legacy/clients';
export { SecurityMetrics } from './services/legacy/metrics';

// === TYPE DEFINITIONS ===
export type {

    // Core Application Types
    CryptoAsset,
    // Customer Experience Types
    CustomerExperienceMetrics,
    FrictionPoint, PreciousMetalPrice, SupportTicket,
    UserJourney
} from './types';

export type {
    // Legacy Types (Backward Compatibility)
    ApiResult,
    ComplianceReport,
    LegacyClientConfig,
    SecurityAudit
} from './services/legacy/types';

// === SIMPLIFIED ORCHESTRATION ===

interface SimpleApiConfig {
    environment: 'development' | 'staging' | 'production';
    enableCustomerExperience: boolean;
    enableProactiveSupport: boolean;
    enableHealthMonitoring: boolean;
    cacheTtl: number; // milliseconds
    maxRetries: number;
}

export class SimpleApiOrchestrator {
    private static config: SimpleApiConfig = {
        environment: (process.env.NODE_ENV as any) || 'development',
        enableCustomerExperience: true,
        enableProactiveSupport: true,
        enableHealthMonitoring: true,
        cacheTtl: 300000, // 5 minutes
        maxRetries: 3
    };

    private static initialized = false;
    private static metrics = {
        totalRequests: 0,
        successfulRequests: 0,
        failedRequests: 0,
        averageResponseTime: 0
    };

    // Initialize the API system
    static async initialize(customConfig?: Partial<SimpleApiConfig>): Promise<void> {
        if (this.initialized) {
            console.warn('⚠️ API already initialized');
            return;
        }

        this.config = { ...this.config, ...customConfig };

        console.log('🚀 Initializing TimeVault API System v3.0');
        console.log(`📋 Environment: ${this.config.environment}`);
        console.log(`🎯 Customer Experience: ${this.config.enableCustomerExperience ? 'Enabled' : 'Disabled'}`);

        try {
            // Initialize customer experience if enabled
            if (this.config.enableCustomerExperience) {
                const { CustomerExperienceService } = await import('./services/customerExperience');
                CustomerExperienceService.initialize();
                console.log('✅ Customer Experience initialized');
            }

            this.initialized = true;
            console.log('✅ API System initialized successfully');
        } catch (error) {
            console.error('❌ API initialization failed:', error);
            throw error;
        }
    }

    // Get market data with enhanced error handling
    static async getMarketData(): Promise<{
        cryptos: any[];
        metals: any[];
        performance: {
            responseTime: number;
            fromCache: boolean;
            success: boolean;
        };
    }> {
        const startTime = Date.now();
        this.metrics.totalRequests++;

        try {
            console.log('📊 Fetching market data...');

            const { ApiService } = await import('./services');
            const result = await ApiService.getMarketData();

            const responseTime = Date.now() - startTime;
            this.metrics.successfulRequests++;
            this.updateAverageResponseTime(responseTime);

            console.log(`✅ Market data fetched in ${responseTime}ms`);

            return {
                cryptos: result.cryptos,
                metals: result.metals,
                performance: {
                    responseTime,
                    fromCache: result.performance.cryptoFromCache && result.performance.metalsFromCache,
                    success: true
                }
            };
        } catch (error) {
            const responseTime = Date.now() - startTime;
            this.metrics.failedRequests++;

            console.error('❌ Market data fetch failed:', error);

            return {
                cryptos: [],
                metals: [],
                performance: {
                    responseTime,
                    fromCache: false,
                    success: false
                }
            };
        }
    }

    // Get current system status
    static getStatus(): {
        initialized: boolean;
        config: SimpleApiConfig;
        metrics: {
            totalRequests: number;
            successfulRequests: number;
            failedRequests: number;
            averageResponseTime: number;
        };
        health: 'healthy' | 'degraded' | 'unhealthy';
    } {
        const errorRate = this.metrics.totalRequests > 0
            ? this.metrics.failedRequests / this.metrics.totalRequests
            : 0;

        let health: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        if (errorRate > 0.5) health = 'unhealthy';
        else if (errorRate > 0.2 || this.metrics.averageResponseTime > 3000) health = 'degraded';

        return {
            initialized: this.initialized,
            config: this.config,
            metrics: { ...this.metrics },
            health
        };
    }

    // Run basic diagnostics
    static async runDiagnostics(): Promise<{
        timestamp: string;
        status: {
            initialized: boolean;
            config: SimpleApiConfig;
            metrics: {
                totalRequests: number;
                successfulRequests: number;
                failedRequests: number;
                averageResponseTime: number;
            };
            health: 'healthy' | 'degraded' | 'unhealthy';
        };
        performance: {
            totalRequests: number;
            successRate: number;
            averageResponseTime: number;
            errorRate: number;
        };
        recommendations: string[];
    }> {
        console.log('🔍 Running API diagnostics...');

        const status = this.getStatus();
        const successRate = status.metrics.totalRequests > 0
            ? status.metrics.successfulRequests / status.metrics.totalRequests
            : 1;
        const errorRate = 1 - successRate;

        const recommendations: string[] = [];

        if (errorRate > 0.1) {
            recommendations.push('High error rate detected - check network connectivity');
        }

        if (status.metrics.averageResponseTime > 2000) {
            recommendations.push('Slow response times - consider optimizing cache settings');
        }

        if (!status.initialized) {
            recommendations.push('API not initialized - call SimpleApiOrchestrator.initialize()');
        }

        const diagnostics = {
            timestamp: new Date().toISOString(),
            status,
            performance: {
                totalRequests: status.metrics.totalRequests,
                successRate,
                averageResponseTime: status.metrics.averageResponseTime,
                errorRate
            },
            recommendations
        };

        console.log('📊 Diagnostics complete:', diagnostics.performance);
        return diagnostics;
    }

    // Update configuration
    static updateConfig(updates: Partial<SimpleApiConfig>): void {
        this.config = { ...this.config, ...updates };
        console.log('🔧 Configuration updated:', updates);
    }

    // Get current configuration
    static getConfig(): SimpleApiConfig {
        return { ...this.config };
    }

    // Reset metrics
    static resetMetrics(): void {
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0
        };
        console.log('🔄 Metrics reset');
    }

    private static updateAverageResponseTime(responseTime: number): void {
        const totalTime = this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime;
        this.metrics.averageResponseTime = totalTime / this.metrics.totalRequests;
    }
}

// === CONVENIENCE EXPORTS ===
export { SimpleApiOrchestrator as ApiOrchestrator };

// === DEVELOPMENT HELPERS ===
export const DevTools = {
    // Quick initialization for development
    async initDev(): Promise<void> {
        await SimpleApiOrchestrator.initialize({
            environment: 'development',
            enableCustomerExperience: true,
            enableProactiveSupport: true,
            enableHealthMonitoring: true,
            cacheTtl: 60000, // 1 minute for faster testing
            maxRetries: 2
        });
    },

    // Test API endpoints
    async testEndpoints(): Promise<void> {
        console.log('🧪 Testing API endpoints...');

        const result = await SimpleApiOrchestrator.getMarketData();
        console.log('Market Data Test:', result.performance.success ? '✅ Passed' : '❌ Failed');

        const diagnostics = await SimpleApiOrchestrator.runDiagnostics();
        console.log('Diagnostics Test:', diagnostics.status.health === 'healthy' ? '✅ Passed' : '⚠️ Degraded');
    },

    // Get debug info
    getDebugInfo(): object {
        return {
            status: SimpleApiOrchestrator.getStatus(),
            config: SimpleApiOrchestrator.getConfig(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }
};

// === AUTO-INITIALIZATION ===
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Auto-initialize in development
    SimpleApiOrchestrator.initialize().catch(console.error);

    // Add dev tools to global scope
    (window as any).TimeVaultAPI = {
        orchestrator: SimpleApiOrchestrator,
        devTools: DevTools,
        diagnostics: () => SimpleApiOrchestrator.runDiagnostics(),
        status: () => SimpleApiOrchestrator.getStatus()
    };

    console.log('🛠️ Development tools available at window.TimeVaultAPI');
}

// === FINAL EXPORTS ===
export * from './types';
