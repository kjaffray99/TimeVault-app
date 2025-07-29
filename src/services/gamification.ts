/**
 * DAY 2: VIRAL GROWTH & ADVANCED GAMIFICATION SYSTEM
 * Referral mechanics and engagement optimization
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useAnalytics } from '../services/analytics';

// Types for gamification system
interface UserProgress {
    level: number;
    xp: number;
    xpToNextLevel: number;
    streak: number;
    lastActivity: Date;
    achievements: Achievement[];
    tvltBalance: number;
    referralCode: string;
    referrals: ReferralData[];
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: 'calculator' | 'education' | 'social' | 'premium';
    xpReward: number;
    tvltReward: number;
    unlockedAt: Date;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface ReferralData {
    referredUserId: string;
    referredAt: Date;
    status: 'pending' | 'confirmed' | 'premium';
    rewardEarned: number;
    activity: string[];
}

interface SocialShare {
    platform: 'twitter' | 'facebook' | 'linkedin' | 'telegram' | 'discord';
    content: string;
    url: string;
    hashtags?: string[];
}

// Gamification Service Class
class GamificationService {
    private userProgress: UserProgress;
    private achievements: Achievement[] = [];
    private analytics: any;

    constructor(analytics: any) {
        this.analytics = analytics;
        this.userProgress = this.loadUserProgress();
        this.initializeAchievements();
    }

    private loadUserProgress(): UserProgress {
        const saved = localStorage.getItem('timeVault_userProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            progress.lastActivity = new Date(progress.lastActivity);
            return progress;
        }

        return {
            level: 1,
            xp: 0,
            xpToNextLevel: 100,
            streak: 0,
            lastActivity: new Date(),
            achievements: [],
            tvltBalance: 0,
            referralCode: this.generateReferralCode(),
            referrals: []
        };
    }

    private saveUserProgress() {
        localStorage.setItem('timeVault_userProgress', JSON.stringify(this.userProgress));
    }

    private generateReferralCode(): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = 'TV';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    private initializeAchievements() {
        this.achievements = [
            // Calculator Achievements
            {
                id: 'first_calculation',
                name: 'First Steps',
                description: 'Complete your first calculation',
                icon: '🏁',
                category: 'calculator',
                xpReward: 10,
                tvltReward: 1,
                unlockedAt: new Date(),
                rarity: 'common'
            },
            {
                id: 'whale_calculation',
                name: 'Whale Status',
                description: 'Calculate assets worth over $100,000',
                icon: '🐋',
                category: 'calculator',
                xpReward: 100,
                tvltReward: 25,
                unlockedAt: new Date(),
                rarity: 'epic'
            },
            {
                id: 'calculation_streak_7',
                name: 'Week Warrior',
                description: 'Use calculator 7 days in a row',
                icon: '🔥',
                category: 'calculator',
                xpReward: 50,
                tvltReward: 10,
                unlockedAt: new Date(),
                rarity: 'rare'
            },

            // Social Achievements
            {
                id: 'first_share',
                name: 'Spread the Word',
                description: 'Share your first calculation result',
                icon: '📢',
                category: 'social',
                xpReward: 20,
                tvltReward: 5,
                unlockedAt: new Date(),
                rarity: 'common'
            },
            {
                id: 'referral_master',
                name: 'Referral Master',
                description: 'Refer 10 active users',
                icon: '👑',
                category: 'social',
                xpReward: 200,
                tvltReward: 100,
                unlockedAt: new Date(),
                rarity: 'legendary'
            },
            {
                id: 'viral_share',
                name: 'Going Viral',
                description: 'Your shared content gets 100+ views',
                icon: '🚀',
                category: 'social',
                xpReward: 75,
                tvltReward: 20,
                unlockedAt: new Date(),
                rarity: 'rare'
            },

            // Education Achievements
            {
                id: 'knowledge_seeker',
                name: 'Knowledge Seeker',
                description: 'Complete 5 educational modules',
                icon: '📚',
                category: 'education',
                xpReward: 30,
                tvltReward: 8,
                unlockedAt: new Date(),
                rarity: 'common'
            },
            {
                id: 'quiz_champion',
                name: 'Quiz Champion',
                description: 'Score 100% on 3 different quizzes',
                icon: '🧠',
                category: 'education',
                xpReward: 60,
                tvltReward: 15,
                unlockedAt: new Date(),
                rarity: 'rare'
            },

            // Premium Achievements
            {
                id: 'premium_upgrade',
                name: 'Premium Pioneer',
                description: 'Upgrade to Premium membership',
                icon: '💎',
                category: 'premium',
                xpReward: 150,
                tvltReward: 50,
                unlockedAt: new Date(),
                rarity: 'epic'
            }
        ];
    }

    // Award XP and check for achievements
    awardXP(amount: number, source: string, metadata: any = {}) {
        this.userProgress.xp += amount;
        this.userProgress.lastActivity = new Date();

        // Check for level up
        if (this.userProgress.xp >= this.userProgress.xpToNextLevel) {
            this.levelUp();
        }

        // Check for achievements
        this.checkAchievements(source, metadata);

        // Update streak
        this.updateStreak();

        this.saveUserProgress();

        this.analytics.trackEvent('xp_awarded', {
            amount,
            source,
            total_xp: this.userProgress.xp,
            level: this.userProgress.level,
            ...metadata
        });
    }

    private levelUp() {
        this.userProgress.level++;
        this.userProgress.xp -= this.userProgress.xpToNextLevel;
        this.userProgress.xpToNextLevel = Math.floor(this.userProgress.xpToNextLevel * 1.5);

        // Award TVLT tokens for leveling up
        const tvltReward = this.userProgress.level * 5;
        this.userProgress.tvltBalance += tvltReward;

        this.analytics.trackEvent('level_up', {
            new_level: this.userProgress.level,
            tvlt_reward: tvltReward
        });

        // Show level up notification
        this.showNotification(`🎉 Level Up! You're now level ${this.userProgress.level}!`, 'success');
    }

    private checkAchievements(source: string, metadata: any) {
        const newAchievements: Achievement[] = [];

        this.achievements.forEach(achievement => {
            if (this.userProgress.achievements.some(a => a.id === achievement.id)) {
                return; // Already unlocked
            }

            let unlocked = false;

            switch (achievement.id) {
                case 'first_calculation':
                    unlocked = source === 'calculation_completed';
                    break;
                case 'whale_calculation':
                    unlocked = source === 'calculation_completed' && metadata.usdValue > 100000;
                    break;
                case 'calculation_streak_7':
                    unlocked = source === 'calculation_completed' && this.userProgress.streak >= 7;
                    break;
                case 'first_share':
                    unlocked = source === 'result_shared';
                    break;
                case 'referral_master':
                    unlocked = this.userProgress.referrals.filter(r => r.status === 'confirmed').length >= 10;
                    break;
                case 'premium_upgrade':
                    unlocked = source === 'premium_conversion';
                    break;
            }

            if (unlocked) {
                const unlockedAchievement = { ...achievement, unlockedAt: new Date() };
                this.userProgress.achievements.push(unlockedAchievement);
                this.userProgress.tvltBalance += achievement.tvltReward;
                newAchievements.push(unlockedAchievement);

                this.analytics.trackEvent('achievement_unlocked', {
                    achievement_id: achievement.id,
                    achievement_name: achievement.name,
                    xp_reward: achievement.xpReward,
                    tvlt_reward: achievement.tvltReward
                });
            }
        });

        // Show achievement notifications
        newAchievements.forEach(achievement => {
            this.showAchievementNotification(achievement);
        });
    }

    private updateStreak() {
        const today = new Date().toDateString();
        const lastActivity = this.userProgress.lastActivity.toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastActivity === today) {
            // Same day, no change
            return;
        } else if (lastActivity === yesterday) {
            // Consecutive day, increment streak
            this.userProgress.streak++;
        } else {
            // Streak broken
            this.userProgress.streak = 1;
        }

        if (this.userProgress.streak > 1) {
            this.analytics.trackEvent('streak_updated', {
                streak_days: this.userProgress.streak
            });
        }
    }

    private showNotification(message: string, type: 'success' | 'info' | 'warning' = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `gamification-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10B981' : '#3B82F6'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      animation: slideIn 0.3s ease-out;
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    private showAchievementNotification(achievement: Achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 1rem;">
        <div style="font-size: 2rem;">${achievement.icon}</div>
        <div>
          <div style="font-weight: bold; color: #D4AF37;">Achievement Unlocked!</div>
          <div style="font-size: 1.1rem; margin: 0.25rem 0;">${achievement.name}</div>
          <div style="font-size: 0.9rem; opacity: 0.8;">${achievement.description}</div>
          <div style="font-size: 0.8rem; color: #10B981; margin-top: 0.25rem;">
            +${achievement.xpReward} XP, +${achievement.tvltReward} TVLT
          </div>
        </div>
      </div>
    `;
        notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #001F3F 0%, #1a365d 100%);
      border: 2px solid #D4AF37;
      color: white;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
      z-index: 10000;
      min-width: 300px;
      animation: achievementSlideIn 0.5s ease-out;
    `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 8000);
    }

    // Referral system methods
    processReferral(referralCode: string, newUserId: string) {
        // Find the referrer
        const referrerData = localStorage.getItem('timeVault_userProgress');
        if (referrerData) {
            const referrer = JSON.parse(referrerData);
            if (referrer.referralCode === referralCode) {
                // Add referral to referrer's account
                referrer.referrals.push({
                    referredUserId: newUserId,
                    referredAt: new Date(),
                    status: 'pending',
                    rewardEarned: 0,
                    activity: []
                });

                // Award immediate referral bonus
                referrer.tvltBalance += 10;
                localStorage.setItem('timeVault_userProgress', JSON.stringify(referrer));

                this.analytics.trackEvent('referral_processed', {
                    referral_code: referralCode,
                    referred_user: newUserId,
                    immediate_reward: 10
                });

                return true;
            }
        }
        return false;
    }

    confirmReferral(referredUserId: string) {
        const referral = this.userProgress.referrals.find(r => r.referredUserId === referredUserId);
        if (referral && referral.status === 'pending') {
            referral.status = 'confirmed';
            referral.rewardEarned = 25;
            this.userProgress.tvltBalance += 25;

            this.analytics.trackEvent('referral_confirmed', {
                referred_user: referredUserId,
                reward_earned: 25
            });

            this.saveUserProgress();
            this.showNotification('🎉 Referral confirmed! +25 TVLT earned!', 'success');
        }
    }

    // Social sharing methods
    generateShareContent(calculationResult: any): SocialShare[] {
        const shares: SocialShare[] = [
            {
                platform: 'twitter',
                content: `I just calculated ${calculationResult.amount} ${calculationResult.asset} = $${calculationResult.usdValue.toLocaleString()} = ${calculationResult.metals.gold.amount.toFixed(4)} oz of gold! 💰`,
                url: `https://timevaultai.com?ref=${this.userProgress.referralCode}`,
                hashtags: ['crypto', 'gold', 'bitcoin', 'timevault', 'defi']
            },
            {
                platform: 'facebook',
                content: `Check out this cool crypto calculator! My ${calculationResult.asset} is worth ${calculationResult.metals.gold.amount.toFixed(4)} oz of gold!`,
                url: `https://timevaultai.com?ref=${this.userProgress.referralCode}`
            },
            {
                platform: 'linkedin',
                content: `Interesting perspective on crypto value: Converting digital assets to precious metals equivalents. My ${calculationResult.asset} calculation shows ${calculationResult.metals.gold.amount.toFixed(4)} oz gold value.`,
                url: `https://timevaultai.com?ref=${this.userProgress.referralCode}`
            },
            {
                platform: 'telegram',
                content: `💰 TimeVault Calculator Results:\n${calculationResult.amount} ${calculationResult.asset} = ${calculationResult.metals.gold.amount.toFixed(4)} oz Gold\nTry it yourself:`,
                url: `https://timevaultai.com?ref=${this.userProgress.referralCode}`
            }
        ];

        return shares;
    }

    shareToSocial(platform: string, content: SocialShare) {
        const urls = {
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(content.content)}&url=${encodeURIComponent(content.url)}&hashtags=${content.hashtags?.join(',')}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url)}&quote=${encodeURIComponent(content.content)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url)}&summary=${encodeURIComponent(content.content)}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(content.url)}&text=${encodeURIComponent(content.content)}`
        };

        const shareUrl = urls[platform as keyof typeof urls];
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');

            // Award XP for sharing
            this.awardXP(15, 'social_share', { platform });

            this.analytics.trackEvent('social_share', {
                platform,
                content_type: 'calculation_result'
            });
        }
    }

    // Getters
    getUserProgress(): UserProgress {
        return { ...this.userProgress };
    }

    getAchievements(): Achievement[] {
        return [...this.achievements];
    }

    getAvailableAchievements(): Achievement[] {
        return this.achievements.filter(a =>
            !this.userProgress.achievements.some(ua => ua.id === a.id)
        );
    }
}

// React Context for Gamification
const GamificationContext = createContext<GamificationService | null>(null);

// Gamification Provider Component
export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const analytics = useAnalytics();
    const [gamificationService] = useState(() => new GamificationService(analytics));

    return (
        <GamificationContext.Provider value= { gamificationService } >
        { children }
        </GamificationContext.Provider>
  );
};

// Custom Hook
export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error('useGamification must be used within GamificationProvider');
    }
    return context;
};

// Progress Bar Component
export const ProgressBar: React.FC<{ current: number; max: number; color?: string }> = ({
    current,
    max,
    color = '#D4AF37'
}) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className= "progress-bar-container" >
        <div 
        className="progress-bar-fill"
    style = {{
        width: `${percentage}%`,
            backgroundColor: color
    }
}
      />
    < span className = "progress-text" > { current } / { max } </span>

        < style jsx > {`
        .progress-bar-container {
          position: relative;
          width: 100%;
          height: 20px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .progress-bar-fill {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 10px;
          background: linear-gradient(90deg, ${color} 0%, ${color}CC 100%);
        }

        .progress-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 12px;
          font-weight: bold;
          color: #FFFFFF;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  );
};

// Achievement Badge Component
export const AchievementBadge: React.FC<{ achievement: Achievement; size?: 'small' | 'medium' | 'large' }> = ({
    achievement,
    size = 'medium'
}) => {
    const sizes = {
        small: { icon: '1.5rem', container: '60px' },
        medium: { icon: '2rem', container: '80px' },
        large: { icon: '3rem', container: '120px' }
    };

    const rarityColors = {
        common: '#10B981',
        rare: '#3B82F6',
        epic: '#8B5CF6',
        legendary: '#F59E0B'
    };

    return (
        <div 
      className= "achievement-badge"
    style = {{
        width: sizes[size].container,
            height: sizes[size].container,
                borderColor: rarityColors[achievement.rarity]
    }
}
    >
    <div 
        className="achievement-icon"
style = {{ fontSize: sizes[size].icon }}
      >
    { achievement.icon }
    </div>

    < style jsx > {`
        .achievement-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .achievement-badge:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .achievement-icon {
          filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
        }
      `}</style>
    </div>
  );
};

export default GamificationService;
