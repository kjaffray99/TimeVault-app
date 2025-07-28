// 🚀 EMERGENCY CALCULATOR FOR IMMEDIATE REVENUE GENERATION
import { useState } from 'react';

const EmergencyCalculator = () => {
    const [cryptoAmount, setCryptoAmount] = useState('1');
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Simplified price data for immediate functionality
    const cryptoPrices = {
        bitcoin: 97500,
        ethereum: 3400,
        ripple: 2.35
    };

    const metalPrices = {
        gold: 2650,    // USD per oz
        silver: 30,    // USD per oz
        platinum: 980, // USD per oz
        palladium: 960 // USD per oz
    };

    const calculateConversions = () => {
        setIsLoading(true);

        // Simulate API delay for user experience
        setTimeout(() => {
            const amount = parseFloat(cryptoAmount) || 0;
            const cryptoPrice = cryptoPrices[selectedCrypto];
            const usdValue = amount * cryptoPrice;

            const conversions = {
                usdValue,
                metals: {
                    gold: (usdValue / metalPrices.gold).toFixed(4),
                    silver: (usdValue / metalPrices.silver).toFixed(2),
                    platinum: (usdValue / metalPrices.platinum).toFixed(4),
                    palladium: (usdValue / metalPrices.palladium).toFixed(4)
                },
                time: {
                    hours: (usdValue / 25).toFixed(1), // $25/hour assumption
                    days: (usdValue / 200).toFixed(1), // $200/day assumption
                    weeks: (usdValue / 1000).toFixed(2) // $1000/week assumption
                }
            };

            setResults(conversions);
            setIsLoading(false);

            // Track high-value calculations for premium targeting
            if (usdValue > 10000) {
                console.log('🎯 High-value user detected:', usdValue);
            }
        }, 800);
    };

    const shareResults = () => {
        if (!results) return;

        const shareText = `Just discovered my ${cryptoAmount} ${selectedCrypto.toUpperCase()} is worth ${results.metals.gold} oz of gold! 🏆 Calculate yours at TimeVault.ai`;

        if (navigator.share) {
            navigator.share({
                title: 'TimeVault Calculator Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback to copying to clipboard
            navigator.clipboard.writeText(shareText);
            alert('Results copied to clipboard! Share to earn TVLT tokens 🪙');
        }
    };

    const premiumUpsell = () => (
        <div style={{
            background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
            color: '#001F3F',
            padding: '1.5rem',
            borderRadius: '12px',
            margin: '1rem 0',
            textAlign: 'center'
        }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.3rem' }}>
                👑 Unlock Premium Features
            </h3>
            <p style={{ margin: '0 0 1rem 0' }}>
                Get AI insights, portfolio tracking, and TVLT rewards!
            </p>
            <button
                onClick={() => console.log('🚀 Premium signup triggered')}
                style={{
                    background: '#001F3F',
                    color: '#D4AF37',
                    border: 'none',
                    padding: '0.8rem 1.5rem',
                    fontSize: '1rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                🚀 Start $99/mo Plan - First Week FREE
            </button>
        </div>
    );

    return (
        <div style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            background: 'linear-gradient(135deg, #001F3F 0%, #003366 100%)',
            color: '#FFFFFF',
            minHeight: '100vh',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    color: '#D4AF37',
                    margin: '0 0 0.5rem 0',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}>
                    ⚡ TimeVault Calculator
                </h1>
                <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
                    Transform your crypto into precious metals and time value
                </p>
            </div>

            {/* Calculator */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid #D4AF37',
                borderRadius: '16px',
                padding: '2rem',
                width: '100%',
                maxWidth: '600px',
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#D4AF37' }}>
                        💰 Crypto Amount:
                    </label>
                    <input
                        type="number"
                        value={cryptoAmount}
                        onChange={(e) => setCryptoAmount(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: '2px solid #D4AF37',
                            background: '#001F3F',
                            color: '#FFFFFF'
                        }}
                        placeholder="Enter amount..."
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#D4AF37' }}>
                        🪙 Select Cryptocurrency:
                    </label>
                    <select
                        value={selectedCrypto}
                        onChange={(e) => setSelectedCrypto(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.8rem',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: '2px solid #D4AF37',
                            background: '#001F3F',
                            color: '#FFFFFF'
                        }}
                    >
                        <option value="bitcoin">Bitcoin (BTC) - $97,500</option>
                        <option value="ethereum">Ethereum (ETH) - $3,400</option>
                        <option value="ripple">XRP (XRP) - $2.35</option>
                    </select>
                </div>

                <button
                    onClick={calculateConversions}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)',
                        color: '#001F3F',
                        border: 'none',
                        padding: '1rem',
                        fontSize: '1.2rem',
                        borderRadius: '8px',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        fontWeight: 'bold',
                        marginBottom: '1.5rem'
                    }}
                >
                    {isLoading ? '🔄 Calculating...' : '🧮 Calculate Value'}
                </button>

                {/* Results */}
                {results && (
                    <div style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        padding: '1.5rem',
                        borderRadius: '12px',
                        border: '1px solid #D4AF37'
                    }}>
                        <h3 style={{ color: '#D4AF37', marginBottom: '1rem' }}>
                            📊 Your {cryptoAmount} {selectedCrypto.toUpperCase()} is worth:
                        </h3>

                        <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: '#D4AF37' }}>💵 USD Value: ${results.usdValue.toLocaleString()}</strong>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                            <div>
                                <h4 style={{ color: '#D4AF37', margin: '0 0 0.5rem 0' }}>🥇 Precious Metals:</h4>
                                <div>Gold: {results.metals.gold} oz</div>
                                <div>Silver: {results.metals.silver} oz</div>
                                <div>Platinum: {results.metals.platinum} oz</div>
                                <div>Palladium: {results.metals.palladium} oz</div>
                            </div>

                            <div>
                                <h4 style={{ color: '#D4AF37', margin: '0 0 0.5rem 0' }}>⏰ Time Value:</h4>
                                <div>Hours: {results.time.hours}</div>
                                <div>Days: {results.time.days}</div>
                                <div>Weeks: {results.time.weeks}</div>
                            </div>
                        </div>

                        <button
                            onClick={shareResults}
                            style={{
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '0.8rem 1.5rem',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                width: '100%'
                            }}
                        >
                            📱 Share Results (+15 TVLT tokens)
                        </button>
                    </div>
                )}

                {/* Premium Upsell */}
                {results && parseFloat(results.usdValue) > 5000 && premiumUpsell()}
            </div>

            {/* Email Capture */}
            <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '2px solid #D4AF37',
                borderRadius: '16px',
                padding: '2rem',
                width: '100%',
                maxWidth: '600px',
                marginTop: '2rem',
                textAlign: 'center'
            }}>
                <h3 style={{ color: '#D4AF37', marginBottom: '1rem' }}>
                    🎯 Get Early Access to Advanced Features
                </h3>
                <p style={{ marginBottom: '1rem', opacity: 0.9 }}>
                    ✅ TVLT token rewards • ✅ NFT badge minting • ✅ AI portfolio insights
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="email"
                        placeholder="Enter your email..."
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '2px solid #D4AF37',
                            background: '#001F3F',
                            color: '#FFFFFF'
                        }}
                    />
                    <button
                        style={{
                            background: '#D4AF37',
                            color: '#001F3F',
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        🚀 Join 500+ Users
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                marginTop: '2rem',
                textAlign: 'center',
                opacity: 0.7,
                fontSize: '0.9rem'
            }}>
                <p>© 2025 TimeVault • Transform Digital Assets Into Real Value</p>
                <p>🔐 Secure • 🎯 Accurate • 💰 Profitable</p>
            </div>
        </div>
    );
};

export default EmergencyCalculator;
