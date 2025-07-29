/**
 * Day 2: Vercel Pro Payment Processing Component
 * Client-side payment integration with edge optimization
 */

import { CardElement, Elements, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import React, { useEffect, useState } from 'react';

// Initialize Stripe with enhanced configuration
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY!, {
    betas: ['checkout_beta_4'], // Latest Stripe features
    apiVersion: '2023-10-16'
});

interface PaymentFormProps {
    amount: number;
    currency: string;
    productId: string;
    onSuccess: (result: any) => void;
    onError: (error: any) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
    amount,
    currency,
    productId,
    onSuccess,
    onError
}) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState('');
    const [optimizedAmount, setOptimizedAmount] = useState(amount);

    // Edge-optimized payment intent creation
    useEffect(() => {
        const createPaymentIntent = async () => {
            try {
                console.log('🚀 Creating edge-optimized payment intent...');

                const response = await fetch('/api/payments/create-intent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Edge-Optimized': 'true'
                    },
                    body: JSON.stringify({
                        amount,
                        currency,
                        productId,
                        edgeOptimization: true,
                        timestamp: Date.now()
                    })
                });

                if (!response.ok) {
                    throw new Error(`Payment intent creation failed: ${response.status}`);
                }

                const data = await response.json();

                setClientSecret(data.clientSecret);
                setOptimizedAmount(data.amount);

                // Track payment intent creation
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'begin_checkout', {
                        currency: currency,
                        value: data.amount / 100,
                        items: [{
                            item_id: productId,
                            item_name: 'TimeVault Premium',
                            price: data.amount / 100,
                            quantity: 1
                        }]
                    });
                }

                console.log('✅ Payment intent created:', data.edgeOptimized ? 'Edge Optimized' : 'Standard');

            } catch (error) {
                console.error('❌ Payment intent creation failed:', error);
                onError(error);
            }
        };

        if (amount > 0) {
            createPaymentIntent();
        }
    }, [amount, currency, productId, onError]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setProcessing(true);

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            onError(new Error('Card element not found'));
            setProcessing(false);
            return;
        }

        try {
            console.log('💳 Processing payment with Vercel Pro edge optimization...');

            const startTime = performance.now();

            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'TimeVault User'
                    }
                }
            });

            const processingTime = performance.now() - startTime;

            if (error) {
                console.error('❌ Payment failed:', error);

                // Track payment failure
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'payment_failed', {
                        error_message: error.message,
                        processing_time: processingTime
                    });
                }

                onError(error);
            } else if (paymentIntent.status === 'succeeded') {
                console.log('✅ Payment succeeded:', paymentIntent.id);

                // Track successful payment
                if (typeof window !== 'undefined' && (window as any).gtag) {
                    (window as any).gtag('event', 'purchase', {
                        transaction_id: paymentIntent.id,
                        value: optimizedAmount / 100,
                        currency: currency,
                        processing_time: processingTime,
                        edge_optimized: true,
                        items: [{
                            item_id: productId,
                            item_name: 'TimeVault Premium',
                            price: optimizedAmount / 100,
                            quantity: 1
                        }]
                    });
                }

                // Real-time revenue tracking
                await fetch('/api/analytics/revenue', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        paymentIntentId: paymentIntent.id,
                        amount: optimizedAmount,
                        currency,
                        productId,
                        processingTime,
                        edgeOptimized: true,
                        timestamp: Date.now()
                    })
                });

                onSuccess({
                    paymentIntent,
                    amount: optimizedAmount,
                    processingTime,
                    edgeOptimized: true
                });
            }
        } catch (error) {
            console.error('💥 Payment processing error:', error);
            onError(error);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="payment-form">
            <div className="payment-header">
                <h3>Secure Payment Processing</h3>
                <div className="payment-badges">
                    <span className="badge edge">⚡ Edge Optimized</span>
                    <span className="badge secure">🔒 Secure</span>
                    <span className="badge fast">🚀 Sub-100ms</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="payment-form-content">
                <div className="amount-display">
                    <div className="amount">
                        ${(optimizedAmount / 100).toFixed(2)} {currency.toUpperCase()}
                    </div>
                    {optimizedAmount !== amount && (
                        <div className="pricing-note">
                            Optimized pricing for your region
                        </div>
                    )}
                </div>

                <div className="card-element-container">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: '16px',
                                    color: '#FFFFFF',
                                    '::placeholder': {
                                        color: '#C0C0C0',
                                    },
                                },
                                invalid: {
                                    color: '#EF4444',
                                },
                            },
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || processing || !clientSecret}
                    className="payment-button"
                >
                    {processing ? (
                        <>
                            <div className="spinner"></div>
                            Processing...
                        </>
                    ) : (
                        <>
                            <span className="button-icon">💳</span>
                            Pay ${(optimizedAmount / 100).toFixed(2)}
                        </>
                    )}
                </button>

                <div className="payment-security">
                    <div className="security-badges">
                        <span>🔒 SSL Encrypted</span>
                        <span>⚡ Edge Processing</span>
                        <span>🛡️ Fraud Protected</span>
                    </div>
                    <p>Your payment is processed securely with industry-leading encryption.</p>
                </div>
            </form>

            <style jsx>{`
        .payment-form {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #D4AF37;
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          margin: 0 auto;
        }

        .payment-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .payment-header h3 {
          color: #D4AF37;
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .payment-badges {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .badge.edge {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }

        .badge.secure {
          background: rgba(59, 130, 246, 0.2);
          color: #3B82F6;
        }

        .amount-display {
          text-align: center;
          margin-bottom: 2rem;
        }

        .amount {
          font-size: 2.5rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 0.5rem;
        }

        .pricing-note {
          color: #10B981;
          font-size: 0.875rem;
        }

        .card-element-container {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 2rem;
        }

        .payment-button {
          width: 100%;
          background: linear-gradient(135deg, #D4AF37, #B8941F);
          color: #001F3F;
          border: none;
          border-radius: 8px;
          padding: 1rem 2rem;
          font-size: 1.125rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }

        .payment-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }

        .payment-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 1.25rem;
          height: 1.25rem;
          border: 2px solid transparent;
          border-top: 2px solid currentColor;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .button-icon {
          font-size: 1.25rem;
        }

        .payment-security {
          text-align: center;
        }

        .security-badges {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #C0C0C0;
          flex-wrap: wrap;
        }

        .security-badges span {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .payment-security p {
          color: #C0C0C0;
          font-size: 0.875rem;
          margin: 0;
        }

        @media (max-width: 768px) {
          .payment-form {
            padding: 1rem;
            margin: 1rem;
          }

          .amount {
            font-size: 2rem;
          }

          .security-badges {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
        </div>
    );
};

// Main payment component with Stripe Elements
export const VercelProPayment: React.FC<PaymentFormProps> = (props) => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
        </Elements>
    );
};

export default VercelProPayment;
