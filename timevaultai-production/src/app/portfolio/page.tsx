/**
 * 📊 PORTFOLIO TRACKING PAGE
 * Premium portfolio management and analytics platform
 */

import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import for Portfolio Dashboard
const PortfolioDashboard = dynamic(() => import('@/components/portfolio/PortfolioDashboard'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#D4AF37] font-semibold text-lg">Loading Portfolio Dashboard...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Portfolio Tracker | TimeVault AI - Advanced Crypto Portfolio Management',
  description: 'Track your cryptocurrency portfolio with advanced analytics, real-time performance metrics, and AI-powered insights. Premium portfolio management for serious investors.',
  keywords: 'crypto portfolio tracker, portfolio management, cryptocurrency analytics, investment tracking, portfolio performance, crypto dashboard, AI insights',
  openGraph: {
    title: 'Portfolio Tracker | TimeVault AI',
    description: 'Advanced cryptocurrency portfolio management with AI insights and real-time analytics.',
    type: 'website',
    images: [
      {
        url: '/og-portfolio.png',
        width: 1200,
        height: 630,
        alt: 'TimeVault AI Portfolio Tracker'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio Tracker | TimeVault AI',
    description: 'Advanced crypto portfolio management with AI insights.',
    images: ['/twitter-portfolio.png']
  }
};

export default function PortfolioPage() {
  return (
    <>
      {/* JSON-LD Schema for Portfolio Application */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "TimeVault AI Portfolio Tracker",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Any",
            "description": "Advanced cryptocurrency portfolio tracking and management platform with AI insights",
            "url": process.env.SITE_URL + "/portfolio",
            "offers": {
              "@type": "Offer",
              "price": "9.99",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "Real-time portfolio tracking",
              "Advanced analytics and insights",
              "AI-powered recommendations",
              "Performance benchmarking",
              "Risk assessment tools",
              "Tax reporting features"
            ]
          })
        }}
      />

      <main className="min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#D4AF37] font-semibold text-lg">Loading Portfolio Dashboard...</p>
            </div>
          </div>
        }>
          <PortfolioDashboard />
        </Suspense>
      </main>
    </>
  );
}
