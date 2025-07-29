/**
 * 🚀 DAY 1 STRIPE INTEGRATION SERVICE - IMMEDIATE REVENUE ACTIVATION
 * Timeline: 2 hours implementation | Target: $500-1,000 in 24 hours
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

// Initialize Stripe
let stripePromise: Promise<Stripe | null>;

const getStripe = () => {
    if (!stripePromise) {
        const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
        if (!publishableKey) {
            console.error('❌ Stripe publishable key not found in environment variables');
            return Promise.resolve(null);
        }
        stripePromise = loadStripe(publishableKey);
    }
    return stripePromise;
};

// Subscription Plans Configuration
export const PREMIUM_PLANS = {
    monthly: {
        id: 'premium_monthly',
        name: 'Premium Monthly',
        price: 29.99,
        priceId: 'price_premium_monthly_2999', // Will be created in Stripe
        interval: 'month',
        features: [
            'Unlimited crypto calculations',
            'AI portfolio analysis',
            'Real-time market alerts',
            'Advanced precious metals insights',
            '2x TVLT token rewards',
            'Priority customer support',
            'Mobile app access'
        ]
    },
    annual: {
        id: 'premium_annual',
        name: 'Premium Annual',
        price: 299.99,
        originalPrice: 359.88, // Monthly * 12
        priceId: 'price_premium_annual_29999', // Will be created in Stripe
        interval: 'year',
        discount: '17% OFF',
        features: [
            'Everything in Monthly plan',
            'Save $59.89 annually',
            'Exclusive NFT badge collection',
            'Advanced analytics dashboard',
            'White-glove onboarding',
            'API access for developers'
        ]
    }
};

// Stripe Checkout Session Creation
export interface CheckoutOptions {
    planId: 'monthly' | 'annual';
    customerEmail?: string;
    successUrl?: string;
    cancelUrl?: string;
    couponCode?: string;
}

export class StripeService {
    private stripe: Stripe | null = null;

    async initialize(): Promise<boolean> {
        try {
            this.stripe = await getStripe();
            return this.stripe !== null;
        } catch (error) {
            console.error('❌ Stripe initialization failed:', error);
            return false;
        }
    }

    async createCheckoutSession(options: CheckoutOptions): Promise<{ sessionId?: string; error?: string }> {
        try {
            const plan = PREMIUM_PLANS[options.planId];
            if (!plan) {
                return { error: 'Invalid plan selected' };
            }

            // Create checkout session via API endpoint
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    priceId: plan.priceId,
                    customerEmail: options.customerEmail,
                    successUrl: options.successUrl || `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: options.cancelUrl || `${window.location.origin}/premium`,
                    couponCode: options.couponCode,
                    planId: options.planId
                }),
            });

            const session = await response.json();

            if (session.error) {
                return { error: session.error };
            }

            return { sessionId: session.sessionId };

        } catch (error) {
            console.error('❌ Checkout session creation failed:', error);
            return { error: 'Failed to create checkout session' };
        }
    }

    async redirectToCheckout(sessionId: string): Promise<{ error?: string }> {
        if (!this.stripe) {
            return { error: 'Stripe not initialized' };
        }

        const { error } = await this.stripe.redirectToCheckout({ sessionId });

        if (error) {
            console.error('❌ Stripe redirect failed:', error);
            return { error: error.message };
        }

        return {};
    }

    async handleSubscription(options: CheckoutOptions): Promise<{ success: boolean; error?: string }> {
        try {
            // Initialize Stripe if not already done
            if (!this.stripe) {
                const initialized = await this.initialize();
                if (!initialized) {
                    return { success: false, error: 'Failed to initialize payment system' };
                }
            }

            // Create checkout session
            const { sessionId, error: sessionError } = await this.createCheckoutSession(options);
            
            if (sessionError || !sessionId) {
                return { success: false, error: sessionError || 'Failed to create payment session' };
            }

            // Redirect to Stripe checkout
            const { error: redirectError } = await this.redirectToCheckout(sessionId);
            
            if (redirectError) {
                return { success: false, error: redirectError };
            }

            return { success: true };

        } catch (error) {
            console.error('❌ Subscription handling failed:', error);
            return { success: false, error: 'Payment processing failed' };
        }
    }
}

// Global Stripe service instance
export const stripeService = new StripeService();

// Analytics Integration for Revenue Tracking
export const trackStripeEvent = (eventName: string, properties: Record<string, any>) => {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: 'stripe',
            event_label: properties.planId || 'unknown',
            value: properties.amount || 0,
            currency: 'USD',
            ...properties
        });
    }

    // Console logging for development
    console.log(`📊 Stripe Event: ${eventName}`, properties);
};

// Revenue Monitoring
export const monitorCheckoutConversion = (planId: string, step: string) => {
    trackStripeEvent('checkout_funnel', {
        planId,
        step,
        timestamp: Date.now(),
        url: window.location.href
    });
};

export default StripeService;
