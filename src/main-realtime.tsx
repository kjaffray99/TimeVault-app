import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import RealTimeCalculator from './components/RealTimeCalculator';
import './components/RealTimeCalculator.css';
import './index.css';
import './main-app.css';
import { usePerformanceMonitor } from './utils/performance';

// Configure React Query with performance optimization
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5000, // 5 seconds
            gcTime: 300000, // 5 minutes (renamed from cacheTime)
            retry: 3,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            refetchOnWindowFocus: true,
            refetchOnReconnect: true,
        },
        mutations: {
            retry: 2,
        },
    },
});

// Main App component with performance monitoring
const App: React.FC = () => {
    const { performanceSummary } = usePerformanceMonitor();

    const handlePremiumTrigger = () => {
        // Premium modal trigger logic
        console.log('Premium upgrade triggered!');
        // In production: show premium modal
    };

    const handleUserBehavior = (data: any) => {
        // User behavior tracking for analytics
        console.log('User behavior tracked:', data);
        // In production: send to analytics service
    };

    return (
        <div className="app">
            <header className="app-header">
                <div className="header-content">
                    <h1 className="app-title">
                        TimeVault ⚡
                        <span className="live-badge">LIVE</span>
                    </h1>
                    <p className="app-subtitle">
                        Real-Time Cryptocurrency & Precious Metals Calculator
                    </p>
                    {performanceSummary && (
                        <div className="performance-indicator">
                            <span className="perf-score">
                                Score: {performanceSummary.performanceScore}/100
                            </span>
                            {performanceSummary.loadTime && (
                                <span className="load-time">
                                    Load: {performanceSummary.loadTime.toFixed(0)}ms
                                </span>
                            )}
                            <span className="cache-rate">
                                Cache: {performanceSummary.cacheHitRate.toFixed(0)}%
                            </span>
                        </div>
                    )}
                </div>
            </header>

            <main className="app-main">
                <div className="calculator-container">
                    <RealTimeCalculator
                        onPremiumTrigger={handlePremiumTrigger}
                        onUserBehavior={handleUserBehavior}
                    />
                </div>

                <div className="features-section">
                    <div className="feature-card">
                        <h3>🔴 Real-Time Data</h3>
                        <p>Live prices updated every 5 seconds from multiple exchanges</p>
                    </div>

                    <div className="feature-card">
                        <h3>⚡ Lightning Fast</h3>
                        <p>Sub-1.5s load times with intelligent caching</p>
                    </div>

                    <div className="feature-card premium">
                        <h3>💎 Premium Features</h3>
                        <p>Portfolio tracking, alerts, and advanced analytics</p>
                        <button className="premium-cta" onClick={handlePremiumTrigger}>
                            Upgrade Now
                        </button>
                    </div>
                </div>

                {performanceSummary && performanceSummary.recommendations.length > 0 && (
                    <div className="performance-recommendations">
                        <h4>Performance Insights:</h4>
                        <ul>
                            {performanceSummary.recommendations.map((rec: string, index: number) => (
                                <li key={index}>{rec}</li>
                            ))}
                        </ul>
                    </div>
                )}
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
                        <a href="#" onClick={() => handleUserBehavior({ action: 'social_click', platform: 'telegram' })}>
                            Telegram
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Root component with providers
const Root: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    );
};

// Performance-optimized render
const container = document.getElementById('root');
if (!container) throw new Error('Root container not found');

const root = ReactDOM.createRoot(container);

// Measure initial render performance
const renderStart = performance.now();
root.render(<Root />);

// Log initial render time
requestIdleCallback(() => {
    const renderTime = performance.now() - renderStart;
    console.log(`Initial render completed in ${renderTime.toFixed(2)}ms`);
});

// Register service worker for caching (production only)
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
