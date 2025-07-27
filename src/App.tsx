import { useEffect, useState } from 'react';
import './App.css';
import Calculator from './components/Calculator/Calculator-MVP';
import ComplianceModal from './components/ComplianceModal';
import Dashboard from './components/Dashboard/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Premium from './components/Premium/Premium';
import { UserProvider } from './contexts';
import { useAnalytics } from './hooks/useAnalytics';

function App() {
  const { track } = useAnalytics();
  const [showCompliance, setShowCompliance] = useState(false);
  const [complianceAccepted, setComplianceAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'dashboard' | 'premium'>('calculator');

  useEffect(() => {
    // Check if compliance was previously accepted
    const accepted = localStorage.getItem('timevault_compliance_accepted');
    if (!accepted) {
      setShowCompliance(true);
    } else {
      setComplianceAccepted(true);
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

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'calculator':
        return (
          <div className="container">
            <Calculator />
          </div>
        );
      case 'dashboard':
        return <Dashboard />;
      case 'premium':
        return <Premium />;
      default:
        return (
          <div className="container">
            <Calculator />
          </div>
        );
    }
  };

  return (
    <ErrorBoundary>
      <UserProvider>
        <div className="App">
          <ComplianceModal
            isOpen={showCompliance}
            onAccept={handleComplianceAccept}
            onDecline={handleComplianceDecline}
          />

          {complianceAccepted || !showCompliance ? (
            <>
              <Header activeTab={activeTab} setActiveTab={setActiveTab} />
              <main className="App-main">
                {renderActiveComponent()}
              </main>
              <Footer />
            </>
          ) : (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <p>Please review and accept our terms to continue.</p>
            </div>
          )}
        </div>
      </UserProvider>
    </ErrorBoundary>
  );
}

export default App;
