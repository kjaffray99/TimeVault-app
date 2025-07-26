/**
 * Enhanced Legacy Services - Future-Proof Wrappers
 * 
 * Secure, monitored wrappers around core services
 * Easy to update with new implementations or migrate to cloud services
 */

import { ApiService as CoreApiService, CryptoPriceService as CoreCryptoPriceService, MetalsPriceService as CoreMetalsPriceService } from '../index';
import { LegacyServiceProxy } from './proxy';

/**
 * Enhanced API Service with comprehensive monitoring
 */
export const ApiService = {
    /**
     * Get market data with enhanced security and monitoring
     */
    getMarketData: async () => {
        const result = await LegacyServiceProxy.executeWithRetry(
            () => CoreApiService.getMarketData(),
            'MARKET_DATA',
            'legacy-api-service'
        );

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch market data');
        }

        return result.data;
    },

    /**
     * Get security metrics for the API service
     */
    getSecurityMetrics: () => {
        return {
            proxyMetrics: LegacyServiceProxy.getServiceMetrics('MARKET_DATA'),
            serviceHealth: 'operational',
            lastUpdate: new Date().toISOString()
        };
    },

    /**
     * Health check for API service
     */
    healthCheck: () => LegacyServiceProxy.performHealthCheck(),

    /**
     * Get service performance metrics
     */
    getPerformanceMetrics: () => LegacyServiceProxy.getServiceMetrics()
};

/**
 * Enhanced Crypto Price Service with retry logic and monitoring
 */
export const CryptoPriceService = {
    /**
     * Get crypto prices with enhanced reliability
     */
    getCryptoPrices: async () => {
        const result = await LegacyServiceProxy.executeWithRetry(
            () => CoreCryptoPriceService.getCryptoPrices(),
            'CRYPTO_PRICES',
            'legacy-crypto-service',
            {
                timeout: 8000, // 8 second timeout for crypto API
                retries: 2     // Reduce retries for faster response
            }
        );

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch crypto prices');
        }

        return result.data;
    },

    /**
     * Get specific crypto price with caching
     */
    getCryptoPrice: async (symbol: string) => {
        const result = await LegacyServiceProxy.executeWithProxy(
            () => CoreCryptoPriceService.getCryptoPrices().then(prices =>
                prices.find(p => p.symbol.toLowerCase() === symbol.toLowerCase())
            ),
            `CRYPTO_PRICE_${symbol.toUpperCase()}`,
            'legacy-crypto-service'
        );

        if (!result.success) {
            throw new Error(result.error || `Failed to fetch price for ${symbol}`);
        }

        return result.data;
    },

    /**
     * Get service metrics
     */
    getServiceMetrics: () => {
        return {
            ...CoreCryptoPriceService.getServiceMetrics(),
            proxyMetrics: LegacyServiceProxy.getServiceMetrics('CRYPTO_PRICES')
        };
    }
};

/**
 * Enhanced Metals Price Service with retry logic and monitoring
 */
export const MetalsPriceService = {
    /**
     * Get metals prices with enhanced reliability
     */
    getMetalsPrices: async () => {
        const result = await LegacyServiceProxy.executeWithRetry(
            () => CoreMetalsPriceService.getMetalsPrices(),
            'METALS_PRICES',
            'legacy-metals-service',
            {
                timeout: 6000, // 6 second timeout for metals API
                retries: 3     // More retries for metals (usually more stable)
            }
        );

        if (!result.success) {
            throw new Error(result.error || 'Failed to fetch metals prices');
        }

        return result.data;
    },

    /**
     * Get specific metal price
     */
    getMetalPrice: async (metal: string) => {
        const result = await LegacyServiceProxy.executeWithProxy(
            () => CoreMetalsPriceService.getMetalsPrices().then(prices =>
                prices.find(p => p.metal.toLowerCase() === metal.toLowerCase())
            ),
            `METAL_PRICE_${metal.toUpperCase()}`,
            'legacy-metals-service'
        );

        if (!result.success) {
            throw new Error(result.error || `Failed to fetch price for ${metal}`);
        }

        return result.data;
    },

    /**
     * Get service metrics
     */
    getServiceMetrics: () => {
        return {
            ...CoreMetalsPriceService.getServiceMetrics(),
            proxyMetrics: LegacyServiceProxy.getServiceMetrics('METALS_PRICES')
        };
    }
};
