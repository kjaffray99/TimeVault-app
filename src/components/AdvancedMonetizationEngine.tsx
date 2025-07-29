/**
 * Advanced Monetization Engine - Multiple Revenue Streams
 * Subscription tiers, affiliate programs, white-label licensing
 */

import {
    ArrowRight,
    Briefcase,
    CheckCircle,
    Crown, DollarSign,
    Rocket,
    Shield,
    Star,
    Target,
    TrendingUp,
    Users, Zap
} from 'lucide-react';
import React, { useState } from 'react';

interface SubscriptionTier {
    id: string;
    name: string;
    price: {
        monthly: number;
        yearly: number;
        lifetime?: number;
    };
    features: string[];
    limits: {
        calculations: number | 'unlimited';
        apiCalls: number | 'unlimited';
        portfolios: number | 'unlimited';
        alerts: number | 'unlimited';
    };
    popular?: boolean;
    enterprise?: boolean;
    color: string;
    icon: React.ReactNode;
}

interface AffiliateProgram {
    tier: string;
    commission: number;
    minimumSales: number;
    benefits: string[];
    requirements: string[];
}

interface RevenueStream {
    name: string;
    currentRevenue: number;
    projectedRevenue: number;
    growth: number;
    description: string;
    action: string;
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
    {
        id: 'free',
        name: 'Free Explorer',
        price: { monthly: 0, yearly: 0 },
        features: [
            '5 calculations per day',
            'Basic crypto to metals conversion',
            'Educational quizzes',
            'Community access',
            'Mobile app access'
        ],
        limits: {
            calculations: 5,
            apiCalls: 50,
            portfolios: 1,
            alerts: 3
        },
        color: '#6B7280',
        icon: <Star className="tier-icon" />
    },
    {
        id: 'pro',
        name: 'Pro Investor',
        price: { monthly: 29, yearly: 299 },
        features: [
            'Unlimited calculations',
            'Advanced analytics & charts',
            'Portfolio tracking',
            'Price alerts & notifications',
            'AI-powered insights',
            'Export data (CSV, PDF)',
            'Priority customer support',
            'Exclusive market reports'
        ],
        limits: {
            calculations: 'unlimited',
            apiCalls: 1000,
            portfolios: 10,
            alerts: 50
        },
        popular: true,
        color: '#D4AF37',
        icon: <Crown className="tier-icon" />
    },
    {
        id: 'premium',
        name: 'Premium Trader',
        price: { monthly: 79, yearly: 799 },
        features: [
            'Everything in Pro',
            'Real-time market data',
            'Advanced API access',
            'Custom webhooks',
            'Institutional-grade security',
            'Dedicated account manager',
            'White-label dashboard',
            'Custom integrations',
            'Advanced risk analytics'
        ],
        limits: {
            calculations: 'unlimited',
            apiCalls: 10000,
            portfolios: 'unlimited',
            alerts: 'unlimited'
        },
        color: '#8B5CF6',
        icon: <Zap className="tier-icon" />
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: { monthly: 299, yearly: 2999, lifetime: 9999 },
        features: [
            'Everything in Premium',
            'Multi-tenant architecture',
            'Custom branding',
            'SSO integration',
            'Compliance reporting',
            'On-premise deployment',
            '99.9% SLA guarantee',
            'Custom feature development',
            'Training & onboarding'
        ],
        limits: {
            calculations: 'unlimited',
            apiCalls: 'unlimited',
            portfolios: 'unlimited',
            alerts: 'unlimited'
        },
        enterprise: true,
        color: '#10B981',
        icon: <Briefcase className="tier-icon" />
    }
];

