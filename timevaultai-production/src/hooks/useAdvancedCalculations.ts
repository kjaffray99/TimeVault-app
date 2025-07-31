import { useCallback, useState } from 'react'

// Advanced calculation types
interface PortfolioAsset {
  symbol: string
  name: string
  amount: number
  currentPrice: number
  allocation: number // percentage
  value: number
  priceChange24h: number
  priceChange7d: number
  priceChange30d: number
}

interface PortfolioMetrics {
  totalValue: number
  totalChange24h: number
  totalChange7d: number
  totalChange30d: number
  diversificationScore: number
  riskLevel: 'Low' | 'Medium' | 'High'
  topPerformer: string
  worstPerformer: string
}

interface TimeBasedCalculation {
  timeToEarn: {
    hours: number
    days: number
    weeks: number
    months: number
    years: number
  }
  dollarCostAveraging: {
    weeklyInvestment: number
    monthlyInvestment: number
    yearlyInvestment: number
  }
  compoundProjection: {
    year1: number
    year5: number
    year10: number
  }
}

interface CountryWageComparison {
  country: string
  currency: string
  averageHourlyWage: number
  timeToEarn: {
    hours: number
    days: number
  }
  purchasingPower: number
}

export const useAdvancedCalculations = () => {
  const [portfolioMode, setPortfolioMode] = useState(false)
  const [portfolioAssets, setPortfolioAssets] = useState<PortfolioAsset[]>([])
  const [calculationCache, setCalculationCache] = useState<Map<string, any>>(new Map())

  // Country wage data (simplified for demo - would come from API in production)
  const countryWageData = {
    'US': { currency: 'USD', averageHourlyWage: 25.50, purchasingPower: 1.0 },
    'UK': { currency: 'GBP', averageHourlyWage: 18.30, purchasingPower: 0.85 },
    'DE': { currency: 'EUR', averageHourlyWage: 22.10, purchasingPower: 0.92 },
    'JP': { currency: 'JPY', averageHourlyWage: 2890, purchasingPower: 0.78 },
    'AU': { currency: 'AUD', averageHourlyWage: 35.20, purchasingPower: 1.15 },
    'CA': { currency: 'CAD', averageHourlyWage: 28.85, purchasingPower: 1.05 },
    'CH': { currency: 'CHF', averageHourlyWage: 45.20, purchasingPower: 1.35 },
    'NO': { currency: 'NOK', averageHourlyWage: 285.40, purchasingPower: 1.25 },
  }

  // Smart caching with TTL
  const getCachedResult = useCallback((key: string, ttlMinutes: number = 5) => {
    const cached = calculationCache.get(key)
    if (cached && (Date.now() - cached.timestamp) < ttlMinutes * 60 * 1000) {
      return cached.data
    }
    return null
  }, [calculationCache])

  const setCachedResult = useCallback((key: string, data: any) => {
    setCalculationCache(prev => new Map(prev.set(key, {
      data,
      timestamp: Date.now()
    })))
  }, [])

  // Advanced time-based calculations
  const calculateTimeToEarn = useCallback((
    assetValue: number,
    hourlyWage: number,
    includeProjections: boolean = false
  ): TimeBasedCalculation => {
    const cacheKey = `timeToEarn_${assetValue}_${hourlyWage}_${includeProjections}`
    const cached = getCachedResult(cacheKey)
    if (cached) return cached

    const hoursToEarn = assetValue / hourlyWage
    const daysToEarn = hoursToEarn / 8 // 8-hour workday
    const weeksToEarn = daysToEarn / 5 // 5-day work week
    const monthsToEarn = weeksToEarn / 4.33 // Average weeks per month
    const yearsToEarn = monthsToEarn / 12

    const result: TimeBasedCalculation = {
      timeToEarn: {
        hours: Math.round(hoursToEarn * 100) / 100,
        days: Math.round(daysToEarn * 100) / 100,
        weeks: Math.round(weeksToEarn * 100) / 100,
        months: Math.round(monthsToEarn * 100) / 100,
        years: Math.round(yearsToEarn * 100) / 100,
      },
      dollarCostAveraging: {
        weeklyInvestment: Math.round((hourlyWage * 40 * 0.1) * 100) / 100, // 10% of weekly income
        monthlyInvestment: Math.round((hourlyWage * 40 * 4.33 * 0.1) * 100) / 100,
        yearlyInvestment: Math.round((hourlyWage * 40 * 52 * 0.1) * 100) / 100,
      },
      compoundProjection: {
        year1: Math.round(assetValue * 1.07 * 100) / 100, // 7% annual growth assumption
        year5: Math.round(assetValue * Math.pow(1.07, 5) * 100) / 100,
        year10: Math.round(assetValue * Math.pow(1.07, 10) * 100) / 100,
      }
    }

    setCachedResult(cacheKey, result)
    return result
  }, [getCachedResult, setCachedResult])

  // Multi-country wage comparison
  const calculateWageComparisons = useCallback((assetValue: number): CountryWageComparison[] => {
    const cacheKey = `wageComparison_${assetValue}`
    const cached = getCachedResult(cacheKey)
    if (cached) return cached

    const comparisons = Object.entries(countryWageData).map(([countryCode, data]) => {
      const hoursToEarn = assetValue / data.averageHourlyWage
      const adjustedValue = assetValue / data.purchasingPower

      return {
        country: countryCode,
        currency: data.currency,
        averageHourlyWage: data.averageHourlyWage,
        timeToEarn: {
          hours: Math.round(hoursToEarn * 100) / 100,
          days: Math.round((hoursToEarn / 8) * 100) / 100,
        },
        purchasingPower: data.purchasingPower,
      }
    }).sort((a, b) => a.timeToEarn.hours - b.timeToEarn.hours)

    setCachedResult(cacheKey, comparisons)
    return comparisons
  }, [getCachedResult, setCachedResult])

  // Portfolio calculations
  const calculatePortfolioMetrics = useCallback((assets: PortfolioAsset[]): PortfolioMetrics => {
    if (assets.length === 0) {
      return {
        totalValue: 0,
        totalChange24h: 0,
        totalChange7d: 0,
        totalChange30d: 0,
        diversificationScore: 0,
        riskLevel: 'Low',
        topPerformer: '',
        worstPerformer: ''
      }
    }

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0)

    // Weighted average calculations
    const totalChange24h = assets.reduce((sum, asset) =>
      sum + (asset.priceChange24h * asset.allocation / 100), 0)
    const totalChange7d = assets.reduce((sum, asset) =>
      sum + (asset.priceChange7d * asset.allocation / 100), 0)
    const totalChange30d = assets.reduce((sum, asset) =>
      sum + (asset.priceChange30d * asset.allocation / 100), 0)

    // Diversification score (0-100, higher is better)
    const allocations = assets.map(a => a.allocation)
    const maxAllocation = Math.max(...allocations)
    const diversificationScore = Math.round((100 - maxAllocation) * 100) / 100

    // Risk assessment based on volatility
    const avgVolatility = Math.abs(totalChange24h)
    const riskLevel: 'Low' | 'Medium' | 'High' =
      avgVolatility < 5 ? 'Low' : avgVolatility < 15 ? 'Medium' : 'High'

    // Performance analysis
    const performers = assets.sort((a, b) => b.priceChange24h - a.priceChange24h)
    const topPerformer = performers[0]?.symbol || ''
    const worstPerformer = performers[performers.length - 1]?.symbol || ''

    return {
      totalValue: Math.round(totalValue * 100) / 100,
      totalChange24h: Math.round(totalChange24h * 100) / 100,
      totalChange7d: Math.round(totalChange7d * 100) / 100,
      totalChange30d: Math.round(totalChange30d * 100) / 100,
      diversificationScore,
      riskLevel,
      topPerformer,
      worstPerformer
    }
  }, [])

  // Add asset to portfolio
  const addToPortfolio = useCallback((
    symbol: string,
    name: string,
    amount: number,
    currentPrice: number,
    priceChanges: { h24: number, d7: number, d30: number }
  ) => {
    const value = amount * currentPrice
    const newAsset: PortfolioAsset = {
      symbol,
      name,
      amount,
      currentPrice,
      allocation: 0, // Will be calculated after adding
      value,
      priceChange24h: priceChanges.h24,
      priceChange7d: priceChanges.d7,
      priceChange30d: priceChanges.d30,
    }

    setPortfolioAssets(prev => {
      const updated = [...prev, newAsset]
      const totalValue = updated.reduce((sum, asset) => sum + asset.value, 0)

      // Recalculate allocations
      return updated.map(asset => ({
        ...asset,
        allocation: Math.round((asset.value / totalValue) * 10000) / 100
      }))
    })
  }, [])

  // Remove asset from portfolio
  const removeFromPortfolio = useCallback((symbol: string) => {
    setPortfolioAssets(prev => {
      const updated = prev.filter(asset => asset.symbol !== symbol)
      const totalValue = updated.reduce((sum, asset) => sum + asset.value, 0)

      // Recalculate allocations
      return updated.map(asset => ({
        ...asset,
        allocation: totalValue > 0 ? Math.round((asset.value / totalValue) * 10000) / 100 : 0
      }))
    })
  }, [])

  // Clear portfolio
  const clearPortfolio = useCallback(() => {
    setPortfolioAssets([])
  }, [])

  // Dollar cost averaging calculator
  const calculateDollarCostAveraging = useCallback((
    weeklyAmount: number,
    currentPrice: number,
    weeks: number,
    expectedGrowthRate: number = 0.07 // 7% annual
  ) => {
    const weeklyGrowthRate = Math.pow(1 + expectedGrowthRate, 1 / 52) - 1
    let totalShares = 0
    let totalInvested = 0
    const purchases: Array<{ week: number, price: number, shares: number, totalValue: number }> = []

    for (let week = 1; week <= weeks; week++) {
      // Simulate price volatility (±20% random walk)
      const priceVariation = 1 + (Math.random() - 0.5) * 0.4
      const weekPrice = currentPrice * Math.pow(1 + weeklyGrowthRate, week) * priceVariation

      const sharesThisWeek = weeklyAmount / weekPrice
      totalShares += sharesThisWeek
      totalInvested += weeklyAmount

      const currentValue = totalShares * weekPrice

      purchases.push({
        week,
        price: Math.round(weekPrice * 100) / 100,
        shares: Math.round(sharesThisWeek * 1000000) / 1000000,
        totalValue: Math.round(currentValue * 100) / 100
      })
    }

    const finalValue = totalShares * (currentPrice * Math.pow(1 + weeklyGrowthRate, weeks))
    const totalReturn = finalValue - totalInvested
    const returnPercentage = (totalReturn / totalInvested) * 100

    return {
      totalInvested: Math.round(totalInvested * 100) / 100,
      finalValue: Math.round(finalValue * 100) / 100,
      totalReturn: Math.round(totalReturn * 100) / 100,
      returnPercentage: Math.round(returnPercentage * 100) / 100,
      totalShares: Math.round(totalShares * 1000000) / 1000000,
      averagePrice: Math.round((totalInvested / totalShares) * 100) / 100,
      purchases: purchases.slice(-10) // Return last 10 purchases for display
    }
  }, [])

  return {
    // Portfolio management
    portfolioMode,
    setPortfolioMode,
    portfolioAssets,
    addToPortfolio,
    removeFromPortfolio,
    clearPortfolio,

    // Calculations
    calculateTimeToEarn,
    calculateWageComparisons,
    calculatePortfolioMetrics,
    calculateDollarCostAveraging,

    // Cache management
    getCachedResult,
    setCachedResult,

    // Utilities
    countryWageData,
  }
}
