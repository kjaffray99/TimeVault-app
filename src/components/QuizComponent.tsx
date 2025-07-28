'use client';

import { ArrowRight, Award, Brain, Star } from 'lucide-react';
import { useState } from 'react';

interface QuizQuestion {
    id: string;
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    tvltReward: number;
}

interface QuizComponentProps {
    onComplete?: (score: number, tvltEarned: number) => void;
}

// Sample questions for educational engagement
const SAMPLE_QUESTIONS: QuizQuestion[] = [
    {
        id: 'btc-basics',
        question: 'What makes Bitcoin valuable as "digital gold"?',
        options: [
            'Unlimited supply like paper money',
            'Fixed supply of 21 million coins',
            'Government backing and regulation',
            'Mining requires no energy'
        ],
        correctAnswer: 1,
        explanation: 'Bitcoin\'s scarcity (21M max supply) creates digital scarcity similar to gold, making it a store of value.',
        tvltReward: 10
    },
    {
        id: 'crypto-time',
        question: 'If Bitcoin is $50,000 and you earn $25/hour, how many work hours equals 1 BTC?',
        options: ['1,000 hours', '2,000 hours', '500 hours', '5,000 hours'],
        correctAnswer: 1,
        explanation: '$50,000 ÷ $25/hour = 2,000 hours of work. This helps visualize crypto value in personal terms.',
        tvltReward: 15
    },
    {
        id: 'precious-metals',
        question: 'Why do people compare crypto to gold and silver?',
        options: [
            'They have the same color',
            'Both are physical metals',
            'Both are stores of value with limited supply',
            'They\'re equally easy to transport'
        ],
        correctAnswer: 2,
        explanation: 'Like precious metals, quality cryptocurrencies serve as stores of value due to scarcity and demand.',
        tvltReward: 12
    }
];

export default function QuizComponent({ onComplete }: QuizComponentProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [totalTvlt, setTotalTvlt] = useState(0);
    const [isComplete, setIsComplete] = useState(false);

    const question = SAMPLE_QUESTIONS[currentQuestion];
    const isLastQuestion = currentQuestion === SAMPLE_QUESTIONS.length - 1;

    const handleAnswerSelect = (answerIndex: number) => {
        if (showExplanation) return;

        setSelectedAnswer(answerIndex);
        setShowExplanation(true);

        if (answerIndex === question.correctAnswer) {
            setScore(prev => prev + 1);
            setTotalTvlt(prev => prev + question.tvltReward);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            setIsComplete(true);
            onComplete?.(score, totalTvlt);
        } else {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(null);
            setShowExplanation(false);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setScore(0);
        setTotalTvlt(0);
        setIsComplete(false);
    };

    if (isComplete) {
        return (
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-8 text-center">
                <div className="mb-6">
                    <Award className="text-yellow-400 mx-auto mb-4" size={64} />
                    <h3 className="text-3xl font-bold text-white mb-2">Quiz Complete! 🎉</h3>
                    <p className="text-gray-300">
                        You scored {score} out of {SAMPLE_QUESTIONS.length}
                    </p>
                </div>

                <div className="bg-yellow-400/10 border border-yellow-400 rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-center mb-2">
                        <Star className="text-yellow-400 mr-2" size={24} />
                        <span className="text-yellow-400 font-bold text-xl">+{totalTvlt} TVLT Earned!</span>
                    </div>
                    <p className="text-gray-300 text-sm">
                        Use TVLT tokens for premium features, AI insights, and exclusive NFT minting
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={resetQuiz}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                    >
                        Take Quiz Again
                    </button>
                    <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all">
                        Unlock More Quizzes (Premium)
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <Brain className="text-yellow-400 mr-3" size={28} />
                    <h3 className="text-2xl font-bold text-white">Crypto Education Quiz</h3>
                </div>
                <div className="text-gray-300 text-sm">
                    {currentQuestion + 1} / {SAMPLE_QUESTIONS.length}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-blue-700 rounded-full h-2 mb-8">
                <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / SAMPLE_QUESTIONS.length) * 100}%` }}
                />
            </div>

            {/* Question */}
            <div className="mb-6">
                <h4 className="text-xl text-white font-medium mb-6">
                    {question.question}
                </h4>

                <div className="space-y-3">
                    {question.options.map((option, index) => {
                        let buttonClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";

                        if (!showExplanation) {
                            buttonClass += "border-blue-600 bg-blue-700/50 hover:border-yellow-400/50 text-white";
                        } else if (index === question.correctAnswer) {
                            buttonClass += "border-green-400 bg-green-400/20 text-white";
                        } else if (index === selectedAnswer && index !== question.correctAnswer) {
                            buttonClass += "border-red-400 bg-red-400/20 text-white";
                        } else {
                            buttonClass += "border-blue-600 bg-blue-700/30 text-gray-300";
                        }

                        return (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                disabled={showExplanation}
                                className={buttonClass}
                            >
                                <div className="flex items-center">
                                    <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                                        {String.fromCharCode(65 + index)}
                                    </span>
                                    {option}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
                <div className="mb-6 p-4 bg-blue-700/30 rounded-lg border-l-4 border-yellow-400">
                    <div className="flex items-center mb-2">
                        {selectedAnswer === question.correctAnswer ? (
                            <>
                                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-green-900 text-sm font-bold">✓</span>
                                </div>
                                <span className="text-green-400 font-medium">Correct! +{question.tvltReward} TVLT</span>
                            </>
                        ) : (
                            <>
                                <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center mr-2">
                                    <span className="text-red-900 text-sm font-bold">✗</span>
                                </div>
                                <span className="text-red-400 font-medium">Incorrect</span>
                            </>
                        )}
                    </div>
                    <p className="text-gray-300 text-sm">
                        {question.explanation}
                    </p>
                </div>
            )}

            {/* Next Button */}
            {showExplanation && (
                <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all flex items-center justify-center"
                >
                    {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
                    <ArrowRight className="ml-2" size={20} />
                </button>
            )}

            {/* TVLT Counter */}
            <div className="mt-6 text-center">
                <div className="text-yellow-400 font-bold">
                    TVLT Earned: {totalTvlt}
                </div>
                <div className="text-gray-400 text-sm">
                    Complete daily quizzes to earn more tokens!
                </div>
            </div>
        </div>
    );
}
