import { Calendar, Flame, Star, Target, Trophy } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import './StreakTracker.css';

interface StreakData {
    currentStreak: number;
    longestStreak: number;
    lastVisit: string;
    totalVisits: number;
    weeklyGoal: number;
    weeklyProgress: number;
    badges: string[];
}

interface StreakTrackerProps {
    className?: string;
}

const StreakTracker: React.FC<StreakTrackerProps> = ({ className = '' }) => {
    const { track } = useAnalytics();
    const [streakData, setStreakData] = useState<StreakData>({
        currentStreak: 0,
        longestStreak: 0,
        lastVisit: '',
        totalVisits: 0,
        weeklyGoal: 5,
        weeklyProgress: 0,
        badges: []
    });

    useEffect(() => {
        loadStreakData();
        updateDailyVisit();
    }, []);

    const loadStreakData = () => {
        try {
            const saved = localStorage.getItem('timevault_streak_data');
            if (saved) {
                const data = JSON.parse(saved);
                setStreakData(data);
            }
        } catch (error) {
            console.error('Error loading streak data:', error);
        }
    };

    const saveStreakData = (data: StreakData) => {
        try {
            localStorage.setItem('timevault_streak_data', JSON.stringify(data));
            setStreakData(data);
        } catch (error) {
            console.error('Error saving streak data:', error);
        }
    };

    const updateDailyVisit = () => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        setStreakData(prev => {
            // If already visited today, no update needed
            if (prev.lastVisit === today) {
                return prev;
            }

            let newCurrentStreak = prev.currentStreak;
            let newWeeklyProgress = prev.weeklyProgress;
            const newTotalVisits = prev.totalVisits + 1;
            let newBadges = [...prev.badges];

            // Check if this continues the streak
            if (prev.lastVisit === yesterday) {
                newCurrentStreak += 1;
            } else if (prev.lastVisit !== today) {
                // Streak broken or first visit
                newCurrentStreak = 1;
            }

            // Weekly progress (reset on Sunday)
            const currentWeek = getWeekNumber(new Date());
            const lastVisitWeek = prev.lastVisit ? getWeekNumber(new Date(prev.lastVisit)) : 0;

            if (currentWeek !== lastVisitWeek) {
                newWeeklyProgress = 1; // New week
            } else {
                newWeeklyProgress = prev.weeklyProgress + 1;
            }

            // Award badges
            if (newCurrentStreak === 3 && !newBadges.includes('3-day-streak')) {
                newBadges.push('3-day-streak');
                track('badge_earned', { badge: '3-day-streak', streak: newCurrentStreak });
            }
            if (newCurrentStreak === 7 && !newBadges.includes('week-warrior')) {
                newBadges.push('week-warrior');
                track('badge_earned', { badge: 'week-warrior', streak: newCurrentStreak });
            }
            if (newCurrentStreak === 30 && !newBadges.includes('month-master')) {
                newBadges.push('month-master');
                track('badge_earned', { badge: 'month-master', streak: newCurrentStreak });
            }
            if (newTotalVisits === 50 && !newBadges.includes('loyal-user')) {
                newBadges.push('loyal-user');
                track('badge_earned', { badge: 'loyal-user', totalVisits: newTotalVisits });
            }

            const newData = {
                currentStreak: newCurrentStreak,
                longestStreak: Math.max(prev.longestStreak, newCurrentStreak),
                lastVisit: today,
                totalVisits: newTotalVisits,
                weeklyGoal: prev.weeklyGoal,
                weeklyProgress: Math.min(newWeeklyProgress, prev.weeklyGoal),
                badges: newBadges
            };

            saveStreakData(newData);

            // Track streak milestone
            if (newCurrentStreak > prev.currentStreak) {
                track('streak_updated', {
                    currentStreak: newCurrentStreak,
                    longestStreak: newData.longestStreak,
                    totalVisits: newTotalVisits
                });
            }

            return newData;
        });
    };

    const getWeekNumber = (date: Date): number => {
        const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    };

    const getStreakMessage = () => {
        if (streakData.currentStreak === 0) return "Start your TimeVault journey today!";
        if (streakData.currentStreak === 1) return "Great start! Come back tomorrow to continue.";
        if (streakData.currentStreak < 7) return `${streakData.currentStreak} days strong! Keep it up!`;
        if (streakData.currentStreak < 30) return `Amazing ${streakData.currentStreak}-day streak! You're on fire! 🔥`;
        return `Incredible ${streakData.currentStreak}-day streak! You're a TimeVault legend! 🏆`;
    };

    const getBadgeIcon = (badge: string) => {
        switch (badge) {
            case '3-day-streak': return '🔥';
            case 'week-warrior': return '⚡';
            case 'month-master': return '👑';
            case 'loyal-user': return '💎';
            default: return '🏅';
        }
    };

    const getBadgeName = (badge: string) => {
        switch (badge) {
            case '3-day-streak': return '3-Day Streak';
            case 'week-warrior': return 'Week Warrior';
            case 'month-master': return 'Month Master';
            case 'loyal-user': return 'Loyal User';
            default: return 'Achievement';
        }
    };

    const weeklyProgressPercentage = (streakData.weeklyProgress / streakData.weeklyGoal) * 100;

    return (
        <div className={`streak-tracker ${className}`}>
            <div className="streak-header">
                <div className="flex items-center gap-3">
                    <div className="streak-icon">
                        <Flame className={`w-6 h-6 ${streakData.currentStreak > 0 ? 'text-orange-500' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">TVLT Streak</h3>
                        <p className="text-sm text-gray-600">{getStreakMessage()}</p>
                    </div>
                </div>
                <div className="streak-number">
                    <span className="text-3xl font-bold text-orange-500">{streakData.currentStreak}</span>
                    <span className="text-sm text-gray-500 block">days</span>
                </div>
            </div>

            <div className="streak-stats grid grid-cols-2 gap-4 my-4">
                <div className="stat-card">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium text-gray-700">Best Streak</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{streakData.longestStreak}</p>
                </div>
                <div className="stat-card">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Total Visits</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900">{streakData.totalVisits}</p>
                </div>
            </div>

            {/* Weekly Goal Progress */}
            <div className="weekly-progress mb-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-gray-700">Weekly Goal</span>
                    </div>
                    <span className="text-sm text-gray-600">
                        {streakData.weeklyProgress}/{streakData.weeklyGoal}
                    </span>
                </div>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${Math.min(weeklyProgressPercentage, 100)}%` }}
                    />
                </div>
                {streakData.weeklyProgress >= streakData.weeklyGoal && (
                    <p className="text-xs text-green-600 mt-1 font-medium">🎉 Weekly goal achieved!</p>
                )}
            </div>

            {/* Badges */}
            {streakData.badges.length > 0 && (
                <div className="badges-section">
                    <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">Achievements</span>
                    </div>
                    <div className="badges-grid">
                        {streakData.badges.map((badge, index) => (
                            <div key={index} className="badge-item">
                                <span className="badge-icon">{getBadgeIcon(badge)}</span>
                                <span className="badge-name">{getBadgeName(badge)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Motivation Section */}
            <div className="motivation-section">
                <div className="motivation-card">
                    <p className="text-xs text-gray-600 mb-2">
                        💡 <strong>Tip:</strong> {
                            streakData.currentStreak < 3 ?
                                "Visit daily to build your streak and unlock premium insights!" :
                                streakData.currentStreak < 7 ?
                                    "You're doing great! Consistent users see 30% better investment outcomes." :
                                    "Your dedication is paying off! Premium features unlock at longer streaks."
                        }
                    </p>
                    {streakData.currentStreak >= 7 && (
                        <div className="premium-hint">
                            <p className="text-xs text-orange-600 font-medium">
                                🎁 7+ day streak bonus: Unlock advanced analytics in Premium!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StreakTracker;
