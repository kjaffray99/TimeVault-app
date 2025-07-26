/**
 * TimeVault API Orchestrator v3.0
 * 
 * Centralized API management with intelligent routing, monitoring, and optimization
 * Designed for easy troubleshooting, upgrades, and performance monitoring
 */

import type { CryptoAsset, PreciousMetalPrice } from '../../types';
import { ApiHealthMonitor, DEFAULT_CONFIG, type ApiConfiguration } from '../config/health';

// Service Performance Metrics
interface ServiceMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    cacheHitRate: number;
    lastError?: string;
    lastErrorTime?: number;
}

// API Request Context
interface RequestContext {
    requestId: string;
    timestamp: number;
    userId?: string;
    source: string;
    feature: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
}

// API Response Wrapper
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    metadata: {
        requestId: string;
        timestamp: number;
        responseTime: number;
        fromCache: boolean;
        retryCount: number;
        source: string;
    };
    performance: {
        networkTime: number;
        processingTime: number;
        cacheTime: number;
    };
}

export class ApiOrchestrator {
    private static instance: ApiOrchestrator;
    private static config: ApiConfiguration = DEFAULT_CONFIG;
    private static metrics: Map<string, ServiceMetrics> = new Map();
    private static activeRequests: Map<string, RequestContext> = new Map();
    private static isInitialized = false;

    // Singleton pattern for centralized management
    static getInstance(): ApiOrchestrator {
        if (!this.instance) {
            this.instance = new ApiOrchestrator();
        }
        return this.instance;
    }

    // Initialize the orchestrator with configuration
    static async initialize(config: Partial<ApiConfiguration> = {}): Promise<void> {
        if (this.isInitialized) {
            console.warn('⚠️ ApiOrchestrator already initialized');
            return;
        }

        this.config = { ...DEFAULT_CONFIG, ...config };

        console.log('🚀 Initializing TimeVault API Orchestrator v3.0');
        console.log(`📋 Environment: ${this.config.environment}`);
        console.log(`🔧 Features:`, this.config.features);

        // Initialize health monitoring
        ApiHealthMonitor.initialize(this.config);

        // Initialize service metrics
        this.initializeMetrics();

        // Start performance monitoring
        this.startPerformanceMonitoring();

        this.isInitialized = true;
        console.log('✅ API Orchestrator initialized successfully');
    }

    // Enhanced market data fetching with intelligent orchestration
    static async getMarketData(context?: Partial<RequestContext>): Promise<ApiResponse<{
        cryptos: CryptoAsset[];
        metals: PreciousMetalPrice[];
    }>> {
        const requestContext: RequestContext = {
            requestId: this.generateRequestId(),
            timestamp: Date.now(),
            source: 'market_data',
            feature: 'price_conversion',
            priority: 'medium',
            ...context
        };

        this.activeRequests.set(requestContext.requestId, requestContext);

        try {
            console.log(`📊 Fetching market data [${requestContext.requestId}]`);

            const startTime = Date.now();
            let networkTime = 0;
            let processingStartTime = 0;
            let processingTime = 0;
            let cacheTime = 0;

            // Import services dynamically for better performance
            const [
                { CryptoPriceService },
                { MetalsPriceService }
            ] = await Promise.all([
                import('../crypto/CryptoPriceService'),
                import('../metals/MetalsPriceService')
            ]);

            processingStartTime = Date.now();

            // Parallel requests with intelligent retry and fallback
            const [cryptoResult, metalsResult] = await Promise.allSettled([
                this.executeWithRetry(
                    () => CryptoPriceService.getCryptoPrices(),
                    'crypto',
                    requestContext
                ),
                this.executeWithRetry(
                    () => MetalsPriceService.getMetalsPrices(),
                    'metals',
                    requestContext
                )
            ]);

            networkTime = Date.now() - processingStartTime;

            // Process results with error handling
            const cryptos = cryptoResult.status === 'fulfilled' ? cryptoResult.value : [];
            const metals = metalsResult.status === 'fulfilled' ? metalsResult.value : [];

            // Calculate cache metrics
            const cryptoMetrics = CryptoPriceService.getServiceMetrics?.() || { cacheStats: { hitRate: 0 } };
            const metalsMetrics = MetalsPriceService.getServiceMetrics?.() || { cacheStats: { hitRate: 0 } };
            const fromCache = (cryptoMetrics.cacheStats?.hitRate || 0) > 0.5 && (metalsMetrics.cacheStats?.hitRate || 0) > 0.5;

            const totalTime = Date.now() - startTime;
            processingTime = totalTime - networkTime;

            // Update metrics
            this.updateMetrics('market_data', {
                responseTime: totalTime,
                success: cryptoResult.status === 'fulfilled' && metalsResult.status === 'fulfilled',
                fromCache
            });

            // Log performance for monitoring
            if (totalTime > 3000) { // Slow request threshold
                console.warn(`⚠️ Slow market data request [${requestContext.requestId}]: ${totalTime}ms`);
            }

            const response: ApiResponse<{ cryptos: CryptoAsset[]; metals: PreciousMetalPrice[] }> = {
                success: true,
                data: { cryptos, metals },
                metadata: {
                    requestId: requestContext.requestId,
                    timestamp: requestContext.timestamp,
                    responseTime: totalTime,
                    fromCache,
                    retryCount: 0,
                    source: 'market_data'
                },
                performance: {
                    networkTime,
                    processingTime,
                    cacheTime
                }
            };

            // Track successful request for customer experience
            if (this.config.features.customerExperience) {
                this.trackCustomerExperience(requestContext, response);
            }

            return response;

        } catch (error) {
            console.error(`❌ Market data request failed [${requestContext.requestId}]:`, error);

            const errorMessage = error instanceof Error ? error.message : String(error);

            this.updateMetrics('market_data', {
                responseTime: Date.now() - requestContext.timestamp,
                success: false,
                error: errorMessage
            });

            return {
                success: false,
                error: errorMessage,
                metadata: {
                    requestId: requestContext.requestId,
                    timestamp: requestContext.timestamp,
                    responseTime: Date.now() - requestContext.timestamp,
                    fromCache: false,
                    retryCount: 0,
                    source: 'market_data'
                },
                performance: {
                    networkTime: 0,
                    processingTime: 0,
                    cacheTime: 0
                }
            };
        } finally {
            this.activeRequests.delete(requestContext.requestId);
        }
    }

