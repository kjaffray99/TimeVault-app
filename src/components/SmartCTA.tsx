/**
 * Smart CTA Component with personalized messaging and A/B testing
 */
import React from 'react';
import { useABTesting, useAnalytics } from '../services/analytics';

interface SmartCTAProps {
    userSegment: string;
    calculationValue?: number;
    onConversion: () => void;
}

export const SmartCTA: React.FC<SmartCTAProps> = ({
    userSegment,
    calculationValue,
    onConversion
}) => {
    const analytics = useAnalytics();
    const abTesting = useABTesting();

    const ctaVariant = abTesting.getVariant('smart_cta_optimization');

    const getSmartCTA = () => {
        if (calculationValue && calculationValue > 10000) {
            return {
                text: '🚀 Unlock VIP Features for High-Value Portfolio',
                color: '#8B5CF6',
                urgency: 'Limited spots available'
            };
        }

        switch (userSegment) {
            case 'new':
                return {
                    text: '✨ Start Your 7-Day Free Trial',
                    color: '#10B981',
                    urgency: 'No credit card required'
                };
            case 'high_value':
                return {
                    text: '💎 Get Premium Access (20% VIP Discount)',
                    color: '#F59E0B',
                    urgency: 'Exclusive offer expires soon'
                };
            case 'at_risk':
                return {
                    text: '🎁 Welcome Back - 50% Off Premium',
                    color: '#EF4444',
                    urgency: 'Limited time offer'
                };
            default:
                return {
                    text: '⚡ Upgrade to Premium',
                    color: '#D4AF37',
                    urgency: '10% discount for loyal users'
                };
        }
    };

    const cta = getSmartCTA();

    const handleClick = () => {
        analytics.trackEvent('smart_cta_clicked', {
            user_segment: userSegment,
            calculation_value: calculationValue,
            cta_variant: ctaVariant,
            cta_text: cta.text
        });

        abTesting.trackConversion('smart_cta_optimization', 'cta_click', calculationValue);
        onConversion();
    };

    return (
        <div
            className="smart-cta-container"
            style={{
                textAlign: 'center',
                margin: '2rem 0'
            }}
        >
            <button
                className="smart-cta-button"
                onClick={handleClick}
                style={{
                    backgroundColor: cta.color,
                    padding: '1rem 2rem',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#FFFFFF',
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                    textTransform: 'none',
                    minWidth: '250px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                }}
            >
                {cta.text}
            </button>
            <div
                className="urgency-message"
                style={{
                    marginTop: '0.5rem',
                    fontSize: '0.9rem',
                    color: '#D4AF37',
                    fontStyle: 'italic'
                }}
            >
                {cta.urgency}
            </div>
        </div>
    );
};
