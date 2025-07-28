import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import { security } from '../utils/securityEnhanced';

export class SecureApiService {
    private readonly api: AxiosInstance;
    private readonly cache = new Map<string, { data: any; timestamp: number; ttl: number }>();
    private readonly MAX_RETRIES = 3;
    private readonly TIMEOUT = 5000;

    constructor() {
        this.api = axios.create({
            timeout: this.TIMEOUT,
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'TimeVault/1.0',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        // Request interceptor for security
        this.api.interceptors.request.use(
            (config) => {
                // Add request ID for tracking
                config.headers['X-Request-ID'] = crypto.randomUUID();

                // Rate limiting check
                const clientId = this.getClientId();
                if (!security.checkRateLimit(clientId, 50, 60000)) {
                    throw new Error('Rate limit exceeded');
                }

                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => {
                // Validate response data for crypto APIs
                if (response.config.url?.includes('coingecko') || response.config.url?.includes('metals')) {
                    if (!this.validateApiResponse(response.data)) {
                        throw new Error('Invalid API response data');
                    }
                }

                // Log successful API calls
                this.logApiMetrics(response.config.url || '', response.status, response.headers['x-response-time']);
                return response;
            },
            (error) => {
                // Log failed API calls
                this.logApiMetrics(error.config?.url || '', error.response?.status || 0, 0, error.message);
                return Promise.reject(error);
            }
        );
    }

    private getClientId(): string {
        // Generate client fingerprint for rate limiting
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillText('TimeVault fingerprint', 2, 2);
            return canvas.toDataURL().slice(-20);
        }
        return navigator.userAgent.slice(-20);
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        const cacheKey = `${url}_${JSON.stringify(config?.params || {})}`;

        // Check cache first
        const cached = this.getFromCache<T>(cacheKey);
        if (cached) {
            return cached;
        }

        try {
            const response = await this.retryRequest(() => this.api.get<T>(url, config));

            // Cache successful responses
            this.setCache(cacheKey, response.data, this.getCacheTTL(url));

            return response.data;
        } catch (error) {
            throw this.handleApiError(error, url);
        }
    }

    private async retryRequest<T>(request: () => Promise<AxiosResponse<T>>): Promise<AxiosResponse<T>> {
        let lastError: any;

        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                return await request();
            } catch (error) {
                lastError = error;

                if (attempt === this.MAX_RETRIES) break;

                // Exponential backoff
                const delay = Math.pow(2, attempt) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }

        throw lastError;
    }

    private getFromCache<T>(key: string): T | null {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.data;
        }
        this.cache.delete(key);
        return null;
    }

    private setCache(key: string, data: any, ttl: number) {
        // Limit cache size to prevent memory issues
        if (this.cache.size > 100) {
            const firstKey = this.cache.keys().next().value;
            if (firstKey) {
                this.cache.delete(firstKey);
            }
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    private getCacheTTL(url: string): number {
        if (url.includes('coingecko')) return 30000; // 30 seconds
        if (url.includes('metals')) return 60000; // 1 minute
        return 300000; // 5 minutes default
    }

    private validateApiResponse(data: any): boolean {
        // Validate crypto API responses
        if (Array.isArray(data)) {
            return data.every(item => security.validateCryptoData(item));
        }

        if (data && typeof data === 'object') {
            return security.validateCryptoData(data);
        }

        return false;
    }

    private handleApiError(error: any, url: string): Error {
        const message = error.response?.data?.message || error.message || 'API request failed';

        // Log security-relevant errors
        if (error.response?.status === 429) {
            security.logSecurityEvent('api_rate_limit', { url, status: error.response.status });
        }

        if (error.response?.status === 403) {
            security.logSecurityEvent('api_forbidden', { url, status: error.response.status });
        }

        return new Error(`API Error [${url}]: ${message}`);
    }

    private logApiMetrics(url: string, status: number, responseTime: number, error?: string) {
        const metrics = {
            url: url.replace(/[?&].*/, ''), // Remove query params for privacy
            status,
            response_time: responseTime,
            error: error || null,
            timestamp: Date.now()
        };

        // Send to analytics
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'api_call', {
                'event_category': 'performance',
                'event_label': metrics.url,
                'custom_parameters': metrics
            });
        }

        // Store for monitoring
        this.storeMetric('api_performance', metrics);
    }

    private storeMetric(type: string, data: any) {
        // Store in localStorage for monitoring dashboard
        try {
            const existing = JSON.parse(localStorage.getItem(`timevault_metrics_${type}`) || '[]');
            existing.push(data);

            // Keep only last 50 entries
            if (existing.length > 50) {
                existing.shift();
            }

            localStorage.setItem(`timevault_metrics_${type}`, JSON.stringify(existing));
        } catch (error) {
            console.warn('Failed to store metrics:', error);
        }
    }

    // Public methods for specific API calls
    async getCryptoPrices(cryptoIds: string[]): Promise<any[]> {
        const url = `https://api.coingecko.com/api/v3/simple/price`;
        const params = {
            ids: cryptoIds.join(','),
            vs_currencies: 'usd',
            include_market_cap: true,
            include_24hr_change: true
        };

        return this.get(url, { params });
    }

    async getMetalsPrices(): Promise<any> {
        const url = `https://api.metals.live/v1/spot`;
        return this.get(url);
    }

    // Clear cache for fresh data
    clearCache(): void {
        this.cache.clear();
    }

    // Get cache statistics
    getCacheStats(): { size: number; keys: string[] } {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

export const secureApiService = new SecureApiService();