    // Service health status for troubleshooting
    static async getServiceHealth(): Promise<any> {
        return ApiHealthMonitor.checkHealth();
    }

    // Get comprehensive metrics for monitoring and optimization
    static getMetrics(): Map<string, ServiceMetrics> {
        return new Map(this.metrics);
    }

    // Get active requests for debugging
    static getActiveRequests(): RequestContext[] {
        return Array.from(this.activeRequests.values());
    }

    // Configuration management
    static updateConfiguration(updates: Partial<ApiConfiguration>): void {
        this.config = { ...this.config, ...updates };
        console.log('🔧 Configuration updated:', updates);
    }

    static getConfiguration(): ApiConfiguration {
        return { ...this.config };
    }

    // Troubleshooting utilities
    static async runDiagnostics(): Promise<object> {
        console.log('🔍 Running API diagnostics...');

        const health = await this.getServiceHealth();
        const metrics = Object.fromEntries(this.metrics);
        const activeRequests = this.getActiveRequests();

        const diagnostics = {
            timestamp: new Date().toISOString(),
            version: this.config.version,
            environment: this.config.environment,
            health,
            metrics,
            activeRequests,
            configuration: this.config,
            performance: {
                totalRequests: Array.from(this.metrics.values()).reduce((sum, m) => sum + m.totalRequests, 0),
                averageResponseTime: this.calculateOverallAverageResponseTime(),
                errorRate: this.calculateOverallErrorRate(),
                cacheHitRate: this.calculateOverallCacheHitRate()
            }
        };

        console.log('📊 Diagnostics complete:', diagnostics.performance);
        return diagnostics;
    }

    // Performance optimization recommendations
    static async getOptimizationRecommendations(): Promise<string[]> {
        const metrics = this.getMetrics();
        const recommendations: string[] = [];

        // Analyze performance metrics
        for (const [service, metric] of metrics) {
            if (metric.averageResponseTime > 2000) {
                recommendations.push(`⚡ Consider caching optimization for ${service} service (avg: ${metric.averageResponseTime}ms)`);
            }

            if (metric.failedRequests / metric.totalRequests > 0.05) {
                recommendations.push(`🔄 Implement better retry logic for ${service} service (error rate: ${(metric.failedRequests / metric.totalRequests * 100).toFixed(1)}%)`);
            }

            if (metric.cacheHitRate < 0.7) {
                recommendations.push(`💾 Improve caching strategy for ${service} service (cache hit rate: ${(metric.cacheHitRate * 100).toFixed(1)}%)`);
            }
        }

        // Configuration recommendations
        if (this.config.limits.requestsPerMinute > 100) {
            recommendations.push('⚠️ Consider reducing rate limit to improve stability');
        }

        if (this.config.limits.cacheTtl < 60000) {
            recommendations.push('📈 Consider increasing cache TTL to reduce API calls');
        }

        return recommendations;
    }

