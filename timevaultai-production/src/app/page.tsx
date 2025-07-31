import AccessibilityPanel from '@/components/AccessibilityPanel';
import PerformanceMonitor from '@/components/PerformanceMonitor';
import ProgressiveWebApp from '@/components/ProgressiveWebApp';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic import for COMPREHENSIVE FREE CALCULATOR - ALL FEATURES UNLOCKED
const ComprehensiveFreeCalculator = dynamic(
  () => import('@/components/ComprehensiveFreeCalculator'),
  {
    ssr: true,
    loading: () => (
      <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#D4AF37] font-semibold text-lg">Loading Free Premium Calculator...</p>
          <p className="text-[#C0C0C0] text-sm mt-2">All features unlocked - completely free!</p>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'TimeVault AI - Free Premium Calculator | 50+ Cryptocurrencies & Live Prices',
  description: 'Free premium cryptocurrency calculator with 50+ cryptocurrencies, live prices, precious metals conversion, and time value analysis. All features unlocked - no hidden costs!',
  keywords: 'free crypto calculator, bitcoin calculator, ethereum calculator, crypto to gold, crypto to silver, time value calculator, live crypto prices, precious metals calculator, cryptocurrency converter',
  metadataBase: new URL(process.env.SITE_URL || process.env.VERCEL_URL || 'https://timevaultai.com'),
  openGraph: {
    title: 'TimeVault AI - Premium Crypto Calculator with Live Data',
    description: 'Advanced cryptocurrency calculator with live prices, portfolio tracking, and AI insights. Convert crypto to precious metals and time value.',
    type: 'website',
    siteName: 'TimeVault AI',
    images: [
      {
        url: '/og-premium-calculator.png',
        width: 1200,
        height: 630,
        alt: 'TimeVault AI Premium Calculator'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeVault AI - Premium Crypto Calculator',
    description: 'Advanced crypto calculator with live prices, portfolio tracking, and AI insights.',
    images: ['/twitter-premium-calculator.png']
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

export default function HomePage() {
  return (
    <>
      {/* JSON-LD Schema for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "TimeVault AI Premium Calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "description": "Advanced cryptocurrency calculator with live prices, portfolio tracking, and AI insights for converting digital assets to precious metals and time value",
            "url": process.env.SITE_URL || "https://timevaultai.com",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "1247"
            },
            "featureList": [
              "Live cryptocurrency prices from 50+ assets",
              "Advanced precious metals conversion",
              "Personal time value calculation",
              "Portfolio tracking and analytics",
              "AI-powered investment insights",
              "Real-time price alerts",
              "Educational content and courses",
              "WCAG accessibility compliance"
            ]
          })
        }}
      />

      <main className="min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#D4AF37] font-semibold text-lg">Loading Free Premium Calculator...</p>
              <p className="text-[#C0C0C0] text-sm mt-2">All features unlocked - completely free!</p>
            </div>
          </div>
        }>
          <ComprehensiveFreeCalculator />
        </Suspense>
      </main>

      {/* Progressive Web App Features */}
      <ProgressiveWebApp />

      {/* Service Worker Registration */}
      <ServiceWorkerRegistration />

      {/* Accessibility Panel */}
      <AccessibilityPanel />

      {/* Performance Monitor */}
      <PerformanceMonitor />
    </>
  );
}
