/**
 * TimeVault App Router
 * Main routing configuration with layout
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom';
import { Calculator, Dashboard, Premium } from './index';

// ========================================
// LAYOUT COMPONENT
// ========================================

const Layout: React.FC = () => {
    return (
        <>
            <header className="App-header">
                <h1>TimeVault</h1>
                <p>Transform digital assets into precious metals and personal time</p>
            </header>

            <main>
                <Outlet />
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
        </>
    );
};

// ========================================
// LOADING COMPONENT
// ========================================

const LoadingSpinner: React.FC = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px',
        color: '#D4AF37'
    }}>
        <div>Loading...</div>
    </div>
);

// ========================================
// APP ROUTER
// ========================================

export const AppRouter: React.FC = () => {
    return (
        <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Calculator />} />
                        <Route path="calculator" element={<Calculator />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="premium" element={<Premium />} />
                        {/* Add more routes as needed */}
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};
