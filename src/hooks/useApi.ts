/**
 * Enhanced API Hook for TimeVault - Optimized for Revenue Performance
 * Integrates optimizedAPI service with advanced caching and performance monitoring
 */

import { useCallback, useEffect, useState } from 'react';
import { optimizedAPI } from '../services/optimizedAPI';
import type { CryptoAsset, PreciousMetalPrice } from '../types';

interface ApiState {
    cryptoPrices: CryptoAsset[];
    metalPrices: PreciousMetalPrice[];
    isLoading: boolean;
    error: string | null;
    lastFetch: number;
    performanceMetrics: {
        avgResponseTime: number;
        cacheHitRate: number;
        errorRate: number;
        apiHealth: 'excellent' | 'good' | 'degraded' | 'critical';
    };
    cacheAge: number;
}

export const useApi = () => {
    const [state, setState] = useState<ApiState>({
        cryptoPrices: [],
        metalPrices: [],
        isLoading: true,
        error: null,
        lastFetch: 0,
        performanceMetrics: {
            avgResponseTime: 0,
            cacheHitRate: 0,
            errorRate: 0,
            apiHealth: 'good'
        },
        cacheAge: 0
    });

    const fetchData = useCallback(async () => {
        const startTime = performance.now();

        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));

            // Use optimized API service with intelligent caching
            const [cryptoData, metalData] = await Promise.all([
                optimizedAPI.getCryptoPrices(['bitcoin', 'ethereum', 'litecoin']),
                optimizedAPI.getMetalPrices(['gold', 'silver', 'platinum', 'palladium'])
            ]);

            const endTime = performance.now();
            const responseTime = endTime - startTime;

            // Transform data to match expected types
            const cryptoPrices: CryptoAsset[] = Object.entries(cryptoData).map(([id, data]) => ({
                id,
                symbol: id.toUpperCase(),
                name: id.charAt(0).toUpperCase() + id.slice(1),
                current_price: data.usd || 0,
                market_cap: data.market_cap || 0,
                price_change_percentage_24h: data.price_change_24h || 0,
                volume_24h: data.volume_24h || 0,
                circulating_supply: data.circulating_supply || 0,
                image: `https://assets.coingecko.com/coins/images/${data.image_id || 1}/thumb/${id}.png`
            }));

            const metalPrices: PreciousMetalPrice[] = Object.entries(metalData).map(([metal, data]) => ({
                metal: metal as 'gold' | 'silver' | 'platinum' | 'palladium',
                price: data.price || 0,
                currency: 'USD',
                unit: 'oz',
                change_24h: data.change_24h || 0,
                change_percentage_24h: data.change_percentage_24h || 0,
                last_updated: new Date().toISOString()
            }));

            // Get cache info and performance metrics
            const cacheInfo = optimizedAPI.getCacheInfo();
            const performanceData = optimizedAPI.getPerformanceMetrics();

            // Calculate API health status
            const getApiHealth = (): 'excellent' | 'good' | 'degraded' | 'critical' => {
                if (responseTime < 500 && performanceData.errorRate < 2) return 'excellent';
                if (responseTime < 1500 && performanceData.errorRate < 10) return 'good';
                if (responseTime < 3000 && performanceData.errorRate < 25) return 'degraded';
                return 'critical';
            };

            setState(prev => ({
                ...prev,
                cryptoPrices,
                metalPrices,
                isLoading: false,
                lastFetch: Date.now(),
                performanceMetrics: {
                    avgResponseTime: (prev.performanceMetrics.avgResponseTime + responseTime) / 2,
                    cacheHitRate: cacheInfo.hitRate,
                    errorRate: Math.max(0, prev.performanceMetrics.errorRate - 1), // Improve on success
                    apiHealth: getApiHealth()
                },
                cacheAge: Date.now() - (cacheInfo.cryptoTimestamp || Date.now())
            }));

        } catch (error) {
            console.error('API fetch error:', error);

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Failed to fetch data',
                performanceMetrics: {
                    ...prev.performanceMetrics,
                    errorRate: Math.min(100, prev.performanceMetrics.errorRate + 5),
                    apiHealth: 'degraded'
                }
            }));

            // Attempt to use fallback data
            try {
                const fallbackData = optimizedAPI.getFallbackData();

                const fallbackCrypto: CryptoAsset[] = Object.entries(fallbackData.crypto).map(([id, price]) => ({
                    id,
                    symbol: id.toUpperCase(),
                    name: id.charAt(0).toUpperCase() + id.slice(1),
                    current_price: price,
                    market_cap: price * 19000000, // Estimated
                    price_change_percentage_24h: 0,
                    volume_24h: price * 1000000, // Estimated
                    circulating_supply: 19000000, // Estimated
                    image: `https://assets.coingecko.com/coins/images/1/thumb/${id}.png`
                }));

                const fallbackMetals: PreciousMetalPrice[] = Object.entries(fallbackData.metals).map(([metal, price]) => ({
                    metal: metal as 'gold' | 'silver' | 'platinum' | 'palladium',
                    price,
                    currency: 'USD',
                    unit: 'oz',
                    change_24h: 0,
                    change_percentage_24h: 0,
                    last_updated: new Date().toISOString()
                }));

                setState(prev => ({
                    ...prev,
                    cryptoPrices: fallbackCrypto,
                    metalPrices: fallbackMetals,
                    error: 'Using cached data - limited functionality'
                }));
            } catch (fallbackError) {
                console.error('Fallback data error:', fallbackError);
            }
        }
    }, []);

    // Intelligent refresh strategy
    useEffect(() => {
        // Initial fetch
        fetchData();

        // Preload data for better performance
        optimizedAPI.preloadData();

        // Dynamic refresh interval based on performance
        const getRefreshInterval = () => {
            const { apiHealth, cacheHitRate } = state.performanceMetrics;

            switch (apiHealth) {
                case 'excellent':
                    return cacheHitRate > 80 ? 60000 : 30000; // 1 min or 30s
                case 'good':
                    return 45000; // 45 seconds
                case 'degraded':
                    return 90000; // 1.5 minutes
                case 'critical':
                    return 180000; // 3 minutes
                default:
                    return 60000;
            }
        };

        const interval = setInterval(fetchData, getRefreshInterval());

        return () => clearInterval(interval);
    }, [fetchData, state.performanceMetrics.apiHealth]);

    // Performance monitoring methods
    const getPerformanceStatus = useCallback(() => {
        const { avgResponseTime, cacheHitRate, errorRate, apiHealth } = state.performanceMetrics;

        return {
            status: apiHealth,
            details: {
                responseTime: `${Math.round(avgResponseTime)}ms`,
                cacheEfficiency: `${Math.round(cacheHitRate)}%`,
                reliability: `${Math.round(100 - errorRate)}%`,
                recommendations: getOptimizationRecommendations(apiHealth)
            }
        };
    }, [state.performanceMetrics]);

    const getOptimizationRecommendations = (health: string): string[] => {
        switch (health) {
            case 'critical':
                return [
                    'Enable offline mode',
                    'Increase cache duration',
                    'Use fallback data sources'
                ];
            case 'degraded':
                return [
                    'Reduce API call frequency',
                    'Implement request batching',
                    'Check network connectivity'
                ];
            case 'good':
                return [
                    'Consider CDN implementation',
                    'Optimize cache strategies'
                ];
            default:
                return ['Performance is optimal'];
        }
    };

    // Force refresh method for manual updates
    const forceRefresh = useCallback(() => {
        optimizedAPI.clearCache();
        fetchData();
    }, [fetchData]);

    // Cache management methods
    const getCacheStatus = useCallback(() => {
        const cacheInfo = optimizedAPI.getCacheInfo();
        return {
            age: Date.now() - (cacheInfo.cryptoTimestamp || Date.now()),
            hitRate: cacheInfo.hitRate,
            size: cacheInfo.size || 0,
            isStale: (Date.now() - (cacheInfo.cryptoTimestamp || 0)) > 300000 // 5 minutes
        };
    }, []);

    return {
        ...state,
        refresh: fetchData,
        forceRefresh,
        getPerformanceStatus,
        getCacheStatus,
        // Legacy compatibility
        cryptoPrices: state.cryptoPrices,
        metalPrices: state.metalPrices,
        loading: state.isLoading,
        error: state.error
    };
};

