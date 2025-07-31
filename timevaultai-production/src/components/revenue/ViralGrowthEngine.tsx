/**
 * Viral Growth Engine
 * Implements aggressive viral mechanics for exponential user acquisition
 * Targeting 10x user growth through gamified sharing and network effects
 */

import {
    Award,
    Crown,
    Gift,
    Medal,
    Rocket,
    Share2,
    Star,
    Target,
    TrendingUp,
    Trophy,
    Users,
    Zap
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ViralCampaign {
    id: string;
    name: string;
    description: string;
    reward: number;
    progress: number;
    target: number;
    type: 'referral' | 'social' | 'content' | 'achievement';
    multiplier: number;
    timeLimit?: number;
    unlocked: boolean;
}

interface SocialShare {
    platform: string;
    icon: string;
    shareUrl: string;
    reward: number;
    completed: boolean;
}

interface ViralMetrics {
    totalShares: number;
    referralsGenerated: number;
    viralCoefficient: number;
    networkValue: number;
    rewardsEarned: number;
    level: number;
    experience: number;
    nextLevelXP: number;
}

interface LeaderboardEntry {
    rank: number;
    username: string;
    referrals: number;
    rewards: number;
    badge: string;
}

const ViralGrowthEngine: React.FC = () => {
    const [campaigns, setCampaigns] = useState<ViralCampaign[]>([
        {
            id: 'mega-referral',
            name: 'Mega Referral Challenge',
            description: 'Refer 10 friends and unlock premium features for 6 months FREE',
            reward: 500,
            progress: 3,
            target: 10,
            type: 'referral',
            multiplier: 2.0,
            timeLimit: 7,
            unlocked: true
        },
        {
            id: 'social-storm',
            name: 'Social Media Storm',
            description: 'Share on 5 platforms for instant TVLT tokens and premium trial',
            reward: 100,
            progress: 2,
            target: 5,
            type: 'social',
            multiplier: 1.5,
            unlocked: true
        },
        {
            id: 'content-creator',
            name: 'Content Creator Bonus',
            description: 'Create original content about TimeVault for massive rewards',
            reward: 1000,
            progress: 0,
            target: 1,
            type: 'content',
            multiplier: 3.0,
            unlocked: false
        },
        {
            id: 'quiz-master',
            name: 'Quiz Master Achievement',
            description: 'Complete all quizzes with perfect scores',
            reward: 250,
            progress: 7,
            target: 12,
            type: 'achievement',
            multiplier: 1.8,
            unlocked: true
        }
    ]);

    const [socialShares, setSocialShares] = useState<SocialShare[]>([
        {
            platform: 'Twitter',
            icon: '🐦',
            shareUrl: 'https://twitter.com/intent/tweet?text=',
            reward: 25,
            completed: false
        },
        {
            platform: 'Facebook',
            icon: '📘',
            shareUrl: 'https://www.facebook.com/sharer/sharer.php?u=',
            reward: 25,
            completed: false
        },
        {
            platform: 'LinkedIn',
            icon: '💼',
            shareUrl: 'https://www.linkedin.com/sharing/share-offsite/?url=',
            reward: 30,
            completed: false
        },
        {
            platform: 'Reddit',
            icon: '🔴',
            shareUrl: 'https://reddit.com/submit?url=',
            reward: 35,
            completed: false
        },
        {
            platform: 'Discord',
            icon: '🎮',
            shareUrl: 'https://discord.com/channels/@me',
            reward: 20,
            completed: false
        }
    ]);

    const [metrics, setMetrics] = useState<ViralMetrics>({
        totalShares: 47,
        referralsGenerated: 12,
        viralCoefficient: 0.34,
        networkValue: 1247.50,
        rewardsEarned: 425,
        level: 3,
        experience: 1650,
        nextLevelXP: 2000
    });

    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([
        { rank: 1, username: 'CryptoMaster2024', referrals: 47, rewards: 2150, badge: '👑' },
        { rank: 2, username: 'GoldDigger Pro', referrals: 34, rewards: 1680, badge: '🥇' },
        { rank: 3, username: 'TimeVault Hero', referrals: 28, rewards: 1340, badge: '🥈' },
        { rank: 4, username: 'MetalsGuru', referrals: 23, rewards: 1120, badge: '🥉' },
        { rank: 5, username: 'YOU', referrals: 12, rewards: 425, badge: '⭐' }
    ]);

    const [userReferralCode, setUserReferralCode] = useState('VAULT2024X');
    const [showRewardAnimation, setShowRewardAnimation] = useState(false);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                totalShares: prev.totalShares + Math.floor(Math.random() * 2),
                networkValue: prev.networkValue + Math.random() * 25
            }));
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const generateReferralLink = () => {
        return `${window.location.origin}?ref=${userReferralCode}&utm_source=referral&utm_campaign=viral_growth`;
    };

    const shareOnPlatform = async (platform: SocialShare) => {
        const referralLink = generateReferralLink();
        const shareText = encodeURIComponent(
            `🚀 Just discovered TimeVault - convert crypto to precious metals and see your time value! Use my link for bonus TVLT tokens: ${referralLink} #TimeVault #Crypto #PreciousMetals`
        );

        let shareUrl = '';
        switch (platform.platform) {
            case 'Twitter':
                shareUrl = `${platform.shareUrl}${shareText}`;
                break;
            case 'Facebook':
                shareUrl = `${platform.shareUrl}${encodeURIComponent(referralLink)}`;
                break;
            case 'LinkedIn':
                shareUrl = `${platform.shareUrl}${encodeURIComponent(referralLink)}`;
                break;
            case 'Reddit':
                shareUrl = `${platform.shareUrl}${encodeURIComponent(referralLink)}&title=${encodeURIComponent('TimeVault - Convert Crypto to Precious Metals!')}`;
                break;
            default:
                shareUrl = referralLink;
        }

        // Open share dialog
        window.open(shareUrl, '_blank', 'width=600,height=400');

        // Mark as completed and award tokens
        setSocialShares(prev =>
            prev.map(share =>
                share.platform === platform.platform
                    ? { ...share, completed: true }
                    : share
            )
        );

        // Animate reward
        setShowRewardAnimation(true);
        setTimeout(() => setShowRewardAnimation(false), 2000);

        // Update metrics
        setMetrics(prev => ({
            ...prev,
            totalShares: prev.totalShares + 1,
            rewardsEarned: prev.rewardsEarned + platform.reward,
            experience: prev.experience + platform.reward
        }));

        // Track the share
        trackViralEvent('social_share', {
            platform: platform.platform,
            reward: platform.reward,
            referralCode: userReferralCode
        });
    };

    const copyReferralLink = async () => {
        const link = generateReferralLink();
        try {
            await navigator.clipboard.writeText(link);
            setShowRewardAnimation(true);
            setTimeout(() => setShowRewardAnimation(false), 1500);

            // Bonus for copying link
            setMetrics(prev => ({
                ...prev,
                rewardsEarned: prev.rewardsEarned + 10,
                experience: prev.experience + 10
            }));
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const claimCampaignReward = (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        if (!campaign || campaign.progress < campaign.target) return;

        const baseReward = campaign.reward;
        const multipliedReward = baseReward * campaign.multiplier;

        setMetrics(prev => ({
            ...prev,
            rewardsEarned: prev.rewardsEarned + multipliedReward,
            experience: prev.experience + multipliedReward
        }));

        // Mark campaign as completed
        setCampaigns(prev =>
            prev.map(c =>
                c.id === campaignId
                    ? { ...c, progress: c.target, unlocked: false }
                    : c
            )
        );

        setShowRewardAnimation(true);
        setTimeout(() => setShowRewardAnimation(false), 3000);

        trackViralEvent('campaign_completed', {
            campaignId,
            reward: multipliedReward,
            multiplier: campaign.multiplier
        });
    };

    const trackViralEvent = (eventName: string, properties: Record<string, any>) => {
        console.log('🦠 Viral Event:', eventName, properties);

        // Analytics tracking
        if (typeof window !== 'undefined' && (window as any).gtag) {
            (window as any).gtag('event', eventName, properties);
        }
    };

    const calculateLevelProgress = () => {
        return (metrics.experience / metrics.nextLevelXP) * 100;
    };

    const getViralCoefficientColor = (coefficient: number) => {
        if (coefficient >= 1.0) return 'text-green-600';
        if (coefficient >= 0.5) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getBadgeForRank = (rank: number) => {
        switch (rank) {
            case 1: return '👑';
            case 2: return '🥇';
            case 3: return '🥈';
            case 4: return '🥉';
            default: return '⭐';
        }
    };

    return (
        <div className="viral-growth-engine">
            {/* Animated Reward Notification */}
            {showRewardAnimation && (
                <div className="reward-animation">
                    <div className="reward-popup">
                        <Gift className="w-8 h-8 text-[#D4AF37]" />
                        <span>Tokens Earned! 🎉</span>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="viral-header">
                <div className="header-content">
                    <h1 className="viral-title">
                        <Rocket className="w-8 h-8 text-[#D4AF37]" />
                        Viral Growth Center
                    </h1>
                    <div className="viral-subtitle">
                        Share TimeVault, Earn Rewards, Build Your Network
                    </div>
                </div>
            </div>

            {/* User Level and Progress */}
            <div className="user-level-section">
                <div className="level-card">
                    <div className="level-header">
                        <Crown className="w-6 h-6 text-[#D4AF37]" />
                        <span className="level-text">Level {metrics.level} Viral Champion</span>
                    </div>
                    <div className="experience-bar">
                        <div
                            className="experience-fill"
                            style={{ width: `${calculateLevelProgress()}%` }}
                        ></div>
                    </div>
                    <div className="experience-text">
                        {metrics.experience} / {metrics.nextLevelXP} XP
                    </div>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="viral-metrics">
                <div className="metric-card">
                    <Share2 className="w-6 h-6 text-blue-600" />
                    <div className="metric-value">{metrics.totalShares}</div>
                    <div className="metric-label">Total Shares</div>
                </div>
                <div className="metric-card">
                    <Users className="w-6 h-6 text-green-600" />
                    <div className="metric-value">{metrics.referralsGenerated}</div>
                    <div className="metric-label">Referrals</div>
                </div>
                <div className="metric-card">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                    <div className={`metric-value ${getViralCoefficientColor(metrics.viralCoefficient)}`}>
                        {metrics.viralCoefficient.toFixed(2)}
                    </div>
                    <div className="metric-label">Viral Coefficient</div>
                </div>
                <div className="metric-card">
                    <Trophy className="w-6 h-6 text-[#D4AF37]" />
                    <div className="metric-value">{metrics.rewardsEarned}</div>
                    <div className="metric-label">TVLT Earned</div>
                </div>
            </div>

            {/* Referral Link Section */}
            <div className="referral-section">
                <h2 className="section-title">
                    <Target className="w-6 h-6" />
                    Your Referral Arsenal
                </h2>
                <div className="referral-card">
                    <div className="referral-header">
                        <h3>Personal Referral Code</h3>
                        <div className="referral-code">{userReferralCode}</div>
                    </div>
                    <div className="referral-link-container">
                        <input
                            type="text"
                            value={generateReferralLink()}
                            readOnly
                            className="referral-input"
                        />
                        <button
                            onClick={copyReferralLink}
                            className="copy-button"
                        >
                            Copy Link (+10 TVLT)
                        </button>
                    </div>
                    <div className="referral-stats">
                        <div className="stat">
                            <span className="stat-label">Clicks:</span>
                            <span className="stat-value">47</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Conversions:</span>
                            <span className="stat-value">12</span>
                        </div>
                        <div className="stat">
                            <span className="stat-label">Rate:</span>
                            <span className="stat-value">25.5%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Social Sharing Grid */}
            <div className="social-sharing-section">
                <h2 className="section-title">
                    <Share2 className="w-6 h-6" />
                    Social Media Blitz
                </h2>
                <div className="social-grid">
                    {socialShares.map((platform, index) => (
                        <div key={index} className={`social-card ${platform.completed ? 'completed' : ''}`}>
                            <div className="social-header">
                                <span className="social-icon">{platform.icon}</span>
                                <span className="social-name">{platform.platform}</span>
                            </div>
                            <div className="social-reward">+{platform.reward} TVLT</div>
                            <button
                                onClick={() => shareOnPlatform(platform)}
                                disabled={platform.completed}
                                className="social-share-btn"
                            >
                                {platform.completed ? '✅ Shared' : 'Share Now'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Viral Campaigns */}
            <div className="campaigns-section">
                <h2 className="section-title">
                    <Zap className="w-6 h-6" />
                    Viral Campaigns
                </h2>
                <div className="campaigns-grid">
                    {campaigns.map((campaign) => (
                        <div key={campaign.id} className={`campaign-card ${!campaign.unlocked ? 'locked' : ''}`}>
                            <div className="campaign-header">
                                <div className="campaign-type">
                                    {campaign.type === 'referral' && <Users className="w-5 h-5" />}
                                    {campaign.type === 'social' && <Share2 className="w-5 h-5" />}
                                    {campaign.type === 'content' && <Star className="w-5 h-5" />}
                                    {campaign.type === 'achievement' && <Trophy className="w-5 h-5" />}
                                </div>
                                <div className="campaign-multiplier">
                                    {campaign.multiplier}x multiplier
                                </div>
                            </div>
                            <h3 className="campaign-name">{campaign.name}</h3>
                            <p className="campaign-description">{campaign.description}</p>
                            <div className="campaign-progress">
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${(campaign.progress / campaign.target) * 100}%` }}
                                    ></div>
                                </div>
                                <span className="progress-text">
                                    {campaign.progress} / {campaign.target}
                                </span>
                            </div>
                            <div className="campaign-reward">
                                <span className="reward-amount">{campaign.reward * campaign.multiplier} TVLT</span>
                                {campaign.timeLimit && (
                                    <span className="time-limit">{campaign.timeLimit} days left</span>
                                )}
                            </div>
                            <button
                                onClick={() => claimCampaignReward(campaign.id)}
                                disabled={campaign.progress < campaign.target || !campaign.unlocked}
                                className="campaign-claim-btn"
                            >
                                {campaign.progress >= campaign.target ? 'Claim Reward' : 'In Progress'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Leaderboard */}
            <div className="leaderboard-section">
                <h2 className="section-title">
                    <Award className="w-6 h-6" />
                    Viral Champions Leaderboard
                </h2>
                <div className="leaderboard">
                    {leaderboard.map((entry) => (
                        <div key={entry.rank} className={`leaderboard-entry ${entry.username === 'YOU' ? 'user-entry' : ''}`}>
                            <div className="rank">
                                <span className="rank-number">#{entry.rank}</span>
                                <span className="rank-badge">{entry.badge}</span>
                            </div>
                            <div className="user-info">
                                <span className="username">{entry.username}</span>
                                <div className="user-stats">
                                    <span>{entry.referrals} referrals</span>
                                    <span>{entry.rewards} TVLT</span>
                                </div>
                            </div>
                            {entry.username === 'YOU' && (
                                <div className="user-indicator">
                                    <Medal className="w-5 h-5 text-[#D4AF37]" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Network Value Display */}
            <div className="network-value-section">
                <div className="network-card">
                    <h3 className="network-title">Your Network Value</h3>
                    <div className="network-amount">${metrics.networkValue.toFixed(2)}</div>
                    <p className="network-description">
                        Total value generated through your referral network
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ViralGrowthEngine;
