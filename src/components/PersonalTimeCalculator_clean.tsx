import React, { memo, useCallback, useMemo, useState } from 'react';
import { useOptimizedPriceData } from '../hooks/useRealtimeData';
import { analytics } from '../services/analyticsEnhanced';
import { PerformanceOptimizer, optimizeMemory } from '../utils/performanceOptimizer';
import { security } from '../utils/securityEnhanced';

interface TimeConversionResult {
    cryptoValue: number;
    hourlyWage: number;
    hoursOfWork: number;
    cryptoAmount: number;
    selectedCrypto: string;
    timeBreakdown: {
        minutes: number;
        hours: number;
        days: number;
        weeks: number;
    };
}

interface PersonalTimeCalculatorProps {
    onShare?: (data: any) => void;
    onPremiumTrigger?: (feature: string) => void;
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

    // Debounced calculation with enhanced security
    const performCalculation = useCallback(
        optimizeMemory.debounce(async (amount: string, crypto: string, wage: string) => {
            return PerformanceOptimizer.measureAsyncOperation('time_calculation', async () => {
                setIsLoading(true);
                setErrors({});

                try {
                    // Enhanced input validation with security
                    const amountValidation = await security.validateInput(amount, 'number');
                    const wageValidation = await security.validateInput(wage, 'number');

                    if (!amountValidation.isValid) {
                        setErrors(prev => ({ ...prev, crypto: amountValidation.error }));
                        return;
                    }

                    if (!wageValidation.isValid) {
                        setErrors(prev => ({ ...prev, wage: wageValidation.error }));
                        return;
                    }

                    const cryptoPrice = cryptoPrices[crypto];
                    const numAmount = parseFloat(amount);
                    const numWage = parseFloat(wage);

                    if (cryptoPrice <= 0) {
                        throw new Error('Unable to fetch current cryptocurrency price');
                    }

                    const cryptoValue = numAmount * cryptoPrice;
                    const hoursOfWork = cryptoValue / numWage;

                    // Enhanced time breakdown calculations
                    const totalMinutes = hoursOfWork * 60;
                    const breakdown = {
                        minutes: Math.round(totalMinutes),
                        hours: Math.round(hoursOfWork * 10) / 10,
                        days: Math.round((hoursOfWork / 8) * 10) / 10,
                        weeks: Math.round((hoursOfWork / 40) * 10) / 10
                    };

                    const timeResult: TimeConversionResult = {
                        cryptoValue,
                        hourlyWage: numWage,
                        hoursOfWork,
                        cryptoAmount: numAmount,
                        selectedCrypto: crypto,
                        timeBreakdown: breakdown
                    };

                    setResults(timeResult);

                    // Enhanced analytics tracking
                    analytics.track('time_calculation_completed', {
                        crypto,
                        amount: numAmount,
                        wage: numWage,
                        result_hours: hoursOfWork,
                        timestamp: Date.now()
                    });

                } catch (error) {
                    console.error('Calculation error:', error);
                    setErrors(prev => ({
                        ...prev,
                        crypto: 'Unable to perform calculation. Please try again.'
                    }));

                    analytics.track('calculation_error', {
                        error: error instanceof Error ? error.message : 'Unknown error',
                        crypto,
                        amount,
                        wage
                    });
                } finally {
                    setIsLoading(false);
                }
            });
        }, 300),
        [cryptoPrices]
    );

    // Enhanced calculation trigger with validation
    const handleCalculate = useCallback(async () => {
        if (!cryptoAmount || !hourlyWage) return;
        await performCalculation(cryptoAmount, selectedCrypto, hourlyWage);
    }, [cryptoAmount, selectedCrypto, hourlyWage, performCalculation]);

    // Auto-calculate on input changes (debounced)
    React.useEffect(() => {
        if (cryptoAmount && hourlyWage && cryptoPrices[selectedCrypto]) {
            handleCalculate();
        }
    }, [cryptoAmount, selectedCrypto, hourlyWage, cryptoPrices, handleCalculate]);

