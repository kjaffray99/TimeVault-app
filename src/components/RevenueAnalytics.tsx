/**
 * Revenue Analytics Dashboard - Business Intelligence Component
 * Track conversion metrics and revenue optimization in real-time
 */

import {
    BarChart3,
    Clock,
    DollarSign,
    MousePointer,
    RefreshCw,
    Star,
    Target,
    TrendingUp, Users,
    Zap
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';

interface RevenueMetrics {
    dailyRevenue: number;
    weeklyRevenue: number;
    monthlyRevenue: number;
    conversionRate: number;
    avgOrderValue: number;
    totalUsers: number;
    premiumUsers: number;
    churRate: number;
    ltv: number; // Lifetime Value
}

interface EngagementMetrics {
    dailyActiveUsers: number;
    avgSessionTime: number;
    calculatorUsage: number;
    quizCompletions: number;
    premiumInteractions: number;
    bounceRate: number;
}

interface ConversionFunnel {
    visitors: number;
    calculatorUsers: number;
    quizTakers: number;
    premiumViews: number;
    premiumSignups: number;
    paidConversions: number;
}

const REVENUE_TARGET = 1000; // Week 1 target
const MOCK_REVENUE: RevenueMetrics = {
    dailyRevenue: 147,
    weeklyRevenue: 892,
    monthlyRevenue: 3240,
    conversionRate: 3.4,
    avgOrderValue: 149,
    totalUsers: 1847,
    premiumUsers: 127,
    churRate: 2.1,
    ltv: 425
};

const MOCK_ENGAGEMENT: EngagementMetrics = {
    dailyActiveUsers: 324,
    avgSessionTime: 8.4, // minutes
    calculatorUsage: 89,
    quizCompletions: 67,
    premiumInteractions: 45,
    bounceRate: 23.5
};

const MOCK_FUNNEL: ConversionFunnel = {
    visitors: 2840,
    calculatorUsers: 1960,
    quizTakers: 890,
    premiumViews: 234,
    premiumSignups: 89,
    paidConversions: 23
};

export const RevenueAnalytics: React.FC<{
    isVisible: boolean;
    onOptimizationSuggestion: (suggestion: string) => void;
}> = ({ isVisible, onOptimizationSuggestion }) => {
    const [metrics, setMetrics] = useState<RevenueMetrics>(MOCK_REVENUE);
    const [engagement, setEngagement] = useState<EngagementMetrics>(MOCK_ENGAGEMENT);
    const [funnel, setFunnel] = useState<ConversionFunnel>(MOCK_FUNNEL);
    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Simulate real-time updates
    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(() => {
            // Simulate fluctuating metrics
            setMetrics(prev => ({
                ...prev,
                dailyRevenue: prev.dailyRevenue + (Math.random() - 0.5) * 20,
                conversionRate: Math.max(0, prev.conversionRate + (Math.random() - 0.5) * 0.5)
            }));

            setEngagement(prev => ({
                ...prev,
                dailyActiveUsers: prev.dailyActiveUsers + Math.floor((Math.random() - 0.5) * 10),
                premiumInteractions: prev.premiumInteractions + Math.floor((Math.random() - 0.5) * 3)
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, [autoRefresh]);

    // Calculate optimization opportunities
    const optimizationOpportunities = useMemo(() => {
        const opportunities = [];

        if (funnel.calculatorUsers / funnel.visitors < 0.7) {
            opportunities.push({
                priority: 'high',
                area: 'Calculator CTA',
                impact: '+15% conversion',
                suggestion: 'Improve calculator visibility and value proposition'
            });
        }

        if (funnel.premiumSignups / funnel.premiumViews < 0.4) {
            opportunities.push({
                priority: 'critical',
                area: 'Premium Conversion',
                impact: '+25% revenue',
                suggestion: 'Add urgency and social proof to premium upsell'
            });
        }

        if (engagement.avgSessionTime < 5) {
            opportunities.push({
                priority: 'medium',
                area: 'User Engagement',
                impact: '+20% retention',
                suggestion: 'Implement gamification elements and interactive content'
            });
        }

        return opportunities;
    }, [funnel, engagement]);

    const weeklyProgress = (metrics.weeklyRevenue / REVENUE_TARGET) * 100;

    if (!isVisible) return null;

    return (
        <div className="revenue-analytics">
            {/* Header Controls */}
            <div className="analytics-header">
                <div className="header-left">
                    <BarChart3 className="header-icon" />
                    <h2>Revenue Analytics</h2>
                    <div className="refresh-control">
                        <button
                            className={`refresh-toggle ${autoRefresh ? 'active' : ''}`}
                            onClick={() => setAutoRefresh(!autoRefresh)}
                        >
                            <RefreshCw className={`refresh-icon ${autoRefresh ? 'spinning' : ''}`} />
                            Auto-refresh
                        </button>
                    </div>
                </div>

                <div className="timeframe-selector">
                    {['day', 'week', 'month'].map((period) => (
                        <button
                            key={period}
                            className={`timeframe-btn ${timeframe === period ? 'active' : ''}`}
                            onClick={() => setTimeframe(period as any)}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="metrics-grid">
                <div className="metric-card revenue">
                    <div className="metric-header">
                        <DollarSign className="metric-icon" />
                        <span>Weekly Revenue</span>
                    </div>
                    <div className="metric-value">${metrics.weeklyRevenue.toFixed(0)}</div>
                    <div className="metric-progress">
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${Math.min(100, weeklyProgress)}%` }}
                            />
                        </div>
                        <span className="progress-text">
                            {weeklyProgress.toFixed(1)}% of $1K target
                        </span>
                    </div>
                </div>

                <div className="metric-card conversion">
                    <div className="metric-header">
                        <Target className="metric-icon" />
                        <span>Conversion Rate</span>
                    </div>
                    <div className="metric-value">{metrics.conversionRate.toFixed(1)}%</div>
                    <div className="metric-trend positive">
                        <TrendingUp className="trend-icon" />
                        +0.3% from yesterday
                    </div>
                </div>

                <div className="metric-card users">
                    <div className="metric-header">
                        <Users className="metric-icon" />
                        <span>Premium Users</span>
                    </div>
                    <div className="metric-value">{metrics.premiumUsers}</div>
                    <div className="metric-detail">
                        {((metrics.premiumUsers / metrics.totalUsers) * 100).toFixed(1)}% of total users
                    </div>
                </div>

                <div className="metric-card engagement">
                    <div className="metric-header">
                        <Clock className="metric-icon" />
                        <span>Avg Session Time</span>
                    </div>
                    <div className="metric-value">{engagement.avgSessionTime.toFixed(1)}m</div>
                    <div className="metric-detail">
                        {engagement.calculatorUsage} calculator uses today
                    </div>
                </div>
            </div>

            {/* Conversion Funnel */}
            <div className="funnel-section">
                <h3>Conversion Funnel</h3>
                <div className="funnel-chart">
                    {Object.entries(funnel).map(([stage, value], index) => {
                        const percentage = (value / funnel.visitors) * 100;
                        const stageNames = {
                            visitors: 'Visitors',
                            calculatorUsers: 'Calculator Users',
                            quizTakers: 'Quiz Takers',
                            premiumViews: 'Premium Views',
                            premiumSignups: 'Premium Signups',
                            paidConversions: 'Paid Conversions'
                        };

                        return (
                            <div key={stage} className="funnel-stage">
                                <div className="stage-label">{stageNames[stage as keyof typeof stageNames]}</div>
                                <div
                                    className="stage-bar"
                                    style={{ width: `${percentage}%` }}
                                >
                                    <span className="stage-value">{value}</span>
                                </div>
                                <div className="stage-percentage">{percentage.toFixed(1)}%</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Optimization Opportunities */}
            <div className="optimization-section">
                <h3>Optimization Opportunities</h3>
                <div className="opportunities-list">
                    {optimizationOpportunities.map((opp, index) => (
                        <div key={index} className={`opportunity-card ${opp.priority}`}>
                            <div className="opp-header">
                                <span className={`priority-badge ${opp.priority}`}>
                                    {opp.priority.toUpperCase()}
                                </span>
                                <span className="impact-badge">{opp.impact}</span>
                            </div>
                            <h4>{opp.area}</h4>
                            <p>{opp.suggestion}</p>
                            <button
                                className="implement-btn"
                                onClick={() => onOptimizationSuggestion(opp.suggestion)}
                            >
                                <Zap className="btn-icon" />
                                Implement
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="activity-feed">
                <h3>Live Activity</h3>
                <div className="activity-list">
                    <div className="activity-item">
                        <div className="activity-icon user-signup">
                            <Star className="icon" />
                        </div>
                        <div className="activity-content">
                            <span>New premium signup</span>
                            <span className="activity-time">2 minutes ago</span>
                        </div>
                        <div className="activity-value">+$29</div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon calculator-use">
                            <MousePointer className="icon" />
                        </div>
                        <div className="activity-content">
                            <span>Calculator conversion: BTC → Gold</span>
                            <span className="activity-time">5 minutes ago</span>
                        </div>
                    </div>

                    <div className="activity-item">
                        <div className="activity-icon quiz-complete">
                            <Target className="icon" />
                        </div>
                        <div className="activity-content">
                            <span>Quiz completed with 85% score</span>
                            <span className="activity-time">8 minutes ago</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .revenue-analytics {
          background: rgba(0, 31, 63, 0.95);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: 2rem;
          color: #FFFFFF;
          max-width: 1400px;
          margin: 1rem auto;
        }

        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
        }

        .refresh-control {
          margin-left: 1rem;
        }

        .refresh-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          padding: 0.5rem 1rem;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-toggle.active {
          background: rgba(212, 175, 55, 0.2);
          border-color: #D4AF37;
        }

        .refresh-icon {
          width: 1rem;
          height: 1rem;
        }

        .spinning {
          animation: spin 2s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .timeframe-selector {
          display: flex;
          gap: 0.5rem;
        }

        .timeframe-btn {
          padding: 0.5rem 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: capitalize;
        }

        .timeframe-btn.active {
          background: #D4AF37;
          color: #001F3F;
          border-color: #D4AF37;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          border-color: #D4AF37;
          box-shadow: 0 8px 24px rgba(212, 175, 55, 0.2);
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
          color: #C0C0C0;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .metric-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .revenue .metric-icon { color: #10B981; }
        .conversion .metric-icon { color: #3B82F6; }
        .users .metric-icon { color: #8B5CF6; }
        .engagement .metric-icon { color: #F59E0B; }

        .metric-value {
          font-size: 2.5rem;
          font-weight: 800;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .metric-progress {
          margin-top: 1rem;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #10B981 0%, #059669 100%);
          transition: width 0.5s ease;
        }

        .progress-text {
          font-size: 0.75rem;
          color: #C0C0C0;
        }

        .metric-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .metric-trend.positive {
          color: #10B981;
        }

        .trend-icon {
          width: 1rem;
          height: 1rem;
        }

        .metric-detail {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .funnel-section,
        .optimization-section,
        .activity-feed {
          margin-bottom: 2rem;
        }

        .funnel-section h3,
        .optimization-section h3,
        .activity-feed h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
          font-size: 1.25rem;
        }

        .funnel-chart {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .funnel-stage {
          display: grid;
          grid-template-columns: 150px 1fr 80px;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 0.75rem 0;
        }

        .stage-label {
          font-weight: 600;
          color: #C0C0C0;
        }

        .stage-bar {
          height: 32px;
          background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #001F3F;
          font-weight: 700;
          min-width: 60px;
        }

        .stage-percentage {
          text-align: right;
          font-weight: 600;
          color: #D4AF37;
        }

        .opportunities-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }

        .opportunity-card {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
          border-left: 4px solid;
        }

        .opportunity-card.critical {
          border-left-color: #EF4444;
        }

        .opportunity-card.high {
          border-left-color: #F59E0B;
        }

        .opportunity-card.medium {
          border-left-color: #3B82F6;
        }

        .opp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .priority-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .priority-badge.critical {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
        }

        .priority-badge.high {
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
        }

        .priority-badge.medium {
          background: rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }

        .impact-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .opportunity-card h4 {
          margin-bottom: 0.5rem;
          color: #FFFFFF;
        }

        .opportunity-card p {
          color: #C0C0C0;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .implement-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          color: #001F3F;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .implement-btn:hover {
          transform: translateY(-2px);
        }

        .btn-icon {
          width: 1rem;
          height: 1rem;
        }

        .activity-feed {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon.user-signup {
          background: rgba(16, 185, 129, 0.2);
        }

        .activity-icon.calculator-use {
          background: rgba(59, 130, 246, 0.2);
        }

        .activity-icon.quiz-complete {
          background: rgba(245, 158, 11, 0.2);
        }

        .activity-icon .icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #FFFFFF;
        }

        .activity-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .activity-content span:first-child {
          font-weight: 600;
          color: #FFFFFF;
        }

        .activity-time {
          font-size: 0.75rem;
          color: #C0C0C0;
        }

        .activity-value {
          font-weight: 700;
          color: #10B981;
          font-size: 1.125rem;
        }

        @media (max-width: 768px) {
          .revenue-analytics {
            padding: 1rem;
            margin: 0.5rem;
          }

          .analytics-header {
            flex-direction: column;
            align-items: stretch;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .funnel-stage {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }

          .opportunities-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default RevenueAnalytics;
