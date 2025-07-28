import React, { useCallback, useState } from 'react';

interface EducationalQuizProps {
    onTVLTEarned?: (amount: number, type: string) => void;
    onPremiumTrigger?: (trigger: string) => void;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    tvltReward: number;
}

const quizQuestions: Question[] = [
    {
        id: 1,
        question: "What is the maximum supply of Bitcoin?",
        options: ["21 million", "100 million", "No limit", "50 million"],
        correctAnswer: 0,
        explanation: "Bitcoin has a fixed supply cap of 21 million coins, making it a deflationary asset.",
        tvltReward: 10
    },
    {
        id: 2,
        question: "What consensus mechanism does Ethereum 2.0 use?",
        options: ["Proof of Work", "Proof of Stake", "Proof of Authority", "Proof of Burn"],
        correctAnswer: 1,
        explanation: "Ethereum transitioned to Proof of Stake with Ethereum 2.0, reducing energy consumption significantly.",
        tvltReward: 15
    },
    {
        id: 3,
        question: "What does 'HODL' stand for in crypto?",
        options: ["Hold On for Dear Life", "Hold On Don't Lose", "It's a misspelling of 'hold'", "High Order Digital Ledger"],
        correctAnswer: 2,
        explanation: "HODL originated from a misspelled 'hold' in a Bitcoin forum post and became a popular crypto strategy.",
        tvltReward: 5
    }
];

