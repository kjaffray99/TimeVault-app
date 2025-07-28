/**
 * API Hook for TimeVault MVP
 * Manages crypto and metals price data with caching and error handling
 */

import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import type { CryptoAsset, PreciousMetalPrice } from '../types';

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
