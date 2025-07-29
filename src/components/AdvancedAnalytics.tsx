/**
 * Advanced Analytics & Conversion Metrics Dashboard
 * Real-time analytics, user behavior tracking, revenue optimization
 */

import {
    AlertTriangle, CheckCircle,
    Clock,
    DollarSign,
    Download,
    Eye,
    RefreshCw,
    Target,
    TrendingDown,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import {
    Area, AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

interface AnalyticsData {
    revenue: {
        daily: number[];
        weekly: number[];
        monthly: number[];
        total: number;
        growth: number;
    };
    users: {
        total: number;
        active: number;
        new: number;
        retention: number;
        churn: number;
    };
    conversions: {
        calculationToQuiz: number;
        quizToPremium: number;
        visitToSignup: number;
        signupToPurchase: number;
        overall: number;
    };
    engagement: {
        avgSessionTime: number;
        pageViews: number;
        bounceRate: number;
        ctrs: { [key: string]: number };
    };
    performance: {
        loadTime: number;
        errorRate: number;
        uptime: number;
    };
}

interface ConversionFunnel {
    stage: string;
    users: number;
    conversion: number;
    dropoff: number;
    revenue: number;
}

interface UserSegment {
    name: string;
    count: number;
    value: number;
    growth: number;
    color: string;
}

const MOCK_ANALYTICS: AnalyticsData = {
    revenue: {
        daily: [125, 180, 220, 195, 310, 275, 425],
        weekly: [1200, 1450, 1680, 1890, 2150],
        monthly: [4500, 5200, 6100, 7800, 9200],
        total: 32800,
        growth: 23.5
    },
    users: {
        total: 12847,
        active: 8934,
        new: 1205,
        retention: 76.3,
        churn: 8.2
    },
    conversions: {
        calculationToQuiz: 34.2,
        quizToPremium: 18.7,
        visitToSignup: 12.4,
        signupToPurchase: 28.9,
        overall: 3.6
    },
    engagement: {
        avgSessionTime: 847,
        pageViews: 45623,
        bounceRate: 32.1,
        ctrs: {
            'Premium CTA': 8.7,
            'Quiz Start': 23.4,
            'Share Button': 15.2,
            'Referral Link': 6.8
        }
    },
    performance: {
        loadTime: 1.2,
        errorRate: 0.8,
        uptime: 99.94
    }
};

const CONVERSION_FUNNEL: ConversionFunnel[] = [
    { stage: 'Visitors', users: 10000, conversion: 100, dropoff: 0, revenue: 0 },
    { stage: 'Calculator Users', users: 7200, conversion: 72, dropoff: 28, revenue: 0 },
    { stage: 'Quiz Takers', users: 2460, conversion: 34.2, dropoff: 65.8, revenue: 0 },
    { stage: 'Signups', users: 888, conversion: 12.4, dropoff: 87.6, revenue: 0 },
    { stage: 'Premium Users', users: 257, conversion: 28.9, dropoff: 71.1, revenue: 12850 },
    { stage: 'Referrers', users: 89, conversion: 34.6, dropoff: 65.4, revenue: 4450 }
];

const USER_SEGMENTS: UserSegment[] = [
    { name: 'Premium Users', count: 257, value: 12850, growth: 34.2, color: '#D4AF37' },
    { name: 'Active Free', count: 2460, value: 0, growth: 18.7, color: '#4F46E5' },
    { name: 'Quiz Completers', count: 1890, value: 0, growth: 22.1, color: '#10B981' },
    { name: 'Calculator Only', count: 4750, value: 0, growth: 8.3, color: '#F59E0B' },
    { name: 'Inactive', count: 3490, value: 0, growth: -12.4, color: '#EF4444' }
];

export const AdvancedAnalytics: React.FC<{
    timeRange: '7d' | '30d' | '90d';
    onExportData: (data: any) => void;
    onAlertTriggered: (alert: any) => void;
}> = ({ timeRange, onExportData, onAlertTriggered }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'users' | 'conversion' | 'performance'>('overview');
    const [data, setData] = useState<AnalyticsData>(MOCK_ANALYTICS);
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        segment: 'all',
        source: 'all',
        device: 'all'
    });

    // Generate time-series data based on range
    const chartData = useMemo(() => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        return Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));

            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: Math.floor(Math.random() * 200) + 150,
                users: Math.floor(Math.random() * 500) + 200,
                conversions: Math.random() * 5 + 2,
                engagement: Math.random() * 300 + 600
            };
        });
    }, [timeRange]);

    const refreshData = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Add some variance to simulate real-time updates
        setData(prev => ({
            ...prev,
            revenue: {
                ...prev.revenue,
                total: prev.revenue.total + Math.floor(Math.random() * 500),
                growth: prev.revenue.growth + (Math.random() - 0.5) * 2
            },
            users: {
                ...prev.users,
                active: prev.users.active + Math.floor(Math.random() * 50),
                new: Math.floor(Math.random() * 100) + 50
            }
        }));

        setIsLoading(false);
    };

    const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
    const formatNumber = (value: number) => value.toLocaleString();
    const formatPercent = (value: number) => `${value.toFixed(1)}%`;
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const MetricCard: React.FC<{
        title: string;
        value: string;
        change: number;
        icon: React.ReactNode;
        color?: string;
    }> = ({ title, value, change, icon, color = '#D4AF37' }) => (
        <div className="metric-card">
            <div className="metric-header">
                <span className="metric-icon" style={{ color }}>{icon}</span>
                <span className="metric-title">{title}</span>
            </div>
            <div className="metric-value">{value}</div>
            <div className={`metric-change ${change >= 0 ? 'positive' : 'negative'}`}>
                {change >= 0 ? <TrendingUp className="trend-icon" /> : <TrendingDown className="trend-icon" />}
                {formatPercent(Math.abs(change))} vs last {timeRange}
            </div>
        </div>
    );

    const renderOverviewTab = () => (
        <div className="overview-tab">
            <div className="metrics-grid">
                <MetricCard
                    title="Total Revenue"
                    value={formatCurrency(data.revenue.total)}
                    change={data.revenue.growth}
                    icon={<DollarSign />}
                    color="#10B981"
                />
                <MetricCard
                    title="Active Users"
                    value={formatNumber(data.users.active)}
                    change={15.3}
                    icon={<Users />}
                    color="#4F46E5"
                />
                <MetricCard
                    title="Conversion Rate"
                    value={formatPercent(data.conversions.overall)}
                    change={8.7}
                    icon={<Target />}
                    color="#F59E0B"
                />
                <MetricCard
                    title="Avg Session Time"
                    value={formatTime(data.engagement.avgSessionTime)}
                    change={12.1}
                    icon={<Clock />}
                    color="#EF4444"
                />
            </div>

            <div className="charts-grid">
                <div className="chart-container">
                    <h3>Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="#C0C0C0" />
                            <YAxis stroke="#C0C0C0" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,31,63,0.9)',
                                    border: '1px solid #D4AF37',
                                    borderRadius: '8px'
                                }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="rgba(16,185,129,0.2)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-container">
                    <h3>User Growth</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="date" stroke="#C0C0C0" />
                            <YAxis stroke="#C0C0C0" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0,31,63,0.9)',
                                    border: '1px solid #D4AF37',
                                    borderRadius: '8px'
                                }}
                            />
                            <Line type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="user-segments">
                <h3>User Segments</h3>
                <div className="segments-grid">
                    {USER_SEGMENTS.map(segment => (
                        <div key={segment.name} className="segment-card">
                            <div className="segment-header">
                                <div
                                    className="segment-indicator"
                                    style={{ backgroundColor: segment.color }}
                                />
                                <span className="segment-name">{segment.name}</span>
                            </div>
                            <div className="segment-metrics">
                                <span className="segment-count">{formatNumber(segment.count)}</span>
                                {segment.value > 0 && (
                                    <span className="segment-value">{formatCurrency(segment.value)}</span>
                                )}
                                <span className={`segment-growth ${segment.growth >= 0 ? 'positive' : 'negative'}`}>
                                    {segment.growth >= 0 ? '+' : ''}{formatPercent(segment.growth)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderConversionTab = () => (
        <div className="conversion-tab">
            <h3>Conversion Funnel Analysis</h3>

            <div className="funnel-container">
                {CONVERSION_FUNNEL.map((stage, index) => (
                    <div key={stage.stage} className="funnel-stage">
                        <div className="stage-info">
                            <h4>{stage.stage}</h4>
                            <span className="stage-users">{formatNumber(stage.users)} users</span>
                            {stage.revenue > 0 && (
                                <span className="stage-revenue">{formatCurrency(stage.revenue)}</span>
                            )}
                        </div>
                        <div className="stage-metrics">
                            <div className="conversion-rate">
                                {formatPercent(stage.conversion)} conversion
                            </div>
                            {index > 0 && (
                                <div className="dropoff-rate">
                                    {formatPercent(stage.dropoff)} drop-off
                                </div>
                            )}
                        </div>
                        {index < CONVERSION_FUNNEL.length - 1 && (
                            <div className="funnel-arrow">↓</div>
                        )}
                    </div>
                ))}
            </div>

            <div className="conversion-chart">
                <h4>Conversion Rates by Stage</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={CONVERSION_FUNNEL.slice(1)}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="stage" stroke="#C0C0C0" />
                        <YAxis stroke="#C0C0C0" />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(0,31,63,0.9)',
                                border: '1px solid #D4AF37',
                                borderRadius: '8px'
                            }}
                        />
                        <Bar dataKey="conversion" fill="#D4AF37" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="optimization-insights">
                <h4>🚀 Optimization Opportunities</h4>
                <div className="insights-grid">
                    <div className="insight-card high-priority">
                        <AlertTriangle className="insight-icon" />
                        <div>
                            <h5>High Quiz Drop-off</h5>
                            <p>65.8% of calculator users don't take the quiz. Consider adding incentives or simplifying the transition.</p>
                            <span className="potential-impact">Potential +$2,400/month</span>
                        </div>
                    </div>
                    <div className="insight-card medium-priority">
                        <Target className="insight-icon" />
                        <div>
                            <h5>Signup Conversion</h5>
                            <p>12.4% visitor-to-signup rate is below industry average (15-20%). A/B test landing page variations.</p>
                            <span className="potential-impact">Potential +$1,800/month</span>
                        </div>
                    </div>
                    <div className="insight-card low-priority">
                        <CheckCircle className="insight-icon" />
                        <div>
                            <h5>Premium Conversion</h5>
                            <p>28.9% signup-to-premium rate is excellent! Consider raising prices or adding more premium tiers.</p>
                            <span className="potential-impact">Potential +$3,200/month</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPerformanceTab = () => (
        <div className="performance-tab">
            <h3>System Performance & Health</h3>

            <div className="performance-metrics">
                <div className="perf-card">
                    <Zap className="perf-icon" />
                    <div>
                        <span className="perf-label">Load Time</span>
                        <span className="perf-value">{data.performance.loadTime}s</span>
                        <span className="perf-status good">Good</span>
                    </div>
                </div>
                <div className="perf-card">
                    <AlertTriangle className="perf-icon" />
                    <div>
                        <span className="perf-label">Error Rate</span>
                        <span className="perf-value">{data.performance.errorRate}%</span>
                        <span className="perf-status excellent">Excellent</span>
                    </div>
                </div>
                <div className="perf-card">
                    <CheckCircle className="perf-icon" />
                    <div>
                        <span className="perf-label">Uptime</span>
                        <span className="perf-value">{data.performance.uptime}%</span>
                        <span className="perf-status excellent">Excellent</span>
                    </div>
                </div>
            </div>

            <div className="performance-chart">
                <h4>Response Time Trends</h4>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                        <XAxis dataKey="date" stroke="#C0C0C0" />
                        <YAxis stroke="#C0C0C0" />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(0,31,63,0.9)',
                                border: '1px solid #D4AF37',
                                borderRadius: '8px'
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="engagement"
                            stroke="#D4AF37"
                            strokeWidth={2}
                            name="Response Time (ms)"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );

    return (
        <div className="advanced-analytics">
            <div className="analytics-header">
                <div className="header-left">
                    <BarChart className="header-icon" />
                    <h2>Advanced Analytics</h2>
                    <span className="data-freshness">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>

                <div className="header-controls">
                    <select
                        value={timeRange}
                        onChange={(e) => {/* timeRange change handled by parent */ }}
                        className="time-selector"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>

                    <button
                        onClick={refreshData}
                        className="refresh-btn"
                        disabled={isLoading}
                    >
                        <RefreshCw className={`refresh-icon ${isLoading ? 'spinning' : ''}`} />
                        Refresh
                    </button>

                    <button
                        onClick={() => onExportData(data)}
                        className="export-btn"
                    >
                        <Download className="export-icon" />
                        Export
                    </button>
                </div>
            </div>

            <div className="analytics-navigation">
                {[
                    { id: 'overview', label: 'Overview', icon: <Eye /> },
                    { id: 'revenue', label: 'Revenue', icon: <DollarSign /> },
                    { id: 'users', label: 'Users', icon: <Users /> },
                    { id: 'conversion', label: 'Conversion', icon: <Target /> },
                    { id: 'performance', label: 'Performance', icon: <Zap /> }
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

            <div className="analytics-content">
                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'conversion' && renderConversionTab()}
                {activeTab === 'performance' && renderPerformanceTab()}
                {/* Revenue and Users tabs would be implemented similarly */}
            </div>

            <style jsx>{`
        .advanced-analytics {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          color: #FFFFFF;
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

        .analytics-header h2 {
          margin: 0;
          color: #D4AF37;
        }

        .data-freshness {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .header-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
        }

        .time-selector {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          color: #FFFFFF;
          padding: 0.5rem 1rem;
          border-radius: 8px;
        }

        .refresh-btn,
        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover,
        .export-btn:hover {
          background: rgba(212, 175, 55, 0.3);
        }

        .refresh-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-icon,
        .export-icon {
          width: 1rem;
          height: 1rem;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .analytics-navigation {
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

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .metric-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .metric-icon {
          width: 1.5rem;
          height: 1.5rem;
        }

        .metric-title {
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .metric-change {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
        }

        .metric-change.positive {
          color: #10B981;
        }

        .metric-change.negative {
          color: #EF4444;
        }

        .trend-icon {
          width: 1rem;
          height: 1rem;
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .chart-container {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .chart-container h3 {
          margin: 0 0 1rem 0;
          color: #D4AF37;
        }

        .user-segments {
          margin-top: 2rem;
        }

        .user-segments h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .segments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .segment-card {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
        }

        .segment-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .segment-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .segment-name {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .segment-metrics {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .segment-count {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .segment-value {
          font-size: 0.875rem;
          color: #10B981;
        }

        .segment-growth.positive {
          color: #10B981;
        }

        .segment-growth.negative {
          color: #EF4444;
        }

        .funnel-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .funnel-stage {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          position: relative;
        }

        .stage-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .stage-info h4 {
          margin: 0;
          color: #FFFFFF;
        }

        .stage-users {
          color: #C0C0C0;
        }

        .stage-revenue {
          color: #10B981;
          font-weight: 600;
        }

        .stage-metrics {
          display: flex;
          gap: 1rem;
        }

        .conversion-rate {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .dropoff-rate {
          background: rgba(239, 68, 68, 0.2);
          color: #EF4444;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
        }

        .funnel-arrow {
          position: absolute;
          bottom: -1rem;
          left: 50%;
          transform: translateX(-50%);
          color: #D4AF37;
          font-size: 1.5rem;
        }

        .optimization-insights {
          margin-top: 2rem;
        }

        .optimization-insights h4 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .insights-grid {
          display: grid;
          gap: 1rem;
        }

        .insight-card {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-left: 4px solid;
          border-radius: 8px;
          padding: 1.5rem;
        }

        .insight-card.high-priority {
          border-left-color: #EF4444;
        }

        .insight-card.medium-priority {
          border-left-color: #F59E0B;
        }

        .insight-card.low-priority {
          border-left-color: #10B981;
        }

        .insight-icon {
          width: 1.5rem;
          height: 1.5rem;
          flex-shrink: 0;
          margin-top: 0.25rem;
        }

        .insight-card h5 {
          margin: 0 0 0.5rem 0;
          color: #FFFFFF;
        }

        .insight-card p {
          margin: 0 0 0.5rem 0;
          color: #C0C0C0;
          line-height: 1.4;
        }

        .potential-impact {
          color: #10B981;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .performance-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .perf-card {
          display: flex;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .perf-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
          flex-shrink: 0;
        }

        .perf-label {
          display: block;
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .perf-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin: 0.25rem 0;
        }

        .perf-status {
          font-size: 0.75rem;
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          font-weight: 600;
        }

        .perf-status.excellent {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }

        .perf-status.good {
          background: rgba(245, 158, 11, 0.2);
          color: #F59E0B;
        }

        @media (max-width: 768px) {
          .advanced-analytics {
            padding: 1rem;
            margin: 1rem 0;
          }

          .analytics-header {
            flex-direction: column;
            text-align: center;
          }

          .header-controls {
            flex-wrap: wrap;
            justify-content: center;
          }

          .analytics-navigation {
            flex-direction: column;
          }

          .metrics-grid {
            grid-template-columns: 1fr;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .segments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
        </div>
    );
};

export default AdvancedAnalytics;
