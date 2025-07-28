'use client';

import { BookOpen, Calculator, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import CryptoCalculator from './CryptoCalculator';
import QuizComponent from './QuizComponent';
import WalletComponent from './WalletComponent';

interface CryptoPrice {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
}

interface MetalPrices {
    gold: number;
    silver: number;
}

interface DashboardProps {
    initialCryptoPrices: CryptoPrice[];
    initialMetalPrices: MetalPrices;
}

type TabType = 'calculator' | 'quiz' | 'wallet' | 'premium';

export default function Dashboard({ initialCryptoPrices, initialMetalPrices }: DashboardProps) {
    const [activeTab, setActiveTab] = useState<TabType>('calculator');
    const [userStats] = useState({
        totalCalculations: 47,
        tvltEarned: 245,
        quizzesCompleted: 8,
        streakDays: 12,
        nftBadges: 3
    });

    const tabs = [
        { id: 'calculator' as TabType, label: 'Calculator', icon: Calculator, color: 'text-yellow-400' },
        { id: 'quiz' as TabType, label: 'Learn & Earn', icon: BookOpen, color: 'text-green-400' },
        { id: 'wallet' as TabType, label: 'Wallet', icon: Target, color: 'text-purple-400' },
        { id: 'premium' as TabType, label: 'Premium', icon: TrendingUp, color: 'text-blue-400' }
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'calculator':
                return (
                    <CryptoCalculator
                        initialCryptoPrices={initialCryptoPrices}
                        initialMetalPrices={initialMetalPrices}
                    />
                );

            case 'quiz':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Educational Quizzes</h3>
                            <p className="text-gray-300">Learn about crypto, blockchain, and investing while earning TVLT tokens</p>
                        </div>
                        <QuizComponent onComplete={(score, tvlt) => {
                            console.log(`Quiz completed: ${score} score, ${tvlt} TVLT earned`);
                        }} />
                    </div>
                );

            case 'wallet':
                return (
                    <div className="space-y-6">
                        <div className="text-center mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Wallet & Rewards</h3>
                            <p className="text-gray-300">Connect your wallet to earn TVLT tokens and mint NFT badges</p>
                        </div>
                        <WalletComponent
                            onConnect={(address) => console.log('Connected:', address)}
                            onDisconnect={() => console.log('Disconnected')}
                        />
                    </div>
                );

            case 'premium':
                return (
                    <div className="max-w-2xl mx-auto bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-8 text-center">
                        <div className="mb-6">
                            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">👑</span>
                            </div>
                            <h3 className="text-3xl font-bold text-white mb-2">TimeVault Premium</h3>
                            <p className="text-gray-300">
                                Unlock AI-powered insights, advanced charting, and exclusive features
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-blue-700/30 rounded-lg p-6">
                                <h4 className="text-yellow-400 font-bold mb-3">🤖 AI Insights</h4>
                                <ul className="text-gray-300 text-sm space-y-2 text-left">
                                    <li>• Personalized investment recommendations</li>
                                    <li>• Market trend predictions</li>
                                    <li>• Portfolio optimization suggestions</li>
                                    <li>• Risk assessment reports</li>
                                </ul>
                            </div>

                            <div className="bg-blue-700/30 rounded-lg p-6">
                                <h4 className="text-yellow-400 font-bold mb-3">📊 Advanced Charts</h4>
                                <ul className="text-gray-300 text-sm space-y-2 text-left">
                                    <li>• Historical price comparisons</li>
                                    <li>• Work hour trend analysis</li>
                                    <li>• Precious metals correlations</li>
                                    <li>• Custom time ranges</li>
                                </ul>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-yellow-400/10 border border-yellow-400 rounded-lg p-4">
                                <div className="text-yellow-400 font-bold mb-2">Premium Access Options</div>
                                <div className="text-gray-300 text-sm">
                                    • Hold 1000+ TVLT tokens (earn through quizzes & engagement)
                                    <br />
                                    • Own a TimePass NFT (mint with achievements)
                                    <br />
                                    • Subscribe for $9.99/month via Stripe
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all">
                                Upgrade to Premium
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
            <div className="container mx-auto px-4 py-8">
                {/* User Stats Header */}
                <div className="mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="bg-blue-800/50 rounded-lg p-4 text-center">
                            <div className="text-yellow-400 font-bold text-lg">{userStats.totalCalculations}</div>
                            <div className="text-gray-300 text-sm">Calculations</div>
                        </div>
                        <div className="bg-blue-800/50 rounded-lg p-4 text-center">
                            <div className="text-green-400 font-bold text-lg">{userStats.tvltEarned}</div>
                            <div className="text-gray-300 text-sm">TVLT Earned</div>
                        </div>
                        <div className="bg-blue-800/50 rounded-lg p-4 text-center">
                            <div className="text-purple-400 font-bold text-lg">{userStats.quizzesCompleted}</div>
                            <div className="text-gray-300 text-sm">Quizzes</div>
                        </div>
                        <div className="bg-blue-800/50 rounded-lg p-4 text-center">
                            <div className="text-blue-400 font-bold text-lg">{userStats.streakDays}</div>
                            <div className="text-gray-300 text-sm">Day Streak</div>
                        </div>
                        <div className="bg-blue-800/50 rounded-lg p-4 text-center">
                            <div className="text-red-400 font-bold text-lg">{userStats.nftBadges}</div>
                            <div className="text-gray-300 text-sm">NFT Badges</div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="mb-8">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${isActive
                                            ? 'bg-yellow-400 text-blue-900'
                                            : 'bg-blue-700/50 text-white hover:bg-blue-600/50'
                                        }`}
                                >
                                    <Icon size={20} className={`mr-2 ${isActive ? 'text-blue-900' : tab.color}`} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="mb-8">
                    {renderTabContent()}
                </div>

                {/* Engagement Footer */}
                <div className="text-center bg-blue-800/30 rounded-lg p-6">
                    <div className="text-white font-medium mb-2">
                        🎯 Keep your streak alive! Come back tomorrow for daily rewards
                    </div>
                    <div className="text-gray-300 text-sm">
                        Complete quizzes • Share calculations • Earn TVLT • Unlock premium features
                    </div>
                </div>
            </div>
        </div>
    );
}
