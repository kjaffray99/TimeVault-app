/**
 * Premium Subscription Component
 * Core revenue generator - $9.99/month subscriptions
 */

import React, { useState, useEffect } from 'react';
import { Crown, Check, Zap, TrendingUp, PieChart, Bell, Sparkles, Lock } from 'lucide-react';
import { useUser } from '../../contexts';
import { PREMIUM, ANALYTICS_EVENTS } from '../../constants';
import './Premium.css';

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  comingSoon?: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  popular?: boolean;
  trialDays?: number;
}

const Premium: React.FC = () => {
  const { state: userState, dispatch } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'historical_charts',
      name: 'Historical Price Charts',
      description: 'Interactive charts with 1-year price history, technical indicators, and trend analysis',
      icon: TrendingUp,
    },
    {
      id: 'ai_insights',
      name: 'AI Market Insights',
      description: 'AI-powered market analysis, predictions, and personalized investment recommendations',
      icon: Sparkles,
    },
    {
      id: 'portfolio_tracking',
      name: 'Advanced Portfolio Tracking',
      description: 'Real-time portfolio valuation, asset allocation analysis, and performance metrics',
      icon: PieChart,
    },
    {
      id: 'real_time_alerts',
      name: 'Real-Time Price Alerts',
      description: 'Custom price thresholds, percentage change alerts, and mobile notifications',
      icon: Bell,
    },
    {
      id: 'advanced_analytics',
      name: 'Advanced Analytics',
      description: 'Correlation analysis, volatility metrics, and risk assessment tools',
      icon: Zap,
      comingSoon: true,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: PREMIUM.SUBSCRIPTION_PRICE,
      period: 'month',
      trialDays: PREMIUM.TRIAL_DURATION_DAYS,
      features: [
        'All premium features included',
        '7-day free trial',
        'Cancel anytime',
        'Priority customer support',
      ],
      popular: true,
    },
    {
      id: 'yearly',
      name: 'Annual Premium',
      price: PREMIUM.SUBSCRIPTION_PRICE * 10, // 2 months free
      period: 'year',
      trialDays: PREMIUM.TRIAL_DURATION_DAYS,
      features: [
        'All premium features included',
        'Save 2 months (17% off)',
        '7-day free trial',
        'Priority customer support',
        'Early access to new features',
      ],
    },
  ];

  useEffect(() => {
    // Track premium page views for analytics
    if (typeof window !== 'undefined') {
      console.log(ANALYTICS_EVENTS.PREMIUM_INTEREST, {
        source: 'premium_page_view',
        userType: userState.isPremium ? 'existing_premium' : 'free_user',
      });
    }
  }, [userState.isPremium]);

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    console.log(ANALYTICS_EVENTS.PREMIUM_INTEREST, {
      source: 'plan_selected',
      planId,
      price: pricingPlans.find(p => p.id === planId)?.price,
    });
  };

  const handleStartTrial = async (planId: string) => {
    setIsLoading(true);
    const plan = pricingPlans.find(p => p.id === planId);
    
    console.log(ANALYTICS_EVENTS.TRIAL_STARTED, {
      planId,
      price: plan?.price,
      trialDays: plan?.trialDays,
    });

    // TODO: Integrate with Stripe Checkout
    // For now, simulate the trial start
    setTimeout(() => {
      dispatch({ type: 'SET_PREMIUM', payload: true });
      setIsLoading(false);
      setShowPaymentModal(true);
      
      // Save premium status
      localStorage.setItem('timevault_premium_trial_start', new Date().toISOString());
      localStorage.setItem('timevault_premium_status', 'true');
    }, 1500);
  };

  const handleManageSubscription = () => {
    console.log(ANALYTICS_EVENTS.FEATURE_ACCESSED, {
      feature: 'subscription_management',
    });
    // TODO: Redirect to Stripe customer portal
    alert('Subscription management portal will be integrated with Stripe');
  };

  if (userState.isPremium) {
    return (
      <div className="premium-page premium-active">
        <div className="premium-header">
          <div className="premium-badge">
            <Crown size={32} />
            <span>Premium Active</span>
          </div>
          <h1>Welcome to TimeVault Premium!</h1>
          <p>You have access to all premium features</p>
        </div>

        <div className="premium-features-grid">
          {premiumFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="feature-card active">
                <div className="feature-icon">
                  <IconComponent size={32} />
                </div>
                <div className="feature-content">
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                  {feature.comingSoon ? (
                    <span className="coming-soon">Coming Soon</span>
                  ) : (
                    <span className="feature-status">✅ Available</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="subscription-management">
          <button 
            className="manage-subscription-btn"
            onClick={handleManageSubscription}
          >
            Manage Subscription
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-page">
      <div className="premium-header">
        <Crown size={48} className="header-icon" />
        <h1>Unlock TimeVault Premium</h1>
        <p>Advanced features for serious crypto and precious metals investors</p>
      </div>

      <div className="premium-features-preview">
        <h2>Premium Features</h2>
        <div className="features-grid">
          {premiumFeatures.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div key={feature.id} className="feature-card preview">
                <div className="feature-icon">
                  <IconComponent size={32} />
                </div>
                <div className="feature-content">
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                  {feature.comingSoon && (
                    <span className="coming-soon">Coming Soon</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pricing-section">
        <h2>Choose Your Plan</h2>
        <div className="pricing-cards">
          {pricingPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`pricing-card ${selectedPlan === plan.id ? 'selected' : ''} ${plan.popular ? 'popular' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
            >
              {plan.popular && <div className="popular-badge">Most Popular</div>}
              
              <div className="plan-header">
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  <span className="price">${plan.price}</span>
                  <span className="period">/{plan.period}</span>
                </div>
                {plan.trialDays && (
                  <div className="trial-info">
                    {plan.trialDays}-day free trial
                  </div>
                )}
              </div>
              
              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <Check size={16} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              
              <button 
                className={`plan-cta ${selectedPlan === plan.id ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartTrial(plan.id);
                }}
                disabled={isLoading}
              >
                {isLoading ? 'Starting Trial...' : `Start ${plan.trialDays}-Day Free Trial`}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="premium-guarantees">
        <div className="guarantee-item">
          <Check className="guarantee-icon" />
          <div>
            <h4>Cancel Anytime</h4>
            <p>No long-term commitments. Cancel with one click.</p>
          </div>
        </div>
        <div className="guarantee-item">
          <Check className="guarantee-icon" />
          <div>
            <h4>7-Day Free Trial</h4>
            <p>Try all premium features risk-free for a full week.</p>
          </div>
        </div>
        <div className="guarantee-item">
          <Check className="guarantee-icon" />
          <div>
            <h4>Instant Access</h4>
            <p>Premium features activate immediately after signup.</p>
          </div>
        </div>
      </div>

      {/* Payment Success Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="payment-success">
              <div className="success-icon">
                <Crown size={48} />
              </div>
              <h3>🎉 Welcome to Premium!</h3>
              <p>Your 7-day free trial has started. Enjoy all premium features!</p>
              
              <div className="trial-info">
                <p><strong>Trial ends:</strong> {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <p><strong>You'll be charged:</strong> ${pricingPlans.find(p => p.id === selectedPlan)?.price}/{pricingPlans.find(p => p.id === selectedPlan)?.period}</p>
              </div>
              
              <button 
                className="modal-cta"
                onClick={() => setShowPaymentModal(false)}
              >
                Explore Premium Features
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
    </div>
  );
};

export default Premium;
