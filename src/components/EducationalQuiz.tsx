import React, { useCallback, useEffect, useState } from 'react';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    reward: number;
    category: 'crypto' | 'time' | 'investing' | 'blockchain';
}

interface EducationalQuizProps {
    onTVLTEarned?: (amount: number, type: string) => void;
    onPremiumTrigger?: (trigger: string) => void;
}

export const EducationalQuiz: React.FC<EducationalQuizProps> = ({
    onTVLTEarned,
    onPremiumTrigger
}) => {
    const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [streak, setStreak] = useState(0);
    const [dailyQuizzes, setDailyQuizzes] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    const [tvltBalance, setTvltBalance] = useState(0);

    const quizDatabase: QuizQuestion[] = [
        {
            id: 'time-value-1',
            question: "If your hourly wage is $25 and Bitcoin is $97,500, how many work hours does 1 BTC represent?",
            options: ["3,500 hours", "3,900 hours", "4,200 hours", "3,750 hours"],
            correct: 1,
            explanation: "$97,500 ÷ $25 = 3,900 hours of work. That's nearly 2 full years of 40-hour work weeks!",
            difficulty: 'beginner',
            reward: 25,
            category: 'time'
        },
        {
            id: 'crypto-basics-1',
            question: "What makes Bitcoin different from traditional currency?",
            options: ["It's digital", "It's decentralized", "It's faster", "It's cheaper"],
            correct: 1,
            explanation: "Bitcoin's key innovation is decentralization - no central authority controls it, unlike traditional currencies controlled by governments.",
            difficulty: 'beginner',
            reward: 30,
            category: 'crypto'
        },
        {
            id: 'time-investment-1',
            question: "Which represents better time value: Working 40 hours for $1,000 or buying $1,000 of crypto that grows 20%?",
            options: ["Working 40 hours", "Buying crypto", "They're equal", "Depends on risk tolerance"],
            correct: 3,
            explanation: "While crypto might give higher returns, it also carries higher risk. The 'time value' depends on your risk tolerance and financial situation.",
            difficulty: 'intermediate',
            reward: 40,
            category: 'investing'
        },
        {
            id: 'blockchain-advanced-1',
            question: "What consensus mechanism does XRPL (XRP Ledger) use?",
            options: ["Proof of Work", "Proof of Stake", "Federated Consensus", "Delegated Proof of Stake"],
            correct: 2,
            explanation: "XRPL uses the XRP Ledger Consensus Protocol, a form of federated consensus that's faster and more energy-efficient than Proof of Work.",
            difficulty: 'advanced',
            reward: 60,
            category: 'blockchain'
        },
        {
            id: 'time-precious-metals-1',
            question: "If gold is $2,000/oz and your hourly wage is $30, how many hours of work equals 1 oz of gold?",
            options: ["60 hours", "66.7 hours", "70 hours", "75 hours"],
            correct: 1,
            explanation: "$2,000 ÷ $30 = 66.7 hours. This is why gold has been called 'stored time' - it represents hours of human labor.",
            difficulty: 'beginner',
            reward: 35,
            category: 'time'
        },
        {
            id: 'crypto-market-1',
            question: "What's the primary advantage of dollar-cost averaging into crypto?",
            options: ["Guaranteed profits", "Reduces volatility impact", "Eliminates risk", "Maximizes gains"],
            correct: 1,
            explanation: "Dollar-cost averaging reduces the impact of volatility by spreading purchases over time, leading to a more stable average price.",
            difficulty: 'intermediate',
            reward: 45,
            category: 'investing'
        },
        {
            id: 'xrpl-utility-1',
            question: "What is the primary utility of XRP on the XRP Ledger?",
            options: ["Smart contracts", "Transaction fees and liquidity", "Proof of Work mining", "NFT creation"],
            correct: 1,
            explanation: "XRP serves as the native currency for transaction fees and provides liquidity for cross-currency payments on the XRPL.",
            difficulty: 'advanced',
            reward: 55,
            category: 'blockchain'
        },
        {
            id: 'time-compound-1',
            question: "If you save 1 hour of wages ($25) daily in crypto that grows 10% annually, what's the value after 5 years?",
            options: ["$35,000", "$45,625", "$52,000", "$47,300"],
            correct: 3,
            explanation: "$25 × 365 days × 5 years = $45,625 saved. With 10% compound growth: approximately $47,300. Time and consistency compound!",
            difficulty: 'intermediate',
            reward: 50,
            category: 'time'
        }
    ];

    const getRandomQuiz = useCallback(() => {
        const availableQuizzes = quizDatabase.filter(q => {
            if (dailyQuizzes >= 5) {
                // After 5 quizzes, only show beginner unless premium
                return q.difficulty === 'beginner';
            }
            return true;
        });
        return availableQuizzes[Math.floor(Math.random() * availableQuizzes.length)];
    }, [dailyQuizzes]);

    const startQuiz = useCallback(() => {
        const quiz = getRandomQuiz();
        setCurrentQuiz(quiz);
        setSelectedAnswer(null);
        setShowResult(false);
    }, [getRandomQuiz]);

    const submitAnswer = () => {
        if (selectedAnswer === null || !currentQuiz) return;

        const isCorrect = selectedAnswer === currentQuiz.correct;
        setShowResult(true);

        if (isCorrect) {
            const earnedTVLT = currentQuiz.reward;
            setTvltBalance((prev: number) => prev + earnedTVLT);
            setStreak(prev => prev + 1);
            setTotalCorrect(prev => prev + 1);
            setDailyQuizzes(prev => prev + 1);

            // Call parent callback
            if (onTVLTEarned) {
                onTVLTEarned(earnedTVLT, 'quiz_correct');
            }

            // Track analytics
            if (typeof window !== 'undefined' && (window as any).gtag) {
                (window as any).gtag('event', 'quiz_completed', {
                    'event_category': 'education',
                    'event_label': currentQuiz.category,
                    'value': earnedTVLT
                });
            }

            // Streak bonuses
            if (streak > 0 && (streak + 1) % 5 === 0) {
                const bonusTVLT = 50;
                setTvltBalance((prev: number) => prev + bonusTVLT);
                if (onTVLTEarned) {
                    onTVLTEarned(bonusTVLT, 'streak_bonus');
                }
                alert(`🔥 Streak Bonus! +${bonusTVLT} TVLT for ${streak + 1} correct answers!`);
            }
        } else {
            setStreak(0);
        }
    };

    const nextQuiz = () => {
        if (dailyQuizzes >= 5 && onPremiumTrigger) {
            onPremiumTrigger('unlimited_quizzes');
            return;
        }
        startQuiz();
    };

    const handleShare = () => {
        if (!currentQuiz || !showResult) return;

        const shareText = selectedAnswer === currentQuiz.correct
            ? `🧠 Just aced a ${currentQuiz.difficulty} ${currentQuiz.category} quiz on TimeVault! Learning crypto while earning TVLT tokens 💰 Test your knowledge: https://timevaultai.com #TimeVaultQuiz #CryptoEducation`
            : `📚 Learning from mistakes on TimeVault's crypto quiz! Every question teaches something valuable about ${currentQuiz.category} 🎓 https://timevaultai.com #TimeVaultQuiz #CryptoEducation`;

        navigator.clipboard.writeText(shareText).then(() => {
            const shareTVLT = 15;
            setTvltBalance((prev: number) => prev + shareTVLT);
            if (onTVLTEarned) {
                onTVLTEarned(shareTVLT, 'quiz_share');
            }
            alert(`📱 Quiz shared! +${shareTVLT} TVLT earned`);
        }).catch(() => {
            alert('Failed to copy to clipboard');
        });
    };

    useEffect(() => {
        startQuiz();
    }, [startQuiz]);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '#4CAF50';
            case 'intermediate': return '#FF9800';
            case 'advanced': return '#F44336';
            default: return '#2196F3';
        }
    };

    const getCategoryEmoji = (category: string) => {
        switch (category) {
            case 'crypto': return '₿';
            case 'time': return '⏰';
            case 'investing': return '📈';
            case 'blockchain': return '🔗';
            default: return '🧠';
        }
    };

    return (
        <div className="educational-quiz">
            <div className="quiz-header">
                <h2>🧠 Crypto Education Quiz</h2>
                <div className="quiz-stats">
                    <div className="stat">
                        <span className="value">{tvltBalance.toLocaleString()}</span>
                        <span className="label">TVLT Balance</span>
                    </div>
                    <div className="stat">
                        <span className="value">{streak}</span>
                        <span className="label">Current Streak</span>
                    </div>
                    <div className="stat">
                        <span className="value">{dailyQuizzes}/5</span>
                        <span className="label">Daily Quizzes</span>
                    </div>
                    <div className="stat">
                        <span className="value">{totalCorrect}</span>
                        <span className="label">Total Correct</span>
                    </div>
                </div>
            </div>

            {currentQuiz && (
                <div className="quiz-content">
                    <div className="quiz-info">
                        <span
                            className="difficulty"
                            style={{ backgroundColor: getDifficultyColor(currentQuiz.difficulty) }}
                        >
                            {currentQuiz.difficulty.toUpperCase()}
                        </span>
                        <span className="category">
                            {getCategoryEmoji(currentQuiz.category)} {currentQuiz.category}
                        </span>
                        <span className="reward">💰 {currentQuiz.reward} TVLT</span>
                    </div>

                    <h3 className="question">{currentQuiz.question}</h3>

                    {!showResult ? (
                        <div className="quiz-options">
                            {currentQuiz.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`quiz-option ${selectedAnswer === index ? 'selected' : ''}`}
                                    onClick={() => setSelectedAnswer(index)}
                                    type="button"
                                >
                                    {String.fromCharCode(65 + index)}. {option}
                                </button>
                            ))}

                            <button
                                onClick={submitAnswer}
                                disabled={selectedAnswer === null}
                                className="submit-answer-btn"
                                type="button"
                            >
                                Submit Answer
                            </button>
                        </div>
                    ) : (
                        <div className="quiz-result">
                            <div className={`result-indicator ${selectedAnswer === currentQuiz.correct ? 'correct' : 'incorrect'}`}>
                                {selectedAnswer === currentQuiz.correct ? (
                                    <div className="correct-result">
                                        <h4>🎉 Correct! +{currentQuiz.reward} TVLT</h4>
                                        {streak > 1 && <p>🔥 Streak: {streak}!</p>}
                                    </div>
                                ) : (
                                    <div className="incorrect-result">
                                        <h4>❌ Incorrect</h4>
                                        <p>Correct answer: {String.fromCharCode(65 + currentQuiz.correct)}. {currentQuiz.options[currentQuiz.correct]}</p>
                                    </div>
                                )}
                            </div>

                            <div className="explanation">
                                <h5>💡 Explanation:</h5>
                                <p>{currentQuiz.explanation}</p>
                            </div>

                            <div className="quiz-actions">
                                <button onClick={nextQuiz} className="next-quiz-btn" type="button">
                                    {dailyQuizzes >= 5 ? '💎 Unlock Unlimited Quizzes' : '➡️ Next Quiz'}
                                </button>
                                <button onClick={handleShare} className="share-knowledge-btn" type="button">
                                    📱 Share Knowledge (+15 TVLT)
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {streak >= 3 && (
                <div className="streak-celebration">
                    🔥 On fire! {streak} correct answers in a row! Next milestone: {Math.ceil(streak / 5) * 5} for bonus TVLT!
                </div>
            )}
        </div>
    );
};

export default EducationalQuiz;