const API_CONFIG = {
    COINGECKO_BASE: import.meta.env.VITE_COINGECKO_API_URL || 'https://api.coingecko.com/api/v3',
    METALS_BASE: import.meta.env.VITE_METALS_API_URL || 'https://api.metals.live/v1',
    COINGECKO_API_KEY: import.meta.env.VITE_COINGECKO_API_KEY || '', // Optional for demo
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    CACHE_DURATION: parseInt(import.meta.env.VITE_CACHE_DURATION || '300000'), // 5 minutes default
    RATE_LIMIT_MAX: parseInt(import.meta.env.VITE_RATE_LIMIT_MAX || '50'),
    RATE_LIMIT_WINDOW: 60000, // 1 minute window
    DEMO_MODE: import.meta.env.VITE_CACHE_ENABLED !== 'true', // Use demo data if caching not enabled
    ENHANCED_SECURITY: import.meta.env.VITE_ENHANCED_SECURITY === 'true',
};

interface ApiState {
    cryptoPrices: CryptoAsset[];
    metalPrices: PreciousMetalPrice[];
    isLoading: boolean;
    error: string | null;
    lastFetch: number;
}

interface CachedData {
    data: any;
    timestamp: number;
}

// Rate limiting implementation
class RateLimiter {
    private requests: number[] = [];

