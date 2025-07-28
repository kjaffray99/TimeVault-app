// lib/api.ts - Server-side API functions for crypto/metals data
import axios from 'axios';

export interface CryptoPrice {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap: number;
    last_updated: string;
}

export interface MetalPrice {
    gold: number;
    silver: number;
    timestamp: string;
}

export interface TimeCalculation {
    cryptoAmount: number;
    cryptoPrice: number;
    totalValue: number;
    hourlyWage: number;
    hoursOfWork: number;
    daysOfWork: number;
    weeksOfWork: number;
    timeBreakdown: {
        years: number;
        months: number;
        days: number;
        hours: number;
    };
}

// Cache for API responses
const cache = new Map<string, { data: unknown; timestamp: number; ttl: number }>();

function getCachedData<T>(key: string): T | null {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
        return cached.data as T;
    }
    cache.delete(key);
    return null;
}

function setCachedData(key: string, data: unknown, ttlMs: number) {
    cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttlMs
    });
}

export async function getCryptoPrices(cryptoIds: string[] = ['bitcoin', 'ethereum', 'ripple', 'cardano', 'solana']): Promise<CryptoPrice[]> {
    const cacheKey = `crypto_prices_${cryptoIds.join('_')}`;
    const cached = getCachedData<CryptoPrice[]>(cacheKey);

    if (cached) {
        return cached;
    }

    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
                vs_currency: 'usd',
                ids: cryptoIds.join(','),
                order: 'market_cap_desc',
                per_page: cryptoIds.length,
                page: 1,
                sparkline: false,
                price_change_percentage: '24h'
            },
            timeout: 5000
        });

        const data = response.data;
        setCachedData(cacheKey, data, 30000); // 30 second cache
        return data;
    } catch (error) {
        console.error('Failed to fetch crypto prices:', error);
        // Enhanced fallback data with all supported cryptos for immediate functionality
        const fallbackPrices = [
            { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 97500, price_change_24h: 1200, price_change_percentage_24h: 1.25, market_cap: 1900000000000, last_updated: new Date().toISOString() },
            { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3400, price_change_24h: -45, price_change_percentage_24h: -1.3, market_cap: 410000000000, last_updated: new Date().toISOString() },
            { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 2.45, price_change_24h: 0.012, price_change_percentage_24h: 0.5, market_cap: 140000000000, last_updated: new Date().toISOString() },
            { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 1.12, price_change_24h: -0.009, price_change_percentage_24h: -0.8, market_cap: 40000000000, last_updated: new Date().toISOString() },
            { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 245, price_change_24h: 7.6, price_change_percentage_24h: 3.2, market_cap: 115000000000, last_updated: new Date().toISOString() },
            { id: 'dogecoin', symbol: 'doge', name: 'Dogecoin', current_price: 0.38, price_change_24h: 0.006, price_change_percentage_24h: 1.6, market_cap: 56000000000, last_updated: new Date().toISOString() }
        ];
        return fallbackPrices.filter(crypto => cryptoIds.includes(crypto.id));
    }
}

export async function getMetalPrices(): Promise<MetalPrice> {
    const cacheKey = 'metal_prices';
    const cached = getCachedData<MetalPrice>(cacheKey);

    if (cached) {
        return cached;
    }

    try {
        const response = await axios.get('https://api.metals.live/v1/spot', {
            timeout: 5000
        });

        const data = {
            gold: response.data.gold || 2050,
            silver: response.data.silver || 24.5,
            timestamp: new Date().toISOString()
        };

        setCachedData(cacheKey, data, 60000); // 1 minute cache
        return data;
    } catch (error) {
        console.error('Failed to fetch metal prices:', error);
        // Return mock data for SSR reliability
        return {
            gold: 2050,
            silver: 24.5,
            timestamp: new Date().toISOString()
        };
    }
}

export function calculateTimeValue(
    cryptoAmount: number,
    cryptoPrice: number,
    hourlyWage: number = 25
): TimeCalculation {
    const totalValue = cryptoAmount * cryptoPrice;
    const hoursOfWork = totalValue / hourlyWage;
    const daysOfWork = hoursOfWork / 8; // 8-hour work day
    const weeksOfWork = hoursOfWork / 40; // 40-hour work week

    const timeBreakdown = {
        years: Math.floor(hoursOfWork / (365 * 8)),
        months: Math.floor((hoursOfWork % (365 * 8)) / (30 * 8)),
        days: Math.floor((hoursOfWork % (30 * 8)) / 8),
        hours: Math.floor(hoursOfWork % 8)
    };

    return {
        cryptoAmount,
        cryptoPrice,
        totalValue,
        hourlyWage,
        hoursOfWork,
        daysOfWork,
        weeksOfWork,
        timeBreakdown
    };
}

export function generateShareableText(calculation: TimeCalculation, cryptoSymbol: string): string {
    return `🤯 My ${calculation.cryptoAmount} ${cryptoSymbol.toUpperCase()} is worth ${calculation.hoursOfWork.toFixed(1)} HOURS of work! That's ${calculation.daysOfWork.toFixed(1)} work days at $${calculation.hourlyWage}/hr. Calculate yours: https://timevaultai.com`;
}

export function generateSEOMetadata(crypto: string, amount: number, calculation: TimeCalculation) {
    const title = `${amount} ${crypto.toUpperCase()} = ${calculation.hoursOfWork.toFixed(1)} Hours of Work | TimeVault Calculator`;
    const description = `Convert ${amount} ${crypto} to time value: $${calculation.totalValue.toLocaleString()} equals ${calculation.hoursOfWork.toFixed(1)} hours of work at $${calculation.hourlyWage}/hour. Free crypto time calculator.`;

    return {
        title,
        description,
        canonical: `/calculator/${crypto}/${amount}`,
        ogImage: `/api/og?crypto=${crypto}&amount=${amount}&hours=${calculation.hoursOfWork.toFixed(1)}&value=${calculation.totalValue}`
    };
}
