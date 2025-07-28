// app/api/og/homepage/route.tsx - Homepage Open Graph image
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
    try {
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
                            marginBottom: '60px',
                        }}
                    >
                        <div
                            style={{
                                fontSize: '72px',
                                marginRight: '30px',
                            }}
                        >
                            🏆
                        </div>
                        <div
                            style={{
                                fontSize: '72px',
                                fontWeight: 'bold',
                                color: '#fbbf24', // gold
                            }}
                        >
                            TimeVault
                        </div>
                    </div>

                    {/* Main Title */}
                    <div
                        style={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            marginBottom: '40px',
                            lineHeight: 1.2,
                        }}
                    >
                        Free Crypto Time Calculator
                    </div>

                    {/* Subtitle */}
                    <div
                        style={{
                            fontSize: '32px',
                            color: '#d1d5db',
                            textAlign: 'center',
                            marginBottom: '60px',
                            lineHeight: 1.3,
                        }}
                    >
                        Convert Bitcoin, Ethereum & XRP to
                        <br />
                        <span style={{ color: '#fbbf24' }}>work hours</span> and{' '}
                        <span style={{ color: '#fbbf24' }}>precious metals</span>
                    </div>

                    {/* Feature Icons */}
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '600px',
                            marginBottom: '40px',
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🟡</div>
                            <div style={{ fontSize: '20px', color: '#d1d5db' }}>Bitcoin</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🔹</div>
                            <div style={{ fontSize: '20px', color: '#d1d5db' }}>Ethereum</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏰</div>
                            <div style={{ fontSize: '20px', color: '#d1d5db' }}>Work Hours</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>🥇</div>
                            <div style={{ fontSize: '20px', color: '#d1d5db' }}>Gold & Silver</div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            color: '#9ca3af',
                            fontSize: '24px',
                            textAlign: 'center',
                        }}
                    >
                        Real-time prices • No signup required • TimeVaultAI.com
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: unknown) {
        console.log(`Failed to generate homepage OG image: ${e instanceof Error ? e.message : 'Unknown error'}`);
        return new Response(`Failed to generate image`, {
            status: 500,
        });
    }
}
