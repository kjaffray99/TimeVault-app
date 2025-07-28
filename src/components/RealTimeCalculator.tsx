import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import { sanitizeInput } from '../utils/security';

// API configuration for real-time data
const API_CONFIG = {
    crypto: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
            prices: '/simple/price',
            trending: '/search/trending'
        },
        refreshInterval: 5000, // 5 seconds for crypto
        retryAttempts: 3
    },
    metals: {
        baseUrl: 'https://metals.live/v1',
        endpoints: {
            spot: '/spot'
        },
        refreshInterval: 30000, // 30 seconds for metals
        retryAttempts: 2
    }
};

// Enhanced data fetching with error handling and caching
const fetchCryptoPrices = async (coins: string[]) => {
    const coinsParam = coins.join(',');
    const response = await fetch(
        `${API_CONFIG.crypto.baseUrl}${API_CONFIG.crypto.endpoints.prices}?ids=${coinsParam}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
        {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Crypto API error: ${response.status}`);
    }

    return response.json();
};

const fetchMetalsPrices = async () => {
    const response = await fetch(
        `${API_CONFIG.metals.baseUrl}${API_CONFIG.metals.endpoints.spot}`,
        {
            headers: {
                'Accept': 'application/json'
            }
        }
    );

    if (!response.ok) {
        throw new Error(`Metals API error: ${response.status}`);
    }

    return response.json();
};

// Real-time price hooks with React Query
export const useCryptoPrices = (coins: string[]) => {
    return useQuery({
        queryKey: ['crypto-prices', coins],
        queryFn: () => fetchCryptoPrices(coins),
        refetchInterval: API_CONFIG.crypto.refreshInterval,
        staleTime: 4000, // Consider data stale after 4 seconds
        gcTime: 60000, // Keep in cache for 1 minute (renamed from cacheTime)
        retry: API_CONFIG.crypto.retryAttempts,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
    });
};

export const useMetalsPrices = () => {
    return useQuery({
        queryKey: ['metals-prices'],
        queryFn: fetchMetalsPrices,
        refetchInterval: API_CONFIG.metals.refreshInterval,
        staleTime: 25000, // Consider data stale after 25 seconds
        gcTime: 300000, // Keep in cache for 5 minutes (renamed from cacheTime)
        retry: API_CONFIG.metals.retryAttempts,
        retryDelay: (attemptIndex) => Math.min(2000 * 2 ** attemptIndex, 30000)
    });
};

// Enhanced calculator with real-time data
interface RealTimeCalculatorProps {
    onPremiumTrigger?: () => void;
    onUserBehavior?: (data: any) => void;
}

