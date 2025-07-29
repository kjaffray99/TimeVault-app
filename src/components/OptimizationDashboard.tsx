/**
 * Real-time Optimization Dashboard
 */
import React, { useEffect, useState } from 'react';

interface OptimizationData {
    totalVisitors: number;
    conversions: number;
    conversionRate: number;
    revenueToday: number;
    topPerformingVariants: Array<{
        test: string;
        variant: string;
        improvement: string;
    }>;
    conversionBlockers: Array<{
        step: string;
        dropOff: string;
        priority: string;
    }>;
}

export const OptimizationDashboard: React.FC = () => {
    const [optimizationData, setOptimizationData] = useState<OptimizationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading optimization data
        setTimeout(() => {
            setOptimizationData({
                totalVisitors: 1247,
                conversions: 43,
                conversionRate: 3.45,
                revenueToday: 429.57,
                topPerformingVariants: [
                    { test: 'CTA Color', variant: 'Gold', improvement: '+28%' },
                    { test: 'Pricing Display', variant: 'Annual Focus', improvement: '+15%' },
                    { test: 'Onboarding Flow', variant: 'Gamified', improvement: '+22%' }
                ],
                conversionBlockers: [
                    { step: 'Premium Interest', dropOff: '68%', priority: 'High' },
                    { step: 'Payment Process', dropOff: '45%', priority: 'Medium' }
                ]
            });
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return <div className="loading">Loading optimization data...</div>;
    }

    if (!optimizationData) {
        return <div className="error">Failed to load optimization data</div>;
    }

    return (
        <div className="optimization-dashboard">
            <h2>🎯 Real-time Optimization Dashboard</h2>

            <div className="metrics-grid">
                <div className="metric-card">
                    <div className="metric-value">{optimizationData.totalVisitors}</div>
                    <div className="metric-label">Today's Visitors</div>
                </div>

                <div className="metric-card">
                    <div className="metric-value">{optimizationData.conversions}</div>
                    <div className="metric-label">Conversions</div>
                </div>

                <div className="metric-card">
                    <div className="metric-value">{optimizationData.conversionRate}%</div>
                    <div className="metric-label">Conversion Rate</div>
                </div>

                <div className="metric-card">
                    <div className="metric-value">${optimizationData.revenueToday}</div>
                    <div className="metric-label">Revenue Today</div>
                </div>
            </div>

            <div className="optimization-sections">
                <div className="winning-variants">
                    <h3>🏆 Top Performing Variants</h3>
                    {optimizationData.topPerformingVariants.map((variant, index) => (
                        <div key={index} className="variant-item">
                            <span className="test-name">{variant.test}</span>
                            <span className="variant-name">{variant.variant}</span>
                            <span className="improvement">{variant.improvement}</span>
                        </div>
                    ))}
                </div>

                <div className="conversion-blockers">
                    <h3>🚫 Conversion Blockers</h3>
                    {optimizationData.conversionBlockers.map((blocker, index) => (
                        <div key={index} className="blocker-item">
                            <span className="blocker-step">{blocker.step}</span>
                            <span className="drop-off-rate">{blocker.dropOff} drop-off</span>
                            <span className={`priority ${blocker.priority.toLowerCase()}`}>{blocker.priority}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .optimization-dashboard {
          background: linear-gradient(135deg, #001F3F 0%, #1a365d 100%);
          padding: 2rem;
          border-radius: 16px;
          color: #FFFFFF;
          max-width: 1200px;
          margin: 0 auto;
        }

        .optimization-dashboard h2 {
          text-align: center;
          color: #D4AF37;
          margin-bottom: 2rem;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          text-align: center;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #D4AF37;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          color: #FFFFFF;
          opacity: 0.8;
        }

        .optimization-sections {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .winning-variants,
        .conversion-blockers {
          background: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .winning-variants h3,
        .conversion-blockers h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .variant-item,
        .blocker-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .improvement {
          color: #10B981;
          font-weight: bold;
        }

        .drop-off-rate {
          color: #EF4444;
          font-weight: bold;
        }

        .priority.high {
          color: #EF4444;
          font-weight: bold;
        }

        .priority.medium {
          color: #F59E0B;
          font-weight: bold;
        }

        .priority.low {
          color: #10B981;
          font-weight: bold;
        }

        .loading,
        .error {
          text-align: center;
          padding: 4rem;
          color: #D4AF37;
          font-size: 1.2rem;
        }

        @media (max-width: 768px) {
          .optimization-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};
