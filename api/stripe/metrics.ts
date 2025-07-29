/**
 * 📊 STRIPE METRICS API ENDPOINT
 * Real-time revenue and payment analytics
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia',
});

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

export async function GET(request: NextRequest) {
    try {
        console.log('📊 Fetching Stripe metrics...');

        // Get date ranges
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const todayStartTimestamp = Math.floor(todayStart.getTime() / 1000);
        const monthStartTimestamp = Math.floor(monthStart.getTime() / 1000);

        // Fetch successful payments for today
        const todayPayments = await stripe.paymentIntents.list({
            created: { gte: todayStartTimestamp },
            status: 'succeeded',
            limit: 100,
        });

        // Fetch all successful payments this month
        const monthPayments = await stripe.paymentIntents.list({
            created: { gte: monthStartTimestamp },
            status: 'succeeded',
            limit: 100,
        });

        // Fetch failed payments for today
        const todayFailedPayments = await stripe.paymentIntents.list({
            created: { gte: todayStartTimestamp },
            status: 'payment_failed',
            limit: 100,
        });

        // Fetch active subscriptions
        const activeSubscriptions = await stripe.subscriptions.list({
            status: 'active',
            limit: 100,
        });

        // Fetch recent cancelled subscriptions for churn calculation
        const cancelledSubscriptions = await stripe.subscriptions.list({
            status: 'canceled',
            created: { gte: monthStartTimestamp },
            limit: 100,
        });

        // Calculate metrics
        const todayRevenue = todayPayments.data.reduce((sum, payment) => sum + payment.amount, 0);
        const totalRevenue = monthPayments.data.reduce((sum, payment) => sum + payment.amount, 0);
        const successfulPayments = todayPayments.data.length;
        const failedPayments = todayFailedPayments.data.length;
        const paymentAttempts = successfulPayments + failedPayments;
        const conversionRate = paymentAttempts > 0 ? successfulPayments / paymentAttempts : 0;
        
        // Calculate MRR (Monthly Recurring Revenue)
        const monthlyRecurringRevenue = activeSubscriptions.data.reduce((sum, subscription) => {
            const price = subscription.items.data[0]?.price;
            if (price && price.recurring?.interval === 'month') {
                return sum + (price.unit_amount || 0);
            } else if (price && price.recurring?.interval === 'year') {
                return sum + (price.unit_amount || 0) / 12;
            }
            return sum;
        }, 0);

        // Calculate churn rate
        const totalSubscriptionsThisMonth = activeSubscriptions.data.length + cancelledSubscriptions.data.length;
        const churnRate = totalSubscriptionsThisMonth > 0 ? cancelledSubscriptions.data.length / totalSubscriptionsThisMonth : 0;

        // Calculate average order value
        const averageOrderValue = successfulPayments > 0 ? todayRevenue / successfulPayments : 0;

        const metrics: RevenueMetrics = {
            totalRevenue,
            todayRevenue,
            activeSubscriptions: activeSubscriptions.data.length,
            conversionRate,
            paymentAttempts,
            successfulPayments,
            failedPayments,
            averageOrderValue,
            monthlyRecurringRevenue,
            churnRate,
        };

        // Create recent events
        const recentEvents: RevenueEvent[] = [];

        // Add successful payments
        todayPayments.data.slice(0, 10).forEach(payment => {
            recentEvents.push({
                id: payment.id,
                type: 'payment_success',
                amount: payment.amount,
                timestamp: new Date(payment.created * 1000),
                customer: payment.customer as string || 'Unknown',
                plan: 'Premium',
            });
        });

        // Add failed payments
        todayFailedPayments.data.slice(0, 5).forEach(payment => {
            recentEvents.push({
                id: payment.id,
                type: 'payment_failed',
                amount: payment.amount,
                timestamp: new Date(payment.created * 1000),
                customer: payment.customer as string || 'Unknown',
                plan: 'Premium',
            });
        });

        // Add recent subscriptions
        activeSubscriptions.data
            .filter(sub => sub.created >= todayStartTimestamp)
            .slice(0, 5)
            .forEach(subscription => {
                const price = subscription.items.data[0]?.price;
                recentEvents.push({
                    id: subscription.id,
                    type: 'subscription_created',
                    amount: price?.unit_amount || 0,
                    timestamp: new Date(subscription.created * 1000),
                    customer: subscription.customer as string || 'Unknown',
                    plan: price?.recurring?.interval === 'year' ? 'Annual' : 'Monthly',
                });
            });

        // Sort events by timestamp (most recent first)
        recentEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        console.log('✅ Stripe metrics fetched successfully:', {
            todayRevenue: todayRevenue / 100,
            activeSubscriptions: activeSubscriptions.data.length,
            conversionRate: Math.round(conversionRate * 100),
            eventsCount: recentEvents.length,
        });

        return NextResponse.json({
            success: true,
            metrics,
            recentEvents: recentEvents.slice(0, 20), // Return latest 20 events
            timestamp: new Date().toISOString(),
        });

    } catch (error) {
        console.error('❌ Error fetching Stripe metrics:', error);
        
        // Return mock data if Stripe fails (for development)
        const mockMetrics: RevenueMetrics = {
            totalRevenue: 150000, // $1,500 in cents
            todayRevenue: 12500,   // $125 in cents  
            activeSubscriptions: 5,
            conversionRate: 0.085,
            paymentAttempts: 12,
            successfulPayments: 10,
            failedPayments: 2,
            averageOrderValue: 2999, // $29.99 in cents
            monthlyRecurringRevenue: 14995, // $149.95 in cents
            churnRate: 0.05,
        };

        const mockEvents: RevenueEvent[] = [
            {
                id: 'evt_1',
                type: 'payment_success',
                amount: 2999,
                timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
                customer: 'user_123',
                plan: 'Monthly',
            },
            {
                id: 'evt_2', 
                type: 'subscription_created',
                amount: 29999,
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                customer: 'user_456',
                plan: 'Annual',
            },
        ];

        return NextResponse.json({
            success: false,
            error: 'Failed to fetch real metrics, returning mock data',
            metrics: mockMetrics,
            recentEvents: mockEvents,
            timestamp: new Date().toISOString(),
        });
    }
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ 
        error: 'Method not allowed' 
    }, { status: 405 });
}
