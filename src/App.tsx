import React, { useEffect, useState } from 'react';
import './App.css';
import Calculator from './components/Calculator/Calculator';
import ComplianceModal from './components/ComplianceModal';
import Dashboard from './components/Dashboard/Dashboard';
import DebugTest from './components/DebugTest';
import { ErrorBoundary } from './components/ErrorBoundary';
import Footer from './components/Footer/Footer';
import GamificationEngine from './components/GamificationEngine';
import Header from './components/Header/Header';
import OptimizedPersonalTimeCalculator from './components/OptimizedPersonalTimeCalculator';
import Premium from './components/Premium/Premium';
import RevenueOptimizer from './components/RevenueOptimizer/RevenueOptimizer';
// NEW: Import revenue-critical components
import { InteractiveQuizEngine } from './components/InteractiveQuizEngine';
import { PremiumUpsell } from './components/PremiumUpsell';
// import { RevenueAnalytics } from './components/RevenueAnalytics';
// DAY 3-5: Advanced components for viral growth and monetization
import ABTestingEngine from './components/ABTestingEngine';
import AdvancedAnalytics from './components/AdvancedAnalytics';
import PaymentIntegration from './components/PaymentIntegration';
import ViralGrowthEngine from './components/ViralGrowthEngine';
// import MobileAppFoundation from './components/MobileAppFoundation';
import AdvancedMonetizationEngine from './components/AdvancedMonetizationEngine';
import { UserProvider } from './contexts';
import { useAnalytics } from './hooks/useAnalytics';
// import { useApiEnhanced } from './hooks/useApiEnhanced';
import { monitoring } from './services/monitoringService';
import './styles/day1-app.css';
import './styles/enhanced-theme.css'; // Enhanced gold/blue theme
import './styles/gold-blue-theme-main.css'; // Revenue-optimized theme
// IMMEDIATE REVENUE ACTIVATION
import LiveUserMetricsTracker from './components/LiveUserMetricsTracker';
import UrgentConversionSystem, { useUrgentConversion } from './components/UrgentConversionSystem';

// Enhanced user engagement tracking
// interface UserEngagement {
//   quizzesTaken: number;
//   calculationsPerformed: number;
//   timeSpent: number;
//   streakDays: number;
//   tvltTokens: number;
//   premiumInterest: number;
// }

