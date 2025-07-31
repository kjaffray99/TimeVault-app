/**
 * Real-Time Performance Monitor
 * Advanced monitoring system for instant revenue optimization feedback
 * Tracks conversions, user behavior, and performance metrics in real-time
 */

import {
    Activity,
    AlertCircle,
    BarChart3,
    CheckCircle,
    Clock,
    DollarSign,
    Eye,
    Monitor,
    MousePointer,
    Smartphone,
    Target,
    TrendingUp,
    Users,
    Zap
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface RealTimeMetric {
    id: string;
    name: string;
    value: number;
    previousValue: number;
    change: number;
    changeType: 'increase' | 'decrease' | 'neutral';
    unit: string;
    target?: number;
    critical?: boolean;
}

interface UserActivity {
    timestamp: number;
    userId: string;
    action: string;
    page: string;
    value?: number;
    device: 'desktop' | 'mobile' | 'tablet';
    location: string;
}

interface ConversionEvent {
    timestamp: number;
    type: 'signup' | 'premium' | 'share' | 'referral';
    value: number;
    source: string;
    userId: string;
}

interface PerformanceAlert {
    id: string;
    type: 'warning' | 'error' | 'success';
    message: string;
    timestamp: number;
    metric: string;
    threshold: number;
    currentValue: number;
}

const RealTimePerformanceMonitor: React.FC = () => {
    const [metrics, setMetrics] = useState<RealTimeMetric[]>([
        {
            id: 'revenue',
            name: 'Revenue Today',
            value: 456.78,
            previousValue: 423.12,
            change: 7.9,
            changeType: 'increase',
            unit: '$',
            target: 500,
            critical: true
        },
        {
            id: 'conversions',
            name: 'Conversions',
            value: 12,
            previousValue: 9,
            change: 33.3,
            changeType: 'increase',
            unit: '',
            target: 15,
            critical: true
        },
        {
            id: 'conversion_rate',
            name: 'Conversion Rate',
            value: 6.8,
            previousValue: 5.2,
            change: 1.6,
            changeType: 'increase',
            unit: '%',
            target: 8.0
        },
        {
            id: 'active_users',
            name: 'Active Users',
            value: 247,
            previousValue: 231,
            change: 6.9,
            changeType: 'increase',
            unit: '',
            target: 300
        },
        {
            id: 'page_views',
            name: 'Page Views',
            value: 1847,
            previousValue: 1692,
            change: 9.2,
            changeType: 'increase',
            unit: '',
            target: 2000
        },
        {
            id: 'avg_session',
            name: 'Avg Session Time',
            value: 4.7,
            previousValue: 4.2,
            change: 11.9,
            changeType: 'increase',
            unit: 'min'
        },
        {
            id: 'bounce_rate',
            name: 'Bounce Rate',
            value: 23.4,
            previousValue: 28.1,
            change: -4.7,
            changeType: 'decrease',
            unit: '%'
        },
        {
            id: 'mobile_users',
            name: 'Mobile Users',
            value: 68.3,
            previousValue: 65.8,
            change: 2.5,
            changeType: 'increase',
            unit: '%'
        }
    ]);

    const [recentActivity, setRecentActivity] = useState<UserActivity[]>([
        {
            timestamp: Date.now() - 30000,
            userId: 'user_789',
            action: 'Premium Signup',
            page: '/premium',
            value: 39.99,
            device: 'desktop',
            location: 'San Francisco, CA'
        },
        {
            timestamp: Date.now() - 45000,
            userId: 'user_456',
            action: 'Calculator Usage',
            page: '/calculator',
            device: 'mobile',
            location: 'New York, NY'
        },
        {
            timestamp: Date.now() - 67000,
            userId: 'user_123',
            action: 'Quiz Completed',
            page: '/dashboard',
            value: 25,
            device: 'tablet',
            location: 'London, UK'
        },
        {
            timestamp: Date.now() - 89000,
            userId: 'user_321',
            action: 'Social Share',
            page: '/viral',
            value: 15,
            device: 'mobile',
            location: 'Toronto, CA'
        }
    ]);

    const [conversions, setConversions] = useState<ConversionEvent[]>([
        {
            timestamp: Date.now() - 120000,
            type: 'premium',
            value: 39.99,
            source: 'direct',
            userId: 'user_789'
        },
        {
            timestamp: Date.now() - 180000,
            type: 'referral',
            value: 25.00,
            source: 'viral_share',
            userId: 'user_654'
        },
        {
            timestamp: Date.now() - 240000,
            type: 'signup',
            value: 0,
            source: 'organic',
            userId: 'user_987'
        }
    ]);

    const [alerts, setAlerts] = useState<PerformanceAlert[]>([
        {
            id: 'conv_rate_good',
            type: 'success',
            message: 'Conversion rate exceeded target of 6%!',
            timestamp: Date.now() - 300000,
            metric: 'conversion_rate',
            threshold: 6.0,
            currentValue: 6.8
        },
        {
            id: 'revenue_warning',
            type: 'warning',
            message: 'Revenue growth slowing - implement urgency tactics',
            timestamp: Date.now() - 600000,
            metric: 'revenue',
            threshold: 500,
            currentValue: 456.78
        }
    ]);

    const [isLive, setIsLive] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(Date.now());

    // Simulate real-time updates
    useEffect(() => {
        if (!isLive) return;

        const interval = setInterval(() => {
            updateMetrics();
            addNewActivity();
            checkForAlerts();
            setLastUpdate(Date.now());
        }, 5000); // Update every 5 seconds

        return () => clearInterval(interval);
    }, [isLive]);

    const updateMetrics = useCallback(() => {
        setMetrics(prev => prev.map(metric => {
            const variance = Math.random() * 0.1 - 0.05; // ±5% variance
            const newValue = Math.max(0, metric.value * (1 + variance));
            const change = ((newValue - metric.previousValue) / metric.previousValue) * 100;

            return {
                ...metric,
                previousValue: metric.value,
                value: parseFloat(newValue.toFixed(2)),
                change: parseFloat(change.toFixed(1)),
                changeType: change > 0 ? 'increase' : change < 0 ? 'decrease' : 'neutral'
            };
        }));
    }, []);

    const addNewActivity = useCallback(() => {
        const actions = [
            'Page View', 'Calculator Usage', 'Quiz Started', 'Premium View',
            'Social Share', 'Referral Click', 'Quiz Completed', 'Premium Signup'
        ];
        const pages = ['/calculator', '/dashboard', '/premium', '/viral', '/quiz'];
        const devices: ('desktop' | 'mobile' | 'tablet')[] = ['desktop', 'mobile', 'tablet'];
        const locations = ['New York, NY', 'San Francisco, CA', 'London, UK', 'Toronto, CA', 'Berlin, DE'];

        if (Math.random() > 0.7) { // 30% chance of new activity
            const newActivity: UserActivity = {
                timestamp: Date.now(),
                userId: `user_${Math.floor(Math.random() * 1000)}`,
                action: actions[Math.floor(Math.random() * actions.length)],
                page: pages[Math.floor(Math.random() * pages.length)],
                value: Math.random() > 0.7 ? Math.floor(Math.random() * 50) + 10 : undefined,
                device: devices[Math.floor(Math.random() * devices.length)],
                location: locations[Math.floor(Math.random() * locations.length)]
            };

            setRecentActivity(prev => [newActivity, ...prev.slice(0, 9)]);

            // Maybe add conversion
            if (newActivity.action === 'Premium Signup' && Math.random() > 0.5) {
                const newConversion: ConversionEvent = {
                    timestamp: Date.now(),
                    type: 'premium',
                    value: 39.99,
                    source: 'organic',
                    userId: newActivity.userId
                };
                setConversions(prev => [newConversion, ...prev.slice(0, 9)]);
            }
        }
    }, []);

    const checkForAlerts = useCallback(() => {
        metrics.forEach(metric => {
            if (metric.target && Math.abs(metric.value - metric.target) / metric.target < 0.1) {
                if (!alerts.find(a => a.metric === metric.id && a.timestamp > Date.now() - 300000)) {
                    const newAlert: PerformanceAlert = {
                        id: `${metric.id}_${Date.now()}`,
                        type: metric.value >= metric.target ? 'success' : 'warning',
                        message: metric.value >= metric.target
                            ? `${metric.name} exceeded target!`
                            : `${metric.name} approaching target`,
                        timestamp: Date.now(),
                        metric: metric.id,
                        threshold: metric.target,
                        currentValue: metric.value
                    };
                    setAlerts(prev => [newAlert, ...prev.slice(0, 4)]);
                }
            }
        });
    }, [metrics, alerts]);

    const formatValue = (value: number, unit: string) => {
        if (unit === '$') {
            return `$${value.toFixed(2)}`;
        } else if (unit === '%') {
            return `${value.toFixed(1)}%`;
        } else if (unit === 'min') {
            return `${value.toFixed(1)}m`;
        }
        return value.toString();
    };

    const getChangeColor = (changeType: string) => {
        switch (changeType) {
            case 'increase': return 'text-green-600';
            case 'decrease': return 'text-red-600';
            default: return 'text-gray-600';
        }
    };

    const getChangeIcon = (changeType: string) => {
        switch (changeType) {
            case 'increase': return '↗️';
            case 'decrease': return '↘️';
            default: return '➡️';
        }
    };

    const getDeviceIcon = (device: string) => {
        switch (device) {
            case 'mobile': return <Smartphone className="w-4 h-4" />;
            case 'tablet': return <Smartphone className="w-4 h-4" />;
            default: return <Monitor className="w-4 h-4" />;
        }
    };

    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
            default: return <AlertCircle className="w-5 h-5 text-gray-600" />;
        }
    };

    const timeAgo = (timestamp: number) => {
        const seconds = Math.floor((Date.now() - timestamp) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        return `${hours}h ago`;
    };

    return (
        <div className="performance-monitor">
            {/* Header */}
            <div className="monitor-header">
                <div className="header-content">
                    <h1 className="monitor-title">
                        <Activity className="w-8 h-8 text-[#D4AF37]" />
                        Real-Time Performance Monitor
                    </h1>
                    <div className="header-controls">
                        <div className="live-indicator">
                            <div className={`live-dot ${isLive ? 'active' : 'inactive'}`}></div>
                            <span>LIVE</span>
                            <button
                                onClick={() => setIsLive(!isLive)}
                                className="live-toggle"
                            >
                                {isLive ? 'Pause' : 'Resume'}
                            </button>
                        </div>
                        <div className="last-update">
                            <Clock className="w-4 h-4" />
                            {new Date(lastUpdate).toLocaleTimeString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Alerts */}
            {alerts.length > 0 && (
                <div className="alerts-section">
                    <h2 className="section-title">Performance Alerts</h2>
                    <div className="alerts-container">
                        {alerts.map(alert => (
                            <div key={alert.id} className={`alert-item ${alert.type}`}>
                                {getAlertIcon(alert.type)}
                                <div className="alert-content">
                                    <span className="alert-message">{alert.message}</span>
                                    <span className="alert-time">{timeAgo(alert.timestamp)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Real-Time Metrics Grid */}
            <div className="metrics-section">
                <h2 className="section-title">Live Metrics Dashboard</h2>
                <div className="metrics-grid">
                    {metrics.map(metric => (
                        <div key={metric.id} className={`metric-card ${metric.critical ? 'critical' : ''}`}>
                            <div className="metric-header">
                                <span className="metric-name">{metric.name}</span>
                                {metric.critical && <Zap className="w-4 h-4 text-[#D4AF37]" />}
                            </div>
                            <div className="metric-value">
                                {formatValue(metric.value, metric.unit)}
                            </div>
                            <div className="metric-change">
                                <span className={`change-value ${getChangeColor(metric.changeType)}`}>
                                    {getChangeIcon(metric.changeType)} {Math.abs(metric.change).toFixed(1)}%
                                </span>
                            </div>
                            {metric.target && (
                                <div className="metric-target">
                                    <div className="target-bar">
                                        <div
                                            className="target-progress"
                                            style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="target-text">
                                        Target: {formatValue(metric.target, metric.unit)}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Live Activity Feed */}
            <div className="activity-section">
                <h2 className="section-title">
                    <Eye className="w-6 h-6" />
                    Live User Activity
                </h2>
                <div className="activity-feed">
                    {recentActivity.map((activity, index) => (
                        <div key={index} className="activity-item">
                            <div className="activity-time">
                                {timeAgo(activity.timestamp)}
                            </div>
                            <div className="activity-details">
                                <div className="activity-action">{activity.action}</div>
                                <div className="activity-meta">
                                    <span className="activity-page">{activity.page}</span>
                                    <span className="activity-device">
                                        {getDeviceIcon(activity.device)}
                                        {activity.device}
                                    </span>
                                    <span className="activity-location">{activity.location}</span>
                                </div>
                            </div>
                            {activity.value && (
                                <div className="activity-value">
                                    +{activity.value} TVLT
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Conversions */}
            <div className="conversions-section">
                <h2 className="section-title">
                    <Target className="w-6 h-6" />
                    Recent Conversions
                </h2>
                <div className="conversions-feed">
                    {conversions.map((conversion, index) => (
                        <div key={index} className="conversion-item">
                            <div className="conversion-icon">
                                {conversion.type === 'premium' && <DollarSign className="w-5 h-5 text-green-600" />}
                                {conversion.type === 'referral' && <Users className="w-5 h-5 text-blue-600" />}
                                {conversion.type === 'signup' && <CheckCircle className="w-5 h-5 text-purple-600" />}
                            </div>
                            <div className="conversion-details">
                                <div className="conversion-type">
                                    {conversion.type.charAt(0).toUpperCase() + conversion.type.slice(1)}
                                </div>
                                <div className="conversion-meta">
                                    <span>{timeAgo(conversion.timestamp)}</span>
                                    <span>{conversion.source}</span>
                                </div>
                            </div>
                            <div className="conversion-value">
                                ${conversion.value.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Stats */}
            <div className="quick-stats">
                <div className="stat-item">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                    <div className="stat-content">
                        <div className="stat-value">94.2%</div>
                        <div className="stat-label">Uptime</div>
                    </div>
                </div>
                <div className="stat-item">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <div className="stat-content">
                        <div className="stat-value">+23.5%</div>
                        <div className="stat-label">Growth</div>
                    </div>
                </div>
                <div className="stat-item">
                    <MousePointer className="w-6 h-6 text-purple-600" />
                    <div className="stat-content">
                        <div className="stat-value">2.3s</div>
                        <div className="stat-label">Load Time</div>
                    </div>
                </div>
                <div className="stat-item">
                    <Users className="w-6 h-6 text-[#D4AF37]" />
                    <div className="stat-content">
                        <div className="stat-value">89</div>
                        <div className="stat-label">Online Now</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RealTimePerformanceMonitor;
