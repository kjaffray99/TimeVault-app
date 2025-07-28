import React, { useCallback, useState, useMemo, memo } from 'react';
import { useOptimizedPriceData } from '../hooks/useRealtimeData';
import { security } from '../utils/securityEnhanced';
import { PerformanceOptimizer, optimizeMemory } from '../utils/performanceOptimizer';
import { analytics } from '../services/analyticsEnhanced';

interface TimeConversionResult {
    cryptoValue: number;
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

interface PersonalTimeCalculatorProps {
    onShare?: (result: TimeConversionResult) => void;
    onPremiumTrigger?: (trigger: string) => void;
}

// Memoized calculator for maximum performance
export const PersonalTimeCalculator: React.FC<PersonalTimeCalculatorProps> = memo(({
    onShare,
    onPremiumTrigger
}) => {
    const [cryptoAmount, setCryptoAmount] = useState('1');
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [hourlyWage, setHourlyWage] = useState('25');
    const [results, setResults] = useState<TimeConversionResult | null>(null);
    const [shareCount, setShareCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{ crypto?: string; wage?: string }>({});

    // Optimized crypto options with memoization
    const cryptoOptions = useMemo(() => [
        { value: 'bitcoin', label: 'Bitcoin (BTC)', symbol: '₿' },
        { value: 'ethereum', label: 'Ethereum (ETH)', symbol: 'Ξ' },
        { value: 'ripple', label: 'XRP', symbol: 'XRP' },
        { value: 'cardano', label: 'Cardano (ADA)', symbol: 'ADA' },
        { value: 'solana', label: 'Solana (SOL)', symbol: 'SOL' }
    ], []);

    const { cryptoPrices, metalsPrices, isLoading: pricesLoading, error: pricesError } = useOptimizedPriceData([
        'bitcoin', 'ethereum', 'ripple', 'cardano', 'solana'
    ]);

    // Debounced calculation for performance
    const calculateTimeValue = useMemo(() =>
        optimizeMemory.debounce(async (amount: string, crypto: string, wage: string) => {
            return PerformanceOptimizer.measureAsyncOperation('time_calculation', async () => {
                setIsLoading(true);
                setErrors({});

                try {
                    // Enhanced input validation
                    const amountValidation = security.sanitizeCryptoInput(amount);
                    const wageValidation = security.sanitizeWageInput(wage);

                    if (!amountValidation.isValid) {
                        setErrors(prev => ({ ...prev, crypto: amountValidation.error }));
                        return;
                    }

                    if (!wageValidation.isValid) {
                        setErrors(prev => ({ ...prev, wage: wageValidation.error }));
                        return;
                    }
                    const amount = amountValidation.value;
                    const wage = wageValidation.value;

                    // Enhanced price validation
                    const cryptoPrice = cryptoPrices?.[crypto]?.usd || 0;
                    if (cryptoPrice <= 0) {
                        throw new Error('Unable to fetch crypto price');
                    }

                    // High-performance calculation with caching
                    const totalValue = amount * cryptoPrice;
                    const hoursOfWork = totalValue / wage;

                    // Optimized time breakdown calculation
                    const HOURS_PER_YEAR = 365 * 8;
                    const HOURS_PER_MONTH = 30 * 8;
                    const HOURS_PER_DAY = 8;

                    const breakdown = {
                        years: Math.floor(hoursOfWork / HOURS_PER_YEAR),
                        months: Math.floor((hoursOfWork % HOURS_PER_YEAR) / HOURS_PER_MONTH),
                        days: Math.floor((hoursOfWork % HOURS_PER_MONTH) / HOURS_PER_DAY),
                        hours: Math.floor(hoursOfWork % HOURS_PER_DAY)
                    };

                    const result: TimeConversionResult = {
                        cryptoValue: totalValue,
                        hourlyWage: wage,
                        hoursOfWork,
                        daysOfWork: hoursOfWork / 8,
                        weeksOfWork: hoursOfWork / 40,
                        timeBreakdown: breakdown
                    };

                    setResults(result);

                    // Analytics tracking
                    analytics.trackEngagement('calculator_used', 0, {
                        crypto,
                        amount,
                        wage,
                        result_value: totalValue
                    });

                    // Premium trigger for high-value calculations
                    if (totalValue > 10000 && onPremiumTrigger) {
                        onPremiumTrigger('high_value_calculation');
                    }

                } catch (error) {
                    console.error('Calculation error:', error);
                    analytics.trackError(error as Error, { context: 'calculator' });
                    setErrors(prev => ({ ...prev, crypto: 'Calculation failed. Please try again.' }));
                } finally {
                    setIsLoading(false);
                }
            });
        }, 300), // 300ms debounce for optimal UX
        [cryptoPrices, onPremiumTrigger]);

    // Optimized input handlers with validation
    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCryptoAmount(value);
        calculateTimeValue(value, selectedCrypto, hourlyWage);
    }, [selectedCrypto, hourlyWage, calculateTimeValue]);

    const handleCryptoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCrypto(value);
        calculateTimeValue(cryptoAmount, value, hourlyWage);
    }, [cryptoAmount, hourlyWage, calculateTimeValue]);

    const handleWageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHourlyWage(value);
        calculateTimeValue(cryptoAmount, selectedCrypto, value);
    }, [cryptoAmount, selectedCrypto, calculateTimeValue]);

    const handleCalculation = useCallback(() => {
        try {
            // Track engagement
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'time_calculation', {
                    'event_category': 'engagement',
                    'event_label': selectedCrypto,
                    'value': Math.round(totalValue)
                });
            }

            // Premium trigger for high-value calculations
            if (totalValue > 5000 && onPremiumTrigger) {
                onPremiumTrigger('high_value_time');
            }

        } catch (error) {
            console.error('Time calculation failed:', error);
            alert('Calculation failed. Please check your inputs and try again.');
        } finally {
            setIsLoading(false);
        }
    }, [selectedCrypto, totalValue, onPremiumTrigger]);
}, [cryptoAmount, selectedCrypto, hourlyWage, cryptoPrices, onPremiumTrigger]);

