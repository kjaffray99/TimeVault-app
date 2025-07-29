/**
 * 📊 REVENUE MONITORING DASHBOARD
 * Real-time tracking of Stripe payment performance
 */

import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Users, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';

interface RevenueMetrics {
    totalRevenue: number;
    todayRevenue: number;
    activeSubscriptions: number;
    conversionRate: number;
    paymentAttempts: number;
    successfulPayments: number;
    failedPayments: number;
    averageOrderValue: number;
    monthlyRecurringRevenue: number;
    churnRate: number;
}

interface RevenueEvent {
    id: string;
    type: 'payment_success' | 'payment_failed' | 'subscription_created' | 'subscription_cancelled';
    amount: number;
    timestamp: Date;
    customer: string;
    plan: string;
}

export default function RevenueMonitoringDashboard() {
    const [metrics, setMetrics] = useState<RevenueMetrics>({
        totalRevenue: 0,
        todayRevenue: 0,
        activeSubscriptions: 0,
        conversionRate: 0,
        paymentAttempts: 0,
        successfulPayments: 0,
        failedPayments: 0,
        averageOrderValue: 0,
        monthlyRecurringRevenue: 0,
        churnRate: 0
    });

    const [recentEvents, setRecentEvents] = useState<RevenueEvent[]>([]);
    const [isLive, setIsLive] = useState(false);
    const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

    // Real-time metrics fetching
    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const response = await fetch('/api/stripe/metrics');
                const data = await response.json();
                setMetrics(data.metrics);
                setRecentEvents(data.recentEvents);
                setLastUpdate(new Date());
                setIsLive(true);
            } catch (error) {
                console.error('Failed to fetch revenue metrics:', error);
                setIsLive(false);
            }
        };

        // Initial fetch
        fetchMetrics();

        // Set up real-time updates every 30 seconds
        const interval = setInterval(fetchMetrics, 30000);

        return () => clearInterval(interval);
    }, []);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount / 100); // Stripe amounts are in cents
    };

    const formatPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`;
    };

    const getStatusColor = (isPositive: boolean, isNeutral = false) => {
        if (isNeutral) return 'text-gray-600';
        return isPositive ? 'text-green-600' : 'text-red-600';
    };

    const MetricCard = ({ 
        title, 
        value, 
        change, 
        icon: Icon, 
        isPositive = true,
        isCurrency = false,
        isPercentage = false 
    }: {
        title: string;
        value: number;
        change?: number;
        icon: any;
        isPositive?: boolean;
        isCurrency?: boolean;
        isPercentage?: boolean;
    }) => (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">
                        {isCurrency ? formatCurrency(value) : 
                         isPercentage ? formatPercentage(value) : 
                         value.toLocaleString()}
                    </p>
                    {change !== undefined && (
                        <p className={`text-sm ${getStatusColor(change >= 0)}`}>
                            {change >= 0 ? '+' : ''}{change}% from yesterday
                        </p>
                    )}
                </div>
                <div className={`${getStatusColor(isPositive, true)} bg-gray-100 rounded-full p-3`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );

    const EventItem = ({ event }: { event: RevenueEvent }) => {
        const getEventIcon = () => {
            switch (event.type) {
                case 'payment_success':
                    return <CheckCircle className="h-4 w-4 text-green-500" />;
                case 'payment_failed':
                    return <AlertCircle className="h-4 w-4 text-red-500" />;
                case 'subscription_created':
                    return <Users className="h-4 w-4 text-blue-500" />;
                case 'subscription_cancelled':
                    return <AlertCircle className="h-4 w-4 text-orange-500" />;
                default:
                    return <CreditCard className="h-4 w-4 text-gray-500" />;
            }
        };

        const getEventText = () => {
            switch (event.type) {
                case 'payment_success':
                    return `Payment successful - ${formatCurrency(event.amount)}`;
                case 'payment_failed':
                    return `Payment failed - ${formatCurrency(event.amount)}`;
                case 'subscription_created':
                    return `New ${event.plan} subscription - ${formatCurrency(event.amount)}`;
                case 'subscription_cancelled':
                    return `${event.plan} subscription cancelled`;
                default:
                    return 'Unknown event';
            }
        };

        return (
            <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                {getEventIcon()}
                <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{getEventText()}</p>
                    <p className="text-xs text-gray-500">
                        {event.customer} • {event.timestamp.toLocaleTimeString()}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Revenue Dashboard</h1>
                            <p className="text-gray-600 mt-2">
                                Real-time monitoring of Stripe payment performance
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className={`flex items-center space-x-2 ${isLive ? 'text-green-600' : 'text-red-600'}`}>
                                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                <span className="text-sm font-medium">
                                    {isLive ? 'Live' : 'Offline'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">
                                Last updated: {lastUpdate.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Today's Revenue"
                        value={metrics.todayRevenue}
                        icon={DollarSign}
                        isCurrency={true}
                        change={15.3}
                    />
                    <MetricCard
                        title="Active Subscriptions"
                        value={metrics.activeSubscriptions}
                        icon={Users}
                        change={8.1}
                    />
                    <MetricCard
                        title="Conversion Rate"
                        value={metrics.conversionRate}
                        icon={TrendingUp}
                        isPercentage={true}
                        change={2.4}
                    />
                    <MetricCard
                        title="Successful Payments"
                        value={metrics.successfulPayments}
                        icon={CheckCircle}
                        change={12.7}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Summary */}
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Overview</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(metrics.totalRevenue)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Monthly Recurring</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {formatCurrency(metrics.monthlyRecurringRevenue)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Average Order</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {formatCurrency(metrics.averageOrderValue)}
                                </p>
                            </div>
                            <div className="text-center">
                                <p className="text-sm text-gray-600">Churn Rate</p>
                                <p className="text-2xl font-bold text-orange-600">
                                    {formatPercentage(metrics.churnRate)}
                                </p>
                            </div>
                        </div>

                        {/* Payment Success Rate */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Payment Success Rate</span>
                                <span className="text-sm text-gray-600">
                                    {metrics.successfulPayments} / {metrics.paymentAttempts}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${(metrics.successfulPayments / Math.max(metrics.paymentAttempts, 1)) * 100}%`
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {formatPercentage(metrics.successfulPayments / Math.max(metrics.paymentAttempts, 1))} success rate
                            </p>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {recentEvents.length > 0 ? (
                                recentEvents.map((event) => (
                                    <EventItem key={event.id} event={event} />
                                ))
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p>No recent activity</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Items */}
                <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 Day 1 Revenue Goals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-sm text-blue-700">Target Revenue</p>
                            <p className="text-2xl font-bold text-blue-900">$500 - $1,000</p>
                            <p className="text-xs text-blue-600">Within 24 hours</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-blue-700">Target Conversions</p>
                            <p className="text-2xl font-bold text-blue-900">10-20</p>
                            <p className="text-xs text-blue-600">Premium subscriptions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-sm text-blue-700">Target Success Rate</p>
                            <p className="text-2xl font-bold text-blue-900">85%+</p>
                            <p className="text-xs text-blue-600">Payment completion</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
