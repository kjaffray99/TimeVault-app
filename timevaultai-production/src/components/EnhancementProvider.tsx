'use client';

import Script from 'next/script';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface EnhancementContextType {
    analyticsLoaded: boolean;
    performanceMetrics: {
        loadTime: number;
        interactionTime: number;
        errorCount: number;
    };
    userSession: {
        startTime: number;
        interactions: number;
        calculationsPerformed: number;
    };
}

const EnhancementContext = createContext<EnhancementContextType | null>(null);

export const useEnhancement = () => {
    const context = useContext(EnhancementContext);
    if (!context) {
        throw new Error('useEnhancement must be used within EnhancementProvider');
    }
    return context;
};

export function EnhancementProvider({ children }: { children: React.ReactNode }) {
    const [analyticsLoaded, setAnalyticsLoaded] = useState(false);
    const [performanceMetrics, setPerformanceMetrics] = useState({
        loadTime: 0,
        interactionTime: 0,
        errorCount: 0,
    });
    const [userSession, setUserSession] = useState({
        startTime: Date.now(),
        interactions: 0,
        calculationsPerformed: 0,
    });

    useEffect(() => {
        // Track page load performance
        if (typeof window !== 'undefined') {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                        const navEntry = entry as PerformanceNavigationTiming;
                        setPerformanceMetrics(prev => ({
                            ...prev,
                            loadTime: navEntry.loadEventEnd - navEntry.loadEventStart,
                        }));
                    }
                });
            });

            observer.observe({ entryTypes: ['navigation'] });

            // Track user interactions
            const handleInteraction = () => {
                setUserSession(prev => ({
                    ...prev,
                    interactions: prev.interactions + 1,
                }));
            };

            document.addEventListener('click', handleInteraction);
            document.addEventListener('keydown', handleInteraction);

            return () => {
                observer.disconnect();
                document.removeEventListener('click', handleInteraction);
                document.removeEventListener('keydown', handleInteraction);
            };
        }
    }, []);

    // Register service worker
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then((registration) => {
                    console.log('Service Worker registered:', registration);
                })
                .catch((error) => {
                    console.error('Service Worker registration failed:', error);
                });
        }
    }, []);

    const contextValue: EnhancementContextType = {
        analyticsLoaded,
        performanceMetrics,
        userSession,
    };

    return (
        <EnhancementContext.Provider value={contextValue}>
            {/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
                strategy="afterInteractive"
                onLoad={() => setAnalyticsLoaded(true)}
            />
            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX', {
            page_title: 'TimeVault Crypto Calculator',
            custom_map: {
              'custom_parameter_1': 'calculator_usage',
              'custom_parameter_2': 'conversion_type'
            }
          });
        `}
            </Script>

            {/* Structured Data for SEO */}
            <Script
                id="structured-data"
                type="application/ld+json"
                strategy="afterInteractive"
            >
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebApplication",
                    "name": "TimeVault Crypto Calculator",
                    "url": "https://timevaultai.com",
                    "description": "Free cryptocurrency calculator that converts Bitcoin, Ethereum, and other crypto to precious metals and personal time equivalents",
                    "applicationCategory": "FinanceApplication",
                    "operatingSystem": "Web Browser",
                    "offers": {
                        "@type": "Offer",
                        "price": "0",
                        "priceCurrency": "USD"
                    },
                    "featureList": [
                        "Real-time cryptocurrency conversion",
                        "Precious metals calculation",
                        "Personal time value assessment",
                        "Multiple cryptocurrency support",
                        "Accessibility compliant"
                    ]
                })}
            </Script>

            {children}
        </EnhancementContext.Provider>
    );
}
