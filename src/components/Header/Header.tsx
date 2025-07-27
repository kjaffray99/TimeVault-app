/**
 * TimeVault Header Component
 * Navigation and branding for the application
 */

import React from 'react';
import './Header.css';

interface HeaderProps {
    activeTab: 'calculator' | 'dashboard' | 'premium';
    setActiveTab: (tab: 'calculator' | 'dashboard' | 'premium') => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
    return (
        <header className="App-header">
            <div className="header-content">
                <div className="header-brand">
                    <h1 className="header-title">TimeVault</h1>
                    <p className="header-subtitle">Transform digital assets into precious metals and personal time</p>
                </div>

                <nav className="header-nav">
                    <button
                        className={`nav-button ${activeTab === 'calculator' ? 'nav-button--active' : ''}`}
                        onClick={() => setActiveTab('calculator')}
                        aria-label="Calculator"
                    >
                        Calculator
                    </button>
                    <button
                        className={`nav-button ${activeTab === 'dashboard' ? 'nav-button--active' : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                        aria-label="Dashboard"
                    >
                        Dashboard
                    </button>
                    <button
                        className={`nav-button ${activeTab === 'premium' ? 'nav-button--active' : ''}`}
                        onClick={() => setActiveTab('premium')}
                        aria-label="Premium"
                    >
                        Premium
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;