const AFFILIATE_PROGRAMS: AffiliateProgram[] = [
    {
        tier: 'Bronze',
        commission: 20,
        minimumSales: 0,
        benefits: [
            '20% commission on all sales',
            'Marketing materials provided',
            'Monthly performance reports',
            'Basic affiliate dashboard'
        ],
        requirements: [
            'Complete affiliate training',
            'Agree to brand guidelines',
            'Minimum 1 sale per quarter'
        ]
    },
    {
        tier: 'Silver',
        commission: 30,
        minimumSales: 10,
        benefits: [
            '30% commission on all sales',
            'Priority support channel',
            'Custom referral codes',
            'Advanced analytics dashboard',
            'Exclusive partner webinars'
        ],
        requirements: [
            '10+ successful referrals',
            'Maintain 4.5+ star rating',
            'Active social media presence'
        ]
    },
    {
        tier: 'Gold',
        commission: 40,
        minimumSales: 25,
        benefits: [
            '40% commission on all sales',
            'Dedicated account manager',
            'Co-marketing opportunities',
            'Custom landing pages',
            'Early access to new features',
            'Revenue share on enterprise deals'
        ],
        requirements: [
            '25+ successful referrals',
            '$10K+ in generated revenue',
            'Proven marketing expertise'
        ]
    },
    {
        tier: 'Platinum',
        commission: 50,
        minimumSales: 50,
        benefits: [
            '50% commission on all sales',
            'White-label licensing options',
            'Joint venture opportunities',
            'Speaking opportunities at events',
            'Custom API integrations',
            'Equity participation program'
        ],
        requirements: [
            '50+ successful referrals',
            '$50K+ in generated revenue',
            'Strategic partnership agreement'
        ]
    }
];

const REVENUE_STREAMS: RevenueStream[] = [
    {
        name: 'Subscription Revenue',
        currentRevenue: 47500,
        projectedRevenue: 125000,
        growth: 163.2,
        description: 'Monthly recurring revenue from Pro, Premium, and Enterprise subscriptions',
        action: 'Optimize conversion funnel'
    },
    {
        name: 'Affiliate Commissions',
        currentRevenue: 12800,
        projectedRevenue: 45000,
        growth: 251.6,
        description: 'Revenue from affiliate partner program and referral bonuses',
        action: 'Expand partner network'
    },
    {
        name: 'Enterprise Licensing',
        currentRevenue: 8900,
        projectedRevenue: 75000,
        growth: 743.8,
        description: 'White-label solutions and custom enterprise deployments',
        action: 'Target financial institutions'
    },
    {
        name: 'API Usage Fees',
        currentRevenue: 3200,
        projectedRevenue: 25000,
        growth: 681.3,
        description: 'Pay-per-use API access for developers and third-party integrations',
        action: 'Launch developer program'
    },
    {
        name: 'Educational Content',
        currentRevenue: 1800,
        projectedRevenue: 15000,
        growth: 733.3,
        description: 'Premium courses, webinars, and certification programs',
        action: 'Create course platform'
    },
    {
        name: 'Data & Insights',
        currentRevenue: 950,
        projectedRevenue: 20000,
        growth: 2005.3,
        description: 'Market research reports and institutional data feeds',
        action: 'Partner with exchanges'
    }
];

