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
    TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '10000'),
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
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

// Simple cache implementation
class SimpleCache {
    private cache = new Map<string, CachedData>();

    set(key: string, data: any): void {
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
    }, []);

    // Fetch metals prices (simulated API call - replace with real endpoint)
    const fetchMetalPrices = useCallback(async (): Promise<PreciousMetalPrice[]> => {
        const cacheKey = 'metal_prices';
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        // Simulated metals API call - replace with actual Metals.live API
        const metalData: PreciousMetalPrice[] = [
            {
                metal: 'gold',
                currency: 'USD',
                price_per_oz: 2050 + (Math.random() - 0.5) * 100, // Simulate price fluctuation
                change_24h: (Math.random() - 0.5) * 10,
                last_updated: new Date().toISOString()
            },
            {
                metal: 'silver',
                currency: 'USD',
                price_per_oz: 25 + (Math.random() - 0.5) * 5, // Simulate price fluctuation
                change_24h: (Math.random() - 0.5) * 2,
                last_updated: new Date().toISOString()
            }
        ];

        cache.set(cacheKey, metalData);
        return metalData;
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
