'use client';

import { useState, useEffect } from 'react';

export default function ProductionCalculator() {
    const [cryptoAmount, setCryptoAmount] = useState('');
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prices, setPrices] = useState({ crypto: 0, gold: 0, silver: 0 });

    useEffect(() => {
        fetchPrices();
    }, []);

    const fetchPrices = async () => {
        try {
            const [cryptoResponse, metalsResponse] = await Promise.all([
                fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd'),
                fetch('https://api.metals.live/v1/spot')
            ]);

            const cryptoData = await cryptoResponse.json();
            const metalsData = await metalsResponse.json();

            setPrices({
                crypto: cryptoData[selectedCrypto]?.usd || 0,
                gold: metalsData[0]?.price || 2000,
                silver: metalsData[1]?.price || 25
            });
        } catch (error) {
            console.log('Using fallback prices');
            setPrices({
                crypto: selectedCrypto === 'bitcoin' ? 67000 : 3500,
                gold: 2000,
                silver: 25
            });
        }
    };

    const calculate = async () => {
        if (!cryptoAmount || isNaN(Number(cryptoAmount))) return;

        setLoading(true);
        await fetchPrices();

        const amount = Number(cryptoAmount);
        const cryptoValue = amount * prices.crypto;
        const goldOunces = cryptoValue / prices.gold;
        const silverOunces = cryptoValue / prices.silver;

        // Time calculations (based on US median income)
        const annualIncome = 70000;
        const totalWorkingHours = 2080; // 40 hours/week * 52 weeks
        const hourlyWage = annualIncome / totalWorkingHours;
        const requiredWorkingHours = cryptoValue / hourlyWage;
        const workingDays = requiredWorkingHours / 8;
        const workingMonths = workingDays / 22;

        setResults({
            cryptoValue,
            goldOunces,
            silverOunces,
            workingHours: Math.round(requiredWorkingHours),
            workingDays: Math.round(workingDays * 10) / 10,
            workingMonths: Math.round(workingMonths * 10) / 10
        });

        setLoading(false);
    };

    return (
        <div className="production-calculator">
            <div className="calculator-header">
                <h1>🔥 TimeVault AI Calculator</h1>
                <p>Convert crypto to precious metals and time equivalents</p>
            </div>

            <div className="calculator-form">
                <div className="input-group">
                    <label>Cryptocurrency:</label>
                    <select 
                        value={selectedCrypto} 
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        className="crypto-select"
                    >
                        <option value="bitcoin">Bitcoin (BTC)</option>
                        <option value="ethereum">Ethereum (ETH)</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        placeholder="Enter amount..."
                        className="amount-input"
                        step="0.0001"
                    />
                </div>

                <button 
                    onClick={calculate}
                    disabled={loading}
                    className="calculate-btn"
                >
                    {loading ? '⏳ Calculating...' : '🚀 Calculate Value'}
                </button>
            </div>

            {results && (
                <div className="results-section">
                    <h3>💰 Your {selectedCrypto.toUpperCase()} is worth:</h3>
                    
                    <div className="result-grid">
                        <div className="result-card">
                            <div className="result-icon">💵</div>
                            <div className="result-value">${results.cryptoValue.toLocaleString()}</div>
                            <div className="result-label">USD Value</div>
                        </div>

                        <div className="result-card">
                            <div className="result-icon">🥇</div>
                            <div className="result-value">{results.goldOunces.toFixed(3)} oz</div>
                            <div className="result-label">Gold</div>
                        </div>

                        <div className="result-card">
                            <div className="result-icon">🥈</div>
                            <div className="result-value">{results.silverOunces.toFixed(1)} oz</div>
                            <div className="result-label">Silver</div>
                        </div>

                        <div className="result-card">
                            <div className="result-icon">⏰</div>
                            <div className="result-value">{results.workingHours} hrs</div>
                            <div className="result-label">Work Time</div>
                        </div>

                        <div className="result-card">
                            <div className="result-icon">📅</div>
                            <div className="result-value">{results.workingDays} days</div>
                            <div className="result-label">Work Days</div>
                        </div>

                        <div className="result-card">
                            <div className="result-icon">🗓️</div>
                            <div className="result-value">{results.workingMonths} months</div>
                            <div className="result-label">Work Months</div>
                        </div>
                    </div>

                    <div className="premium-upsell">
                        <h4>🌟 Want More Features?</h4>
                        <p>Upgrade to Premium for advanced analytics, portfolio tracking, and AI insights!</p>
                        <button className="premium-btn">🚀 Upgrade Now - $9.99/month</button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .production-calculator {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto;
                }

                .calculator-header {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .calculator-header h1 {
                    color: #001F3F;
                    font-size: 2.5rem;
                    margin-bottom: 10px;
                }

                .calculator-form {
                    background: linear-gradient(135deg, #001F3F 0%, #D4AF37 100%);
                    padding: 30px;
                    border-radius: 15px;
                    margin-bottom: 30px;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .input-group label {
                    display: block;
                    color: white;
                    font-weight: bold;
                    margin-bottom: 8px;
                }

                .crypto-select, .amount-input {
                    width: 100%;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    background: white;
                }

                .calculate-btn {
                    width: 100%;
                    padding: 15px;
                    background: #D4AF37;
                    color: #001F3F;
                    border: none;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .calculate-btn:hover {
                    background: #B8941F;
                    transform: translateY(-2px);
                }

                .calculate-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .results-section {
                    background: white;
                    padding: 30px;
                    border-radius: 15px;
                    box-shadow: 0 10px 30px rgba(0,31,63,0.1);
                }

                .results-section h3 {
                    color: #001F3F;
                    text-align: center;
                    margin-bottom: 25px;
                }

                .result-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 20px;
                    margin-bottom: 30px;
                }

                .result-card {
                    background: linear-gradient(135deg, #001F3F 0%, #D4AF37 100%);
                    color: white;
                    padding: 20px;
                    border-radius: 12px;
                    text-align: center;
                    transition: transform 0.3s ease;
                }

                .result-card:hover {
                    transform: translateY(-5px);
                }

                .result-icon {
                    font-size: 2rem;
                    margin-bottom: 10px;
                }

                .result-value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin-bottom: 5px;
                }

                .result-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .premium-upsell {
                    background: linear-gradient(135deg, #D4AF37 0%, #001F3F 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    text-align: center;
                }

                .premium-btn {
                    background: white;
                    color: #001F3F;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 15px;
                }

                .premium-btn:hover {
                    background: #f0f0f0;
                    transform: translateY(-2px);
                }

                @media (max-width: 768px) {
                    .production-calculator {
                        padding: 15px;
                    }
                    
                    .calculator-header h1 {
                        font-size: 2rem;
                    }
                    
                    .result-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
            `}</style>
        </div>
    );
}
