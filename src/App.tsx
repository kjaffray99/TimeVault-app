import { useEffect, useState } from 'react';
import './App.css';
import Calculator from './components/Calculator/Calculator-MVP';
import ComplianceModal from './components/ComplianceModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const { trackPageView, track } = useAnalytics();
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceAccepted, setComplianceAccepted] = useState(false);

  useEffect(() => {
    trackPageView('calculator_page');

    // Check if compliance was previously accepted
    const accepted = localStorage.getItem('timevault_compliance_accepted');
    if (!accepted) {
      setShowCompliance(true);
    } else {
      setComplianceAccepted(true);
    }
  }, [trackPageView]);

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

  return (
    <ErrorBoundary>
      <div className="App">
        <ComplianceModal
          isOpen={showCompliance}
          onAccept={handleComplianceAccept}
          onDecline={handleComplianceDecline}
        />

        <header className="App-header">
          <h1>TimeVault</h1>
          <p>Transform digital assets into precious metals and personal time</p>
        </header>

        <main>
          {complianceAccepted || !showCompliance ? (
            <Calculator />
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Please review and accept our terms to continue.</p>
            </div>
          )}
        </main>

        <footer className="App-footer">
          <div className="footer-content">
            <p>&copy; 2025 TimeVault. Educational tools for digital asset analysis.</p>
            <div className="footer-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#contact">Contact</a>
              <span className="disclaimer">
                Educational purposes only • Not financial advice • IRS 2025 compliant
              </span>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
}

export default App;
