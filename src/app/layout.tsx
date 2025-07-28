import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from 'next/script';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: 'TimeVault - Convert Crypto to Time & Precious Metals',
    template: '%s | TimeVault'
  },
  description: 'Calculate the real value of your Bitcoin, Ethereum, and other cryptocurrencies in gold, silver, and personal work hours. Free crypto calculator with real-time prices.',
  keywords: ['crypto calculator', 'bitcoin to gold', 'ethereum calculator', 'precious metals', 'time value calculator', 'cryptocurrency converter'],
  authors: [{ name: 'TimeVault Team' }],
  creator: 'TimeVault',
  publisher: 'TimeVault',
  metadataBase: new URL('https://timevaultai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://timevaultai.com',
    title: 'TimeVault - Convert Crypto to Time & Precious Metals',
    description: 'Calculate the real value of your Bitcoin, Ethereum, and other cryptocurrencies in gold, silver, and personal work hours.',
    siteName: 'TimeVault',
    images: [
      {
        url: '/api/og/default',
        width: 1200,
        height: 630,
        alt: 'TimeVault - Crypto to Time Calculator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeVault - Convert Crypto to Time & Precious Metals',
    description: 'Calculate the real value of your Bitcoin, Ethereum, and other cryptocurrencies.',
    creator: '@TimeVaultAI',
    images: ['/api/og/default'],
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'GA_MEASUREMENT_ID', {
              custom_map: {
                'custom_parameter_1': 'calculator_usage',
                'custom_parameter_2': 'social_shares',
                'custom_parameter_3': 'premium_clicks'
              }
            });

            // Track calculator engagement for revenue optimization
            window.trackCalculatorUsage = function(crypto, amount, value) {
              gtag('event', 'calculator_usage', {
                'event_category': 'engagement',
                'event_label': crypto,
                'value': Math.round(value),
                'custom_parameter_1': amount
              });
            };

            // Track social sharing for viral growth
            window.trackSocialShare = function(platform, crypto) {
              gtag('event', 'social_share', {
                'event_category': 'viral',
                'event_label': platform,
                'custom_parameter_2': crypto
              });
            };

            // Track premium feature clicks for conversion optimization
            window.trackPremiumClick = function(feature) {
              gtag('event', 'premium_click', {
                'event_category': 'conversion',
                'event_label': feature,
                'custom_parameter_3': feature
              });
            };
          `}
        </Script>

        {/* Hotjar for user behavior insights */}
        <Script id="hotjar" strategy="afterInteractive">
          {`
            (function(h,o,t,j,a,r){
              h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
              h._hjSettings={hjid:3949180,hjsv:6};
              a=o.getElementsByTagName('head')[0];
              r=o.createElement('script');r.async=1;
              r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
              a.appendChild(r);
            })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
          `}
        </Script>

        {children}
      </body>
    </html>
  )
}
