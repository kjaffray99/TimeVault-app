import {
  AlertTriangle,
  Battery,
  Brain,
  Calculator,
  CheckCircle,
  Clock,
  Crown,
  Monitor,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Zap
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useIntelligentCaching, usePerformanceOptimization, usePremiumFeatures } from '../hooks/useIntelligentCaching'

interface PremiumDashboardProps {
  isOpen: boolean
  onClose: () => void
  selectedAsset?: {
    symbol: string
    name: string
    price: number
  }
}

export const PremiumDashboard: React.FC<PremiumDashboardProps> = ({
  isOpen,
  onClose,
  selectedAsset
}) => {
  const {
    aiInsights,
    generateMarketInsights,
    loading: aiLoading,
    createPriceAlert,
    calculateTaxImplications
  } = usePremiumFeatures()

  const {
    metrics: cacheMetrics,
    offlineCapability,
    warmupCache,
    persistCache
  } = useIntelligentCaching()

  const {
    performanceMetrics,
    measureBundleSize,
    trackMemoryUsage,
    getOptimizationSuggestions
  } = usePerformanceOptimization()

  const [activeTab, setActiveTab] = useState<'insights' | 'alerts' | 'tax' | 'performance'>('insights')
  const [alertForm, setAlertForm] = useState({
    targetPrice: '',
    condition: 'above' as 'above' | 'below',
    notification: 'email' as 'email' | 'push' | 'sms'
  })

  useEffect(() => {
    if (isOpen && selectedAsset) {
      // Auto-generate insights for selected asset
      generateMarketInsights(selectedAsset.symbol, selectedAsset.price)
      // Update performance metrics
      measureBundleSize()
      trackMemoryUsage()
    }
  }, [isOpen, selectedAsset, generateMarketInsights, measureBundleSize, trackMemoryUsage])

  const handleCreateAlert = () => {
    if (selectedAsset && alertForm.targetPrice) {
      createPriceAlert(
        selectedAsset.symbol,
        parseFloat(alertForm.targetPrice),
        alertForm.condition,
        alertForm.notification
      )
      setAlertForm({
        targetPrice: '',
        condition: 'above',
        notification: 'email'
      })
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Crown className="w-8 h-8 mr-3 text-yellow-300" />
              <div>
                <h2 className="text-3xl font-bold">Premium Dashboard</h2>
                <p className="text-purple-100 mt-1">Advanced AI insights, alerts, and optimization tools</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-purple-200 hover:text-white transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Asset Info */}
          {selectedAsset && (
            <div className="mt-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedAsset.name}</h3>
                  <p className="text-purple-200">{selectedAsset.symbol.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${selectedAsset.price.toLocaleString()}</div>
                  <div className="text-purple-200 text-sm">Current Price</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex">
            {[
              { id: 'insights', label: 'AI Insights', icon: Brain },
              { id: 'alerts', label: 'Smart Alerts', icon: AlertTriangle },
              { id: 'tax', label: 'Tax Tools', icon: Calculator },
              { id: 'performance', label: 'Performance', icon: Monitor }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                className={`flex items-center px-6 py-4 font-medium text-sm border-b-2 transition-colors ${activeTab === id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 space-y-8">
          {/* AI Insights Tab */}
          {activeTab === 'insights' && (
            <div className="space-y-6">
              {aiLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Brain className="w-12 h-12 mx-auto text-purple-500 animate-pulse mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating AI Insights</h3>
                    <p className="text-gray-600">Analyzing market data and trends...</p>
                  </div>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6">
                  {/* Market Sentiment */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                      Market Analysis
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Sentiment</div>
                        <div className={`text-2xl font-bold ${aiInsights.marketInsights.sentiment === 'bullish' ? 'text-green-600' :
                            aiInsights.marketInsights.sentiment === 'bearish' ? 'text-red-600' : 'text-yellow-600'
                          }`}>
                          {aiInsights.marketInsights.sentiment.charAt(0).toUpperCase() + aiInsights.marketInsights.sentiment.slice(1)}
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Volatility Score</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {aiInsights.marketInsights.volatilityScore.toFixed(1)}/100
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-4">
                        <div className="text-sm text-gray-600">Risk Assessment</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {aiInsights.marketInsights.riskAssessment}
                        </div>
                      </div>
                    </div>

                    {/* Price Targets */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">AI Price Targets</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-sm text-red-600 font-medium">Pessimistic</div>
                          <div className="text-lg font-bold text-red-600">
                            ${aiInsights.marketInsights.priceTargets.pessimistic.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600 font-medium">Conservative</div>
                          <div className="text-lg font-bold text-gray-900">
                            ${aiInsights.marketInsights.priceTargets.conservative.toLocaleString()}
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-green-600 font-medium">Optimistic</div>
                          <div className="text-lg font-bold text-green-600">
                            ${aiInsights.marketInsights.priceTargets.optimistic.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* AI Predictions */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="w-6 h-6 mr-2 text-green-600" />
                      AI Predictions
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Price Predictions</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Week:</span>
                            <span className={`font-semibold ${aiInsights.aiPredictions.nextWeekChange >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {aiInsights.aiPredictions.nextWeekChange >= 0 ? '+' : ''}{aiInsights.aiPredictions.nextWeekChange.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Next Month:</span>
                            <span className={`font-semibold ${aiInsights.aiPredictions.nextMonthChange >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                              {aiInsights.aiPredictions.nextMonthChange >= 0 ? '+' : ''}{aiInsights.aiPredictions.nextMonthChange.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Confidence:</span>
                            <span className="font-semibold text-blue-600">
                              {aiInsights.aiPredictions.confidence.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Key Factors</h4>
                        <ul className="space-y-1">
                          {aiInsights.aiPredictions.factors.map((factor, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              {factor}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio Optimization */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-6 h-6 mr-2 text-purple-600" />
                      Portfolio Optimization
                    </h3>

                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                      <ul className="space-y-2">
                        {aiInsights.portfolioOptimization.rebalanceRecommendations.map((rec, index) => (
                          <li key={index} className="flex items-center text-gray-700">
                            <TrendingUp className="w-4 h-4 mr-2 text-purple-500" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Risk-Adjusted Returns:</span>
                          <span className="font-semibold text-purple-600 text-lg">
                            {aiInsights.portfolioOptimization.riskAdjustedReturns.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Brain className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Insights Available</h3>
                  <p className="text-gray-600">Select an asset to generate AI-powered insights</p>
                </div>
              )}
            </div>
          )}

          {/* Smart Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                  Create Price Alert
                </h3>

                {selectedAsset && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Target Price ($)
                        </label>
                        <input
                          type="number"
                          value={alertForm.targetPrice}
                          onChange={(e) => setAlertForm(prev => ({ ...prev, targetPrice: e.target.value }))}
                          placeholder="Enter target price"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Condition
                        </label>
                        <select
                          value={alertForm.condition}
                          onChange={(e) => setAlertForm(prev => ({ ...prev, condition: e.target.value as 'above' | 'below' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="above">Price Goes Above</option>
                          <option value="below">Price Goes Below</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Method
                        </label>
                        <select
                          value={alertForm.notification}
                          onChange={(e) => setAlertForm(prev => ({ ...prev, notification: e.target.value as any }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          <option value="email">Email</option>
                          <option value="push">Push Notification</option>
                          <option value="sms">SMS</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={handleCreateAlert}
                      disabled={!alertForm.targetPrice}
                      className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Create Alert
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tax Tools Tab */}
          {activeTab === 'tax' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Calculator className="w-6 h-6 mr-2 text-green-600" />
                  Tax Calculation Tools
                </h3>

                <div className="bg-white rounded-lg p-4">
                  <p className="text-gray-600 mb-4">
                    Advanced tax calculation features coming soon. Track gains/losses, optimize holding periods,
                    and get personalized tax advice.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <Calculator className="w-8 h-8 mx-auto text-green-500 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Gain/Loss Tracking</h4>
                      <p className="text-sm text-gray-600">Automatic calculation of realized gains</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <Clock className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Holding Period Optimization</h4>
                      <p className="text-sm text-gray-600">Maximize long-term capital gains</p>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 text-center">
                      <TrendingDown className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                      <h4 className="font-semibold text-gray-900 mb-1">Tax Loss Harvesting</h4>
                      <p className="text-sm text-gray-600">Identify opportunities to offset gains</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Monitor className="w-6 h-6 mr-2 text-blue-600" />
                  Performance Metrics
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-sm text-gray-600">Bundle Size</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {performanceMetrics.bundleSize.toFixed(0)}KB
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Monitor className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="text-sm text-gray-600">Memory Usage</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {performanceMetrics.memoryUsage.toFixed(1)}MB
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Battery className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-600">Battery Impact</span>
                    </div>
                    <div className={`text-2xl font-bold ${performanceMetrics.batteryImpact === 'low' ? 'text-green-600' :
                        performanceMetrics.batteryImpact === 'medium' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                      {performanceMetrics.batteryImpact}
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-500 mr-2" />
                      <span className="text-sm text-gray-600">Cache Hit Rate</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {(cacheMetrics.hitRate * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Cache Metrics */}
                <div className="bg-white rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Intelligent Caching Status</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Cache Size</div>
                      <div className="text-lg font-semibold text-blue-600">{cacheMetrics.cacheSize}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Requests</div>
                      <div className="text-lg font-semibold text-purple-600">{cacheMetrics.totalRequests}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Memory Usage</div>
                      <div className="text-lg font-semibold text-green-600">{(cacheMetrics.memoryUsage / 1024).toFixed(1)}KB</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Offline Ready</div>
                      <div className={`text-lg font-semibold ${offlineCapability.cachedDataAvailable ? 'text-green-600' : 'text-gray-400'}`}>
                        {offlineCapability.cachedDataAvailable ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optimization Suggestions */}
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Optimization Suggestions</h4>
                  <ul className="space-y-2">
                    {getOptimizationSuggestions().map((suggestion, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        {suggestion}
                      </li>
                    ))}
                    {getOptimizationSuggestions().length === 0 && (
                      <li className="flex items-center text-green-700">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                        Performance is optimized - no suggestions at this time
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
