import { Calculator as CalculatorIcon, RefreshCw, TrendingUp, Crown, Zap } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useDebounce } from '../../hooks/useDebounce';
import './Calculator.css';

interface CalculatorProps {
  className?: string;
}

interface CryptoAsset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  image: string;
}

interface PreciousMetalPrice {
  metal: string;
  price: number;
  unit: string;
  change: number;
}

interface ConversionResult {
  asset: CryptoAsset;
  amount: number;
  usdValue: number;
  metals: {
    gold: { amount: number; unit: string };
    silver: { amount: number; unit: string };
    platinum: { amount: number; unit: string };
    palladium: { amount: number; unit: string };
  };
  timeValue: {
    hours: number;
    days: number;
    weeks: number;
  };
}

const Calculator: React.FC<CalculatorProps> = ({ className = '' }) => {
  const { cryptoPrices, metalPrices, isLoading, error, refreshData } = useApi();
  const { track, trackPremiumInterest } = useAnalytics();

  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset | null>(null);
  const [amount, setAmount] = useState<string>('1');
  const [hourlyWage, setHourlyWage] = useState<number>(25);
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);

  // Debounce amount changes to reduce calculations
  const debouncedAmount = useDebounce(amount, 300);

  // Set default crypto asset
  useEffect(() => {
    if (cryptoPrices.length > 0 && !selectedAsset) {
      const btc = cryptoPrices.find(crypto => crypto.id === 'bitcoin');
      setSelectedAsset(btc || cryptoPrices[0]);
    }
  }, [cryptoPrices, selectedAsset]);

  // Track calculator usage
  useEffect(() => {
    track('calculator_loaded');
  }, [track]);

  // Calculate conversion results
  const conversionResult = useMemo((): ConversionResult | null => {
    if (!selectedAsset || !debouncedAmount || isNaN(Number(debouncedAmount))) {
      return null;
    }

    const inputAmount = Number(debouncedAmount);
    const usdValue = selectedAsset.current_price * inputAmount;

    // Get metal prices with fallbacks
    const goldPrice = metalPrices.find(m => m.metal === 'gold')?.price || 2050;
    const silverPrice = metalPrices.find(m => m.metal === 'silver')?.price || 24;
    const platinumPrice = metalPrices.find(m => m.metal === 'platinum')?.price || 1000;
    const palladiumPrice = metalPrices.find(m => m.metal === 'palladium')?.price || 1500;

    // Calculate metal conversions
    const metals = {
      gold: { amount: usdValue / goldPrice, unit: 'oz' },
      silver: { amount: usdValue / silverPrice, unit: 'oz' },
      platinum: { amount: usdValue / platinumPrice, unit: 'oz' },
      palladium: { amount: usdValue / palladiumPrice, unit: 'oz' }
    };

    // Calculate time equivalent
    const totalHours = usdValue / hourlyWage;
    const timeValue = {
      hours: totalHours,
      days: totalHours / 8, // 8-hour work days
      weeks: totalHours / 40 // 40-hour work weeks
    };

    return {
      asset: selectedAsset,
      amount: inputAmount,
      usdValue,
      metals,
      timeValue
    };
  }, [selectedAsset, debouncedAmount, metalPrices, hourlyWage]);

  // Handle amount input changes
  const handleAmountChange = (value: string) => {
    setAmount(value);
    track('calculator_amount_changed', { amount: value, asset: selectedAsset?.symbol });
  };

  // Handle asset selection
  const handleAssetChange = (asset: CryptoAsset) => {
    setSelectedAsset(asset);
    track('calculator_asset_changed', {
      asset: asset.symbol,
      price: asset.current_price
    });
  };

  // Handle premium upsell interactions
  const handlePremiumClick = (source: string) => {
    trackPremiumInterest(source, {
      calculator_value: conversionResult?.usdValue
    });
    setShowPremiumUpsell(true);
  };

  // Format currency values
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  // Format metal amounts
  const formatMetal = (amount: number): string => {
    if (amount < 0.01) {
      return amount.toExponential(2);
    }
    return amount.toFixed(4);
  };

  // Format time values
  const formatTime = (hours: number): string => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} minutes`;
    } else if (hours < 24) {
      return `${hours.toFixed(1)} hours`;
    } else {
      return `${(hours / 24).toFixed(1)} days`;
    }
  };

  if (isLoading) {
    return (
      <div className={`calculator ${className}`}>
        <div className="calculator-loading">
          <RefreshCw className="loading-spinner" />
          <p>Loading market data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`calculator ${className}`}>
        <div className="calculator-error">
          <p>{error}</p>
          <button onClick={refreshData} className="retry-button">
            <RefreshCw className="refresh-icon" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`calculator ${className}`}>
      {/* Header */}
      <div className="calculator-header">
        <div className="calculator-title">
          <CalculatorIcon className="title-icon" />
          <h2>Digital Asset Value Calculator</h2>
        </div>
        <button
          onClick={refreshData}
          className="refresh-button"
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? "refresh-icon loading" : "refresh-icon"} />
        </button>
      </div>

      {/* Input Section */}
      <div className="calculator-inputs">
        <div className="input-group">
          <label htmlFor="amount-input">Amount</label>
          <input
            id="amount-input"
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="1.0"
            step="any"
            min="0"
            className="amount-input"
          />
        </div>

        <div className="input-group">
          <label htmlFor="asset-select">Cryptocurrency</label>
          <select
            id="asset-select"
            value={selectedAsset?.id || ''}
            onChange={(e) => {
              const asset = cryptoPrices.find(a => a.id === e.target.value);
              if (asset) handleAssetChange(asset);
            }}
            className="asset-select"
          >
            {cryptoPrices.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.name} ({asset.symbol.toUpperCase()}) - {formatCurrency(asset.current_price)}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="wage-input">Your Hourly Wage (USD)</label>
          <input
            id="wage-input"
            type="number"
            value={hourlyWage}
            onChange={(e) => setHourlyWage(Number(e.target.value) || 25)}
            placeholder="25"
            min="1"
            step="0.01"
            className="wage-input"
          />
        </div>
      </div>

      {/* Results Section */}
      {conversionResult && (
        <div className="calculator-results">
          {/* Total Value */}
          <div className="result-card total-value">
            <h3>Total Value</h3>
            <div className="value-display">
              <span className="value-amount">{formatCurrency(conversionResult.usdValue)}</span>
              <div className="price-change">
                {selectedAsset.price_change_percentage_24h >= 0 ? (
                  <TrendingUp className="trend-icon positive" />
                ) : (
                  <TrendingUp className="trend-icon negative" />
                )}
                <span className={selectedAsset.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}>
                  {Math.abs(selectedAsset.price_change_percentage_24h).toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Precious Metals */}
          <div className="result-card metals-conversion">
            <h3>Precious Metals Equivalent</h3>
            <div className="metals-grid">
              <div className="metal-item">
                <span className="metal-name">Gold</span>
                <span className="metal-amount">{formatMetal(conversionResult.metals.gold.amount)} oz</span>
              </div>
              <div className="metal-item">
                <span className="metal-name">Silver</span>
                <span className="metal-amount">{formatMetal(conversionResult.metals.silver.amount)} oz</span>
              </div>
              <div className="metal-item">
                <span className="metal-name">Platinum</span>
                <span className="metal-amount">{formatMetal(conversionResult.metals.platinum.amount)} oz</span>
              </div>
              <div className="metal-item">
                <span className="metal-name">Palladium</span>
                <span className="metal-amount">{formatMetal(conversionResult.metals.palladium.amount)} oz</span>
              </div>
            </div>

            {/* Premium Upsell for Advanced Charts */}
            <div className="premium-upsell">
              <button
                onClick={() => handlePremiumClick('metals_chart')}
                className="premium-button"
              >
                <Crown className="premium-icon" />
                View Historical Price Charts
              </button>
            </div>
          </div>

          {/* Time Equivalent */}
          <div className="result-card time-conversion">
            <h3>Your Time Equivalent</h3>
            <div className="time-grid">
              <div className="time-item">
                <span className="time-label">Hours</span>
                <span className="time-value">{conversionResult.timeValue.hours.toFixed(1)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">Days</span>
                <span className="time-value">{conversionResult.timeValue.days.toFixed(1)}</span>
              </div>
              <div className="time-item">
                <span className="time-label">Weeks</span>
                <span className="time-value">{conversionResult.timeValue.weeks.toFixed(2)}</span>
              </div>
            </div>

            {/* Premium Upsell for AI Insights */}
            <div className="premium-upsell">
              <button
                onClick={() => handlePremiumClick('ai_insights')}
                className="premium-button"
              >
                <Zap className="premium-icon" />
                Get AI Wealth Insights
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Premium Modal Placeholder */}
      {showPremiumUpsell && (
        <div className="premium-modal-overlay" onClick={() => setShowPremiumUpsell(false)}>
          <div className="premium-modal" onClick={(e) => e.stopPropagation()}>
            <div className="premium-modal-content">
              <h3>🏆 Unlock Premium Features</h3>
              <ul>
                <li>📊 Historical price charts and trends</li>
                <li>🤖 AI-powered wealth insights</li>
                <li>💎 Advanced portfolio tracking</li>
                <li>⚡ Real-time alerts and notifications</li>
              </ul>
              <div className="premium-modal-actions">
                <button className="premium-subscribe-button">
                  Start Free Trial - $9.99/month
                </button>
                <button
                  onClick={() => setShowPremiumUpsell(false)}
                  className="premium-close-button"
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
const asset = cryptoAssets.find(crypto => crypto.id === e.target.value);
setSelectedAsset(asset || null);
              }}
disabled = { isLoading }
  >
  <option value="">Choose a cryptocurrency...</option>
{
  cryptoAssets.map((crypto) => (
    <option key={crypto.id} value={crypto.id}>
      {crypto.name} ({crypto.symbol}) - {formatCurrency(crypto.price)}
    </option>
  ))
}
            </select >
          </div >

          <div className="input-group">
            <label htmlFor="amount-input" className="form-label">
              Amount
            </label>
            <div className="amount-input-wrapper">
              <input
                id="amount-input"
                type="number"
                min="0"
                step="any"
                className="form-input amount-input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={isLoading}
              />
              {selectedAsset && (
                <span className="input-suffix">{selectedAsset.symbol}</span>
              )}
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="wage-input" className="form-label">
              Your Hourly Wage ({userWage.currency})
            </label>
            <input
              id="wage-input"
              type="number"
              min="0"
              step="0.01"
              className="form-input"
              value={userWage.hourlyRate}
              onChange={(e) => setUserWage(prev => ({
                ...prev,
                hourlyRate: Number(e.target.value) || 0
              }))}
              placeholder="Enter your hourly wage"
              disabled={isLoading}
            />
          </div>
        </div >

  {/* Results Section */ }
{
  conversionResult && (
    <div className="results-section">
      <h3 className="results-title">Conversion Results</h3>

      {/* Fiat Value */}
      <div className="result-card primary-result">
        <div className="result-label">Total Value</div>
        <div className="result-value highlight">
          {formatCurrency(conversionResult.fiatValue)}
        </div>
        <div className="result-subtitle">
          {formatNumber(conversionResult.inputAmount, 4)} {conversionResult.inputAsset.symbol}
        </div>
      </div>

      {/* Precious Metals */}
      <div className="results-grid">
        <div className="result-card metal-result">
          <div className="result-icon gold-icon">🥇</div>
          <div className="result-content">
            <div className="result-label">Gold Equivalent</div>
            <div className="result-value text-gold">
              {formatNumber(conversionResult.goldOunces, 3)} oz
            </div>
            <div className="result-subtitle">
              @ {formatCurrency(metalPrices.find((m: PreciousMetalPrice) => m.metal === 'gold')?.price || 2050)}/oz
            </div>
          </div>
        </div>

        <div className="result-card metal-result">
          <div className="result-icon silver-icon">🥈</div>
          <div className="result-content">
            <div className="result-label">Silver Equivalent</div>
            <div className="result-value text-silver">
              {formatNumber(conversionResult.silverOunces, 1)} oz
            </div>
            <div className="result-subtitle">
              @ {formatCurrency(metalPrices.find((m: PreciousMetalPrice) => m.metal === 'silver')?.price || 24)}/oz
            </div>
          </div>
        </div>
      </div>

      {/* Time Equivalent */}
      <div className="result-card time-result">
        <div className="result-label">Time Equivalent at Your Wage</div>
        <div className="time-breakdown">
          <div className="time-item">
            <span className="time-value highlight">
              {formatNumber(conversionResult.timeEquivalent.hours, 1)}
            </span>
            <span className="time-unit">hours</span>
          </div>
          <div className="time-separator">≈</div>
          <div className="time-item">
            <span className="time-value">
              {formatNumber(conversionResult.timeEquivalent.days, 1)}
            </span>
            <span className="time-unit">work days</span>
          </div>
          <div className="time-separator">≈</div>
          <div className="time-item">
            <span className="time-value">
              {formatNumber(conversionResult.timeEquivalent.weeks, 1)}
            </span>
            <span className="time-unit">work weeks</span>
          </div>
        </div>
        <div className="result-subtitle">
          Based on ${userWage.hourlyRate}/hour wage
        </div>
      </div>

      {/* Price Change Indicator */}
      {selectedAsset && (
        <div className="price-change-indicator">
          <span className="price-change-label">24h Change:</span>
          <span className={`price-change ${selectedAsset.priceChange24h >= 0 ? 'positive' : 'negative'}`}>
            {selectedAsset.priceChange24h >= 0 ? (
              <TrendingUp className="trend-icon" />
            ) : (
              <TrendingDown className="trend-icon" />
            )}
            {Math.abs(selectedAsset.priceChange24h).toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  )
}

{/* Last Updated */ }
<div className="last-updated">
  <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
</div>
      </div >
    </div >
  );
};

export default Calculator;
