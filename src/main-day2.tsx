import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import SecureCalculator from './components/SecureCalculator'
import './components/SecureCalculator.css'
import './index.css'
import './main-app.css'

console.log('🚀 TimeVault Day 2 - Real-Time Features Deployed')

// Configure React Query for performance
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000,
            gcTime: 300000,
            retry: 3,
            refetchOnWindowFocus: true,
        },
    },
})

// Main App Component
const App: React.FC = () => {
    const handlePremiumTrigger = () => {
        console.log('Premium upgrade triggered!')
    }

    const handleUserBehavior = (data: any) => {
        console.log('User behavior tracked:', data)
    }

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        TimeVault ⚡
                        <span className="live-badge">LIVE</span>
                    </h1>
                    <p className="app-subtitle">
                        Enhanced Security & Performance Calculator
                    </p>
                </div>
            </header>

            <main className="app-main">
                <div className="calculator-container">
                    <SecureCalculator
                        onPremiumTrigger={handlePremiumTrigger}
                        onUserBehavior={handleUserBehavior}
                    />
                </div>

                <div className="features-section">
                    <div className="feature-card">
                        <h3>🔒 Bank-Grade Security</h3>
                        <p>XSS protection, input sanitization, and rate limiting</p>
                    </div>

                    <div className="feature-card">
                        <h3>⚡ Lightning Fast</h3>
                        <p>Optimized performance with intelligent caching</p>
                    </div>

                    <div className="feature-card premium">
                        <h3>💎 Premium Features</h3>
                        <p>Portfolio tracking, alerts, and advanced analytics</p>
                        <button className="premium-cta" onClick={handlePremiumTrigger}>
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </main>

            <footer className="app-footer">
                <div className="footer-content">
                    <p>&copy; 2025 TimeVault AI. Powered by TVLT on XRPL.</p>
                    <div className="social-links">
                        <a href="#" onClick={() => handleUserBehavior({ action: 'social_click', platform: 'twitter' })}>
                            Twitter
                        </a>
                        <a href="#" onClick={() => handleUserBehavior({ action: 'social_click', platform: 'discord' })}>
                            Discord
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}

// Root with providers
const Root: React.FC = () => (
    <QueryClientProvider client={queryClient}>
        <App />
    </QueryClientProvider>
)

// Performance-optimized render
const container = document.getElementById('root')
if (!container) throw new Error('Root container not found')

const root = ReactDOM.createRoot(container)

// Measure initial render performance
const renderStart = performance.now()
root.render(<Root />)

// Log performance metrics
requestIdleCallback(() => {
    const renderTime = performance.now() - renderStart
    console.log(`🎯 Day 2 render completed in ${renderTime.toFixed(2)}ms`)
})
