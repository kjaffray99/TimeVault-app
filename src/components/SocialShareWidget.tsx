'use client';

import { Copy, Gift, MessageCircle, Share2, Twitter } from 'lucide-react';
import { useState } from 'react';

interface SocialShareProps {
    cryptoSymbol: string;
    amount: number;
    totalValue: number;
    workHours: number;
    goldOunces: number;
    url?: string;
}

export default function SocialShareWidget({
    cryptoSymbol,
    amount,
    totalValue,
    workHours,
    goldOunces,
    url = 'https://timevaultai.com'
}: SocialShareProps) {
    const [showTVLTReward, setShowTVLTReward] = useState(false);
    const [copied, setCopied] = useState(false);

    // Optimized shareable content for maximum virality
    const shareTexts = {
        twitter: `💎 ${amount} ${cryptoSymbol.toUpperCase()} = ${workHours.toFixed(1)} hours of work!\n\nThat's $${totalValue.toLocaleString()} or ${goldOunces.toFixed(2)} oz of gold 🏆\n\nCalculate yours: ${url}\n\n#Crypto #TimeValue #Bitcoin #Ethereum`,
        telegram: `🧮 TimeVault Calculator Results:\n\n💰 ${amount} ${cryptoSymbol.toUpperCase()} = $${totalValue.toLocaleString()}\n⏰ ${workHours.toFixed(1)} hours of work\n🥇 ${goldOunces.toFixed(2)} oz of gold\n\nSee how much YOUR crypto is worth: ${url}`,
        general: `💎 My ${amount} ${cryptoSymbol.toUpperCase()} is worth ${workHours.toFixed(1)} hours of work! That's $${totalValue.toLocaleString()} or ${goldOunces.toFixed(2)} oz of gold. Calculate yours at ${url}`
    };

    const handleShare = async (platform: string) => {
        // Track share for analytics
        if (typeof window !== 'undefined' && window.trackSocialShare) {
            window.trackSocialShare(platform, cryptoSymbol);
        }

        // Show TVLT reward notification
        setShowTVLTReward(true);
        setTimeout(() => setShowTVLTReward(false), 3000);

        let shareUrl = '';
        const text = shareTexts[platform as keyof typeof shareTexts] || shareTexts.general;

        switch (platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTexts.twitter)}`;
                break;
            case 'telegram':
                shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareTexts.telegram)}`;
                break;
            case 'copy':
                await navigator.clipboard.writeText(shareTexts.general);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                return;
        }

        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    };

    return (
        <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-gold/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-5 h-5 text-gold" />
                <h3 className="text-xl font-semibold text-white">Share Your Results</h3>
                <div className="bg-gold/20 text-gold px-2 py-1 rounded-full text-sm font-medium">
                    +15 TVLT per share
                </div>
            </div>

            <p className="text-blue-100 mb-6">
                Share your calculation and earn 15 TVLT tokens per share! Help others discover the true value of their crypto.
            </p>

            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={() => handleShare('twitter')}
                    className="flex flex-col items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                    <Twitter className="w-5 h-5" />
                    <span className="text-sm font-medium">Twitter</span>
                </button>

                <button
                    onClick={() => handleShare('telegram')}
                    className="flex flex-col items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">Telegram</span>
                </button>

                <button
                    onClick={() => handleShare('copy')}
                    className="flex flex-col items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white p-4 rounded-xl transition-all duration-200 transform hover:scale-105"
                >
                    <Copy className="w-5 h-5" />
                    <span className="text-sm font-medium">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
            </div>

            {/* TVLT Reward Notification */}
            {showTVLTReward && (
                <div className="mt-4 bg-gradient-to-r from-gold/20 to-yellow-500/20 border border-gold/40 rounded-lg p-4 animate-pulse">
                    <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-gold" />
                        <div>
                            <p className="text-gold font-semibold">+15 TVLT Earned!</p>
                            <p className="text-yellow-200 text-sm">Thank you for sharing TimeVault!</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Upsell */}
            <div className="mt-6 pt-4 border-t border-gold/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-white font-medium">Want advanced analytics?</p>
                        <p className="text-blue-200 text-sm">Get AI insights & price predictions</p>
                    </div>
                    <button
                        onClick={() => {
                            if (typeof window !== 'undefined' && window.trackPremiumClick) {
                                window.trackPremiumClick('share_widget_premium');
                            }
                        }}
                        className="bg-gradient-to-r from-gold to-yellow-500 text-navy px-4 py-2 rounded-lg font-semibold hover:from-yellow-500 hover:to-gold transition-all duration-200"
                    >
                        Upgrade
                    </button>
                </div>
            </div>
        </div>
    );
}

// Type declarations for analytics
declare global {
    interface Window {
        trackSocialShare?: (platform: string, crypto: string) => void;
        trackPremiumClick?: (feature: string) => void;
    }
}
