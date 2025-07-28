
function SimpleApp() {
    console.log('🧪 SimpleApp component rendering...');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom right, #001F3F, #003366)',
            color: 'white',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '20px',
                borderRadius: '8px',
                marginBottom: '20px',
                border: '2px solid #D4AF37'
            }}>
                <h1 style={{ color: '#D4AF37', marginBottom: '10px' }}>
                    🔧 TimeVault Simple Test
                </h1>
                <p>If you can see this, React is working!</p>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '20px',
                borderRadius: '8px'
            }}>
                <h2>Component Status:</h2>
                <p>✅ React rendering</p>
                <p>✅ CSS styles applying</p>
                <p>✅ JavaScript executing</p>

                <button
                    style={{
                        background: '#D4AF37',
                        color: '#001F3F',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginTop: '10px'
                    }}
                    onClick={() => alert('Button clicked! React events working.')}
                >
                    Test Button
                </button>
            </div>
        </div>
    );
}

export default SimpleApp;
