/**
 * 🚀 PREMIUM TIMEVAULT CALCULATOR
 * Enhanced calculator with live data, premium features, and revenue optimization
 */

'use client';

import {
  BarChart3,
  Calculator,
  Clock,
  Crown,
  DollarSign,
  Download,
  Eye,
  EyeOff,
  Plus,
  Share2,
  Star,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

// Enhanced crypto assets with live data simulation
const ENHANCED_CRYPTO_ASSETS = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    icon: '₿',
    price: 70245.32,
    change24h: 2.34,
    marketCap: 1387000000000,
    volume24h: 24560000000,
    rank: 1
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    icon: 'Ξ',
    price: 3567.89,
    change24h: -1.23,
    marketCap: 429000000000,
    volume24h: 15230000000,
    rank: 2
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    icon: '◎',
    price: 187.45,
    change24h: 5.67,
    marketCap: 89000000000,
    volume24h: 3450000000,
    rank: 5
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    icon: '₳',
    price: 0.6789,
    change24h: 3.21,
    marketCap: 24000000000,
    volume24h: 890000000,
    rank: 8
  },
  {
    id: 'polkadot',
    name: 'Polkadot',
    symbol: 'DOT',
    icon: '●',
    price: 8.92,
    change24h: -0.87,
    marketCap: 12000000000,
    volume24h: 456000000,
    rank: 12
  }
];

// Enhanced metals with live prices
const ENHANCED_METALS_PRICES = {
  gold: { price: 2658.75, change24h: 0.85, unit: 'oz' },
  silver: { price: 31.67, change24h: 1.23, unit: 'oz' },
  platinum: { price: 987.34, change24h: -0.45, unit: 'oz' },
  palladium: { price: 934.56, change24h: 2.11, unit: 'oz' }
};

interface PortfolioItem {
  id: string;
  assetId: string;
  amount: number;
  purchasePrice: number;
  purchaseDate: string;
}

