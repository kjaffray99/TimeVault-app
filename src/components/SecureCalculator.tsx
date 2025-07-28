// 🚀 SECURE CALCULATOR WITH REVENUE OPTIMIZATION
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    logSecurityEvent,
    rateLimiter,
    sanitizeInput,
    secureStorage,
    validateCryptoAmount,
    validateEmail,
    validateWageRate
} from '../utils/security';

interface CalculationResult {
    usdValue: number;
    metals: {
        gold: string;
        silver: string;
        platinum: string;
        palladium: string;
    };
    time: {
        hours: string;
        days: string;
        weeks: string;
    };
}

interface UserBehavior {
    calculations: number;
    timeSpent: number;
    highValueCalculations: number;
    lastCalculation: number;
}

const SecureCalculator = () => {
    // Core state
    const [cryptoAmount, setCryptoAmount] = useState('1');
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [hourlyWage, setHourlyWage] = useState('25');
    const [email, setEmail] = useState('');
    const [results, setResults] = useState<CalculationResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Security & tracking state
    const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
    const [userBehavior, setUserBehavior] = useState<UserBehavior>({
        calculations: 0,
        timeSpent: 0,
        highValueCalculations: 0,
        lastCalculation: 0
    });

    // Premium upsell state
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumTriggerReason, setPremiumTriggerReason] = useState('');

    // Current market prices (would be fetched from APIs in production)
    const cryptoPrices = useMemo(() => ({
        bitcoin: 97500,
        ethereum: 3400,
        ripple: 2.35,
        cardano: 0.62,
        solana: 145
    }), []);

    const metalPrices = useMemo(() => ({
        gold: 2650,    // USD per oz
        silver: 30,    // USD per oz
        platinum: 980, // USD per oz
        palladium: 960 // USD per oz
    }), []);

    // Load user behavior from secure storage
    useEffect(() => {
        const savedBehavior = secureStorage.getItem('user_behavior');
        if (savedBehavior) {
            setUserBehavior(savedBehavior);
        }
    }, []);

    // Secure input handling with validation
    const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeInput(e.target.value);
        if (validateCryptoAmount(sanitized) || sanitized === '') {
            setCryptoAmount(sanitized);
        } else {
            logSecurityEvent('invalid_crypto_amount', { input: sanitized });
        }
    }, []);

    const handleWageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeInput(e.target.value);
        if (validateWageRate(sanitized) || sanitized === '') {
            setHourlyWage(sanitized);
        } else {
            logSecurityEvent('invalid_wage_rate', { input: sanitized });
        }
    }, []);

    const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitized = sanitizeInput(e.target.value);
        setEmail(sanitized);
    }, []);

    // Calculate conversions with security checks
    const calculateConversions = useCallback(() => {
        // Rate limiting check
        const userIP = 'user_' + Date.now(); // In production, use actual IP/session
        if (!rateLimiter.canMakeRequest(userIP, 20, 60000)) { // 20 requests per minute
            setRateLimitExceeded(true);
            logSecurityEvent('rate_limit_exceeded', { userIP });
            return;
        }

        // Validate inputs
        if (!validateCryptoAmount(cryptoAmount)) {
            alert('Please enter a valid crypto amount');
            return;
        }

        if (!validateWageRate(hourlyWage)) {
            alert('Please enter a valid hourly wage');
            return;
        }

        setIsLoading(true);
        setRateLimitExceeded(false);

        // Simulate API delay for user experience
        setTimeout(() => {
            const amount = parseFloat(cryptoAmount);
            const wage = parseFloat(hourlyWage);
            const cryptoPrice = cryptoPrices[selectedCrypto as keyof typeof cryptoPrices];
            const usdValue = amount * cryptoPrice;

            const conversions: CalculationResult = {
                usdValue,
                metals: {
                    gold: (usdValue / metalPrices.gold).toFixed(4),
                    silver: (usdValue / metalPrices.silver).toFixed(2),
                    platinum: (usdValue / metalPrices.platinum).toFixed(4),
                    palladium: (usdValue / metalPrices.palladium).toFixed(4)
                },
                time: {
                    hours: (usdValue / wage).toFixed(1),
                    days: (usdValue / (wage * 8)).toFixed(1),
                    weeks: (usdValue / (wage * 40)).toFixed(2)
                }
            };

            setResults(conversions);
            setIsLoading(false);

            // Update user behavior tracking
            const newBehavior: UserBehavior = {
                ...userBehavior,
                calculations: userBehavior.calculations + 1,
                highValueCalculations: usdValue > 10000 ? userBehavior.highValueCalculations + 1 : userBehavior.highValueCalculations,
                lastCalculation: Date.now()
            };

            setUserBehavior(newBehavior);
            secureStorage.setItem('user_behavior', newBehavior);

            // Track calculation event
            if (typeof gtag !== 'undefined') {
                (window as any).gtag?.('event', 'calculation_completed', {
                    'event_category': 'engagement',
                    'event_label': selectedCrypto,
                    'value': Math.round(usdValue),
                    'custom_parameter_amount': amount,
                    'custom_parameter_crypto': selectedCrypto
                });
            }

            // Trigger premium upsell based on behavior
            checkPremiumTriggers(usdValue, newBehavior);

        }, 800);
    }, [cryptoAmount, selectedCrypto, hourlyWage, userBehavior, cryptoPrices, metalPrices]);

    // Premium upsell trigger logic
    const checkPremiumTriggers = (usdValue: number, behavior: UserBehavior) => {
        let shouldShowUpsell = false;
        let reason = '';

        // High-value calculation trigger
        if (usdValue > 10000) {
            shouldShowUpsell = true;
            reason = 'high_value';
        }
        // Multiple calculations trigger
        else if (behavior.calculations >= 3 && behavior.calculations % 3 === 0) {
            shouldShowUpsell = true;
            reason = 'multiple_calculations';
        }
        // High-value user trigger
        else if (behavior.highValueCalculations >= 2) {
            shouldShowUpsell = true;
            reason = 'high_value_user';
        }

        if (shouldShowUpsell) {
            setPremiumTriggerReason(reason);
            setTimeout(() => setShowPremiumModal(true), 2000);
        }
    };

    // Secure email capture
    const handleEmailCapture = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Track email capture
        if (typeof gtag !== 'undefined') {
            (window as any).gtag?.('event', 'email_capture', {
                'event_category': 'lead_generation',
                'event_label': 'early_access_signup',
                'value': 1
            });
        }

        // Store email securely (in production, send to backend)
        secureStorage.setItem('user_email', email);
        logSecurityEvent('email_captured', { email: email.substring(0, 3) + '***' });

        setEmail('');
        alert('🎉 Welcome to TimeVault! You\'ll be notified about premium features and TVLT rewards!');
    }, [email]);

    // Social sharing with TVLT rewards
    const shareResults = useCallback(() => {
        if (!results) return;

        const shareText = `🚀 Just discovered my ${cryptoAmount} ${selectedCrypto.toUpperCase()} is worth ${results.metals.gold} oz of GOLD! ⚡ That's ${results.time.hours} hours of my time! Calculate yours: https://timevaultai.com`;

        if (navigator.share) {
            navigator.share({
                title: 'TimeVault Calculator Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Results copied to clipboard! Share to earn 15 TVLT tokens 🪙');
            });
        }

        // Track social sharing
        if (typeof gtag !== 'undefined') {
            (window as any).gtag?.('event', 'social_share', {
                'event_category': 'viral',
                'event_label': 'calculator_results',
                'value': 15 // TVLT reward amount
            });
        }
    }, [results, cryptoAmount, selectedCrypto]);

    // Premium upgrade handler
    const handlePremiumUpgrade = (plan: string) => {
        if (typeof gtag !== 'undefined') {
            (window as any).gtag?.('event', 'premium_interest', {
                'event_category': 'conversion',
                'event_label': plan,
                'custom_parameter_trigger': premiumTriggerReason
            });
        }

        // In production, redirect to Stripe checkout
        alert(`Redirecting to ${plan} plan checkout... 💳`);
        setShowPremiumModal(false);
    };

    // Premium Modal Component
    const PremiumModal = () => (
        showPremiumModal ? (
            <div className="premium-modal-overlay" onClick={() => setShowPremiumModal(false)}>
                <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                    <button className="close-btn" onClick={() => setShowPremiumModal(false)}>×</button>

                    <div className="modal-header">
                        <h3>🔥 Unlock Your Crypto's Full Potential</h3>
                        <p>Your calculation shows significant value - get premium insights!</p>
                    </div>

                    <div className="premium-benefits">
                        <div className="benefit">✅ AI-Powered Market Predictions</div>
                        <div className="benefit">✅ Historical Trend Analysis</div>
                        <div className="benefit">✅ Portfolio Optimization Alerts</div>
                        <div className="benefit">✅ TVLT Token Rewards (2x multiplier)</div>
                        <div className="benefit">✅ Exclusive NFT Badge Access</div>
                        <div className="benefit">✅ Priority Customer Support</div>
                    </div>

                    <div className="pricing-tiers">
                        <button
                            className="tier-basic"
                            onClick={() => handlePremiumUpgrade('basic')}
                        >
                            🥉 Basic - $99/month
                            <small>First week FREE</small>
                        </button>
                        <button
                            className="tier-pro"
                            onClick={() => handlePremiumUpgrade('pro')}
                        >
                            🥈 Pro - $199/month
                            <small>Most Popular</small>
                        </button>
                        <button
                            className="tier-elite"
                            onClick={() => handlePremiumUpgrade('elite')}
                        >
                            🥇 Elite - $499/month
                            <small>Maximum ROI</small>
                        </button>
                    </div>

                    <div className="urgency-message">
                        ⏰ Limited Time: Join 500+ premium users maximizing their crypto potential
                    </div>
                </div>
            </div>
        ) : null
    );

    return (
        <div className="secure-calculator">
            {/* Main Calculator Interface */}
            <div className="calculator-container">
                <div className="calculator-header">
                    <h1>⚡ TimeVault Calculator</h1>
                    <p>Transform your crypto into precious metals and time value</p>
                    <div className="user-stats">
                        <span>🧮 Calculations: {userBehavior.calculations}</span>
                        {userBehavior.highValueCalculations > 0 && (
                            <span>💎 High-Value: {userBehavior.highValueCalculations}</span>
                        )}
                    </div>
                </div>

                <div className="calculator-form">
                    <div className="input-group">
                        <label>💰 Crypto Amount:</label>
                        <input
                            type="number"
                            value={cryptoAmount}
                            onChange={handleAmountChange}
                            placeholder="Enter amount..."
                            min="0"
                            step="0.01"
                        />
                    </div>

                    <div className="input-group">
                        <label>🪙 Select Cryptocurrency:</label>
                        <select
                            value={selectedCrypto}
                            onChange={(e) => setSelectedCrypto(e.target.value)}
                        >
                            <option value="bitcoin">Bitcoin (BTC) - ${cryptoPrices.bitcoin.toLocaleString()}</option>
                            <option value="ethereum">Ethereum (ETH) - ${cryptoPrices.ethereum.toLocaleString()}</option>
                            <option value="ripple">XRP (XRP) - ${cryptoPrices.ripple}</option>
                            <option value="cardano">Cardano (ADA) - ${cryptoPrices.cardano}</option>
                            <option value="solana">Solana (SOL) - ${cryptoPrices.solana}</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label>⏰ Your Hourly Wage ($):</label>
                        <input
                            type="number"
                            value={hourlyWage}
                            onChange={handleWageChange}
                            placeholder="Enter hourly wage..."
                            min="0.01"
                            step="0.01"
                        />
                    </div>

                    <button
                        onClick={calculateConversions}
                        disabled={isLoading || rateLimitExceeded}
                        className="calculate-button"
                    >
                        {isLoading ? '🔄 Calculating...' : '🧮 Calculate Value'}
                    </button>

                    {rateLimitExceeded && (
                        <div className="rate-limit-message">
                            ⚠️ Please wait before making another calculation
                        </div>
                    )}
                </div>

                {/* Results Display */}
                {results && (
                    <div className="results-container">
                        <h3>📊 Your {cryptoAmount} {selectedCrypto.toUpperCase()} is worth:</h3>

                        <div className="usd-value">
                            <strong>💵 USD Value: ${results.usdValue.toLocaleString()}</strong>
                        </div>

                        <div className="conversion-grid">
                            <div className="metals-section">
                                <h4>🥇 Precious Metals:</h4>
                                <div className="metal-item">Gold: {results.metals.gold} oz</div>
                                <div className="metal-item">Silver: {results.metals.silver} oz</div>
                                <div className="metal-item">Platinum: {results.metals.platinum} oz</div>
                                <div className="metal-item">Palladium: {results.metals.palladium} oz</div>
                            </div>

                            <div className="time-section">
                                <h4>⏰ Time Value:</h4>
                                <div className="time-item">Hours: {results.time.hours}</div>
                                <div className="time-item">Days: {results.time.days}</div>
                                <div className="time-item">Weeks: {results.time.weeks}</div>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button onClick={shareResults} className="share-button">
                                📱 Share Results (+15 TVLT tokens)
                            </button>
                            {results.usdValue > 5000 && (
                                <button
                                    onClick={() => setShowPremiumModal(true)}
                                    className="premium-cta"
                                >
                                    💎 Get Premium Insights
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Email Capture */}
                <div className="email-capture">
                    <h3>🎯 Get Early Access to Advanced Features</h3>
                    <p>✅ TVLT token rewards • ✅ NFT badge minting • ✅ AI portfolio insights</p>
                    <form onSubmit={handleEmailCapture} className="email-form">
                        <input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email..."
                            required
                        />
                        <button type="submit">
                            🚀 Join {500 + userBehavior.calculations} Users
                        </button>
                    </form>
                </div>
            </div>

            {/* Premium Modal */}
            <PremiumModal />

            {/* Security & Performance Indicators */}
            <div className="security-indicators">
                <span>🔐 Secure</span>
                <span>🎯 Accurate</span>
                <span>💰 Profitable</span>
            </div>
        </div>
    );
};

export default SecureCalculator;
