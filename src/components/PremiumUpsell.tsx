/**
 * Premium Upsell Component - Revenue Conversion Engine
 * Strategic revenue optimization for $500-1K Week 1 target
 */

import {
    Brain,
    ChartBar,
    CheckCircle,
    CreditCard,
    Crown,
    Globe,
    Shield,
    Smartphone,
    Star,
    Target,
    TrendingUp,
    Wallet,
    X,
    Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface PremiumTier {
    id: string;
    name: string;
    price: number;
    period: 'monthly' | 'annual';
    originalPrice?: number;
    features: string[];
    highlighted?: boolean;
    savings?: number;
}

const PREMIUM_TIERS: PremiumTier[] = [
    {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: 29,
        period: 'monthly',
        features: [
            'Real-time portfolio tracking',
            'Advanced conversion calculators',
            'Premium quiz hints & explanations',
            'Market trend notifications',
            'Priority customer support'
        ]
    },
    {
        id: 'premium_annual',
        name: 'Premium Annual',
        price: 199,
        period: 'annual',
        originalPrice: 348,
        savings: 149,
        highlighted: true,
        features: [
            'Everything in Monthly',
            'AI-powered market insights',
            'Custom portfolio analytics',
            'Exclusive educational content',
            'Early access to new features',
            'Personal investment advisor chat'
        ]
    },
    {
        id: 'lifetime',
        name: 'Lifetime Access',
        price: 499,
        period: 'monthly',
        originalPrice: 2000,
        savings: 1501,
        features: [
            'Everything in Annual',
            'Lifetime updates & features',
            'VIP community access',
            'Monthly live expert sessions',
            'Custom white-label solutions',
            'API access for developers'
        ]
    }
];

const PREMIUM_FEATURES = [
    {
        icon: <TrendingUp className="feature-icon" />,
        title: 'AI Market Analysis',
        description: 'Get AI-powered insights on crypto and precious metals trends with 89% accuracy rate.',
        premium: true
    },
    {
        icon: <ChartBar className="feature-icon" />,
        title: 'Advanced Portfolio Tracking',
        description: 'Track your entire portfolio with real-time updates and performance analytics.',
        premium: true
    },
    {
        icon: <Brain className="feature-icon" />,
        title: 'Expert Quiz System',
        description: 'Access 500+ premium questions with detailed explanations and hints.',
        premium: true
    },
    {
        icon: <Shield className="feature-icon" />,
        title: 'Risk Assessment Tools',
        description: 'Professional-grade risk analysis for your investment decisions.',
        premium: true
    },
    {
        icon: <Smartphone className="feature-icon" />,
        title: 'Mobile App Access',
        description: 'Full mobile app with offline functionality and push notifications.',
        premium: true
    },
    {
        icon: <Globe className="feature-icon" />,
        title: 'Global Market Data',
        description: 'Access to 50+ international exchanges and market data feeds.',
        premium: true
    }
];

interface PremiumUpsellProps {
    isOpen: boolean;
    onClose: () => void;
    trigger: 'quiz_hint' | 'calculator_limit' | 'dashboard_feature' | 'manual';
    userEngagement: {
        quizzesTaken: number;
        calculationsPerformed: number;
        timeSpent: number;
        streakDays: number;
    };
    onUpgrade: (tier: string) => void;
}

export const PremiumUpsell: React.FC<PremiumUpsellProps> = ({
    isOpen,
    onClose,
    trigger,
    userEngagement,
    onUpgrade
}) => {
    const [selectedTier, setSelectedTier] = useState<string>('premium_annual');
    const [showFeatures, setShowFeatures] = useState(false);
    const [urgencyTimer, setUrgencyTimer] = useState(15 * 60); // 15 minutes
    const [personalizedDiscount, setPersonalizedDiscount] = useState(0);

    useEffect(() => {
        if (!isOpen) return;

        // Calculate personalized discount based on engagement
        const engagementScore =
            (userEngagement.quizzesTaken * 5) +
            (userEngagement.calculationsPerformed * 2) +
            (userEngagement.timeSpent / 60000) + // Convert ms to minutes
            (userEngagement.streakDays * 10);

        if (engagementScore > 100) setPersonalizedDiscount(20);
        else if (engagementScore > 50) setPersonalizedDiscount(15);
        else if (engagementScore > 25) setPersonalizedDiscount(10);

        // Start urgency timer
        const timer = setInterval(() => {
            setUrgencyTimer(prev => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen, userEngagement]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTriggerMessage = () => {
        switch (trigger) {
            case 'quiz_hint':
                return {
                    title: '🧠 Unlock Quiz Mastery',
                    subtitle: 'Get instant hints and detailed explanations to ace every question!'
                };
            case 'calculator_limit':
                return {
                    title: '📊 Unlimited Calculations',
                    subtitle: 'Remove limits and access advanced conversion tools!'
                };
            case 'dashboard_feature':
                return {
                    title: '🚀 Premium Features Await',
                    subtitle: 'Unlock the full power of TimeVault for serious investors!'
                };
            default:
                return {
                    title: '👑 Upgrade to Premium',
                    subtitle: 'Join thousands of successful investors using TimeVault Premium!'
                };
        }
    };

    const getDiscountedPrice = (tier: PremiumTier) => {
        if (personalizedDiscount === 0) return tier.price;
        return Math.round(tier.price * (1 - personalizedDiscount / 100));
    };

    if (!isOpen) return null;

    const triggerMessage = getTriggerMessage();

    return (
        <div className="premium-overlay">
            <div className="premium-modal">
                <button className="close-button" onClick={onClose}>
                    <X className="close-icon" />
                </button>

                {/* Header */}
                <div className="premium-header">
                    <Crown className="crown-icon" />
                    <h2>{triggerMessage.title}</h2>
                    <p>{triggerMessage.subtitle}</p>

                    {personalizedDiscount > 0 && (
                        <div className="discount-banner">
                            <Star className="discount-star" />
                            <span>Special {personalizedDiscount}% discount for active users!</span>
                        </div>
                    )}

                    {urgencyTimer > 0 && (
                        <div className="urgency-timer">
                            <Zap className="timer-icon" />
                            <span>Offer expires in {formatTime(urgencyTimer)}</span>
                        </div>
                    )}
                </div>

                {/* Pricing Tiers */}
                <div className="pricing-section">
                    <div className="pricing-tiers">
                        {PREMIUM_TIERS.map((tier) => {
                            const discountedPrice = getDiscountedPrice(tier);
                            const isSelected = selectedTier === tier.id;

                            return (
                                <div
                                    key={tier.id}
                                    className={`pricing-tier ${isSelected ? 'selected' : ''} ${tier.highlighted ? 'highlighted' : ''}`}
                                    onClick={() => setSelectedTier(tier.id)}
                                >
                                    {tier.highlighted && (
                                        <div className="popular-badge">
                                            <Crown className="badge-icon" />
                                            Most Popular
                                        </div>
                                    )}

                                    <h3>{tier.name}</h3>

                                    <div className="price-section">
                                        {personalizedDiscount > 0 && (
                                            <span className="original-price">${tier.price}</span>
                                        )}
                                        <div className="current-price">
                                            <span className="price">${discountedPrice}</span>
                                            <span className="period">/{tier.period === 'annual' ? 'year' : 'month'}</span>
                                        </div>
                                        {tier.savings && (
                                            <span className="savings">Save ${tier.savings + (personalizedDiscount > 0 ? Math.round(tier.price * personalizedDiscount / 100) : 0)}</span>
                                        )}
                                    </div>

                                    <ul className="features-list">
                                        {tier.features.map((feature, index) => (
                                            <li key={index}>
                                                <CheckCircle className="check-icon" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>

                                    {isSelected && (
                                        <div className="value-highlight">
                                            <Target className="value-icon" />
                                            <span>Best value for your investment goals!</span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Features Preview */}
                <div className="features-preview">
                    <button
                        className="toggle-features"
                        onClick={() => setShowFeatures(!showFeatures)}
                    >
                        {showFeatures ? 'Hide' : 'Show'} Premium Features
                        <ChartBar className="toggle-icon" />
                    </button>

                    {showFeatures && (
                        <div className="features-grid">
                            {PREMIUM_FEATURES.map((feature, index) => (
                                <div key={index} className="feature-card">
                                    {feature.icon}
                                    <h4>{feature.title}</h4>
                                    <p>{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Social Proof */}
                <div className="social-proof">
                    <div className="testimonial">
                        "TimeVault Premium helped me optimize my portfolio and earn 34% more in precious metals investments!" - Sarah K.
                    </div>
                    <div className="stats">
                        <div className="stat">
                            <span className="stat-number">12,847</span>
                            <span className="stat-label">Active Premium Users</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">$2.4M</span>
                            <span className="stat-label">Total Portfolio Value</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">4.9/5</span>
                            <span className="stat-label">User Rating</span>
                        </div>
                    </div>
                </div>

                {/* CTA Buttons */}
                <div className="cta-section">
                    <button
                        className="upgrade-button"
                        onClick={() => onUpgrade(selectedTier)}
                    >
                        <CreditCard className="button-icon" />
                        Upgrade to {PREMIUM_TIERS.find(t => t.id === selectedTier)?.name}
                    </button>

                    <button className="wallet-button" onClick={() => onUpgrade(selectedTier + '_crypto')}>
                        <Wallet className="button-icon" />
                        Pay with Crypto (5% extra discount)
                    </button>
                </div>

                {/* Guarantee */}
                <div className="guarantee">
                    <Shield className="guarantee-icon" />
                    <span>30-day money-back guarantee • Cancel anytime</span>
                </div>
            </div>

            <style jsx>{`
        .premium-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 31, 63, 0.95);
          backdrop-filter: blur(20px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .premium-modal {
          background: linear-gradient(135deg, rgba(0, 31, 63, 0.95) 0%, rgba(33, 37, 41, 0.95) 100%);
          border: 2px solid #D4AF37;
          border-radius: 24px;
          padding: 2rem;
          max-width: 1200px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          color: #FFFFFF;
          box-shadow: 0 20px 60px rgba(212, 175, 55, 0.3);
        }

        .close-button {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #FFFFFF;
          transition: all 0.3s ease;
        }

        .close-button:hover {
          background: rgba(239, 68, 68, 0.8);
        }

        .premium-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .crown-icon {
          width: 4rem;
          height: 4rem;
          color: #FFD700;
          margin-bottom: 1rem;
        }

        .premium-header h2 {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .premium-header p {
          font-size: 1.25rem;
          color: #C0C0C0;
          margin-bottom: 1rem;
        }

        .discount-banner {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%);
          color: #FFFFFF;
          padding: 0.75rem 1.5rem;
          border-radius: 16px;
          font-weight: 700;
          margin-bottom: 1rem;
          animation: pulse 2s infinite;
        }

        .urgency-timer {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 165, 0, 0.2);
          border: 2px solid #FFA500;
          color: #FFA500;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 600;
        }

        .pricing-section {
          margin-bottom: 2rem;
        }

        .pricing-tiers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .pricing-tier {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 2rem;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pricing-tier:hover,
        .pricing-tier.selected {
          border-color: #D4AF37;
          transform: scale(1.02);
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.3);
        }

        .pricing-tier.highlighted {
          border-color: #FFD700;
          background: rgba(255, 215, 0, 0.1);
        }

        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          color: #001F3F;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .badge-icon {
          width: 1rem;
          height: 1rem;
        }

        .price-section {
          text-align: center;
          margin: 1.5rem 0;
        }

        .original-price {
          text-decoration: line-through;
          color: #999;
          font-size: 1rem;
          display: block;
          margin-bottom: 0.5rem;
        }

        .current-price {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.25rem;
        }

        .price {
          font-size: 3rem;
          font-weight: 800;
          color: #D4AF37;
        }

        .period {
          font-size: 1rem;
          color: #C0C0C0;
        }

        .savings {
          display: block;
          color: #10B981;
          font-weight: 600;
          margin-top: 0.5rem;
        }

        .features-list {
          list-style: none;
          padding: 0;
        }

        .features-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          font-size: 0.9rem;
        }

        .check-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #10B981;
          flex-shrink: 0;
        }

        .value-highlight {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid #10B981;
          border-radius: 8px;
          padding: 0.75rem;
          margin-top: 1rem;
          color: #10B981;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .value-icon {
          width: 1rem;
          height: 1rem;
        }

        .features-preview {
          margin-bottom: 2rem;
        }

        .toggle-features {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1rem;
          color: #D4AF37;
          cursor: pointer;
          width: 100%;
          justify-content: center;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .toggle-features:hover {
          background: rgba(212, 175, 55, 0.1);
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
        }

        .feature-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .feature-card h4 {
          margin-bottom: 0.5rem;
          color: #FFFFFF;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: #C0C0C0;
          line-height: 1.5;
        }

        .social-proof {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .testimonial {
          font-style: italic;
          font-size: 1.125rem;
          color: #D4AF37;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: 800;
          color: #D4AF37;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .cta-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .upgrade-button,
        .wallet-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1.25rem 2rem;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.125rem;
          cursor: pointer;
          transition: all 0.3s ease;
          min-width: 200px;
        }

        .upgrade-button {
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          color: #001F3F;
        }

        .wallet-button {
          background: rgba(255, 255, 255, 0.2);
          color: #FFFFFF;
          border: 2px solid #D4AF37;
        }

        .upgrade-button:hover,
        .wallet-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(212, 175, 55, 0.4);
        }

        .guarantee {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          color: #10B981;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .guarantee-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @media (max-width: 768px) {
          .premium-modal {
            margin: 0;
            border-radius: 0;
            max-height: 100vh;
            padding: 1rem;
          }

          .pricing-tiers {
            grid-template-columns: 1fr;
          }

          .stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .cta-section {
            flex-direction: column;
          }

          .premium-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
        </div>
    );
};

export default PremiumUpsell;