const EducationalQuiz: React.FC<EducationalQuizProps> = ({
    onTVLTEarned,
    onPremiumTrigger
}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [totalScore, setTotalScore] = useState(0);
    const [totalTVLT, setTotalTVLT] = useState(0);
    const [dailyQuizCount, setDailyQuizCount] = useState(0);

    const handleAnswerSelect = useCallback((answerIndex: number) => {
        setSelectedAnswer(answerIndex);
    }, []);

    const handleSubmitAnswer = useCallback(() => {
        if (selectedAnswer === null) return;

        const question = quizQuestions[currentQuestion];
        const isCorrect = selectedAnswer === question.correctAnswer;

        setShowResult(true);

        if (isCorrect) {
            setTotalScore(prev => prev + 1);
            setTotalTVLT(prev => prev + question.tvltReward);
            onTVLTEarned?.(question.tvltReward, 'quiz_correct');
        }

        setTimeout(() => {
            if (currentQuestion < quizQuestions.length - 1) {
                setCurrentQuestion(prev => prev + 1);
                setSelectedAnswer(null);
                setShowResult(false);
            } else {
                setQuizCompleted(true);
                setDailyQuizCount(prev => {
                    const newCount = prev + 1;
                    if (newCount >= 3) {
                        onPremiumTrigger?.('unlimited_quizzes');
                    }
                    return newCount;
                });
            }
        }, 2000);
    }, [selectedAnswer, currentQuestion, onTVLTEarned, onPremiumTrigger]);

    const resetQuiz = useCallback(() => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowResult(false);
        setQuizCompleted(false);
        setTotalScore(0);
        setTotalTVLT(0);
    }, []);

    const currentQ = quizQuestions[currentQuestion];

    if (quizCompleted) {
        return (
            <div className="quiz-completed">
                <h2>🎉 Quiz Completed!</h2>
                <div className="final-score">
                    <div className="score-item">
                        <span className="score-number">{totalScore}</span>
                        <span className="score-label">Correct Answers</span>
                    </div>
                    <div className="score-item">
                        <span className="score-number">{totalTVLT}</span>
                        <span className="score-label">TVLT Earned</span>
                    </div>
                </div>
                <button onClick={resetQuiz} className="restart-btn">
                    🔄 Take Quiz Again
                </button>

                {dailyQuizCount >= 3 && (
                    <div className="premium-prompt">
                        <h3>🚀 Ready for More?</h3>
                        <p>You've completed 3 quizzes today! Upgrade to Premium for unlimited quizzes and 3x TVLT rewards.</p>
                    </div>
                )}

                <style jsx>{`
                    .quiz-completed {
                        text-align: center;
                        padding: 3rem 2rem;
                        background: linear-gradient(135deg, #28a745, #20c997);
                        color: white;
                        border-radius: 15px;
                        max-width: 500px;
                        margin: 0 auto;
                    }

                    .final-score {
                        display: flex;
                        justify-content: space-around;
                        margin: 2rem 0;
                    }

                    .score-item {
                        text-align: center;
                    }

                    .score-number {
                        display: block;
                        font-size: 3rem;
                        font-weight: bold;
                    }

                    .score-label {
                        display: block;
                        font-size: 1rem;
                        opacity: 0.9;
                    }

                    .restart-btn {
                        background: white;
                        color: #28a745;
                        border: none;
                        padding: 1rem 2rem;
                        border-radius: 8px;
                        font-weight: 600;
                        cursor: pointer;
                        font-size: 1.1rem;
                        transition: transform 0.2s ease;
                    }

                    .restart-btn:hover {
                        transform: translateY(-2px);
                    }

                    .premium-prompt {
                        margin-top: 2rem;
                        padding: 1.5rem;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        backdrop-filter: blur(10px);
                    }

                    .premium-prompt h3 {
                        margin-bottom: 1rem;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="educational-quiz">
            <div className="quiz-header">
                <h2>🧠 Educational Quiz</h2>
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                </div>
                <div className="quiz-info">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>💰 {totalTVLT} TVLT earned</span>
                </div>
            </div>

            <div className="question-card">
                <h3 className="question">{currentQ.question}</h3>

                <div className="options">
                    {currentQ.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(index)}
                            className={`option-btn ${selectedAnswer === index ? 'selected' : ''
                                } ${showResult
                                    ? index === currentQ.correctAnswer
                                        ? 'correct'
                                        : selectedAnswer === index
                                            ? 'incorrect'
                                            : ''
                                    : ''
                                }`}
                            disabled={showResult}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                {showResult && (
                    <div className="result-explanation">
                        <div className={`result-status ${selectedAnswer === currentQ.correctAnswer ? 'correct' : 'incorrect'}`}>
                            {selectedAnswer === currentQ.correctAnswer
                                ? `🎉 Correct! +${currentQ.tvltReward} TVLT`
                                : '❌ Incorrect'}
                        </div>
                        <p className="explanation">{currentQ.explanation}</p>
                    </div>
                )}

                {!showResult && (
                    <button
                        onClick={handleSubmitAnswer}
                        disabled={selectedAnswer === null}
                        className="submit-btn"
                    >
                        Submit Answer
                    </button>
                )}
            </div>

            <style jsx>{`
                .educational-quiz {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 2rem;
                }

                .quiz-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .quiz-header h2 {
                    color: #2c3e50;
                    margin-bottom: 1rem;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(45deg, #007bff, #0056b3);
                    transition: width 0.3s ease;
                }

                .quiz-info {
                    display: flex;
                    justify-content: space-between;
                    color: #6c757d;
                    font-size: 0.9rem;
                }

                .question-card {
                    background: white;
                    padding: 2rem;
                    border-radius: 15px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                }

                .question {
                    color: #2c3e50;
                    margin-bottom: 2rem;
                    font-size: 1.3rem;
                    line-height: 1.5;
                }

                .options {
                    display: grid;
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .option-btn {
                    padding: 1rem;
                    border: 2px solid #dee2e6;
                    background: #f8f9fa;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 1rem;
                    text-align: left;
                    transition: all 0.3s ease;
                }

                .option-btn:hover:not(:disabled) {
                    border-color: #007bff;
                    background: #e7f3ff;
                }

                .option-btn.selected {
                    border-color: #007bff;
                    background: #007bff;
                    color: white;
                }

                .option-btn.correct {
                    border-color: #28a745;
                    background: #28a745;
                    color: white;
                }

                .option-btn.incorrect {
                    border-color: #dc3545;
                    background: #dc3545;
                    color: white;
                }

                .option-btn:disabled {
                    cursor: not-allowed;
                }

                .submit-btn {
                    width: 100%;
                    padding: 1rem;
                    background: linear-gradient(45deg, #007bff, #0056b3);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .submit-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                }

                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .result-explanation {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-top: 1rem;
                }

                .result-status {
                    font-weight: bold;
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }

                .result-status.correct {
                    color: #28a745;
                }

                .result-status.incorrect {
                    color: #dc3545;
                }

                .explanation {
                    color: #495057;
                    line-height: 1.6;
                    margin: 0;
                }

                @media (max-width: 768px) {
                    .educational-quiz {
                        padding: 1rem;
                        margin: 1rem;
                    }

                    .question-card {
                        padding: 1.5rem;
                    }

                    .quiz-info {
                        flex-direction: column;
                        gap: 0.5rem;
                        text-align: center;
                    }
                }
            `}</style>
        </div>
    );
};

export default EducationalQuiz;
