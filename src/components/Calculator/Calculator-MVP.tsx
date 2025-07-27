import { Calculator as CalculatorIcon, Crown, RefreshCw, TrendingUp, Zap } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useApi } from '../../hooks/useApi';
import { useDebounce } from '../../hooks/useDebounce';
import type { CryptoAsset } from '../../types';
import './Calculator-MVP.css';

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
            const newCount = calculationCount + 1;
            setCalculationCount(newCount);
            
            // Update streak
            const today = new Date().toDateString();
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
            
            // Premium upsell triggers
            if (newCount === 5 || newCount === 15) {
                setShowPremiumUpsell(true);
                trackPremiumInterest('calculator_usage_trigger', { calculations: newCount });
            }
        }
    }, [debouncedAmount, selectedAsset, calculationCount, streak, trackPremiumInterest]);

    // Initialize streak from localStorage
    useEffect(() => {
        const savedStreak = localStorage.getItem('timevault_streak');
        if (savedStreak) {
            setStreak(parseInt(savedStreak));
        }
    }, []);
    useEffect(() => {
        track('calculator_loaded');
    }, [track]);

    // Calculate conversion results
    const conversionResult = useMemo((): ConversionResult | null => {
        if (!selectedAsset || !debouncedAmount || isNaN(Number(debouncedAmount))) {
            return null;
        }

        const inputAmount = Number(debouncedAmount);
        const usdValue = (selectedAsset.current_price || selectedAsset.price || 0) * inputAmount;

        // Get metal prices with fallbacks
        const goldPrice = metalPrices.find(m => m.metal === 'gold')?.price || 2050;
        const silverPrice = metalPrices.find(m => m.metal === 'silver')?.price || 24;
        const platinumPrice = metalPrices.find(m => m.metal === 'platinum')?.price || 1000;
        const palladiumPrice = metalPrices.find(m => m.metal === 'palladium')?.price || 1500;

        // Calculate metal conversions
        const metals = {
            gold: { amount: usdValue / goldPrice, unit: 'oz' },
            silver: { amount: usdValue / silverPrice, unit: 'oz' },
            platinum: { amount: usdValue / platinumPrice, unit: 'oz' },
            palladium: { amount: usdValue / palladiumPrice, unit: 'oz' }
        };

        // Calculate time equivalent
        const totalHours = usdValue / hourlyWage;
        const timeValue = {
            hours: totalHours,
            days: totalHours / 8, // 8-hour work days
            weeks: totalHours / 40 // 40-hour work weeks
        };

        return {
            asset: selectedAsset,
            amount: inputAmount,
            usdValue,
            metals,
            timeValue
        };
    }, [selectedAsset, debouncedAmount, metalPrices, hourlyWage]);

    // Handle amount input changes
    const handleAmountChange = (value: string) => {
        setAmount(value);
        track('calculator_amount_changed', {
            amount: value,
            asset: selectedAsset?.symbol || 'unknown'
        });
    };

    // Handle asset selection
    const handleAssetChange = (asset: CryptoAsset) => {
        setSelectedAsset(asset);
        track('calculator_asset_changed', {
            asset: asset.symbol,
            price: asset.current_price || asset.price || 0
        });
    };

    // Handle premium upsell interactions
    const handlePremiumClick = (source: string) => {
        trackPremiumInterest(source, {
            calculator_value: conversionResult?.usdValue || 0
        });
        setShowPremiumUpsell(true);
    };

    // Format currency values
    const formatCurrency = (value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(value);
    };

    // Format metal amounts
    const formatMetal = (amount: number): string => {
        if (amount < 0.01) {
            return amount.toExponential(2);
        }
        return amount.toFixed(4);
    };

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

export default Calculator;
