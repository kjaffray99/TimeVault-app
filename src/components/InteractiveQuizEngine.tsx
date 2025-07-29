/**
 * Interactive Quiz Engine - 30-40% Retention Driver
 * Gamified education with TVLT rewards and premium upsells
 */

import { Brain, CheckCircle, Clock, Star, Target, Trophy, XCircle, Zap } from 'lucide-react';
import React, { useCallback, useState } from 'react';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    category: 'crypto' | 'metals' | 'investing' | 'economics';
    reward: number; // TVLT tokens
    premiumHint?: string;
}

interface QuizState {
    currentQuestion: number;
    score: number;
    streak: number;
    answeredQuestions: Set<string>;
    totalRewards: number;
    timeStarted: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 'crypto_basics_1',
        question: 'What gives Bitcoin its value compared to traditional currency?',
        options: [
            'Government backing',
            'Scarcity and decentralization',
            'Physical gold reserves',
            'Bank guarantees'
        ],
        correctAnswer: 1,
        explanation: 'Bitcoin\'s value comes from its limited supply (21 million max) and decentralized network that operates without central authority.',
        difficulty: 'beginner',
        category: 'crypto',
        reward: 10,
        premiumHint: 'Think about what makes digital assets different from fiat money...'
    },
    {
        id: 'metals_value_1',
        question: 'Which precious metal is primarily used in industrial applications?',
        options: [
            'Gold',
            'Silver',
            'Platinum',
            'All of the above'
        ],
        correctAnswer: 3,
        explanation: 'All precious metals have industrial uses: Gold in electronics, Silver in solar panels and medical devices, Platinum in catalytic converters.',
        difficulty: 'intermediate',
        category: 'metals',
        reward: 15,
        premiumHint: 'Consider the dual nature of precious metals as both stores of value and industrial commodities...'
    },
    {
        id: 'portfolio_strategy_1',
        question: 'What percentage of a portfolio should typically be allocated to alternative assets like crypto and precious metals?',
        options: [
            '1-5%',
            '5-15%',
            '25-50%',
            '75-100%'
        ],
        correctAnswer: 1,
        explanation: 'Most financial advisors recommend 5-15% allocation to alternative assets for diversification while maintaining portfolio stability.',
        difficulty: 'advanced',
        category: 'investing',
        reward: 25,
        premiumHint: 'Remember the importance of diversification and risk management in modern portfolio theory...'
    }
];

