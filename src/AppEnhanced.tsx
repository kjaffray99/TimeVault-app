import { useEffect, useState } from 'react';
import './App.css';
import Calculator from './components/Calculator/Calculator';
import ComplianceModal from './components/ComplianceModal';
import Dashboard from './components/Dashboard/Dashboard';
import DebugTest from './components/DebugTest';
import { ErrorBoundary } from './components/ErrorBoundary';
import Footer from './components/Footer/Footer';
import GamificationEngine from './components/GamificationEngine';
import Header from './components/Header/Header';
import Premium from './components/Premium/Premium';
import RevenueOptimizer from './components/RevenueOptimizer/RevenueOptimizer';
// NEW: Import revenue-critical components
import { InteractiveQuizEngine } from './components/InteractiveQuizEngine';
import { PremiumUpsell } from './components/PremiumUpsell';
import { RevenueAnalytics } from './components/RevenueAnalytics';
import { UserProvider } from './contexts';
import { useAnalytics } from './hooks/useAnalytics';
import { useApiEnhanced } from './hooks/useApiEnhanced';
import { monitoring } from './services/monitoringService';
import './styles/day1-app.css';
import './styles/enhanced-theme.css'; // Enhanced gold/blue theme
import './styles/gold-blue-theme-main.css'; // Revenue-optimized theme

// Enhanced user engagement tracking
interface UserEngagement {
    quizzesTaken: number;
    calculationsPerformed: number;
    timeSpent: number;
    streakDays: number;
    tvltTokens: number;
    premiumInterest: number;
}

