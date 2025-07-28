'use client';

import { Calculator, Clock, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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

interface CalculatorProps {
    initialCryptoPrices: CryptoPrice[];
    initialMetalPrices: MetalPrices;
}

interface CalculationResult {
    totalValue: number;
    workHours: number;
    goldOunces: number;
    silverOunces: number;
    shareableText: string;
}

const SUPPORTED_CRYPTOS = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', emoji: '🟡' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', emoji: '🔹' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', emoji: '🌊' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', emoji: '🔵' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', emoji: '🟣' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', emoji: '🐕' }
];

const WAGE_PRESETS = [
    { label: 'Minimum Wage', value: 15, icon: '💼' },
    { label: 'Average Worker', value: 25, icon: '👷' },
    { label: 'Professional', value: 50, icon: '💻' },
    { label: 'Expert', value: 100, icon: '🎯' }
];

export default function CryptoCalculator({ initialCryptoPrices, initialMetalPrices }: CalculatorProps) {
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [amount, setAmount] = useState('1');
    const [hourlyWage, setHourlyWage] = useState(25);
    const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>(initialCryptoPrices);
    const [metalPrices] = useState<MetalPrices>(initialMetalPrices);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Input validation and sanitization
    const sanitizedAmount = useMemo(() => {
        const num = parseFloat(amount.replace(/[^\d.-]/g, ''));
        return isNaN(num) || num < 0 ? 0 : Math.min(num, 1000000); // Cap at 1M for security
    }, [amount]);

    const sanitizedWage = useMemo(() => {
        return Math.max(1, Math.min(hourlyWage, 10000)); // Reasonable wage range
    }, [hourlyWage]);

    // Get current crypto data
    const currentCrypto = useMemo(() => {
        return cryptoPrices.find(crypto => crypto.id === selectedCrypto) || cryptoPrices[0];
    }, [cryptoPrices, selectedCrypto]);

    // Calculate results
    const calculation: CalculationResult = useMemo(() => {
        if (!currentCrypto || sanitizedAmount === 0) {
            return {
                totalValue: 0,
                workHours: 0,
                goldOunces: 0,
                silverOunces: 0,
                shareableText: ''
            };
        }

        const totalValue = currentCrypto.current_price * sanitizedAmount;
        const workHours = totalValue / sanitizedWage;
        const goldOunces = totalValue / metalPrices.gold;
        const silverOunces = totalValue / metalPrices.silver;

        const shareableText = `💎 ${sanitizedAmount} ${currentCrypto.symbol.toUpperCase()} = ${workHours.toFixed(1)} hours of work! That's $${totalValue.toLocaleString()} or ${goldOunces.toFixed(2)} oz of gold. Calculate yours at TimeVaultAI.com 🧮`;

        return {
            totalValue,
            workHours,
            goldOunces,
            silverOunces,
            shareableText
        };
    }, [currentCrypto, sanitizedAmount, sanitizedWage, metalPrices]);

    // Update prices periodically
    const updatePrices = useCallback(async () => {
        if (isLoading) return;

        setIsLoading(true);
        try {
            // In a real app, these would be API calls
            // For now, we'll add small random variations to simulate live prices
            setCryptoPrices(prev => prev.map(crypto => ({
                ...crypto,
                current_price: crypto.current_price * (0.98 + Math.random() * 0.04), // ±2% variation
                price_change_percentage_24h: crypto.price_change_percentage_24h + (Math.random() - 0.5) * 0.1
            })));

            setLastUpdated(new Date());
        } catch (error) {
            console.error('Failed to update prices:', error);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading]);

    // Auto-refresh prices every 30 seconds
    useEffect(() => {
        const interval = setInterval(updatePrices, 30000);
        return () => clearInterval(interval);
    }, [updatePrices]);

    // Copy to clipboard functionality
    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            // Could add toast notification here
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    }, []);

    // Share functionality (stub for social media integration)
    const shareResult = useCallback(() => {
        if (navigator.share) {
            navigator.share({
                title: 'TimeVault Crypto Calculator',
                text: calculation.shareableText,
                url: window.location.href
            });
        } else {
            copyToClipboard(calculation.shareableText);
        }
    }, [calculation.shareableText, copyToClipboard]);

    return (
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-800 to-blue-900 rounded-lg p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <Calculator className="text-yellow-400 mr-3" size={32} />
                    <h3 className="text-3xl font-bold text-white">Interactive Calculator</h3>
                </div>
                <p className="text-gray-300">
                    Convert your crypto to work hours and precious metals in real-time
                </p>
                <div className="text-sm text-gray-400 mt-2">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                    {isLoading && <span className="ml-2 animate-pulse">🔄 Updating...</span>}
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="space-y-6">
                    {/* Crypto Selection */}
                    <div>
                        <label className="block text-white font-medium mb-3">
                            Choose Cryptocurrency
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {SUPPORTED_CRYPTOS.map((crypto) => {
                                const priceData = cryptoPrices.find(p => p.id === crypto.id);
                                const isSelected = selectedCrypto === crypto.id;

                                return (
                                    <button
                                        key={crypto.id}
                                        onClick={() => setSelectedCrypto(crypto.id)}
                                        className={`p-4 rounded-lg border-2 transition-all ${isSelected
                                                ? 'border-yellow-400 bg-yellow-400/10'
                                                : 'border-blue-600 bg-blue-700/50 hover:border-yellow-400/50'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <div className="flex items-center mb-1">
                                                <span className="text-lg mr-2">{crypto.emoji}</span>
                                                <span className="text-white font-medium">{crypto.symbol}</span>
                                            </div>
                                            <div className="text-sm text-gray-300">{crypto.name}</div>
                                            {priceData && (
                                                <div className="text-yellow-400 font-bold text-sm mt-1">
                                                    ${priceData.current_price.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Amount Input */}
                    <div>
                        <label className="block text-white font-medium mb-3">
                            Amount of {currentCrypto?.symbol.toUpperCase() || 'Crypto'}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="1.0"
                                className="w-full px-4 py-3 bg-blue-700 border border-blue-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                            />
                            <div className="absolute right-3 top-3 text-gray-400">
                                {currentCrypto?.symbol.toUpperCase()}
                            </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                            {[0.01, 0.1, 1, 10].map((preset) => (
                                <button
                                    key={preset}
                                    onClick={() => setAmount(preset.toString())}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors"
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Wage Input */}
                    <div>
                        <label className="block text-white font-medium mb-3">
                            Your Hourly Wage (USD)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                value={hourlyWage}
                                onChange={(e) => setHourlyWage(Number(e.target.value))}
                                min="1"
                                max="10000"
                                className="w-full px-4 py-3 bg-blue-700 border border-blue-600 rounded-lg text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                            />
                            <div className="absolute left-3 top-3 text-gray-400">$</div>
                            <div className="absolute right-3 top-3 text-gray-400">/hr</div>
                        </div>
                        <div className="flex gap-2 mt-2 flex-wrap">
                            {WAGE_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    onClick={() => setHourlyWage(preset.value)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded transition-colors flex items-center"
                                >
                                    <span className="mr-1">{preset.icon}</span>
                                    ${preset.value}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="space-y-6">
                    {/* Main Result */}
                    <div className="bg-blue-700/50 rounded-lg p-6 border-l-4 border-yellow-400">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-yellow-400 mb-2">
                                {calculation.workHours.toFixed(1)}
                            </div>
                            <div className="text-white font-medium mb-4">
                                Hours of Work
                            </div>
                            <div className="text-gray-300 text-sm">
                                {sanitizedAmount} {currentCrypto?.symbol.toUpperCase()} = ${calculation.totalValue.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Additional Conversions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-700/30 rounded-lg p-4 text-center">
                            <div className="text-yellow-400 text-2xl font-bold">
                                {calculation.goldOunces.toFixed(3)}
                            </div>
                            <div className="text-white text-sm">oz Gold</div>
                            <div className="text-gray-400 text-xs">
                                @${metalPrices.gold}/oz
                            </div>
                        </div>
                        <div className="bg-blue-700/30 rounded-lg p-4 text-center">
                            <div className="text-yellow-400 text-2xl font-bold">
                                {calculation.silverOunces.toFixed(1)}
                            </div>
                            <div className="text-white text-sm">oz Silver</div>
                            <div className="text-gray-400 text-xs">
                                @${metalPrices.silver}/oz
                            </div>
                        </div>
                    </div>

                    {/* Time Breakdown */}
                    <div className="bg-blue-700/30 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                            <Clock className="text-yellow-400 mr-2" size={20} />
                            <span className="text-white font-medium">Time Breakdown</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-300">
                                Days: <span className="text-white">{(calculation.workHours / 8).toFixed(1)}</span>
                            </div>
                            <div className="text-gray-300">
                                Weeks: <span className="text-white">{(calculation.workHours / 40).toFixed(1)}</span>
                            </div>
                            <div className="text-gray-300">
                                Months: <span className="text-white">{(calculation.workHours / 160).toFixed(1)}</span>
                            </div>
                            <div className="text-gray-300">
                                Years: <span className="text-white">{(calculation.workHours / 2080).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Share Button */}
                    <button
                        onClick={shareResult}
                        className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-blue-900 font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center"
                    >
                        <TrendingUp className="mr-2" size={20} />
                        Share Result (+15 TVLT)
                    </button>
                </div>
            </div>

            {/* Engagement Hooks */}
            <div className="mt-8 pt-6 border-t border-blue-600">
                <div className="text-center text-gray-300 text-sm">
                    💡 <strong>Pro Tip:</strong> Want historical charts and AI insights?
                    <button className="text-yellow-400 hover:text-yellow-300 ml-1 underline">
                        Upgrade to Premium
                    </button>
                </div>
            </div>
        </div>
    );
}
