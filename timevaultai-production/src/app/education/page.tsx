/**
 * 🎓 TIMEVAULT EDUCATION CENTER
 * Comprehensive crypto education platform for user engagement and premium conversions
 */

import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports for performance
const EducationDashboard = dynamic(() => import('@/components/education/EducationDashboard'), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#D4AF37] font-semibold text-lg">Loading Education Center...</p>
      </div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Crypto Education Center | TimeVault AI - Learn Bitcoin, Ethereum & Investment Strategies',
  description: 'Master cryptocurrency investing with TimeVault\'s comprehensive education platform. Learn Bitcoin, Ethereum, DeFi, and precious metals investment strategies through interactive courses, quizzes, and tutorials.',
  keywords: 'crypto education, bitcoin learning, ethereum courses, cryptocurrency investment, DeFi tutorials, precious metals investing, crypto trading strategies, blockchain education',
  openGraph: {
    title: 'Crypto Education Center | TimeVault AI',
    description: 'Master cryptocurrency investing with comprehensive courses, quizzes, and expert insights.',
    type: 'website',
    images: [
      {
        url: '/og-education.png',
        width: 1200,
        height: 630,
        alt: 'TimeVault Education Center'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Master Crypto Investing | TimeVault Education',
    description: 'Learn Bitcoin, Ethereum, and investment strategies through interactive courses.',
    images: ['/twitter-education.png']
  }
};

export default function EducationPage() {
  return (
    <>
      {/* JSON-LD Schema for Education Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "TimeVault Crypto Education Center",
            "description": "Comprehensive cryptocurrency and investment education platform",
            "url": process.env.SITE_URL + "/education",
            "courseMode": "online",
            "educationalCredentialAwarded": "Digital Certificates",
            "teaches": [
              "Cryptocurrency Fundamentals",
              "Bitcoin Investment Strategies",
              "Ethereum and DeFi",
              "Precious Metals Investing",
              "Portfolio Diversification",
              "Risk Management"
            ],
            "provider": {
              "@type": "Organization",
              "name": "TimeVault AI",
              "url": process.env.SITE_URL
            }
          })
        }}
      />

      <main className="min-h-screen">
        <Suspense fallback={
          <div className="min-h-screen bg-gradient-to-br from-[#001F3F] to-[#003366] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[#D4AF37] font-semibold text-lg">Loading Education Center...</p>
            </div>
          </div>
        }>
          <EducationDashboard />
        </Suspense>
      </main>
    </>
  );
}
