/**
 * Gamification Engine - Revenue Driving Engagement
 * Maximizes user retention through rewards and incentives
 */

import { Crown, Gift, Star, Target, Trophy, Zap } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

interface UserAchievement {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
    progress: number;
    maxProgress: number;
    reward: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface GamificationState {
    level: number;
    xp: number;
    streak: number;
    totalCalculations: number;
    achievements: UserAchievement[];
    tvltTokens: number;
    premiumAccess: boolean;
}

export const GamificationEngine: React.FC = () => {
    const [state, setState] = useState<GamificationState>({
        level: 1,
        xp: 0,
        streak: 0,
        totalCalculations: 0,
        achievements: [
            {
                id: 'first_calculation',
                title: 'First Conversion',
                description: 'Complete your first crypto-to-metals calculation',
                icon: <Zap className="achievement-icon" />,
                unlocked: false,
                progress: 0,
                maxProgress: 1,
                reward: '10 TVLT Tokens',
                rarity: 'common'
            },
            {
                id: 'streak_master',
                title: 'Streak Master',
                description: 'Maintain a 7-day calculation streak',
                icon: <Target className="achievement-icon" />,
                unlocked: false,
                progress: 0,
                maxProgress: 7,
                reward: 'Premium Badge NFT',
                rarity: 'epic'
            },
            {
                id: 'high_roller',
                title: 'High Roller',
                description: 'Calculate conversions worth over $100K',
                icon: <Crown className="achievement-icon" />,
                unlocked: false,
                progress: 0,
                maxProgress: 100000,
                reward: 'Exclusive AI Insights',
                rarity: 'legendary'
            }
        ],
        tvltTokens: 0,
        premiumAccess: false
    });

    const [showAchievement, setShowAchievement] = useState<UserAchievement | null>(null);
    const [showRewardModal, setShowRewardModal] = useState(false);

    // Track calculation for gamification
    const trackCalculation = useCallback((value: number) => {
        setState(prev => {
            const newState = { ...prev };
            newState.totalCalculations += 1;
            newState.xp += 10;
            newState.tvltTokens += 5;

            // Check for level up
            const newLevel = Math.floor(newState.xp / 100) + 1;
            if (newLevel > newState.level) {
                newState.level = newLevel;
                newState.tvltTokens += 50; // Level up bonus
            }

            // Update achievements
            newState.achievements = newState.achievements.map(achievement => {
                switch (achievement.id) {
                    case 'first_calculation':
                        if (!achievement.unlocked && newState.totalCalculations >= 1) {
                            achievement.unlocked = true;
                            achievement.progress = 1;
                            setShowAchievement(achievement);
                        }
                        break;
                    case 'high_roller':
                        if (value >= 100000 && !achievement.unlocked) {
                            achievement.unlocked = true;
                            achievement.progress = value;
                            setShowAchievement(achievement);
                        }
                        break;
                }
                return achievement;
            });

            return newState;
        });
    }, []);

    // Daily streak logic
    useEffect(() => {
        const lastCalculation = localStorage.getItem('last_calculation_date');
        const today = new Date().toDateString();

        if (lastCalculation === today) {
            // Already calculated today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastCalculation === yesterday.toDateString()) {
            // Continue streak
            setState(prev => ({ ...prev, streak: prev.streak + 1 }));
        } else if (lastCalculation !== null) {
            // Reset streak
            setState(prev => ({ ...prev, streak: 1 }));
        }

        localStorage.setItem('last_calculation_date', today);
    }, []);

    const getRarityColor = (rarity: string) => {
        switch (rarity) {
            case 'common': return '#10B981';
            case 'rare': return '#3B82F6';
            case 'epic': return '#8B5CF6';
            case 'legendary': return '#F59E0B';
            default: return '#6B7280';
        }
    };

    return (
        <div className="gamification-container">
            {/* User Progress Header */}
            <div className="progress-header">
                <div className="user-stats">
                    <div className="stat-item">
                        <span className="stat-label">Level</span>
                        <span className="stat-value">{state.level}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">XP</span>
                        <span className="stat-value">{state.xp}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">Streak</span>
                        <span className="stat-value">{state.streak} days</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-label">TVLT Tokens</span>
                        <span className="stat-value gold">{state.tvltTokens}</span>
                    </div>
                </div>

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${(state.xp % 100)}%` }}
                    />
                </div>
            </div>

            {/* Achievements Grid */}
            <div className="achievements-section">
                <h3>🏆 Achievements</h3>
                <div className="achievements-grid">
                    {state.achievements.map(achievement => (
                        <div
                            key={achievement.id}
                            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                            style={{ borderColor: getRarityColor(achievement.rarity) }}
                        >
                            <div className="achievement-icon-container">
                                {achievement.icon}
                            </div>
                            <h4>{achievement.title}</h4>
                            <p>{achievement.description}</p>
                            <div className="achievement-progress">
                                <div className="progress-bar small">
                                    <div
                                        className="progress-fill"
                                        style={{
                                            width: `${(achievement.progress / achievement.maxProgress) * 100}%`,
                                            backgroundColor: getRarityColor(achievement.rarity)
                                        }}
                                    />
                                </div>
                                <span className="progress-text">
                                    {achievement.progress}/{achievement.maxProgress}
                                </span>
                            </div>
                            <div className="achievement-reward">
                                <Gift className="reward-icon" />
                                {achievement.reward}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Achievement Unlock Modal */}
            {showAchievement && (
                <div className="achievement-modal-overlay">
                    <div className="achievement-modal">
                        <div className="modal-header">
                            <Trophy className="trophy-icon" />
                            <h2>Achievement Unlocked!</h2>
                        </div>
                        <div className="modal-content">
                            <div className="achievement-showcase">
                                {showAchievement.icon}
                                <h3>{showAchievement.title}</h3>
                                <p>{showAchievement.description}</p>
                                <div className="reward-display">
                                    <Gift className="reward-icon" />
                                    <span>Reward: {showAchievement.reward}</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="claim-button"
                            onClick={() => {
                                setShowAchievement(null);
                                setShowRewardModal(true);
                            }}
                        >
                            Claim Reward
                        </button>
                    </div>
                </div>
            )}

            {/* Daily Rewards Section */}
            <div className="daily-rewards">
                <h3>🎁 Daily Rewards</h3>
                <div className="reward-calendar">
                    {[1, 2, 3, 4, 5, 6, 7].map(day => (
                        <div
                            key={day}
                            className={`reward-day ${day <= state.streak ? 'claimed' : 'unclaimed'}`}
                        >
                            <span className="day-number">Day {day}</span>
                            <div className="reward-preview">
                                {day === 7 ? <Crown /> : <Star />}
                                <span>{day === 7 ? 'Premium NFT' : `${day * 10} TVLT`}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .gamification-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin: 1rem;
        }

        .progress-header {
          margin-bottom: 2rem;
        }

        .user-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .stat-label {
          display: block;
          font-size: 0.875rem;
          color: #C0C0C0;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FFFFFF;
        }

        .stat-value.gold {
          color: #D4AF37;
        }

        .progress-bar {
          height: 12px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%);
          transition: width 0.5s ease;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1rem;
        }

        .achievement-card {
          background: rgba(255, 255, 255, 0.08);
          border: 2px solid;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .achievement-card.unlocked {
          border-color: #10B981;
          box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
        }

        .achievement-card.locked {
          border-color: #6B7280;
          opacity: 0.6;
        }

        .achievement-icon-container {
          width: 60px;
          height: 60px;
          margin: 0 auto 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.2);
          border-radius: 50%;
        }

        .achievement-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .achievement-modal {
          background: linear-gradient(135deg, #001F3F 0%, #003366 100%);
          border: 2px solid #D4AF37;
          border-radius: 20px;
          padding: 2rem;
          max-width: 400px;
          text-align: center;
          animation: modalSlideIn 0.5s ease;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(-50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .claim-button {
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          color: #001F3F;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .claim-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }

        .daily-rewards {
          margin-top: 2rem;
        }

        .reward-calendar {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 0.5rem;
        }

        .reward-day {
          padding: 1rem 0.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          text-align: center;
          border: 2px solid transparent;
        }

        .reward-day.claimed {
          border-color: #10B981;
          background: rgba(16, 185, 129, 0.2);
        }

        @media (max-width: 768px) {
          .gamification-container {
            margin: 0.5rem;
            padding: 1rem;
          }

          .user-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .achievements-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
};

export default GamificationEngine;
