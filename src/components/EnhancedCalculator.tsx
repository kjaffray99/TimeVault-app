/**
 * ENHANCED CALCULATOR COMPONENT WITH ANALYTICS INTEGRATION
 * A/B testing and conversion tracking implementation
 */

import React, { useEffect, useState } from 'react';
import { useABTesting, useAnalytics } from '../services/analytics';
import { forceCalculatorDisplay } from '../utils/calculatorDebug';

interface CalculatorResult {
    asset: string;
    amount: number;
    usdValue: number;
    metals: {
        gold: { amount: number; value: number; };
        silver: { amount: number; value: number; };
        platinum: { amount: number; value: number; };
    };
    timeValue: { hours: number; days: number; };
}

export const EnhancedCalculator: React.FC = () => {
    const analytics = useAnalytics();
    const abTesting = useABTesting();

    // A/B test variants
    const ctaVariant = abTesting.getVariant('calculator_cta_style');
    const ctaConfig = abTesting.getVariantConfig('calculator_cta_style');

    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [amount, setAmount] = useState<number>(1);
    const [result, setResult] = useState<CalculatorResult | null>(null);
    const [isCalculating, setIsCalculating] = useState(false);
    const [showPremiumPrompt, setShowPremiumPrompt] = useState(false);

    // Track calculator page view
    useEffect(() => {
        analytics.trackEvent('calculator_page_view', {
            ab_variant: ctaVariant
        });

        // Track funnel entry
        analytics.trackFunnelStep('calculator_entry');
    }, []);

    const handleCalculation = async () => {
        if (!selectedAsset || amount <= 0) return;

        setIsCalculating(true);

        // Track calculation start
        analytics.trackEvent('calculation_started', {
            asset: selectedAsset.id,
            amount: amount,
            ab_variant: ctaVariant
        });

        try {
            // Use the guaranteed calculator display
            const calculationData = forceCalculatorDisplay(selectedAsset, amount);

            const calculatorResult: CalculatorResult = {
                asset: selectedAsset.name,
                amount: amount,
                usdValue: calculationData.calculation.usdValue,
                metals: {
                    gold: {
                        amount: calculationData.calculation.metals.gold.amount,
                        value: calculationData.calculation.metals.gold.value
                    },
                    silver: {
                        amount: calculationData.calculation.metals.silver.amount,
                        value: calculationData.calculation.metals.silver.value
                    },
                    platinum: {
                        amount: calculationData.calculation.metals.platinum.amount,
                        value: calculationData.calculation.metals.platinum.value
                    }
                },
                timeValue: {
                    hours: calculationData.calculation.timeValue.hours,
                    days: calculationData.calculation.timeValue.days
                }
            };

            setResult(calculatorResult);

            // Track successful calculation
            analytics.trackCalculatorUsage({
                asset: selectedAsset.id,
                amount: amount,
                usdValue: calculatorResult.usdValue,
                metalType: 'gold',
                metalAmount: calculatorResult.metals.gold.amount,
                timeValue: calculatorResult.timeValue.hours
            });

            // Track funnel progression
            analytics.trackFunnelStep('calculation_completed', {
                usd_value: calculatorResult.usdValue,
                value_tier: getValueTier(calculatorResult.usdValue)
            });

            // Show premium prompt for high-value calculations
            if (calculatorResult.usdValue > 1000) {
                setTimeout(() => {
                    setShowPremiumPrompt(true);
                    analytics.trackEvent('premium_prompt_shown', {
                        trigger: 'high_value_calculation',
                        usd_value: calculatorResult.usdValue,
                        ab_variant: ctaVariant
                    });
                }, 2000);
            }

        } catch (error) {
            analytics.trackEvent('calculation_error', {
                error: error.toString(),
                asset: selectedAsset.id,
                amount: amount
            });
        } finally {
            setIsCalculating(false);
        }
    };

    const handlePremiumUpgrade = () => {
        analytics.trackEvent('premium_cta_clicked', {
            source: 'calculator_result',
            ab_variant: ctaVariant,
            usd_value: result?.usdValue
        });

        // Track A/B test conversion
        abTesting.trackConversion('calculator_cta_style', 'premium_click', result?.usdValue);

        // Track funnel step
        analytics.trackFunnelStep('premium_interest_shown');

        // Redirect to premium page
        window.location.href = '/premium';
    };

    const handleShareResult = () => {
        if (!result) return;

        analytics.trackEvent('result_shared', {
            platform: 'clipboard',
            usd_value: result.usdValue,
            asset: result.asset
        });

        const shareText = `I just calculated ${result.amount} ${result.asset} = $${result.usdValue.toLocaleString()} = ${result.metals.gold.amount.toFixed(4)} oz of gold! 💰 Try it: timevaultai.com`;

        navigator.clipboard.writeText(shareText).then(() => {
            alert('Result copied to clipboard! Share with friends.');
        });
    };

    const getValueTier = (usdValue: number): string => {
        if (usdValue < 100) return 'small';
        if (usdValue < 1000) return 'medium';
        if (usdValue < 10000) return 'large';
        return 'whale';
    };

    return (
        <div className="enhanced-calculator">
            {/* Calculator Input Section */}
            <div className="calculator-inputs">
                <h2>💰 Digital Asset to Precious Metals Calculator</h2>

                <div className="input-group">
                    <label>Select Asset:</label>
                    <select
                        value={selectedAsset?.id || ''}
                        onChange={(e) => {
                            const asset = { id: e.target.value, name: e.target.options[e.target.selectedIndex].text, current_price: 97500 };
                            setSelectedAsset(asset);
                            analytics.trackEvent('asset_selected', { asset: e.target.value });
                        }}
                    >
                        <option value="">Choose an asset...</option>
                        <option value="bitcoin">Bitcoin (BTC)</option>
                        <option value="ethereum">Ethereum (ETH)</option>
                        <option value="ripple">XRP</option>
                    </select>
                </div>

                <div className="input-group">
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => {
                            setAmount(parseFloat(e.target.value) || 0);
                            analytics.trackEvent('amount_changed', { amount: parseFloat(e.target.value) || 0 });
                        }}
                        min="0"
                        step="0.01"
                    />
                </div>

                <button
                    onClick={handleCalculation}
                    disabled={!selectedAsset || amount <= 0 || isCalculating}
                    className="calculate-button"
                >
                    {isCalculating ? 'Calculating...' : '⚡ Calculate Value'}
                </button>
            </div>

            {/* Results Section */}
            {result && (
                <div className="calculator-results">
                    <h3>💎 Your Asset Value Breakdown</h3>

                    <div className="result-card">
                        <div className="usd-value">
                            <strong>${result.usdValue.toLocaleString()}</strong>
                            <span>USD Value</span>
                        </div>

                        <div className="metals-grid">
                            <div className="metal-item">
                                <span className="metal-icon">🥇</span>
                                <div>
                                    <strong>{result.metals.gold.amount.toFixed(4)} oz</strong>
                                    <p>Gold</p>
                                </div>
                            </div>

                            <div className="metal-item">
                                <span className="metal-icon">🥈</span>
                                <div>
                                    <strong>{result.metals.silver.amount.toFixed(2)} oz</strong>
                                    <p>Silver</p>
                                </div>
                            </div>

                            <div className="metal-item">
                                <span className="metal-icon">⚪</span>
                                <div>
                                    <strong>{result.metals.platinum.amount.toFixed(4)} oz</strong>
                                    <p>Platinum</p>
                                </div>
                            </div>
                        </div>

                        <div className="time-value">
                            <span className="time-icon">⏰</span>
                            <div>
                                <strong>{result.timeValue.hours.toFixed(1)} hours</strong>
                                <p>of work ({result.timeValue.days.toFixed(1)} days)</p>
                            </div>
                        </div>

                        <div className="result-actions">
                            <button onClick={handleShareResult} className="share-button">
                                📤 Share Result
                            </button>

                            {/* A/B tested premium CTA */}
                            <button
                                onClick={handlePremiumUpgrade}
                                className="premium-cta"
                                style={{
                                    backgroundColor: ctaConfig.buttonColor || '#D4AF37',
                                    color: ctaVariant === 'urgent' ? '#FFFFFF' : '#001F3F'
                                }}
                            >
                                {ctaConfig.text || 'Try Premium'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Premium Prompt Modal */}
            {showPremiumPrompt && (
                <div className="premium-prompt-modal">
                    <div className="modal-content">
                        <h3>🚀 Unlock Advanced Features!</h3>
                        <p>You've calculated a high-value portfolio! Unlock:</p>
                        <ul>
                            <li>📊 Advanced charts and trends</li>
                            <li>🤖 AI-powered insights</li>
                            <li>📈 Portfolio tracking</li>
                            <li>🎯 Price alerts</li>
                        </ul>

                        <div className="modal-actions">
                            <button onClick={handlePremiumUpgrade} className="upgrade-button">
                                Upgrade Now - $9.99/month
                            </button>
                            <button
                                onClick={() => {
                                    setShowPremiumPrompt(false);
                                    analytics.trackEvent('premium_prompt_dismissed');
                                }}
                                className="dismiss-button"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
        .enhanced-calculator {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: linear-gradient(135deg, #001F3F 0%, #1a365d 100%);
          border-radius: 16px;
          color: #FFFFFF;
        }

        .calculator-inputs {
          margin-bottom: 2rem;
        }

        .input-group {
          margin-bottom: 1rem;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #D4AF37;
          font-weight: bold;
        }

        .input-group select,
        .input-group input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #D4AF37;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.1);
          color: #FFFFFF;
          font-size: 1rem;
        }

        .calculate-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #D4AF37 0%, #B8941F 100%);
          color: #001F3F;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .calculate-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(212, 175, 55, 0.3);
        }

        .calculate-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .calculator-results {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 2rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
        }

        .result-card {
          text-align: center;
        }

        .usd-value {
          font-size: 2rem;
          margin-bottom: 2rem;
          color: #D4AF37;
        }

        .usd-value span {
          display: block;
          font-size: 1rem;
          color: #FFFFFF;
          margin-top: 0.5rem;
        }

        .metals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .metal-item {
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .metal-icon {
          font-size: 1.5rem;
        }

        .time-value {
          background: rgba(16, 185, 129, 0.2);
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 2rem;
        }

        .time-icon {
          font-size: 1.5rem;
        }

        .result-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .share-button,
        .premium-cta {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .share-button {
          background: rgba(59, 130, 246, 0.8);
          color: #FFFFFF;
        }

        .share-button:hover {
          background: rgba(59, 130, 246, 1);
        }

        .premium-cta {
          background: #D4AF37;
          color: #001F3F;
        }

        .premium-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        .premium-prompt-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: #001F3F;
          padding: 2rem;
          border-radius: 16px;
          border: 2px solid #D4AF37;
          max-width: 500px;
          text-align: center;
        }

        .modal-content h3 {
          color: #D4AF37;
          margin-bottom: 1rem;
        }

        .modal-content ul {
          text-align: left;
          margin: 1rem 0;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
        }

        .upgrade-button {
          background: #D4AF37;
          color: #001F3F;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
        }

        .dismiss-button {
          background: transparent;
          color: #FFFFFF;
          padding: 0.75rem 1.5rem;
          border: 1px solid #FFFFFF;
          border-radius: 8px;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default EnhancedCalculator;
