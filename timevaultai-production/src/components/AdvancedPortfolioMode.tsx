import React, { useState } from 'react'
import { useAdvancedCalculations } from '../hooks/useAdvancedCalculations'
import { useEnhancedApiIntegration } from '../hooks/useEnhancedApiIntegration'

interface AdvancedPortfolioModeProps {
  isOpen: boolean
  onClose: () => void
  onAddToPortfolio: (symbol: string, amount: number) => void
}

export const AdvancedPortfolioMode: React.FC<AdvancedPortfolioModeProps> = ({
  isOpen,
  onClose,
  onAddToPortfolio
}) => {
  const {
    portfolioAssets,
    calculatePortfolioMetrics,
    removeFromPortfolio,
    clearPortfolio,
    calculateDollarCostAveraging,
    calculateWageComparisons
  } = useAdvancedCalculations()

  const { cryptoPrices, metalsPrices } = useEnhancedApiIntegration()

  const [selectedAsset, setSelectedAsset] = useState('')
  const [assetAmount, setAssetAmount] = useState('')
  const [dcaAmount, setDcaAmount] = useState('100')
  const [dcaWeeks, setDcaWeeks] = useState('52')
  const [showDCA, setShowDCA] = useState(false)
  const [showWageComparison, setShowWageComparison] = useState(false)
  const [selectedAssetForAnalysis, setSelectedAssetForAnalysis] = useState('')

  const portfolioMetrics = calculatePortfolioMetrics(portfolioAssets)

  // Available assets for portfolio
  const availableAssets = [
    ...Object.entries(cryptoPrices).map(([symbol, data]) => ({
      symbol,
      name: data.name,
      price: data.current_price,
      change24h: data.price_change_percentage_24h || 0
    })),
    ...Object.entries(metalsPrices).map(([symbol, price]) => ({
      symbol: symbol.toUpperCase(),
      name: symbol.charAt(0).toUpperCase() + symbol.slice(1),
      price: price,
      change24h: Math.random() * 4 - 2 // Simulated for metals
    }))
  ]

  const handleAddAsset = () => {
    const asset = availableAssets.find(a => a.symbol === selectedAsset)
    if (asset && assetAmount && parseFloat(assetAmount) > 0) {
      onAddToPortfolio(asset.symbol, parseFloat(assetAmount))
      setSelectedAsset('')
      setAssetAmount('')
    }
  }

  const dcaResults = selectedAssetForAnalysis ?
    calculateDollarCostAveraging(
      parseFloat(dcaAmount) || 100,
      availableAssets.find(a => a.symbol === selectedAssetForAnalysis)?.price || 0,
      parseInt(dcaWeeks) || 52
    ) : null

  const wageComparisons = selectedAssetForAnalysis ?
    calculateWageComparisons(
      availableAssets.find(a => a.symbol === selectedAssetForAnalysis)?.price || 0
    ) : []

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Portfolio Analysis</h2>
              <p className="text-gray-600 mt-1">Multi-asset calculations, DCA analysis, and global wage comparisons</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Portfolio Overview */}
          {portfolioAssets.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Portfolio Overview</h3>
                <button
                  onClick={clearPortfolio}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Clear Portfolio
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Total Value</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${portfolioMetrics.totalValue.toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">24h Change</div>
                  <div className={`text-2xl font-bold ${portfolioMetrics.totalChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {portfolioMetrics.totalChange24h >= 0 ? '+' : ''}{portfolioMetrics.totalChange24h.toFixed(2)}%
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Diversification</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {portfolioMetrics.diversificationScore}/100
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600">Risk Level</div>
                  <div className={`text-2xl font-bold ${portfolioMetrics.riskLevel === 'Low' ? 'text-green-600' :
                      portfolioMetrics.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                    {portfolioMetrics.riskLevel}
                  </div>
                </div>
              </div>

              {/* Portfolio Assets */}
              <div className="space-y-3">
                {portfolioAssets.map((asset, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {asset.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{asset.name}</div>
                        <div className="text-sm text-gray-600">
                          {asset.amount} {asset.symbol} • {asset.allocation}% allocation
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900">
                        ${asset.value.toLocaleString()}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${asset.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {asset.priceChange24h >= 0 ? '+' : ''}{asset.priceChange24h.toFixed(2)}%
                        </span>
                        <button
                          onClick={() => removeFromPortfolio(asset.symbol)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Asset to Portfolio */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Asset to Portfolio</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Asset</label>
                <select
                  value={selectedAsset}
                  onChange={(e) => setSelectedAsset(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose an asset...</option>
                  {availableAssets.map(asset => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.name} ({asset.symbol}) - ${asset.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  value={assetAmount}
                  onChange={(e) => setAssetAmount(e.target.value)}
                  placeholder="Enter amount..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleAddAsset}
                  disabled={!selectedAsset || !assetAmount}
                  className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add to Portfolio
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Analysis Tabs */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  onClick={() => { setShowDCA(true); setShowWageComparison(false) }}
                  className={`px-6 py-3 font-medium text-sm ${showDCA ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Dollar-Cost Averaging
                </button>
                <button
                  onClick={() => { setShowWageComparison(true); setShowDCA(false) }}
                  className={`px-6 py-3 font-medium text-sm ${showWageComparison ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  Global Wage Analysis
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Asset Selection for Analysis */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Asset for Analysis
                </label>
                <select
                  value={selectedAssetForAnalysis}
                  onChange={(e) => setSelectedAssetForAnalysis(e.target.value)}
                  className="w-full md:w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose an asset...</option>
                  {availableAssets.map(asset => (
                    <option key={asset.symbol} value={asset.symbol}>
                      {asset.name} ({asset.symbol}) - ${asset.price.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dollar-Cost Averaging Analysis */}
              {showDCA && selectedAssetForAnalysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weekly Investment Amount ($)
                      </label>
                      <input
                        type="number"
                        value={dcaAmount}
                        onChange={(e) => setDcaAmount(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Weeks
                      </label>
                      <input
                        type="number"
                        value={dcaWeeks}
                        onChange={(e) => setDcaWeeks(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {dcaResults && (
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        DCA Projection Results
                      </h4>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600">Total Invested</div>
                          <div className="text-xl font-bold text-gray-900">
                            ${dcaResults.totalInvested.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600">Final Value</div>
                          <div className="text-xl font-bold text-green-600">
                            ${dcaResults.finalValue.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600">Total Return</div>
                          <div className={`text-xl font-bold ${dcaResults.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            ${dcaResults.totalReturn.toLocaleString()}
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-sm text-gray-600">Return %</div>
                          <div className={`text-xl font-bold ${dcaResults.returnPercentage >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {dcaResults.returnPercentage >= 0 ? '+' : ''}{dcaResults.returnPercentage}%
                          </div>
                        </div>
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Average Price:</strong> ${dcaResults.averagePrice.toLocaleString()} •
                        <strong> Total Shares:</strong> {dcaResults.totalShares}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Global Wage Comparison */}
              {showWageComparison && selectedAssetForAnalysis && wageComparisons.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    Global Wage Comparison for 1 {selectedAssetForAnalysis}
                  </h4>

                  <div className="grid gap-3">
                    {wageComparisons.map((comparison, index) => (
                      <div key={comparison.country} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {comparison.country}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {comparison.currency} {comparison.averageHourlyWage}/hour
                            </div>
                            <div className="text-sm text-gray-600">
                              Purchasing Power: {(comparison.purchasingPower * 100).toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">
                            {comparison.timeToEarn.hours.toFixed(1)} hours
                          </div>
                          <div className="text-sm text-gray-600">
                            {comparison.timeToEarn.days.toFixed(1)} work days
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
