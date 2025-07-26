/**
 * Legacy Service Proxy - Future-Proof Service Layer
 * 
 * Provides secure, monitored access to core services
 * Easy to update with new service implementations or cloud providers
 */

import { ApiConfig } from '../config/apiConfig';
import { SecurityAuditLogger } from '../security/audit';
import { RateLimitManager } from '../security/rateLimit';
import type { ApiResult, LegacyClientConfig } from './types';

interface ServiceMetrics {
    requestCount: number;
    successCount: number;
    errorCount: number;
    averageResponseTime: number;
    lastRequestTime: number;
}

export class LegacyServiceProxy {
    private static metrics = new Map<string, ServiceMetrics>();

    /**
     * Secure proxy for any async operation with comprehensive monitoring
     */
    static async executeWithProxy<T>(
        operation: () => Promise<T>,
        operationName: string,
        clientId: string = 'unknown',
        config?: LegacyClientConfig
    ): Promise<ApiResult<T>> {
        const startTime = Date.now();
        const requestId = this.generateRequestId();

        // Initialize metrics if not exists
        if (!this.metrics.has(operationName)) {
            this.metrics.set(operationName, {
                requestCount: 0,
                successCount: 0,
                errorCount: 0,
                averageResponseTime: 0,
                lastRequestTime: 0
            });
        }

        const metrics = this.metrics.get(operationName)!;
        metrics.requestCount++;
        metrics.lastRequestTime = startTime;

        try {
            // Pre-execution security checks
            await this.performSecurityChecks(clientId, operationName, config);

            // Execute operation with timeout
            const timeout = config?.timeout || ApiConfig.getEndpointConfig().timeouts.default;
            const result = await this.executeWithTimeout(operation, timeout);

            // Calculate response time
            const duration = Date.now() - startTime;
            this.updateMetrics(operationName, duration, true);

            // Log successful operation
            SecurityAuditLogger.logEvent(
                'API_SUCCESS',
                operationName,
                clientId,
                undefined,
                {
                    requestId,
                    duration,
                    cached: false // Will be updated by specific services
                }
            );

            return {
                success: true,
                data: result,
                metadata: {
                    requestId,
                    timestamp: startTime,
                    duration,
                    cached: false
                }
            };

        } catch (error) {
            const duration = Date.now() - startTime;
            this.updateMetrics(operationName, duration, false);

            // Enhanced error logging
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            SecurityAuditLogger.logEvent(
                'API_ERROR',
                operationName,
                clientId,
                ['ERROR'],
                {
                    requestId,
                    duration,
                    error: errorMessage,
                    stack: error instanceof Error ? error.stack : undefined
                }
            );

            return {
                success: false,
                error: this.sanitizeErrorMessage(errorMessage),
                metadata: {
                    requestId,
                    timestamp: startTime,
                    duration
                }
            };
        }
    }

