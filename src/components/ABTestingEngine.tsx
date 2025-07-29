/**
 * Advanced A/B Testing & Conversion Optimization Engine
 * Data-driven optimization for maximum revenue conversion
 */

import {
    BarChart3,
    CheckCircle,
    Clock,
    DollarSign,
    Eye, MousePointer,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface ABTestVariant {
    id: string;
    name: string;
    description: string;
    weight: number; // Traffic allocation percentage
    config: {
        premiumPricing?: {
            monthly: number;
            annual: number;
            lifetime: number;
        };
        upsellTiming?: {
            calculationsBeforeTrigger: number;
            quizzesBeforeTrigger: number;
            timeOnSiteBeforeTrigger: number; // minutes
        };
        colorScheme?: {
            primaryColor: string;
            accentColor: string;
            ctaColor: string;
        };
        copyVariations?: {
            heroHeadline: string;
            ctaText: string;
            premiumValueProp: string;
        };
    };
}

interface ConversionMetrics {
    visitors: number;
    premiumViews: number;
    premiumClicks: number;
    payments: number;
    revenue: number;
    conversionRate: number;
    avgOrderValue: number;
}

interface ABTestResults {
    variant: string;
    metrics: ConversionMetrics;
    confidence: number;
    isWinner: boolean;
    improvement: number; // Percentage improvement over control
}

const AB_TEST_VARIANTS: ABTestVariant[] = [
    {
        id: 'control',
        name: 'Original Design',
        description: 'Current TimeVault design and pricing',
        weight: 50,
        config: {
            premiumPricing: {
                monthly: 29,
                annual: 199,
                lifetime: 499
            },
            upsellTiming: {
                calculationsBeforeTrigger: 5,
                quizzesBeforeTrigger: 2,
                timeOnSiteBeforeTrigger: 5
            },
            colorScheme: {
                primaryColor: '#001F3F',
                accentColor: '#D4AF37',
                ctaColor: '#D4AF37'
            },
            copyVariations: {
                heroHeadline: 'Transform Digital Assets Into Time & Precious Metals',
                ctaText: 'Upgrade to Premium',
                premiumValueProp: 'Unlock advanced features and insights'
            }
        }
    },
    {
        id: 'urgency_variant',
        name: 'Urgency & Scarcity',
        description: 'Emphasizes limited-time offers and scarcity',
        weight: 25,
        config: {
            premiumPricing: {
                monthly: 27, // Slight discount
                annual: 179, // Better discount
                lifetime: 449 // Significant discount
            },
            upsellTiming: {
                calculationsBeforeTrigger: 3, // Earlier trigger
                quizzesBeforeTrigger: 1,
                timeOnSiteBeforeTrigger: 3
            },
            colorScheme: {
                primaryColor: '#001F3F',
                accentColor: '#FF6B35', // Urgency orange
                ctaColor: '#FF6B35'
            },
            copyVariations: {
                heroHeadline: '⚡ Limited Time: Transform Your Crypto Into Real Wealth',
                ctaText: 'Claim Your Spot Now',
                premiumValueProp: 'Only 100 premium spots left this month!'
            }
        }
    },
    {
        id: 'value_variant',
        name: 'Value-Focused',
        description: 'Emphasizes ROI and financial benefits',
        weight: 25,
        config: {
            premiumPricing: {
                monthly: 39, // Higher price, more value
                annual: 299,
                lifetime: 699
            },
            upsellTiming: {
                calculationsBeforeTrigger: 7, // Later trigger after value demo
                quizzesBeforeTrigger: 3,
                timeOnSiteBeforeTrigger: 8
            },
            colorScheme: {
                primaryColor: '#001F3F',
                accentColor: '#10B981', // Success green
                ctaColor: '#10B981'
            },
            copyVariations: {
                heroHeadline: '💰 Join 12,847 Investors Maximizing Portfolio ROI',
                ctaText: 'Start Earning More',
                premiumValueProp: 'Premium users average 34% higher returns'
            }
        }
    }
];

export const ABTestingEngine: React.FC<{
    onVariantAssigned: (variant: ABTestVariant) => void;
    onConversionEvent: (event: string, value?: number) => void;
}> = ({ onVariantAssigned, onConversionEvent }) => {
    const [currentVariant, setCurrentVariant] = useState<ABTestVariant | null>(null);
    const [testResults, setTestResults] = useState<ABTestResults[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [testDuration, setTestDuration] = useState(0); // Days running
    const [showResultsDashboard, setShowResultsDashboard] = useState(false);

    // Mock metrics - in production, these would come from analytics
    const [mockMetrics, setMockMetrics] = useState<{ [key: string]: ConversionMetrics }>({
        control: {
            visitors: 1240,
            premiumViews: 186,
            premiumClicks: 74,
            payments: 9,
            revenue: 1479,
            conversionRate: 0.73,
            avgOrderValue: 164
        },
        urgency_variant: {
            visitors: 620,
            premiumViews: 111,
            premiumClicks: 58,
            payments: 8,
            revenue: 1392,
            conversionRate: 1.29,
            avgOrderValue: 174
        },
        value_variant: {
            visitors: 620,
            premiumViews: 87,
            premiumClicks: 31,
            payments: 6,
            revenue: 1794,
            conversionRate: 0.97,
            avgOrderValue: 299
        }
    });

    // Assign user to variant based on weighted distribution
    const assignVariant = useCallback(() => {
        const userId = localStorage.getItem('timevault_user_id') || Math.random().toString(36);
        localStorage.setItem('timevault_user_id', userId);

        // Use hash of user ID for consistent assignment
        const hash = userId.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);

        const normalizedHash = Math.abs(hash) % 100;
        let cumulativeWeight = 0;

        for (const variant of AB_TEST_VARIANTS) {
            cumulativeWeight += variant.weight;
            if (normalizedHash < cumulativeWeight) {
                setCurrentVariant(variant);
                onVariantAssigned(variant);

                // Track variant assignment
                onConversionEvent('variant_assigned', 0);
                console.log(`🧪 A/B Test: User assigned to variant "${variant.name}"`);
                return variant;
            }
        }

        // Fallback to control
        const control = AB_TEST_VARIANTS[0];
        setCurrentVariant(control);
        onVariantAssigned(control);
        return control;
    }, [onVariantAssigned, onConversionEvent]);

    // Calculate test results and statistical significance
    const calculateResults = useCallback(() => {
        setIsAnalyzing(true);

        setTimeout(() => {
            const control = mockMetrics.control;
            const results: ABTestResults[] = Object.entries(mockMetrics).map(([variantId, metrics]) => {
                const isControl = variantId === 'control';
                const improvement = isControl ? 0 :
                    ((metrics.conversionRate - control.conversionRate) / control.conversionRate) * 100;

                // Simplified confidence calculation (in production, use proper statistical tests)
                const confidence = isControl ? 100 : Math.min(95, Math.abs(improvement) * 10 + 60);

                return {
                    variant: variantId,
                    metrics,
                    confidence,
                    isWinner: !isControl && improvement > 20 && confidence > 85,
                    improvement
                };
            });

            setTestResults(results);
            setIsAnalyzing(false);
        }, 2000);
    }, [mockMetrics]);

    useEffect(() => {
        // Auto-assign variant on mount
        assignVariant();

        // Simulate test duration
        const duration = Math.floor(Math.random() * 14) + 7; // 7-21 days
        setTestDuration(duration);

        // Calculate initial results
        calculateResults();
    }, [assignVariant, calculateResults]);

    // Update metrics in real-time (simulation)
    useEffect(() => {
        const interval = setInterval(() => {
            setMockMetrics(prev => {
                const updated = { ...prev };
                Object.keys(updated).forEach(variant => {
                    updated[variant] = {
                        ...updated[variant],
                        visitors: updated[variant].visitors + Math.floor(Math.random() * 5),
                        premiumViews: updated[variant].premiumViews + Math.floor(Math.random() * 3),
                        premiumClicks: updated[variant].premiumClicks + Math.floor(Math.random() * 2),
                        payments: updated[variant].payments + (Math.random() > 0.9 ? 1 : 0),
                        revenue: updated[variant].revenue + (Math.random() > 0.9 ? Math.floor(Math.random() * 300) + 100 : 0)
                    };

                    // Recalculate derived metrics
                    updated[variant].conversionRate = (updated[variant].payments / updated[variant].visitors) * 100;
                    updated[variant].avgOrderValue = updated[variant].payments > 0 ?
                        updated[variant].revenue / updated[variant].payments : 0;
                });
                return updated;
            });
        }, 10000); // Update every 10 seconds

        return () => clearInterval(interval);
    }, []);

    const renderVariantConfig = () => {
        if (!currentVariant) return null;

        return (
            <div className="variant-config">
                <h3>🧪 Active A/B Test Variant</h3>
                <div className="variant-info">
                    <div className="variant-header">
                        <h4>{currentVariant.name}</h4>
                        <span className="variant-badge">
                            {currentVariant.weight}% traffic
                        </span>
                    </div>
                    <p>{currentVariant.description}</p>

                    <div className="config-grid">
                        <div className="config-section">
                            <h5>Pricing</h5>
                            <ul>
                                <li>Monthly: ${currentVariant.config.premiumPricing?.monthly}</li>
                                <li>Annual: ${currentVariant.config.premiumPricing?.annual}</li>
                                <li>Lifetime: ${currentVariant.config.premiumPricing?.lifetime}</li>
                            </ul>
                        </div>

                        <div className="config-section">
                            <h5>Triggers</h5>
                            <ul>
                                <li>Calculations: {currentVariant.config.upsellTiming?.calculationsBeforeTrigger}</li>
                                <li>Quizzes: {currentVariant.config.upsellTiming?.quizzesBeforeTrigger}</li>
                                <li>Time: {currentVariant.config.upsellTiming?.timeOnSiteBeforeTrigger}min</li>
                            </ul>
                        </div>

                        <div className="config-section">
                            <h5>Copy</h5>
                            <ul>
                                <li>Headline: "{currentVariant.config.copyVariations?.heroHeadline?.substring(0, 30)}..."</li>
                                <li>CTA: "{currentVariant.config.copyVariations?.ctaText}"</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderResultsDashboard = () => {
        const sortedResults = [...testResults].sort((a, b) => b.improvement - a.improvement);
        const winner = sortedResults.find(r => r.isWinner);

        return (
            <div className="results-dashboard">
                <div className="dashboard-header">
                    <h3>📊 A/B Test Results</h3>
                    <div className="test-stats">
                        <span>Running for {testDuration} days</span>
                        <span>•</span>
                        <span>{Object.values(mockMetrics).reduce((sum, m) => sum + m.visitors, 0)} total visitors</span>
                    </div>
                </div>

                {winner && (
                    <div className="winner-announcement">
                        <CheckCircle className="winner-icon" />
                        <div>
                            <h4>Winner Detected!</h4>
                            <p>
                                Variant "{AB_TEST_VARIANTS.find(v => v.id === winner.variant)?.name}"
                                is outperforming by {winner.improvement.toFixed(1)}%
                                with {winner.confidence.toFixed(0)}% confidence
                            </p>
                        </div>
                    </div>
                )}

                <div className="results-table">
                    {sortedResults.map((result, index) => {
                        const variant = AB_TEST_VARIANTS.find(v => v.id === result.variant);
                        const isControl = result.variant === 'control';

                        return (
                            <div key={result.variant} className={`result-row ${result.isWinner ? 'winner' : ''}`}>
                                <div className="result-header">
                                    <div className="variant-name">
                                        <span className="rank">#{index + 1}</span>
                                        <span>{variant?.name}</span>
                                        {result.isWinner && <Crown className="crown-icon" />}
                                    </div>
                                    <div className="improvement">
                                        {!isControl && (
                                            <span className={`improvement-badge ${result.improvement > 0 ? 'positive' : 'negative'}`}>
                                                {result.improvement > 0 ? '+' : ''}{result.improvement.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="metrics-grid">
                                    <div className="metric">
                                        <Users className="metric-icon" />
                                        <div>
                                            <span className="metric-value">{result.metrics.visitors}</span>
                                            <span className="metric-label">Visitors</span>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <Eye className="metric-icon" />
                                        <div>
                                            <span className="metric-value">{result.metrics.premiumViews}</span>
                                            <span className="metric-label">Premium Views</span>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <MousePointer className="metric-icon" />
                                        <div>
                                            <span className="metric-value">{result.metrics.premiumClicks}</span>
                                            <span className="metric-label">Premium Clicks</span>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <DollarSign className="metric-icon" />
                                        <div>
                                            <span className="metric-value">{result.metrics.payments}</span>
                                            <span className="metric-label">Payments</span>
                                        </div>
                                    </div>

                                    <div className="metric primary">
                                        <Target className="metric-icon" />
                                        <div>
                                            <span className="metric-value">{result.metrics.conversionRate.toFixed(2)}%</span>
                                            <span className="metric-label">Conversion Rate</span>
                                        </div>
                                    </div>

                                    <div className="metric">
                                        <TrendingUp className="metric-icon" />
                                        <div>
                                            <span className="metric-value">${result.metrics.revenue}</span>
                                            <span className="metric-label">Revenue</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="confidence-bar">
                                    <div className="confidence-label">
                                        Confidence: {result.confidence.toFixed(0)}%
                                    </div>
                                    <div className="confidence-progress">
                                        <div
                                            className="confidence-fill"
                                            style={{ width: `${result.confidence}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="action-buttons">
                    <button className="implement-winner" disabled={!winner}>
                        <CheckCircle className="button-icon" />
                        Implement Winning Variant
                    </button>
                    <button className="extend-test">
                        <Clock className="button-icon" />
                        Extend Test Duration
                    </button>
                    <button className="new-test">
                        <Zap className="button-icon" />
                        Start New Test
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="ab-testing-engine">
            <div className="engine-header">
                <BarChart3 className="header-icon" />
                <h2>A/B Testing & Optimization</h2>
                <button
                    className="toggle-results"
                    onClick={() => setShowResultsDashboard(!showResultsDashboard)}
                >
                    {showResultsDashboard ? 'Hide Results' : 'View Results'}
                </button>
            </div>

            {!showResultsDashboard && renderVariantConfig()}
            {showResultsDashboard && renderResultsDashboard()}

            {isAnalyzing && (
                <div className="analyzing-overlay">
                    <div className="analyzing-content">
                        <div className="spinner" />
                        <p>Analyzing test results...</p>
                    </div>
                </div>
            )}

            <style jsx>{`
        .ab-testing-engine {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          position: relative;
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

        .toggle-results {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          padding: 0.75rem 1.5rem;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .toggle-results:hover {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
        }

        .variant-config {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
        }

        .variant-config h3 {
          color: #D4AF37;
          margin-bottom: 1.5rem;
        }

        .variant-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .variant-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        .config-section h5 {
          color: #D4AF37;
          margin-bottom: 0.75rem;
        }

        .config-section ul {
          list-style: none;
          padding: 0;
        }

        .config-section li {
          margin-bottom: 0.5rem;
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .results-dashboard {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h3 {
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .test-stats {
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .winner-announcement {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(16, 185, 129, 0.2);
          border: 2px solid #10B981;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .winner-icon {
          width: 2rem;
          height: 2rem;
          color: #10B981;
          flex-shrink: 0;
        }

        .winner-announcement h4 {
          color: #10B981;
          margin: 0 0 0.5rem 0;
        }

        .winner-announcement p {
          margin: 0;
          color: #C0C0C0;
        }

        .results-table {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .result-row {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .result-row.winner {
          border-color: #10B981;
          background: rgba(16, 185, 129, 0.1);
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .variant-name {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .rank {
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
        }

        .crown-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #FFD700;
        }

        .improvement-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .improvement-badge.positive {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }

        .improvement-badge.negative {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 8px;
        }

        .metric.primary {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .metric-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #D4AF37;
          flex-shrink: 0;
        }

        .metric-value {
          display: block;
          font-weight: 700;
          color: #FFFFFF;
        }

        .metric-label {
          font-size: 0.75rem;
          color: #C0C0C0;
        }

        .confidence-bar {
          margin-top: 1rem;
        }

        .confidence-label {
          font-size: 0.875rem;
          color: #C0C0C0;
          margin-bottom: 0.5rem;
        }

        .confidence-progress {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .confidence-fill {
          height: 100%;
          background: linear-gradient(90deg, #EF4444 0%, #F59E0B 50%, #10B981 100%);
          transition: width 0.5s ease;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-buttons button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .implement-winner {
          background: linear-gradient(135deg, #10B981 0%, #059669 100%);
          color: #FFFFFF;
        }

        .implement-winner:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .extend-test {
          background: rgba(59, 130, 246, 0.8);
          color: #FFFFFF;
        }

        .new-test {
          background: rgba(212, 175, 55, 0.8);
          color: #001F3F;
        }

        .action-buttons button:not(:disabled):hover {
          transform: translateY(-2px);
        }

        .button-icon {
          width: 1rem;
          height: 1rem;
        }

        .analyzing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 31, 63, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 20px;
        }

        .analyzing-content {
          text-align: center;
          color: #FFFFFF;
        }

        .spinner {
          width: 3rem;
          height: 3rem;
          border: 4px solid rgba(212, 175, 55, 0.3);
          border-top: 4px solid #D4AF37;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .ab-testing-engine {
            padding: 1rem;
            margin: 1rem 0;
          }

          .config-grid {
            grid-template-columns: 1fr;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-buttons {
            flex-direction: column;
          }

          .engine-header {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
        </div>
    );
};

export default ABTestingEngine;
