'use client';

import { trackOnboardingStep, trackPremiumUpgradeClick } from '@/lib/analytics';
import { useEffect, useState } from 'react';
import { PremiumUpgrade } from './PremiumUpgrade';

interface OnboardingFlowProps {
    userId?: string;
    onComplete?: () => void;
}

export function OnboardingFlow({ userId, onComplete }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [isVisible, setIsVisible] = useState(true);
    const [demoValues, setDemoValues] = useState({
        crypto: 'bitcoin',
        amount: '1',
        metal: 'gold',
    });

    const totalSteps = 5;

    useEffect(() => {
        // Track initial onboarding view
        trackOnboardingStep(1, 'Welcome Demo', false);
    }, []);

    const handleStepComplete = (step: number, stepName: string) => {
        trackOnboardingStep(step, stepName, true);

        if (step < totalSteps) {
            setCurrentStep(step + 1);
            trackOnboardingStep(step + 1, getStepName(step + 1), false);
        } else {
            // Onboarding complete
            trackOnboardingStep(step, stepName, true);
            setIsVisible(false);
            onComplete?.();
        }
    };

    const getStepName = (step: number): string => {
        const stepNames = {
            1: 'Welcome Demo',
            2: 'Value Proposition',
            3: 'Feature Tour',
            4: 'Premium Upgrade',
            5: 'First Calculation',
        };
        return stepNames[step as keyof typeof stepNames] || 'Unknown Step';
    };

    const handleSkipOnboarding = () => {
        trackOnboardingStep(currentStep, getStepName(currentStep), false);
        setIsVisible(false);
        onComplete?.();
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="onboarding-overlay">
            <div className="onboarding-container">
                {/* Progress Bar */}
                <div className="progress-bar">
                    <div className="progress-header">
                        <h3>Welcome to TimeVault AI</h3>
                        <button
                            className="skip-button"
                            onClick={handleSkipOnboarding}
                        >
                            Skip Tour
                        </button>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                        />
                    </div>
                    <div className="progress-text">
                        Step {currentStep} of {totalSteps}
                    </div>
                </div>

                {/* Step Content */}
                <div className="step-content">
                    {currentStep === 1 && (
                        <WelcomeDemo
                            onNext={() => handleStepComplete(1, 'Welcome Demo')}
                            demoValues={demoValues}
                            setDemoValues={setDemoValues}
                        />
                    )}

                    {currentStep === 2 && (
                        <ValueProposition
                            onNext={() => handleStepComplete(2, 'Value Proposition')}
                        />
                    )}

                    {currentStep === 3 && (
                        <FeatureTour
                            onNext={() => handleStepComplete(3, 'Feature Tour')}
                        />
                    )}

                    {currentStep === 4 && (
                        <PremiumUpgrade
                            className="onboarding-premium"
                            onUpgradeClick={(priceId) => {
                                trackPremiumUpgradeClick('Premium Plan', 29.99);
                                // Handle upgrade flow
                                handleStepComplete(4, 'Premium Upgrade');
                            }}
                        />
                    )}

                    {currentStep === 5 && (
                        <FirstCalculation
                            onNext={() => handleStepComplete(5, 'First Calculation')}
                            demoValues={demoValues}
                        />
                    )}
                </div>
            </div>

            <style jsx>{`
        .onboarding-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .onboarding-container {
          background: linear-gradient(135deg, #001F3F 0%, #003366 100%);
          border: 2px solid rgba(212, 175, 55, 0.3);
          border-radius: 24px;
          padding: 40px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }

        .progress-bar {
          margin-bottom: 40px;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .progress-header h3 {
          color: #D4AF37;
          font-size: 1.8rem;
          font-weight: 700;
          margin: 0;
        }

        .skip-button {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: #E0E0E0;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .skip-button:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .progress-track {
          background: rgba(255, 255, 255, 0.1);
          height: 8px;
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 10px;
        }

        .progress-fill {
          background: linear-gradient(90deg, #D4AF37 0%, #F4D03F 100%);
          height: 100%;
          border-radius: 4px;
          transition: width 0.5s ease;
        }

        .progress-text {
          text-align: center;
          color: #B0B0B0;
          font-size: 0.9rem;
        }

        .step-content {
          color: #FFFFFF;
        }

        @media (max-width: 768px) {
          .onboarding-container {
            padding: 25px 20px;
            margin: 10px;
          }

          .progress-header h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>
        </div>
    );
}

// Step 1: Welcome Demo
function WelcomeDemo({
    onNext,
    demoValues,
    setDemoValues
}: {
    onNext: () => void;
    demoValues: { [key: string]: number };
    setDemoValues: (values: { [key: string]: number }) => void;
}) {
    return (
        <div className="step-container">
            <div className="step-header">
                <h2>🚀 Welcome to the Future of Crypto Calculations!</h2>
                <p>Convert your crypto holdings into precious metals and time equivalents instantly.</p>
            </div>

            <div className="demo-calculator">
                <div className="demo-input">
                    <label>Select Cryptocurrency:</label>
                    <select
                        value={demoValues.crypto}
                        onChange={(e) => setDemoValues({ ...demoValues, crypto: e.target.value })}
                    >
                        <option value="bitcoin">Bitcoin (BTC)</option>
                        <option value="ethereum">Ethereum (ETH)</option>
                        <option value="ripple">XRP</option>
                    </select>
                </div>

                <div className="demo-input">
                    <label>Amount:</label>
                    <input
                        type="number"
                        value={demoValues.amount}
                        onChange={(e) => setDemoValues({ ...demoValues, amount: e.target.value })}
                        placeholder="Enter amount"
                    />
                </div>

                <div className="demo-result">
                    <div className="result-card">
                        <h4>💎 Gold Equivalent</h4>
                        <p className="result-value">$45,000.00</p>
                        <p className="result-subtitle">≈ 22.5 ounces of gold</p>
                    </div>
                </div>
            </div>

            <button className="next-button" onClick={onNext}>
                See What Makes TimeVault Special →
            </button>

            <style jsx>{`
        .step-container {
          text-align: center;
        }

        .step-header h2 {
          color: #D4AF37;
          font-size: 2rem;
          margin-bottom: 15px;
        }

        .step-header p {
          color: #E0E0E0;
          font-size: 1.1rem;
          margin-bottom: 30px;
        }

        .demo-calculator {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 30px;
        }

        .demo-input {
          margin-bottom: 20px;
          text-align: left;
        }

        .demo-input label {
          display: block;
          color: #E0E0E0;
          margin-bottom: 8px;
          font-weight: 500;
        }

        .demo-input select,
        .demo-input input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 12px;
          color: #FFFFFF;
          font-size: 1rem;
        }

        .demo-result {
          margin-top: 20px;
        }

        .result-card {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 20px;
        }

        .result-card h4 {
          color: #D4AF37;
          margin-bottom: 10px;
        }

        .result-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #FFFFFF;
          margin-bottom: 5px;
        }

        .result-subtitle {
          color: #B0B0B0;
          font-size: 0.9rem;
        }

        .next-button {
          background: linear-gradient(135deg, #D4AF37 0%, #F4D03F 100%);
          color: #001F3F;
          border: none;
          border-radius: 12px;
          padding: 15px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .next-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(212, 175, 55, 0.4);
        }
      `}</style>
        </div>
    );
}

// Step 2: Value Proposition
function ValueProposition({ onNext }: { onNext: () => void }) {
    return (
        <div className="step-container">
            <div className="step-header">
                <h2>💎 Why TimeVault is Revolutionary</h2>
                <p>The only platform that transforms your crypto into tangible value perspectives.</p>
            </div>

            <div className="value-grid">
                <div className="value-item">
                    <div className="value-icon">⚡</div>
                    <h3>Real-Time Pricing</h3>
                    <p>Live data from 15+ exchanges and precious metals markets</p>
                </div>

                <div className="value-item">
                    <div className="value-icon">🧮</div>
                    <h3>Smart Calculations</h3>
                    <p>Advanced algorithms for accurate conversions and time equivalents</p>
                </div>

                <div className="value-item">
                    <div className="value-icon">📊</div>
                    <h3>Portfolio Insights</h3>
                    <p>Track performance across multiple assets and timeframes</p>
                </div>

                <div className="value-item">
                    <div className="value-icon">🎯</div>
                    <h3>Investment Guidance</h3>
                    <p>AI-powered recommendations based on market analysis</p>
                </div>
            </div>

            <button className="next-button" onClick={onNext}>
                Explore Premium Features →
            </button>

            <style jsx>{`
        .value-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }

        .value-item {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 25px 20px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .value-item:hover {
          transform: translateY(-5px);
          background: rgba(212, 175, 55, 0.1);
        }

        .value-icon {
          font-size: 2.5rem;
          margin-bottom: 15px;
        }

        .value-item h3 {
          color: #D4AF37;
          font-size: 1.2rem;
          margin-bottom: 10px;
        }

        .value-item p {
          color: #E0E0E0;
          font-size: 0.95rem;
          line-height: 1.4;
        }
      `}</style>
        </div>
    );
}

// Step 3: Feature Tour
function FeatureTour({ onNext }: { onNext: () => void }) {
    return (
        <div className="step-container">
            <div className="step-header">
                <h2>🎯 Your Complete Crypto Toolkit</h2>
                <p>Everything you need to make informed crypto investment decisions.</p>
            </div>

            <div className="feature-showcase">
                <div className="feature-category">
                    <h3>🆓 Free Features</h3>
                    <ul>
                        <li>Basic crypto-to-metals calculator</li>
                        <li>Real-time price data</li>
                        <li>Mobile-optimized interface</li>
                        <li>Community support</li>
                    </ul>
                </div>

                <div className="feature-category premium">
                    <h3>⭐ Premium Features</h3>
                    <ul>
                        <li>AI-powered market insights</li>
                        <li>Advanced portfolio tracking</li>
                        <li>Historical trend analysis</li>
                        <li>Custom alert notifications</li>
                        <li>Export capabilities</li>
                        <li>Priority customer support</li>
                    </ul>
                </div>
            </div>

            <button className="next-button" onClick={onNext}>
                Ready to Upgrade? →
            </button>

            <style jsx>{`
        .feature-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
          margin: 30px 0;
        }

        .feature-category {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .feature-category.premium {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border-color: rgba(212, 175, 55, 0.3);
        }

        .feature-category h3 {
          color: #D4AF37;
          font-size: 1.4rem;
          margin-bottom: 20px;
        }

        .feature-category ul {
          list-style: none;
          padding: 0;
        }

        .feature-category li {
          padding: 8px 0;
          color: #E0E0E0;
          display: flex;
          align-items: center;
        }

        .feature-category li::before {
          content: '✨';
          margin-right: 10px;
          color: #D4AF37;
        }

        @media (max-width: 768px) {
          .feature-showcase {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
        </div>
    );
}

// Step 5: First Calculation
function FirstCalculation({ onNext, demoValues }: { onNext: () => void; demoValues: { [key: string]: number } }) {
    return (
        <div className="step-container">
            <div className="step-header">
                <h2>🎉 You&apos;re All Set!</h2>
                <p>Make your first calculation and start your TimeVault journey.</p>
            </div>

            <div className="celebration">
                <div className="celebration-icon">🚀</div>
                <h3>Welcome to TimeVault AI!</h3>
                <p>You now have access to the most advanced crypto calculator platform.</p>
            </div>

            <div className="next-steps">
                <h4>What&apos;s Next?</h4>
                <ul>
                    <li>Explore the calculator with real-time data</li>
                    <li>Set up your portfolio tracking</li>
                    <li>Join our community for tips and insights</li>
                    <li>Consider upgrading for premium features</li>
                </ul>
            </div>

            <button className="next-button" onClick={onNext}>
                Start Calculating! 🚀
            </button>

            <style jsx>{`
        .celebration {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(212, 175, 55, 0.05) 100%);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 16px;
          padding: 40px;
          text-align: center;
          margin: 30px 0;
        }

        .celebration-icon {
          font-size: 4rem;
          margin-bottom: 20px;
        }

        .celebration h3 {
          color: #D4AF37;
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        .celebration p {
          color: #E0E0E0;
          font-size: 1.1rem;
        }

        .next-steps {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 25px;
          margin: 20px 0;
          text-align: left;
        }

        .next-steps h4 {
          color: #D4AF37;
          margin-bottom: 15px;
        }

        .next-steps ul {
          list-style: none;
          padding: 0;
        }

        .next-steps li {
          padding: 8px 0;
          color: #E0E0E0;
          display: flex;
          align-items: center;
        }

        .next-steps li::before {
          content: '✓';
          margin-right: 10px;
          color: #4CAF50;
          font-weight: bold;
        }
      `}</style>
        </div>
    );
}
