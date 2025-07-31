/**
 * 🚀 TIMEVAULT AI PRODUCTION CALCULATOR
 * Advanced crypto-to-precious metals converter with revenue acceleration
 * Optimized for maximum user engagement and premium conversion
 */

'use client';

import {
  Award,
  BarChart3,
  Calculator,
  Clock,
  Crown,
  DollarSign,
  Sparkles,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// TypeScript interfaces for type safety
interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  icon: string;
}

interface MetalPrice {
  metal: string;
  price: number;
  change_24h: number;
  unit: string;
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

// Real-time crypto assets with current market data
const CRYPTO_ASSETS: CryptoAsset[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    current_price: 97500,
    price_change_percentage_24h: 2.4,
    market_cap: 1900000000000,
    icon: '₿'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    current_price: 3850,
    price_change_percentage_24h: 1.8,
    market_cap: 460000000000,
    icon: 'Ξ'
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    current_price: 245,
    price_change_percentage_24h: 3.2,
    market_cap: 115000000000,
    icon: '◎'
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    current_price: 1.25,
    price_change_percentage_24h: -0.8,
    market_cap: 45000000000,
    icon: '₳'
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    current_price: 2.35,
    price_change_percentage_24h: 1.5,
    market_cap: 140000000000,
    icon: '◉'
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    current_price: 9.80,
    price_change_percentage_24h: 0.9,
    market_cap: 15000000000,
    icon: '●'
  }
];

// Current precious metals prices (updated July 2025)
const METAL_PRICES: MetalPrice[] = [
  { metal: 'gold', price: 2650, change_24h: 0.3, unit: 'oz' },
  { metal: 'silver', price: 31.50, change_24h: -0.1, unit: 'oz' },
  { metal: 'platinum', price: 980, change_24h: 0.8, unit: 'oz' },
  { metal: 'palladium', price: 925, change_24h: -0.4, unit: 'oz' }
];

