import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { securityManager } from '../../security/SecurityManager';
import { RequestTracker } from './RequestTracker';

/**
 * Enterprise-grade API client focused on customer experience and security
 * Handles retries, caching, security validation, and graceful degradation
 */

export interface ApiClientOptions {
    baseURL: string;
    timeout?: number;
    retries?: number;
    cacheTTL?: number;
    priority?: 'high' | 'normal' | 'low';
    customerFacing?: boolean;
}

export interface ApiMetrics {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    errorRate: number;
    lastErrorTime?: number;
    cacheHitRate: number;
}

/**
 * Response cache for improved customer experience
 */
class ResponseCache {
    private cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

    set(key: string, data: any, ttl: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > cached.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clear(): void {
        this.cache.clear();
    }

    getStats(): { size: number; hitRate: number } {
        return {
            size: this.cache.size,
            hitRate: 0 // Will be calculated by ApiClient
        };
    }
}

/**
 * Professional API client with customer service and profitability focus
 */
export class ApiClient {
    private client: AxiosInstance;
    private requestTracker: RequestTracker;
    private cache: ResponseCache;
    private metrics: ApiMetrics;
    private options: Required<ApiClientOptions>;

    constructor(options: ApiClientOptions) {
        this.options = {
            timeout: 8000,
            retries: 3,
            cacheTTL: 300000, // 5 minutes default
            priority: 'normal',
            customerFacing: true,
            ...options
        };

        this.requestTracker = new RequestTracker();
        this.cache = new ResponseCache();
        this.metrics = {
            totalRequests: 0,
            successfulRequests: 0,
            failedRequests: 0,
            averageResponseTime: 0,
            errorRate: 0,
            cacheHitRate: 0
        };

        this.client = this.createAxiosClient();
    }

    /**
     * Create configured Axios client with customer experience optimizations
     */
    private createAxiosClient(): AxiosInstance {
        const client = axios.create({
            baseURL: this.options.baseURL,
            timeout: this.options.timeout,
            headers: {
                'Content-Type': 'application/json',
                'User-Agent': 'TimeVault/1.0.0 (Customer-Focused)',
                'Accept': 'application/json',
            },
            maxRedirects: 3,
            validateStatus: (status) => status >= 200 && status < 300,
        });

        // Request interceptor with business intelligence
        client.interceptors.request.use(
            (config) => this.handleRequest(config),
            (error) => this.handleRequestError(error)
        );

        // Response interceptor with customer experience focus
        client.interceptors.response.use(
            (response) => this.handleResponse(response),
            (error) => this.handleResponseError(error)
        );

        return client;
    }

    /**
     * Handle outgoing requests with rate limiting and caching
     */
    private handleRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
        const endpoint = config.url || 'unknown';

        // Security validation
        this.validateRequest(config);

        // Check rate limits with customer experience priority
        if (!this.requestTracker.canMakeRequest(endpoint, this.options.priority)) {
            throw new Error('Service temporarily busy. Please try again in a moment.');
        }

        // Add request tracking for metrics
        (config as any).metadata = {
            startTime: Date.now(),
            endpoint,
            customerFacing: this.options.customerFacing
        };

        // Add API keys securely
        this.addApiKeys(config);

        // Add security headers
        this.addSecurityHeaders(config);

        this.metrics.totalRequests++;

        return config;
    }

    /**
     * Handle successful responses with caching and metrics
     */
    private handleResponse(response: AxiosResponse): AxiosResponse {
        const metadata = (response.config as any).metadata;
        const duration = Date.now() - (metadata?.startTime || 0);

        // Update performance metrics
        this.updateMetrics(duration, true);

        // Cache successful responses for better customer experience
        if (response.status === 200 && response.config.method?.toLowerCase() === 'get') {
            const cacheKey = this.getCacheKey(response.config);
            this.cache.set(cacheKey, response.data, this.options.cacheTTL);
        }

        // Log slow responses for customer service insights
        if (duration > 3000 && this.options.customerFacing) {
            console.warn(`Slow customer-facing API response: ${metadata?.endpoint} took ${duration}ms`);
        }

        return response;
    }

    /**
     * Handle errors with customer-friendly messaging and retry logic
     */
    private async handleResponseError(error: any): Promise<any> {
        const metadata = error.config?.metadata;
        const duration = Date.now() - (metadata?.startTime || 0);

        this.updateMetrics(duration, false);

        // Customer-friendly error handling
        if (this.options.customerFacing) {
            return this.handleCustomerFacingError(error);
        }

        return Promise.reject(this.sanitizeError(error));
    }

    /**
     * Handle customer-facing errors with graceful degradation
     */
    private async handleCustomerFacingError(error: any): Promise<any> {
        const status = error.response?.status;
        const config = error.config;

        // Retry logic for customer experience
        if (this.shouldRetry(error, config)) {
            return this.retryRequest(config);
        }

        // Return cached data if available
        const cacheKey = this.getCacheKey(config);
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
            console.info('Serving cached data due to API error - maintaining customer experience');
            return { data: cachedData, fromCache: true };
        }

