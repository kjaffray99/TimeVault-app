/**
 * Profile Component
 * User profile, achievements, and account management
 */

import { Award, Calendar, Settings, TrendingUp, User } from 'lucide-react';
import React from 'react';

const Profile: React.FC = () => {
    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar">
                    <User size={64} />
                </div>
                <div className="profile-info">
                    <h1>Your TimeVault Profile</h1>
                    <p>Track your progress and achievements</p>
                </div>
            </div>

            <div className="profile-content">
                <div className="profile-stats">
                    <div className="stat-card">
                        <TrendingUp className="stat-icon" />
                        <div className="stat-info">
                            <h3>Calculations</h3>
                            <p className="stat-value">0</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <Calendar className="stat-icon" />
                        <div className="stat-info">
                            <h3>Streak</h3>
                            <p className="stat-value">0 days</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <Award className="stat-icon" />
                        <div className="stat-info">
                            <h3>Achievements</h3>
                            <p className="stat-value">0 unlocked</p>
                        </div>
                    </div>
                </div>

                <div className="profile-sections">
                    <div className="profile-section">
                        <h2>
                            <Award className="section-icon" />
                            Achievements
                        </h2>
                        <div className="achievements-grid">
                            <div className="achievement-placeholder">
                                <p>Complete your first calculation to unlock achievements!</p>
                            </div>
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2>
                            <Settings className="section-icon" />
                            Account Settings
                        </h2>
                        <div className="settings-placeholder">
                            <p>Account management features coming soon...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