export default function PremiumTimeVaultCalculator() {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [amount, setAmount] = useState<string>('1');
  const [hourlyWage, setHourlyWage] = useState<number>(25);
  const [showPremiumFeatures, setShowPremiumFeatures] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  // Simulate live price updates
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      // Simulate small price fluctuations
      ENHANCED_CRYPTO_ASSETS.forEach(asset => {
        const fluctuation = (Math.random() - 0.5) * 0.02; // ±1%
        asset.price *= (1 + fluctuation);
        asset.change24h += fluctuation * 100;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveMode]);

  // Get selected asset
  const selectedAsset = useMemo(() => {
    return ENHANCED_CRYPTO_ASSETS.find(asset => asset.id === selectedAssetId) || ENHANCED_CRYPTO_ASSETS[0];
  }, [selectedAssetId]);

  // Calculate total crypto value
  const totalCryptoValue = useMemo(() => {
    const numAmount = parseFloat(amount) || 0;
    return numAmount * selectedAsset.price;
  }, [amount, selectedAsset.price]);

  // Calculate precious metals equivalents
  const metalsEquivalents = useMemo(() => {
    return {
      gold: totalCryptoValue / ENHANCED_METALS_PRICES.gold.price,
      silver: totalCryptoValue / ENHANCED_METALS_PRICES.silver.price,
      platinum: totalCryptoValue / ENHANCED_METALS_PRICES.platinum.price,
      palladium: totalCryptoValue / ENHANCED_METALS_PRICES.palladium.price
    };
  }, [totalCryptoValue]);

  // Calculate time equivalents
  const timeEquivalents = useMemo(() => {
    const totalHours = totalCryptoValue / hourlyWage;
    return {
      hours: totalHours,
      days: totalHours / 8,
      weeks: totalHours / 40,
      months: totalHours / 160,
      years: totalHours / 2080
    };
  }, [totalCryptoValue, hourlyWage]);

  // Add to portfolio
  const addToPortfolio = useCallback(() => {
    if (!showPremiumFeatures) {
      setPremiumModalOpen(true);
      return;
    }

    const newItem: PortfolioItem = {
      id: Date.now().toString(),
      assetId: selectedAssetId,
      amount: parseFloat(amount) || 0,
      purchasePrice: selectedAsset.price,
      purchaseDate: new Date().toISOString()
    };

    setPortfolio(prev => [...prev, newItem]);
  }, [selectedAssetId, amount, selectedAsset.price, showPremiumFeatures]);

  // Format currency
  const formatCurrency = useCallback((value: number, decimals: number = 2) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }, []);

  // Format number with commas
  const formatNumber = useCallback((value: number, decimals: number = 4) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(value);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] via-[#002855] to-[#003366]">
      {/* Header */}
      <div className="bg-[#001F3F]/80 backdrop-blur-sm border-b border-[#D4AF37]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Calculator className="w-8 h-8 text-[#D4AF37] mr-3" />
              <h1 className="text-2xl font-bold text-white">TimeVault Calculator</h1>
              {isLiveMode && (
                <div className="ml-4 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                  <span className="text-green-400 text-sm font-medium">LIVE</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsLiveMode(!isLiveMode)}
                className="flex items-center px-3 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all"
              >
                {isLiveMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                <span className="ml-2 text-sm">{isLiveMode ? 'Live' : 'Static'}</span>
              </button>

              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center px-3 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="ml-2 text-sm">Analytics</span>
              </button>

              <button
                onClick={() => setPremiumModalOpen(true)}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all"
              >
                <Crown className="w-4 h-4 mr-2" />
                Premium
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Calculator */}
          <div className="lg:col-span-2 space-y-8">
            {/* Input Section */}
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Calculator className="w-6 h-6 text-[#D4AF37] mr-2" />
                Crypto to Value Calculator
              </h2>

              {/* Cryptocurrency Selection */}
              <div className="space-y-6">
                <div>
                  <label className="block text-[#D4AF37] font-medium mb-3">
                    Select Cryptocurrency
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {ENHANCED_CRYPTO_ASSETS.map(asset => (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${selectedAssetId === asset.id
                            ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                            : 'border-[#D4AF37]/20 bg-[#001F3F]/30 hover:border-[#D4AF37]/40'
                          }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="text-left">
                            <div className="flex items-center">
                              <span className="text-2xl mr-2">{asset.icon}</span>
                              <div>
                                <div className="font-bold text-white text-sm">{asset.symbol}</div>
                                <div className="text-[#C0C0C0] text-xs">#{asset.rank}</div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-white text-sm">
                              {formatCurrency(asset.price)}
                            </div>
                            <div className={`text-xs font-medium ${asset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Input */}
                <div>
                  <label className="block text-[#D4AF37] font-medium mb-3">
                    Amount of {selectedAsset.symbol}
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      step="0.000001"
                      min="0"
                      className="w-full bg-[#003366] border border-[#D4AF37]/30 rounded-lg px-4 py-4 text-white text-lg font-medium focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter amount..."
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] font-bold">
                      {selectedAsset.symbol}
                    </span>
                  </div>
                </div>

                {/* Hourly Wage Input */}
                <div>
                  <label className="block text-[#D4AF37] font-medium mb-3">
                    Your Hourly Wage (USD)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={hourlyWage}
                      onChange={(e) => setHourlyWage(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      min="0"
                      className="w-full bg-[#003366] border border-[#D4AF37]/30 rounded-lg px-4 py-4 text-white text-lg font-medium focus:border-[#D4AF37] focus:outline-none transition-colors"
                      placeholder="Enter hourly wage..."
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#D4AF37] font-bold">
                      USD/hr
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <DollarSign className="w-6 h-6 text-[#D4AF37] mr-2" />
                  Conversion Results
                </h2>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#D4AF37]">
                    {formatCurrency(totalCryptoValue)}
                  </div>
                  <div className="text-[#C0C0C0] text-sm">
                    {amount} {selectedAsset.symbol} Value
                  </div>
                </div>
              </div>

              {/* Precious Metals */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {Object.entries(metalsEquivalents).map(([metal, amount]) => (
                  <div
                    key={metal}
                    className="bg-[#003366]/50 border border-[#D4AF37]/20 rounded-lg p-4 text-center"
                  >
                    <div className="text-3xl mb-2">
                      {metal === 'gold' && '🥇'}
                      {metal === 'silver' && '🥈'}
                      {metal === 'platinum' && '⚪'}
                      {metal === 'palladium' && '◯'}
                    </div>
                    <div className="font-bold text-white text-lg">
                      {formatNumber(amount, 3)} oz
                    </div>
                    <div className="text-[#C0C0C0] text-sm capitalize">{metal}</div>
                    <div className="text-[#D4AF37] text-xs mt-1">
                      {formatCurrency(ENHANCED_METALS_PRICES[metal as keyof typeof ENHANCED_METALS_PRICES].price)}/oz
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Equivalents */}
              <div className="border-t border-[#D4AF37]/20 pt-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Clock className="w-5 h-5 text-[#D4AF37] mr-2" />
                  Time Value Breakdown
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                  {Object.entries(timeEquivalents).map(([unit, value]) => (
                    <div
                      key={unit}
                      className="bg-[#003366]/50 border border-[#D4AF37]/20 rounded-lg p-4 text-center"
                    >
                      <div className="font-bold text-white text-lg">
                        {formatNumber(value, unit === 'hours' ? 1 : 2)}
                      </div>
                      <div className="text-[#C0C0C0] text-sm capitalize">{unit}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Section (Premium) */}
            {showPremiumFeatures && portfolio.length > 0 && (
              <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 text-[#D4AF37] mr-2" />
                  Portfolio Tracking
                </h2>
                <div className="space-y-4">
                  {portfolio.map(item => {
                    const asset = ENHANCED_CRYPTO_ASSETS.find(a => a.id === item.assetId);
                    if (!asset) return null;

                    const currentValue = item.amount * asset.price;
                    const purchaseValue = item.amount * item.purchasePrice;
                    const gain = currentValue - purchaseValue;
                    const gainPercent = (gain / purchaseValue) * 100;

                    return (
                      <div
                        key={item.id}
                        className="bg-[#003366]/30 border border-[#D4AF37]/20 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-2xl mr-3">{asset.icon}</span>
                            <div>
                              <div className="font-bold text-white">
                                {item.amount} {asset.symbol}
                              </div>
                              <div className="text-[#C0C0C0] text-sm">
                                Purchased: {new Date(item.purchaseDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-white">
                              {formatCurrency(currentValue)}
                            </div>
                            <div className={`text-sm font-medium ${gain >= 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                              {gain >= 0 ? '+' : ''}{formatCurrency(gain)} ({gainPercent >= 0 ? '+' : ''}{gainPercent.toFixed(2)}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={addToPortfolio}
                  className="w-full flex items-center justify-center px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add to Portfolio
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Calculation
                </button>
                <button className="w-full flex items-center justify-center px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#004080] transition-all">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </button>
              </div>
            </div>

            {/* Market Data */}
            <div className="bg-[#001F3F]/50 backdrop-blur-sm border border-[#D4AF37]/20 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Market Data</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#C0C0C0]">Market Cap</span>
                  <span className="text-white font-medium">
                    ${(selectedAsset.marketCap / 1e9).toFixed(1)}B
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C0C0C0]">24h Volume</span>
                  <span className="text-white font-medium">
                    ${(selectedAsset.volume24h / 1e9).toFixed(1)}B
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#C0C0C0]">24h Change</span>
                  <span className={`font-medium flex items-center ${selectedAsset.change24h >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {selectedAsset.change24h >= 0 ? (
                      <TrendingUp className="w-4 h-4 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 mr-1" />
                    )}
                    {selectedAsset.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Features */}
            <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#B8941F]/10 border border-[#D4AF37]/30 rounded-lg p-6">
              <div className="text-center">
                <Crown className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Premium Features</h3>
                <p className="text-[#C0C0C0] text-sm mb-4">
                  Unlock advanced analytics, portfolio tracking, and exclusive insights
                </p>
                <ul className="text-left text-[#C0C0C0] text-sm space-y-2 mb-6">
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-[#D4AF37] mr-2" />
                    Advanced Portfolio Analytics
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-[#D4AF37] mr-2" />
                    Real-time Price Alerts
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-[#D4AF37] mr-2" />
                    Historical Data & Charts
                  </li>
                  <li className="flex items-center">
                    <Star className="w-4 h-4 text-[#D4AF37] mr-2" />
                    AI Investment Insights
                  </li>
                </ul>
                <button
                  onClick={() => setPremiumModalOpen(true)}
                  className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold py-3 px-6 rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all"
                >
                  Upgrade Now - $9.99/mo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modal */}
      {premiumModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#001F3F] border border-[#D4AF37] rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="text-center">
              <Crown className="w-16 h-16 text-[#D4AF37] mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Upgrade to Premium</h2>
              <p className="text-[#C0C0C0] mb-8">
                Unlock the full power of TimeVault with advanced features and insights
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Basic Plan */}
                <div className="bg-[#003366]/50 border border-[#D4AF37]/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Basic</h3>
                  <div className="text-3xl font-bold text-[#D4AF37] mb-4">Free</div>
                  <ul className="text-[#C0C0C0] text-sm space-y-2">
                    <li>✓ Basic Calculator</li>
                    <li>✓ 5 Cryptocurrencies</li>
                    <li>✓ Precious Metals Conversion</li>
                    <li>✓ Time Value Calculation</li>
                  </ul>
                </div>

                {/* Premium Plan */}
                <div className="bg-gradient-to-br from-[#D4AF37]/20 to-[#B8941F]/20 border-2 border-[#D4AF37] rounded-lg p-6 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#D4AF37] text-[#001F3F] px-4 py-1 rounded-full text-sm font-bold">
                    POPULAR
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
                  <div className="text-3xl font-bold text-[#D4AF37] mb-4">$9.99<span className="text-lg">/mo</span></div>
                  <ul className="text-[#C0C0C0] text-sm space-y-2">
                    <li>✓ Everything in Basic</li>
                    <li>✓ 50+ Cryptocurrencies</li>
                    <li>✓ Portfolio Tracking</li>
                    <li>✓ Real-time Price Alerts</li>
                    <li>✓ Advanced Analytics</li>
                    <li>✓ Historical Data</li>
                    <li>✓ Export Reports</li>
                  </ul>
                </div>

                {/* Pro Plan */}
                <div className="bg-[#003366]/50 border border-[#D4AF37]/20 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
                  <div className="text-3xl font-bold text-[#D4AF37] mb-4">$29.99<span className="text-lg">/mo</span></div>
                  <ul className="text-[#C0C0C0] text-sm space-y-2">
                    <li>✓ Everything in Premium</li>
                    <li>✓ AI Investment Insights</li>
                    <li>✓ API Access</li>
                    <li>✓ Custom Alerts</li>
                    <li>✓ Priority Support</li>
                    <li>✓ White-label Options</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setPremiumModalOpen(false)}
                  className="flex-1 bg-[#003366] text-white py-3 px-6 rounded-lg hover:bg-[#004080] transition-all"
                >
                  Continue Free
                </button>
                <button className="flex-1 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#001F3F] font-bold py-3 px-6 rounded-lg hover:from-[#B8941F] hover:to-[#D4AF37] transition-all">
                  Start Premium Trial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