export const InteractiveQuizEngine: React.FC<{
    onRewardEarned: (amount: number) => void;
    onPremiumInterest: () => void;
}> = ({ onRewardEarned, onPremiumInterest }) => {
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestion: 0,
        score: 0,
        streak: 0,
        answeredQuestions: new Set(),
        totalRewards: 0,
        timeStarted: Date.now(),
        difficulty: 'beginner'
    });

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [showReward, setShowReward] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const currentQuestion = QUIZ_QUESTIONS[quizState.currentQuestion];

    const handleAnswerSelect = (answerIndex: number) => {
        if (showExplanation) return;
        setSelectedAnswer(answerIndex);
    };

    const submitAnswer = useCallback(() => {
        if (selectedAnswer === null) return;

        const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

        setQuizState(prev => {
            const newState = { ...prev };

            if (isCorrect) {
                newState.score += 1;
                newState.streak += 1;
                newState.totalRewards += currentQuestion.reward;

                // Bonus for streaks
                if (newState.streak >= 3) {
                    newState.totalRewards += 5; // Bonus TVLT
                }

                onRewardEarned(currentQuestion.reward + (newState.streak >= 3 ? 5 : 0));
            } else {
                newState.streak = 0;
            }

            newState.answeredQuestions.add(currentQuestion.id);
            return newState;
        });

        setShowExplanation(true);
        setShowReward(isCorrect);

        // Track engagement
        const timeSpent = Date.now() - quizState.timeStarted;
        if (timeSpent < 30000) { // Less than 30 seconds - might need premium hints
            setTimeout(() => {
                onPremiumInterest();
            }, 2000);
        }
    }, [selectedAnswer, currentQuestion, quizState.timeStarted, onRewardEarned, onPremiumInterest]);

    const nextQuestion = () => {
        if (quizState.currentQuestion + 1 >= QUIZ_QUESTIONS.length) {
            setQuizCompleted(true);
            return;
        }

        setQuizState(prev => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
            timeStarted: Date.now()
        }));

        setSelectedAnswer(null);
        setShowExplanation(false);
        setShowReward(false);
    };

    const resetQuiz = () => {
        setQuizState({
            currentQuestion: 0,
            score: 0,
            streak: 0,
            answeredQuestions: new Set(),
            totalRewards: 0,
            timeStarted: Date.now(),
            difficulty: 'beginner'
        });
        setSelectedAnswer(null);
        setShowExplanation(false);
        setShowReward(false);
        setQuizCompleted(false);
    };

    const getScoreRating = () => {
        const percentage = (quizState.score / QUIZ_QUESTIONS.length) * 100;
        if (percentage >= 90) return { rating: 'Expert', emoji: '🎓', color: '#FFD700' };
        if (percentage >= 70) return { rating: 'Advanced', emoji: '🌟', color: '#D4AF37' };
        if (percentage >= 50) return { rating: 'Intermediate', emoji: '📈', color: '#10B981' };
        return { rating: 'Beginner', emoji: '🌱', color: '#3B82F6' };
    };

    if (quizCompleted) {
        const scoreData = getScoreRating();

        return (
            <div className="quiz-completed">
                <div className="completion-header">
                    <Trophy className="completion-trophy" />
                    <h2>Quiz Completed!</h2>
                </div>

                <div className="score-summary">
                    <div className="score-badge" style={{ borderColor: scoreData.color }}>
                        <span className="score-emoji">{scoreData.emoji}</span>
                        <span className="score-text">{scoreData.rating}</span>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-item">
                            <span className="stat-value">{quizState.score}/{QUIZ_QUESTIONS.length}</span>
                            <span className="stat-label">Correct Answers</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{quizState.totalRewards}</span>
                            <span className="stat-label">TVLT Earned</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-value">{Math.max(...Array.from(quizState.answeredQuestions, () => quizState.streak))}</span>
                            <span className="stat-label">Best Streak</span>
                        </div>
                    </div>
                </div>

                <div className="completion-actions">
                    <button className="retake-button" onClick={resetQuiz}>
                        <Target className="button-icon" />
                        Take Quiz Again
                    </button>
                    <button className="premium-button" onClick={onPremiumInterest}>
                        <Star className="button-icon" />
                        Unlock Advanced Quizzes
                    </button>
                </div>

                <style jsx>{`
          .quiz-completed {
            background: rgba(255, 255, 255, 0.05);
            border: 2px solid #D4AF37;
            border-radius: 20px;
            padding: 2rem;
            text-align: center;
            margin: 1rem;
          }

          .completion-header {
            margin-bottom: 2rem;
          }

          .completion-trophy {
            width: 4rem;
            height: 4rem;
            color: #FFD700;
            margin-bottom: 1rem;
          }

          .score-badge {
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 2rem;
            border: 3px solid;
            border-radius: 16px;
            margin-bottom: 2rem;
            background: rgba(255, 255, 255, 0.1);
          }

          .score-emoji {
            font-size: 2rem;
          }

          .score-text {
            font-size: 1.5rem;
            font-weight: 700;
            color: #FFFFFF;
          }

          .stats-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
            margin-bottom: 2rem;
          }

          .stat-item {
            background: rgba(255, 255, 255, 0.1);
            padding: 1rem;
            border-radius: 12px;
          }

          .stat-value {
            display: block;
            font-size: 1.5rem;
            font-weight: 700;
            color: #D4AF37;
          }

          .stat-label {
            font-size: 0.875rem;
            color: #C0C0C0;
          }

          .completion-actions {
            display: flex;
            gap: 1rem;
            justify-content: center;
          }

          .retake-button,
          .premium-button {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 1rem 1.5rem;
            border: none;
            border-radius: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .retake-button {
            background: rgba(255, 255, 255, 0.2);
            color: #FFFFFF;
          }

          .premium-button {
            background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
            color: #001F3F;
          }

          .retake-button:hover,
          .premium-button:hover {
            transform: translateY(-2px);
          }
        `}</style>
            </div>
        );
    }

    return (
        <div className="quiz-container">
            {/* Quiz Header */}
            <div className="quiz-header">
                <div className="quiz-progress">
                    <div className="progress-info">
                        <span className="question-counter">
                            Question {quizState.currentQuestion + 1} of {QUIZ_QUESTIONS.length}
                        </span>
                        <div className="streak-display">
                            <Zap className="streak-icon" />
                            <span>Streak: {quizState.streak}</span>
                        </div>
                    </div>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${((quizState.currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                        />
                    </div>
                </div>

                <div className="rewards-display">
                    <Star className="reward-icon" />
                    <span>{quizState.totalRewards} TVLT Earned</span>
                </div>
            </div>

            {/* Question */}
            <div className="question-section">
                <div className="question-header">
                    <Brain className="question-icon" />
                    <div className="question-meta">
                        <span className="difficulty-badge">{currentQuestion.difficulty}</span>
                        <span className="category-badge">{currentQuestion.category}</span>
                    </div>
                </div>

                <h3 className="question-text">{currentQuestion.question}</h3>

                <div className="answer-options">
                    {currentQuestion.options.map((option, index) => (
                        <button
                            key={index}
                            className={`answer-option ${selectedAnswer === index ? 'selected' : ''} ${showExplanation ?
                                    (index === currentQuestion.correctAnswer ? 'correct' :
                                        selectedAnswer === index ? 'incorrect' : '') : ''
                                }`}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={showExplanation}
                        >
                            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                            <span className="option-text">{option}</span>
                            {showExplanation && index === currentQuestion.correctAnswer && (
                                <CheckCircle className="check-icon" />
                            )}
                            {showExplanation && selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                                <XCircle className="x-icon" />
                            )}
                        </button>
                    ))}
                </div>

                {!showExplanation && selectedAnswer !== null && (
                    <button className="submit-button" onClick={submitAnswer}>
                        Submit Answer
                    </button>
                )}

                {showExplanation && (
                    <div className="explanation-section">
                        <h4>Explanation:</h4>
                        <p>{currentQuestion.explanation}</p>

                        {showReward && (
                            <div className="reward-notification">
                                <Star className="reward-star" />
                                <span>+{currentQuestion.reward} TVLT!</span>
                                {quizState.streak >= 3 && <span className="bonus">+5 Streak Bonus!</span>}
                            </div>
                        )}

                        <button className="next-button" onClick={nextQuestion}>
                            {quizState.currentQuestion + 1 >= QUIZ_QUESTIONS.length ? 'Finish Quiz' : 'Next Question'}
                        </button>
                    </div>
                )}

                {currentQuestion.premiumHint && !showExplanation && (
                    <div className="premium-hint">
                        <Clock className="hint-icon" />
                        <span>Need a hint? </span>
                        <button className="hint-button" onClick={onPremiumInterest}>
                            Unlock Premium Hints
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .quiz-container {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin: 1rem;
          max-width: 800px;
        }

        .quiz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .question-counter {
          font-weight: 600;
          color: #D4AF37;
        }

        .streak-display {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #10B981;
          font-weight: 600;
        }

        .streak-icon {
          width: 1rem;
          height: 1rem;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
          overflow: hidden;
          width: 200px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #D4AF37 0%, #FFD700 100%);
          transition: width 0.5s ease;
        }

        .rewards-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          color: #D4AF37;
          font-weight: 600;
        }

        .question-section {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
        }

        .question-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .question-icon {
          width: 2rem;
          height: 2rem;
          color: #D4AF37;
        }

        .question-meta {
          display: flex;
          gap: 0.5rem;
        }

        .difficulty-badge,
        .category-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .difficulty-badge {
          background: rgba(212, 175, 55, 0.2);
          color: #D4AF37;
        }

        .category-badge {
          background: rgba(16, 185, 129, 0.2);
          color: #10B981;
        }

        .question-text {
          font-size: 1.25rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .answer-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .answer-option {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid transparent;
          border-radius: 12px;
          color: #FFFFFF;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .answer-option:hover {
          border-color: rgba(212, 175, 55, 0.5);
          transform: translateX(4px);
        }

        .answer-option.selected {
          border-color: #D4AF37;
          background: rgba(212, 175, 55, 0.1);
        }

        .answer-option.correct {
          border-color: #10B981;
          background: rgba(16, 185, 129, 0.2);
        }

        .answer-option.incorrect {
          border-color: #EF4444;
          background: rgba(239, 68, 68, 0.2);
        }

        .option-letter {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          font-weight: 700;
          flex-shrink: 0;
        }

        .option-text {
          flex: 1;
        }

        .check-icon,
        .x-icon {
          width: 1.5rem;
          height: 1.5rem;
          flex-shrink: 0;
        }

        .check-icon {
          color: #10B981;
        }

        .x-icon {
          color: #EF4444;
        }

        .submit-button,
        .next-button {
          background: linear-gradient(135deg, #D4AF37 0%, #FFD700 100%);
          color: #001F3F;
          border: none;
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
        }

        .submit-button:hover,
        .next-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4);
        }

        .explanation-section {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-top: 1rem;
        }

        .explanation-section h4 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .explanation-section p {
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .reward-notification {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(16, 185, 129, 0.2);
          border: 1px solid #10B981;
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          color: #10B981;
          font-weight: 600;
        }

        .reward-star {
          width: 1.5rem;
          height: 1.5rem;
        }

        .bonus {
          color: #FFD700;
        }

        .premium-hint {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(212, 175, 55, 0.1);
          border: 2px dashed #D4AF37;
          border-radius: 12px;
          padding: 1rem;
          margin-top: 1rem;
          font-size: 0.875rem;
        }

        .hint-icon {
          width: 1rem;
          height: 1rem;
          color: #D4AF37;
        }

        .hint-button {
          background: none;
          border: none;
          color: #D4AF37;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .quiz-container {
            margin: 0.5rem;
            padding: 1rem;
          }

          .quiz-header {
            flex-direction: column;
            align-items: stretch;
          }

          .progress-bar {
            width: 100%;
          }

          .question-header {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
        </div>
    );
};

export default InteractiveQuizEngine;
