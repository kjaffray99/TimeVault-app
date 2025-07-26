import {
  ArrowRight,
  BarChart3,
  Check,
  Crown,
  Lock,
  Star,
  TrendingUp,
  Unlock,
  Wallet,
  Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { AIInsight, PremiumFeature, WalletConnection } from '../../types';
import './Premium.css';

interface PremiumProps {
  userProfile?: any;
  walletConnection?: WalletConnection;
  onConnectWallet?: () => void;
  onSubscribe?: (planId: string) => void;
  className?: string;
}

const Premium: React.FC<PremiumProps> = ({
  userProfile: _userProfile,
  walletConnection,
  onConnectWallet,
  onSubscribe,
  className = '',
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock premium features
  const premiumFeatures: PremiumFeature[] = [
    {
      id: 'basic',
      name: 'Basic Premium',
      description: 'Essential tools for crypto analysis',
      tier: 'basic',
      price: 9.99,
      features: [
        'Advanced price charts',
        'Portfolio tracking',
        'Basic AI insights',
        'Premium support',
        'Ad-free experience'
      ],
      ctaText: 'Start Basic Plan',
    },
    {
      id: 'pro',
      name: 'Pro Analytics',
      description: 'Professional-grade analysis tools',
      tier: 'premium',
      price: 19.99,
      features: [
        'All Basic features',
        'Advanced AI insights',
        'Custom alerts',
        'Multi-exchange data',
        'Technical indicators',
        'Risk analysis tools',
        'Priority support'
      ],
      ctaText: 'Upgrade to Pro',
    },
    {
      id: 'enterprise',
      name: 'Enterprise Suite',
      description: 'Complete solution for serious traders',
      tier: 'enterprise',
      price: 49.99,
      features: [
        'All Pro features',
        'Real-time data feeds',
        'Custom trading bots',
        'Advanced backtesting',
        'API access',
        'White-label options',
        'Dedicated support',
        'Custom integrations'
      ],
      ctaText: 'Contact Sales',
    },
  ];

  // Mock AI insights
  const mockInsights: AIInsight[] = [
    {
      id: 'insight-1',
      title: 'Bitcoin Technical Breakout Detected',
      content: 'BTC has broken above the key resistance level of $45,000 with strong volume. Historical patterns suggest a potential move toward $52,000 in the next 2-3 weeks. Consider gradual position building.',
      type: 'market_analysis',
      confidence: 87,
      timestamp: new Date().toISOString(),
      sources: ['Technical Analysis', 'Volume Profile', 'Historical Patterns'],
    },
    {
      id: 'insight-2',
      title: 'Ethereum DeFi Activity Surge',
      content: 'DeFi activity on Ethereum has increased 35% this week, with TVL reaching new highs. This typically correlates with ETH price appreciation. Watch for gas fee implications.',
      type: 'market_analysis',
      confidence: 92,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      sources: ['DeFi Analytics', 'On-chain Data', 'TVL Metrics'],
    },
    {
      id: 'insight-3',
      title: 'Portfolio Rebalancing Recommendation',
      content: 'Your portfolio is overweight in large-cap assets. Consider allocating 15% to mid-cap altcoins for better risk-adjusted returns based on current market conditions.',
      type: 'portfolio_advice',
      confidence: 78,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      sources: ['Portfolio Analysis', 'Risk Metrics', 'Market Correlation'],
    },
  ];

  useEffect(() => {
    setIsAuthenticated(!!walletConnection?.address);
    if (walletConnection?.address) {
      setAiInsights(mockInsights);
    }
  }, [walletConnection]);

  const handleConnectWallet = () => {
    setIsLoading(true);
    // Simulate wallet connection delay
    setTimeout(() => {
      setIsLoading(false);
      onConnectWallet?.();
    }, 1500);
  };

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    onSubscribe?.(planId);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'high-confidence';
    if (confidence >= 60) return 'medium-confidence';
    return 'low-confidence';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  if (!isAuthenticated) {
    return (
      <div className={`premium ${className}`}>
        <div className="premium-gate">
          <div className="gate-content">
            <div className="gate-icon">
              <Lock className="lock-icon" />
            </div>
            <h2 className="gate-title">Premium Features</h2>
            <p className="gate-description">
              Connect your wallet to unlock advanced analytics, AI insights, and premium trading tools.
            </p>

            <div className="gate-features">
              <div className="gate-feature">
                <BarChart3 className="feature-icon" />
                <span>Advanced Charts</span>
              </div>
              <div className="gate-feature">
                <Zap className="feature-icon" />
                <span>AI Insights</span>
              </div>
              <div className="gate-feature">
                <TrendingUp className="feature-icon" />
                <span>Portfolio Analytics</span>
              </div>
              <div className="gate-feature">
                <Crown className="feature-icon" />
                <span>Premium Support</span>
              </div>
            </div>

            <button
              className="btn btn-primary btn-lg connect-wallet-btn"
              onClick={handleConnectWallet}
              disabled={isLoading}
            >
              <Wallet className="btn-icon" />
              {isLoading ? 'Connecting...' : 'Connect Wallet'}
            </button>

            <p className="gate-disclaimer">
              No fees for wallet connection. Premium features require separate subscription.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`premium authenticated ${className}`}>
      <div className="premium-header">
        <div className="header-content">
          <div className="status-indicator">
            <Unlock className="unlock-icon" />
            <span className="status-text">Wallet Connected</span>
          </div>
          <h2>Premium Analytics</h2>
          <p>Advanced tools and insights for serious crypto investors</p>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="ai-insights-section">
        <div className="section-header">
          <div className="section-title">
            <Zap className="section-icon" />
            <h3>AI Market Insights</h3>
          </div>
          <span className="insights-badge">Live Analysis</span>
        </div>

        <div className="insights-grid">
          {aiInsights.map((insight) => (
            <div key={insight.id} className="insight-card">
              <div className="insight-header">
                <div className="insight-meta">
                  <span className={`insight-type ${insight.type}`}>
                    {insight.type.replace('_', ' ')}
                  </span>
                  <span className="insight-time">
                    {formatTimestamp(insight.timestamp)}
                  </span>
                </div>
                <div className={`confidence-indicator ${getConfidenceColor(insight.confidence)}`}>
                  <span className="confidence-value">{insight.confidence}%</span>
                  <span className="confidence-label">confidence</span>
                </div>
              </div>

              <h4 className="insight-title">{insight.title}</h4>
              <p className="insight-content">{insight.content}</p>

              <div className="insight-sources">
                <span className="sources-label">Sources:</span>
                <div className="sources-list">
                  {insight.sources.map((source, index) => (
                    <span key={index} className="source-tag">{source}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="subscription-section">
        <div className="section-header">
          <h3>Choose Your Plan</h3>
          <p>Unlock the full potential of your crypto investments</p>
        </div>

        <div className="plans-grid">
          {premiumFeatures.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.tier} ${selectedPlan === plan.id ? 'selected' : ''}`}
            >
              {plan.tier === 'premium' && (
                <div className="popular-badge">
                  <Star className="star-icon" />
                  Most Popular
                </div>
              )}

              <div className="plan-header">
                <h4 className="plan-name">{plan.name}</h4>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-price">
                  <span className="price-amount">${plan.price}</span>
                  <span className="price-period">/month</span>
                </div>
              </div>

              <div className="plan-features">
                {plan.features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <Check className="check-icon" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                className={`btn ${plan.tier === 'premium' ? 'btn-primary' : 'btn-secondary'} btn-lg plan-cta`}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.ctaText}
                <ArrowRight className="arrow-icon" />
              </button>

              {plan.tier === 'enterprise' && (
                <p className="enterprise-note">
                  Custom pricing available for teams
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="feature-showcase">
        <h3>What You Get with Premium</h3>

        <div className="showcase-grid">
          <div className="showcase-item">
            <div className="showcase-icon">
              <BarChart3 className="icon" />
            </div>
            <h4>Advanced Charts</h4>
            <p>Professional-grade charting tools with 50+ technical indicators and custom overlays.</p>
          </div>

          <div className="showcase-item">
            <div className="showcase-icon">
              <Zap className="icon" />
            </div>
            <h4>AI-Powered Insights</h4>
            <p>Machine learning algorithms analyze market data to provide actionable investment insights.</p>
          </div>

          <div className="showcase-item">
            <div className="showcase-icon">
              <TrendingUp className="icon" />
            </div>
            <h4>Portfolio Analytics</h4>
            <p>Track performance, analyze risk, and optimize your crypto portfolio with advanced metrics.</p>
          </div>

          <div className="showcase-item">
            <div className="showcase-icon">
              <Crown className="icon" />
            </div>
            <h4>Premium Support</h4>
            <p>Priority customer support with dedicated account managers for enterprise clients.</p>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="premium-cta">
        <h3>Ready to Elevate Your Trading?</h3>
        <p>Join thousands of successful crypto investors using TimeVault Premium</p>
        <div className="cta-buttons">
          <button className="btn btn-primary btn-lg">
            Start 7-Day Free Trial
          </button>
          <button className="btn btn-ghost btn-lg">
            View Feature Comparison
          </button>
        </div>
      </div>
    </div>
  );
};

export default Premium;