// Revenue-critical fallback calculator with upsell hooks
const FallbackCalculator = ({ onPremiumInterest }: { onPremiumInterest: () => void }) => (
  <div style={{
    background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
    color: '#D4AF37',
    padding: '2rem',
    borderRadius: '16px',
    margin: '2rem',
    textAlign: 'center',
    minHeight: '400px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡ TimeVault Calculator</h2>
    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
      Transform your crypto into precious metals and time value
    </p>
    <div style={{
      background: 'rgba(212, 175, 55, 0.1)',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '2px solid #D4AF37',
      marginBottom: '1.5rem'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>🚧 Revenue Engine Loading...</h3>
      <p>Premium calculator features initializing for immediate profit generation</p>
    </div>
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: '#D4AF37',
          color: '#001F3F',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🔄 Load Calculator
      </button>
      <button
        onClick={onPremiumInterest}
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          color: '#D4AF37',
          border: '2px solid #D4AF37',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        👑 Get Premium Access
      </button>
    </div>
  </div>
);

function App() {
  console.log('🚀 App component rendering... [REVENUE CRITICAL FIX]');

  const { track } = useAnalytics();
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'premium'>('calculator');
  const [debugMode, setDebugMode] = useState(false);

  // IMMEDIATE REVENUE ACTIVATION: Urgent conversion system
  const { showOffer, setShowOffer, calculationValue, triggerOffer, handlePremiumSignup } = useUrgentConversion();

  // DAY 3-5: Advanced state management for viral growth and monetization
  const [userMetrics, setUserMetrics] = useState({
    totalReferrals: 7,
    monthlyRevenue: 2450,
    lifetimeValue: 8900,
    calculationsPerformed: 45,
    quizzesTaken: 12,
    tvltTokens: 750,
    premiumStatus: false,
    timeSpent: 0,
    streakDays: 0
  });
  const [currentPlan, setCurrentPlan] = useState('free');
  const [analyticsTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  console.log('📊 App state:', { showCompliance, complianceAccepted, activeTab });

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

  }, []);

  const handleComplianceAccept = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('timevault_compliance_accepted', 'true');
    }
    setComplianceAccepted(true);
    setShowCompliance(false);
    track('compliance_accepted', { timestamp: new Date().toISOString() });
  };

  const handleComplianceDecline = () => {
    track('compliance_declined', { timestamp: new Date().toISOString() });
    // Redirect user away or show limited functionality
    window.location.href = 'https://www.google.com';
  };

  console.log('🎨 About to render with state:', {
    showCompliance,
    complianceAccepted,
    shouldShowMainApp: complianceAccepted || !showCompliance,
    debugMode
  });

  // Debug mode override
  if (debugMode) {
    return <DebugTest />;
  }

  // Ensure app is always visible with fallback
  const shouldShowApp = complianceAccepted || !showCompliance;

  return (
    <ErrorBoundary>
      <UserProvider>
        <div
          className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 text-white"
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #001F3F 0%, #002A5C 50%, #003366 100%)',
            color: '#FFFFFF',
            position: 'relative',
            visibility: 'visible',
            opacity: 1
          }}
        >
          {/* Debug output - visible in top right */}
          <div style={{
            position: 'fixed',
            top: '10px',
            right: '10px',
            background: 'rgba(212, 175, 55, 0.95)',
            color: '#001F3F',
            padding: '12px',
            fontSize: '11px',
            zIndex: 9999,
            maxWidth: '280px',
            borderRadius: '8px',
            fontFamily: 'monospace',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            <strong>🔧 TimeVault Debug:</strong><br />
            showCompliance: {showCompliance.toString()}<br />
            complianceAccepted: {complianceAccepted.toString()}<br />
            activeTab: {activeTab}<br />
            shouldShowApp: {shouldShowApp.toString()}<br />
            timestamp: {new Date().toLocaleTimeString()}
          </div>

          {/* Always show Header and main app - compliance modal will overlay if needed */}
          <Header
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          <main className="container mx-auto px-4 py-8" style={{ minHeight: '60vh' }}>
            {/* IMMEDIATE REVENUE ACTIVATION: Live metrics to show social proof */}
            <LiveUserMetricsTracker />

            <ErrorBoundary>
              {activeTab === 'calculator' && (
                <React.Suspense fallback={<FallbackCalculator onPremiumInterest={() => setActiveTab('premium')} />}>
                  <div>
                    <Calculator />
                    <GamificationEngine />
                    <OptimizedPersonalTimeCalculator
                      onShare={(result) => {
                        track('optimized_calculator_share', {
                          crypto_value: result.cryptoValue,
                          hours_of_work: result.hoursOfWork
                        });

                        // REVENUE CRITICAL: Trigger urgent conversion for high-value calculations
                        if (result.cryptoValue > 1000) {
                          triggerOffer(result.cryptoValue);
                        }
                      }}
                      onPremiumTrigger={(trigger) => {
                        track('premium_trigger', { trigger });
                        setActiveTab('premium');
                      }}
                    />

                    {/* DAY 3-5: Advanced Revenue Components */}
                    <ViralGrowthEngine
                      onShareGenerated={(shareData) => {
                        track('viral_share_generated', { type: shareData.type });
                        setUserMetrics(prev => ({ ...prev, totalReferrals: prev.totalReferrals + 1 }));
                      }}
                      onReferralCreated={(code) => track('referral_code_created', { code })}
                      userStats={userMetrics}
                    />

                    <AdvancedMonetizationEngine
                      currentPlan={currentPlan}
                      onUpgrade={(planId) => {
                        setCurrentPlan(planId);
                        track('plan_upgraded', { from: currentPlan, to: planId });
                      }}
                      onAffiliateJoin={(program) => track('affiliate_program_joined', { program })}
                      userMetrics={userMetrics}
                    />

                    <InteractiveQuizEngine
                      onRewardEarned={(amount) => {
                        track('quiz_reward_earned', { amount });
                        setUserMetrics(prev => ({
                          ...prev,
                          quizzesTaken: prev.quizzesTaken + 1,
                          tvltTokens: prev.tvltTokens + amount
                        }));
                      }}
                      onPremiumInterest={() => setActiveTab('premium')}
                    />

                    <PremiumUpsell
                      isOpen={true}
                      onClose={() => setActiveTab('calculator')}
                      trigger="manual"
                      userEngagement={{
                        quizzesTaken: userMetrics.quizzesTaken,
                        calculationsPerformed: userMetrics.calculationsPerformed,
                        timeSpent: userMetrics.timeSpent,
                        streakDays: userMetrics.streakDays
                      }}
                      onUpgrade={(tier) => {
                        track('premium_upgrade', { plan: tier });
                        setActiveTab('premium');
                      }}
                    />
                  </div>
                </React.Suspense>
              )}
              {activeTab === 'dashboard' && (
                <React.Suspense fallback={<div style={{ textAlign: 'center', color: '#D4AF37', padding: '2rem' }}>Loading Dashboard...</div>}>
                  <Dashboard />
                  <AdvancedAnalytics
                    timeRange={analyticsTimeRange}
                    onExportData={() => track('analytics_data_exported')}
                    onAlertTriggered={(alert) => track('analytics_alert_triggered', alert)}
                  />
                  <ABTestingEngine
                    onVariantAssigned={(variant) => track('ab_test_assigned', { variant: variant.name })}
                    onConversionEvent={(event, value) => track('ab_test_conversion', { event, value: value || 0 })}
                  />
                </React.Suspense>
              )}
              {activeTab === 'premium' && (
                <React.Suspense fallback={<div style={{ textAlign: 'center', color: '#D4AF37', padding: '2rem' }}>Loading Premium Features...</div>}>
                  <Premium />
                  <PaymentIntegration
                    selectedTier={{
                      id: currentPlan,
                      name: currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1),
                      price: currentPlan === 'premium' ? 29.99 : 99.99,
                      period: 'monthly',
                      features: []
                    }}
                    onPaymentSuccess={(details) => {
                      track('payment_successful', details);
                      setUserMetrics(prev => ({
                        ...prev,
                        premiumStatus: true,
                        monthlyRevenue: prev.monthlyRevenue + details.amount
                      }));
                    }}
                    onPaymentError={(error) => track('payment_error', { error })}
                  />
                </React.Suspense>
              )}
              {debugMode && (
                <React.Suspense fallback={<div style={{ textAlign: 'center', color: '#D4AF37', padding: '2rem' }}>Loading Revenue Analytics...</div>}>
                  <RevenueOptimizer />
                </React.Suspense>
              )}
            </ErrorBoundary>
          </main>

          <Footer />

          {/* IMMEDIATE REVENUE ACTIVATION: Urgent conversion system */}
          {showOffer && (
            <UrgentConversionSystem
              calculationValue={calculationValue}
              onPremiumSignup={handlePremiumSignup}
            />
          )}

          {/* Compliance modal overlays the app when needed */}
          {showCompliance && (
            <ComplianceModal
              isOpen={showCompliance}
              onAccept={handleComplianceAccept}
              onDecline={handleComplianceDecline}
            />
          )}
        </div>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
