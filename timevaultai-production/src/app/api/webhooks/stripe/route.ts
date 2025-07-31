import { handleWebhookEvent, stripe } from '@/lib/stripe-production';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = headers().get('stripe-signature');

        if (!signature) {
            console.error('Missing Stripe signature');
            return NextResponse.json(
                { error: 'Missing Stripe signature' },
                { status: 400 }
            );
        }

        let event;

        try {
            event = stripe.webhooks.constructEvent(
                body,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET!
            );
        } catch (err) {
            console.error('Webhook signature verification failed:', err);
            return NextResponse.json(
                { error: 'Invalid signature' },
                { status: 400 }
            );
        }

        // Handle the webhook event
        await handleWebhookEvent(event);

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
