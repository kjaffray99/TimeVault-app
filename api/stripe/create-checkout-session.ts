/**
 * 🚀 STRIPE CHECKOUT SESSION API - DAY 1 REVENUE ACTIVATION
 * Endpoint: /api/stripe/create-checkout-session
 * Purpose: Create Stripe checkout sessions for premium subscriptions
 */

import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

export interface CreateCheckoutRequest {
    priceId: string;
    customerEmail?: string;
    successUrl: string;
    cancelUrl: string;
    couponCode?: string;
    planId: string;
}

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body: CreateCheckoutRequest = await req.json();
        const { priceId, customerEmail, successUrl, cancelUrl, couponCode, planId } = body;

        // Validate required fields
        if (!priceId || !successUrl || !cancelUrl) {
            return new Response(JSON.stringify({ 
                error: 'Missing required fields: priceId, successUrl, cancelUrl' 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create checkout session parameters
        const sessionParams: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ['card'],
            mode: 'subscription',
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                planId,
                source: 'timevault_website',
                version: '1.0.0'
            },
            subscription_data: {
                metadata: {
                    planId,
                    source: 'timevault_website'
                }
            }
        };

        // Add customer email if provided
        if (customerEmail) {
            sessionParams.customer_email = customerEmail;
        }

        // Add coupon if provided
        if (couponCode) {
            sessionParams.discounts = [{ coupon: couponCode }];
        }

        // Create the checkout session
        const session = await stripe.checkout.sessions.create(sessionParams);

        // Log successful session creation
        console.log(`✅ Checkout session created: ${session.id} for plan: ${planId}`);

        return new Response(JSON.stringify({ 
            sessionId: session.id,
            url: session.url 
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Stripe checkout session creation failed:', error);
        
        // Handle specific Stripe errors
        if (error instanceof Stripe.errors.StripeError) {
            return new Response(JSON.stringify({ 
                error: `Payment system error: ${error.message}` 
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ 
            error: 'Internal server error during payment processing' 
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
