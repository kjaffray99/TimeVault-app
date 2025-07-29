/**
 * 🚀 STRIPE WEBHOOK HANDLER - DAY 1 REVENUE TRACKING
 * Endpoint: /api/stripe/webhook
 * Purpose: Handle Stripe events for subscription management
 */

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
        return new Response(JSON.stringify({ error: 'Missing stripe-signature header' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    let event: Stripe.Event;

    try {
        const body = await req.text();
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        console.error('❌ Webhook signature verification failed:', error);
        return new Response(JSON.stringify({ error: 'Invalid signature' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Handle the event
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
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return new Response(JSON.stringify({ received: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Webhook handling failed:', error);
        return new Response(JSON.stringify({ error: 'Webhook processing failed' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    console.log(`✅ Checkout completed: ${session.id}`);
    
    // Extract metadata
    const planId = session.metadata?.planId;
    const customerEmail = session.customer_email;
    
    // Log revenue metrics
    const amount = session.amount_total! / 100; // Convert from cents
    console.log(`💰 Revenue: $${amount} from plan: ${planId}`);
    
    // TODO: Update user premium status in database
    // TODO: Send welcome email with NFT details
    // TODO: Trigger TVLT bonus rewards
    
    // Analytics tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', 'purchase', {
            transaction_id: session.id,
            value: amount,
            currency: 'USD',
            items: [{
                item_id: planId,
                item_name: `TimeVault Premium ${planId}`,
                category: 'subscription',
                quantity: 1,
                price: amount
            }]
        });
    }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
    console.log(`✅ Subscription created: ${subscription.id}`);
    
    const planId = subscription.metadata?.planId;
    const customerId = subscription.customer;
    
    // TODO: Create user premium record in database
    // TODO: Set up user permissions
    // TODO: Send onboarding sequence
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    console.log(`🔄 Subscription updated: ${subscription.id}`);
    
    // Handle plan changes, billing updates, etc.
    // TODO: Update user permissions if plan changed
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    console.log(`❌ Subscription deleted: ${subscription.id}`);
    
    // Handle cancellations
    // TODO: Remove premium access
    // TODO: Send retention email
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
    console.log(`✅ Payment succeeded: ${invoice.id}`);
    
    const amount = invoice.amount_paid / 100;
    console.log(`💰 Revenue: $${amount}`);
    
    // TODO: Log revenue in analytics
    // TODO: Send payment confirmation
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
    console.log(`❌ Payment failed: ${invoice.id}`);
    
    // Handle failed payments
    // TODO: Send payment retry email
    // TODO: Implement dunning management
}
