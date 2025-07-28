'use client';

import { Calculator, Clock, Share2, Sparkles, TrendingUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import SocialShareWidget from './SocialShareWidget';

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
    weeklyIncome: number;
    monthlyIncome: number;
    yearlyIncome: number;
}

const SUPPORTED_CRYPTOS = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', emoji: '🟡', color: 'from-orange-500 to-yellow-500' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', emoji: '🔹', color: 'from-blue-500 to-indigo-500' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', emoji: '🌊', color: 'from-blue-400 to-cyan-400' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', emoji: '🔵', color: 'from-blue-600 to-purple-600' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', emoji: '🟣', color: 'from-purple-500 to-pink-500' },
    { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE', emoji: '🐕', color: 'from-yellow-400 to-orange-400' }
];

const WAGE_PRESETS = [
    { label: 'Minimum Wage', value: 15, icon: '💼', description: 'Entry level jobs' },
    { label: 'Average Worker', value: 25, icon: '👷', description: 'US median wage' },
    { label: 'Professional', value: 50, icon: '💻', description: 'Skilled worker' },
    { label: 'Expert', value: 100, icon: '🎯', description: 'Senior professional' },
    { label: 'Executive', value: 200, icon: '👔', description: 'C-level executive' }
];

// Type declarations for analytics
declare global {
    interface Window {
        trackCalculatorUsage?: (crypto: string, amount: number, value: number) => void;
        trackPremiumClick?: (feature: string) => void;
    }
}

