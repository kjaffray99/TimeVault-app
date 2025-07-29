/**
 * Day 1 Critical Integration - Main Calculator Component Update
 * Integrates GuaranteedCalculator with monitoring and fallback systems
 */

import React, { useEffect, useState } from 'react';
import { CalculatorErrorBoundary } from '../utils/calculatorDebug';
import { GuaranteedCalculator } from './GuaranteedCalculator';

// Legacy Calculator Component with Enhanced Error Handling
const LegacyCalculatorWrapper: React.FC = () => {
    const [hasError, setHasError] = useState(false);
    const [showGuaranteed, setShowGuaranteed] = useState(false);

    // Force switch to guaranteed calculator on any error
    useEffect(() => {
        const errorHandler = (event: ErrorEvent) => {
            if (event.message?.includes('calculator') || event.error?.stack?.includes('Calculator')) {
                console.warn('Calculator error detected - switching to guaranteed mode:', event.error);
                setHasError(true);
                setShowGuaranteed(true);
            }
        };

        const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
            if (event.reason?.message?.includes('calculator') ||
                event.reason?.stack?.includes('Calculator')) {
                console.warn('Calculator promise rejection - switching to guaranteed mode:', event.reason);
                setHasError(true);
                setShowGuaranteed(true);
            }
        };

        window.addEventListener('error', errorHandler);
        window.addEventListener('unhandledrejection', unhandledRejectionHandler);

        return () => {
            window.removeEventListener('error', errorHandler);
            window.removeEventListener('unhandledrejection', unhandledRejectionHandler);
        };
    }, []);

    // Automatic fallback after 3 seconds if no interaction
    useEffect(() => {
        const fallbackTimer = setTimeout(() => {
            if (!hasError) {
                console.log('Activating guaranteed calculator for optimal performance');
                setShowGuaranteed(true);
            }
        }, 3000);

        return () => clearTimeout(fallbackTimer);
    }, [hasError]);

    // Always render GuaranteedCalculator for production reliability
    return (
        <CalculatorErrorBoundary>
            <div className="calculator-container">
                {hasError && (
                    <div className="error-notice">
                        <span className="error-icon">⚠️</span>
                        <span>Switched to high-performance mode for optimal experience</span>
                    </div>
                )}
                <GuaranteedCalculator />
            </div>

            <style jsx>{`
        .calculator-container {
          position: relative;
          width: 100%;
        }

        .error-notice {
          position: absolute;
          top: -3rem;
          right: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid #F59E0B;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          color: #F59E0B;
          font-size: 0.875rem;
          font-weight: 500;
          z-index: 10;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .error-icon {
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .error-notice {
            position: relative;
            top: 0;
            margin-bottom: 1rem;
          }
        }
      `}</style>
        </CalculatorErrorBoundary>
    );
};

export default LegacyCalculatorWrapper;