const handleShare = () => {
    if (!results) return;

    const shareText = `🤯 My ${cryptoAmount} ${selectedCrypto.toUpperCase()} is worth ${results.hoursOfWork.toFixed(1)} HOURS of my work time! That's ${results.timeBreakdown.years > 0 ? `${results.timeBreakdown.years} years, ` : ''}${results.timeBreakdown.months} months, ${results.timeBreakdown.days} days! 💰⏰ Calculate yours: https://timevaultai.com #TimeVault #CryptoTime`;

    navigator.clipboard.writeText(shareText).then(() => {
        alert('Share text copied to clipboard! +20 TVLT earned');
        setShareCount(prev => prev + 1);

        if (onShare) {
            onShare(results);
        }
    }).catch(() => {
        alert('Failed to copy to clipboard');
    });
};

const wagePresets = [
    { label: '$15 (Min Wage)', value: '15' },
    { label: '$25 (Average)', value: '25' },
    { label: '$50 (Professional)', value: '50' },
    { label: '$100+ (Executive)', value: '100' }
];

return (
    <div className="personal-time-calculator">
        <div className="calculator-header">
            <h2>⏰ Personal Time Calculator</h2>
            <p>See how much of YOUR time your crypto is worth</p>
        </div>

        <div className="input-section">
            <div className="crypto-input">
                <label htmlFor="crypto-amount">Cryptocurrency Amount</label>
                <div className="input-group">
                    <input
                        id="crypto-amount"
                        type="number"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        placeholder="1.0"
                        min="0"
                        step="0.0001"
                        className="amount-input"
                    />
                    <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className="crypto-select"
                    >
                        {cryptoOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                {cryptoPrices && cryptoPrices[selectedCrypto] && (
                    <div className="current-price">
                        Current Price: ${cryptoPrices[selectedCrypto].usd.toLocaleString()}
                    </div>
                )}
            </div>

            <div className="wage-input">
                <label htmlFor="hourly-wage">Your Hourly Wage ($)</label>
                <input
                    id="hourly-wage"
                    type="number"
                    value={hourlyWage}
                    onChange={(e) => setHourlyWage(e.target.value)}
                    placeholder="25.00"
                    min="0"
                    step="0.01"
                    className="wage-input-field"
                />
                <div className="wage-presets">
                    {wagePresets.map(preset => (
                        <button
                            key={preset.value}
                            onClick={() => setHourlyWage(preset.value)}
                            className="wage-preset-btn"
                            type="button"
                        >
                            {preset.label}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={calculateTimeValue}
                className="calculate-time-btn"
                disabled={isLoading || pricesLoading}
                type="button"
            >
                {isLoading ? '⏳ Calculating...' : pricesLoading ? '📊 Loading Prices...' : '⚡ Calculate Time Value'}
            </button>
        </div>

        {results && (
            <div className="time-results">
                <div className="main-result">
                    <h3>Your Crypto Time Value</h3>
                    <div className="time-display">
                        <div className="total-hours">
                            <span className="number">{results.hoursOfWork.toFixed(1)}</span>
                            <span className="unit">Hours of Work</span>
                        </div>
                        <div className="breakdown">
                            {results.timeBreakdown.years > 0 && (
                                <span className="time-unit">
                                    {results.timeBreakdown.years} years
                                </span>
                            )}
                            {results.timeBreakdown.months > 0 && (
                                <span className="time-unit">
                                    {results.timeBreakdown.months} months
                                </span>
                            )}
                            <span className="time-unit">
                                {results.timeBreakdown.days} days
                            </span>
                            <span className="time-unit">
                                {results.timeBreakdown.hours} hours
                            </span>
                        </div>
                    </div>
                </div>

                <div className="value-display">
                    <div className="crypto-value">
                        <span>Total Value: ${results.cryptoValue.toLocaleString()}</span>
                    </div>
                    <div className="work-equivalents">
                        <div className="equivalent">
                            <span>📅 {results.daysOfWork.toFixed(1)} work days</span>
                        </div>
                        <div className="equivalent">
                            <span>📈 {results.weeksOfWork.toFixed(1)} work weeks</span>
                        </div>
                    </div>
                </div>

                <div className="action-buttons">
                    <button onClick={handleShare} className="share-btn" type="button">
                        📱 Share & Earn 20 TVLT
                    </button>
                    <button
                        onClick={() => onPremiumTrigger?.('time_insights')}
                        className="premium-btn"
                        type="button"
                    >
                        💎 Get Time Optimization Tips
                    </button>
                </div>

                {shareCount > 0 && (
                    <div className="share-success">
                        ✅ Shared {shareCount} times! Keep spreading the time perspective!
                    </div>
                )}
            </div>
        )}
    </div>
);
});

export default PersonalTimeCalculator;
