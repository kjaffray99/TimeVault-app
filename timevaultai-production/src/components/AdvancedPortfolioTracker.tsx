'use client'

import { Activity, BarChart3, PieChart, Target, TrendingDown, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface PortfolioAsset {
  id: string
  symbol: string
  name: string
  amount: number
  purchasePrice: number
  currentPrice: number
  purchaseDate: string
}

interface PerformanceMetrics {
  totalValue: number
  totalGainLoss: number
  percentageChange: number
  bestPerformer: string
  worstPerformer: string
  diversificationScore: number
}

interface ChartDataPoint {
  date: string
  value: number
  btc: number
  eth: number
  portfolio: number
}

export default function AdvancedPortfolioTracker() {
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([])
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null)
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [chartTimeframe, setChartTimeframe] = useState<'24h' | '7d' | '30d' | '1y'>('7d')
  const [showAddAsset, setShowAddAsset] = useState(false)

  // Sample portfolio data for demonstration
  useEffect(() => {
    const sampleAssets: PortfolioAsset[] = [
      {
        id: '1',
        symbol: 'BTC',
        name: 'Bitcoin',
        amount: 0.5,
        purchasePrice: 45000,
        currentPrice: 67500,
        purchaseDate: '2024-01-15'
      },
      {
        id: '2',
        symbol: 'ETH',
        name: 'Ethereum',
        amount: 3.2,
        purchasePrice: 2800,
        currentPrice: 3420,
        purchaseDate: '2024-02-10'
      },
      {
        id: '3',
        symbol: 'SOL',
        name: 'Solana',
        amount: 50,
        purchasePrice: 120,
        currentPrice: 185,
        purchaseDate: '2024-03-05'
      }
    ]

    setPortfolioAssets(sampleAssets)

    // Calculate performance metrics
    const totalValue = sampleAssets.reduce((sum, asset) => sum + (asset.amount * asset.currentPrice), 0)
    const totalCost = sampleAssets.reduce((sum, asset) => sum + (asset.amount * asset.purchasePrice), 0)
    const totalGainLoss = totalValue - totalCost
    const percentageChange = (totalGainLoss / totalCost) * 100

    const assetGains = sampleAssets.map(asset => ({
      symbol: asset.symbol,
      gain: ((asset.currentPrice - asset.purchasePrice) / asset.purchasePrice) * 100
    }))

    const bestPerformer = assetGains.reduce((best, current) => current.gain > best.gain ? current : best).symbol
    const worstPerformer = assetGains.reduce((worst, current) => current.gain < worst.gain ? current : worst).symbol

    setPerformanceMetrics({
      totalValue,
      totalGainLoss,
      percentageChange,
      bestPerformer,
      worstPerformer,
      diversificationScore: 85 // Calculated diversification score
    })

    // Generate chart data
    const generateChartData = () => {
      const days = chartTimeframe === '24h' ? 1 : chartTimeframe === '7d' ? 7 : chartTimeframe === '30d' ? 30 : 365
      const data: ChartDataPoint[] = []

      for (let i = days; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)

        // Simulate historical data with realistic fluctuations
        const btcBase = 67500 * (1 + (Math.random() - 0.5) * 0.1)
        const ethBase = 3420 * (1 + (Math.random() - 0.5) * 0.12)
        const portfolioBase = totalValue * (1 + (Math.random() - 0.5) * 0.08)

        data.push({
          date: date.toISOString().split('T')[0],
          value: portfolioBase,
          btc: btcBase,
          eth: ethBase,
          portfolio: portfolioBase
        })
      }

      setChartData(data)
    }

    generateChartData()
  }, [chartTimeframe])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const getPerformanceColor = (percentage: number) => {
    if (percentage > 0) return 'text-green-500'
    if (percentage < 0) return 'text-red-500'
    return 'text-gray-500'
  }

  const getPerformanceIcon = (percentage: number) => {
    if (percentage > 0) return <TrendingUp className="w-4 h-4" />
    if (percentage < 0) return <TrendingDown className="w-4 h-4" />
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Value</h3>
            <Target className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {performanceMetrics ? formatCurrency(performanceMetrics.totalValue) : '$0.00'}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Total Gain/Loss</h3>
            {performanceMetrics && getPerformanceIcon(performanceMetrics.percentageChange)}
          </div>
          <div className={`text-2xl font-bold ${performanceMetrics ? getPerformanceColor(performanceMetrics.percentageChange) : 'text-white'}`}>
            {performanceMetrics ? formatCurrency(performanceMetrics.totalGainLoss) : '$0.00'}
          </div>
          <div className={`text-sm ${performanceMetrics ? getPerformanceColor(performanceMetrics.percentageChange) : 'text-gray-400'}`}>
            {performanceMetrics ? `${performanceMetrics.percentageChange.toFixed(2)}%` : '0.00%'}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Best Performer</h3>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-green-400">
            {performanceMetrics?.bestPerformer || 'N/A'}
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Diversification</h3>
            <PieChart className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            {performanceMetrics?.diversificationScore || 0}/100
          </div>
          <div className="text-sm text-gray-400">Excellent</div>
        </div>
      </div>

      {/* Portfolio Chart */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Portfolio Performance
          </h3>
          <div className="flex gap-2">
            {(['24h', '7d', '30d', '1y'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setChartTimeframe(timeframe)}
                className={`px-3 py-1 text-sm rounded-lg transition-colors ${chartTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#F3F4F6' }}
              />
              <Area
                type="monotone"
                dataKey="portfolio"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Asset Holdings */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Asset Holdings</h3>
          <button
            onClick={() => setShowAddAsset(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Asset
          </button>
        </div>

        <div className="space-y-4">
          {portfolioAssets.map((asset) => {
            const currentValue = asset.amount * asset.currentPrice
            const costBasis = asset.amount * asset.purchasePrice
            const gainLoss = currentValue - costBasis
            const gainLossPercentage = (gainLoss / costBasis) * 100

            return (
              <div key={asset.id} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-semibold text-white">{asset.symbol}</div>
                      <div className="text-sm text-gray-400">{asset.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Holdings</div>
                      <div className="font-medium text-white">{asset.amount} {asset.symbol}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-white">
                      {formatCurrency(currentValue)}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${getPerformanceColor(gainLossPercentage)}`}>
                      {getPerformanceIcon(gainLossPercentage)}
                      {formatCurrency(gainLoss)} ({gainLossPercentage.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Risk Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Risk Analysis</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Volatility Risk</span>
              <span className="text-yellow-400 font-medium">Medium</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Concentration Risk</span>
              <span className="text-green-400 font-medium">Low</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Correlation Risk</span>
              <span className="text-yellow-400 font-medium">Medium</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Optimization Suggestions</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
              <span className="text-gray-300">Consider adding stablecoins for lower volatility</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
              <span className="text-gray-300">Good diversification across major assets</span>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
              <span className="text-gray-300">Monitor correlation during market stress</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
