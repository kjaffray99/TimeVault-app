/**
 * 🎯 CLEAN TIMEVAULT CALCULATOR - NO INTERFERENCE
 * Simple, direct calculator with zero overlay components
 * Completely isolated from all revenue and engagement systems
 */

'use client';

import { Calculator, Clock, DollarSign } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Import comprehensive cleanup utility
import { comprehensiveCleanup } from '../utils/debugCleanup';

// Simple crypto assets for testing
const SIMPLE_CRYPTO_ASSETS = [
    { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', icon: '₿', price: 70000 },
    { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', icon: 'Ξ', price: 3500 },
    { id: 'solana', name: 'Solana', symbol: 'SOL', icon: '◎', price: 180 }
];

// Simple metals prices for testing
const SIMPLE_METALS_PRICES = {
    gold: 2650,
    silver: 31.50,
    platinum: 980,
    palladium: 925
};

export default function CleanTimeVaultCalculator() {
    const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
    const [amount, setAmount] = useState<string>('1');
    const [hourlyWage, setHourlyWage] = useState<number>(25);

    // Clean up any debug overlays on component mount
    useEffect(() => {
        console.log('🧹 CleanTimeVaultCalculator: Initializing debug cleanup...');
        comprehensiveCleanup();

        // Additional cleanup after a short delay
        const cleanupTimer = setTimeout(() => {
            comprehensiveCleanup();
        }, 1000);

        return () => clearTimeout(cleanupTimer);
    }, []);

    // Get selected asset
    const selectedAsset = useMemo(() => {
        return SIMPLE_CRYPTO_ASSETS.find(asset => asset.id === selectedAssetId) || SIMPLE_CRYPTO_ASSETS[0];
    }, [selectedAssetId]);

    // Calculate results
    const calculationResult = useMemo(() => {
        const numAmount = parseFloat(amount);
        if (!selectedAsset || isNaN(numAmount) || numAmount <= 0) return null;

        const usdValue = selectedAsset.price * numAmount;
        const totalHours = usdValue / hourlyWage;

        return {
            asset: selectedAsset,
            amount: numAmount,
            usdValue,
            metals: {
                gold: { amount: usdValue / SIMPLE_METALS_PRICES.gold, unit: 'oz' },
                silver: { amount: usdValue / SIMPLE_METALS_PRICES.silver, unit: 'oz' },
                platinum: { amount: usdValue / SIMPLE_METALS_PRICES.platinum, unit: 'oz' },
                palladium: { amount: usdValue / SIMPLE_METALS_PRICES.palladium, unit: 'oz' }
            },
            timeValue: {
                hours: totalHours,
                days: totalHours / 8,
                weeks: totalHours / 40,
                months: totalHours / 160
            }
        };
    }, [selectedAsset, amount, hourlyWage]);

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
        if (amount >= 1) return amount.toFixed(2);
        if (amount >= 0.01) return amount.toFixed(3);
        return amount.toFixed(4);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] py-8 px-4">
            <div className="max-w-6xl mx-auto">

                {/* CLEAN HEADER - NO INTERFERENCE */}
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center mb-6">
                        <div className="bg-[#D4AF37] p-4 rounded-full mr-4">
                            <Calculator className="w-8 h-8 text-[#001F3F]" />
                        </div>
                        <h1 className="text-6xl font-bold text-white">
                            Time<span className="text-[#D4AF37]">Vault</span>
                        </h1>
                    </div>
                    <p className="text-xl text-gray-300">
                        Transform your digital assets into precious metals and personal time
                    </p>
                </div>

                {/* CLEAN CALCULATOR - NO OVERLAYS */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
                    <div className="grid lg:grid-cols-2 gap-8">

                        {/* Input Section */}
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-white mb-6">
                                Calculate Your Asset Value
                            </h2>

                            {/* Asset Selection - SIMPLE CLEAN GRID */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Select Cryptocurrency
                                </label>
                                <div className="space-y-3">
                                    {SIMPLE_CRYPTO_ASSETS.map((asset) => (
                                        <button
                                            key={asset.id}
                                            onClick={() => setSelectedAssetId(asset.id)}
                                            className={`w-full p-4 rounded-lg border transition-all duration-200 ${selectedAsset.id === asset.id
                                                ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                                                : 'bg-white/5 border-white/20 text-white hover:border-[#D4AF37]/50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="text-left">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-lg">{asset.icon}</span>
                                                        <span className="font-medium">{asset.symbol}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-400">{asset.name}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-bold">
                                                        {formatCurrency(asset.price)}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Amount Input - CLEAN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">
                                    Amount ({selectedAsset.symbol})
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="1.0"
                                    step="any"
                                    min="0"
                                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                />
                            </div>

                            {/* Hourly Wage Input - CLEAN */}
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
                                    className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                                />
                            </div>
                        </div>

                        {/* Results Section - CLEAN DISPLAY */}
                        {calculationResult && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-white mb-6">
                                    Conversion Results
                                </h2>

                                {/* Total Value - CLEAN */}
                                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-lg p-6 border border-[#D4AF37]/30">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-300">Total Value</span>
                                        <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                                        {formatCurrency(calculationResult.usdValue)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {calculationResult.amount} {calculationResult.asset.symbol} × {formatCurrency(calculationResult.asset.price)}
                                    </div>
                                </div>

                                {/* Precious Metals - CLEAN GRID */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-300">Gold</span>
                                            <span className="text-lg">🥇</span>
                                        </div>
                                        <div className="text-xl font-bold text-yellow-400">
                                            {formatMetalAmount(calculationResult.metals.gold.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(SIMPLE_METALS_PRICES.gold)}/oz
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-300">Silver</span>
                                            <span className="text-lg">🥈</span>
                                        </div>
                                        <div className="text-xl font-bold text-gray-300">
                                            {formatMetalAmount(calculationResult.metals.silver.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(SIMPLE_METALS_PRICES.silver)}/oz
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-300">Platinum</span>
                                            <span className="text-lg">⚪</span>
                                        </div>
                                        <div className="text-xl font-bold text-blue-300">
                                            {formatMetalAmount(calculationResult.metals.platinum.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(SIMPLE_METALS_PRICES.platinum)}/oz
                                        </div>
                                    </div>

                                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm text-gray-300">Palladium</span>
                                            <span className="text-lg">🔘</span>
                                        </div>
                                        <div className="text-xl font-bold text-purple-300">
                                            {formatMetalAmount(calculationResult.metals.palladium.amount)} oz
                                        </div>
                                        <div className="text-xs text-gray-400">
                                            @ {formatCurrency(SIMPLE_METALS_PRICES.palladium)}/oz
                                        </div>
                                    </div>
                                </div>

                                {/* Time Value - CLEAN */}
                                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-lg font-medium text-white">Time Equivalent</span>
                                        <Clock className="w-5 h-5 text-[#D4AF37]" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
                                                {calculationResult.timeValue.hours.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Hours</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
                                                {calculationResult.timeValue.days.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Days</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
                                                {calculationResult.timeValue.weeks.toFixed(1)}
                                            </div>
                                            <div className="text-xs text-gray-400">Weeks</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xl font-bold text-white">
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

                {/* CLEAN FOOTER - NO INTERFERENCE */}
                <div className="text-center text-gray-400 text-sm">
                    <p>© 2025 TimeVault. Transform your digital wealth into tangible value.</p>
                </div>
            </div>
        </div>
    );
}
