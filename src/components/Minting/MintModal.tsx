/**
 * MintModal Component - Premium Transaction Preview and Confirmation
 * 
 * Enterprise-grade modal for secure minting with customer experience optimization:
 * - Transaction preview with Recharts visualization
 * - Gas fee transparency and optimization
 * - User confirmation with security validation
 * - Success/error handling with retry mechanisms
 * - Share CTAs for viral growth and affiliate opportunities
 * - Mobile-responsive design with accessibility
 */

import { AlertTriangle, CheckCircle, ExternalLink, Share2, X, Zap } from 'lucide-react';
import React, { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { useMint } from '../../hooks/useMintSimple';
import type { MintModalProps, MintTransaction } from '../../types';
import MintButton from './MintButton';
import './MintModal.css';

// Lazy load Recharts for performance optimization
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));

const MintModal: React.FC<MintModalProps> = ({
    isOpen,
    onClose,
    asset,
    onMintSuccess,
    onMintError,
}) => {
    // State management
    const [step, setStep] = useState<'preview' | 'confirm' | 'minting' | 'success' | 'error'>('preview');
    const [transaction, setTransaction] = useState<MintTransaction | null>(null);
    const [gasFee, setGasFee] = useState<string>('Calculating...');
    const [error, setError] = useState<string>('');
    const [retryCount, setRetryCount] = useState(0);

    // Hooks
    const { mint, estimateGasFee, canMint, getMintRequirements, isLoading } = useMint();

    // Mock value chart data for visualization
    const [chartData] = useState([
        { month: 'Jan', value: 85 },
        { month: 'Feb', value: 92 },
        { month: 'Mar', value: 78 },
        { month: 'Apr', value: 95 },
        { month: 'May', value: 108 },
        { month: 'Jun', value: 125 },
    ]);

    // Initialize modal state
    useEffect(() => {
        if (isOpen) {
            setStep('preview');
            setTransaction(null);
            setError('');
            setRetryCount(0);
            loadGasFee();
        }
    }, [isOpen, asset]);

    // Load gas fee estimation
    const loadGasFee = async () => {
        try {
            const fee = await estimateGasFee(asset);
            setGasFee(fee);
        } catch (error) {
            setGasFee('Est. $5-15 USD');
        }
    };

    // Handle mint execution
    const handleMint = async () => {
        if (!canMint(asset)) {
            const requirements = getMintRequirements(asset);
            setError(`Requirements not met: ${requirements.join(', ')}`);
            setStep('error');
            return;
        }

        try {
            setStep('minting');
            setError('');

            // Business Intelligence: Track mint initiation
            console.info('TimeVault Mint: Starting transaction from modal', {
                assetId: asset.id,
                step: 'minting',
                retryCount,
                timestamp: new Date().toISOString(),
            });

            const result = await mint(asset, {
                customMetadata: {
                    mintedFromModal: true,
                    userRetryCount: retryCount,
                },
            });

            setTransaction(result);
            setStep('success');
            onMintSuccess(result);

            // Business Intelligence: Track successful mint
            console.info('TimeVault Analytics: Mint successful from modal', {
                transactionId: result.id,
                assetId: asset.id,
                transactionHash: result.transactionHash,
            });

        } catch (error: any) {
            setError(error.message || 'Minting failed. Please try again.');
            setStep('error');
            onMintError(error.message);

            // Business Intelligence: Track mint failure
            console.error('TimeVault Analytics: Mint failed from modal', {
                assetId: asset.id,
                error: error.message,
                retryCount,
            });
        }
    };

    // Handle retry
    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setStep('preview');
        setError('');
        loadGasFee();
    };

    // Handle share success
    const handleShare = async () => {
        const shareData = {
            title: `I just minted ${asset.name} on TimeVault!`,
            text: `Check out this ${asset.type} I just minted on TimeVault - converting crypto to time value!`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback to clipboard
                await navigator.clipboard.writeText(shareData.url);
                console.info('TimeVault: Share URL copied to clipboard');
            }

            // Business Intelligence: Track viral sharing
            console.info('TimeVault Analytics: User shared mint success', {
                assetId: asset.id,
                transactionId: transaction?.id,
                shareMethod: (typeof navigator !== 'undefined' && 'share' in navigator) ? 'native' : 'clipboard',
            });
        } catch (error) {
            console.warn('TimeVault: Share failed', error);
        }
    };

    // Handle modal close
    const handleClose = useCallback(() => {
        if (step === 'minting') {
            // Prevent closing during minting
            return;
        }
        onClose();
    }, [step, onClose]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, handleClose]);

    // Don't render if not open
    if (!isOpen) return null;

    return (
        <div className="mint-modal-overlay" onClick={handleClose}>
            <div className="mint-modal" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="mint-modal__header">
                    <div className="mint-modal__header-content">
                        <img
                            src={asset.image}
                            alt={asset.name}
                            className="mint-modal__asset-image"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/assets/placeholder-nft.png';
                            }}
                        />
                        <div className="mint-modal__asset-info">
                            <h2 className="mint-modal__title">{asset.name}</h2>
                            <p className="mint-modal__description">{asset.description}</p>
                            <div className="mint-modal__type-badge">
                                {asset.type.replace('_', ' ')}
                            </div>
                        </div>
                    </div>
                    <button
                        className="mint-modal__close"
                        onClick={handleClose}
                        disabled={step === 'minting'}
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content based on step */}
                <div className="mint-modal__content">
                    {step === 'preview' && (
                        <div className="mint-modal__preview">
                            <div className="mint-modal__section">
                                <h3>Asset Benefits</h3>
                                <ul className="mint-modal__benefits-list">
                                    {asset.benefits.map((benefit, index) => (
                                        <li key={index} className="mint-modal__benefit-item">
                                            <CheckCircle size={16} className="mint-modal__benefit-icon" />
                                            {benefit}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Value Chart (for premium assets) */}
                            {asset.type === 'TIMEPASS_NFT' && (
                                <div className="mint-modal__section">
                                    <h3>Projected Value Growth</h3>
                                    <div className="mint-modal__chart">
                                        <Suspense fallback={<div className="mint-modal__chart-loading">Loading chart...</div>}>
                                            <ResponsiveContainer width="100%" height={200}>
                                                <LineChart data={chartData}>
                                                    <XAxis dataKey="month" stroke="#D4AF37" />
                                                    <YAxis stroke="#D4AF37" />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="value"
                                                        stroke="#D4AF37"
                                                        strokeWidth={3}
                                                        dot={{ fill: '#D4AF37', strokeWidth: 2, r: 4 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </Suspense>
                                    </div>
                                </div>
                            )}

                            {/* Transaction Details */}
                            <div className="mint-modal__section">
                                <h3>Transaction Details</h3>
                                <div className="mint-modal__details">
                                    <div className="mint-modal__detail-row">
                                        <span>Asset Type:</span>
                                        <span>{asset.type.replace('_', ' ')}</span>
                                    </div>
                                    <div className="mint-modal__detail-row">
                                        <span>Network:</span>
                                        <span>XRPL Testnet</span>
                                    </div>
                                    <div className="mint-modal__detail-row">
                                        <span>Gas Fee:</span>
                                        <span>{gasFee}</span>
                                    </div>
                                    {asset.price && (
                                        <div className="mint-modal__detail-row mint-modal__detail-row--total">
                                            <span>Total Cost:</span>
                                            <span>{asset.price.amount} {asset.price.currency}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Requirements Check */}
                            {getMintRequirements(asset).length > 0 && (
                                <div className="mint-modal__section mint-modal__section--warning">
                                    <h3>
                                        <AlertTriangle size={20} />
                                        Requirements
                                    </h3>
                                    <ul className="mint-modal__requirements-list">
                                        {getMintRequirements(asset).map((requirement, index) => (
                                            <li key={index}>{requirement}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'confirm' && (
                        <div className="mint-modal__confirm">
                            <div className="mint-modal__confirm-icon">
                                <Zap size={48} />
                            </div>
                            <h3>Confirm Mint Transaction</h3>
                            <p>Are you sure you want to mint <strong>{asset.name}</strong>?</p>
                            <div className="mint-modal__confirm-details">
                                <div>Gas Fee: {gasFee}</div>
                                {asset.price && (
                                    <div>Total: {asset.price.amount} {asset.price.currency}</div>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'minting' && (
                        <div className="mint-modal__minting">
                            <div className="mint-modal__loading-spinner" />
                            <h3>Minting in Progress</h3>
                            <p>Please wait while your transaction is processed...</p>
                            <div className="mint-modal__minting-note">
                                Do not close this window or refresh the page.
                            </div>
                        </div>
                    )}

                    {step === 'success' && transaction && (
                        <div className="mint-modal__success">
                            <div className="mint-modal__success-icon">
                                <CheckCircle size={64} />
                            </div>
                            <h3>Mint Successful!</h3>
                            <p>Your <strong>{asset.name}</strong> has been minted successfully.</p>

                            <div className="mint-modal__transaction-info">
                                <div className="mint-modal__transaction-row">
                                    <span>Transaction ID:</span>
                                    <code className="mint-modal__transaction-hash">
                                        {transaction.transactionHash?.slice(0, 10)}...
                                    </code>
                                </div>
                                <div className="mint-modal__transaction-row">
                                    <span>Gas Used:</span>
                                    <span>{transaction.gasUsed}</span>
                                </div>
                                <div className="mint-modal__transaction-row">
                                    <span>Status:</span>
                                    <span className="mint-modal__status-confirmed">Confirmed</span>
                                </div>
                            </div>

                            <div className="mint-modal__success-actions">
                                <button
                                    className="mint-modal__button mint-modal__button--secondary"
                                    onClick={handleShare}
                                >
                                    <Share2 size={16} />
                                    Share Success
                                </button>

                                {transaction.transactionHash && (
                                    <a
                                        href={`https://testnet.xrpl.org/transactions/${transaction.transactionHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mint-modal__button mint-modal__button--outline"
                                    >
                                        <ExternalLink size={16} />
                                        View on Explorer
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="mint-modal__error">
                            <div className="mint-modal__error-icon">
                                <AlertTriangle size={64} />
                            </div>
                            <h3>Mint Failed</h3>
                            <p className="mint-modal__error-message">{error}</p>

                            <div className="mint-modal__error-actions">
                                <button
                                    className="mint-modal__button mint-modal__button--primary"
                                    onClick={handleRetry}
                                >
                                    Try Again
                                </button>
                                <button
                                    className="mint-modal__button mint-modal__button--secondary"
                                    onClick={handleClose}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                {(step === 'preview' || step === 'confirm') && (
                    <div className="mint-modal__footer">
                        {step === 'preview' && (
                            <>
                                <button
                                    className="mint-modal__button mint-modal__button--secondary"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>
                                <MintButton
                                    asset={asset}
                                    variant="premium"
                                    size="large"
                                    onClick={() => setStep('confirm')}
                                    disabled={!canMint(asset)}
                                    loading={isLoading}
                                />
                            </>
                        )}

                        {step === 'confirm' && (
                            <>
                                <button
                                    className="mint-modal__button mint-modal__button--secondary"
                                    onClick={() => setStep('preview')}
                                >
                                    Back
                                </button>
                                <button
                                    className="mint-modal__button mint-modal__button--primary"
                                    onClick={handleMint}
                                    disabled={isLoading}
                                >
                                    Confirm Mint
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MintModal;
