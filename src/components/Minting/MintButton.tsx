/**
 * MintButton Component - Premium UI for TimeVault Minting
 * 
 * High-conversion mint button with luxury gold/blue theming optimized for profitability:
 * - FOMO-inducing gold accents for premium upsells
 * - Trust-building navy primary colors
 * - WCAG-accessible high-contrast design
 * - Mobile-responsive with smooth animations
 * - Loading states and user feedback
 * - A/B testing ready for conversion optimization
 */

import { Coins, Loader2, Lock, Sparkles, Star, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { useMint } from '../../hooks/useMintSimple';
import type { MintButtonProps } from '../../types';
import './MintButton.css';

const MintButton: React.FC<MintButtonProps> = ({
    asset,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    className = '',
    onClick,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    const { canMint, getMintRequirements, estimateGasFee, isLoading: mintLoading } = useMint();

    // Determine if button should be disabled
    const isDisabled = disabled || loading || mintLoading || !canMint(asset);
    const isLoadingState = loading || mintLoading;

    // Get requirements for tooltip/feedback
    const requirements = getMintRequirements(asset);
    const hasRequirements = requirements.length > 0;

    // Button styling based on variant and state
    const getButtonClasses = () => {
        const baseClasses = [
            'mint-button',
            `mint-button--${variant}`,
            `mint-button--${size}`,
            className,
        ];

        if (isDisabled) baseClasses.push('mint-button--disabled');
        if (isLoadingState) baseClasses.push('mint-button--loading');
        if (isHovered && !isDisabled) baseClasses.push('mint-button--hovered');
        if (isPulsing) baseClasses.push('mint-button--pulsing');

        return baseClasses.join(' ');
    };

    // Icon based on asset type
    const getAssetIcon = () => {
        switch (asset.type) {
            case 'TVLT':
                return <Coins className="mint-button__icon" />;
            case 'EDU_NFT':
                return <Star className="mint-button__icon" />;
            case 'TIMEPASS_NFT':
                return <Sparkles className="mint-button__icon" />;
            default:
                return <Zap className="mint-button__icon" />;
        }
    };

    // Button text based on state and asset
    const getButtonText = () => {
        if (isLoadingState) {
            return 'Minting...';
        }

        if (hasRequirements && isDisabled) {
            return 'Requirements Not Met';
        }

        if (asset.price && asset.price.amount > 0) {
            return `Mint for ${asset.price.amount} ${asset.price.currency}`;
        }

        switch (asset.type) {
            case 'TVLT':
                return 'Claim Tokens';
            case 'EDU_NFT':
                return 'Mint Badge';
            case 'TIMEPASS_NFT':
                return 'Unlock Premium';
            default:
                return 'Mint NFT';
        }
    };

    // Handle click with analytics tracking
    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (isDisabled) {
            // Show requirements tooltip or modal
            console.info('TimeVault Mint: Requirements not met', { requirements });
            return;
        }

        // Business Intelligence: Track click
        console.info('TimeVault Analytics: Mint button clicked', {
            assetId: asset.id,
            assetType: asset.type,
            variant,
            timestamp: new Date().toISOString(),
        });

        // Add pulse animation for feedback
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 200);

        // Call custom onClick handler
        if (onClick) {
            onClick();
        }
    };

    // Handle gas fee estimation on hover (Customer Experience)
    const handleMouseEnter = async () => {
        setIsHovered(true);

        if (canMint(asset)) {
            try {
                const gasEstimate = await estimateGasFee(asset);
                console.info('TimeVault: Gas estimate', { gasEstimate });
            } catch (error) {
                console.warn('TimeVault: Gas estimation failed', error);
            }
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div className="mint-button-container">
            <button
                className={getButtonClasses()}
                disabled={isDisabled}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                aria-label={`Mint ${asset.name}`}
                aria-describedby={hasRequirements ? `requirements-${asset.id}` : undefined}
            >
                {/* Loading spinner */}
                {isLoadingState && (
                    <Loader2 className="mint-button__spinner" />
                )}

                {/* Asset icon */}
                {!isLoadingState && getAssetIcon()}

                {/* Button text */}
                <span className="mint-button__text">
                    {getButtonText()}
                </span>

                {/* Premium indicator for TimePass */}
                {asset.type === 'TIMEPASS_NFT' && !isLoadingState && (
                    <div className="mint-button__premium-badge">
                        <Sparkles size={12} />
                    </div>
                )}

                {/* Lock icon for requirements */}
                {hasRequirements && isDisabled && !isLoadingState && (
                    <Lock className="mint-button__lock" size={16} />
                )}

                {/* Ripple effect */}
                <div className="mint-button__ripple" />
            </button>

            {/* Requirements tooltip */}
            {hasRequirements && (
                <div
                    id={`requirements-${asset.id}`}
                    className={`mint-button__requirements ${isHovered ? 'mint-button__requirements--visible' : ''}`}
                >
                    <div className="mint-button__requirements-content">
                        <h4>Requirements:</h4>
                        <ul>
                            {requirements.map((requirement, index) => (
                                <li key={index}>{requirement}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/* Benefits preview on hover */}
            {isHovered && canMint(asset) && asset.benefits && (
                <div className="mint-button__benefits">
                    <div className="mint-button__benefits-content">
                        <h4>Benefits:</h4>
                        <ul>
                            {asset.benefits.slice(0, 3).map((benefit, index) => (
                                <li key={index}>{benefit}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MintButton;
