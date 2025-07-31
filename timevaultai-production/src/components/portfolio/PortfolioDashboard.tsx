'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart, Activity, ArrowRight } from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  value: number;
  change24h: number;
  icon: string;
}

const PortfolioDashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [totalChange, setTotalChange] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate portfolio data - integrate with real wallet/API later
    const mockAssets: Asset[] = [
      { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC', amount: 0.5, value: 35122.50, change24h: 2.34, icon: '₿' },
      { id: 'ethereum', name: 'Ethereum', symbol: 'ETH', amount: 2.1, value: 7492.67, change24h: -1.23, icon: 'Ξ' },
      { id: 'gold', name: 'Gold', symbol: 'XAU', amount: 5.2, value: 10140.80, change24h: 0.87, icon: '🥇' },
      { id: 'silver', name: 'Silver', symbol: 'XAG', amount: 100, value: 2890.00, change24h: 1.45, icon: '🥈' }
    ];
    
    setAssets(mockAssets);
    setTotalValue(mockAssets.reduce((sum, asset) => sum + asset.value, 0));
    setTotalChange(mockAssets.reduce((sum, asset) => sum + (asset.value * asset.change24h / 100), 0));
    setIsLoading(false);
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const changePercentage = (totalChange / totalValue) * 100;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4AF37]"></div>
        <span className="ml-3 text-gray-600">Loading your portfolio...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Portfolio Overview */}
      <div className="bg-gradient-to-r from-[#001F3F] to-[#003366] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Portfolio Overview</h2>
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#D4AF37] animate-pulse" />
            <span className="text-sm text-gray-300">Live Data</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Total Value</span>
              <DollarSign className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="text-3xl font-bold">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-gray-400 mt-1">Across {assets.length} assets</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">24h Change</span>
              {totalChange >= 0 ? (
                <TrendingUp className="w-6 h-6 text-green-400" />
              ) : (
                <TrendingDown className="w-6 h-6 text-red-400" />
              )}
            </div>
            <div className={`text-3xl font-bold ${totalChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalChange >= 0 ? '+' : ''}{formatCurrency(totalChange)}
            </div>
            <div className={`text-sm mt-1 ${totalChange >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {totalChange >= 0 ? '+' : ''}{changePercentage.toFixed(2)}%
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-300">Diversification</span>
              <PieChart className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <div className="text-3xl font-bold">{assets.length}</div>
            <div className="text-sm text-gray-400 mt-1">Asset classes</div>
          </div>
        </div>
      </div>

      {/* Asset List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Your Assets</h3>
          <p className="text-sm text-gray-600 mt-1">Real-time valuations and performance tracking</p>
        </div>
        
        <div className="divide-y divide-gray-200">
          {assets.map((asset) => (
            <div key={asset.id} className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-3xl bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                    {asset.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{asset.name}</div>
                    <div className="text-sm text-gray-500">{asset.amount} {asset.symbol}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-bold text-gray-900 text-lg">{formatCurrency(asset.value)}</div>
                  <div className={`text-sm font-medium ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Upgrade CTA */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#B8941F] rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">🚀 Unlock Premium Portfolio Features</h3>
            <p className="text-white/90 mb-4">Get advanced analytics, AI-powered insights, real-time alerts, and exclusive TVLT rewards</p>
            <ul className="text-sm text-white/80 space-y-1">
              <li>• Advanced portfolio analytics & risk assessment</li>
              <li>• AI-powered investment recommendations</li>
              <li>• Real-time price alerts & market notifications</li>
              <li>• Exclusive educational NFT badges & TVLT rewards</li>
            </ul>
          </div>
          <div className="ml-6">
            <button className="bg-white text-[#D4AF37] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center space-x-2 shadow-lg">
              <span>Upgrade Now</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="text-center mt-2 text-xs text-white/70">Starting at $29/month</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="bg-[#001F3F] text-white p-4 rounded-lg hover:bg-[#003366] transition-colors">
          <BarChart3 className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
          <div className="font-semibold">View Analytics</div>
          <div className="text-xs text-gray-300 mt-1">Detailed performance insights</div>
        </button>
        
        <button className="bg-[#001F3F] text-white p-4 rounded-lg hover:bg-[#003366] transition-colors">
          <Activity className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
          <div className="font-semibold">Set Alerts</div>
          <div className="text-xs text-gray-300 mt-1">Price & trend notifications</div>
        </button>
        
        <button className="bg-[#001F3F] text-white p-4 rounded-lg hover:bg-[#003366] transition-colors">
          <PieChart className="w-6 h-6 mx-auto mb-2 text-[#D4AF37]" />
          <div className="font-semibold">Rebalance</div>
          <div className="text-xs text-gray-300 mt-1">Optimize allocation</div>
        </button>
      </div>
    </div>
  );
};

export default PortfolioDashboard;
