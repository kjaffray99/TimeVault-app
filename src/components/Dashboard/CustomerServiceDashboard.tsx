/**
 * Customer Service Dashboard Component
 * 
 * Real-time customer experience monitoring and support management
 * Helps customer service teams provide proactive support
 */

import React, { useEffect, useState } from 'react';
import { CustomerExperienceService } from '../../services/customerExperience';
import type { CustomerExperienceMetrics, SupportTicket } from '../../types';
import './CustomerServiceDashboard.css';

interface DashboardData {
    metrics: CustomerExperienceMetrics;
    activeTickets: SupportTicket[];
    recentFeedback: any[];
    topFrictionPoints: Array<{ issue: string; count: number }>;
    performanceTrends: any;
}

export const CustomerServiceDashboard: React.FC = () => {
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
    const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

    useEffect(() => {
        fetchDashboardData();

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchDashboardData, 30000);
        setRefreshInterval(interval);

        return () => {
            if (refreshInterval) clearInterval(refreshInterval);
        };
    }, [selectedTimeframe]);

    const fetchDashboardData = async () => {
        try {
            const data = CustomerExperienceService.getCustomerServiceDashboard();
            setDashboardData(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setLoading(false);
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 90) return 'excellent';
        if (score >= 75) return 'good';
        if (score >= 60) return 'fair';
        return 'poor';
    };

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case 'critical': return 'critical';
            case 'high': return 'high';
            case 'medium': return 'medium';
            default: return 'low';
        }
    };

    if (loading) {
        return (
            <div className="cs-dashboard cs-dashboard--loading">
                <div className="cs-loading">
                    <div className="cs-loading__spinner"></div>
                    <p>Loading customer service dashboard...</p>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="cs-dashboard cs-dashboard--error">
                <div className="cs-error">
                    <h3>Failed to load dashboard</h3>
                    <button onClick={fetchDashboardData} className="cs-button cs-button--primary">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { metrics, activeTickets, recentFeedback, topFrictionPoints, performanceTrends } = dashboardData;

    return (
        <div className="cs-dashboard">
            <header className="cs-dashboard__header">
                <h1>Customer Service Dashboard</h1>
                <div className="cs-dashboard__controls">
                    <select
                        value={selectedTimeframe}
                        onChange={(e) => setSelectedTimeframe(e.target.value as any)}
                        className="cs-select"
                    >
                        <option value="1h">Last Hour</option>
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                    </select>
                    <button onClick={fetchDashboardData} className="cs-button cs-button--secondary">
                        🔄 Refresh
                    </button>
                </div>
            </header>

            {/* Key Metrics */}
            <section className="cs-metrics-grid">
                <div className={`cs-metric-card cs-metric-card--${getScoreColor(metrics.overallScore)}`}>
                    <h3>Overall Score</h3>
                    <div className="cs-metric-value">{metrics.overallScore}/100</div>
                    <div className="cs-metric-label">Customer Satisfaction</div>
                </div>

                <div className={`cs-metric-card cs-metric-card--${getScoreColor(metrics.npsScore + 50)}`}>
                    <h3>NPS Score</h3>
                    <div className="cs-metric-value">{metrics.npsScore}</div>
                    <div className="cs-metric-label">Net Promoter Score</div>
                </div>

                <div className={`cs-metric-card cs-metric-card--${getScoreColor(metrics.averageRating * 20)}`}>
                    <h3>Avg Rating</h3>
                    <div className="cs-metric-value">{metrics.averageRating}/5</div>
                    <div className="cs-metric-label">⭐ User Ratings</div>
                </div>

                <div className={`cs-metric-card cs-metric-card--${getScoreColor(metrics.responseTimeScore)}`}>
                    <h3>Performance</h3>
                    <div className="cs-metric-value">{metrics.responseTimeScore}/100</div>
                    <div className="cs-metric-label">Response Time Score</div>
                </div>

                <div className={`cs-metric-card cs-metric-card--${getScoreColor(metrics.engagementScore)}`}>
                    <h3>Engagement</h3>
                    <div className="cs-metric-value">{metrics.engagementScore}/100</div>
                    <div className="cs-metric-label">User Engagement Score</div>
                </div>

                <div className="cs-metric-card">
                    <h3>Active Issues</h3>
                    <div className="cs-metric-value">{activeTickets.length}</div>
                    <div className="cs-metric-label">Support Tickets</div>
                </div>
            </section>

            {/* Active Support Tickets */}
            <section className="cs-section">
                <h2>Active Support Tickets</h2>
                <div className="cs-tickets">
                    {activeTickets.length === 0 ? (
                        <div className="cs-empty-state">
                            <p>✅ No active support tickets - Great job!</p>
                        </div>
                    ) : (
                        <div className="cs-tickets-list">
                            {activeTickets.slice(0, 10).map((ticket) => (
                                <div key={ticket.id} className={`cs-ticket cs-ticket--${getPriorityColor(ticket.priority)}`}>
                                    <div className="cs-ticket__header">
                                        <span className="cs-ticket__id">#{ticket.id.slice(-6)}</span>
                                        <span className={`cs-ticket__priority cs-priority--${ticket.priority}`}>
                                            {ticket.priority.toUpperCase()}
                                        </span>
                                        <span className="cs-ticket__type">{ticket.type}</span>
                                    </div>
                                    <h4 className="cs-ticket__title">{ticket.title}</h4>
                                    <p className="cs-ticket__description">{ticket.description}</p>
                                    <div className="cs-ticket__meta">
                                        <span>User: {ticket.userId.slice(0, 8)}...</span>
                                        <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                                    </div>
                                    {ticket.suggestedActions && ticket.suggestedActions.length > 0 && (
                                        <div className="cs-ticket__actions">
                                            <strong>Suggested Actions:</strong>
                                            <ul>
                                                {ticket.suggestedActions.map((action, index) => (
                                                    <li key={index}>{action}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Top Friction Points */}
            <section className="cs-section">
                <h2>Top Friction Points</h2>
                <div className="cs-friction-points">
                    {topFrictionPoints.length === 0 ? (
                        <div className="cs-empty-state">
                            <p>✅ No major friction points detected</p>
                        </div>
                    ) : (
                        <div className="cs-friction-list">
                            {topFrictionPoints.map((friction, index) => (
                                <div key={friction.issue} className="cs-friction-item">
                                    <div className="cs-friction-rank">#{index + 1}</div>
                                    <div className="cs-friction-details">
                                        <h4>{friction.issue.replace(/_/g, ' ').toUpperCase()}</h4>
                                        <p>{friction.count} occurrences</p>
                                    </div>
                                    <div className="cs-friction-count">{friction.count}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Recent Feedback */}
            <section className="cs-section">
                <h2>Recent Feedback</h2>
                <div className="cs-feedback">
                    {recentFeedback.length === 0 ? (
                        <div className="cs-empty-state">
                            <p>No recent feedback received</p>
                        </div>
                    ) : (
                        <div className="cs-feedback-list">
                            {recentFeedback.map((feedback, index) => (
                                <div key={index} className={`cs-feedback-item cs-feedback-item--rating-${feedback.rating || 0}`}>
                                    <div className="cs-feedback-header">
                                        <div className="cs-feedback-rating">
                                            {'⭐'.repeat(feedback.rating || 0)}
                                            <span className="cs-feedback-rating-num">({feedback.rating || 0}/5)</span>
                                        </div>
                                        <span className="cs-feedback-time">
                                            {new Date(feedback.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    {feedback.comment && (
                                        <p className="cs-feedback-comment">"{feedback.comment}"</p>
                                    )}
                                    <div className="cs-feedback-meta">
                                        <span>User: {feedback.userId.slice(0, 8)}...</span>
                                        {feedback.feature && <span>Feature: {feedback.feature}</span>}
                                        {feedback.category && <span>Category: {feedback.category}</span>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Recommended Actions */}
            {metrics.recommendedActions.length > 0 && (
                <section className="cs-section">
                    <h2>Recommended Actions</h2>
                    <div className="cs-recommendations">
                        {metrics.recommendedActions.map((action, index) => (
                            <div key={index} className="cs-recommendation">
                                <div className="cs-recommendation__icon">💡</div>
                                <p>{action}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Performance Trends */}
            <section className="cs-section">
                <h2>Performance Trends</h2>
                <div className="cs-trends">
                    <div className="cs-trend">
                        <h4>Response Times</h4>
                        <span className={`cs-trend-indicator cs-trend-indicator--${performanceTrends.responseTimesTrend}`}>
                            {performanceTrends.responseTimesTrend === 'improving' ? '📈' :
                                performanceTrends.responseTimesTrend === 'declining' ? '📉' : '➡️'}
                            {performanceTrends.responseTimesTrend}
                        </span>
                    </div>
                    <div className="cs-trend">
                        <h4>Error Rate</h4>
                        <span className={`cs-trend-indicator cs-trend-indicator--${performanceTrends.errorRateTrend}`}>
                            {performanceTrends.errorRateTrend === 'improving' ? '📈' :
                                performanceTrends.errorRateTrend === 'declining' ? '📉' : '➡️'}
                            {performanceTrends.errorRateTrend}
                        </span>
                    </div>
                    <div className="cs-trend">
                        <h4>Satisfaction</h4>
                        <span className={`cs-trend-indicator cs-trend-indicator--${performanceTrends.satisfactionTrend}`}>
                            {performanceTrends.satisfactionTrend === 'improving' ? '📈' :
                                performanceTrends.satisfactionTrend === 'declining' ? '📉' : '➡️'}
                            {performanceTrends.satisfactionTrend}
                        </span>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CustomerServiceDashboard;
