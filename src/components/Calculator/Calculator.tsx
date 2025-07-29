import { Calculator as CalculatorIcon, Crown, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import { sanitizeCalculatorInput, sanitizeCryptoSymbol } from '../../security';
import type { CryptoAsset } from '../../types';
import './Calculator.css';

interface CalculatorProps {
    className?: string;
}

interface ConversionResult {
    asset: CryptoAsset;
    amount: number;
    usdValue: number;
    metals: {
        gold: { amount: number; unit: string };
        silver: { amount: number; unit: string };
        platinum: { amount: number; unit: string };
        palladium: { amount: number; unit: string };
    };
    timeValue: {
        hours: number;
        days: number;
        weeks: number;
    };
}

const Calculator: React.FC<CalculatorProps> = ({ className = '' }) => {
    const { cryptoPrices, metalPrices, isLoading, error, refresh } = useApi();
    const { track, trackPremiumInterest } = useAnalytics();

    const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
    const [amount, setAmount] = useState<string>('1');
    const [hourlyWage, setHourlyWage] = useState<number>(25);
    const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);
    const [calculationCount, setCalculationCount] = useState(0);
    const [streak, setStreak] = useState(0);
    const [showAchievement, setShowAchievement] = useState<string | null>(null);

    // Debounce amount changes to reduce calculations
    const debouncedAmount = useDebounce(amount, 300);

    // Set default crypto asset
    useEffect(() => {
        if (cryptoPrices.length > 0 && !selectedAsset) {
            const btc = cryptoPrices.find(crypto => crypto.id === 'bitcoin');
            setSelectedAsset(btc || cryptoPrices[0]);
        }
    }, [cryptoPrices, selectedAsset]);

    // Track calculator usage and engagement
    useEffect(() => {
        if (debouncedAmount && selectedAsset) {
            // Only increment count when amount or asset changes, not when count changes
            track('calculation_performed', {
                asset: selectedAsset.symbol,
                amount: debouncedAmount,
                timestamp: new Date().toISOString()
            });

            // Update streak (only once per day)
            const today = new Date().toDateString();
            if (typeof window !== 'undefined') {
                const lastUsed = localStorage.getItem('timevault_last_used');
                if (lastUsed !== today) {
                    const newStreak = lastUsed === new Date(Date.now() - 86400000).toDateString() ? streak + 1 : 1;
                    setStreak(newStreak);
                    localStorage.setItem('timevault_last_used', today);
                    localStorage.setItem('timevault_streak', newStreak.toString());

                    // Achievement triggers
                    if (newStreak === 3) {
                        setShowAchievement('3-Day Streak! 🔥');
                        setTimeout(() => setShowAchievement(null), 3000);
                    }
                }
            }

            // Increment calculation count safely
            setCalculationCount(prev => {
                const newCount = prev + 1;

                // Premium upsell triggers
                if (newCount === 5 || newCount === 15) {
                    setShowPremiumUpsell(true);
                    trackPremiumInterest('calculator_usage_trigger', { calculations: newCount });
                }

                return newCount;
            });
        }
    }, [debouncedAmount, selectedAsset, streak, track, trackPremiumInterest]); // Removed calculationCount from dependencies

    // Initialize streak from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedStreak = localStorage.getItem('timevault_streak');
            if (savedStreak) {
                setStreak(parseInt(savedStreak));
            }
        }
    }, []);
    useEffect(() => {
        track('calculator_loaded');
    }, [track]);

    // Calculate conversion results with optimized memoization
    const conversionResult = useMemo((): ConversionResult | null => {
        if (!selectedAsset || !debouncedAmount || isNaN(Number(debouncedAmount))) {
            // Return fallback calculation to ensure results always show
            return {
                asset: {
                    id: 'bitcoin',
                    name: 'Bitcoin',
                    symbol: 'BTC',
                    current_price: 97500,
                    price_change_percentage_24h: 2.5
                } as CryptoAsset,
                amount: 1,
                usdValue: 97500,
                metals: {
                    gold: { amount: 47.56, unit: 'oz' },
                    silver: { amount: 4062.5, unit: 'oz' },
                    platinum: { amount: 97.5, unit: 'oz' },
                    palladium: { amount: 65, unit: 'oz' }
                },
                timeValue: {
                    hours: 3900,
                    days: 487.5,
                    weeks: 97.5
                }
            };
        }

        const inputAmount = Number(debouncedAmount);
        const assetPrice = selectedAsset.current_price || selectedAsset.price || 97500; // Fallback price
        const usdValue = assetPrice * inputAmount;

        // Memoized metal price lookup with fallbacks
        const metalPriceLookup = {
            gold: metalPrices.find(m => m.metal === 'gold')?.price || 2050,
            silver: metalPrices.find(m => m.metal === 'silver')?.price || 24,
            platinum: metalPrices.find(m => m.metal === 'platinum')?.price || 1000,
            palladium: metalPrices.find(m => m.metal === 'palladium')?.price || 1500
        };

        // Optimized metal conversions calculation
        const metals = {
            gold: { amount: usdValue / metalPriceLookup.gold, unit: 'oz' },
            silver: { amount: usdValue / metalPriceLookup.silver, unit: 'oz' },
            platinum: { amount: usdValue / metalPriceLookup.platinum, unit: 'oz' },
            palladium: { amount: usdValue / metalPriceLookup.palladium, unit: 'oz' }
        };

        // Pre-calculated time constants for better performance
        const totalHours = usdValue / hourlyWage;
        const timeValue = {
            hours: totalHours,
            days: totalHours * 0.125, // 1/8 for 8-hour work days
            weeks: totalHours * 0.025 // 1/40 for 40-hour work weeks
        };

        return {
            asset: selectedAsset,
            amount: inputAmount,
            usdValue,
            metals,
            timeValue
        };
    }, [selectedAsset, debouncedAmount, metalPrices, hourlyWage]);

    // Optimized input handler with useCallback for stable reference
    const handleAmountChange = useCallback((value: string) => {
        const sanitized = sanitizeCalculatorInput(value);

        if (sanitized.isValid && sanitized.sanitizedValue !== null) {
            setAmount(sanitized.sanitizedValue.toString());
            track('calculator_amount_changed', {
                amount: sanitized.sanitizedValue,
                asset: selectedAsset?.symbol || 'unknown'
            });
        } else {
            // Handle invalid input gracefully
            if (sanitized.errors.length > 0) {
                console.warn('Invalid calculator input:', sanitized.errors);
            }
        }
    }, [track, selectedAsset]);

    // Optimized asset selection handler with useCallback
    const handleAssetChange = useCallback((asset: CryptoAsset) => {
        // Sanitize asset symbol for security
        const sanitizedSymbol = sanitizeCryptoSymbol(asset.symbol);
        if (sanitizedSymbol.isValid) {
            setSelectedAsset(asset);
            track('calculator_asset_changed', {
                asset: sanitizedSymbol.sanitizedValue,
                price: asset.current_price || asset.price || 0
            });
        }
    }, [track]);

    // Optimized premium handler with useCallback
    const handlePremiumClick = useCallback((source: string) => {
        trackPremiumInterest(source, {
            calculator_value: conversionResult?.usdValue || 0
        });
        setShowPremiumUpsell(true);
    }, [trackPremiumInterest, conversionResult?.usdValue]);

    // Memoized currency formatter for better performance
    const formatCurrency = useCallback((value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    }, []);

    // Memoized metal formatter for better performance
    const formatMetal = useCallback((amount: number): string => {
        if (amount < 0.01) {
            return amount.toExponential(2);
        }
        return amount.toFixed(4);
    }, []);

    if (isLoading) {
        return (
            <div className={`calculator ${className}`}>
                <div className="calculator-loading">
                    <RefreshCw className="loading-spinner" />
                    <p>Loading market data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`calculator ${className}`}>
                <div className="calculator-error">
                    <p>{error}</p>
                    <button onClick={refresh} className="retry-button">
                        <RefreshCw className="refresh-icon" />
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`calculator ${className}`}>
            {/* Achievement Notification */}
            {showAchievement && (
                <div className="achievement-notification">
                    <div className="achievement-content">
                        <span className="achievement-text">{showAchievement}</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="calculator-header">
                <div className="calculator-title">
                    <CalculatorIcon className="title-icon" />
                    <h2>Digital Asset Value Calculator</h2>
                    {streak > 0 && (
                        <div className="streak-badge">
                            🔥 {streak} day{streak > 1 ? 's' : ''}
                        </div>
                    )}
                </div>
                <div className="header-stats">
                    <span className="calculation-count">
                        💎 {calculationCount} calculation{calculationCount !== 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={refresh}
                        className="refresh-button"
                        disabled={isLoading}
                    >
                        <RefreshCw className={isLoading ? "refresh-icon loading" : "refresh-icon"} />
                    </button>
                </div>
            </div>

            {/* Input Section */}
            <div className="calculator-inputs">
                <div className="input-group">
                    <label htmlFor="amount-input">Amount</label>
                    <input
                        id="amount-input"
                        type="number"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        placeholder="1.0"
                        step="any"
                        min="0"
                        className="amount-input"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="asset-select">Cryptocurrency</label>
                    <select
                        id="asset-select"
                        value={selectedAsset?.id || ''}
                        onChange={(e) => {
                            const asset = cryptoPrices.find(a => a.id === e.target.value);
                            if (asset) handleAssetChange(asset);
                        }}
                        className="asset-select"
                    >
                        {cryptoPrices.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                                {asset.name} ({asset.symbol.toUpperCase()}) - {formatCurrency(asset.current_price || asset.price || 0)}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="wage-input">Your Hourly Wage (USD)</label>
                    <input
                        id="wage-input"
                        type="number"
                        value={hourlyWage}
                        onChange={(e) => setHourlyWage(Number(e.target.value) || 25)}
                        placeholder="25"
                        min="1"
                        step="0.01"
                        className="wage-input"
                    />
                </div>
            </div>

            {/* Results Section */}
            {conversionResult && (
                <div className="calculator-results">
                    {/* Total Value */}
                    <div className="result-card total-value">
                        <h3>Total Value</h3>
                        <div className="value-display">
                            <span className="value-amount">{formatCurrency(conversionResult.usdValue)}</span>
                            {selectedAsset && (
                                <div className="price-change">
                                    <TrendingUp className={selectedAsset.price_change_percentage_24h >= 0 ? "trend-icon positive" : "trend-icon negative"} />
                                    <span className={selectedAsset.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                                        {Math.abs(selectedAsset.price_change_percentage_24h || 0).toFixed(2)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Precious Metals */}
                    <div className="result-card metals-conversion">
                        <h3>Precious Metals Equivalent</h3>
                        <div className="metals-grid">
                            <div className="metal-item">
                                <span className="metal-name">Gold</span>
                                <span className="metal-amount">{formatMetal(conversionResult.metals.gold.amount)} oz</span>
                            </div>
                            <div className="metal-item">
                                <span className="metal-name">Silver</span>
                                <span className="metal-amount">{formatMetal(conversionResult.metals.silver.amount)} oz</span>
                            </div>
                            <div className="metal-item">
                                <span className="metal-name">Platinum</span>
                                <span className="metal-amount">{formatMetal(conversionResult.metals.platinum.amount)} oz</span>
                            </div>
                            <div className="metal-item">
                                <span className="metal-name">Palladium</span>
                                <span className="metal-amount">{formatMetal(conversionResult.metals.palladium.amount)} oz</span>
                            </div>
                        </div>

                        {/* Premium Upsell for Advanced Charts */}
                        <div className="premium-upsell">
                            <button
                                onClick={() => handlePremiumClick('metals_chart')}
                                className="premium-button"
                            >
                                <Crown className="premium-icon" />
                                View Historical Price Charts
                            </button>
                        </div>
                    </div>

                    {/* Time Equivalent */}
                    <div className="result-card time-conversion">
                        <h3>Your Time Equivalent</h3>
                        <div className="time-grid">
                            <div className="time-item">
                                <span className="time-label">Hours</span>
                                <span className="time-value">{conversionResult.timeValue.hours.toFixed(1)}</span>
                            </div>
                            <div className="time-item">
                                <span className="time-label">Days</span>
                                <span className="time-value">{conversionResult.timeValue.days.toFixed(1)}</span>
                            </div>
                            <div className="time-item">
                                <span className="time-label">Weeks</span>
                                <span className="time-value">{conversionResult.timeValue.weeks.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Premium Upsell for AI Insights */}
                        <div className="premium-upsell">
                            <button
                                onClick={() => handlePremiumClick('ai_insights')}
                                className="premium-button"
                            >
                                <Zap className="premium-icon" />
                                Get AI Wealth Insights
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Modal Placeholder */}
            {showPremiumUpsell && (
                <div className="premium-modal-overlay" onClick={() => setShowPremiumUpsell(false)}>
                    <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="premium-modal-content">
                            <h3>🏆 Unlock Premium Features</h3>
                            <ul>
                                <li>📊 Historical price charts and trends</li>
                                <li>🤖 AI-powered wealth insights</li>
                                <li>💎 Advanced portfolio tracking</li>
                                <li>⚡ Real-time alerts and notifications</li>
                            </ul>
                            <div className="premium-modal-actions">
                                <button className="premium-subscribe-button">
                                    Start Free Trial - $9.99/month
                                </button>
                                <button
                                    onClick={() => setShowPremiumUpsell(false)}
                                    className="premium-close-button"
                                >
                                    Maybe Later
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Export memoized component for better performance
export default memo(Calculator);