    // Private helper methods
    private static async executeWithRetry<T>(
        operation: () => Promise<T>,
        serviceName: string,
        context: RequestContext,
        maxRetries: number = this.config.limits.maxRetries
    ): Promise<T> {
        let lastError: Error = new Error('No attempts made');

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                if (attempt > 0) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff
                    await new Promise(resolve => setTimeout(resolve, delay));
                    console.log(`🔄 Retrying ${serviceName} request [${context.requestId}] (attempt ${attempt + 1})`);
                }

                const result = await operation();

                if (attempt > 0) {
                    console.log(`✅ ${serviceName} request succeeded after ${attempt} retries [${context.requestId}]`);
                }

                return result;
            } catch (error) {
                lastError = error instanceof Error ? error : new Error(String(error));
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn(`⚠️ ${serviceName} request attempt ${attempt + 1} failed [${context.requestId}]:`, errorMessage);
            }
        }

        throw lastError;
    }

    private static generateRequestId(): string {
        return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private static initializeMetrics(): void {
        const services = ['market_data', 'crypto', 'metals', 'customer_experience', 'security', 'education'];

        services.forEach(service => {
            this.metrics.set(service, {
                totalRequests: 0,
                successfulRequests: 0,
                failedRequests: 0,
                averageResponseTime: 0,
                cacheHitRate: 0
            });
        });
    }

    private static updateMetrics(service: string, update: {
        responseTime: number;
        success: boolean;
        fromCache?: boolean;
        error?: string;
    }): void {
        const metrics = this.metrics.get(service) || {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            cacheHitRate: 0
        };

        metrics.totalRequests++;

        if (update.success) {
            metrics.successfulRequests++;
        } else {
            metrics.failedRequests++;
            if (update.error) {
                metrics.lastError = update.error;
                metrics.lastErrorTime = Date.now();
            }
        }

        // Update average response time
        const totalTime = metrics.averageResponseTime * (metrics.totalRequests - 1) + update.responseTime;
        metrics.averageResponseTime = totalTime / metrics.totalRequests;

        // Update cache hit rate
        if (update.fromCache !== undefined) {
            const cacheHits = metrics.cacheHitRate * (metrics.totalRequests - 1) + (update.fromCache ? 1 : 0);
            metrics.cacheHitRate = cacheHits / metrics.totalRequests;
        }

        this.metrics.set(service, metrics);
    }

    private static async trackCustomerExperience(context: RequestContext, response: ApiResponse<any>): Promise<void> {
        try {
            // Track performance metrics for customer experience optimization
            console.log('📊 Tracking performance metrics for customer experience optimization', {
                feature: context.feature,
                responseTime: response.metadata.responseTime,
                success: response.success,
                fromCache: response.metadata.fromCache,
                timestamp: Date.now()
            });
        } catch (error) {
            console.warn('⚠️ Failed to track customer experience:', error);
        }
    }

    private static startPerformanceMonitoring(): void {
        // Monitor and log performance every minute
        setInterval(async () => {
            const recommendations = await this.getOptimizationRecommendations();
            if (recommendations.length > 0) {
                console.group('💡 Performance Recommendations');
                recommendations.forEach(rec => console.log(rec));
                console.groupEnd();
            }
        }, 60000);
    }

    private static calculateOverallAverageResponseTime(): number {
        const metrics = Array.from(this.metrics.values());
        const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
        const weightedSum = metrics.reduce((sum, m) => sum + (m.averageResponseTime * m.totalRequests), 0);
        return totalRequests > 0 ? weightedSum / totalRequests : 0;
    }

    private static calculateOverallErrorRate(): number {
        const metrics = Array.from(this.metrics.values());
        const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
        const totalErrors = metrics.reduce((sum, m) => sum + m.failedRequests, 0);
        return totalRequests > 0 ? totalErrors / totalRequests : 0;
    }

    private static calculateOverallCacheHitRate(): number {
        const metrics = Array.from(this.metrics.values());
        const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
        const weightedCacheHits = metrics.reduce((sum, m) => sum + (m.cacheHitRate * m.totalRequests), 0);
        return totalRequests > 0 ? weightedCacheHits / totalRequests : 0;
    }
}

// Export singleton instance and static methods
export const apiOrchestrator = ApiOrchestrator.getInstance();

