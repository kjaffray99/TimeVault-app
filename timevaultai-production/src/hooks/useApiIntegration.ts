/**
 * 🔗 API INTEGRATION SERVICE
 * Handles real-time crypto and precious metals price data
 * Optimized for reliability and performance
 */

'use client';

import { useCallback, useEffect, useState } from 'react';

// TypeScript interfaces
interface CryptoPriceData {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
    usd_market_cap: number;
  };
}

interface MetalsPriceData {
  gold: { price: number; change_24h: number };
  silver: { price: number; change_24h: number };
  platinum: { price: number; change_24h: number };
  palladium: { price: number; change_24h: number };
}

// Fallback prices (updated July 2025)
const FALLBACK_CRYPTO_PRICES: CryptoPriceData = {
  bitcoin: { usd: 97500, usd_24h_change: 2.4, usd_market_cap: 1900000000000 },
  ethereum: { usd: 3850, usd_24h_change: 1.8, usd_market_cap: 460000000000 },
  solana: { usd: 245, usd_24h_change: 3.2, usd_market_cap: 115000000000 },
  cardano: { usd: 1.25, usd_24h_change: -0.8, usd_market_cap: 45000000000 },
  ripple: { usd: 2.35, usd_24h_change: 1.5, usd_market_cap: 140000000000 },
  polkadot: { usd: 9.80, usd_24h_change: 0.9, usd_market_cap: 15000000000 }
};

const FALLBACK_METALS_PRICES: MetalsPriceData = {
  gold: { price: 2650, change_24h: 0.3 },
  silver: { price: 31.50, change_24h: -0.1 },
  platinum: { price: 980, change_24h: 0.8 },
  palladium: { price: 925, change_24h: -0.4 }
};

// Custom hook for crypto prices
export function useCryptoPrices() {
  const [data, setData] = useState<CryptoPriceData>(FALLBACK_CRYPTO_PRICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchCryptoPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const cryptoIds = Object.keys(FALLBACK_CRYPTO_PRICES).join(',');
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
        {
          headers: {
            'Accept': 'application/json',
          },
          next: { revalidate: 60 } // Cache for 60 seconds
        }
      );

      if (!response.ok) {
        throw new Error(`CoinGecko API error: ${response.status}`);
      }

      const result = await response.json();

      // Transform data to match our interface
      const transformedData: CryptoPriceData = {};
      Object.entries(result).forEach(([key, value]: [string, any]) => {
        transformedData[key] = {
          usd: value.usd || FALLBACK_CRYPTO_PRICES[key]?.usd || 0,
          usd_24h_change: value.usd_24h_change || FALLBACK_CRYPTO_PRICES[key]?.usd_24h_change || 0,
          usd_market_cap: value.usd_market_cap || FALLBACK_CRYPTO_PRICES[key]?.usd_market_cap || 0
        };
      });

      setData(transformedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('Failed to fetch crypto prices, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch crypto prices');
      setData(FALLBACK_CRYPTO_PRICES); // Always ensure we have data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCryptoPrices();

    // Update every 2 minutes
    const interval = setInterval(fetchCryptoPrices, 120000);

    return () => clearInterval(interval);
  }, [fetchCryptoPrices]);

  return { data, loading, error, lastUpdated, refetch: fetchCryptoPrices };
}

// Custom hook for metals prices
export function useMetalsPrices() {
  const [data, setData] = useState<MetalsPriceData>(FALLBACK_METALS_PRICES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchMetalsPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Try metals.live API first
      const response = await fetch('https://api.metals.live/v1/spot', {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`Metals API error: ${response.status}`);
      }

      const result = await response.json();

      const transformedData: MetalsPriceData = {
        gold: {
          price: result.gold?.price || FALLBACK_METALS_PRICES.gold.price,
          change_24h: result.gold?.change_24h || FALLBACK_METALS_PRICES.gold.change_24h
        },
        silver: {
          price: result.silver?.price || FALLBACK_METALS_PRICES.silver.price,
          change_24h: result.silver?.change_24h || FALLBACK_METALS_PRICES.silver.change_24h
        },
        platinum: {
          price: result.platinum?.price || FALLBACK_METALS_PRICES.platinum.price,
          change_24h: result.platinum?.change_24h || FALLBACK_METALS_PRICES.platinum.change_24h
        },
        palladium: {
          price: result.palladium?.price || FALLBACK_METALS_PRICES.palladium.price,
          change_24h: result.palladium?.change_24h || FALLBACK_METALS_PRICES.palladium.change_24h
        }
      };

      setData(transformedData);
      setLastUpdated(new Date());
    } catch (err) {
      console.warn('Failed to fetch metals prices, using fallback:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch metals prices');
      setData(FALLBACK_METALS_PRICES); // Always ensure we have data
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMetalsPrices();

    // Update every 5 minutes
    const interval = setInterval(fetchMetalsPrices, 300000);

    return () => clearInterval(interval);
  }, [fetchMetalsPrices]);

  return { data, loading, error, lastUpdated, refetch: fetchMetalsPrices };
}

// Analytics and tracking
export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: Record<string, any>) => {
    // Client-side analytics tracking
    if (typeof window !== 'undefined') {
      try {
        // Google Analytics 4
        if ((window as any).gtag) {
          (window as any).gtag('event', eventName, properties);
        }

        // Custom analytics
        console.log('Analytics Event:', eventName, properties);

        // Store for premium conversion tracking
        const events = JSON.parse(localStorage.getItem('timevault_events') || '[]');
        events.push({
          event: eventName,
          properties,
          timestamp: new Date().toISOString()
        });

        // Keep only last 100 events
        if (events.length > 100) {
          events.splice(0, events.length - 100);
        }

        localStorage.setItem('timevault_events', JSON.stringify(events));
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
      }
    }
  }, []);

  const trackCalculation = useCallback((calculation: {
    asset: string;
    amount: number;
    usdValue: number;
    metals: Record<string, number>;
    timeValue: number;
  }) => {
    trackEvent('calculator_calculation', {
      asset: calculation.asset,
      amount: calculation.amount,
      usd_value: calculation.usdValue,
      value_tier: calculation.usdValue > 10000 ? 'high' : calculation.usdValue > 1000 ? 'medium' : 'low',
      gold_oz: calculation.metals.gold,
      time_hours: calculation.timeValue
    });
  }, [trackEvent]);

  const trackPremiumInterest = useCallback((source: string, properties?: Record<string, any>) => {
    trackEvent('premium_interest', {
      source,
      ...properties,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return { trackEvent, trackCalculation, trackPremiumInterest };
}

// Performance monitoring
export function usePerformanceMonitoring() {
  const measureCalculationTime = useCallback((calculationFn: () => any) => {
    const startTime = performance.now();
    const result = calculationFn();
    const endTime = performance.now();

    const duration = endTime - startTime;

    // Track slow calculations
    if (duration > 100) {
      console.warn(`Slow calculation detected: ${duration}ms`);
    }

    return { result, duration };
  }, []);

  return { measureCalculationTime };
}