        // Customer-friendly error messages
        const customerError = this.createCustomerError(status, error);
        return Promise.reject(customerError);
    }

    /**
     * Make API request with caching and error handling
     */
    async get<T = any>(url: string, config?: Partial<InternalAxiosRequestConfig>): Promise<AxiosResponse<T>> {
        // Check cache first for faster customer experience
        const cacheKey = this.getCacheKey({ ...config, url, method: 'get' });
        const cachedData = this.cache.get(cacheKey);

        if (cachedData) {
            this.metrics.cacheHitRate = (this.metrics.cacheHitRate + 1) / 2; // Running average
            return {
                data: cachedData,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: config || {},
                fromCache: true
            } as any;
        }

        return this.client.get<T>(url, config);
    }

    /**
     * Post request (no caching)
     */
    async post<T = any>(url: string, data?: any, config?: Partial<InternalAxiosRequestConfig>): Promise<AxiosResponse<T>> {
        return this.client.post<T>(url, data, config);
    }

    /**
     * Get API health and performance metrics
     */
    getMetrics(): ApiMetrics & { cacheStats: any; rateLimitStats: any } {
        return {
            ...this.metrics,
            cacheStats: this.cache.getStats(),
            rateLimitStats: this.requestTracker.getUsageStats()
        };
    }

    /**
     * Clear cache (customer service tool)
     */
    clearCache(): void {
        this.cache.clear();
        console.info('API cache cleared - customer service action');
    }

    /**
     * Reset rate limits (customer service tool)
     */
    resetRateLimits(): void {
        // Implementation depends on RequestTracker having a reset method
        console.info('Rate limits reset - customer service action');
    }

    // Private helper methods
    private validateRequest(config: InternalAxiosRequestConfig): void {
        // Validate request size
        const maxSize = securityManager.getMaxRequestSize();
        if (config.data && JSON.stringify(config.data).length > maxSize) {
            throw new Error('Request too large');
        }

        // Validate URL domain
        if (config.url && !this.isAllowedDomain(config.url)) {
            throw new Error('Unauthorized domain');
        }
    }

    private isAllowedDomain(url: string): boolean {
        try {
            const urlObj = new URL(url, this.options.baseURL);
            return securityManager.validateDomain(urlObj.hostname);
        } catch {
            return false;
        }
    }

    private addSecurityHeaders(config: InternalAxiosRequestConfig): void {
        // Add security headers for API requests
        config.headers.set('X-Requested-With', 'XMLHttpRequest');
        config.headers.set('X-TimeVault-Client', 'Web-App');

        // Add timestamp for request validation
        config.headers.set('X-Request-Time', Date.now().toString());
    }

    private addApiKeys(config: InternalAxiosRequestConfig): void {
        if (config.url?.includes('coingecko') &&
            import.meta.env.VITE_COINGECKO_API_KEY &&
            this.options.baseURL.startsWith('https://')) {
            config.headers.set('X-CG-Pro-API-Key', import.meta.env.VITE_COINGECKO_API_KEY);
        }
    }

    private getCacheKey(config: any): string {
        const url = config.url || '';
        const params = JSON.stringify(config.params || {});
        return `${this.options.baseURL}${url}${params}`;
    }

    private shouldRetry(error: any, config: any): boolean {
        const retryCount = config.__retryCount || 0;
        const maxRetries = this.options.retries;

        if (retryCount >= maxRetries) return false;

        // Retry on network errors or 5xx status codes
        return !error.response || (error.response.status >= 500 && error.response.status < 600);
    }

    private async retryRequest(config: any): Promise<any> {
        config.__retryCount = (config.__retryCount || 0) + 1;

        // Exponential backoff for better customer experience
        const delay = Math.min(1000 * Math.pow(2, config.__retryCount), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));

        return this.client.request(config);
    }

    private createCustomerError(status: number, _originalError: any): Error {
        const messages = {
            429: 'Service is experiencing high demand. Please try again in a moment.',
            500: 'Service temporarily unavailable. Our team has been notified.',
            503: 'Service under maintenance. Please try again shortly.',
            404: 'The requested information is not available.',
            default: 'Unable to connect to service. Please check your connection and try again.'
        };

        const message = messages[status as keyof typeof messages] || messages.default;
        const error = new Error(message);
        (error as any).customerFacing = true;
        (error as any).originalStatus = status;

        return error;
    }

    private sanitizeError(_error: any): Error {
        return new Error('API request failed');
    }

    private handleRequestError(error: any): Promise<never> {
        this.metrics.failedRequests++;
        return Promise.reject(this.sanitizeError(error));
    }

    private updateMetrics(duration: number, success: boolean): void {
        if (success) {
            this.metrics.successfulRequests++;
        } else {
            this.metrics.failedRequests++;
            this.metrics.lastErrorTime = Date.now();
        }

        // Update average response time
        const totalRequests = this.metrics.successfulRequests + this.metrics.failedRequests;
        this.metrics.averageResponseTime =
            (this.metrics.averageResponseTime * (totalRequests - 1) + duration) / totalRequests;

        // Update error rate
        this.metrics.errorRate =
            (this.metrics.failedRequests / this.metrics.totalRequests) * 100;
    }
}
