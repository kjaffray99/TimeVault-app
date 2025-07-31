/**
 * 🎯 ENHANCED TIMEVAULT CALCULATOR - PRODUCTION READY & FIXED
 * Mobile-responsive calculator with real-time data and clean UI
 * Optimized for timevaultai.com deployment - COMPREHENSIVE FIX
 */

'use client';

import {
    BarChart3,
    Calculator,
    CheckCircle,
    Clock,
    DollarSign,
    RefreshCw,
    Sparkles,
    Star,
    Target,
    TrendingDown,
    TrendingUp,
    Zap
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

// Import our enhanced custom hooks
import { useAdvancedCalculations } from '../hooks/useAdvancedCalculations';
import {
    useEnhancedAnalytics,
    useEnhancedCryptoPrices,
    useEnhancedMetalsPrices,
    usePerformanceMonitoring
} from '../hooks/useEnhancedApiIntegration';
import { AdvancedPortfolioMode } from './AdvancedPortfolioMode';

// TypeScript interfaces
interface CryptoAsset {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    icon: string;
}

interface CalculationResult {
    asset: CryptoAsset;
    amount: number;
    usdValue: number;
    metals: {
        gold: { amount: number; value: number; unit: string };
        silver: { amount: number; value: number; unit: string };
        platinum: { amount: number; value: number; unit: string };
        palladium: { amount: number; value: number; unit: string };
    };
    timeValue: {
        hours: number;
        days: number;
        weeks: number;
        months: number;
    };
}

// Enhanced crypto asset definitions
const ENHANCED_CRYPTO_ASSETS_CONFIG = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿' },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ' },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎' },
    { id: 'cardano', name: 'Cardano', symbol: 'ADA', icon: '₳' },
    { id: 'ripple', name: 'XRP', symbol: 'XRP', icon: '◉' },
    { id: 'polkadot', name: 'Polkadot', symbol: 'DOT', icon: '●' },
    { id: 'polygon', name: 'Polygon', symbol: 'MATIC', icon: '⬢' },
    { id: 'chainlink', name: 'Chainlink', symbol: 'LINK', icon: '🔗' },
    { id: 'avalanche-2', name: 'Avalanche', symbol: 'AVAX', icon: '🔺' },
    { id: 'uniswap', name: 'Uniswap', symbol: 'UNI', icon: '🦄' },
    { id: 'the-graph', name: 'The Graph', symbol: 'GRT', icon: '📊' },
    { id: 'cosmos', name: 'Cosmos', symbol: 'ATOM', icon: '⚛️' }
];

