/**
 * Viral Growth Engine - Social Sharing & Referral System
 * Designed for exponential user acquisition and viral loops
 */

import {
    Check,
    Copy,
    Crown,
    Facebook,
    Gift,
    Linkedin, Mail,
    Share2,
    Star,
    TrendingUp,
    Trophy,
    Twitter,
    Users
} from 'lucide-react';
import React, { useRef, useState } from 'react';

interface ReferralStats {
    totalReferrals: number;
    successfulReferrals: number;
    pendingReferrals: number;
    totalEarnings: number;
    currentTier: string;
    nextTierProgress: number;
}

interface SocialShareData {
    type: 'calculation' | 'quiz_result' | 'milestone' | 'referral';
    title: string;
    description: string;
    imageUrl?: string;
    data?: any;
}

interface ViralMilestone {
    id: string;
    title: string;
    description: string;
    reward: number;
    achieved: boolean;
    progress: number;
    target: number;
    icon: React.ReactNode;
}

const REFERRAL_TIERS = [
    { name: 'Bronze', min: 0, max: 4, bonus: 0, color: '#CD7F32' },
    { name: 'Silver', min: 5, max: 14, bonus: 10, color: '#C0C0C0' },
    { name: 'Gold', min: 15, max: 49, bonus: 25, color: '#D4AF37' },
    { name: 'Platinum', min: 50, max: 99, bonus: 50, color: '#E5E4E2' },
    { name: 'Diamond', min: 100, max: Infinity, bonus: 100, color: '#B9F2FF' }
];

const VIRAL_MILESTONES: ViralMilestone[] = [
    {
        id: 'first_share',
        title: 'First Share',
        description: 'Share your first calculation result',
        reward: 50,
        achieved: false,
        progress: 0,
        target: 1,
        icon: <Share2 className="milestone-icon" />
    },
    {
        id: 'five_referrals',
        title: 'Network Builder',
        description: 'Refer 5 friends to TimeVault',
        reward: 250,
        achieved: false,
        progress: 2,
        target: 5,
        icon: <Users className="milestone-icon" />
    },
    {
        id: 'viral_content',
        title: 'Viral Creator',
        description: 'Get 100 views on shared content',
        reward: 500,
        achieved: false,
        progress: 47,
        target: 100,
        icon: <TrendingUp className="milestone-icon" />
    },
    {
        id: 'community_leader',
        title: 'Community Leader',
        description: 'Help 25 people upgrade to premium',
        reward: 1000,
        achieved: false,
        progress: 3,
        target: 25,
        icon: <Crown className="milestone-icon" />
    }
];

