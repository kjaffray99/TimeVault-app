import React, { useEffect, useState } from 'react';

interface RealTimeCalculatorProps {
    initialCryptoPrices?: Array<{ id: string; current_price: number }>;
}

const RealTimeCalculator: React.FC<RealTimeCalculatorProps> = ({
    initialCryptoPrices = []
}) => {
    const [cryptoPrices, setCryptoPrices] = useState(initialCryptoPrices);
    const [loading, setLoading] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(new Date());

    // Real-time price updates
    useEffect(() => {
        const updatePrices = async () => {
            if (typeof window === 'undefined') return;

            setLoading(true);
            try {
                const response = await fetch('/api/crypto-prices');
                if (response.ok) {
                    const data = await response.json();
                    setCryptoPrices(data);
                    setLastUpdate(new Date());
                }
            } catch (error) {
                console.error('Failed to update prices:', error);
            } finally {
                setLoading(false);
            }
        };

        // Update every 30 seconds
        const interval = setInterval(updatePrices, 30000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="real-time-calculator">
            <div className="header">
                <h2>📊 Live Crypto Prices</h2>
                <div className="last-update">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                    {loading && <span className="loading-dot">🔄</span>}
                </div>
            </div>

            <div className="prices-grid">
                {cryptoPrices.map((crypto) => (
                    <div key={crypto.id} className="price-card">
                        <div className="crypto-name">
                            {crypto.id.toUpperCase()}
                        </div>
                        <div className="crypto-price">
                            ${crypto.current_price.toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>

            <div className="info">
                <p>Prices update automatically every 30 seconds</p>
                <p>Data sourced from CoinGecko API</p>
            </div>
        </div>
    );
};

export default RealTimeCalculator;