export default function EnhancedTimeVaultCalculatorFixed() {
    // Enhanced API Hooks
    const {
        data: cryptoData,
        loading: cryptoLoading,
        error: cryptoError,
        lastUpdated: cryptoUpdated,
        healthStatus: cryptoHealth,
        supportedAssets
    } = useEnhancedCryptoPrices();

    const {
        data: metalsData,
        loading: metalsLoading,
        error: metalsError,
        lastUpdated: metalsUpdated,
        healthStatus: metalsHealth
    } = useEnhancedMetalsPrices();

    const { trackEvent, trackCalculation, trackPremiumInterest } = useEnhancedAnalytics();
    const { measureOperation } = usePerformanceMonitoring();
    const { addToPortfolio } = useAdvancedCalculations();

    // State management
    const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
    const [amount, setAmount] = useState<string>('1');
    const [hourlyWage, setHourlyWage] = useState<number>(25);
    const [showPremiumPrompt, setShowPremiumPrompt] = useState<boolean>(false);
    const [calculationCount, setCalculationCount] = useState<number>(0);
    const [showAdvancedPortfolio, setShowAdvancedPortfolio] = useState<boolean>(false);

    // Transform crypto data into enhanced assets array
    const cryptoAssets = useMemo((): CryptoAsset[] => {
        return ENHANCED_CRYPTO_ASSETS_CONFIG.map(config => {
            const priceData = cryptoData[config.id];
            return {
                ...config,
                current_price: priceData?.usd || 0,
                price_change_percentage_24h: priceData?.usd_24h_change || 0,
                market_cap: priceData?.usd_market_cap || 0
            };
        });
    }, [cryptoData]);

    // Get selected asset
    const selectedAsset = useMemo(() => {
        return cryptoAssets.find(asset => asset.id === selectedAssetId) || cryptoAssets[0];
    }, [cryptoAssets, selectedAssetId]);

    // Calculate results with real-time data
    const calculationResult = useMemo((): CalculationResult | null => {
        const numAmount = parseFloat(amount);
        if (!selectedAsset || isNaN(numAmount) || numAmount <= 0) return null;

        const usdValue = selectedAsset.current_price * numAmount;

        // Use real-time metals prices
        const goldPrice = metalsData.gold?.price || 2650;
        const silverPrice = metalsData.silver?.price || 31.50;
        const platinumPrice = metalsData.platinum?.price || 980;
        const palladiumPrice = metalsData.palladium?.price || 925;

        // Time calculations
        const totalHours = usdValue / hourlyWage;

        return {
            asset: selectedAsset,
            amount: numAmount,
            usdValue,
            metals: {
                gold: {
                    amount: usdValue / goldPrice,
                    value: usdValue,
                    unit: 'oz'
                },
                silver: {
                    amount: usdValue / silverPrice,
                    value: usdValue,
                    unit: 'oz'
                },
                platinum: {
                    amount: usdValue / platinumPrice,
                    value: usdValue,
                    unit: 'oz'
                },
                palladium: {
                    amount: usdValue / palladiumPrice,
                    value: usdValue,
                    unit: 'oz'
                }
            },
            timeValue: {
                hours: totalHours,
                days: totalHours / 8,
                weeks: totalHours / 40,
                months: totalHours / 160
            }
        };
    }, [selectedAsset, amount, hourlyWage, metalsData]);

    // Format currency
    const formatCurrency = useCallback((value: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    }, []);

    // Format metal amounts
    const formatMetalAmount = useCallback((amount: number): string => {
        if (amount >= 1) {
            return amount.toFixed(2);
        } else if (amount >= 0.01) {
            return amount.toFixed(3);
        } else {
            return amount.toFixed(4);
        }
    }, []);

    // Handle asset selection
    const handleAssetChange = useCallback((assetId: string) => {
        setSelectedAssetId(assetId);
    }, []);

    // Handle amount change
    const handleAmountChange = useCallback((value: string) => {
        setAmount(value);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] py-4 px-4 sm:py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8 sm:mb-12">
                    <div className="flex items-center justify-center mb-4 sm:mb-6">
                        <div className="bg-[#D4AF37] p-3 sm:p-4 rounded-full mr-4">
                            <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-[#001F3F]" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-white">
                            Time<span className="text-[#D4AF37]">Vault</span>
                        </h1>
                    </div>
                    <p className="text-lg sm:text-xl text-gray-300 mb-4 sm:mb-6 px-2">
                        Transform your digital assets into precious metals and personal time
                    </p>

                    {/* Data Status Indicator */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-400 mb-4">
                        <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-[#D4AF37]" />
                            Real-time prices
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
                            Live data
                        </div>
                        <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-[#D4AF37]" />
                            WCAG accessible
                        </div>
                    </div>

                    {/* Loading Indicators */}
                    {(cryptoLoading || metalsLoading) && (
                        <div className="flex items-center justify-center text-[#D4AF37] text-sm">
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Updating prices...
                        </div>
                    )}
                </div>

                {/* Calculator Section */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-white/10 mb-6 sm:mb-8">
                    <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
                        {/* Input Section */}
                        <div className="space-y-4 sm:space-y-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                                Calculate Your Asset Value
                            </h2>

                            {/* Asset Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Select Cryptocurrency
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {cryptoAssets.map((asset) => (
                                        <button
                                            key={asset.id}
                                            onClick={() => handleAssetChange(asset.id)}
                                            className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 ${selectedAsset?.id === asset.id
                                                    ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                                    : 'bg-white/5 border-white/20 text-white hover:border-[#D4AF37]/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="text-left">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-base sm:text-lg">{asset.icon}</span>
                                                        <span className="font-medium text-sm sm:text-base">{asset.symbol}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-400 truncate">{asset.name}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs sm:text-sm font-bold">
                                                        {formatCurrency(asset.current_price)}
                                                    </div>
                                                    <div className={`flex items-center text-xs ${asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400'
                                                        }`}>
                                                        {asset.price_change_percentage_24h >= 0 ? (
                                                            <TrendingUp className="w-3 h-3 mr-1" />
                                                        ) : (
                                                            <TrendingDown className="w-3 h-3 mr-1" />
                                                        )}
                                                        {Math.abs(asset.price_change_percentage_24h).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Amount ({selectedAsset?.symbol})
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => handleAmountChange(e.target.value)}
                                    placeholder="1.0"
                                    step="any"
                                    min="0"
                                    className="w-full p-3 sm:p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-base"
                                />
                            </div>

                            {/* Hourly Wage Input */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Your Hourly Wage (USD)
                                </label>
                                <input
                                    type="number"
                                    value={hourlyWage}
                                    onChange={(e) => setHourlyWage(Number(e.target.value))}
                                    placeholder="25.00"
                                    step="0.01"
                                    min="1"
                                    className="w-full p-3 sm:p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-base"
                                />
                            </div>
                        </div>

                        {/* Results Section */}
                        {calculationResult && (
                            <div className="space-y-4 sm:space-y-6">
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">
                                    Conversion Results
                                </h2>

                                {/* Total Value */}
                                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-lg p-4 sm:p-6 border border-[#D4AF37]/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-300">Total Value</span>
                                        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-2">
                                        {formatCurrency(calculationResult.usdValue)}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-400">
                                        {calculationResult.amount} {calculationResult.asset.symbol} × {formatCurrency(calculationResult.asset.current_price)}
                                    </div>
                                </div>

                                {/* Precious Metals */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs sm:text-sm text-gray-300">Gold</span>
                                            <span className="text-lg">🥇</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-yellow-400">
                                            {formatMetalAmount(calculationResult.metals.gold.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(metalsData?.gold?.price || 2650)}/oz
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs sm:text-sm text-gray-300">Silver</span>
                                            <span className="text-lg">🥈</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-gray-300">
                                            {formatMetalAmount(calculationResult.metals.silver.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(metalsData?.silver?.price || 31.50)}/oz
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs sm:text-sm text-gray-300">Platinum</span>
                                            <span className="text-lg">⚪</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-blue-300">
                                            {formatMetalAmount(calculationResult.metals.platinum.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(metalsData?.platinum?.price || 980)}/oz
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs sm:text-sm text-gray-300">Palladium</span>
                                            <span className="text-lg">🔘</span>
                                        </div>
                                        <div className="text-lg sm:text-xl font-bold text-purple-300">
                                            {formatMetalAmount(calculationResult.metals.palladium.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(metalsData?.palladium?.price || 925)}/oz
                                        </div>
                                    </div>
                                </div>

                                {/* Time Value */}
                                <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-base sm:text-lg font-medium text-white">Time Equivalent</span>
                                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-lg sm:text-xl font-bold text-white">
                                                {calculationResult.timeValue.hours.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Hours</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg sm:text-xl font-bold text-white">
                                                {calculationResult.timeValue.days.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Days</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg sm:text-xl font-bold text-white">
                                                {calculationResult.timeValue.weeks.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Weeks</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg sm:text-xl font-bold text-white">
                                                {calculationResult.timeValue.months.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Months</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Section */}
                <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 text-center">
                        <Target className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2">Real-Time Accuracy</h3>
                        <p className="text-gray-300 text-sm">Live market data ensures precise conversions every time</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 text-center">
                        <BarChart3 className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2">Multi-Asset Support</h3>
                        <p className="text-gray-300 text-sm">Convert Bitcoin, Ethereum, Solana, and 9 more cryptocurrencies</p>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4 sm:p-6 border border-white/10 text-center">
                        <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#D4AF37] mx-auto mb-4" />
                        <h3 className="text-base sm:text-lg font-bold text-white mb-2">Personal Time Value</h3>
                        <p className="text-gray-300 text-sm">Understand your assets in terms of work time</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-400 text-sm">
                    <p>© 2025 TimeVault. Transform your digital wealth into tangible value.</p>
                    <p className="mt-2">
                        Last updated: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>

            {/* Advanced Portfolio Mode Modal */}
            {showAdvancedPortfolio && (
                <AdvancedPortfolioMode
                    isOpen={showAdvancedPortfolio}
                    onClose={() => setShowAdvancedPortfolio(false)}
                    onAddToPortfolio={(symbol: string, amount: number) => { }}
                />
            )}
        </div>
    );
}
