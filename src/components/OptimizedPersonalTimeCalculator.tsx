import React, { memo, useCallback, useMemo, useState } from 'react';
import { PerformanceOptimizer, optimizeMemory } from '../utils/performanceOptimizer';
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
        optimizeMemory.debounce((amount: string, crypto: string, wage: string) => {
            PerformanceOptimizer.measureOperation('time_calculation', () => {
                const validation = security.sanitizeAndValidate(amount, 'crypto_amount');
                const wageValidation = security.sanitizeAndValidate(wage, 'wage');

                if (!validation.isValid || !wageValidation.isValid) {
                    console.warn('Invalid input detected');
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

                setResults({
                    cryptoValue: totalValue,
                    hourlyWage: parseFloat(wageValidation.sanitized),
                    hoursOfWork,
                    daysOfWork: hoursOfWork / 8,
                    weeksOfWork: hoursOfWork / 40,
                    timeBreakdown
                });

                // Premium trigger for high-value calculations
                if (totalValue > 5000 && onPremiumTrigger) {
                    onPremiumTrigger('high_value_calculation');
                }
            });
        }, 500),
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
            const shareText = `🤯 My ${cryptoAmount} ${selectedCrypto.toUpperCase()} is worth ${results.hoursOfWork.toFixed(1)} HOURS of my work time! Calculate yours: https://timevaultai.com #TimeVault`;

            navigator.clipboard.writeText(shareText).then(() => {
                onShare?.(results);
            });
        });
    }, [results, cryptoAmount, selectedCrypto, onShare]);

    return (
        <div className="optimized-calculator">
            {/* Optimized form elements with memoized handlers */}
            <div className="calculator-inputs">
                <input
                    type="number"
                    value={cryptoAmount}
                    onChange={handleAmountChange}
                    placeholder="Crypto amount"
                    className="crypto-input"
                />

                <select
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

                <input
                    type="number"
                    value={hourlyWage}
                    onChange={handleWageChange}
                    placeholder="Hourly wage"
                    className="wage-input"
                />
            </div>

            {results && (
                <div className="calculation-results">
                    <div className="time-display">
                        <span className="hours">{results.hoursOfWork.toFixed(1)}</span>
                        <span className="unit">Hours of Work</span>
                    </div>

                    <button onClick={handleShare} className="share-btn">
                        Share Results
                    </button>
                </div>
            )}
        </div>
    );
});

OptimizedPersonalTimeCalculator.displayName = 'OptimizedPersonalTimeCalculator';

export default OptimizedPersonalTimeCalculator;
