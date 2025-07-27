/**
 * Quiz Component
 * Educational quizzes with TVLT token rewards
 */

import { ArrowRight, Brain, Star, Trophy } from 'lucide-react';
import React, { useState } from 'react';

interface Quiz {
    id: string;
    title: string;
    description: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    reward: number;
    questions: number;
    timeLimit: number;
}

const Quizzes: React.FC = () => {
    const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

    const availableQuizzes: Quiz[] = [
        {
            id: 'crypto-basics',
            title: 'Cryptocurrency Basics',
            description: 'Learn the fundamentals of digital assets',
            difficulty: 'beginner',
            reward: 10,
            questions: 10,
            timeLimit: 10,
        },
        {
            id: 'precious-metals',
            title: 'Precious Metals Investment',
            description: 'Understanding gold, silver, and metals market',
            difficulty: 'intermediate',
            reward: 25,
            questions: 15,
            timeLimit: 15,
        },
        {
            id: 'advanced-trading',
            title: 'Advanced Trading Strategies',
            description: 'Complex investment strategies and analysis',
            difficulty: 'advanced',
            reward: 50,
            questions: 20,
            timeLimit: 20,
        },
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '#28A745';
            case 'intermediate': return '#FFC107';
            case 'advanced': return '#DC3545';
            default: return '#6C757D';
        }
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '🌱';
            case 'intermediate': return '⚡';
            case 'advanced': return '🔥';
            default: return '📚';
        }
    };

    return (
        <div className="quizzes-page">
            <div className="quizzes-header">
                <Brain size={48} className="header-icon" />
                <div className="header-content">
                    <h1>Educational Quizzes</h1>
                    <p>Test your knowledge and earn TVLT tokens</p>
                </div>
            </div>

            <div className="quiz-stats">
                <div className="stat-card">
                    <Trophy className="stat-icon" />
                    <div className="stat-info">
                        <h3>Total Rewards Earned</h3>
                        <p className="stat-value">0 TVLT</p>
                    </div>
                </div>

                <div className="stat-card">
                    <Star className="stat-icon" />
                    <div className="stat-info">
                        <h3>Quizzes Completed</h3>
                        <p className="stat-value">0 / {availableQuizzes.length}</p>
                    </div>
                </div>
            </div>

            <div className="quiz-grid">
                {availableQuizzes.map((quiz) => (
                    <div key={quiz.id} className="quiz-card">
                        <div className="quiz-header">
                            <div className="quiz-difficulty">
                                <span
                                    className="difficulty-badge"
                                    style={{ backgroundColor: getDifficultyColor(quiz.difficulty) }}
                                >
                                    {getDifficultyIcon(quiz.difficulty)} {quiz.difficulty}
                                </span>
                            </div>
                            <div className="quiz-reward">
                                <Trophy size={16} />
                                <span>{quiz.reward} TVLT</span>
                            </div>
                        </div>

                        <div className="quiz-content">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>

                            <div className="quiz-details">
                                <div className="detail-item">
                                    <span className="detail-label">Questions:</span>
                                    <span className="detail-value">{quiz.questions}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Time Limit:</span>
                                    <span className="detail-value">{quiz.timeLimit} min</span>
                                </div>
                            </div>
                        </div>

                        <div className="quiz-actions">
                            <button
                                className="start-quiz-btn"
                                onClick={() => setSelectedQuiz(quiz)}
                            >
                                Start Quiz
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedQuiz && (
                <div className="quiz-modal-overlay" onClick={() => setSelectedQuiz(null)}>
                    <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="quiz-modal-content">
                            <h3>🚀 Ready to Start?</h3>
                            <h4>{selectedQuiz.title}</h4>
                            <p>{selectedQuiz.description}</p>

                            <div className="quiz-preview">
                                <div className="preview-item">
                                    <strong>Questions:</strong> {selectedQuiz.questions}
                                </div>
                                <div className="preview-item">
                                    <strong>Time Limit:</strong> {selectedQuiz.timeLimit} minutes
                                </div>
                                <div className="preview-item">
                                    <strong>Reward:</strong> {selectedQuiz.reward} TVLT tokens
                                </div>
                            </div>

                            <div className="quiz-modal-actions">
                                <button className="start-quiz-confirm-btn">
                                    Start Quiz Now
                                </button>
                                <button
                                    className="cancel-quiz-btn"
                                    onClick={() => setSelectedQuiz(null)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quizzes;