function App() {
    console.log('🚀 App component rendering... [REVENUE CRITICAL FIX - Enhanced]');

    const { track } = useAnalytics();
    const { loading, error, getPerformanceStatus } = useApiEnhanced();

    // Original state
    const [showCompliance, setShowCompliance] = useState(false);
    const [complianceAccepted, setComplianceAccepted] = useState(false);
    const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'premium' | 'quiz' | 'analytics'>('calculator');
    const [debugMode, setDebugMode] = useState(false);

    // NEW: Revenue-focused state
    const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);
    const [upsellTrigger, setUpsellTrigger] = useState<'quiz_hint' | 'calculator_limit' | 'dashboard_feature' | 'manual'>('manual');
    const [userEngagement, setUserEngagement] = useState<UserEngagement>({
        quizzesTaken: 0,
        calculationsPerformed: 0,
        timeSpent: 0,
        streakDays: 1,
        tvltTokens: 0,
        premiumInterest: 0
    });

    console.log('📊 Enhanced App state:', {
        showCompliance,
        complianceAccepted,
        activeTab,
        userEngagement,
        showPremiumUpsell
    });

    // Track user session time
    useEffect(() => {
        const startTime = Date.now();

        const updateTimeSpent = () => {
            setUserEngagement(prev => ({
                ...prev,
                timeSpent: Date.now() - startTime
            }));
        };

        const interval = setInterval(updateTimeSpent, 10000); // Update every 10 seconds
        return () => clearInterval(interval);
    }, []);

    // Smart upsell triggers based on user behavior
    useEffect(() => {
        const { calculationsPerformed, quizzesTaken, timeSpent } = userEngagement;

        // Trigger premium upsell after significant engagement
        if (calculationsPerformed >= 5 && !showPremiumUpsell) {
            setUpsellTrigger('calculator_limit');
            setShowPremiumUpsell(true);
        } else if (quizzesTaken >= 2 && !showPremiumUpsell) {
            setUpsellTrigger('quiz_hint');
            setShowPremiumUpsell(true);
        } else if (timeSpent > 300000 && !showPremiumUpsell) { // 5 minutes
            setUpsellTrigger('dashboard_feature');
            setShowPremiumUpsell(true);
        }
    }, [userEngagement, showPremiumUpsell]);

    useEffect(() => {
        console.log('🔍 Checking compliance status...');

        // Initialize monitoring service
        monitoring.startMonitoring();
        console.log('📊 Performance monitoring started');

        // Check for debug mode in URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('debug') === 'true') {
            setDebugMode(true);
            console.log('🧪 Debug mode enabled');
            return;
        }

        // Check if compliance was previously accepted
        if (typeof window !== 'undefined') {
            const accepted = localStorage.getItem('timevault_compliance_accepted');
            console.log('💾 Compliance accepted from localStorage:', accepted);
            if (!accepted) {
                setShowCompliance(true);
                console.log('⚠️ Showing compliance modal');
            } else {
                setComplianceAccepted(true);
                console.log('✅ Compliance already accepted');
            }
        }

        // Track app initialization
        track('app_initialized', {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`
        });
    }, [track]);

    const handleComplianceAccept = () => {
        console.log('✅ User accepted compliance');
        localStorage.setItem('timevault_compliance_accepted', 'true');
        setComplianceAccepted(true);
        setShowCompliance(false);

        track('compliance_accepted', {
            timestamp: new Date().toISOString()
        });
    };

    // Revenue event handlers
    const handleCalculationPerformed = () => {
        setUserEngagement(prev => ({
            ...prev,
            calculationsPerformed: prev.calculationsPerformed + 1
        }));

        track('calculation_performed', {
            total_calculations: userEngagement.calculationsPerformed + 1,
            session_time: userEngagement.timeSpent
        });
    };

    const handleQuizCompleted = () => {
        setUserEngagement(prev => ({
            ...prev,
            quizzesTaken: prev.quizzesTaken + 1
        }));
    };

    const handleRewardEarned = (amount: number) => {
        setUserEngagement(prev => ({
            ...prev,
            tvltTokens: prev.tvltTokens + amount
        }));
    };

    const handlePremiumInterest = () => {
        setUserEngagement(prev => ({
            ...prev,
            premiumInterest: prev.premiumInterest + 1
        }));
        setUpsellTrigger('manual');
        setShowPremiumUpsell(true);

        track('premium_interest', {
            trigger: 'manual',
            engagement_level: userEngagement.calculationsPerformed + userEngagement.quizzesTaken
        });
    };

    const handleUpgrade = (tier: string) => {
        console.log('💰 Upgrade to:', tier);

        track('upgrade_attempted', {
            tier,
            user_engagement: userEngagement,
            timestamp: new Date().toISOString()
        });

        // In production, integrate with payment processor
        alert(`Redirecting to payment for ${tier}...`);
        setShowPremiumUpsell(false);
    };

    const handleOptimizationSuggestion = (suggestion: string) => {
        console.log('⚡ Optimization suggestion:', suggestion);
        track('optimization_suggestion', { suggestion });
        // In production, implement suggestion or show implementation modal
        alert(`Implementing: ${suggestion}`);
    };

    // Debug mode override
    if (debugMode) {
        return (
            <ErrorBoundary>
                <div style={{ padding: '20px', fontFamily: 'monospace' }}>
                    <h1>🧪 Debug Mode</h1>
                    <DebugTest />
                </div>
            </ErrorBoundary>
        );
    }

    // Show compliance modal first
    if (showCompliance && !complianceAccepted) {
        return (
            <ErrorBoundary>
                <ComplianceModal
                    onAccept={handleComplianceAccept}
                    onDecline={() => {
                        console.log('❌ User declined compliance');
                        alert('You must accept the terms to use TimeVault');
                    }}
                />
            </ErrorBoundary>
        );
    }

    const performanceStatus = getPerformanceStatus();

    return (
        <ErrorBoundary>
            <UserProvider>
                <div className="app-container" style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #001F3F 0%, #003366 50%, #001F3F 100%)',
                    color: '#FFFFFF'
                }}>
                    {/* Enhanced Header with Performance Status */}
                    <Header
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        tvltBalance={userEngagement.tvltTokens}
                        performanceStatus={performanceStatus.status}
                    />

                    {/* Loading State */}
                    {loading && (
                        <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 31, 63, 0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 9999,
                            color: '#D4AF37'
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    border: '4px solid rgba(212, 175, 55, 0.3)',
                                    borderTop: '4px solid #D4AF37',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite',
                                    margin: '0 auto 1rem'
                                }} />
                                <p>Loading TimeVault Revenue Engine...</p>
                            </div>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: '#FFFFFF',
                            padding: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <span>⚠️ {error}</span>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.2)',
                                    border: '1px solid #FFFFFF',
                                    color: '#FFFFFF',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Always visible gamification engine */}
                    <GamificationEngine
                        onRewardEarned={handleRewardEarned}
                        userStats={{
                            calculationsToday: userEngagement.calculationsPerformed,
                            quizzesCompleted: userEngagement.quizzesTaken,
                            streakDays: userEngagement.streakDays,
                            totalTokens: userEngagement.tvltTokens
                        }}
                    />

                    {/* Main Content */}
                    <main style={{ padding: '2rem' }}>
                        {activeTab === 'calculator' && (
                            <Calculator
                                onCalculationPerformed={handleCalculationPerformed}
                                onPremiumInterest={handlePremiumInterest}
                            />
                        )}

                        {activeTab === 'dashboard' && (
                            <Dashboard />
                        )}

                        {activeTab === 'premium' && (
                            <Premium onUpgrade={handleUpgrade} />
                        )}

                        {activeTab === 'quiz' && (
                            <InteractiveQuizEngine
                                onRewardEarned={handleRewardEarned}
                                onPremiumInterest={handlePremiumInterest}
                            />
                        )}

                        {activeTab === 'analytics' && (
                            <RevenueAnalytics
                                isVisible={true}
                                onOptimizationSuggestion={handleOptimizationSuggestion}
                            />
                        )}

                        {/* Revenue Optimization Section */}
                        <RevenueOptimizer
                            userEngagement={userEngagement}
                            onOptimizationTrigger={handleOptimizationSuggestion}
                        />

                        {/* Performance-based CTAs */}
                        <div style={{
                            marginTop: '3rem',
                            background: 'rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '2rem',
                            border: '2px solid rgba(212, 175, 55, 0.3)'
                        }}>
                            <h3 style={{ color: '#D4AF37', marginBottom: '1rem' }}>
                                🚀 Maximize Your Returns
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    background: 'rgba(212, 175, 55, 0.1)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <h4>📊 Your Progress</h4>
                                    <p>{userEngagement.calculationsPerformed} calculations today</p>
                                    <p>{userEngagement.tvltTokens} TVLT earned</p>
                                </div>
                                <div style={{
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <h4>⚡ Performance</h4>
                                    <p>Status: {performanceStatus.status}</p>
                                    <p>Response: {performanceStatus.details.responseTime}</p>
                                </div>
                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    padding: '1.5rem',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <button
                                        onClick={handlePremiumInterest}
                                        style={{
                                            background: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)',
                                            color: '#001F3F',
                                            border: 'none',
                                            padding: '1rem 2rem',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            fontWeight: 'bold',
                                            width: '100%'
                                        }}
                                    >
                                        👑 Upgrade to Premium
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>

                    <Footer />

                    {/* Premium Upsell Modal */}
                    <PremiumUpsell
                        isOpen={showPremiumUpsell}
                        onClose={() => setShowPremiumUpsell(false)}
                        trigger={upsellTrigger}
                        userEngagement={userEngagement}
                        onUpgrade={handleUpgrade}
                    />

                    {/* Global Styles */}
                    <style jsx global>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            .app-container {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
          `}</style>
                </div>
            </UserProvider>
        </ErrorBoundary>
    );
}

export default App;
