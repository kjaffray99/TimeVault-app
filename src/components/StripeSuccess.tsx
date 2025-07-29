/**
 * 🎉 STRIPE SUCCESS PAGE - DAY 1 CONVERSION CONFIRMATION
 * Purpose: Confirm successful payment and activate premium features
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const StripeSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [sessionData, setSessionData] = useState<any>(null);

    const sessionId = searchParams.get('session_id');
    const planId = searchParams.get('plan');

    useEffect(() => {
        if (sessionId) {
            // Verify the session and get customer data
            verifySession();
        } else {
            setLoading(false);
        }
    }, [sessionId]);

    const verifySession = async () => {
        try {
            // In production, verify session with backend
            console.log('✅ Verifying session:', sessionId);
            
            // Simulate session verification
            setTimeout(() => {
                setSessionData({
                    customerEmail: 'user@example.com',
                    planName: planId === 'annual' ? 'Premium Annual' : 'Premium Monthly',
                    amount: planId === 'annual' ? 299.99 : 29.99
                });
                setLoading(false);

                // Track successful conversion
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'purchase', {
                        transaction_id: sessionId,
                        value: planId === 'annual' ? 299.99 : 29.99,
                        currency: 'USD',
                        items: [{
                            item_id: planId,
                            item_name: `TimeVault Premium ${planId}`,
                            category: 'subscription',
                            quantity: 1,
                            price: planId === 'annual' ? 299.99 : 29.99
                        }]
                    });
                }
            }, 1500);

        } catch (error) {
            console.error('❌ Session verification failed:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="success-page loading">
                <div className="container">
                    <div className="loading-spinner">
                        <div className="spinner"></div>
                        <h2>Processing your payment...</h2>
                        <p>Please wait while we confirm your subscription</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!sessionId || !sessionData) {
        return (
            <div className="success-page error">
                <div className="container">
                    <div className="error-content">
                        <h2>⚠️ Payment Verification Required</h2>
                        <p>We couldn't verify your payment. Please contact support.</p>
                        <button onClick={() => window.location.href = '/premium'}>
                            Return to Premium
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="success-page">
            <div className="container">
                <div className="success-content">
                    <div className="success-header">
                        <div className="success-icon">🎉</div>
                        <h1>Welcome to TimeVault Premium!</h1>
                        <p>Your subscription is now active</p>
                    </div>

                    <div className="subscription-details">
                        <div className="detail-card">
                            <h3>Subscription Details</h3>
                            <div className="details">
                                <div className="detail-row">
                                    <span>Plan:</span>
                                    <span>{sessionData.planName}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Amount:</span>
                                    <span>${sessionData.amount}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Email:</span>
                                    <span>{sessionData.customerEmail}</span>
                                </div>
                                <div className="detail-row">
                                    <span>Status:</span>
                                    <span className="status-active">Active</span>
                                </div>
                            </div>
                        </div>

                        <div className="benefits-card">
                            <h3>🚀 Your Premium Benefits</h3>
                            <ul className="benefits-list">
                                <li>✅ Unlimited crypto calculations</li>
                                <li>✅ AI portfolio analysis</li>
                                <li>✅ Real-time market alerts</li>
                                <li>✅ Advanced precious metals insights</li>
                                <li>✅ 2x TVLT token rewards</li>
                                <li>✅ Priority customer support</li>
                                <li>✅ Mobile app access</li>
                                {planId === 'annual' && (
                                    <>
                                        <li>✅ Exclusive NFT badges</li>
                                        <li>✅ API access for developers</li>
                                        <li>✅ White-glove onboarding</li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="next-steps">
                        <h3>🎯 Next Steps</h3>
                        <div className="steps-grid">
                            <div className="step">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h4>Check Your Email</h4>
                                    <p>We've sent you a welcome email with your NFT badge details</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h4>Explore Premium Features</h4>
                                    <p>Access your new dashboard and advanced analytics</p>
                                </div>
                            </div>
                            <div className="step">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h4>Connect Your Wallet</h4>
                                    <p>Earn 2x TVLT rewards and mint exclusive NFT badges</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="action-buttons">
                        <button 
                            className="primary-button"
                            onClick={() => window.location.href = '/dashboard'}
                        >
                            🚀 Access Premium Dashboard
                        </button>
                        <button 
                            className="secondary-button"
                            onClick={() => window.location.href = '/calculator'}
                        >
                            💰 Start Calculating
                        </button>
                    </div>

                    <div className="support-info">
                        <p>Need help? <a href="/support">Contact our premium support team</a></p>
                        <p>Manage your subscription in your <a href="/account">account settings</a></p>
                    </div>
                </div>
            </div>

            <style>{`
                .success-page {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #001f3f 0%, #003366 100%);
                    padding: 2rem 0;
                }

                .success-page .container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 0 1rem;
                }

                .success-content {
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                }

                .success-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .success-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                }

                .success-header h1 {
                    color: #001f3f;
                    margin-bottom: 0.5rem;
                    font-size: 2.5rem;
                }

                .subscription-details {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 2rem;
                    margin-bottom: 3rem;
                }

                .detail-card, .benefits-card {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 2px solid #d4af37;
                }

                .detail-row {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                }

                .status-active {
                    color: #28a745;
                    font-weight: bold;
                }

                .benefits-list {
                    list-style: none;
                    padding: 0;
                }

                .benefits-list li {
                    margin-bottom: 0.5rem;
                    color: #2c5530;
                }

                .steps-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .step {
                    display: flex;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 12px;
                }

                .step-number {
                    background: #d4af37;
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .action-buttons {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    margin-bottom: 2rem;
                }

                .primary-button, .secondary-button {
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-weight: bold;
                    text-decoration: none;
                    cursor: pointer;
                    border: none;
                    font-size: 1rem;
                }

                .primary-button {
                    background: linear-gradient(135deg, #d4af37 0%, #f1c40f 100%);
                    color: #001f3f;
                }

                .secondary-button {
                    background: #001f3f;
                    color: white;
                }

                .support-info {
                    text-align: center;
                    color: #666;
                    font-size: 0.9rem;
                }

                .support-info a {
                    color: #d4af37;
                    text-decoration: none;
                }

                .loading-spinner {
                    text-align: center;
                    padding: 4rem;
                }

                .spinner {
                    width: 50px;
                    height: 50px;
                    border: 5px solid #f3f3f3;
                    border-top: 5px solid #d4af37;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 2rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .subscription-details {
                        grid-template-columns: 1fr;
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                }
            `}</style>
        </div>
    );
};

export default StripeSuccess;
