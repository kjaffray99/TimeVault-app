import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import EducationalQuiz from '../components/EducationalQuiz';
import FeedbackWidget from '../components/FeedbackWidget';
import OptimizedPersonalTimeCalculator from '../components/OptimizedPersonalTimeCalculator';
import RealTimeCalculator from '../components/RealTimeCalculator';
import { analytics } from '../services/analyticsEnhanced';

interface TimeConversionResult {
    cryptoValue: number;
    hourlyWage: number;
    hoursOfWork: number;
    daysOfWork: number;
    weeksOfWork: number;
    timeBreakdown: {
        years: number;
        months: number;
        days: number;
        hours: number;
    };
}

interface CryptoPrice {
    id: string;
    current_price: number;
    price_change_percentage_24h: number;
    last_updated: string;
}

interface HomePageProps {
    initialCryptoPrices: CryptoPrice[];
    metalsPrices: {
        gold: number;
        silver: number;
        platinum: number;
    };
    pageGenerated: string;
}

interface TVLTEarning {
    amount: number;
    type: string;
    timestamp: Date;
}

export default function Home({ initialCryptoPrices, metalsPrices, pageGenerated }: HomePageProps) {
    const [activeTab, setActiveTab] = useState<'time-calc' | 'quiz' | 'real-time'>('time-calc');
    const [tvltEarnings, setTvltEarnings] = useState<TVLTEarning[]>([]);
    const [totalTVLT, setTotalTVLT] = useState(0);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumTrigger, setPremiumTrigger] = useState<string>('');

    // Client-side monitoring initialization
    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Dynamic import for client-side only modules
            import('../lib/analytics').then(({ analytics }) => {
                analytics.trackEvent('page_view', {
                    category: 'navigation',
                    page: 'home',
                    timestamp: Date.now()
                });
            }).catch(error => {
                console.warn('Failed to initialize analytics:', error);
            });
        }
    }, []);

    // Optimized TVLT earning handler
    const handleTVLTEarned = useCallback((amount: number, type: string) => {
        const earning: TVLTEarning = {
            amount,
            type,
            timestamp: new Date()
        };

        setTvltEarnings(prev => {
            const newEarnings = [...prev, earning];
            return newEarnings.length > 50 ? newEarnings.slice(-50) : newEarnings;
        });

        setTotalTVLT(prev => prev + amount);

        // Show notification
        if (typeof window !== 'undefined') {
            showEarningNotification(amount, type);
        }
    }, []);

    // Notification system
    const showEarningNotification = (amount: number, type: string) => {
        const notification = document.createElement('div');
        notification.className = 'tvlt-notification';
        notification.innerHTML = `
      <div class="tvlt-notification-content">
        <span class="tvlt-icon">🪙</span>
        <span class="tvlt-amount">+${amount} TVLT</span>
        <span class="tvlt-type">${type.replace('_', ' ')}</span>
      </div>
    `;

        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(45deg, #D4AF37, #F4C430);
      color: #001F3F;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      font-weight: 700;
      z-index: 1000;
      animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s;
      box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
      transform: translateX(100%);
      transition: transform 0.3s ease;
    `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });

        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 2700);
    };

    // Premium trigger handler
    const handlePremiumTrigger = useCallback((trigger: string) => {
        setPremiumTrigger(trigger);
        setShowPremiumModal(true);
    }, []);

    const closePremiumModal = useCallback(() => {
        setShowPremiumModal(false);
        setPremiumTrigger('');
    }, []);

    const tabs = [
        { id: 'time-calc', label: '⏰ Time Calculator', description: 'Convert crypto to personal time' },
        { id: 'quiz', label: '🧠 Education Quiz', description: 'Learn and earn TVLT' },
        { id: 'real-time', label: '📊 Live Prices', description: 'Real-time conversions' }
    ];

    return (
        <>
            <Head>
                <title>TimeVault - Convert Crypto to Time & Precious Metals | Live Calculator</title>
                <meta name="description" content={`Convert Bitcoin ($${initialCryptoPrices.find(p => p.id === 'bitcoin')?.current_price?.toLocaleString() || 'N/A'}), Ethereum, and crypto to time equivalents. Real-time precious metals pricing. Educational quizzes with TVLT rewards.`} />
                <meta name="robots" content="index, follow" />
                <link rel="canonical" href="https://timevault.vercel.app/" />

                {/* Structured data for rich snippets */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "WebApplication",
                            "name": "TimeVault Calculator",
                            "description": "Convert cryptocurrency to time and precious metals",
                            "url": "https://timevault.vercel.app",
                            "applicationCategory": "FinanceApplication",
                            "offers": {
                                "@type": "Offer",
                                "price": "0",
                                "priceCurrency": "USD"
                            },
                            "featureList": [
                                "Bitcoin to time conversion",
                                "Ethereum calculator",
                                "Precious metals pricing",
                                "Educational crypto quizzes",
                                "TVLT token rewards"
                            ]
                        })
                    }}
                />
            </Head>

            <div className="timevault-day1-app">
                {/* Header with SEO-optimized content */}
                <header className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">
                            <span className="vault-icon">🏛️</span>
                            TimeVault
                            <span className="version-tag">v2.0</span>
                        </h1>
                        <div className="tvlt-balance">
                            <span className="tvlt-icon">🪙</span>
                            <span className="balance-amount">{totalTVLT.toLocaleString()}</span>
                            <span className="balance-label">TVLT</span>
                        </div>
                    </div>
                    <h2 className="app-tagline">Transform crypto into time & precious metals</h2>

                    {/* SEO-friendly pricing display */}
                    <div className="price-ticker" style={{ fontSize: '0.9rem', marginTop: '1rem' }}>
                        <span>Live Prices: </span>
                        <span>BTC ${initialCryptoPrices.find(p => p.id === 'bitcoin')?.current_price?.toLocaleString() || 'Loading...'}</span>
                        {' | '}
                        <span>ETH ${initialCryptoPrices.find(p => p.id === 'ethereum')?.current_price?.toLocaleString() || 'Loading...'}</span>
                        {' | '}
                        <span>Gold ${metalsPrices.gold}/oz</span>
                    </div>
                </header>

                {/* Navigation with SEO-friendly structure */}
                <nav className="app-navigation" role="navigation" aria-label="Main navigation">
                    <div className="nav-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                                aria-pressed={activeTab === tab.id}
                                aria-describedby={`tab-${tab.id}-desc`}
                            >
                                <span className="tab-label">{tab.label}</span>
                                <span className="tab-description" id={`tab-${tab.id}-desc`}>{tab.description}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Main content with semantic structure */}
                <main className="app-main" role="main">
                    {activeTab === 'time-calc' && (
                        <section aria-labelledby="time-calc-heading">
                            <h3 id="time-calc-heading" className="sr-only">Personal Time Calculator</h3>
                            <OptimizedPersonalTimeCalculator
                                onShare={(result: TimeConversionResult) => {
                                    handleTVLTEarned(20, 'time_share');
                                    analytics.trackConversion('share', result.cryptoValue, {
                                        crypto_amount: result.cryptoValue,
                                        hours_of_work: result.hoursOfWork
                                    });
                                }}
                                onPremiumTrigger={(trigger: string) => {
                                    handlePremiumTrigger(trigger);
                                    analytics.trackEvent('premium_trigger', {
                                        category: 'conversion',
                                        trigger,
                                        crypto_value: 'high_value_calculation'
                                    });
                                }}
                            />
                        </section>
                    )}

                    {activeTab === 'quiz' && (
                        <section aria-labelledby="quiz-heading">
                            <h3 id="quiz-heading" className="sr-only">Educational Quiz</h3>
                            <EducationalQuiz
                                onTVLTEarned={handleTVLTEarned}
                                onPremiumTrigger={handlePremiumTrigger}
                            />
                        </section>
                    )}

                    {activeTab === 'real-time' && (
                        <section aria-labelledby="realtime-heading">
                            <h3 id="realtime-heading" className="sr-only">Real-time Calculator</h3>
                            <RealTimeCalculator initialCryptoPrices={initialCryptoPrices} />
                        </section>
                    )}
                </main>

                {/* Recent TVLT Earnings */}
                {tvltEarnings.length > 0 && (
                    <aside className="recent-earnings" aria-labelledby="earnings-heading">
                        <h3 id="earnings-heading">Recent TVLT Earnings</h3>
                        <div className="earnings-list">
                            {tvltEarnings.slice(-5).reverse().map((earning, index) => (
                                <div key={index} className="earning-item">
                                    <span className="earning-amount">+{earning.amount}</span>
                                    <span className="earning-type">{earning.type.replace('_', ' ')}</span>
                                    <span className="earning-time">
                                        {earning.timestamp.toLocaleTimeString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Premium Modal */}
                {showPremiumModal && (
                    <div className="premium-modal-overlay" onClick={closePremiumModal}>
                        <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
                            <button className="close-modal" onClick={closePremiumModal} aria-label="Close premium modal">×</button>
                            <div className="premium-content">
                                <h2>🚀 Unlock Premium Features</h2>
                                <div className="premium-benefits">
                                    {premiumTrigger === 'high_value_time' && (
                                        <>
                                            <h3>High-Value Time Analysis</h3>
                                            <ul>
                                                <li>✨ Advanced time optimization strategies</li>
                                                <li>📊 Historical time value trends</li>
                                                <li>🎯 Personalized investment insights</li>
                                                <li>⚡ Priority calculation processing</li>
                                            </ul>
                                        </>
                                    )}
                                    {/* Other premium triggers... */}
                                </div>
                                <div className="premium-pricing">
                                    <div className="price-tag">
                                        <span className="price">$9.99</span>
                                        <span className="period">/month</span>
                                    </div>
                                    <button className="subscribe-btn">
                                        🚀 Start Premium Trial
                                    </button>
                                    <p className="guarantee">30-day money-back guarantee</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <FeedbackWidget context="main_app" />

                {/* Hidden content for SEO */}
                <div className="sr-only">
                    <h2>TimeVault - Cryptocurrency Time Value Calculator</h2>
                    <p>
                        TimeVault helps you understand the true time value of your cryptocurrency investments.
                        Convert Bitcoin, Ethereum, and other digital assets into personal time equivalents and precious metals pricing.
                    </p>
                    <p>Page generated: {pageGenerated}</p>
                </div>

                {/* Animation styles */}
                <style dangerouslySetInnerHTML={{
                    __html: `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
        `}} />
            </div>
        </>
    );
}

// Static Site Generation - Pre-fetch crypto and metals data
export const getStaticProps: GetStaticProps = async () => {
    try {
        // Fetch crypto prices
        const cryptoResponse = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink,solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true'
        );

        let cryptoPrices: CryptoPrice[] = [];
        if (cryptoResponse.ok) {
            const cryptoData = await cryptoResponse.json();
            cryptoPrices = Object.entries(cryptoData).map(([id, data]: [string, any]) => ({
                id,
                current_price: data.usd,
                price_change_percentage_24h: data.usd_24h_change || 0,
                last_updated: new Date().toISOString()
            }));
        }

        // Fetch metals prices
        let metalsPrices = { gold: 2000, silver: 25, platinum: 1000 }; // Fallback
        try {
            const metalsResponse = await fetch('https://metals.live/v1/spot');
            if (metalsResponse.ok) {
                const metalsData = await metalsResponse.json();
                metalsPrices = {
                    gold: metalsData.gold || 2000,
                    silver: metalsData.silver || 25,
                    platinum: metalsData.platinum || 1000
                };
            }
        } catch (error) {
            console.warn('Metals API failed, using fallback prices');
        }

        return {
            props: {
                initialCryptoPrices: cryptoPrices,
                metalsPrices,
                pageGenerated: new Date().toISOString()
            },
            revalidate: 300 // Revalidate every 5 minutes
        };
    } catch (error) {
        console.error('Failed to fetch data:', error);

        // Fallback data
        return {
            props: {
                initialCryptoPrices: [
                    { id: 'bitcoin', current_price: 50000, price_change_percentage_24h: 2.5, last_updated: new Date().toISOString() },
                    { id: 'ethereum', current_price: 3000, price_change_percentage_24h: 1.8, last_updated: new Date().toISOString() }
                ],
                metalsPrices: { gold: 2000, silver: 25, platinum: 1000 },
                pageGenerated: new Date().toISOString()
            },
            revalidate: 300
        };
    }
};