export const ViralGrowthEngine: React.FC<{
    onShareGenerated: (shareData: SocialShareData) => void;
    onReferralCreated: (referralCode: string) => void;
    userStats: {
        calculationsPerformed: number;
        quizzesTaken: number;
        tvltTokens: number;
        premiumStatus: boolean;
    };
}> = ({ onShareGenerated, onReferralCreated, userStats }) => {
    const [activeTab, setActiveTab] = useState<'share' | 'referral' | 'milestones'>('share');
    const [referralStats, setReferralStats] = useState<ReferralStats>({
        totalReferrals: 7,
        successfulReferrals: 3,
        pendingReferrals: 4,
        totalEarnings: 325,
        currentTier: 'Silver',
        nextTierProgress: 60
    });
    const [userReferralCode] = useState(`TV${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
    const [shareableContent, setShareableContent] = useState<SocialShareData | null>(null);
    const [copiedText, setCopiedText] = useState('');
    const [viralMilestones, setViralMilestones] = useState(VIRAL_MILESTONES);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Generate shareable content based on user activity
    const generateShareableContent = (type: SocialShareData['type']) => {
        const baseUrl = 'https://timevaultai.com';

        switch (type) {
            case 'calculation':
                return {
                    type,
                    title: '🚀 Just converted my crypto to precious metals with TimeVault!',
                    description: `Discovered that my crypto portfolio equals ${(Math.random() * 50 + 10).toFixed(1)} oz of gold! 💰 Time to diversify smartly.`,
                    imageUrl: generateCalculationImage(),
                };
            case 'quiz_result':
                return {
                    type,
                    title: '🧠 Aced the TimeVault investment knowledge quiz!',
                    description: `Scored ${85 + Math.floor(Math.random() * 15)}% and earned ${userStats.tvltTokens} TVLT tokens. Test your crypto & precious metals knowledge!`,
                    imageUrl: generateQuizResultImage(),
                };
            case 'milestone':
                return {
                    type,
                    title: '🎯 Hit a major milestone on TimeVault!',
                    description: `Just earned ${userStats.tvltTokens} TVLT tokens and unlocked exclusive features. Join the smart money movement!`,
                    imageUrl: generateMilestoneImage(),
                };
            case 'referral':
                return {
                    type,
                    title: '💎 Exclusive invite to TimeVault Premium',
                    description: `Join me on TimeVault and get exclusive access to advanced crypto-to-metals conversion tools. Use my code: ${userReferralCode}`,
                    imageUrl: generateReferralImage(),
                };
            default:
                return null;
        }
    };

    // Generate visual content for sharing
    const generateCalculationImage = (): string => {
        if (!canvasRef.current) return '';

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return '';

        // Set canvas size
        canvas.width = 1200;
        canvas.height = 630;

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#001F3F');
        gradient.addColorStop(1, '#003366');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add TimeVault branding
        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('TimeVault', canvas.width / 2, 100);

        // Add calculation result
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '36px Arial';
        ctx.fillText('My Crypto Portfolio =', canvas.width / 2, 200);

        ctx.fillStyle = '#D4AF37';
        ctx.font = 'bold 72px Arial';
        ctx.fillText(`${(Math.random() * 50 + 10).toFixed(1)} oz Gold`, canvas.width / 2, 300);

        // Add call to action
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '28px Arial';
        ctx.fillText('Calculate yours at timevaultai.com', canvas.width / 2, 400);

        return canvas.toDataURL();
    };

    const generateQuizResultImage = (): string => {
        // Similar canvas generation for quiz results
        return 'data:image/png;base64,quiz_result_placeholder';
    };

    const generateMilestoneImage = (): string => {
        // Similar canvas generation for milestones
        return 'data:image/png;base64,milestone_placeholder';
    };

    const generateReferralImage = (): string => {
        // Similar canvas generation for referrals
        return 'data:image/png;base64,referral_placeholder';
    };

    const handleShare = (platform: string, content: SocialShareData) => {
        const shareUrl = `https://timevaultai.com?ref=${userReferralCode}`;
        const text = `${content.title}\n\n${content.description}`;

        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(text)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(text)}`,
            instagram: shareUrl, // Instagram requires manual sharing
            email: `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`
        };

        if (urls[platform as keyof typeof urls]) {
            window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
        }

        onShareGenerated(content);
        updateViralMilestones('share');
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedText(text);
            setTimeout(() => setCopiedText(''), 2000);
        });
    };

    const updateViralMilestones = (action: string) => {
        setViralMilestones(prev => prev.map(milestone => {
            let newProgress = milestone.progress;

            if (action === 'share' && milestone.id === 'first_share') {
                newProgress = Math.min(milestone.target, milestone.progress + 1);
            } else if (action === 'referral' && milestone.id === 'five_referrals') {
                newProgress = Math.min(milestone.target, milestone.progress + 1);
            }

            return {
                ...milestone,
                progress: newProgress,
                achieved: newProgress >= milestone.target
            };
        }));
    };

    const renderShareTab = () => (
        <div className="share-tab">
            <h3>🚀 Share Your Success</h3>
            <p>Share your TimeVault achievements and earn TVLT tokens for every engagement!</p>

            <div className="share-options">
                {[
                    { type: 'calculation' as const, label: 'My Latest Calculation', emoji: '💰' },
                    { type: 'quiz_result' as const, label: 'Quiz Achievement', emoji: '🧠' },
                    { type: 'milestone' as const, label: 'Personal Milestone', emoji: '🎯' },
                    { type: 'referral' as const, label: 'Invite Friends', emoji: '💎' }
                ].map(option => (
                    <button
                        key={option.type}
                        className="share-option"
                        onClick={() => setShareableContent(generateShareableContent(option.type))}
                    >
                        <span className="option-emoji">{option.emoji}</span>
                        <span>{option.label}</span>
                    </button>
                ))}
            </div>

            {shareableContent && (
                <div className="share-preview">
                    <div className="preview-content">
                        <h4>{shareableContent.title}</h4>
                        <p>{shareableContent.description}</p>
                        {shareableContent.imageUrl && (
                            <img src={shareableContent.imageUrl} alt="Share preview" className="preview-image" />
                        )}
                    </div>

                    <div className="social-buttons">
                        <button onClick={() => handleShare('twitter', shareableContent)} className="social-btn twitter">
                            <Twitter className="social-icon" />
                            Twitter
                        </button>
                        <button onClick={() => handleShare('facebook', shareableContent)} className="social-btn facebook">
                            <Facebook className="social-icon" />
                            Facebook
                        </button>
                        <button onClick={() => handleShare('linkedin', shareableContent)} className="social-btn linkedin">
                            <Linkedin className="social-icon" />
                            LinkedIn
                        </button>
                        <button onClick={() => handleShare('email', shareableContent)} className="social-btn email">
                            <Mail className="social-icon" />
                            Email
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    const renderReferralTab = () => {
        const currentTier = REFERRAL_TIERS.find(tier => tier.name === referralStats.currentTier);
        const nextTier = REFERRAL_TIERS.find(tier => tier.min > (currentTier?.max || 0));

        return (
            <div className="referral-tab">
                <h3>👥 Referral Program</h3>
                <p>Earn rewards for every friend you bring to TimeVault!</p>

                <div className="referral-stats">
                    <div className="stats-grid">
                        <div className="stat-card">
                            <Users className="stat-icon" />
                            <div>
                                <span className="stat-value">{referralStats.totalReferrals}</span>
                                <span className="stat-label">Total Referrals</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <Check className="stat-icon" />
                            <div>
                                <span className="stat-value">{referralStats.successfulReferrals}</span>
                                <span className="stat-label">Successful</span>
                            </div>
                        </div>
                        <div className="stat-card">
                            <Gift className="stat-icon" />
                            <div>
                                <span className="stat-value">${referralStats.totalEarnings}</span>
                                <span className="stat-label">Total Earned</span>
                            </div>
                        </div>
                    </div>

                    <div className="tier-progress">
                        <div className="tier-header">
                            <span className="current-tier" style={{ color: currentTier?.color }}>
                                {referralStats.currentTier} Tier
                            </span>
                            {nextTier && (
                                <span className="next-tier">
                                    Next: {nextTier.name} ({nextTier.min - referralStats.totalReferrals} more referrals)
                                </span>
                            )}
                        </div>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{
                                    width: `${referralStats.nextTierProgress}%`,
                                    background: currentTier?.color
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="referral-code-section">
                    <h4>Your Referral Code</h4>
                    <div className="code-container">
                        <span className="referral-code">{userReferralCode}</span>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(userReferralCode)}
                        >
                            {copiedText === userReferralCode ? <Check className="copy-icon" /> : <Copy className="copy-icon" />}
                            {copiedText === userReferralCode ? 'Copied!' : 'Copy'}
                        </button>
                    </div>

                    <div className="referral-link-container">
                        <span className="referral-link">https://timevaultai.com/?ref={userReferralCode}</span>
                        <button
                            className="copy-btn"
                            onClick={() => copyToClipboard(`https://timevaultai.com/?ref=${userReferralCode}`)}
                        >
                            {copiedText.includes(userReferralCode) ? <Check className="copy-icon" /> : <Copy className="copy-icon" />}
                            {copiedText.includes(userReferralCode) ? 'Copied!' : 'Copy Link'}
                        </button>
                    </div>
                </div>

                <div className="referral-rewards">
                    <h4>Referral Rewards</h4>
                    <div className="rewards-grid">
                        {REFERRAL_TIERS.map(tier => (
                            <div
                                key={tier.name}
                                className={`reward-tier ${referralStats.currentTier === tier.name ? 'active' : ''}`}
                            >
                                <h5 style={{ color: tier.color }}>{tier.name}</h5>
                                <p>{tier.min}-{tier.max === Infinity ? '∞' : tier.max} referrals</p>
                                <span className="bonus">+{tier.bonus}% bonus</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const renderMilestonesTab = () => (
        <div className="milestones-tab">
            <h3>🏆 Viral Milestones</h3>
            <p>Complete challenges to earn bonus TVLT tokens and unlock exclusive features!</p>

            <div className="milestones-grid">
                {viralMilestones.map(milestone => (
                    <div
                        key={milestone.id}
                        className={`milestone-card ${milestone.achieved ? 'achieved' : ''}`}
                    >
                        <div className="milestone-header">
                            {milestone.icon}
                            <div>
                                <h4>{milestone.title}</h4>
                                <p>{milestone.description}</p>
                            </div>
                            {milestone.achieved && <Check className="achievement-check" />}
                        </div>

                        <div className="milestone-progress">
                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${(milestone.progress / milestone.target) * 100}%` }}
                                />
                            </div>
                            <span className="progress-text">
                                {milestone.progress}/{milestone.target}
                            </span>
                        </div>

                        <div className="milestone-reward">
                            <Star className="reward-icon" />
                            <span>{milestone.reward} TVLT</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="viral-growth-engine">
            <canvas ref={canvasRef} style={{ display: 'none' }} />

            <div className="engine-header">
                <Share2 className="header-icon" />
                <h2>Viral Growth Center</h2>
                <div className="growth-stats">
                    <span>📈 {referralStats.totalReferrals} referrals</span>
                    <span>💰 ${referralStats.totalEarnings} earned</span>
                </div>
            </div>

            <div className="tab-navigation">
                {[
                    { id: 'share', label: 'Share', icon: <Share2 className="tab-icon" /> },
                    { id: 'referral', label: 'Refer Friends', icon: <Users className="tab-icon" /> },
                    { id: 'milestones', label: 'Milestones', icon: <Trophy className="tab-icon" /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id as any)}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="tab-content">
                {activeTab === 'share' && renderShareTab()}
                {activeTab === 'referral' && renderReferralTab()}
                {activeTab === 'milestones' && renderMilestonesTab()}
            </div>

            <style jsx>{`
        .viral-growth-engine {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: 2rem;
          margin: 2rem 0;
          color: #FFFFFF;
        }

        .engine-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
        }

        .engine-header h2 {
          flex: 1;
          color: #D4AF37;
          margin: 0;
        }

        .growth-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .tab-navigation {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          border-bottom: 2px solid rgba(212, 175, 55, 0.3);
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: #C0C0C0;
          padding: 1rem 1.5rem;
          border-radius: 8px 8px 0 0;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .tab-button.active {
          color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
        }

        .tab-button.active::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: #D4AF37;
        }

        .tab-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .tab-content {
          min-height: 400px;
        }

        .share-tab h3,
        .referral-tab h3,
        .milestones-tab h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .share-options {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin: 2rem 0;
        }

        .share-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-option:hover {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
          transform: translateY(-2px);
        }

        .option-emoji {
          font-size: 2rem;
        }

        .share-preview {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
          margin-top: 2rem;
        }

        .preview-content h4 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .preview-content p {
          color: #C0C0C0;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }

        .preview-image {
          width: 100%;
          max-width: 400px;
          height: auto;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .social-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .social-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
        }

        .social-btn:hover {
          transform: translateY(-2px);
        }

        .social-btn.twitter { background: #1DA1F2; }
        .social-btn.facebook { background: #1877F2; }
        .social-btn.linkedin { background: #0A66C2; }
        .social-btn.email { background: #EA4335; }

        .social-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        .referral-stats {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 8px;
        }

        .stat-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
          flex-shrink: 0;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .tier-progress {
          margin-top: 1rem;
        }

        .tier-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .current-tier {
          font-weight: 700;
          font-size: 1.125rem;
        }

        .next-tier {
          font-size: 0.875rem;
          color: #C0C0C0;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.5s ease;
        }

        .referral-code-section {
          margin-bottom: 2rem;
        }

        .referral-code-section h4 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .code-container,
        .referral-link-container {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1rem;
        }

        .referral-code,
        .referral-link {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          flex: 1;
          font-family: monospace;
          font-size: 1.125rem;
          color: #D4AF37;
        }

        .copy-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.2);
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .copy-btn:hover {
          background: rgba(212, 175, 55, 0.3);
        }

        .copy-icon {
          width: 1rem;
          height: 1rem;
        }

        .rewards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .reward-tier {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .reward-tier.active {
          border-color: currentColor;
          background: rgba(255, 255, 255, 0.15);
          transform: scale(1.05);
        }

        .reward-tier h5 {
          margin: 0 0 0.5rem 0;
          font-size: 1.25rem;
        }

        .reward-tier p {
          margin: 0.5rem 0;
          color: #C0C0C0;
          font-size: 0.875rem;
        }

        .bonus {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .milestones-grid {
          display: grid;
          gap: 1.5rem;
        }

        .milestone-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .milestone-card.achieved {
          border-color: #10B981;
          background: rgba(16, 185, 129, 0.1);
        }

        .milestone-header {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .milestone-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
          flex-shrink: 0;
        }

        .milestone-header h4 {
          margin: 0 0 0.5rem 0;
          color: #FFFFFF;
        }

        .milestone-header p {
          margin: 0;
          color: #C0C0C0;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .achievement-check {
          width: 1.5rem;
          height: 1.5rem;
          color: #10B981;
          margin-left: auto;
        }

        .milestone-progress {
          margin-bottom: 1rem;
        }

        .progress-text {
          font-size: 0.875rem;
          color: #C0C0C0;
          margin-top: 0.5rem;
          display: block;
        }

        .milestone-reward {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #D4AF37;
          font-weight: 600;
        }

        .reward-icon {
          width: 1.25rem;
          height: 1.25rem;
        }

        @media (max-width: 768px) {
          .viral-growth-engine {
            padding: 1rem;
            margin: 1rem 0;
          }

          .engine-header {
            flex-direction: column;
            text-align: center;
          }

          .tab-navigation {
            flex-direction: column;
          }

          .share-options {
            grid-template-columns: 1fr;
          }

          .social-buttons {
            justify-content: center;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .code-container,
          .referral-link-container {
            flex-direction: column;
          }

          .rewards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
        </div>
    );
};

export default ViralGrowthEngine;
