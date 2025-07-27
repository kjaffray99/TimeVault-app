/**
 * Charts Component
 * Historical price charts and advanced analytics
 */

import { BarChart3, LineChart, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';

const Charts: React.FC = () => {
    const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
    const [selectedChart, setSelectedChart] = useState('price');

    const timeframes = [
        { value: '1d', label: '1 Day' },
        { value: '7d', label: '7 Days' },
        { value: '30d', label: '30 Days' },
        { value: '90d', label: '90 Days' },
        { value: '1y', label: '1 Year' },
    ];

    const chartTypes = [
        { value: 'price', label: 'Price Chart', icon: LineChart },
        { value: 'volume', label: 'Volume Chart', icon: BarChart3 },
        { value: 'correlation', label: 'Correlation', icon: TrendingUp },
    ];

    return (
        <div className="charts-page">
            <div className="charts-header">
                <TrendingUp size={48} className="header-icon" />
                <div className="header-content">
                    <h1>Historical Charts</h1>
                    <p>Advanced price analysis and market trends</p>
                </div>
            </div>

            <div className="charts-controls">
                <div className="control-group">
                    <label>Timeframe</label>
                    <div className="timeframe-buttons">
                        {timeframes.map((timeframe) => (
                            <button
                                key={timeframe.value}
                                className={`timeframe-btn ${selectedTimeframe === timeframe.value ? 'active' : ''}`}
                                onClick={() => setSelectedTimeframe(timeframe.value)}
                            >
                                {timeframe.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="control-group">
                    <label>Chart Type</label>
                    <div className="chart-type-buttons">
                        {chartTypes.map((type) => {
                            const IconComponent = type.icon;
                            return (
                                <button
                                    key={type.value}
                                    className={`chart-type-btn ${selectedChart === type.value ? 'active' : ''}`}
                                    onClick={() => setSelectedChart(type.value)}
                                >
                                    <IconComponent size={16} />
                                    {type.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-placeholder">
                    <div className="chart-icon">
                        <LineChart size={64} />
                    </div>
                    <h3>Interactive Charts Coming Soon</h3>
                    <p>
                        We're integrating advanced charting libraries to bring you:
                    </p>
                    <ul>
                        <li>Real-time price movements</li>
                        <li>Technical indicators</li>
                        <li>Volume analysis</li>
                        <li>Correlation charts between crypto and metals</li>
                        <li>Custom timeframe selection</li>
                    </ul>
                    <div className="chart-preview">
                        <div className="mock-chart">
                            <div className="chart-line"></div>
                            <div className="chart-points">
                                <div className="point"></div>
                                <div className="point"></div>
                                <div className="point"></div>
                                <div className="point"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="chart-stats">
                <div className="stat-card">
                    <h3>24H Change</h3>
                    <p className="stat-value positive">+5.2%</p>
                </div>
                <div className="stat-card">
                    <h3>7D Change</h3>
                    <p className="stat-value negative">-2.1%</p>
                </div>
                <div className="stat-card">
                    <h3>Volume</h3>
                    <p className="stat-value">$2.1B</p>
                </div>
                <div className="stat-card">
                    <h3>Market Cap</h3>
                    <p className="stat-value">$1.9T</p>
                </div>
            </div>
        </div>
    );
};

export default Charts;
