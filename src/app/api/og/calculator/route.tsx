// app/api/og/calculator/route.tsx - Dynamic Open Graph images for calculator results
import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const crypto = searchParams.get('crypto');
        const amount = searchParams.get('amount');
        const value = searchParams.get('value');
        const hours = searchParams.get('hours');

        if (!crypto || !amount || !value || !hours) {
            return new Response('Missing required parameters', { status: 400 });
        }

        // Format crypto name and symbol
        const cryptoNames: Record<string, { name: string; symbol: string; emoji: string }> = {
            bitcoin: { name: 'Bitcoin', symbol: 'BTC', emoji: '🟡' },
            ethereum: { name: 'Ethereum', symbol: 'ETH', emoji: '🔹' },
            ripple: { name: 'XRP', symbol: 'XRP', emoji: '🌊' },
            cardano: { name: 'Cardano', symbol: 'ADA', emoji: '🔵' },
            solana: { name: 'Solana', symbol: 'SOL', emoji: '🟣' },
            dogecoin: { name: 'Dogecoin', symbol: 'DOGE', emoji: '🐕' },
            litecoin: { name: 'Litecoin', symbol: 'LTC', emoji: '🔰' },
            chainlink: { name: 'Chainlink', symbol: 'LINK', emoji: '🔗' },
            polygon: { name: 'Polygon', symbol: 'MATIC', emoji: '🟪' },
            avalanche: { name: 'Avalanche', symbol: 'AVAX', emoji: '❄️' },
        };

        const cryptoInfo = cryptoNames[crypto] || { name: crypto, symbol: crypto.toUpperCase(), emoji: '💎' };
        const formattedValue = Number(value).toLocaleString();

        return new ImageResponse(
            (
                <div
                    style={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px',
                        fontFamily: 'system-ui, sans-serif',
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '40px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '48px',
                                marginRight: '20px',
                            }}
                        >
                            🏆
                        </div>
                        <div
                            style={{
                                fontSize: '48px',
                                fontWeight: 'bold',
                                color: '#fbbf24', // gold
                            }}
                        >
                            TimeVault
                        </div>
                    </div>

                    {/* Main Content */}
                    <div
                        style={{
                            background: 'rgba(30, 58, 138, 0.8)',
                            borderRadius: '20px',
                            padding: '40px',
                            border: '4px solid #fbbf24',
                            textAlign: 'center',
                            width: '90%',
                            maxWidth: '800px',
                        }}
                    >
                        {/* Crypto Amount */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '30px',
                            }}
                        >
                            <div style={{ fontSize: '60px', marginRight: '20px' }}>
                                {cryptoInfo.emoji}
                            </div>
                            <div
                                style={{
                                    fontSize: '60px',
                                    fontWeight: 'bold',
                                    color: 'white',
                                }}
                            >
                                {amount} {cryptoInfo.symbol}
                            </div>
                        </div>

                        {/* Equals */}
                        <div
                            style={{
                                fontSize: '48px',
                                color: '#fbbf24',
                                fontWeight: 'bold',
                                marginBottom: '30px',
                            }}
                        >
                            =
                        </div>

                        {/* Results Grid */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                width: '100%',
                                gap: '20px',
                            }}
                        >
                            {/* Value */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: '40px',
                                        fontWeight: 'bold',
                                        color: '#fbbf24',
                                        marginBottom: '10px',
                                    }}
                                >
                                    ${formattedValue}
                                </div>
                                <div
                                    style={{
                                        fontSize: '24px',
                                        color: '#d1d5db',
                                    }}
                                >
                                    Total Value
                                </div>
                            </div>

                            {/* Hours */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: '40px',
                                        fontWeight: 'bold',
                                        color: '#fbbf24',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {hours} hrs
                                </div>
                                <div
                                    style={{
                                        fontSize: '24px',
                                        color: '#d1d5db',
                                    }}
                                >
                                    Work Time
                                </div>
                            </div>

                            {/* Time Icon */}
                            <div style={{ textAlign: 'center', flex: 1 }}>
                                <div
                                    style={{
                                        fontSize: '48px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    ⏰
                                </div>
                                <div
                                    style={{
                                        fontSize: '24px',
                                        color: '#d1d5db',
                                    }}
                                >
                                    @ $25/hour
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            marginTop: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#d1d5db',
                            fontSize: '20px',
                        }}
                    >
                        <div style={{ marginRight: '10px' }}>🧮</div>
                        <div>Free Crypto Time Calculator • TimeVaultAI.com</div>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: unknown) {
        console.log(`Failed to generate OG image: ${e instanceof Error ? e.message : 'Unknown error'}`);
        return new Response(`Failed to generate image`, {
            status: 500,
        });
    }
}
