// 🚀 TIMEVAULT REVENUE-CRITICAL EMERGENCY MAIN.TSX
import React from 'react';
import ReactDOM from 'react-dom/client';
import SecureCalculator from './components/SecureCalculator';
import './components/SecureCalculator.css';
import './index.css';

console.log('🚀 TimeVault EMERGENCY DEPLOYMENT - Revenue Recovery Mode');

// Emergency error boundary to prevent blank pages
interface ErrorBoundaryState {
    hasError: boolean;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

class EmergencyErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        console.error('🔴 Emergency Error Boundary triggered:', error);
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    fontFamily: 'Inter, system-ui, sans-serif',
                    background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
                    color: '#D4AF37',
                    minHeight: '100vh',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center'
                }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                        🛠️ TimeVault Maintenance Mode
                    </h1>
                    <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
                        Our revenue engine is being optimized for maximum performance
                    </p>
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '2px solid #D4AF37',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '500px'
                    }}>
                        <h3>🎯 Coming Soon:</h3>
                        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
                            <li>⚡ Advanced crypto calculator</li>
                            <li>💰 Premium AI insights</li>
                            <li>🪙 TVLT token rewards</li>
                            <li>🎨 Educational NFT badges</li>
                        </ul>
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
                                marginTop: '1rem'
                            }}
                        >
                            🔄 Retry Loading
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Ensure DOM element exists
function ensureRootElement() {
    let root = document.getElementById('root');

    if (!root) {
        console.log('🔧 Creating root element for TimeVault...');
        root = document.createElement('div');
        root.id = 'root';
        document.body.appendChild(root);
    }

    return root;
}

// Initialize TimeVault with bulletproof error handling
async function initializeTimeVault() {
    try {
        console.log('🚀 Initializing TimeVault Revenue Engine...');

        const rootElement = ensureRootElement();
        const root = ReactDOM.createRoot(rootElement);

        // Mount with secure calculator for immediate revenue
        root.render(
            <React.StrictMode>
                <EmergencyErrorBoundary>
                    <SecureCalculator />
                </EmergencyErrorBoundary>
            </React.StrictMode>
        ); console.log('✅ TimeVault Emergency Calculator mounted successfully!');
        console.log('💰 Revenue generation enabled - Calculator ready for conversions');

        // Track successful initialization
        try {
            (window as any).gtag?.('event', 'app_initialized', {
                'deployment_type': 'emergency_calculator',
                'timestamp': new Date().toISOString()
            });
        } catch (e) {
            console.log('📊 Analytics not available, continuing without tracking');
        }

    } catch (error) {
        console.error('🔴 TimeVault initialization failed:', error);

        // Ultimate fallback - direct DOM manipulation
        document.body.innerHTML = `
      <div style="
        font-family: Inter, system-ui, sans-serif;
        background: linear-gradient(135deg, #001F3F 0%, #003366 100%);
        color: #D4AF37;
        min-height: 100vh;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      ">
        <h1 style="font-size: 2.5rem; margin-bottom: 1rem;">
          ⚡ TimeVault
        </h1>
        <p style="font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9;">
          Transform your crypto into precious metals and time value
        </p>
        <div style="
          background: rgba(212, 175, 55, 0.1);
          border: 2px solid #D4AF37;
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
        ">
          <h3>🚧 Loading Revenue Engine...</h3>
          <p>Advanced calculator initializing for immediate profit generation</p>
          <button 
            onclick="window.location.reload()"
            style="
              background: #D4AF37;
              color: #001F3F;
              border: none;
              padding: 1rem 2rem;
              font-size: 1.1rem;
              border-radius: 8px;
              cursor: pointer;
              font-weight: bold;
              margin-top: 1rem;
            "
          >
            🚀 Launch Calculator
          </button>
        </div>
      </div>
    `;
    }
}

// Wait for DOM ready then initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTimeVault);
} else {
    initializeTimeVault();
}

// Export for testing
export { initializeTimeVault };