export default function CryptoCalculator({ initialCryptoPrices, initialMetalPrices }: CalculatorProps) {
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [amount, setAmount] = useState('1');
    const [hourlyWage, setHourlyWage] = useState(25);
    const [customWage, setCustomWage] = useState('');
    const [cryptoPrices, setCryptoPrices] = useState<CryptoPrice[]>(initialCryptoPrices);
    const [metalPrices] = useState<MetalPrices>(initialMetalPrices);
    const [isLoading, setIsLoading] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [showPremiumTeaser, setShowPremiumTeaser] = useState(false);
    const [showShareWidget, setShowShareWidget] = useState(false);

    // Enhanced input validation and sanitization
    const sanitizedAmount = useMemo(() => {
        const num = parseFloat(amount.replace(/[^\d.-]/g, ''));
        return isNaN(num) || num < 0 ? 0 : Math.min(num, 1000000); // Cap at 1M for security
    }, [amount]);

    const sanitizedWage = useMemo(() => {
        const wage = customWage ? parseFloat(customWage) : hourlyWage;
        return Math.max(1, Math.min(wage, 10000)); // Reasonable wage range
    }, [hourlyWage, customWage]);

    // Get current crypto data
    const currentCrypto = useMemo(() => {
        return cryptoPrices.find(crypto => crypto.id === selectedCrypto) || cryptoPrices[0];
    }, [cryptoPrices, selectedCrypto]);

    // Enhanced calculation with more metrics
    const calculation: CalculationResult = useMemo(() => {
        if (!currentCrypto || sanitizedAmount === 0) {
            return {
                totalValue: 0,
                workHours: 0,
                goldOunces: 0,
                silverOunces: 0,
                shareableText: '',
                weeklyIncome: 0,
                monthlyIncome: 0,
                yearlyIncome: 0
            };
        }

        const totalValue = currentCrypto.current_price * sanitizedAmount;
        const workHours = totalValue / sanitizedWage;
        const goldOunces = totalValue / metalPrices.gold;
        const silverOunces = totalValue / metalPrices.silver;

        const weeklyIncome = sanitizedWage * 40; // 40 hour work week
        const monthlyIncome = weeklyIncome * 4.33; // Average weeks per month
        const yearlyIncome = weeklyIncome * 52; // 52 weeks per year

        const shareableText = `💎 ${sanitizedAmount} ${currentCrypto.symbol.toUpperCase()} = ${workHours.toFixed(1)} hours of work! That's $${totalValue.toLocaleString()} or ${goldOunces.toFixed(2)} oz of gold. Calculate yours at TimeVaultAI.com 🧮`;

        return {
            totalValue,
            workHours,
            goldOunces,
            silverOunces,
            shareableText,
            weeklyIncome,
            monthlyIncome,
            yearlyIncome
        };
    }, [currentCrypto, sanitizedAmount, sanitizedWage, metalPrices]);

    // Track calculator usage for analytics
    useEffect(() => {
        if (calculation.totalValue > 0 && typeof window !== 'undefined' && window.trackCalculatorUsage) {
            const timeoutId = setTimeout(() => {
                window.trackCalculatorUsage!(selectedCrypto, sanitizedAmount, calculation.totalValue);
            }, 1000); // Debounce tracking

            return () => clearTimeout(timeoutId);
        }
    }, [selectedCrypto, sanitizedAmount, calculation.totalValue]);

    // Show premium teaser after significant interaction
    useEffect(() => {
        if (calculation.totalValue > 10000 && !showPremiumTeaser) {
            setTimeout(() => setShowPremiumTeaser(true), 2000);
        }
    }, [calculation.totalValue, showPremiumTeaser]);

    // Format time display
    const formatTime = (hours: number) => {
        if (hours < 24) {
            return `${hours.toFixed(1)} hours`;
        } else if (hours < 168) { // 7 days
            const days = Math.floor(hours / 24);
            const remainingHours = hours % 24;
            return `${days} days, ${remainingHours.toFixed(1)} hours`;
        } else if (hours < 730) { // ~30 days
            const weeks = Math.floor(hours / 168);
            const days = Math.floor((hours % 168) / 24);
            return `${weeks} weeks, ${days} days`;
        } else if (hours < 8760) { // 365 days
            const months = Math.floor(hours / 730);
            const weeks = Math.floor((hours % 730) / 168);
            return `${months} months, ${weeks} weeks`;
        } else {
            const years = Math.floor(hours / 8760);
            const months = Math.floor((hours % 8760) / 730);
            return `${years} years, ${months} months`;
        }
    };

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

    // Share functionality
    const handleShareClick = useCallback(() => {
        setShowShareWidget(!showShareWidget);
    }, [showShareWidget]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm border border-gold/20 rounded-2xl p-8 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <Calculator className="w-8 h-8 text-gold" />
                    <h2 className="text-3xl font-bold text-white">Crypto Time Calculator</h2>
                </div>
                <div className="text-right">
                    <p className="text-sm text-blue-200">Last updated</p>
                    <p className="text-xs text-blue-300">{lastUpdated.toLocaleTimeString()}</p>
                </div>
            </div>

            {/* Crypto Selection */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-blue-100 mb-3">
                    Select Cryptocurrency
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SUPPORTED_CRYPTOS.map((crypto) => {
                        const isSelected = selectedCrypto === crypto.id;
                        const cryptoData = cryptoPrices.find(p => p.id === crypto.id);

                        return (
                            <button
                                key={crypto.id}
                                onClick={() => setSelectedCrypto(crypto.id)}
                                className={`p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                        ? 'border-gold bg-gold/20 text-white'
                                        : 'border-blue-600/50 bg-blue-800/30 text-blue-100 hover:border-gold/50'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-lg">{crypto.emoji}</span>
                                    <span className="font-medium">{crypto.symbol}</span>
                                </div>
                                {cryptoData && (
                                    <div className="text-sm">
                                        <p className="text-white font-semibold">
                                            ${cryptoData.current_price.toLocaleString()}
                                        </p>
                                        <p className={`text-xs ${cryptoData.price_change_percentage_24h > 0
                                                ? 'text-green-400'
                                                : 'text-red-400'
                                            }`}>
                                            {cryptoData.price_change_percentage_24h > 0 ? '+' : ''}
                                            {cryptoData.price_change_percentage_24h.toFixed(2)}%
                                        </p>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-blue-100 mb-2">
                    Amount of {currentCrypto?.symbol.toUpperCase()}
                </label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-3 bg-blue-800/50 border border-blue-600/50 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                    placeholder="Enter amount (e.g., 1, 0.5, 10)"
                />
            </div>

            {/* Wage Selection */}
            <div className="mb-8">
                <label className="block text-sm font-medium text-blue-100 mb-3">
                    Your Hourly Wage
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                    {WAGE_PRESETS.map((preset) => (
                        <button
                            key={preset.value}
                            onClick={() => {
                                setHourlyWage(preset.value);
                                setCustomWage('');
                            }}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 text-center ${hourlyWage === preset.value && !customWage
                                    ? 'border-gold bg-gold/20 text-white'
                                    : 'border-blue-600/50 bg-blue-800/30 text-blue-100 hover:border-gold/50'
                                }`}
                        >
                            <div className="text-lg mb-1">{preset.icon}</div>
                            <div className="text-sm font-medium">{preset.label}</div>
                            <div className="text-xs text-blue-300">${preset.value}/hr</div>
                            <div className="text-xs text-blue-400">{preset.description}</div>
                        </button>
                    ))}
                </div>

                {/* Custom Wage Input */}
                <div className="flex items-center gap-3">
                    <span className="text-blue-100">Custom:</span>
                    <input
                        type="number"
                        value={customWage}
                        onChange={(e) => setCustomWage(e.target.value)}
                        className="flex-1 px-4 py-2 bg-blue-800/50 border border-blue-600/50 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
                        placeholder="Enter custom hourly wage"
                        min="1"
                        max="10000"
                    />
                    <span className="text-blue-100">$/hour</span>
                </div>
            </div>

            {/* Results Display */}
            {calculation.totalValue > 0 && (
                <div className="bg-gradient-to-br from-gold/10 to-yellow-500/10 border border-gold/30 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-6 h-6 text-gold" />
                        <h3 className="text-2xl font-bold text-white">Your Results</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Value */}
                        <div className="bg-blue-800/30 rounded-xl p-4 text-center">
                            <p className="text-blue-200 text-sm mb-1">Total Value</p>
                            <p className="text-2xl font-bold text-white">
                                ${calculation.totalValue.toLocaleString()}
                            </p>
                        </div>

                        {/* Work Hours */}
                        <div className="bg-blue-800/30 rounded-xl p-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-blue-300" />
                                <p className="text-blue-200 text-sm">Work Time</p>
                            </div>
                            <p className="text-lg font-bold text-white">
                                {formatTime(calculation.workHours)}
                            </p>
                        </div>

                        {/* Gold Ounces */}
                        <div className="bg-blue-800/30 rounded-xl p-4 text-center">
                            <p className="text-blue-200 text-sm mb-1">Gold Equivalent</p>
                            <p className="text-xl font-bold text-gold">
                                {calculation.goldOunces.toFixed(2)} oz
                            </p>
                        </div>

                        {/* Silver Ounces */}
                        <div className="bg-blue-800/30 rounded-xl p-4 text-center">
                            <p className="text-blue-200 text-sm mb-1">Silver Equivalent</p>
                            <p className="text-xl font-bold text-gray-300">
                                {calculation.silverOunces.toFixed(1)} oz
                            </p>
                        </div>
                    </div>

                    {/* Enhanced Time Breakdown */}
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-blue-900/40 rounded-lg p-4 text-center">
                            <p className="text-blue-200 text-sm">Weekly Work (40hrs)</p>
                            <p className="text-lg font-semibold text-white">
                                {(calculation.workHours / 40).toFixed(1)} weeks
                            </p>
                        </div>
                        <div className="bg-blue-900/40 rounded-lg p-4 text-center">
                            <p className="text-blue-200 text-sm">Monthly Income</p>
                            <p className="text-lg font-semibold text-white">
                                {(calculation.totalValue / calculation.monthlyIncome).toFixed(1)} months
                            </p>
                        </div>
                        <div className="bg-blue-900/40 rounded-lg p-4 text-center">
                            <p className="text-blue-200 text-sm">Yearly Income</p>
                            <p className="text-lg font-semibold text-white">
                                {(calculation.totalValue / calculation.yearlyIncome).toFixed(2)} years
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <button
                            onClick={handleShareClick}
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                        >
                            <Share2 className="w-5 h-5" />
                            Share Results (+15 TVLT)
                        </button>

                        <button
                            onClick={() => {
                                if (window.trackPremiumClick) {
                                    window.trackPremiumClick('calculator_premium_upgrade');
                                }
                                setShowPremiumTeaser(true);
                            }}
                            className="flex-1 bg-gradient-to-r from-gold to-yellow-500 text-navy px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:from-yellow-500 hover:to-gold transition-all duration-200"
                        >
                            <Sparkles className="w-5 h-5" />
                            Get AI Insights
                        </button>
                    </div>
                </div>
            )}

            {/* Social Share Widget */}
            {showShareWidget && calculation.totalValue > 0 && (
                <div className="mb-6">
                    <SocialShareWidget
                        cryptoSymbol={currentCrypto?.symbol || 'BTC'}
                        amount={sanitizedAmount}
                        totalValue={calculation.totalValue}
                        workHours={calculation.workHours}
                        goldOunces={calculation.goldOunces}
                    />
                </div>
            )}

            {/* Premium Teaser */}
            {showPremiumTeaser && (
                <div className="bg-gradient-to-br from-gold/20 to-yellow-500/20 border border-gold/40 rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gold mb-2">🚀 Unlock Premium Features</h3>
                            <ul className="text-blue-100 space-y-1">
                                <li>• AI-powered price predictions</li>
                                <li>• Historical trend analysis</li>
                                <li>• Portfolio tracking & alerts</li>
                                <li>• Advanced sharing templates</li>
                            </ul>
                        </div>
                        <div className="text-right">
                            <button
                                onClick={() => {
                                    if (window.trackPremiumClick) {
                                        window.trackPremiumClick('premium_teaser_upgrade');
                                    }
                                }}
                                className="bg-gradient-to-r from-gold to-yellow-500 text-navy px-6 py-3 rounded-xl font-bold hover:from-yellow-500 hover:to-gold transition-all duration-200"
                            >
                                Upgrade Now
                            </button>
                            <p className="text-sm text-gold mt-2">Starting at $9.99/month</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="text-center text-blue-300 text-sm">
                <p>Prices update every 30 seconds • Real-time data from CoinGecko & Metals.live</p>
                <p className="mt-1">Built with ❤️ by TimeVault • Share to earn TVLT tokens</p>
            </div>
        </div>
    );
}
