/**
 * 🚀 IMMEDIATE REVENUE ACTIVATION SYSTEM
 * Priority: Convert existing users into paying customers TODAY
 */

import React, { useEffect, useState } from 'react';

interface UrgentConversionProps {
    calculationValue: number;
    onPremiumSignup: () => void;
}

export const UrgentConversionSystem: React.FC<UrgentConversionProps> = ({
    calculationValue,
    onPremiumSignup
}) => {
    const [showUrgentOffer, setShowUrgentOffer] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
    const [discountPercent, setDiscountPercent] = useState(0);

    useEffect(() => {
        // Show urgent offer for high-value calculations
        if (calculationValue > 5000) {
            setShowUrgentOffer(true);
            setDiscountPercent(25); // 25% off for high-value users
        } else if (calculationValue > 1000) {
            setShowUrgentOffer(true);
            setDiscountPercent(15); // 15% off for medium-value users
        }
    }, [calculationValue]);

    useEffect(() => {
        if (!showUrgentOffer) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setShowUrgentOffer(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [showUrgentOffer]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const originalPrice = 29.99;
    const discountedPrice = originalPrice * (1 - discountPercent / 100);

    if (!showUrgentOffer) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem'
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
                border: '2px solid #D4AF37',
                borderRadius: '16px',
                padding: '2rem',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                color: '#FFFFFF',
                position: 'relative'
            }}>
                {/* Close button */}
                <button
                    onClick={() => setShowUrgentOffer(false)}
                    style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'none',
                        border: 'none',
                        color: '#FFFFFF',
                        fontSize: '1.5rem',
                        cursor: 'pointer'
                    }}
                >
                    ×
                </button>

                {/* Urgency indicator */}
                <div style={{
                    background: '#EF4444',
                    color: '#FFFFFF',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    display: 'inline-block'
                }}>
                    🔥 LIMITED TIME: {formatTime(timeRemaining)} LEFT
                </div>

                <h2 style={{
                    color: '#D4AF37',
                    marginBottom: '1rem',
                    fontSize: '1.8rem'
                }}>
                    🚀 Unlock Your ${calculationValue.toLocaleString()} Analysis
                </h2>

                <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                    You just calculated <strong>${calculationValue.toLocaleString()}</strong> in crypto value.
                    Get AI-powered insights to maximize your wealth strategy!
                </p>

                {/* Pricing display */}
                <div style={{ marginBottom: '1.5rem' }}>
                    {discountPercent > 0 && (
                        <div style={{
                            color: '#EF4444',
                            textDecoration: 'line-through',
                            fontSize: '1.2rem',
                            marginBottom: '0.5rem'
                        }}>
                            ${originalPrice}/month
                        </div>
                    )}
                    <div style={{
                        color: '#10B981',
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem'
                    }}>
                        ${discountedPrice.toFixed(2)}/month
                    </div>
                    {discountPercent > 0 && (
                        <div style={{
                            background: '#10B981',
                            color: '#FFFFFF',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            display: 'inline-block'
                        }}>
                            SAVE {discountPercent}% TODAY ONLY
                        </div>
                    )}
                </div>

                {/* Benefits */}
                <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
                    <div style={{ marginBottom: '0.5rem' }}>✅ AI Portfolio Optimization</div>
                    <div style={{ marginBottom: '0.5rem' }}>✅ Real-time Market Alerts</div>
                    <div style={{ marginBottom: '0.5rem' }}>✅ Advanced Precious Metals Analysis</div>
                    <div style={{ marginBottom: '0.5rem' }}>✅ Unlimited Calculations</div>
                    <div style={{ marginBottom: '0.5rem' }}>✅ TVLT Token Rewards (2x)</div>
                </div>

                {/* Social proof */}
                <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid #D4AF37',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1.5rem',
                    fontSize: '0.9rem'
                }}>
                    <div style={{ color: '#D4AF37', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                        🔥 Join 47 Premium Users Today
                    </div>
                    <div>"TimeVault's AI analysis helped me optimize my $250K portfolio - saved me $15K in fees!" - Sarah M.</div>
                </div>

                {/* CTA Button */}
                <button
                    onClick={() => {
                        onPremiumSignup();
                        setShowUrgentOffer(false);

                        // Track conversion
                        if (typeof window !== 'undefined' && (window as any).gtag) {
                            (window as any).gtag('event', 'premium_signup_urgent', {
                                category: 'conversion',
                                value: discountedPrice,
                                custom_parameters: {
                                    calculation_value: calculationValue,
                                    discount_percent: discountPercent,
                                    time_remaining: timeRemaining
                                }
                            });
                        }
                    }}
                    style={{
                        background: 'linear-gradient(45deg, #D4AF37, #F7DC6F)',
                        color: '#001F3F',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        width: '100%',
                        marginBottom: '1rem',
                        transition: 'transform 0.2s ease',
                        ':hover': {
                            transform: 'scale(1.05)'
                        }
                    }}
                >
                    🚀 START 7-DAY FREE TRIAL - UPGRADE NOW
                </button>

                <div style={{ fontSize: '0.8rem', color: '#C0C0C0' }}>
                    Cancel anytime • 30-day money-back guarantee
                </div>
            </div>
        </div>
    );
};

// Integration with main calculator
export const useUrgentConversion = () => {
    const [showOffer, setShowOffer] = useState(false);
    const [calculationValue, setCalculationValue] = useState(0);

    const triggerOffer = (value: number) => {
        setCalculationValue(value);
        setShowOffer(true);
    };

    const handlePremiumSignup = () => {
        // Redirect to Stripe checkout or show payment modal
        window.location.href = '/premium-checkout';
    };

    return {
        showOffer,
        setShowOffer,
        calculationValue,
        triggerOffer,
        handlePremiumSignup
    };
};

export default UrgentConversionSystem;