    // Enhanced sharing functionality
    const handleShare = useCallback(async () => {
        if (!results) return;

        const shareData = {
            calculation: results,
            insight: `💰 ${results.cryptoAmount} ${selectedCrypto.toUpperCase()} = ${results.timeBreakdown.hours} hours of work at $${results.hourlyWage}/hour`,
            timestamp: Date.now()
        };

        try {
            await onShare?.(shareData);
            setShareCount(prev => prev + 1);

            analytics.track('time_calculation_shared', {
                crypto: selectedCrypto,
                hours: results.hoursOfWork,
                share_count: shareCount + 1
            });
        } catch (error) {
            console.error('Share error:', error);
        }
    }, [results, selectedCrypto, onShare, shareCount]);

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
                            step="any"
                            className={`calculator-input ${errors.crypto ? 'error' : ''}`}
                            aria-describedby={errors.crypto ? 'crypto-error' : undefined}
                        />
                        <select
                            value={selectedCrypto}
                            onChange={(e) => setSelectedCrypto(e.target.value)}
                            className="crypto-selector"
                            aria-label="Select cryptocurrency"
                        >
                            {cryptoOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.symbol} {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.crypto && (
                        <div id="crypto-error" className="error-message" role="alert">
                            {errors.crypto}
                        </div>
                    )}
                </div>

                <div className="wage-input">
                    <label htmlFor="hourly-wage">Your Hourly Wage</label>
                    <div className="input-group">
                        <span className="currency-symbol">$</span>
                        <input
                            id="hourly-wage"
                            type="number"
                            value={hourlyWage}
                            onChange={(e) => setHourlyWage(e.target.value)}
                            placeholder="25.00"
                            min="0"
                            step="0.01"
                            className={`calculator-input ${errors.wage ? 'error' : ''}`}
                            aria-describedby={errors.wage ? 'wage-error' : undefined}
                        />
                        <span className="per-hour">/hour</span>
                    </div>
                    {errors.wage && (
                        <div id="wage-error" className="error-message" role="alert">
                            {errors.wage}
                        </div>
                    )}
                </div>
            </div>

            {(isLoading || pricesLoading) && (
                <div className="loading-state" role="status" aria-live="polite">
                    <div className="spinner"></div>
                    <span>Calculating your time value...</span>
                </div>
            )}

            {pricesError && (
                <div className="error-state" role="alert">
                    <span>⚠️ Unable to fetch current prices. Please try again.</span>
                </div>
            )}

            {results && !isLoading && (
                <div className="results-section" role="region" aria-label="Calculation results">
                    <div className="main-result">
                        <h3>🕐 Your Time Investment</h3>
                        <div className="time-value">
                            <span className="crypto-amount">
                                {results.cryptoAmount} {selectedCrypto.toUpperCase()}
                            </span>
                            <span className="equals">=</span>
                            <span className="work-time">
                                {results.timeBreakdown.hours} hours of work
                            </span>
                        </div>
                        <div className="usd-value">
                            Worth ${results.cryptoValue.toFixed(2)} at $${results.hourlyWage}/hour
                        </div>
                    </div>

                    <div className="time-breakdown">
                        <h4>⚡ Time Breakdown</h4>
                        <div className="breakdown-grid">
                            <div className="breakdown-item">
                                <span className="value">{results.timeBreakdown.minutes}</span>
                                <span className="unit">minutes</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="value">{results.timeBreakdown.hours}</span>
                                <span className="unit">hours</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="value">{results.timeBreakdown.days}</span>
                                <span className="unit">work days</span>
                            </div>
                            <div className="breakdown-item">
                                <span className="value">{results.timeBreakdown.weeks}</span>
                                <span className="unit">work weeks</span>
                            </div>
                        </div>
                    </div>

                    <div className="insights-section">
                        <div className="insight-card">
                            <h5>💡 Time Perspective</h5>
                            <p>
                                {results.timeBreakdown.hours < 1
                                    ? `Just ${results.timeBreakdown.minutes} minutes of your work!`
                                    : results.timeBreakdown.hours < 8
                                        ? `Less than a full work day of your time.`
                                        : results.timeBreakdown.days < 5
                                            ? `About ${Math.round(results.timeBreakdown.days)} work days of your effort.`
                                            : `${results.timeBreakdown.weeks} weeks of your work time.`
                                }
                            </p>
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