    /**
     * Retry wrapper for operations that might fail temporarily
     */
    static async executeWithRetry<T>(
        operation: () => Promise<T>,
        operationName: string,
        clientId: string,
        config?: LegacyClientConfig
    ): Promise<ApiResult<T>> {
        const maxRetries = config?.retries || ApiConfig.getEndpointConfig().retries.maxAttempts;
        const backoffMs = ApiConfig.getEndpointConfig().retries.backoffMs;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            const result = await this.executeWithProxy(operation, operationName, clientId, config);

            if (result.success) {
                return result;
            }

            // Don't retry on rate limit or validation errors
            if (result.error?.includes('rate limit') || result.error?.includes('validation')) {
                return result;
            }

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const delay = backoffMs * Math.pow(2, attempt - 1);
                await this.sleep(delay);

                SecurityAuditLogger.logEvent(
                    'API_ACCESS',
                    operationName,
                    clientId,
                    ['WARNING'],
                    {
                        action: 'retry_attempt',
                        attempt,
                        maxRetries,
                        delay
                    }
                );
            }
        }

        // All retries exhausted
        SecurityAuditLogger.logEvent(
            'API_ERROR',
            operationName,
            clientId,
            ['CRITICAL'],
            {
                action: 'max_retries_exceeded',
                attempts: maxRetries
            }
        );

        return {
            success: false,
            error: 'Service temporarily unavailable. Please try again later.',
            metadata: {
                requestId: this.generateRequestId(),
                timestamp: Date.now(),
                duration: 0
            }
        };
    }

    /**
     * Get service metrics for monitoring and optimization
     */
    static getServiceMetrics(serviceName?: string): Record<string, ServiceMetrics> {
        if (serviceName) {
            const metrics = this.metrics.get(serviceName);
            return metrics ? { [serviceName]: metrics } : {};
        }
        return Object.fromEntries(this.metrics);
    }

    /**
     * Health check for all proxied services
     */
    static async performHealthCheck(): Promise<{
        status: 'healthy' | 'degraded' | 'unhealthy';
        services: Array<{
            name: string;
            status: 'up' | 'down' | 'slow';
            responseTime?: number;
            lastSuccess?: number;
        }>;
    }> {
        const services = Array.from(this.metrics.keys());
        const healthChecks = await Promise.allSettled(
            services.map(async (service) => {
                const metrics = this.metrics.get(service)!;
                const successRate = metrics.requestCount > 0
                    ? metrics.successCount / metrics.requestCount
                    : 0;

                return {
                    name: service,
                    status: this.determineServiceStatus(successRate, metrics.averageResponseTime),
                    responseTime: metrics.averageResponseTime,
                    lastSuccess: metrics.lastRequestTime
                };
            })
        );

        const serviceResults = healthChecks.map(result =>
            result.status === 'fulfilled' ? result.value : {
                name: 'unknown',
                status: 'down' as const
            }
        );

        const healthyServices = serviceResults.filter(s => s.status === 'up').length;
        const totalServices = serviceResults.length;

        let overallStatus: 'healthy' | 'degraded' | 'unhealthy';
        if (healthyServices === totalServices) {
            overallStatus = 'healthy';
        } else if (healthyServices > totalServices / 2) {
            overallStatus = 'degraded';
        } else {
            overallStatus = 'unhealthy';
        }

        return {
            status: overallStatus,
            services: serviceResults
        };
    }

    // Private utility methods
    private static async performSecurityChecks(
        clientId: string,
        operationName: string,
        config?: LegacyClientConfig
    ): Promise<void> {
        // Rate limiting check
        const rateLimitResult = await RateLimitManager.checkRateLimit(clientId);
        if (!rateLimitResult.allowed) {
            throw new Error(`Rate limit exceeded. Try again in ${rateLimitResult.retryAfter} seconds.`);
        }

        // Log security access
        SecurityAuditLogger.logEvent(
            'API_ACCESS',
            operationName,
            clientId,
            undefined,
            {
                rateLimitRemaining: rateLimitResult.remaining,
                config: config?.metadata
            }
        );
    }

    private static async executeWithTimeout<T>(
        operation: () => Promise<T>,
        timeoutMs: number
    ): Promise<T> {
        return Promise.race([
            operation(),
            new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Operation timeout')), timeoutMs)
            )
        ]);
    }

    private static updateMetrics(
        operationName: string,
        duration: number,
        success: boolean
    ): void {
        const metrics = this.metrics.get(operationName)!;

        if (success) {
            metrics.successCount++;
        } else {
            metrics.errorCount++;
        }

        // Update average response time
        const totalSuccessful = metrics.successCount;
        if (totalSuccessful > 0) {
            metrics.averageResponseTime =
                (metrics.averageResponseTime * (totalSuccessful - 1) + duration) / totalSuccessful;
        }
    }

    private static sanitizeErrorMessage(error: string): string {
        // Remove sensitive information from error messages
        return error
            .replace(/api[_-]?key[s]?[:\s=]\s*[a-zA-Z0-9]+/gi, 'api_key=***')
            .replace(/token[s]?[:\s=]\s*[a-zA-Z0-9]+/gi, 'token=***')
            .replace(/password[s]?[:\s=]\s*[a-zA-Z0-9]+/gi, 'password=***');
    }

    private static determineServiceStatus(
        successRate: number,
        avgResponseTime: number
    ): 'up' | 'down' | 'slow' {
        if (successRate < 0.5) return 'down';
        if (avgResponseTime > 10000) return 'slow'; // 10 seconds
        return 'up';
    }

    private static generateRequestId(): string {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2);
        return `req_${timestamp}_${random}`;
    }

    private static sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
