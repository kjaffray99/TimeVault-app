import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
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
                'User-Agent': 'TimeVault/2.0',
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
                const clientId = security.getClientFingerprint();
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

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
        try {
            const response = await this.retryRequest(() => this.api.post<T>(url, data, config));
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

    private handleApiError(error: any, url: string): Error {
        const message = error.response?.data?.message || error.message || 'API request failed';

        // Log security-relevant errors
        if (error.response?.status === 429) {
            console.warn('[SECURITY] API rate limit exceeded:', { url, status: error.response.status });
        }

        return new Error(`API Error [${url}]: ${message}`);
    }

    private logApiMetrics(url: string, status: number, responseTime: number, error?: string) {
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', 'api_call', {
                'event_category': 'performance',
                'event_label': url,
                'custom_parameters': {
                    status,
                    response_time: responseTime,
                    error: error || null
                }
            });
        }
    }

    // Clear expired cache entries
    clearExpiredCache(): void {
        const now = Date.now();
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp >= value.ttl) {
                this.cache.delete(key);
            }
        }
    }
}

export const secureApiService = new SecureApiService();
