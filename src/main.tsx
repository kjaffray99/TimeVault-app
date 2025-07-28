import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

console.log('🚀 TimeVault REVENUE-CRITICAL main.tsx executing...');

// Emergency Calculator for immediate revenue recovery
const EmergencyCalculator = () => (
  <div style={{
    fontFamily: 'Inter, system-ui, sans-serif',
    background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
    color: '#D4AF37',
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <div style={{
      background: 'rgba(212, 175, 55, 0.1)',
      border: '2px solid #D4AF37',
      borderRadius: '16px',
      padding: '3rem',
      maxWidth: '600px',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#D4AF37' }}>
        ⚡ TimeVault Calculator
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
        Transform your digital assets into precious metals and time equivalents
      </p>
      <div style={{
        background: '#001F3F',
        padding: '2rem',
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#D4AF37', marginBottom: '1rem' }}>🚧 Loading Revenue Engine...</h3>
        <p>Calculator initializing for immediate profit generation</p>
        <div style={{
          background: '#D4AF37',
          height: '4px',
          borderRadius: '2px',
          width: '100%',
          marginTop: '1rem'
        }}></div>
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
          marginRight: '1rem'
        }}
      >
        🔄 Reload Calculator
      </button>
      <button
        onClick={() => window.location.href = '/?debug=true'}
        style={{
          background: 'transparent',
          color: '#D4AF37',
          border: '2px solid #D4AF37',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🛠️ Debug Mode
      </button>
    </div>
  </div>
);

// Error Fallback Component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #001F3F, #002A5C)',
    color: '#D4AF37',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'Inter, sans-serif',
    padding: '2rem',
    zIndex: 10000
  }}>
    <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ TimeVault Error Detected</h1>
    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', textAlign: 'center', maxWidth: '600px' }}>
      Revenue-critical system encountered an error. Click below to recover your TimeVault calculator.
    </p>
    <details style={{ marginBottom: '2rem', maxWidth: '800px' }}>
      <summary style={{ cursor: 'pointer', marginBottom: '1rem', color: '#D4AF37' }}>
        🔍 Technical Details (Click to expand)
      </summary>
      <pre style={{
        background: 'rgba(0, 0, 0, 0.3)',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '0.9rem',
        overflow: 'auto',
        maxHeight: '200px',
        border: '1px solid #D4AF37'
      }}>
        <strong>Error:</strong> {error.message}
        {'\n\n'}
        <strong>Stack:</strong> {error.stack}
      </pre>
    </details>
    <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
      <button
        onClick={() => window.location.reload()}
        style={{
          background: '#D4AF37',
          color: '#001F3F',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🔄 Reload TimeVault
      </button>
      <button
        onClick={() => window.location.href = '/?debug=true'}
        style={{
          background: 'transparent',
          color: '#D4AF37',
          border: '2px solid #D4AF37',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🛠️ Debug Mode
      </button>
    </div>
  </div>
);

// Bulletproof error tracking
const trackError = (error: any, context: string) => {
  console.error(`🔥 TimeVault ${context}:`, error);
  try {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'app_error', {
        event_category: 'error',
        event_label: context,
        value: 1
      });
    }
  } catch (e) {
    console.error('Analytics tracking failed:', e);
  }
};

// Set up global error handlers for revenue protection
window.addEventListener('error', (event) => {
  trackError(event.error, 'global_error');
});

window.addEventListener('unhandledrejection', (event) => {
  trackError(event.reason, 'unhandled_promise');
});

// Guaranteed mount function
const initializeTimeVault = () => {
  console.log('💰 Initializing Revenue-Critical TimeVault...');

  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('❌ Root element not found! Creating emergency root...');
      const emergencyRoot = document.createElement('div');
      emergencyRoot.id = 'root';
      document.body.appendChild(emergencyRoot);

      const emergencyReactRoot = ReactDOM.createRoot(emergencyRoot);
      emergencyReactRoot.render(<EmergencyCalculator />);
      return;
    }

    console.log('✅ Root element found, mounting React app...');
    const root = ReactDOM.createRoot(rootElement);

    // Mount with comprehensive error boundary
    root.render(
      <React.StrictMode>
        <React.Suspense fallback={<EmergencyCalculator />}>
          <App />
        </React.Suspense>
      </React.StrictMode>
    );

    console.log('✅ TimeVault mounted successfully - Revenue engine active!');

    // Track successful initialization
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'app_initialized', {
          event_category: 'engagement',
          event_label: 'successful_mount'
        });
      }
    }, 1000);

  } catch (error) {
    console.error('💥 TimeVault mount failed:', error);
    trackError(error, 'mount_failure');

    // Emergency fallback - render directly to body
    const emergencyDiv = document.createElement('div');
    emergencyDiv.style.position = 'fixed';
    emergencyDiv.style.top = '0';
    emergencyDiv.style.left = '0';
    emergencyDiv.style.width = '100vw';
    emergencyDiv.style.height = '100vh';
    emergencyDiv.style.zIndex = '99999';
    document.body.appendChild(emergencyDiv);

    const emergencyRoot = ReactDOM.createRoot(emergencyDiv);
    emergencyRoot.render(<ErrorFallback error={error as Error} />);
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeTimeVault);
} else {
  initializeTimeVault();
}

export default initializeTimeVault;
