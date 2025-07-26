/**
 * WalletConnect Component - Secure Wallet Integration
 * 
 * Premium wallet connection interface optimized for conversions:
 * - Trust-building UI with security messaging
 * - Multiple wallet provider support
 * - FOMO-inducing premium features preview
 * - Mobile-responsive design
 * - Loading states and error handling
 */

import { ConnectWallet, useAddress, useConnectionStatus } from '@thirdweb-dev/react';
import { Lock, Shield, Star, Wallet, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useWalletState } from '../../hooks/useWalletState';
import './WalletConnect.css';

interface WalletConnectProps {
    onConnect?: (address: string) => void;
    showBenefits?: boolean;
    variant?: 'default' | 'premium' | 'minimal';
    className?: string;
}

const WalletConnect: React.FC<WalletConnectProps> = ({
    onConnect,
    showBenefits = true,
    variant = 'default',
    className = '',
}) => {
    const address = useAddress();
    const connectionStatus = useConnectionStatus();
    const walletState = useWalletState();
    const [showDetails, setShowDetails] = useState(false);

    // Handle successful connection
    React.useEffect(() => {
        if (address && connectionStatus === 'connected' && onConnect) {
            onConnect(address);

            // Business Intelligence: Track wallet connection
            console.info('TimeVault Analytics: Wallet connected', {
                address: address.slice(0, 6) + '...' + address.slice(-4),
                connectionMethod: 'thirdweb',
                timestamp: new Date().toISOString(),
            });
        }
    }, [address, connectionStatus, onConnect]);

    // Premium benefits for connected users
    const premiumBenefits = [
        {
            icon: <Star className="wallet-connect__benefit-icon" />,
            title: 'TVLT Token Rewards',
            description: 'Earn tokens for completing quizzes and tutorials',
        },
        {
            icon: <Zap className="wallet-connect__benefit-icon" />,
            title: 'NFT Badge Minting',
            description: 'Mint exclusive educational achievement badges',
        },
        {
            icon: <Shield className="wallet-connect__benefit-icon" />,
            title: 'TimePass Premium',
            description: 'Access AI insights and advanced charts for $99',
        },
    ];

    if (walletState.isConnected && address) {
        return (
            <div className={`wallet-connect wallet-connect--connected ${className}`}>
                <div className="wallet-connect__status">
                    <div className="wallet-connect__avatar">
                        <Wallet className="wallet-connect__avatar-icon" />
                    </div>
                    <div className="wallet-connect__info">
                        <div className="wallet-connect__address">
                            {address.slice(0, 6)}...{address.slice(-4)}
                        </div>
                        <div className="wallet-connect__status-text">
                            Wallet Connected
                        </div>
                    </div>
                    <div className="wallet-connect__indicator" />
                </div>

                {showBenefits && (
                    <div className="wallet-connect__connected-benefits">
                        <p className="wallet-connect__welcome">
                            🎉 Welcome! You can now mint NFTs and earn TVLT tokens.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`wallet-connect wallet-connect--${variant} ${className}`}>
            {/* Header */}
            <div className="wallet-connect__header">
                <div className="wallet-connect__icon">
                    <Wallet size={32} />
                </div>
                <h3 className="wallet-connect__title">
                    Connect Wallet to Unlock Premium Features
                </h3>
                <p className="wallet-connect__subtitle">
                    Secure connection • No private keys stored • XRPL & Ethereum supported
                </p>
            </div>

            {/* Connection Status */}
            {connectionStatus === 'connecting' && (
                <div className="wallet-connect__loading">
                    <div className="wallet-connect__spinner" />
                    <p>Connecting to wallet...</p>
                </div>
            )}

            {connectionStatus === 'disconnected' && (
                <>
                    {/* Connect Button */}
                    <div className="wallet-connect__action">
                        <ConnectWallet
                            theme="dark"
                            btnTitle="Connect Wallet"
                            modalTitle="Connect to TimeVault"
                            style={{
                                background: 'linear-gradient(135deg, var(--primary-navy) 0%, #002a5c 100%)',
                                border: '2px solid var(--accent-gold)',
                                borderRadius: '12px',
                                padding: '0.75rem 2rem',
                                fontSize: '1rem',
                                fontWeight: '600',
                                minHeight: '48px',
                                width: '100%',
                                color: 'white',
                            }}
                        />
                    </div>

                    {/* Security Features */}
                    <div className="wallet-connect__security">
                        <div className="wallet-connect__security-item">
                            <Shield size={16} />
                            <span>Secure connection</span>
                        </div>
                        <div className="wallet-connect__security-item">
                            <Lock size={16} />
                            <span>Private keys never stored</span>
                        </div>
                    </div>

                    {/* Benefits Preview */}
                    {showBenefits && (
                        <div className="wallet-connect__benefits">
                            <h4 className="wallet-connect__benefits-title">
                                What you'll unlock:
                            </h4>
                            <div className="wallet-connect__benefits-list">
                                {premiumBenefits.map((benefit, index) => (
                                    <div key={index} className="wallet-connect__benefit">
                                        {benefit.icon}
                                        <div className="wallet-connect__benefit-content">
                                            <div className="wallet-connect__benefit-title">
                                                {benefit.title}
                                            </div>
                                            <div className="wallet-connect__benefit-description">
                                                {benefit.description}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Premium Upsell */}
                            <div className="wallet-connect__premium-preview">
                                <div className="wallet-connect__premium-badge">
                                    <Star size={16} />
                                    Premium
                                </div>
                                <p className="wallet-connect__premium-text">
                                    <strong>TimePass NFT ($99)</strong> unlocks AI market insights,
                                    advanced charts, and priority support.
                                    <button
                                        className="wallet-connect__learn-more"
                                        onClick={() => setShowDetails(!showDetails)}
                                    >
                                        Learn more
                                    </button>
                                </p>

                                {showDetails && (
                                    <div className="wallet-connect__premium-details">
                                        <ul>
                                            <li>AI-powered market analysis and predictions</li>
                                            <li>Advanced charting tools with technical indicators</li>
                                            <li>Real-time price alerts and portfolio tracking</li>
                                            <li>Priority customer support</li>
                                            <li>Early access to new features</li>
                                            <li>Exclusive community access</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="wallet-connect__cta">
                        <p className="wallet-connect__cta-text">
                            Join <strong>10,000+</strong> users earning TVLT tokens and building crypto knowledge
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default WalletConnect;