export const RealTimeCalculator: React.FC<RealTimeCalculatorProps> = ({
    onPremiumTrigger,
    onUserBehavior
}) => {
    const [selectedAsset, setSelectedAsset] = useState('bitcoin');
    const [amount, setAmount] = useState('');
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
    const [conversionHistory, setConversionHistory] = useState<any[]>([]);

    const queryClient = useQueryClient();

    // Real-time crypto data
    const {
        data: cryptoData,
        isLoading: cryptoLoading,
        error: cryptoError,
        dataUpdatedAt: cryptoUpdatedAt
    } = useCryptoPrices([
        'bitcoin', 'ethereum', 'xrp', 'cardano', 'solana',
        'polkadot', 'chainlink', 'litecoin', 'bitcoin-cash'
    ]);

    // Real-time metals data
    const {
        data: metalsData,
        isLoading: metalsLoading,
        error: metalsError,
        dataUpdatedAt: metalsUpdatedAt
    } = useMetalsPrices();

    // Update last refresh time when data changes
    useEffect(() => {
        if (cryptoUpdatedAt || metalsUpdatedAt) {
            setLastUpdate(new Date());
        }
    }, [cryptoUpdatedAt, metalsUpdatedAt]);

    // Enhanced calculation with real-time data
    const calculateRealTimeValue = () => {
        const sanitizedAmount = sanitizeInput(amount);
        const numAmount = parseFloat(sanitizedAmount);

        if (!sanitizedAmount || numAmount <= 0 || isNaN(numAmount)) {
            return null;
        }

        let currentPrice = 0;
        let assetData: any = null;

        // Get current price from real-time data
        if (selectedAsset === 'gold' || selectedAsset === 'silver') {
            if (metalsData && (metalsData as any)[selectedAsset]) {
                const metalData = (metalsData as any)[selectedAsset];
                currentPrice = metalData.price;
                assetData = metalData;
            }
        } else {
            if (cryptoData && (cryptoData as any)[selectedAsset]) {
                const cryptoAsset = (cryptoData as any)[selectedAsset];
                currentPrice = cryptoAsset.usd;
                assetData = cryptoAsset;
            }
        }

        if (!currentPrice) return null;

        const totalValue = numAmount * currentPrice;
        const change24h = assetData?.usd_24h_change || assetData?.change_24h || 0;
        const marketCap = assetData?.usd_market_cap || 'N/A';

        const calculation = {
            asset: selectedAsset,
            amount: numAmount,
            price: currentPrice,
            totalValue,
            change24h,
            marketCap,
            timestamp: new Date(),
            source: 'real-time'
        };

        // Track user behavior for premium triggers
        if (onUserBehavior) {
            onUserBehavior({
                action: 'real_time_calculation',
                asset: selectedAsset,
                amount: numAmount,
                value: totalValue,
                timestamp: new Date()
            });
        }

        // Premium trigger for high-value calculations
        if (totalValue > 10000 && onPremiumTrigger) {
            onPremiumTrigger();
        }

        return calculation;
    };

    const handleCalculation = () => {
        const result = calculateRealTimeValue();
        if (result) {
            setConversionHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5
        }
    };

    // Force refresh data
    const forceRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['crypto-prices'] });
        queryClient.invalidateQueries({ queryKey: ['metals-prices'] });
    };

    const getAssetOptions = () => {
        const cryptoOptions = cryptoData ? Object.keys(cryptoData).map(key => ({
            value: key,
            label: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
            price: (cryptoData as any)[key].usd,
            change: (cryptoData as any)[key].usd_24h_change
        })) : [];

        const metalOptions = metalsData ? Object.keys(metalsData).map(key => ({
            value: key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            price: (metalsData as any)[key].price,
            change: (metalsData as any)[key].change_24h
        })) : [];

        return [...cryptoOptions, ...metalOptions];
    };

    const currentResult = calculateRealTimeValue();
    const isLoading = cryptoLoading || metalsLoading;
    const hasError = cryptoError || metalsError;

    return (
        <div className="real-time-calculator">
            <div className="data-status">
                <div className="status-indicators">
                    <span className={`status-dot ${isLoading ? 'loading' : 'live'}`}></span>
                    <span className="status-text">
                        {isLoading ? 'Updating...' : 'Live Data'}
                    </span>
                    <span className="last-update">
                        Last: {lastUpdate.toLocaleTimeString()}
                    </span>
                    <button
                        onClick={forceRefresh}
                        className="refresh-btn"
                        disabled={isLoading}
                    >
                        🔄
                    </button>
                </div>
                {hasError && (
                    <div className="error-notice">
                        ⚠️ Some data may be delayed
                    </div>
                )}
            </div>

            <div className="calculator-inputs">
                <div className="input-group">
                    <label htmlFor="asset-select">Asset:</label>
                    <select
                        id="asset-select"
                        value={selectedAsset}
                        onChange={(e) => setSelectedAsset(e.target.value)}
                        className="asset-selector"
                    >
                        {getAssetOptions().map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label} - ${option.price?.toLocaleString()}
                                {option.change && (
                                    <span className={option.change >= 0 ? 'positive' : 'negative'}>
                                        ({option.change >= 0 ? '+' : ''}{option.change.toFixed(2)}%)
                                    </span>
                                )}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="amount-input">Amount:</label>
                    <input
                        id="amount-input"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount..."
                        className="amount-input"
                        min="0"
                        step="0.0001"
                    />
                </div>

                <button
                    onClick={handleCalculation}
                    className="calculate-btn"
                    disabled={!amount || isLoading}
                >
                    Calculate Real-Time Value
                </button>
            </div>

            {currentResult && (
                <div className="real-time-result">
                    <div className="result-header">
                        <h3>Current Value</h3>
                        <span className="live-indicator">🔴 LIVE</span>
                    </div>
                    <div className="value-display">
                        <span className="total-value">
                            ${currentResult.totalValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            })}
                        </span>
                        {currentResult.change24h !== 0 && (
                            <span className={`change-indicator ${currentResult.change24h >= 0 ? 'positive' : 'negative'}`}>
                                {currentResult.change24h >= 0 ? '↗' : '↘'}
                                {Math.abs(currentResult.change24h).toFixed(2)}% (24h)
                            </span>
                        )}
                    </div>
                    <div className="result-details">
                        <div className="detail-item">
                            <span>Price per unit:</span>
                            <span>${currentResult.price.toLocaleString()}</span>
                        </div>
                        <div className="detail-item">
                            <span>Quantity:</span>
                            <span>{currentResult.amount.toLocaleString()}</span>
                        </div>
                        {currentResult.marketCap !== 'N/A' && (
                            <div className="detail-item">
                                <span>Market Cap:</span>
                                <span>${currentResult.marketCap.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {conversionHistory.length > 0 && (
                <div className="conversion-history">
                    <h4>Recent Calculations</h4>
                    <div className="history-list">
                        {conversionHistory.map((calc, index) => (
                            <div key={index} className="history-item">
                                <span className="asset-name">{calc.asset}</span>
                                <span className="amount">{calc.amount}</span>
                                <span className="value">${calc.totalValue.toLocaleString()}</span>
                                <span className="timestamp">
                                    {calc.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RealTimeCalculator;
