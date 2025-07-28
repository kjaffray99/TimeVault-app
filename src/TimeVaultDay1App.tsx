import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import EducationalQuiz from './components/EducationalQuiz';
import FeedbackWidget from './components/FeedbackWidget';
import PersonalTimeCalculator from './components/PersonalTimeCalculator';
import RealTimeCalculator from './components/RealTimeCalculator';
import { analytics } from './services/analyticsEnhanced';
import { monitoring } from './services/monitoringService';
import './styles/day1-app.css';
import './styles/gamification.css';
import { PerformanceOptimizer, optimizeMemory } from './utils/performanceOptimizer';

// Create optimized QueryClient with performance settings
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 5 * 60 * 1000, // 5 minutes
            staleTime: 30 * 1000, // 30 seconds - faster refresh
            retry: 2, // Reduced retries for better performance
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 1,
        },
    },
});

interface TVLTEarning {
    amount: number;
    type: string;
    timestamp: Date;
}

const TimeVaultDay1App: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'time-calc' | 'quiz' | 'real-time'>('time-calc');
    const [tvltEarnings, setTvltEarnings] = useState<TVLTEarning[]>([]);
    const [totalTVLT, setTotalTVLT] = useState(0);
    const [showPremiumModal, setShowPremiumModal] = useState(false);
    const [premiumTrigger, setPremiumTrigger] = useState<string>('');
    const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

    // Initialize performance monitoring and analytics
    useEffect(() => {
        // Start comprehensive monitoring
        monitoring.startMonitoring();

        // Set up performance alerts
        monitoring.setAlert('slow_page_load', 2000, () => {
            console.warn('🐌 Page load performance degraded');
            analytics.trackEvent('performance_alert', {
                category: 'performance',
                alert_type: 'slow_page_load'
            });
        });

        monitoring.setAlert('high_memory_usage', 100, () => {
            console.warn('🧠 High memory usage detected');
            analytics.trackEvent('performance_alert', {
                category: 'performance',
                alert_type: 'high_memory_usage'
            });
        });

        // Track app initialization
        analytics.trackEvent('app_initialized', {
            category: 'app_lifecycle',
            timestamp: Date.now(),
            version: '1.0'
        });

        // Performance metrics reporting
        const metricsInterval = setInterval(() => {
            const metrics = PerformanceOptimizer.reportMetrics();
            setPerformanceMetrics(metrics);
        }, 30000); // Every 30 seconds

        return () => {
            monitoring.stopMonitoring();
            clearInterval(metricsInterval);
        };
    }, []);

    // Optimized TVLT earning with performance tracking
    const handleTVLTEarned = useCallback((amount: number, type: string) => {
        PerformanceOptimizer.measureOperation('tvlt_earning', () => {
            const earning: TVLTEarning = {
                amount,
                type,
                timestamp: new Date()
            };

            setTvltEarnings(prev => {
                // Limit earnings history to prevent memory issues
                const newEarnings = [...prev, earning];
                return newEarnings.length > 50 ? newEarnings.slice(-50) : newEarnings;
            });

            setTotalTVLT(prev => prev + amount);

            // Optimized notification system
            showEarningNotification(amount, type);

            // Enhanced analytics tracking
            analytics.trackEvent('tvlt_earned', {
                category: 'gamification',
                type,
                amount,
                total_tvlt: totalTVLT + amount
            });
        });
    }, [totalTVLT]);

    // High-performance notification system
    const showEarningNotification = useMemo(() =>
        optimizeMemory.throttle((amount: number, type: string) => {
            // Create optimized notification element
            const notification = document.createElement('div');
            notification.className = 'tvlt-notification';
            notification.innerHTML = `
                <div class="tvlt-notification-content">
                    <span class="tvlt-icon">🪙</span>
                    <span class="tvlt-amount">+${amount} TVLT</span>
                    <span class="tvlt-type">${type.replace('_', ' ')}</span>
                </div>
            `;

            // Optimized styles
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

            // Trigger animation
            requestAnimationFrame(() => {
                notification.style.transform = 'translateX(0)';
            });

            // Cleanup with performance consideration
            const cleanup = setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, 2700);

            return cleanup;
        }, 500), // Throttle to prevent notification spam
        []);

    // Optimized premium trigger with analytics
    const handlePremiumTrigger = useCallback((trigger: string) => {
        PerformanceOptimizer.measureOperation('premium_trigger', () => {
            setPremiumTrigger(trigger);
            setShowPremiumModal(true);

            analytics.trackConversion('premium_trigger', 0, {
                trigger,
                timestamp: Date.now(),
                user_context: {
                    total_tvlt: totalTVLT,
                    current_tab: activeTab
                }
            });
        });
    }, [totalTVLT, activeTab]);

    const closePremiumModal = useCallback(() => {
        setShowPremiumModal(false);
        setPremiumTrigger('');
        analytics.trackEvent('premium_modal_closed', {
            category: 'conversion',
            trigger: premiumTrigger
        });
    }, [premiumTrigger]);

    const tabs = [
        { id: 'time-calc', label: '⏰ Time Calculator', description: 'Convert crypto to personal time' },
        { id: 'quiz', label: '🧠 Education Quiz', description: 'Learn and earn TVLT' },
        { id: 'real-time', label: '📊 Live Prices', description: 'Real-time conversions' }
    ];

    return (
        <QueryClientProvider client={queryClient}>
            <div className="timevault-day1-app">
                {/* Header with TVLT Balance */}
                <header className="app-header">
                    <div className="header-content">
                        <h1 className="app-title">
                            <span className="vault-icon">🏛️</span>
                            TimeVault
                            <span className="version-tag">Day 1</span>
                        </h1>
                        <div className="tvlt-balance">
                            <span className="tvlt-icon">🪙</span>
                            <span className="balance-amount">{totalTVLT.toLocaleString()}</span>
                            <span className="balance-label">TVLT</span>
                        </div>
                        {performanceMetrics && (
                            <div className="performance-indicator" title="App Performance Status">
                                <span className="perf-icon">⚡</span>
                                <span className="perf-status">{
                                    performanceMetrics.averageResponseTime < 100 ? 'Excellent' :
                                        performanceMetrics.averageResponseTime < 300 ? 'Good' : 'OK'
                                }</span>
                            </div>
                        )}
                    </div>
                    <p className="app-tagline">Transform crypto into time & precious metals</p>
                </header>

                {/* Navigation Tabs */}
                <nav className="app-navigation">
                    <div className="nav-tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                <span className="tab-label">{tab.label}</span>
                                <span className="tab-description">{tab.description}</span>
                            </button>
                        ))}
                    </div>
                </nav>

                {/* Main Content */}
                <main className="app-main">
                    {activeTab === 'time-calc' && (
                        <PersonalTimeCalculator
                            onShare={(_result) => {
                                handleTVLTEarned(20, 'time_share');
                            }}
                            onPremiumTrigger={handlePremiumTrigger}
                        />
                    )}

                    {activeTab === 'quiz' && (
                        <EducationalQuiz
                            onTVLTEarned={handleTVLTEarned}
                            onPremiumTrigger={handlePremiumTrigger}
                        />
                    )}

                    {activeTab === 'real-time' && (
                        <RealTimeCalculator />
                    )}
                </main>

                {/* Recent TVLT Earnings */}
                {tvltEarnings.length > 0 && (
                    <aside className="recent-earnings">
                        <h3>Recent TVLT Earnings</h3>
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
                            <button className="close-modal" onClick={closePremiumModal}>×</button>
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
                                    {premiumTrigger === 'time_insights' && (
                                        <>
                                            <h3>Time Optimization Tips</h3>
                                            <ul>
                                                <li>🧠 AI-powered time allocation advice</li>
                                                <li>📈 Maximize your time-to-crypto ratio</li>
                                                <li>🔮 Future value predictions</li>
                                                <li>🏆 Exclusive productivity strategies</li>
                                            </ul>
                                        </>
                                    )}
                                    {premiumTrigger === 'unlimited_quizzes' && (
                                        <>
                                            <h3>Unlimited Educational Access</h3>
                                            <ul>
                                                <li>🎓 Unlimited daily quizzes</li>
                                                <li>🏆 Advanced quiz categories</li>
                                                <li>💎 Exclusive crypto masterclasses</li>
                                                <li>🚀 3x TVLT earning rate</li>
                                            </ul>
                                        </>
                                    )}
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

                {/* Performance Feedback Widget */}
                <FeedbackWidget context="main_app" />

                {/* Success Animation CSS */}
                <style>{`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
            }
            to {
              opacity: 0;
            }
          }
        `}</style>
            </div>
        </QueryClientProvider>
    );
};

export default TimeVaultDay1App;
