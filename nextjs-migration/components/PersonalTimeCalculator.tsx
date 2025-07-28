import React, { memo, useCallback, useMemo, useState } from 'react';

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
    initialCryptoPrices?: Array<{ id: string; current_price: number }>;
    metalsPrices?: { gold: number; silver: number; platinum: number };
}

// Security validation functions
const validateCryptoInput = (input: string) => {
    const num = parseFloat(input);
    if (isNaN(num) || num <= 0 || num > 1000000) {
        return { isValid: false, error: 'Please enter a valid crypto amount (0.01 - 1,000,000)' };
    }
    return { isValid: true, value: num };
};

const validateWageInput = (input: string) => {
    const num = parseFloat(input);
    if (isNaN(num) || num <= 0 || num > 10000) {
        return { isValid: false, error: 'Please enter a valid hourly wage ($1 - $10,000)' };
    }
    return { isValid: true, value: num };
};

// Memoized calculator for maximum performance
export const PersonalTimeCalculator: React.FC<PersonalTimeCalculatorProps> = memo(({
    onShare,
    onPremiumTrigger,
    initialCryptoPrices = [],
    metalsPrices = { gold: 2000, silver: 25, platinum: 1000 }
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
        { value: 'cardano', label: 'Cardano (ADA)', symbol: 'ADA' },
        { value: 'solana', label: 'Solana (SOL)', symbol: 'SOL' }
    ], []);

    // Get current crypto price
    const getCurrentPrice = useCallback((cryptoId: string): number => {
        const priceData = initialCryptoPrices.find(p => p.id === cryptoId);
        return priceData?.current_price || 0;
    }, [initialCryptoPrices]);

    // Debounced calculation for performance
    const calculateTimeValue = useCallback(async (amount: string, crypto: string, wage: string) => {
        setIsLoading(true);
        setErrors({});

        try {
            // Enhanced input validation
            const amountValidation = validateCryptoInput(amount);
            const wageValidation = validateWageInput(wage);

            if (!amountValidation.isValid) {
                setErrors(prev => ({ ...prev, crypto: amountValidation.error }));
                setIsLoading(false);
                return;
            }

            if (!wageValidation.isValid) {
                setErrors(prev => ({ ...prev, wage: wageValidation.error }));
                setIsLoading(false);
                return;
            }

            const cryptoAmountNum = amountValidation.value!;
            const wageNum = wageValidation.value!;

            // Enhanced price validation
            const cryptoPrice = getCurrentPrice(crypto);
            if (cryptoPrice <= 0) {
                setErrors(prev => ({ ...prev, crypto: 'Unable to fetch crypto price' }));
                setIsLoading(false);
                return;
            }

            // High-performance calculation
            const totalValue = cryptoAmountNum * cryptoPrice;
            const hoursOfWork = totalValue / wageNum;

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
                hourlyWage: wageNum,
                hoursOfWork,
                daysOfWork: hoursOfWork / 8,
                weeksOfWork: hoursOfWork / 40,
                timeBreakdown: breakdown
            };

            setResults(result);

            // Premium triggers for high value calculations
            if (totalValue > 100000) {
                onPremiumTrigger?.('high_value_time');
            } else if (hoursOfWork > 1000) {
                onPremiumTrigger?.('time_insights');
            }

        } catch (error) {
            console.error('Calculation error:', error);
            setErrors(prev => ({ ...prev, crypto: 'Calculation failed. Please try again.' }));
        } finally {
            setIsLoading(false);
        }
    }, [getCurrentPrice, onPremiumTrigger]);

    // Handle form submission
    const handleCalculate = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        calculateTimeValue(cryptoAmount, selectedCrypto, hourlyWage);
    }, [cryptoAmount, selectedCrypto, hourlyWage, calculateTimeValue]);

    // Handle sharing with optimized tracking
    const handleShare = useCallback(() => {
        if (results) {
            setShareCount(prev => prev + 1);
            onShare?.(results);

            // Social sharing
            if (navigator.share && typeof window !== 'undefined') {
                navigator.share({
                    title: 'TimeVault - My Crypto Time Calculation',
                    text: `I just calculated that ${cryptoAmount} ${selectedCrypto.toUpperCase()} equals ${results.hoursOfWork.toFixed(1)} hours of work at $${hourlyWage}/hour!`,
                    url: window.location.href
                }).catch(console.error);
            } else {
                // Fallback copy to clipboard
                const shareText = `I just calculated that ${cryptoAmount} ${selectedCrypto.toUpperCase()} equals ${results.hoursOfWork.toFixed(1)} hours of work at $${hourlyWage}/hour! Check it out at ${typeof window !== 'undefined' ? window.location.href : 'timevault.vercel.app'}`;

                if (typeof navigator !== 'undefined' && navigator.clipboard) {
                    navigator.clipboard.writeText(shareText);
                    alert('Calculation copied to clipboard!');
                }
            }
        }
    }, [results, cryptoAmount, selectedCrypto, hourlyWage, onShare]);

    return (
        <div className="personal-time-calculator">
            <div className="calculator-header">
                <h2>⏰ Personal Time Calculator</h2>
                <p>Discover how much of your time your crypto is worth</p>
            </div>

            <form onSubmit={handleCalculate} className="calculator-form">
                <div className="form-group">
                    <label htmlFor="crypto-select">Choose Cryptocurrency:</label>
                    <select
                        id="crypto-select"
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className="form-select"
                    >
                        {cryptoOptions.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label} - ${getCurrentPrice(option.value).toLocaleString()}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="crypto-amount">Amount of Crypto:</label>
                    <input
                        id="crypto-amount"
                        type="number"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        placeholder="1.0"
                        step="0.000001"
                        min="0"
                        className={`form-input ${errors.crypto ? 'error' : ''}`}
                    />
                    {errors.crypto && <span className="error-message">{errors.crypto}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="hourly-wage">Your Hourly Wage ($):</label>
                    <input
                        id="hourly-wage"
                        type="number"
                        value={hourlyWage}
                        onChange={(e) => setHourlyWage(e.target.value)}
                        placeholder="25.00"
                        step="0.01"
                        min="0"
                        className={`form-input ${errors.wage ? 'error' : ''}`}
                    />
                    {errors.wage && <span className="error-message">{errors.wage}</span>}
                </div>

                <button
                    type="submit"
                    className="calculate-btn"
                    disabled={isLoading}
                >
                    {isLoading ? '⏳ Calculating...' : '🧮 Calculate Time Value'}
                </button>
            </form>

            {results && (
                <div className="results-section">
                    <h3>📊 Your Time Calculation Results</h3>

                    <div className="main-result">
                        <div className="crypto-value">
                            <span className="label">Crypto Value:</span>
                            <span className="value">${results.cryptoValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>

                        <div className="time-equivalent">
                            <span className="label">Time Equivalent:</span>
                            <span className="value">{results.hoursOfWork.toFixed(1)} hours</span>
                        </div>
                    </div>

                    <div className="detailed-breakdown">
                        <h4>📅 Time Breakdown</h4>
                        <div className="breakdown-grid">
                            {results.timeBreakdown.years > 0 && (
                                <div className="breakdown-item">
                                    <span className="number">{results.timeBreakdown.years}</span>
                                    <span className="unit">Years</span>
                                </div>
                            )}
                            {results.timeBreakdown.months > 0 && (
                                <div className="breakdown-item">
                                    <span className="number">{results.timeBreakdown.months}</span>
                                    <span className="unit">Months</span>
                                </div>
                            )}
                            {results.timeBreakdown.days > 0 && (
                                <div className="breakdown-item">
                                    <span className="number">{results.timeBreakdown.days}</span>
                                    <span className="unit">Days</span>
                                </div>
                            )}
                            <div className="breakdown-item">
                                <span className="number">{results.timeBreakdown.hours}</span>
                                <span className="unit">Hours</span>
                            </div>
                        </div>
                    </div>

                    <div className="alternative-views">
                        <div className="alt-view">
                            <span className="label">Work Days (8hrs):</span>
                            <span className="value">{results.daysOfWork.toFixed(1)} days</span>
                        </div>
                        <div className="alt-view">
                            <span className="label">Work Weeks (40hrs):</span>
                            <span className="value">{results.weeksOfWork.toFixed(1)} weeks</span>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button onClick={handleShare} className="share-btn">
                            📤 Share Result
                            {shareCount > 0 && <span className="share-count">{shareCount}</span>}
                        </button>
                    </div>

                    <div className="insights">
                        <h4>💡 Time Insights</h4>
                        <ul>
                            <li>This calculation assumes 8 hours of work per day</li>
                            <li>Prices are updated in real-time</li>
                            <li>Consider inflation when planning long-term</li>
                            {results.cryptoValue > 50000 && (
                                <li className="premium-hint">
                                    💎 High value detected! Consider premium analysis
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            <style jsx>{`
                .personal-time-calculator {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .calculator-header h2 {
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                    text-align: center;
                }

                .calculator-header p {
                    color: #6c757d;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #495057;
                }

                .form-input, .form-select {
                    width: 100%;
                    padding: 0.75rem;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    font-size: 1rem;
                    transition: border-color 0.3s ease;
                }

                .form-input:focus, .form-select:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                }

                .form-input.error {
                    border-color: #dc3545;
                }

                .error-message {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: block;
                }

                .calculate-btn {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(45deg, #007bff, #0056b3);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .calculate-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .calculate-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .results-section {
                    margin-top: 2rem;
                    padding: 2rem;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
                }

                .main-result {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .crypto-value, .time-equivalent {
                    text-align: center;
                    padding: 1rem;
                    border-radius: 8px;
                    background: #f8f9fa;
                }

                .crypto-value .label, .time-equivalent .label {
                    display: block;
                    font-size: 0.875rem;
                    color: #6c757d;
                    margin-bottom: 0.5rem;
                }

                .crypto-value .value, .time-equivalent .value {
                    display: block;
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #2c3e50;
                }

                .breakdown-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
                    gap: 1rem;
                    margin: 1rem 0;
                }

                .breakdown-item {
                    text-align: center;
                    padding: 1rem;
                    background: #e9ecef;
                    border-radius: 8px;
                }

                .breakdown-item .number {
                    display: block;
                    font-size: 2rem;
                    font-weight: bold;
                    color: #007bff;
                }

                .breakdown-item .unit {
                    display: block;
                    font-size: 0.875rem;
                    color: #6c757d;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .alternative-views {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin: 1.5rem 0;
                }

                .alt-view {
                    display: flex;
                    justify-content: space-between;
                    padding: 0.75rem;
                    background: #f8f9fa;
                    border-radius: 6px;
                }

                .share-btn {
                    background: linear-gradient(45deg, #28a745, #20c997);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    position: relative;
                    transition: transform 0.2s ease;
                }

                .share-btn:hover {
                    transform: translateY(-2px);
                }

                .share-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #dc3545;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                }

                .insights ul {
                    list-style: none;
                    padding: 0;
                }

                .insights li {
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #e9ecef;
                }

                .insights li:last-child {
                    border-bottom: none;
                }

                .premium-hint {
                    color: #007bff;
                    font-weight: 600;
                }

                @media (max-width: 768px) {
                    .personal-time-calculator {
                        padding: 1rem;
                        margin: 1rem;
                    }

                    .main-result {
                        grid-template-columns: 1fr;
                    }

                    .alternative-views {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
});

PersonalTimeCalculator.displayName = 'PersonalTimeCalculator';

export default PersonalTimeCalculator;
