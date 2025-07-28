import React, { memo, useCallback, useMemo, useState } from 'react';
import { PerformanceOptimizer } from '../utils/performanceOptimizer';
import { security } from '../utils/securityEnhanced';

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

interface OptimizedCalculatorProps {
    onShare?: (result: TimeConversionResult) => void;
    onPremiumTrigger?: (trigger: string) => void;
}

const OptimizedPersonalTimeCalculator = memo<OptimizedCalculatorProps>(({
    onShare,
    onPremiumTrigger
}) => {
    const [cryptoAmount, setCryptoAmount] = useState('1');
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [hourlyWage, setHourlyWage] = useState('25');
    const [results, setResults] = useState<TimeConversionResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);

    // Memoized crypto options to prevent re-renders
    const cryptoOptions = useMemo(() => [
        { value: 'bitcoin', label: 'Bitcoin (BTC)', price: 97500 },
        { value: 'ethereum', label: 'Ethereum (ETH)', price: 3800 },
        { value: 'ripple', label: 'XRP', price: 2.35 },
        { value: 'cardano', label: 'Cardano (ADA)', price: 0.45 },
        { value: 'solana', label: 'Solana (SOL)', price: 145 }
    ], []);

    // Debounced calculation to prevent excessive API calls
    const debouncedCalculation = useCallback(
        (() => {
            let timeout: NodeJS.Timeout;
            return (amount: string, crypto: string, wage: string) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    setIsCalculating(true);

                    PerformanceOptimizer.measureOperation('time_calculation', () => {
                        const validation = security.sanitizeAndValidate(amount, 'crypto_amount');
                        const wageValidation = security.sanitizeAndValidate(wage, 'wage');

                        if (!validation.isValid || !wageValidation.isValid) {
                            console.warn('Invalid input detected:', [...validation.errors, ...wageValidation.errors]);
                            setIsCalculating(false);
                            return;
                        }

                        const cryptoPrice = cryptoOptions.find(opt => opt.value === crypto)?.price || 0;
                        const totalValue = parseFloat(validation.sanitized) * cryptoPrice;
                        const hoursOfWork = totalValue / parseFloat(wageValidation.sanitized);

                        const timeBreakdown = {
                            years: Math.floor(hoursOfWork / (365 * 8)),
                            months: Math.floor((hoursOfWork % (365 * 8)) / (30 * 8)),
                            days: Math.floor((hoursOfWork % (30 * 8)) / 8),
                            hours: Math.floor(hoursOfWork % 8)
                        };

                        const newResults: TimeConversionResult = {
                            cryptoValue: totalValue,
                            hourlyWage: parseFloat(wageValidation.sanitized),
                            hoursOfWork,
                            daysOfWork: hoursOfWork / 8,
                            weeksOfWork: hoursOfWork / 40,
                            timeBreakdown
                        };

                        setResults(newResults);
                        setIsCalculating(false);

                        // Premium trigger for high-value calculations
                        if (totalValue > 5000 && onPremiumTrigger) {
                            onPremiumTrigger('high_value_calculation');
                        }
                    });
                }, 500);
            };
        })(),
        [cryptoOptions, onPremiumTrigger]
    );

    // Optimized input handlers
    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCryptoAmount(value);
        debouncedCalculation(value, selectedCrypto, hourlyWage);
    }, [selectedCrypto, hourlyWage, debouncedCalculation]);

    const handleCryptoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCrypto(value);
        debouncedCalculation(cryptoAmount, value, hourlyWage);
    }, [cryptoAmount, hourlyWage, debouncedCalculation]);

    const handleWageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHourlyWage(value);
        debouncedCalculation(cryptoAmount, selectedCrypto, value);
    }, [cryptoAmount, selectedCrypto, debouncedCalculation]);

    // Memoized share handler
    const handleShare = useCallback(() => {
        if (!results) return;

        PerformanceOptimizer.measureOperation('share_generation', () => {
            const shareText = `🤯 My ${cryptoAmount} ${selectedCrypto.toUpperCase()} is worth ${results.hoursOfWork.toFixed(1)} HOURS of my work time! Calculate yours: https://timevault.app #TimeVault`;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(shareText).then(() => {
                    onShare?.(results);
                }).catch(() => {
                    // Fallback for older browsers
                    const textArea = document.createElement('textarea');
                    textArea.value = shareText;
                    document.body.appendChild(textArea);
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    onShare?.(results);
                });
            }
        });
    }, [results, cryptoAmount, selectedCrypto, onShare]);

    return (
        <div className="optimized-calculator">
            <h2>Personal Time Calculator</h2>

            {/* Optimized form elements with memoized handlers */}
            <div className="calculator-inputs">
                <div className="input-group">
                    <label htmlFor="crypto-amount">
                        Crypto Amount
                    </label>
                    <input
                        id="crypto-amount"
                        type="number"
                        step="0.01"
                        min="0"
                        value={cryptoAmount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        className="crypto-input"
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="crypto-select">
                        Cryptocurrency
                    </label>
                    <select
                        id="crypto-select"
                        value={selectedCrypto}
                        onChange={handleCryptoChange}
                        className="crypto-select"
                    >
                        {cryptoOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="hourly-wage">
                        Hourly Wage ($)
                    </label>
                    <input
                        id="hourly-wage"
                        type="number"
                        step="0.01"
                        min="0"
                        value={hourlyWage}
                        onChange={handleWageChange}
                        placeholder="Enter hourly wage"
                        className="wage-input"
                    />
                </div>
            </div>

            {isCalculating && (
                <div className="calculation-loading">
                    <div className="loading-spinner"></div>
                    <span>Calculating...</span>
                </div>
            )}

            {results && !isCalculating && (
                <div className="calculation-results">
                    <div className="time-display">
                        <div className="hours">
                            {results.hoursOfWork.toFixed(1)}
                        </div>
                        <div className="unit">Hours of Work</div>
                    </div>

                    <div className="breakdown">
                        <div className="stat">
                            <span className="label">Days:</span>
                            <span className="value">{results.daysOfWork.toFixed(1)}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Weeks:</span>
                            <span className="value">{results.weeksOfWork.toFixed(1)}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Value:</span>
                            <span className="value">${results.cryptoValue.toLocaleString()}</span>
                        </div>
                        <div className="stat">
                            <span className="label">Wage:</span>
                            <span className="value">${results.hourlyWage}/hr</span>
                        </div>
                    </div>

                    <button
                        onClick={handleShare}
                        className="share-btn"
                    >
                        Share Results
                    </button>
                </div>
            )}
        </div>
    );
});

OptimizedPersonalTimeCalculator.displayName = 'OptimizedPersonalTimeCalculator';

export default OptimizedPersonalTimeCalculator;
