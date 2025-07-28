import React, { useEffect, useState } from 'react';
import './App.css';
import Calculator from './components/Calculator/Calculator';
import ComplianceModal from './components/ComplianceModal';
import Dashboard from './components/Dashboard/Dashboard';
import DebugTest from './components/DebugTest';
import { ErrorBoundary } from './components/ErrorBoundary';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import OptimizedPersonalTimeCalculator from './components/OptimizedPersonalTimeCalculator';
import Premium from './components/Premium/Premium';
import { UserProvider } from './contexts';
import { useAnalytics } from './hooks/useAnalytics';
import { monitoring } from './services/monitoringService';
import './styles/day1-app.css';

// Revenue-critical fallback calculator
const FallbackCalculator = () => (
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
        fontWeight: 'bold',
        margin: '0 auto'
      }}
    >
      🔄 Load Calculator
    </button>
  </div>
);

function App() {
  console.log('🚀 App component rendering... [REVENUE CRITICAL FIX]');

  const { track } = useAnalytics();
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'premium'>('calculator');
  const [debugMode, setDebugMode] = useState(false);

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
    const accepted = localStorage.getItem('timevault_compliance_accepted');
    console.log('💾 Compliance accepted from localStorage:', accepted);
    if (!accepted) {
      setShowCompliance(true);
      console.log('⚠️ Showing compliance modal');
    } else {
      setComplianceAccepted(true);
      console.log('✅ Compliance already accepted');
    }

  }, []);

  const handleComplianceAccept = () => {
    localStorage.setItem('timevault_compliance_accepted', 'true');
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

          {/* Always show loading state if nothing else */}
          {!shouldShowApp && !showCompliance && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh',
              flexDirection: 'column'
            }}>
              <div style={{
                fontSize: '3rem',
                color: '#D4AF37',
                marginBottom: '1rem',
                fontWeight: 'bold'
              }}>
                TimeVault
              </div>
              <div style={{ fontSize: '1.2rem', color: '#C0C0C0' }}>
                Loading digital asset calculator...
              </div>
            </div>
          )}

          {shouldShowApp && (
            <>
              <Header
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <main className="container mx-auto px-4 py-8" style={{ minHeight: '60vh' }}>
                <ErrorBoundary>
                  {activeTab === 'calculator' && (
                    <React.Suspense fallback={<FallbackCalculator />}>
                      <div>
                        <Calculator />
                        <OptimizedPersonalTimeCalculator
                          onShare={(result) => {
                            track('optimized_calculator_share', {
                              crypto_value: result.cryptoValue,
                              hours_of_work: result.hoursOfWork
                            });
                          }}
                          onPremiumTrigger={(trigger) => {
                            track('premium_trigger', { trigger });
                            setActiveTab('premium');
                          }}
                        />
                      </div>
                    </React.Suspense>
                  )}
                  {activeTab === 'dashboard' && (
                    <React.Suspense fallback={<div style={{ textAlign: 'center', color: '#D4AF37', padding: '2rem' }}>Loading Dashboard...</div>}>
                      <Dashboard />
                    </React.Suspense>
                  )}
                  {activeTab === 'premium' && (
                    <React.Suspense fallback={<div style={{ textAlign: 'center', color: '#D4AF37', padding: '2rem' }}>Loading Premium Features...</div>}>
                      <Premium />
                    </React.Suspense>
                  )}
                </ErrorBoundary>
              </main>

              <Footer />
            </>
          )}

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