export const AdvancedMonetizationEngine: React.FC<{
    currentPlan: string;
    onUpgrade: (planId: string) => void;
    onAffiliateJoin: (program: string) => void;
    userMetrics: {
        totalReferrals: number;
        monthlyRevenue: number;
        lifetimeValue: number;
    };
}> = ({ currentPlan, onUpgrade, onAffiliateJoin, userMetrics }) => {
    const [activeTab, setActiveTab] = useState<'pricing' | 'affiliate' | 'revenue' | 'enterprise'>('pricing');
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [selectedTier, setSelectedTier] = useState<string | null>(null);
    const [showROICalculator, setShowROICalculator] = useState(false);
    const [roiInputs, setROIInputs] = useState({
        monthlyPortfolioValue: 100000,
        tradingFrequency: 10,
        averageProfit: 3.5
    });

    const calculateSavings = (tier: SubscriptionTier) => {
        if (billingCycle === 'yearly' && tier.price.yearly > 0) {
            const monthlyCost = tier.price.monthly * 12;
            const yearlyCost = tier.price.yearly;
            return monthlyCost - yearlyCost;
        }
        return 0;
    };

    const calculateROI = () => {
        const { monthlyPortfolioValue, tradingFrequency, averageProfit } = roiInputs;
        const monthlyTrades = tradingFrequency;
        const monthlyProfit = (monthlyPortfolioValue * (averageProfit / 100) * monthlyTrades);
        const annualProfit = monthlyProfit * 12;
        const subscriptionCost = billingCycle === 'yearly' ? 799 : 79 * 12;
        const roi = ((annualProfit - subscriptionCost) / subscriptionCost) * 100;

        return {
            monthlyProfit,
            annualProfit,
            subscriptionCost,
            roi,
            paybackPeriod: subscriptionCost / monthlyProfit
        };
    };

    const PricingTab = () => (
        <div className="pricing-tab">
            <div className="pricing-header">
                <h3>Choose Your Plan</h3>
                <p>Unlock the full potential of your investment strategy</p>

                <div className="billing-toggle">
                    <button
                        className={`toggle-btn ${billingCycle === 'monthly' ? 'active' : ''}`}
                        onClick={() => setBillingCycle('monthly')}
                    >
                        Monthly
                    </button>
                    <button
                        className={`toggle-btn ${billingCycle === 'yearly' ? 'active' : ''}`}
                        onClick={() => setBillingCycle('yearly')}
                    >
                        Yearly
                        <span className="savings-badge">Save 17%</span>
                    </button>
                </div>
            </div>

            <div className="pricing-grid">
                {SUBSCRIPTION_TIERS.map(tier => {
                    const savings = calculateSavings(tier);
                    const price = billingCycle === 'yearly' ? tier.price.yearly : tier.price.monthly;
                    const isCurrentPlan = currentPlan === tier.id;

                    return (
                        <div
                            key={tier.id}
                            className={`pricing-card ${tier.popular ? 'popular' : ''} ${tier.enterprise ? 'enterprise' : ''} ${isCurrentPlan ? 'current' : ''}`}
                            style={{ borderColor: tier.color }}
                        >
                            {tier.popular && <div className="popular-badge">Most Popular</div>}
                            {tier.enterprise && <div className="enterprise-badge">Enterprise</div>}

                            <div className="tier-header">
                                <div className="tier-icon-container" style={{ background: tier.color }}>
                                    {tier.icon}
                                </div>
                                <h4>{tier.name}</h4>
                                {tier.id === 'enterprise' && (
                                    <span className="custom-pricing">Custom Pricing</span>
                                )}
                            </div>

                            <div className="tier-pricing">
                                {tier.id === 'enterprise' ? (
                                    <div className="enterprise-pricing">
                                        <span className="contact-sales">Contact Sales</span>
                                    </div>
                                ) : (
                                    <>
                                        <span className="price">${price}</span>
                                        <span className="period">/{billingCycle === 'yearly' ? 'year' : 'month'}</span>
                                        {savings > 0 && (
                                            <div className="savings">Save ${savings}/year</div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className="tier-features">
                                {tier.features.map((feature, index) => (
                                    <div key={index} className="feature-item">
                                        <CheckCircle className="feature-check" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="tier-limits">
                                <h5>Usage Limits</h5>
                                <div className="limits-grid">
                                    <span>Calculations: {tier.limits.calculations}</span>
                                    <span>API Calls: {tier.limits.apiCalls}</span>
                                    <span>Portfolios: {tier.limits.portfolios}</span>
                                    <span>Alerts: {tier.limits.alerts}</span>
                                </div>
                            </div>

                            <button
                                className={`tier-button ${isCurrentPlan ? 'current-plan' : ''}`}
                                style={{
                                    background: isCurrentPlan ? '#6B7280' : tier.color,
                                    color: isCurrentPlan ? '#FFFFFF' : tier.id === 'free' ? '#001F3F' : '#FFFFFF'
                                }}
                                onClick={() => isCurrentPlan ? null : onUpgrade(tier.id)}
                                disabled={isCurrentPlan}
                            >
                                {isCurrentPlan ? 'Current Plan' : tier.id === 'enterprise' ? 'Contact Sales' : 'Upgrade Now'}
                                {!isCurrentPlan && <ArrowRight className="button-arrow" />}
                            </button>
                        </div>
                    );
                })}
            </div>

            {showROICalculator && (
                <div className="roi-calculator">
                    <h4>📊 ROI Calculator</h4>
                    <p>See how TimeVault Premium pays for itself</p>

                    <div className="roi-inputs">
                        <div className="input-group">
                            <label>Monthly Portfolio Value</label>
                            <input
                                type="number"
                                value={roiInputs.monthlyPortfolioValue}
                                onChange={(e) => setROIInputs(prev => ({
                                    ...prev,
                                    monthlyPortfolioValue: Number(e.target.value)
                                }))}
                            />
                        </div>
                        <div className="input-group">
                            <label>Trades per Month</label>
                            <input
                                type="number"
                                value={roiInputs.tradingFrequency}
                                onChange={(e) => setROIInputs(prev => ({
                                    ...prev,
                                    tradingFrequency: Number(e.target.value)
                                }))}
                            />
                        </div>
                        <div className="input-group">
                            <label>Average Profit per Trade (%)</label>
                            <input
                                type="number"
                                step="0.1"
                                value={roiInputs.averageProfit}
                                onChange={(e) => setROIInputs(prev => ({
                                    ...prev,
                                    averageProfit: Number(e.target.value)
                                }))}
                            />
                        </div>
                    </div>

                    <div className="roi-results">
                        {(() => {
                            const results = calculateROI();
                            return (
                                <div className="results-grid">
                                    <div className="result-item">
                                        <span className="result-label">Monthly Profit</span>
                                        <span className="result-value">${results.monthlyProfit.toLocaleString()}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Annual Profit</span>
                                        <span className="result-value">${results.annualProfit.toLocaleString()}</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Subscription Cost</span>
                                        <span className="result-value">${results.subscriptionCost}</span>
                                    </div>
                                    <div className="result-item highlight">
                                        <span className="result-label">ROI</span>
                                        <span className="result-value">{results.roi.toFixed(0)}%</span>
                                    </div>
                                    <div className="result-item">
                                        <span className="result-label">Payback Period</span>
                                        <span className="result-value">{results.paybackPeriod.toFixed(1)} months</span>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                </div>
            )}

            <button
                className="roi-toggle"
                onClick={() => setShowROICalculator(!showROICalculator)}
            >
                {showROICalculator ? 'Hide' : 'Show'} ROI Calculator
            </button>
        </div>
    );

    const AffiliateTab = () => (
        <div className="affiliate-tab">
            <h3>💰 Affiliate Partner Program</h3>
            <p>Earn substantial commissions by referring customers to TimeVault</p>

            <div className="affiliate-stats">
                <div className="stat-card">
                    <Users className="stat-icon" />
                    <div>
                        <span className="stat-value">{userMetrics.totalReferrals}</span>
                        <span className="stat-label">Total Referrals</span>
                    </div>
                </div>
                <div className="stat-card">
                    <DollarSign className="stat-icon" />
                    <div>
                        <span className="stat-value">${userMetrics.monthlyRevenue}</span>
                        <span className="stat-label">Monthly Revenue</span>
                    </div>
                </div>
                <div className="stat-card">
                    <TrendingUp className="stat-icon" />
                    <div>
                        <span className="stat-value">${userMetrics.lifetimeValue}</span>
                        <span className="stat-label">Lifetime Value</span>
                    </div>
                </div>
            </div>

            <div className="affiliate-programs">
                {AFFILIATE_PROGRAMS.map(program => (
                    <div key={program.tier} className="affiliate-card">
                        <div className="program-header">
                            <h4>{program.tier} Partner</h4>
                            <div className="commission-rate">
                                {program.commission}% Commission
                            </div>
                        </div>

                        <div className="program-details">
                            <div className="benefits-section">
                                <h5>Benefits</h5>
                                <ul>
                                    {program.benefits.map((benefit, index) => (
                                        <li key={index}>
                                            <CheckCircle className="benefit-check" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="requirements-section">
                                <h5>Requirements</h5>
                                <ul>
                                    {program.requirements.map((requirement, index) => (
                                        <li key={index}>
                                            <Target className="requirement-icon" />
                                            {requirement}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <button
                            className="join-program-btn"
                            onClick={() => onAffiliateJoin(program.tier)}
                        >
                            Join {program.tier} Program
                            <ArrowRight className="button-arrow" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="affiliate-calculator">
                <h4>🚀 Earnings Potential Calculator</h4>
                <div className="calculator-grid">
                    <div className="calc-input">
                        <label>Referrals per Month</label>
                        <input type="number" defaultValue="5" />
                    </div>
                    <div className="calc-input">
                        <label>Average Plan Value</label>
                        <select defaultValue="79">
                            <option value="29">Pro - $29/month</option>
                            <option value="79">Premium - $79/month</option>
                            <option value="299">Enterprise - $299/month</option>
                        </select>
                    </div>
                    <div className="calc-result">
                        <span className="calc-label">Potential Monthly Earnings</span>
                        <span className="calc-value">$1,185</span>
                    </div>
                    <div className="calc-result">
                        <span className="calc-label">Annual Potential</span>
                        <span className="calc-value">$14,220</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const RevenueTab = () => (
        <div className="revenue-tab">
            <h3>📈 Revenue Streams Overview</h3>
            <p>Diversified monetization strategy for sustainable growth</p>

            <div className="revenue-summary">
                <div className="summary-card total">
                    <div className="summary-header">
                        <DollarSign className="summary-icon" />
                        <h4>Total Monthly Revenue</h4>
                    </div>
                    <div className="summary-values">
                        <span className="current">${REVENUE_STREAMS.reduce((sum, stream) => sum + stream.currentRevenue, 0).toLocaleString()}</span>
                        <span className="projected">${REVENUE_STREAMS.reduce((sum, stream) => sum + stream.projectedRevenue, 0).toLocaleString()} projected</span>
                    </div>
                </div>
            </div>

            <div className="revenue-streams">
                {REVENUE_STREAMS.map(stream => (
                    <div key={stream.name} className="stream-card">
                        <div className="stream-header">
                            <h4>{stream.name}</h4>
                            <div className="stream-growth">
                                <TrendingUp className="growth-icon" />
                                +{stream.growth.toFixed(1)}%
                            </div>
                        </div>

                        <div className="stream-revenue">
                            <div className="revenue-bar">
                                <div className="current-bar" style={{ width: '100%' }} />
                                <div className="projected-bar" style={{
                                    width: `${(stream.projectedRevenue / stream.currentRevenue) * 100}%`,
                                    transform: 'translateX(-100%)'
                                }} />
                            </div>
                            <div className="revenue-values">
                                <span className="current">${stream.currentRevenue.toLocaleString()}</span>
                                <span className="projected">${stream.projectedRevenue.toLocaleString()}</span>
                            </div>
                        </div>

                        <p className="stream-description">{stream.description}</p>

                        <button className="stream-action">
                            {stream.action}
                            <ArrowRight className="action-arrow" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="scaling-projections">
                <h4>🎯 5-Year Scaling Projections</h4>
                <div className="projections-grid">
                    <div className="projection-item">
                        <span className="projection-year">Year 1</span>
                        <span className="projection-value">$900K ARR</span>
                    </div>
                    <div className="projection-item">
                        <span className="projection-year">Year 2</span>
                        <span className="projection-value">$2.1M ARR</span>
                    </div>
                    <div className="projection-item">
                        <span className="projection-year">Year 3</span>
                        <span className="projection-value">$5.8M ARR</span>
                    </div>
                    <div className="projection-item">
                        <span className="projection-year">Year 4</span>
                        <span className="projection-value">$12.5M ARR</span>
                    </div>
                    <div className="projection-item">
                        <span className="projection-year">Year 5</span>
                        <span className="projection-value">$25M ARR</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const EnterpriseTab = () => (
        <div className="enterprise-tab">
            <h3>🏢 Enterprise Solutions</h3>
            <p>White-label licensing and custom enterprise deployments</p>

            <div className="enterprise-features">
                <div className="feature-category">
                    <h4>🛡️ Security & Compliance</h4>
                    <ul>
                        <li>SOC 2 Type II certification</li>
                        <li>GDPR & CCPA compliance</li>
                        <li>End-to-end encryption</li>
                        <li>SSO integration (SAML, OAuth)</li>
                        <li>Role-based access control</li>
                        <li>Audit trails & logging</li>
                    </ul>
                </div>

                <div className="feature-category">
                    <h4>🔧 Customization & Integration</h4>
                    <ul>
                        <li>Custom branding & white-labeling</li>
                        <li>API-first architecture</li>
                        <li>Webhook integrations</li>
                        <li>Custom data connectors</li>
                        <li>Embedded widgets</li>
                        <li>Multi-tenant architecture</li>
                    </ul>
                </div>

                <div className="feature-category">
                    <h4>📊 Analytics & Reporting</h4>
                    <ul>
                        <li>Custom dashboards</li>
                        <li>Real-time analytics</li>
                        <li>Automated reporting</li>
                        <li>Data export capabilities</li>
                        <li>Usage analytics</li>
                        <li>ROI tracking</li>
                    </ul>
                </div>

                <div className="feature-category">
                    <h4>🤝 Support & Services</h4>
                    <ul>
                        <li>Dedicated account manager</li>
                        <li>24/7 priority support</li>
                        <li>Custom training programs</li>
                        <li>Implementation consulting</li>
                        <li>99.9% SLA guarantee</li>
                        <li>Success metrics tracking</li>
                    </ul>
                </div>
            </div>

            <div className="enterprise-cta">
                <h4>Ready to scale with TimeVault?</h4>
                <p>Join industry leaders who trust TimeVault for their investment infrastructure</p>
                <div className="cta-buttons">
                    <button className="demo-btn">
                        Schedule Demo
                        <Rocket className="btn-icon" />
                    </button>
                    <button className="quote-btn">
                        Get Custom Quote
                        <Shield className="btn-icon" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="advanced-monetization-engine">
            <div className="engine-header">
                <Crown className="header-icon" />
                <h2>Advanced Monetization</h2>
                <div className="revenue-indicator">
                    <span className="revenue-value">${(userMetrics.monthlyRevenue * 12).toLocaleString()}</span>
                    <span className="revenue-label">Annual Revenue</span>
                </div>
            </div>

            <div className="monetization-navigation">
                {[
                    { id: 'pricing', label: 'Pricing Plans', icon: <Crown /> },
                    { id: 'affiliate', label: 'Affiliate Program', icon: <Users /> },
                    { id: 'revenue', label: 'Revenue Streams', icon: <TrendingUp /> },
                    { id: 'enterprise', label: 'Enterprise', icon: <Briefcase /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`nav-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id as any)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="monetization-content">
                {activeTab === 'pricing' && PricingTab()}
                {activeTab === 'affiliate' && AffiliateTab()}
                {activeTab === 'revenue' && RevenueTab()}
                {activeTab === 'enterprise' && EnterpriseTab()}
            </div>

            <style jsx>{`
        .advanced-monetization-engine {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          color: #FFFFFF;
        }

        .engine-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
        }

        .engine-header h2 {
          flex: 1;
          color: #D4AF37;
          margin: 0;
        }

        .revenue-indicator {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .revenue-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10B981;
        }

        .revenue-label {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .monetization-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
          overflow-x: auto;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #C0C0C0;
          padding: 1rem 1.5rem;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          position: relative;
        }

        .nav-button.active {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
        }

        .nav-button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #D4AF37;
        }

        .pricing-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .pricing-header h3 {
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .pricing-header p {
          color: #C0C0C0;
          margin-bottom: 2rem;
        }

        .billing-toggle {
          display: flex;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 0.25rem;
          justify-content: center;
          max-width: 300px;
          margin: 0 auto;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #C0C0C0;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .toggle-btn.active {
          background: #D4AF37;
          color: #001F3F;
        }

        .savings-badge {
          background: #10B981;
          color: #FFFFFF;
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          margin-left: 0.5rem;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .pricing-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid;
          border-radius: 16px;
          padding: 2rem;
          position: relative;
          transition: all 0.3s ease;
        }

        .pricing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .pricing-card.popular {
          transform: scale(1.05);
          border-color: #D4AF37;
        }

        .pricing-card.enterprise {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
        }

        .pricing-card.current {
          border-color: #6B7280;
          background: rgba(107, 114, 128, 0.1);
        }

        .popular-badge,
        .enterprise-badge {
          position: absolute;
          top: -1rem;
          left: 50%;
          transform: translateX(-50%);
          background: #D4AF37;
          color: #001F3F;
          padding: 0.5rem 1.5rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .enterprise-badge {
          background: #10B981;
          color: #FFFFFF;
        }

        .tier-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .tier-icon-container {
          width: 4rem;
          height: 4rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .tier-icon {
          width: 2rem;
          height: 2rem;
          color: #FFFFFF;
        }

        .tier-header h4 {
          margin: 0 0 0.5rem 0;
          color: #FFFFFF;
          font-size: 1.5rem;
        }

        .custom-pricing {
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .tier-pricing {
          text-align: center;
          margin-bottom: 2rem;
        }

        .price {
          font-size: 3rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .period {
          color: #C0C0C0;
          font-size: 1rem;
        }

        .savings {
          background: #10B981;
          color: #FFFFFF;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          margin-top: 0.5rem;
          display: inline-block;
        }

        .enterprise-pricing .contact-sales {
          font-size: 1.5rem;
          font-weight: 600;
          color: #10B981;
        }

        .tier-features {
          margin-bottom: 2rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .feature-check {
          width: 1.25rem;
          height: 1.25rem;
          color: #10B981;
          flex-shrink: 0;
        }

        .tier-limits {
          margin-bottom: 2rem;
        }

        .tier-limits h5 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .limits-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .tier-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tier-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .tier-button:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .button-arrow {
          width: 1.25rem;
          height: 1.25rem;
        }

        .roi-calculator {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .roi-calculator h4 {
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .roi-inputs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .input-group input {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #FFFFFF;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .roi-results {
          background: rgba(212, 175, 55, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .result-item {
          display: flex;
          flex-direction: column;
          text-align: center;
        }

        .result-item.highlight {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 8px;
          padding: 1rem;
        }

        .result-label {
          color: #C0C0C0;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .result-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .result-item.highlight .result-value {
          color: #10B981;
        }

        .roi-toggle {
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          margin-top: 1rem;
        }

        .affiliate-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .stat-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
          flex-shrink: 0;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .affiliate-programs {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .affiliate-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 2rem;
        }

        .program-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .program-header h4 {
          margin: 0;
          color: #FFFFFF;
        }

        .commission-rate {
          background: #10B981;
          color: #FFFFFF;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .program-details {
          margin-bottom: 2rem;
        }

        .benefits-section,
        .requirements-section {
          margin-bottom: 1.5rem;
        }

        .benefits-section h5,
        .requirements-section h5 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .benefits-section ul,
        .requirements-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .benefits-section li,
        .requirements-section li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
          color: #C0C0C0;
        }

        .benefit-check {
          width: 1rem;
          height: 1rem;
          color: #10B981;
          flex-shrink: 0;
        }

        .requirement-icon {
          width: 1rem;
          height: 1rem;
          color: #F59E0B;
          flex-shrink: 0;
        }

        .join-program-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: #D4AF37;
          color: #001F3F;
          border: none;
          padding: 1rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .join-program-btn:hover {
          background: #B8941F;
          transform: translateY(-2px);
        }

        .affiliate-calculator {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
        }

        .affiliate-calculator h4 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .calculator-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          align-items: end;
        }

        .calc-input {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .calc-input label {
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .calc-input input,
        .calc-input select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #FFFFFF;
          padding: 0.75rem;
          border-radius: 8px;
        }

        .calc-result {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(16, 185, 129, 0.2);
          padding: 1rem;
          border-radius: 8px;
        }

        .calc-label {
          color: #C0C0C0;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .calc-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #10B981;
        }

        .revenue-summary {
          margin-bottom: 2rem;
        }

        .summary-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
        }

        .summary-card.total {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(212, 175, 55, 0.1));
          border: 2px solid #10B981;
        }

        .summary-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .summary-icon {
          width: 2rem;
          height: 2rem;
          color: #10B981;
        }

        .summary-header h4 {
          margin: 0;
          color: #FFFFFF;
        }

        .summary-values {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .summary-values .current {
          font-size: 3rem;
          font-weight: 700;
          color: #10B981;
        }

        .summary-values .projected {
          font-size: 1.25rem;
          color: #C0C0C0;
        }

        .revenue-streams {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stream-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 2rem;
        }

        .stream-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .stream-header h4 {
          margin: 0;
          color: #FFFFFF;
        }

        .stream-growth {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #10B981;
          font-weight: 600;
        }

        .growth-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .stream-revenue {
          margin-bottom: 1rem;
        }

        .revenue-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          margin-bottom: 0.5rem;
        }

        .current-bar {
          height: 100%;
          background: #10B981;
        }

        .projected-bar {
          height: 100%;
          background: #D4AF37;
          position: absolute;
          top: 0;
          left: 0;
        }

        .revenue-values {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .revenue-values .current {
          color: #10B981;
          font-weight: 600;
        }

        .revenue-values .projected {
          color: #D4AF37;
          font-weight: 600;
        }

        .stream-description {
          color: #C0C0C0;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .stream-action {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .stream-action:hover {
          background: rgba(212, 175, 55, 0.3);
        }

        .action-arrow {
          width: 1rem;
          height: 1rem;
        }

        .scaling-projections {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
        }

        .scaling-projections h4 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .projections-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .projection-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .projection-year {
          color: #C0C0C0;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .projection-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10B981;
        }

        .enterprise-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .feature-category {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
        }

        .feature-category h4 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .feature-category ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .feature-category li {
          color: #C0C0C0;
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
          position: relative;
        }

        .feature-category li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: #10B981;
          font-weight: bold;
        }

        .enterprise-cta {
          text-align: center;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(212, 175, 55, 0.1));
          border: 2px solid #10B981;
          border-radius: 16px;
          padding: 3rem;
        }

        .enterprise-cta h4 {
          color: #FFFFFF;
          font-size: 2rem;
          margin-bottom: 1rem;
        }

        .enterprise-cta p {
          color: #C0C0C0;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }

        .cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .demo-btn,
        .quote-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .demo-btn {
          background: #10B981;
          color: #FFFFFF;
        }

        .quote-btn {
          background: rgba(212, 175, 55, 0.2);
          border: 2px solid #D4AF37;
          color: #D4AF37;
        }

        .demo-btn:hover,
        .quote-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        }

        .btn-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @media (max-width: 768px) {
          .advanced-monetization-engine {
            padding: 1rem;
            margin: 1rem 0;
          }

          .engine-header {
            flex-direction: column;
            text-align: center;
          }

          .monetization-navigation {
            flex-direction: column;
          }

          .pricing-grid {
            grid-template-columns: 1fr;
          }

          .pricing-card.popular {
            transform: none;
          }

          .affiliate-programs {
            grid-template-columns: 1fr;
          }

          .calculator-grid {
            grid-template-columns: 1fr;
          }

          .enterprise-features {
            grid-template-columns: 1fr;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .projections-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
        </div>
    );
};

export default AdvancedMonetizationEngine;
