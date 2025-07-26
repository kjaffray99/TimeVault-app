/**
 * MintShowcase Component - Premium NFT & Token Minting Display
 * 
 * Integrated showcase for TimeVault's minting ecosystem optimized for revenue:
 * - Featured minting opportunities with FOMO triggers
 * - Wallet connection integration with upsell messaging
 * - Educational NFT rewards after quiz completion
 * - TimePass premium NFT sales for $500-1K revenue
 * - Affiliate sharing for viral growth
 * - Mobile-responsive grid layout
 */

import { ArrowRight, Gift, Sparkles, Star, Trophy, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useWalletState } from '../../hooks/useWalletState';
import type { MintableAsset } from '../../types';
import { MintButton, MintModal, useMintableAssets } from '../Minting';
import { WalletConnect } from '../WalletConnect';
import './MintShowcase.css';

interface MintShowcaseProps {
    onQuizComplete?: (quizId: string, score: number) => void;
    className?: string;
}

const MintShowcase: React.FC<MintShowcaseProps> = ({
    onQuizComplete,
    className = '',
}) => {
    const [selectedAsset, setSelectedAsset] = useState<MintableAsset | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [featuredAssets, setFeaturedAssets] = useState<MintableAsset[]>([]);
    const [recentActivity, setRecentActivity] = useState<string[]>([]);

    const walletState = useWalletState();
    const { assets, isLoading } = useMintableAssets();

    // Filter and organize assets
    useEffect(() => {
        if (assets.length > 0) {
            // Featured assets for main showcase
            const featured = assets.filter(asset =>
                asset.type === 'TIMEPASS_NFT' ||
                (asset.type === 'EDU_NFT' && asset.requirements?.minQuizScore)
            );
            setFeaturedAssets(featured);

            // Mock recent activity for social proof
            setRecentActivity([
                '🎯 Alice just minted Crypto Expert Badge!',
                '⭐ Bob unlocked TimePass Gold ($99)',
                '🏆 Carol earned 150 TVLT tokens',
                '💎 David completed DeFi Master tutorial',
            ]);
        }
    }, [assets]);

    // Handle mint modal
    const handleMintClick = (asset: MintableAsset) => {
        setSelectedAsset(asset);
        setShowModal(true);

        // Business Intelligence: Track mint interest
        console.info('TimeVault Analytics: Mint showcase clicked', {
            assetId: asset.id,
            assetType: asset.type,
            userConnected: walletState.isConnected,
            timestamp: new Date().toISOString(),
        });
    };

    const handleMintSuccess = (transaction: any) => {
        console.info('TimeVault: Mint successful from showcase', transaction);
        setShowModal(false);
        setSelectedAsset(null);

        // Trigger quiz completion if it's an educational NFT
        if (selectedAsset?.type === 'EDU_NFT' && onQuizComplete) {
            onQuizComplete(selectedAsset.id, 95); // Mock high score
        }
    };

    const handleMintError = (error: string) => {
        console.error('TimeVault: Mint failed from showcase', error);
    };

    // Get asset category styling
    const getAssetCategoryStyle = (asset: MintableAsset) => {
        switch (asset.type) {
            case 'TVLT':
                return 'mint-showcase__card--tokens';
            case 'EDU_NFT':
                return 'mint-showcase__card--educational';
            case 'TIMEPASS_NFT':
                return 'mint-showcase__card--premium';
            default:
                return '';
        }
    };

    // Get asset icon
    const getAssetIcon = (asset: MintableAsset) => {
        switch (asset.type) {
            case 'TVLT':
                return <Zap className="mint-showcase__card-icon" />;
            case 'EDU_NFT':
                return <Trophy className="mint-showcase__card-icon" />;
            case 'TIMEPASS_NFT':
                return <Star className="mint-showcase__card-icon" />;
            default:
                return <Gift className="mint-showcase__card-icon" />;
        }
    };

    if (isLoading) {
        return (
            <div className={`mint-showcase mint-showcase--loading ${className}`}>
                <div className="mint-showcase__loading">
                    <div className="mint-showcase__spinner" />
                    <p>Loading minting opportunities...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`mint-showcase ${className}`}>
            {/* Header */}
            <div className="mint-showcase__header">
                <div className="mint-showcase__title-section">
                    <h2 className="mint-showcase__title">
                        <Sparkles className="mint-showcase__title-icon" />
                        Mint & Earn Rewards
                    </h2>
                    <p className="mint-showcase__subtitle">
                        Complete quizzes, mint NFT badges, and unlock premium features
                    </p>
                </div>

                {/* Recent Activity Ticker */}
                <div className="mint-showcase__activity">
                    <div className="mint-showcase__activity-ticker">
                        {recentActivity.map((activity, index) => (
                            <span key={index} className="mint-showcase__activity-item">
                                {activity}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Wallet Connection (if not connected) */}
            {!walletState.isConnected && (
                <div className="mint-showcase__wallet-section">
                    <WalletConnect
                        variant="minimal"
                        showBenefits={false}
                        onConnect={(address) => {
                            console.info('Wallet connected from showcase:', address);
                        }}
                    />
                </div>
            )}

            {/* Featured Assets */}
            {featuredAssets.length > 0 && (
                <div className="mint-showcase__featured">
                    <h3 className="mint-showcase__section-title">Featured Opportunities</h3>
                    <div className="mint-showcase__grid">
                        {featuredAssets.map((asset) => (
                            <div
                                key={asset.id}
                                className={`mint-showcase__card ${getAssetCategoryStyle(asset)}`}
                            >
                                <div className="mint-showcase__card-header">
                                    <img
                                        src={asset.image}
                                        alt={asset.name}
                                        className="mint-showcase__card-image"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = '/assets/placeholder-nft.png';
                                        }}
                                    />
                                    <div className="mint-showcase__card-icon-wrapper">
                                        {getAssetIcon(asset)}
                                    </div>
                                </div>

                                <div className="mint-showcase__card-content">
                                    <h4 className="mint-showcase__card-title">{asset.name}</h4>
                                    <p className="mint-showcase__card-description">
                                        {asset.description}
                                    </p>

                                    {/* Benefits */}
                                    <div className="mint-showcase__card-benefits">
                                        {asset.benefits.slice(0, 2).map((benefit, index) => (
                                            <div key={index} className="mint-showcase__card-benefit">
                                                <ArrowRight size={12} />
                                                <span>{benefit}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Price */}
                                    {asset.price && (
                                        <div className="mint-showcase__card-price">
                                            <span className="mint-showcase__card-price-amount">
                                                {asset.price.amount} {asset.price.currency}
                                            </span>
                                            {asset.type === 'TIMEPASS_NFT' && (
                                                <span className="mint-showcase__card-price-note">
                                                    Limited Time
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    {/* Requirements */}
                                    {asset.requirements && (
                                        <div className="mint-showcase__card-requirements">
                                            {asset.requirements.minQuizScore && (
                                                <span className="mint-showcase__card-requirement">
                                                    Score {asset.requirements.minQuizScore}%+ on quiz
                                                </span>
                                            )}
                                            {asset.requirements.streakDays && (
                                                <span className="mint-showcase__card-requirement">
                                                    {asset.requirements.streakDays}-day streak
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="mint-showcase__card-action">
                                    <MintButton
                                        asset={asset}
                                        variant={asset.type === 'TIMEPASS_NFT' ? 'premium' : 'primary'}
                                        size="medium"
                                        onClick={() => handleMintClick(asset)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* All Assets */}
            {assets.length > 0 && (
                <div className="mint-showcase__all-assets">
                    <h3 className="mint-showcase__section-title">All Rewards</h3>
                    <div className="mint-showcase__list">
                        {assets.filter(asset => !featuredAssets.includes(asset)).map((asset) => (
                            <div key={asset.id} className="mint-showcase__list-item">
                                <div className="mint-showcase__list-info">
                                    {getAssetIcon(asset)}
                                    <div className="mint-showcase__list-content">
                                        <h5 className="mint-showcase__list-title">{asset.name}</h5>
                                        <p className="mint-showcase__list-description">
                                            {asset.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mint-showcase__list-action">
                                    <MintButton
                                        asset={asset}
                                        variant="secondary"
                                        size="small"
                                        onClick={() => handleMintClick(asset)}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Call to Action for Premium */}
            {walletState.isConnected && (
                <div className="mint-showcase__cta">
                    <div className="mint-showcase__cta-content">
                        <Star className="mint-showcase__cta-icon" />
                        <div className="mint-showcase__cta-text">
                            <h4>Unlock Premium Features</h4>
                            <p>
                                Mint TimePass NFT for AI insights, advanced charts, and priority support
                            </p>
                        </div>
                        <div className="mint-showcase__cta-action">
                            <span className="mint-showcase__cta-price">$99</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Mint Modal */}
            {selectedAsset && (
                <MintModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    asset={selectedAsset}
                    onMintSuccess={handleMintSuccess}
                    onMintError={handleMintError}
                />
            )}
        </div>
    );
};

export default MintShowcase;
