// Stripe Configuration for Production Deployment
// TimeVault AI - Live Payment Processing System

import Stripe from 'stripe';

// Production Stripe Configuration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_LIVE!, {
    apiVersion: '2023-10-16',
    typescript: true,
});

// Subscription Product Configuration
export const STRIPE_PRODUCTS = {
    BASIC: {
        name: 'TimeVault Basic',
        price: 9.99,
        priceId: 'price_basic_monthly_live',
        features: [
            'Advanced Calculator',
            'Real-time Pricing',
            'Basic Analytics',
            'Email Support'
        ]
    },
    PRO: {
        name: 'TimeVault Pro',
        price: 29.99,
        priceId: 'price_pro_monthly_live',
        features: [
            'AI Market Insights',
            'Portfolio Tracking',
            'Advanced Charts',
            'Priority Support',
            'NFT Badges'
        ]
    },
    ENTERPRISE: {
        name: 'TimeVault Enterprise',
        price: 99.99,
        priceId: 'price_enterprise_monthly_live',
        features: [
            'API Access',
            'White-label Integration',
            'Custom Analytics',
            'Dedicated Support',
            'Advanced Features'
        ]
    }
};

// Create Checkout Session
export async function createCheckoutSession(
    priceId: string,
    customerId?: string,
    customerEmail?: string,
    metadata?: Record<string, string>
) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_URL}/premium/cancel`,
            customer: customerId,
            customer_email: customerEmail,
            allow_promotion_codes: true,
            billing_address_collection: 'required',
            tax_id_collection: {
                enabled: true,
            },
            metadata: {
                source: 'timevault_calculator',
                ...metadata,
            },
            subscription_data: {
                metadata: {
                    source: 'timevault_premium',
                    ...metadata,
                },
            },
        });

        return session;
    } catch (error) {
        console.error('Error creating checkout session:', error);
        throw new Error('Failed to create checkout session');
    }
}

// Create Customer Portal Session
export async function createCustomerPortalSession(customerId: string) {
    try {
        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${process.env.NEXT_PUBLIC_URL}/premium/dashboard`,
        });

        return session;
    } catch (error) {
        console.error('Error creating customer portal session:', error);
        throw new Error('Failed to create customer portal session');
    }
}

// Webhook Event Handler
export async function handleWebhookEvent(event: Stripe.Event) {
    try {
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object as Stripe.Invoice);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }
    } catch (error) {
        console.error('Error handling webhook event:', error);
        throw error;
    }
}

// Handle Successful Checkout
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log('Checkout completed:', session.id);

    // Update user subscription status in database
    if (session.customer && session.subscription) {
        await updateUserSubscription({
            customerId: session.customer as string,
            subscriptionId: session.subscription as string,
            status: 'active',
            sessionId: session.id,
        });
    }

    // Track conversion in analytics
    await trackConversion({
        sessionId: session.id,
        customerId: session.customer as string,
        amount: session.amount_total! / 100,
        currency: session.currency!,
        metadata: session.metadata,
    });

    // Send welcome email
    await sendWelcomeEmail(session.customer_details?.email!);
}

// Handle Subscription Created
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    console.log('Subscription created:', subscription.id);

    await updateUserSubscription({
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        priceId: subscription.items.data[0].price.id,
    });
}

// Handle Subscription Updated
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log('Subscription updated:', subscription.id);

    await updateUserSubscription({
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    });
}

// Handle Subscription Deleted
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log('Subscription deleted:', subscription.id);

    await updateUserSubscription({
        customerId: subscription.customer as string,
        subscriptionId: subscription.id,
        status: 'canceled',
    });
}

// Handle Payment Succeeded
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log('Payment succeeded:', invoice.id);

    // Track revenue
    await trackRevenue({
        invoiceId: invoice.id,
        customerId: invoice.customer as string,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        subscriptionId: invoice.subscription as string,
    });
}

// Handle Payment Failed
async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log('Payment failed:', invoice.id);

    // Send payment failure notification
    await sendPaymentFailureNotification({
        customerId: invoice.customer as string,
        invoiceId: invoice.id,
        amount: invoice.amount_due / 100,
    });
}

// Database Operations (placeholder - implement with your database)
async function updateUserSubscription(data: {
    customerId: string;
    subscriptionId: string;
    status: string;
    sessionId?: string;
    currentPeriodEnd?: Date;
    priceId?: string;
}) {
    // Implement database update logic
    console.log('Updating user subscription:', data);
}

// Analytics Tracking
async function trackConversion(data: {
    sessionId: string;
    customerId: string;
    amount: number;
    currency: string;
    metadata?: Record<string, string>;
}) {
    // Implement analytics tracking
    console.log('Tracking conversion:', data);

    // Google Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: data.sessionId,
            value: data.amount,
            currency: data.currency.toUpperCase(),
            items: [{
                item_id: 'subscription',
                item_name: 'TimeVault Premium',
                category: 'subscription',
                quantity: 1,
                price: data.amount,
            }]
        });
    }
}

// Revenue Tracking
async function trackRevenue(data: {
    invoiceId: string;
    customerId: string;
    amount: number;
    currency: string;
    subscriptionId: string;
}) {
    // Implement revenue tracking
    console.log('Tracking revenue:', data);
}

// Email Notifications
async function sendWelcomeEmail(email: string) {
    // Implement email sending logic
    console.log('Sending welcome email to:', email);
}

async function sendPaymentFailureNotification(data: {
    customerId: string;
    invoiceId: string;
    amount: number;
}) {
    // Implement payment failure notification
    console.log('Sending payment failure notification:', data);
}

// Utility Functions
export async function getCustomerSubscription(customerId: string) {
    try {
        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: 'active',
            limit: 1,
        });

        return subscriptions.data[0] || null;
    } catch (error) {
        console.error('Error fetching customer subscription:', error);
        return null;
    }
}

export async function cancelSubscription(subscriptionId: string) {
    try {
        const subscription = await stripe.subscriptions.cancel(subscriptionId);
        return subscription;
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw new Error('Failed to cancel subscription');
    }
}

export async function updateSubscription(subscriptionId: string, priceId: string) {
    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            items: [{
                id: subscription.items.data[0].id,
                price: priceId,
            }],
            proration_behavior: 'always_invoice',
        });

        return updatedSubscription;
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw new Error('Failed to update subscription');
    }
}

// Production Environment Variables Validation
export function validateStripeConfig() {
    const requiredVars = [
        'STRIPE_SECRET_KEY_LIVE',
        'STRIPE_WEBHOOK_SECRET',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'NEXT_PUBLIC_URL'
    ];

    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    console.log('✅ Stripe configuration validated for production');
}