    canMakeRequest(): boolean {
        const now = Date.now();
        // Remove requests older than the window
        this.requests = this.requests.filter(time => now - time < API_CONFIG.RATE_LIMIT_WINDOW);

        if (this.requests.length >= API_CONFIG.RATE_LIMIT_MAX) {
            return false;
        }

        this.requests.push(now);
        return true;
    }

    getTimeUntilNextRequest(): number {
        if (this.requests.length < API_CONFIG.RATE_LIMIT_MAX) return 0;

        const oldestRequest = Math.min(...this.requests);
        return API_CONFIG.RATE_LIMIT_WINDOW - (Date.now() - oldestRequest);
    }
}

const rateLimiter = new RateLimiter();

// Enhanced cache implementation with security
class SimpleCache {
    private cache = new Map<string, CachedData>();

    set(key: string, data: any): void {
        // Input sanitization for enhanced security
        if (API_CONFIG.ENHANCED_SECURITY && typeof data === 'string') {
            data = this.sanitizeData(data);
        }

        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    get(key: string): any | null {
        const cached = this.cache.get(key);
        if (!cached) return null;

        if (Date.now() - cached.timestamp > API_CONFIG.CACHE_DURATION) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    }

    clear(): void {
        this.cache.clear();
    }

    private sanitizeData(data: string): string {
        // Basic XSS protection
        return data.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    }
}

const cache = new SimpleCache();

export const useApi = () => {
    const [state, setState] = useState<ApiState>({
        cryptoPrices: [],
        metalPrices: [],
        isLoading: true,
        error: null,
        lastFetch: 0
    });

    // Fetch crypto prices from CoinGecko
    const fetchCryptoPrices = useCallback(async (): Promise<CryptoAsset[]> => {
        const cacheKey = 'crypto_prices';
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        // Check rate limiting
        if (!rateLimiter.canMakeRequest()) {
            const waitTime = rateLimiter.getTimeUntilNextRequest();
            throw new Error(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds.`);
        }

        try {
            const headers: any = {
                'Accept': 'application/json',
            };

            // Add API key if available for higher rate limits
            if (API_CONFIG.COINGECKO_API_KEY) {
                headers['x-cg-demo-api-key'] = API_CONFIG.COINGECKO_API_KEY;
            }

            const response = await axios.get(
                `${API_CONFIG.COINGECKO_BASE}/coins/markets`,
                {
                    params: {
                        vs_currency: 'usd',
                        ids: 'bitcoin,ethereum,ripple,cardano,solana,polygon,chainlink',
                        order: 'market_cap_desc',
                        per_page: 10,
                        page: 1,
                        sparkline: false,
                        price_change_percentage: '24h'
                    },
                    headers,
                    timeout: API_CONFIG.TIMEOUT
                }
            );

            const cryptoData: CryptoAsset[] = response.data.map((coin: any) => ({
                id: coin.id,
                symbol: coin.symbol,
                name: coin.name,
                current_price: coin.current_price,
                price_change_percentage_24h: coin.price_change_percentage_24h || 0,
                market_cap: coin.market_cap || 0,
                image: coin.image
            }));

            cache.set(cacheKey, cryptoData);
            return cryptoData;
        } catch (error) {
            console.warn('CoinGecko API failed, using demo data:', error);
            // Fallback to demo data
            const demoData: CryptoAsset[] = [
                {
                    id: 'bitcoin',
                    symbol: 'btc',
                    name: 'Bitcoin',
                    current_price: 97500 + (Math.random() - 0.5) * 1000,
                    price_change_percentage_24h: (Math.random() - 0.5) * 10,
                    market_cap: 1900000000000,
                    image: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png'
                },
                {
                    id: 'ethereum',
                    symbol: 'eth',
                    name: 'Ethereum',
                    current_price: 3400 + (Math.random() - 0.5) * 200,
                    price_change_percentage_24h: (Math.random() - 0.5) * 8,
                    market_cap: 400000000000,
                    image: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png'
                },
                {
                    id: 'ripple',
                    symbol: 'xrp',
                    name: 'XRP',
                    current_price: 2.5 + (Math.random() - 0.5) * 0.5,
                    price_change_percentage_24h: (Math.random() - 0.5) * 15,
                    market_cap: 140000000000,
                    image: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png'
                }
            ];

            cache.set(cacheKey, demoData);
            return demoData;
        }
    }, []);

    // Fetch metals prices (simulated API call - replace with real endpoint)
    const fetchMetalPrices = useCallback(async (): Promise<PreciousMetalPrice[]> => {
        const cacheKey = 'metal_prices';
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            // Simulated metals API call - replace with actual Metals.live API
            const metalData: PreciousMetalPrice[] = [
                {
                    metal: 'gold',
                    price: 2050 + (Math.random() - 0.5) * 100, // Simulate price fluctuation
                    unit: 'oz',
                    change: (Math.random() - 0.5) * 10,
                    lastUpdated: new Date().toISOString()
                },
                {
                    metal: 'silver',
                    price: 25 + (Math.random() - 0.5) * 5, // Simulate price fluctuation
                    unit: 'oz',
                    change: (Math.random() - 0.5) * 2,
                    lastUpdated: new Date().toISOString()
                },
                {
                    metal: 'platinum',
                    price: 950 + (Math.random() - 0.5) * 50,
                    unit: 'oz',
                    change: (Math.random() - 0.5) * 5,
                    lastUpdated: new Date().toISOString()
                },
                {
                    metal: 'palladium',
                    price: 1200 + (Math.random() - 0.5) * 100,
                    unit: 'oz',
                    change: (Math.random() - 0.5) * 8,
                    lastUpdated: new Date().toISOString()
                }
            ];

            cache.set(cacheKey, metalData);
            return metalData;
        } catch (error) {
            console.warn('Metals API failed, using demo data:', error);
            // Return same demo data on error
            const demoData: PreciousMetalPrice[] = [
                {
                    metal: 'gold',
                    price: 2050,
                    unit: 'oz',
                    change: 12.5,
                    lastUpdated: new Date().toISOString()
                },
                {
                    metal: 'silver',
                    price: 25,
                    unit: 'oz',
                    change: -0.8,
                    lastUpdated: new Date().toISOString()
                }
            ];

            cache.set(cacheKey, demoData);
            return demoData;
        }
    }, []);

    // Fetch all data
    const fetchData = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const [cryptoData, metalData] = await Promise.all([
                fetchCryptoPrices(),
                fetchMetalPrices()
            ]);

            setState({
                cryptoPrices: cryptoData,
                metalPrices: metalData,
                isLoading: false,
                error: null,
                lastFetch: Date.now()
            });

            // Track successful API call
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'api_fetch_success', {
                    event_category: 'api',
                    event_label: 'crypto_metals_prices'
                });
            }

        } catch (error) {
            console.error('API fetch error:', error);

            const errorMessage = error instanceof Error
                ? error.message
                : 'Failed to fetch market data';

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage
            }));

            // Track API error
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'api_fetch_error', {
                    event_category: 'api',
                    event_label: errorMessage
                });
            }
        }
    }, [fetchCryptoPrices, fetchMetalPrices]);

    // Refresh data
    const refresh = useCallback(() => {
        cache.clear();
        fetchData();
    }, [fetchData]);

    // Auto-fetch on mount and every 5 minutes
    useEffect(() => {
        fetchData();

        const interval = setInterval(fetchData, API_CONFIG.CACHE_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [fetchData]);

    // Return memoized state and functions
    return {
        ...state,
        refresh,
        isStale: Date.now() - state.lastFetch > API_CONFIG.CACHE_DURATION
    };
};
