import { BarChart3, Sparkles } from 'lucide-react'
import React, { useCallback, useState } from 'react'
import { useAdvancedCalculations } from '../hooks/useAdvancedCalculations'
import { AdvancedPortfolioMode } from './AdvancedPortfolioMode'

interface PortfolioEnhancementProps {
  cryptoAssets: any[]
  trackEvent: (event: string, data: any) => void
}

export const PortfolioEnhancement: React.FC<PortfolioEnhancementProps> = ({
  cryptoAssets,
  trackEvent
}) => {
  const [showAdvancedPortfolio, setShowAdvancedPortfolio] = useState(false)
  const { addToPortfolio } = useAdvancedCalculations()

  // Handle adding to portfolio
  const handleAddToPortfolio = useCallback((symbol: string, amount: number) => {
    const asset = cryptoAssets.find(a => a.symbol.toLowerCase() === symbol.toLowerCase())
    if (asset) {
      addToPortfolio(
        asset.symbol,
        asset.name,
        amount,
        asset.current_price,
        {
          h24: asset.price_change_percentage_24h || 0,
          d7: Math.random() * 10 - 5, // Simulated for now
          d30: Math.random() * 20 - 10 // Simulated for now
        }
      )
      trackEvent('portfolio_asset_added', {
        symbol: asset.symbol,
        amount,
        value: amount * asset.current_price
      })
    }
  }, [cryptoAssets, addToPortfolio, trackEvent])

  return (
    <>
      {/* Advanced Portfolio Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowAdvancedPortfolio(true)}
          className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <BarChart3 className="w-5 h-5 mr-2" />
          Advanced Portfolio Analysis
          <Sparkles className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Advanced Portfolio Mode Modal */}
      <AdvancedPortfolioMode
        isOpen={showAdvancedPortfolio}
        onClose={() => setShowAdvancedPortfolio(false)}
        onAddToPortfolio={handleAddToPortfolio}
      />
    </>
  )
}
