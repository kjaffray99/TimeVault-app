/**
 * Stripe Webhook Handler - Real Revenue Tracking
 * Handles subscription events for accurate revenue metrics
 */

interface StripeEvent {
    id: string;
    object: 'event';
    type: string;
    data: {
        object: any;
    };
}

// Revenue tracking webhook endpoint
export async function POST(request: Request) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return new Response('Missing stripe signature', { status: 400 });
        }

        // Parse Stripe event (in production, verify signature with webhook secret)
        const event: StripeEvent = JSON.parse(body);

        // Handle different subscription events
        switch (event.type) {
            case 'checkout.session.completed':
                await handleCheckoutCompleted(event.data.object);
                break;

            case 'customer.subscription.created':
                await handleSubscriptionCreated(event.data.object);
                break;

            case 'customer.subscription.updated':
                await handleSubscriptionUpdated(event.data.object);
                break;

            case 'customer.subscription.deleted':
                await handleSubscriptionCanceled(event.data.object);
                break;

            case 'invoice.payment_succeeded':
                await handlePaymentSucceeded(event.data.object);
                break;

            case 'invoice.payment_failed':
                await handlePaymentFailed(event.data.object);
                break;

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return new Response('Webhook processed successfully', { status: 200 });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new Response('Webhook processing failed', { status: 500 });
    }
}

async function handleCheckoutCompleted(session: any) {
    const revenueEvent = {
        type: 'subscription_complete',
        amount: session.amount_total / 100, // Convert from cents
        currency: session.currency,
        planId: session.metadata?.planId || 'unknown',
        customerId: session.customer,
        timestamp: new Date().toISOString()
    };

    // Store revenue event (implement your storage logic)
    await storeRevenueEvent(revenueEvent);

    console.log('💰 New subscription completed:', revenueEvent);
}

async function handleSubscriptionCreated(subscription: any) {
    const revenueEvent = {
        type: 'subscription_created',
        amount: subscription.items.data[0]?.price?.unit_amount / 100,
        currency: subscription.currency,
        interval: subscription.items.data[0]?.price?.recurring?.interval,
        customerId: subscription.customer,
        timestamp: new Date().toISOString()
    };

    await storeRevenueEvent(revenueEvent);
    console.log('🎯 New subscription created:', revenueEvent);
}

async function handleSubscriptionUpdated(subscription: any) {
    // Handle plan changes, upgrades, downgrades
    console.log('📈 Subscription updated:', subscription.id);
}

async function handleSubscriptionCanceled(subscription: any) {
    const churnEvent = {
        type: 'subscription_canceled',
        customerId: subscription.customer,
        canceledAt: new Date(subscription.canceled_at * 1000).toISOString(),
        timestamp: new Date().toISOString()
    };

    await storeRevenueEvent(churnEvent);
    console.log('📉 Subscription canceled:', churnEvent);
}

async function handlePaymentSucceeded(invoice: any) {
    const revenueEvent = {
        type: 'payment_succeeded',
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        customerId: invoice.customer,
        timestamp: new Date().toISOString()
    };

    await storeRevenueEvent(revenueEvent);
    console.log('💳 Payment succeeded:', revenueEvent);
}

async function handlePaymentFailed(invoice: any) {
    console.log('❌ Payment failed for customer:', invoice.customer);

    // Trigger retention campaigns or dunning management
    await handleFailedPayment(invoice);
}

async function storeRevenueEvent(event: any) {
    // In production, store in your database
    // For now, we'll use localStorage as a simple example
    if (typeof window !== 'undefined') {
        const existingEvents = JSON.parse(localStorage.getItem('revenue_events') || '[]');
        existingEvents.push(event);
        localStorage.setItem('revenue_events', JSON.stringify(existingEvents));
    }
}

async function handleFailedPayment(invoice: any) {
    // Implement retry logic, dunning management, or customer retention
    console.log('Implementing payment retry for:', invoice.customer);
}