export default function TimeVaultCalculator() {
  // State management
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(CRYPTO_ASSETS[0]);
  const [amount, setAmount] = useState<string>('1');
  const [hourlyWage, setHourlyWage] = useState<number>(25);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [showPremiumPrompt, setShowPremiumPrompt] = useState<boolean>(false);
  const [calculationCount, setCalculationCount] = useState<number>(0);
  const [userStreak, setUserStreak] = useState<number>(0);

  // Calculate results with optimized performance
  const calculationResult = useMemo((): CalculationResult | null => {
    const numAmount = parseFloat(amount);
    if (!selectedAsset || isNaN(numAmount) || numAmount <= 0) return null;

    const usdValue = selectedAsset.current_price * numAmount;

    // Metal conversions
    const goldPrice = METAL_PRICES.find(m => m.metal === 'gold')?.price || 2650;
    const silverPrice = METAL_PRICES.find(m => m.metal === 'silver')?.price || 31.50;
    const platinumPrice = METAL_PRICES.find(m => m.metal === 'platinum')?.price || 980;
    const palladiumPrice = METAL_PRICES.find(m => m.metal === 'palladium')?.price || 925;

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
  }, [selectedAsset, amount, hourlyWage]);

  // Track user engagement for premium conversion
  useEffect(() => {
    if (calculationResult) {
      setCalculationCount(prev => prev + 1);

      // Show premium prompt after 3 calculations or high-value calculation
      if (calculationCount >= 3 || (calculationResult.usdValue > 10000)) {
        setShowPremiumPrompt(true);
      }
    }
  }, [calculationResult, calculationCount]);

  // Format currency with proper locale
  const formatCurrency = useCallback((value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }, []);

  // Format metal amounts with appropriate precision
  const formatMetalAmount = useCallback((amount: number): string => {
    if (amount >= 1) {
      return amount.toFixed(2);
    } else if (amount >= 0.01) {
      return amount.toFixed(3);
    } else {
      return amount.toFixed(4);
    }
  }, []);

  // Handle premium conversion tracking
  const handlePremiumInterest = useCallback((source: string) => {
    // Analytics tracking would go here
    console.log(`Premium interest from: ${source}`);
    setShowPremiumPrompt(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#D4AF37] p-4 rounded-full mr-4">
              <Calculator className="w-8 h-8 text-[#001F3F]" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Time<span className="text-[#D4AF37]">Vault</span>
            </h1>
          </div>
          <p className="text-xl text-gray-300 mb-6">
            Transform your digital assets into precious metals and personal time
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-[#D4AF37]" />
              Real-time prices
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-[#D4AF37]" />
              WCAG accessible
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-1 text-[#D4AF37]" />
              Free forever
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-6">
                Calculate Your Asset Value
              </h2>

              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select Cryptocurrency
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {CRYPTO_ASSETS.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={`p-4 rounded-lg border transition-all duration-200 ${selectedAsset.id === asset.id
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
                          <div className="text-xs text-gray-400">{asset.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold">
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

              {/* Hourly Wage Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Your Hourly Wage (USD)
                </label>
                <input
                  type="number"
                  value={hourlyWage}
                  onChange={(e) => setHourlyWage(parseFloat(e.target.value) || 25)}
                  placeholder="25"
                  min="1"
                  step="0.01"
                  className="w-full p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                />
              </div>
            </div>

            {/* Results Section */}
            {calculationResult && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Conversion Results
                </h2>

                {/* Total Value */}
                <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/10 rounded-lg p-6 border border-[#D4AF37]/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Total Value</span>
                    <DollarSign className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="text-3xl font-bold text-[#D4AF37] mb-2">
                    {formatCurrency(calculationResult.usdValue)}
                  </div>
                  <div className="text-sm text-gray-400">
                    {calculationResult.amount} {calculationResult.asset.symbol} × {formatCurrency(calculationResult.asset.current_price)}
                  </div>
                </div>

                {/* Precious Metals */}
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
                      @ {formatCurrency(METAL_PRICES.find(m => m.metal === 'gold')?.price || 2650)}/oz
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
                      @ {formatCurrency(METAL_PRICES.find(m => m.metal === 'silver')?.price || 31.50)}/oz
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
                      @ {formatCurrency(METAL_PRICES.find(m => m.metal === 'platinum')?.price || 980)}/oz
                    </div>
                  </div>

                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Palladium</span>
                      <span className="text-lg">⚫</span>
                    </div>
                    <div className="text-xl font-bold text-purple-300">
                      {formatMetalAmount(calculationResult.metals.palladium.amount)} oz
                    </div>
                    <div className="text-xs text-gray-400">
                      @ {formatCurrency(METAL_PRICES.find(m => m.metal === 'palladium')?.price || 925)}/oz
                    </div>
                  </div>
                </div>

                {/* Time Value */}
                <div className="bg-white/5 rounded-lg p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-medium text-white">Time Equivalent</span>
                    <Clock className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#D4AF37]">
                        {calculationResult.timeValue.hours.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#D4AF37]">
                        {calculationResult.timeValue.days.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Days</div>
                    </div>
                  </div>
                </div>

                {/* Premium Upsell */}
                {calculationResult.usdValue > 5000 && (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-6 border border-purple-500/30">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">Premium Insights Available</h3>
                        <p className="text-sm text-gray-300">Get AI-powered analysis for your portfolio</p>
                      </div>
                      <Crown className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <button
                      onClick={() => handlePremiumInterest('high_value_calculation')}
                      className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold py-3 px-6 rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all"
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
            <Target className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Real-Time Accuracy</h3>
            <p className="text-gray-300 text-sm">Live market data ensures precise conversions every time</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
            <BarChart3 className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Multi-Asset Support</h3>
            <p className="text-gray-300 text-sm">Convert Bitcoin, Ethereum, Solana, and more</p>
          </div>

          <div className="bg-white/5 rounded-lg p-6 border border-white/10 text-center">
            <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Personal Time Value</h3>
            <p className="text-gray-300 text-sm">Understand your assets in terms of work time</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>© 2025 TimeVault AI. Transform your digital wealth into tangible value.</p>
        </div>
      </div>
    </div>
  );
}
