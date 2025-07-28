/**
 * Debug Test Component - Minimal React Component for Testing
 * Used to verify React rendering and troubleshoot blank page issues
 */

import React from 'react';

const DebugTest: React.FC = () => {
    console.log('🧪 DebugTest component rendering successfully!');

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'linear-gradient(135deg, #001F3F, #003366)',
            color: '#D4AF37',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'Arial, sans-serif',
            zIndex: 9999
        }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀 TimeVault</h1>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>React is Working!</h2>

            <div style={{
                background: 'rgba(212, 175, 55, 0.1)',
                padding: '2rem',
                borderRadius: '12px',
                border: '2px solid #D4AF37',
                textAlign: 'center',
                maxWidth: '600px'
            }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                    ✅ Component Loaded Successfully
                </p>
                <p style={{ fontSize: '1rem', color: '#FFF' }}>
                    Time: {new Date().toLocaleTimeString()}
                </p>
                <p style={{ fontSize: '0.9rem', color: '#CCC', marginTop: '1rem' }}>
                    If you see this, React is working correctly.
                    The issue was likely with missing constants or import errors.
                </p>
            </div>

            <button
                onClick={() => window.location.reload()}
                style={{
                    marginTop: '2rem',
                    background: '#D4AF37',
                    color: '#001F3F',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                Reload Page
            </button>
        </div>
    );
};

export default DebugTest;
