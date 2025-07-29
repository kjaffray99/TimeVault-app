
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  // Handle payment events
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object);
      break;
    case 'customer.subscription.created':
      await handleSubscriptionCreated(event.data.object);
      break;
    case 'invoice.payment_succeeded':
      await handleRecurringPayment(event.data.object);
      break;
  }
  
  return NextResponse.json({ received: true });
}

async function handlePaymentSuccess(paymentIntent: any) {
  console.log('💰 Payment succeeded:', paymentIntent.id);
  
  // Track revenue
  await trackRevenue({
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    paymentIntentId: paymentIntent.id,
    customerId: paymentIntent.customer,
    timestamp: Date.now()
  });
  
  // Update affiliate commissions
  if (paymentIntent.metadata?.affiliate_id) {
    await updateAffiliateCommission(
      paymentIntent.metadata.affiliate_id,
      paymentIntent.amount * 0.30 // 30% commission
    );
  }
  
  // Send welcome email
  await sendWelcomeEmail(paymentIntent.customer);
}

async function trackRevenue(data: any) {
  // Real-time revenue tracking
  const promises = [
    // Internal analytics
    fetch(process.env.REVENUE_WEBHOOK, {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    
    // Google Analytics
    fetch('https://www.google-analytics.com/mp/collect', {
      method: 'POST',
      body: JSON.stringify({
        client_id: data.customerId,
        events: [{
          name: 'purchase',
          parameters: {
            transaction_id: data.paymentIntentId,
            value: data.amount,
            currency: data.currency
          }
        }]
      })
    })
  ];
  
  await Promise.all(promises);
}
