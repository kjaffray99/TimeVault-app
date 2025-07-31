import { createCustomerPortalSession } from '@/lib/stripe-production';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { customerId } = await request.json();

        // Validate required fields
        if (!customerId) {
            return NextResponse.json(
                { error: 'Customer ID is required' },
                { status: 400 }
            );
        }

        // Create customer portal session
        const session = await createCustomerPortalSession(customerId);

        return NextResponse.json({
            url: session.url,
        });
    } catch (error) {
        console.error('Create customer portal session error:', error);
        return NextResponse.json(
            { error: 'Failed to create customer portal session' },
            { status: 500 }
        );
    }
}
