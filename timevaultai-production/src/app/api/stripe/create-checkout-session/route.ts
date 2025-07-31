import { createCheckoutSession, STRIPE_PRODUCTS } from '@/lib/stripe-production';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { priceId, customerEmail, metadata } = await request.json();

        // Validate required fields
        if (!priceId) {
            return NextResponse.json(
                { error: 'Price ID is required' },
                { status: 400 }
            );
        }

        // Validate price ID exists in our products
        const validPriceIds = Object.values(STRIPE_PRODUCTS).map(product => product.priceId);
        if (!validPriceIds.includes(priceId)) {
            return NextResponse.json(
                { error: 'Invalid price ID' },
                { status: 400 }
            );
        }

        // Create checkout session
        const session = await createCheckoutSession(
            priceId,
            undefined, // customerId - will be created during checkout
            customerEmail,
            {
                source: 'timevault_calculator',
                timestamp: new Date().toISOString(),
                ...metadata,
            }
        );

        return NextResponse.json({
            sessionId: session.id,
            url: session.url,
        });
    } catch (error) {
        console.error('Create checkout session error:', error);
        return NextResponse.json(
            { error: 'Failed to create checkout session' },
            { status: 500 }
        );
    }
}
