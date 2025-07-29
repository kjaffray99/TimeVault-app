/**
 * 🚀 PREMIUM CHECKOUT PAGE - DAY 1 STRIPE ACTIVATION
 * Priority: Convert users into paying customers with live Stripe integration
 */

import React, { useEffect, useState } from 'react';
import { stripeService, PREMIUM_PLANS, trackStripeEvent, monitorCheckoutConversion } from '../services/stripe/StripeService';

interface CheckoutPlan {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    period: 'monthly' | 'annual';
    features: string[];
    recommended?: boolean;
}

export const PremiumCheckout: React.FC = () => {
    const [selectedPlan, setSelectedPlan] = useState<string>('annual');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [urgencyTimer, setUrgencyTimer] = useState(1800); // 30 minutes

    const plans: CheckoutPlan[] = [
        {
            id: 'monthly',
            name: 'Premium Monthly',
            price: PREMIUM_PLANS.monthly.price,
            originalPrice: 39.99,
            period: 'monthly',
            features: PREMIUM_PLANS.monthly.features
        },
        {
            id: 'annual',
            name: 'Premium Annual',
            price: PREMIUM_PLANS.annual.price,
            originalPrice: PREMIUM_PLANS.annual.originalPrice,
            period: 'annual',
            recommended: true,
            features: PREMIUM_PLANS.annual.features
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setUrgencyTimer(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCheckout = async (planId: string) => {
        setLoading(true);
        
        try {
            // Track checkout initiation
            trackStripeEvent('checkout_initiated', {
                planId,
                amount: PREMIUM_PLANS[planId as keyof typeof PREMIUM_PLANS]?.price || 0,
                email
            });

            monitorCheckoutConversion(planId, 'checkout_button_clicked');

            // Use the Stripe service for checkout
            const result = await stripeService.handleSubscription({
                planId: planId as 'monthly' | 'annual',
                customerEmail: email || undefined,
                successUrl: `${window.location.origin}/success?plan=${planId}`,
                cancelUrl: `${window.location.origin}/premium`
            });

            if (!result.success) {
                throw new Error(result.error || 'Payment processing failed');
            }

            // If we reach here, redirect to Stripe was successful
            monitorCheckoutConversion(planId, 'redirected_to_stripe');

        } catch (error) {
            console.error('❌ Checkout failed:', error);
            
            // Track failed checkout
            trackStripeEvent('checkout_failed', {
                planId,
                error: error instanceof Error ? error.message : 'Unknown error',
                email
            });

            alert(`Payment processing failed: ${error instanceof Error ? error.message : 'Please try again'}`);
        } finally {
            setLoading(false);
        }
    };
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'purchase', {
                        transaction_id: `tv_${Date.now()}`,
                        currency: 'USD',
                        value: plans.find(p => p.id === planId)?.price || 0
                    });
                }
            }, 2000);

        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Payment failed. Please try again.');
            setLoading(false);
        }
    };

    const selectedPlanData = plans.find(p => p.id === selectedPlan);

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
            color: '#FFFFFF',
            padding: '2rem'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ color: '#D4AF37', fontSize: '2.5rem', marginBottom: '1rem' }}>
                        🚀 Unlock TimeVault Premium
                    </h1>
                    <div style={{
                        background: '#EF4444',
                        color: '#FFFFFF',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '25px',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        display: 'inline-block',
                        marginBottom: '1rem'
                    }}>
                        🔥 LIMITED TIME: {formatTime(urgencyTimer)} LEFT
                    </div>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                        Join 127 smart investors maximizing their crypto-to-wealth strategies
                    </p>
                </div>

                {/* Plan Selection */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '2rem',
                    marginBottom: '2rem'
                }}>
                    {plans.map(plan => (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            style={{
                                background: selectedPlan === plan.id
                                    ? 'rgba(212, 175, 55, 0.2)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                border: selectedPlan === plan.id
                                    ? '2px solid #D4AF37'
                                    : '1px solid rgba(255, 255, 255, 0.2)',
                                borderRadius: '16px',
                                padding: '2rem',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {plan.recommended && (
                                <div style={{
                                    position: 'absolute',
                                    top: '-10px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#10B981',
                                    color: '#FFFFFF',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold'
                                }}>
                                    MOST POPULAR
                                </div>
                            )}

                            <h3 style={{
                                color: '#D4AF37',
                                marginBottom: '1rem',
                                fontSize: '1.5rem'
                            }}>
                                {plan.name}
                            </h3>

                            <div style={{ marginBottom: '1.5rem' }}>
                                {plan.originalPrice && (
                                    <div style={{
                                        color: '#EF4444',
                                        textDecoration: 'line-through',
                                        fontSize: '1.2rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        ${plan.originalPrice}
                                    </div>
                                )}
                                <div style={{
                                    color: '#10B981',
                                    fontSize: '2.5rem',
                                    fontWeight: 'bold',
                                    marginBottom: '0.5rem'
                                }}>
                                    ${plan.price}
                                </div>
                                <div style={{ opacity: 0.8 }}>
                                    per {plan.period === 'annual' ? 'year' : 'month'}
                                </div>
                                {plan.originalPrice && (
                                    <div style={{
                                        color: '#10B981',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        marginTop: '0.5rem'
                                    }}>
                                        Save ${(plan.originalPrice - plan.price).toFixed(2)}!
                                    </div>
                                )}
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                {plan.features.map((feature, index) => (
                                    <div key={index} style={{
                                        marginBottom: '0.75rem',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <span style={{ color: '#10B981', marginRight: '0.5rem' }}>✅</span>
                                        {feature}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Email Input */}
                <div style={{ marginBottom: '2rem' }}>
                    <input
                        type="email"
                        placeholder="Enter your email for instant access"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            background: 'rgba(255, 255, 255, 0.1)',
                            color: '#FFFFFF',
                            fontSize: '1.1rem'
                        }}
                    />
                </div>

                {/* Social Proof */}
                <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    border: '1px solid #D4AF37',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        color: '#D4AF37',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        fontSize: '1.2rem'
                    }}>
                        🔥 Real User Results
                    </div>
                    <div style={{ fontSize: '1rem', lineHeight: 1.6 }}>
                        "TimeVault's AI analysis helped me rebalance my $180K portfolio - saved $12K in fees and gained 23% this year!"
                        <br /><strong>- Marcus T., Premium User</strong>
                    </div>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={() => handleCheckout(selectedPlan)}
                    disabled={!email || loading}
                    style={{
                        background: email && !loading
                            ? 'linear-gradient(45deg, #D4AF37, #F7DC6F)'
                            : 'rgba(255, 255, 255, 0.3)',
                        color: '#001F3F',
                        border: 'none',
                        borderRadius: '12px',
                        padding: '1.5rem 3rem',
                        fontSize: '1.3rem',
                        fontWeight: 'bold',
                        cursor: email && !loading ? 'pointer' : 'not-allowed',
                        width: '100%',
                        marginBottom: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {loading ? '🔄 Processing...' : `🚀 Start 7-Day Free Trial - ${selectedPlanData?.name}`}
                </button>

                {/* Guarantees */}
                <div style={{
                    textAlign: 'center',
                    fontSize: '0.9rem',
                    color: '#C0C0C0',
                    marginBottom: '2rem'
                }}>
                    <div>✅ 7-day free trial • ✅ Cancel anytime • ✅ 30-day money-back guarantee</div>
                    <div style={{ marginTop: '0.5rem' }}>
                        🔒 Secure payment powered by Stripe • Your data is protected
                    </div>
                </div>

                {/* Exit Intent */}
                <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10B981',
                    borderRadius: '8px',
                    padding: '1rem',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    <strong style={{ color: '#10B981' }}>💎 Premium Features Waiting:</strong>
                    Unlock unlimited calculations, AI insights, and 2x TVLT rewards.
                    Join the smart money maximizing crypto wealth strategies!
                </div>
            </div>
        </div>
    );
};

export default PremiumCheckout;
