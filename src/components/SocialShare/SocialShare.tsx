/**
 * Social Share Component - VIRAL MARKETING
 * Target: 20-30% increase in organic traffic through social sharing
 */

import { Check, Copy, ExternalLink, Facebook, Share2, Twitter } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';

interface ShareData {
    assetName: string;
    assetAmount: number;
    usdValue: number;
    goldOz: number;
    silverOz: number;
    workHours: number;
}

interface SocialShareProps {
    shareData: ShareData;
    className?: string;
}

const SocialShare: React.FC<SocialShareProps> = ({ shareData, className = '' }) => {
    const [copied, setCopied] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const { track } = useAnalytics();

    const generateShareText = useCallback(() => {
        const { assetName, assetAmount, usdValue, goldOz, workHours } = shareData;

        return `🚀 ${assetAmount} ${assetName} = $${usdValue.toLocaleString()} USD!

💰 That's ${goldOz.toFixed(4)} oz of GOLD
⏰ Or ${workHours.toFixed(1)} hours of work

Check out TimeVault Calculator: `;
    }, [shareData]);

    const generateShareUrl = useCallback(() => {
        const baseUrl = 'https://timevaultai.com';
        const params = new URLSearchParams({
            utm_source: 'social_share',
            utm_medium: 'viral',
            utm_campaign: 'calculator_results',
            asset: shareData.assetName,
            value: shareData.usdValue.toString()
        });
        return `${baseUrl}?${params.toString()}`;
    }, [shareData]);

    const handleShare = useCallback(async (platform: string) => {
        const text = generateShareText();
        const url = generateShareUrl();

        // Track sharing attempt
        track('social_share_initiated', {
            platform,
            asset: shareData.assetName,
            value: shareData.usdValue,
            gold_oz: shareData.goldOz,
            referral_potential: 'high'
        });

        let shareUrl = '';

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&hashtags=crypto,gold,TimeVault`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&title=${encodeURIComponent('TimeVault Calculator Results')}&summary=${encodeURIComponent(text)}`;
                break;
            case 'reddit':
                shareUrl = `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
                break;
            case 'native':
                if (navigator.share) {
                    try {
                        await navigator.share({
                            title: 'TimeVault Calculator Results',
                            text: text,
                            url: url
                        });
                        track('native_share_completed', { platform: 'native' });
                        return;
                    } catch (error) {
                        console.log('Native sharing failed:', error);
                    }
                }
                break;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
            track('social_share_opened', { platform, url: shareUrl });
        }
    }, [shareData, generateShareText, generateShareUrl, track]);

    const handleCopyLink = useCallback(async () => {
        const url = generateShareUrl();

        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);

            track('share_link_copied', {
                asset: shareData.assetName,
                value: shareData.usdValue,
                referral_link: url
            });
        } catch (error) {
            console.error('Failed to copy:', error);
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = url;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, [generateShareUrl, shareData, track]);

    return (
        <>
            <div className={`social-share ${className}`}>
                <button
                    onClick={() => setShowShareModal(true)}
                    className="share-trigger"
                    style={{
                        background: 'linear-gradient(135deg, #D4AF37, #F4C430)',
                        color: '#001F3F',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 20px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 6px 16px rgba(212, 175, 55, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(212, 175, 55, 0.3)';
                    }}
                >
                    <Share2 size={16} />
                    Share Results & Earn Rewards
                </button>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="share-modal-overlay" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="share-modal" style={{
                        background: 'linear-gradient(135deg, #001F3F, #002A5C)',
                        border: '2px solid #D4AF37',
                        borderRadius: '16px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '90%',
                        color: '#FFFFFF'
                    }}>
                        <div className="modal-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <h3 style={{ margin: 0, color: '#D4AF37' }}>
                                💎 Share Your Results
                            </h3>
                            <button
                                onClick={() => setShowShareModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#9CA3AF',
                                    cursor: 'pointer',
                                    fontSize: '1.5rem'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="share-preview" style={{
                            background: 'rgba(212, 175, 55, 0.1)',
                            border: '1px solid #D4AF37',
                            borderRadius: '8px',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            lineHeight: 1.4
                        }}>
                            {generateShareText()}
                            <strong style={{ color: '#D4AF37' }}>timevaultai.com</strong>
                        </div>

                        <div className="share-buttons" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <button
                                onClick={() => handleShare('twitter')}
                                style={{
                                    background: '#1DA1F2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                            >
                                <Twitter size={16} />
                                Twitter
                            </button>

                            <button
                                onClick={() => handleShare('facebook')}
                                style={{
                                    background: '#4267B2',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                            >
                                <Facebook size={16} />
                                Facebook
                            </button>

                            <button
                                onClick={() => handleShare('linkedin')}
                                style={{
                                    background: '#0077B5',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                            >
                                <ExternalLink size={16} />
                                LinkedIn
                            </button>

                            <button
                                onClick={() => handleShare('reddit')}
                                style={{
                                    background: '#FF4500',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    fontSize: '0.9rem',
                                    fontWeight: '500'
                                }}
                            >
                                <ExternalLink size={16} />
                                Reddit
                            </button>
                        </div>

                        <div className="copy-section" style={{
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            padding: '1rem'
                        }}>
                            <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#9CA3AF' }}>
                                Or copy the link to share anywhere:
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    value={generateShareUrl()}
                                    readOnly
                                    style={{
                                        flex: 1,
                                        background: 'rgba(51, 65, 85, 0.5)',
                                        border: '1px solid #475569',
                                        borderRadius: '6px',
                                        padding: '8px 12px',
                                        color: '#E2E8F0',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    onClick={handleCopyLink}
                                    style={{
                                        background: copied ? '#10B981' : '#D4AF37',
                                        color: copied ? 'white' : '#001F3F',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.9rem',
                                        fontWeight: '500',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {copied ? <Check size={16} /> : <Copy size={16} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="share-incentive" style={{
                            marginTop: '1.5rem',
                            textAlign: 'center',
                            padding: '1rem',
                            background: 'rgba(212, 175, 55, 0.1)',
                            borderRadius: '8px',
                            border: '1px solid #D4AF37'
                        }}>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#D4AF37', marginBottom: '0.5rem' }}>
                                🎁 Earn Rewards for Sharing!
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#C0C0C0' }}>
                                Get early access to premium features when your shared links bring new users to TimeVault.
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SocialShare;
