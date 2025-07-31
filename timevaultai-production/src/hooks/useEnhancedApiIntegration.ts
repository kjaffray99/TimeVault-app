/**
 * 🔗 ENHANCED API INTEGRATION SERVICE - DAY 2 OPTIMIZATION
 * Advanced API integration with retry mechanisms, rate limiting, and expanded crypto support
 * Optimized for reliability, performance, and comprehensive market coverage
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// TypeScript interfaces
interface CryptoPriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
    usd_7d_change?: number;
    usd_30d_change?: number;
  };
}

interface MetalsPriceData {
  gold: { price: number; change_24h: number };
  silver: { price: number; change_24h: number };
  platinum: { price: number; change_24h: number };
  palladium: { price: number; change_24h: number };
  copper?: { price: number; change_24h: number };
}

interface ApiRetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

// Enhanced crypto assets with expanded support
const ENHANCED_CRYPTO_ASSETS = [
  'bitcoin', 'ethereum', 'solana', 'cardano', 'ripple', 'polkadot',
  'polygon', 'chainlink', 'avalanche-2', 'uniswap', 'the-graph', 'cosmos'
];

// Fallback prices (updated July 2025 with expanded assets)
const ENHANCED_FALLBACK_CRYPTO_PRICES: CryptoPriceData = {
  bitcoin: { usd: 97500, usd_24h_change: 2.4, usd_market_cap: 1900000000000, usd_7d_change: 5.2, usd_30d_change: 12.8 },
  ethereum: { usd: 3850, usd_24h_change: 1.8, usd_market_cap: 460000000000, usd_7d_change: 3.1, usd_30d_change: 8.9 },
  solana: { usd: 245, usd_24h_change: 3.2, usd_market_cap: 115000000000, usd_7d_change: 7.8, usd_30d_change: 15.6 },
  cardano: { usd: 1.25, usd_24h_change: -0.8, usd_market_cap: 45000000000, usd_7d_change: 2.1, usd_30d_change: 4.3 },
  ripple: { usd: 2.35, usd_24h_change: 1.5, usd_market_cap: 140000000000, usd_7d_change: 4.2, usd_30d_change: 18.7 },
  polkadot: { usd: 9.80, usd_24h_change: 0.9, usd_market_cap: 15000000000, usd_7d_change: 1.8, usd_30d_change: 6.2 },
  polygon: { usd: 1.15, usd_24h_change: 2.1, usd_market_cap: 12000000000, usd_7d_change: 5.4, usd_30d_change: 11.2 },
  chainlink: { usd: 28.50, usd_24h_change: 1.7, usd_market_cap: 18000000000, usd_7d_change: 3.8, usd_30d_change: 9.1 },
  'avalanche-2': { usd: 45.20, usd_24h_change: 2.8, usd_market_cap: 20000000000, usd_7d_change: 6.1, usd_30d_change: 13.4 },
  uniswap: { usd: 12.80, usd_24h_change: 1.2, usd_market_cap: 9000000000, usd_7d_change: 2.9, usd_30d_change: 7.6 },
  'the-graph': { usd: 0.28, usd_24h_change: 3.5, usd_market_cap: 3000000000, usd_7d_change: 8.2, usd_30d_change: 19.3 },
  cosmos: { usd: 8.90, usd_24h_change: 1.9, usd_market_cap: 4000000000, usd_7d_change: 4.7, usd_30d_change: 10.5 }
};

const ENHANCED_FALLBACK_METALS_PRICES: MetalsPriceData = {
  gold: { price: 2650, change_24h: 0.3 },
  silver: { price: 31.50, change_24h: -0.1 },
  platinum: { price: 980, change_24h: 0.8 },
  palladium: { price: 925, change_24h: -0.4 },
  copper: { price: 4.25, change_24h: 0.2 }
};

// Advanced retry mechanism with exponential backoff
class ApiRetryManager {
  private config: ApiRetryConfig;

  constructor(config: Partial<ApiRetryConfig> = {}) {
    this.config = {
      maxRetries: config.maxRetries || 3,
      baseDelay: config.baseDelay || 1000,
      maxDelay: config.maxDelay || 10000,
      backoffMultiplier: config.backoffMultiplier || 2
    };
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string = 'API call'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await operation();

        // Log successful retry if it's not the first attempt
        if (attempt > 0) {
          console.log(`✅ ${context} succeeded after ${attempt} retries`);
        }

        return result;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry if it's the last attempt
        if (attempt === this.config.maxRetries) {
          break;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          this.config.baseDelay * Math.pow(this.config.backoffMultiplier, attempt),
          this.config.maxDelay
        );

        console.warn(`⚠️ ${context} failed (attempt ${attempt + 1}/${this.config.maxRetries + 1}), retrying in ${delay}ms:`, error);

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    // All attempts failed
    console.error(`❌ ${context} failed after ${this.config.maxRetries + 1} attempts:`, lastError);
    throw lastError;
  }
}

// Rate limiting manager
class RateLimitManager {
  private lastCall: number = 0;
  private minInterval: number;

  constructor(requestsPerMinute: number = 30) {
    this.minInterval = 60000 / requestsPerMinute; // Convert to milliseconds
  }

  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    const timeSinceLastCall = now - this.lastCall;

    if (timeSinceLastCall < this.minInterval) {
      const waitTime = this.minInterval - timeSinceLastCall;
      console.log(`⏱️ Rate limit protection: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastCall = Date.now();
  }
}

// Enhanced crypto prices hook with retry and rate limiting
export function useEnhancedCryptoPrices() {
  const [data, setData] = useState<CryptoPriceData>(ENHANCED_FALLBACK_CRYPTO_PRICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'offline'>('healthy');

  const retryManager = useRef(new ApiRetryManager({
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    backoffMultiplier: 2
  })).current;

  const rateLimitManager = useRef(new RateLimitManager(30)).current; // 30 requests per minute

  const fetchCryptoPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await rateLimitManager.waitIfNeeded();

      const result = await retryManager.executeWithRetry(async () => {
        const cryptoIds = ENHANCED_CRYPTO_ASSETS.join(',');
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true&include_30d_change=true&include_market_cap=true&precision=4`,
          {
            headers: {
              'Accept': 'application/json',
              'Cache-Control': 'max-age=60'
            },
            signal: AbortSignal.timeout(10000) // 10 second timeout
          }
        );

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error('Rate limit exceeded');
          }
          throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
      }, 'CoinGecko price fetch');

      // Transform and validate data
      const transformedData: CryptoPriceData = {};
      let successfulAssets = 0;

      ENHANCED_CRYPTO_ASSETS.forEach(assetId => {
        const apiData = result[assetId];
        const fallbackData = ENHANCED_FALLBACK_CRYPTO_PRICES[assetId];

        if (apiData && typeof apiData.usd === 'number') {
          transformedData[assetId] = {
            usd: apiData.usd,
            usd_24h_change: apiData.usd_24h_change || 0,
            usd_market_cap: apiData.usd_market_cap || 0,
            usd_7d_change: apiData.usd_7d_change || 0,
            usd_30d_change: apiData.usd_30d_change || 0
          };
          successfulAssets++;
        } else if (fallbackData) {
          transformedData[assetId] = fallbackData;
          console.warn(`Using fallback data for ${assetId}`);
        }
      });

      // Determine health status
      const successRate = successfulAssets / ENHANCED_CRYPTO_ASSETS.length;
      if (successRate >= 0.9) {
        setHealthStatus('healthy');
      } else if (successRate >= 0.5) {
        setHealthStatus('degraded');
      } else {
        setHealthStatus('offline');
      }

      setData(transformedData);
      setLastUpdated(new Date());

      console.log(`✅ Crypto prices updated: ${successfulAssets}/${ENHANCED_CRYPTO_ASSETS.length} assets successful`);

    } catch (err) {
      console.warn('Failed to fetch crypto prices, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch crypto prices');
      setData(ENHANCED_FALLBACK_CRYPTO_PRICES);
      setHealthStatus('offline');
    } finally {
      setLoading(false);
    }
  }, [retryManager, rateLimitManager]);

  useEffect(() => {
    fetchCryptoPrices();

    // Update every 2 minutes for enhanced monitoring
    const interval = setInterval(fetchCryptoPrices, 120000);

    return () => clearInterval(interval);
  }, [fetchCryptoPrices]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    healthStatus,
    refetch: fetchCryptoPrices,
    supportedAssets: ENHANCED_CRYPTO_ASSETS.length
  };
}

// Enhanced metals prices hook
export function useEnhancedMetalsPrices() {
  const [data, setData] = useState<MetalsPriceData>(ENHANCED_FALLBACK_METALS_PRICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [healthStatus, setHealthStatus] = useState<'healthy' | 'degraded' | 'offline'>('healthy');

  const retryManager = useRef(new ApiRetryManager({
    maxRetries: 2,
    baseDelay: 2000,
    maxDelay: 10000,
    backoffMultiplier: 2
  })).current;

  const fetchMetalsPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await retryManager.executeWithRetry(async () => {
        // Try multiple metal price APIs for redundancy
        const apis = [
          'https://api.metals.live/v1/spot',
          'https://api.metalpriceapi.com/v1/latest?api_key=demo&base=USD&symbols=XAU,XAG,XPT,XPD'
        ];

        let lastError: Error | null = null;

        for (const apiUrl of apis) {
          try {
            const response = await fetch(apiUrl, {
              headers: { 'Accept': 'application/json' },
              signal: AbortSignal.timeout(8000)
            });

            if (response.ok) {
              return await response.json();
            }
          } catch (err) {
            lastError = err instanceof Error ? err : new Error(String(err));
            console.warn(`Metal API ${apiUrl} failed:`, err);
          }
        }

        throw lastError || new Error('All metal price APIs failed');
      }, 'Metals price fetch');

      // Transform data (flexible for different API responses)
      const transformedData: MetalsPriceData = {
        gold: {
          price: result.gold?.price || result.rates?.XAU ? (1 / result.rates.XAU) * 31.1035 : ENHANCED_FALLBACK_METALS_PRICES.gold.price,
          change_24h: result.gold?.change_24h || ENHANCED_FALLBACK_METALS_PRICES.gold.change_24h
        },
        silver: {
          price: result.silver?.price || result.rates?.XAG ? (1 / result.rates.XAG) * 31.1035 : ENHANCED_FALLBACK_METALS_PRICES.silver.price,
          change_24h: result.silver?.change_24h || ENHANCED_FALLBACK_METALS_PRICES.silver.change_24h
        },
        platinum: {
          price: result.platinum?.price || result.rates?.XPT ? (1 / result.rates.XPT) * 31.1035 : ENHANCED_FALLBACK_METALS_PRICES.platinum.price,
          change_24h: result.platinum?.change_24h || ENHANCED_FALLBACK_METALS_PRICES.platinum.change_24h
        },
        palladium: {
          price: result.palladium?.price || result.rates?.XPD ? (1 / result.rates.XPD) * 31.1035 : ENHANCED_FALLBACK_METALS_PRICES.palladium.price,
          change_24h: result.palladium?.change_24h || ENHANCED_FALLBACK_METALS_PRICES.palladium.change_24h
        },
        copper: {
          price: result.copper?.price || ENHANCED_FALLBACK_METALS_PRICES.copper!.price,
          change_24h: result.copper?.change_24h || ENHANCED_FALLBACK_METALS_PRICES.copper!.change_24h
        }
      };

      setData(transformedData);
      setLastUpdated(new Date());
      setHealthStatus('healthy');

      console.log('✅ Metals prices updated successfully');

    } catch (err) {
      console.warn('Failed to fetch metals prices, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metals prices');
      setData(ENHANCED_FALLBACK_METALS_PRICES);
      setHealthStatus('offline');
    } finally {
      setLoading(false);
    }
  }, [retryManager]);

  useEffect(() => {
    fetchMetalsPrices();

    // Update every 5 minutes
    const interval = setInterval(fetchMetalsPrices, 300000);

    return () => clearInterval(interval);
  }, [fetchMetalsPrices]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    healthStatus,
    refetch: fetchMetalsPrices
  };
}

// Enhanced analytics with advanced tracking
export function useEnhancedAnalytics() {
  const sessionId = useRef(Math.random().toString(36).substr(2, 9)).current;

  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined') {
      try {
        const eventData = {
          event: eventName,
          session_id: sessionId,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          user_agent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          ...properties
        };

        // Google Analytics 4
        if ((window as any).gtag) {
          (window as any).gtag('event', eventName, properties);
        }

        // Store locally for advanced analytics
        const events = JSON.parse(localStorage.getItem('timevault_enhanced_events') || '[]');
        events.push(eventData);

        // Maintain rolling window of events
        if (events.length > 200) {
          events.splice(0, events.length - 200);
        }

        localStorage.setItem('timevault_enhanced_events', JSON.stringify(events));

        // Log for debugging
        console.log('📊 Enhanced Analytics:', eventName, eventData);

      } catch (error) {
        console.warn('Enhanced analytics tracking failed:', error);
      }
    }
  }, [sessionId]);

  const trackCalculation = useCallback((calculation: {
    asset: string;
    amount: number;
    usdValue: number;
    metals: Record<string, number>;
    timeValue: number;
    portfolio?: boolean;
  }) => {
    trackEvent('enhanced_calculation', {
      asset: calculation.asset,
      amount: calculation.amount,
      usd_value: calculation.usdValue,
      value_tier: calculation.usdValue > 50000 ? 'ultra_high' :
        calculation.usdValue > 10000 ? 'high' :
          calculation.usdValue > 1000 ? 'medium' : 'low',
      metals_gold_oz: calculation.metals.gold,
      metals_silver_oz: calculation.metals.silver,
      time_hours: calculation.timeValue,
      is_portfolio: calculation.portfolio || false,
      calculation_complexity: Object.keys(calculation.metals).length
    });
  }, [trackEvent]);

  const trackPremiumInterest = useCallback((source: string, properties?: Record<string, any>) => {
    trackEvent('premium_interest_enhanced', {
      source,
      engagement_level: properties?.calculation_count > 5 ? 'high' : 'normal',
      value_context: properties?.calculation_value > 10000 ? 'high_value' : 'standard',
      ...properties
    });
  }, [trackEvent]);

  const trackPerformance = useCallback((metric: string, value: number, context?: Record<string, any>) => {
    trackEvent('performance_metric', {
      metric,
      value,
      ...context,
      device_type: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent) ? 'mobile' : 'desktop'
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackCalculation,
    trackPremiumInterest,
    trackPerformance,
    sessionId
  };
}

// Performance monitoring with detailed metrics
export function usePerformanceMonitoring() {
  const { trackPerformance } = useEnhancedAnalytics();

  const measureOperation = useCallback(<T>(
    operation: () => T | Promise<T>,
    operationName: string,
    context?: Record<string, any>
  ) => {
    const startTime = performance.now();
    const startMemory = (performance as any).memory?.usedJSHeapSize || 0;

    const finish = (result: T) => {
      const endTime = performance.now();
      const endMemory = (performance as any).memory?.usedJSHeapSize || 0;
      const duration = endTime - startTime;
      const memoryDelta = endMemory - startMemory;

      // Track performance metrics
      trackPerformance('operation_duration', duration, {
        operation: operationName,
        memory_delta: memoryDelta,
        ...context
      });

      // Warn about slow operations
      if (duration > 100) {
        console.warn(`🐌 Slow operation detected: ${operationName} took ${duration.toFixed(2)}ms`);
      }

      return result;
    };

    try {
      const result = operation();

      if (result instanceof Promise) {
        return result.then(finish);
      } else {
        return finish(result);
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      trackPerformance('operation_error', duration, {
        operation: operationName,
        error: error instanceof Error ? error.message : String(error),
        ...context
      });
      throw error;
    }
  }, [trackPerformance]);

  return { measureOperation };
}

// Backwards compatibility exports
export const useCryptoPrices = useEnhancedCryptoPrices;
export const useMetalsPrices = useEnhancedMetalsPrices;
export const useAnalytics = useEnhancedAnalytics;
