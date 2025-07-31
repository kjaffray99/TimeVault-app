'use client';

import { trackPremiumUpgradeClick } from '@/lib/analytics';
import { STRIPE_PRODUCTS } from '@/lib/stripe-production';
import { useState } from 'react';

interface PremiumUpgradeProps {
    className?: string;
    onUpgradeClick?: (priceId: string) => void;
}

export function PremiumUpgrade({ className = '', onUpgradeClick }: PremiumUpgradeProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpgrade = async (productKey: keyof typeof STRIPE_PRODUCTS) => {
        const product = STRIPE_PRODUCTS[productKey];
        setLoading(product.priceId);
        setError(null);

        try {
            // Track upgrade attempt
            trackPremiumUpgradeClick(product.name, product.price);

            // Call parent handler if provided
            if (onUpgradeClick) {
                onUpgradeClick(product.priceId);
                return;
            }

            // Create checkout session
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: product.priceId,
                    metadata: {
                        product: productKey,
                        source: 'premium_upgrade_component',
                    },
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { url } = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (err) {
            console.error('Upgrade error:', err);
            setError('Failed to start upgrade process. Please try again.');
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className={`premium-upgrade-container ${className}`}>
            <div className="premium-header">
                <h2 className="premium-title">🌟 Unlock Premium Features</h2>
                <p className="premium-subtitle">
                    Choose the perfect plan for your crypto journey
                </p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="pricing-grid">
                {Object.entries(STRIPE_PRODUCTS).map(([key, product]) => (
                    <div
                        key={key}
                        className={`pricing-card ${key === 'PRO' ? 'featured' : ''}`}
                    >
                        {key === 'PRO' && (
                            <div className="featured-badge">Most Popular</div>
                        )}

                        <div className="pricing-header">
                            <h3 className="plan-name">{product.name}</h3>
                            <div className="plan-price">
                                <span className="currency">$</span>
                                <span className="amount">{product.price}</span>
                                <span className="period">/month</span>
                            </div>
                        </div>

                        <div className="features-list">
                            {product.features.map((feature, index) => (
                                <div key={index} className="feature-item">
                                    <span className="feature-icon">✨</span>
                                    <span className="feature-text">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            className={`upgrade-button ${key.toLowerCase()}`}
                            onClick={() => handleUpgrade(key as keyof typeof STRIPE_PRODUCTS)}
                            disabled={loading === product.priceId}
                        >
                            {loading === product.priceId ? (
                                <div className="loading-spinner" />
                            ) : (
                                `Upgrade to ${key === 'BASIC' ? 'Basic' : key === 'PRO' ? 'Pro' : 'Enterprise'}`
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className="premium-guarantees">
                <div className="guarantee-item">
                    <span className="guarantee-icon">🔒</span>
                    <span>Secure Payment Processing</span>
                </div>
                <div className="guarantee-item">
                    <span className="guarantee-icon">↩️</span>
                    <span>30-Day Money Back Guarantee</span>
                </div>
                <div className="guarantee-item">
                    <span className="guarantee-icon">🚀</span>
                    <span>Instant Access After Payment</span>
                </div>
                <div className="guarantee-item">
                    <span className="guarantee-icon">📞</span>
                    <span>24/7 Customer Support</span>
                </div>
            </div>

            <style jsx>{`
        .premium-upgrade-container {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(212, 175, 55, 0.02) 100%);
          border: 2px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          padding: 40px;
          text-align: center;
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-header {
          margin-bottom: 40px;
        }

        .premium-title {
          font-size: 2.5rem;
          font-weight: 800;
          color: #D4AF37;
          margin-bottom: 15px;
          text-shadow: 0 0 20px rgba(212, 175, 55, 0.3);
        }

        .premium-subtitle {
          font-size: 1.2rem;
          color: #E0E0E0;
          opacity: 0.9;
        }

        .error-message {
          background: rgba(255, 0, 0, 0.1);
          border: 1px solid rgba(255, 0, 0, 0.3);
          color: #FFB3B3;
          padding: 15px;
          border-radius: 12px;
          margin-bottom: 30px;
          font-size: 0.95rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 40px;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          padding: 35px 25px;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(212, 175, 55, 0.4);
        }

        .pricing-card.featured {
          border-color: #D4AF37;
          box-shadow: 0 0 30px rgba(212, 175, 55, 0.2);
          transform: scale(1.05);
        }

        .featured-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #001F3F;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .pricing-header {
          margin-bottom: 30px;
        }

        .plan-name {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 15px;
        }

        .plan-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 2px;
        }

        .currency {
          font-size: 1.2rem;
          color: #D4AF37;
          font-weight: 600;
        }

        .amount {
          font-size: 3rem;
          font-weight: 800;
          color: #D4AF37;
          font-family: 'Monaco', 'Menlo', monospace;
        }

        .period {
          font-size: 1rem;
          color: #B0B0B0;
          font-weight: 500;
        }

        .features-list {
          margin-bottom: 35px;
          text-align: left;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-item:last-child {
          border-bottom: none;
        }

        .feature-icon {
          color: #D4AF37;
          font-size: 1.1rem;
        }

        .feature-text {
          color: #E0E0E0;
          font-size: 0.95rem;
          font-weight: 500;
        }

        .upgrade-button {
          width: 100%;
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #001F3F;
          border: none;
          border-radius: 12px;
          padding: 15px 25px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .upgrade-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
          filter: brightness(1.1);
        }

        .upgrade-button:active {
          transform: translateY(0);
        }

        .upgrade-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .upgrade-button.basic {
          background: linear-gradient(135deg, #4A90E2 0%, #5BA3F5 100%);
        }

        .upgrade-button.enterprise {
          background: linear-gradient(135deg, #8E44AD 0%, #A569BD 100%);
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 31, 63, 0.3);
          border-top: 2px solid #001F3F;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .premium-guarantees {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 40px;
          padding-top: 30px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .guarantee-item {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #E0E0E0;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .guarantee-icon {
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .premium-upgrade-container {
            padding: 25px 20px;
          }

          .premium-title {
            font-size: 2rem;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .pricing-card.featured {
            transform: none;
          }

          .amount {
            font-size: 2.5rem;
          }

          .premium-guarantees {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
      `}</style>
        </div>
    );
}
