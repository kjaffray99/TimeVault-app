/**
 * Alerts Component
 * Real-time price alerts and notifications
 */

import { Bell, Plus } from 'lucide-react';
import React from 'react';

const Alerts: React.FC = () => {
    return (
        <div className="alerts-page">
            <div className="alerts-header">
                <Bell size={48} className="header-icon" />
                <div className="header-content">
                    <h1>Price Alerts</h1>
                    <p>Real-time notifications for market movements</p>
                </div>
            </div>

            <div className="alerts-placeholder">
                <Plus size={64} />
                <h2>Price Alerts Coming Soon</h2>
                <p>Set up custom alerts for:</p>
                <ul>
                    <li>🚨 Price thresholds</li>
                    <li>📊 Percentage changes</li>
                    <li>⏰ Time-based notifications</li>
                    <li>📱 Mobile push notifications</li>
                    <li>✉️ Email alerts</li>
                </ul>
            </div>
        </div>
    );
};

export default Alerts;
