/**
 * TimeVault Footer Component
 * Application footer with links and compliance information
 */

import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
    return (
        <footer className="App-footer">
            <div className="footer-content">
                <div className="footer-main">
                    <p className="footer-copyright">
                        &copy; 2025 TimeVault. Educational tools for digital asset analysis.
                    </p>
                    <div className="footer-links">
                        <a href="#privacy" className="footer-link">Privacy Policy</a>
                        <a href="#terms" className="footer-link">Terms of Service</a>
                        <a href="#contact" className="footer-link">Contact</a>
                    </div>
                </div>
                <div className="footer-disclaimer">
                    <span className="disclaimer-text">
                        Educational purposes only • Not financial advice • IRS 2025 compliant
                    </span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
