import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";
import { EnhancementProvider } from "../components/EnhancementProvider";
import "./globals.css";

// Self-hosted Geist fonts for reliable builds and performance
const geistSans = GeistSans;
const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "TimeVault AI - Free Crypto Calculator | Convert Bitcoin, Ethereum to Gold & Time",
  description: "Free crypto calculator that converts Bitcoin, Ethereum, Solana, XRP, and other cryptocurrencies into precious metals (gold, silver, platinum) and personal time equivalents. Real-time prices, premium features.",
  keywords: "crypto calculator, bitcoin to gold, ethereum calculator, crypto to precious metals, time value calculator, BTC gold converter, ETH silver calculator, real-time crypto prices, premium features, TVLT tokens",
  authors: [{ name: "TimeVault AI Team" }],
  creator: "TimeVault AI",
  publisher: "TimeVault AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.SITE_URL || 'https://timevaultai.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "TimeVault AI - Free Crypto Calculator",
    description: "Convert cryptocurrencies to precious metals and time with real-time data",
    url: 'https://timevaultai.com',
    siteName: 'TimeVault AI',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TimeVault AI Crypto Calculator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TimeVault AI - Free Crypto Calculator',
    description: 'Convert cryptocurrencies to precious metals and time',
    images: ['/og-image.jpg'],
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
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    yandex: process.env.YANDEX_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#001F3F" />
        
        {/* Preload critical fonts for performance */}
        <link
          rel="preload"
          href="/fonts/geist-sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        
        {/* Revenue optimization - faster loading for better engagement */}
        <meta name="monetization" content="$wallet.money/p2p" />
      </head>
      <body className={`${geistSans.className} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        <EnhancementProvider>
          {children}
        </EnhancementProvider>
        
        {/* Performance monitoring for revenue optimization */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Track font loading performance for engagement optimization
              if ('fonts' in document) {
                document.fonts.ready.then(() => {
                  console.log('🎯 Fonts loaded - optimal engagement ready');
                  // Track for revenue analytics
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'font_load_complete', {
                      'event_category': 'performance',
                      'event_label': 'geist_fonts'
                    });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}