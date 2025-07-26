import React from 'react';

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

/**
 * TimeVault Error Boundary Component
 * 
 * Provides graceful error handling following TimeVault design guidelines
 * Navy/gold theme with WCAG accessibility compliance
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('TimeVault Error Boundary caught an error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#001F3F',
                    color: '#FFFFFF',
                    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    padding: '2rem'
                }}>
                    <div style={{
                        textAlign: 'center',
                        maxWidth: '600px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        padding: '3rem 2rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(212, 175, 55, 0.2)'
                    }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem',
                            color: '#D4AF37'
                        }}>
                            ⚠️
                        </div>

                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '600',
                            marginBottom: '1rem',
                            color: '#FFFFFF'
                        }}>
                            TimeVault Loading Error
                        </h1>

                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '2rem',
                            color: 'rgba(255, 255, 255, 0.9)'
                        }}>
                            We encountered an issue loading TimeVault. Please refresh the page or try again in a few moments.
                        </p>

                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                backgroundColor: '#D4AF37',
                                color: '#001F3F',
                                border: 'none',
                                padding: '0.75rem 2rem',
                                borderRadius: '8px',
                                fontSize: '1rem',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#F4D03F';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#D4AF37';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            Refresh Page
                        </button>

                        {import.meta.env.DEV && this.state.error && (
                            <details style={{
                                marginTop: '2rem',
                                textAlign: 'left',
                                background: 'rgba(0, 0, 0, 0.3)',
                                padding: '1rem',
                                borderRadius: '8px',
                                fontSize: '0.875rem'
                            }}>
                                <summary style={{ cursor: 'pointer', color: '#D4AF37' }}>
                                    Debug Information
                                </summary>
                                <pre style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
