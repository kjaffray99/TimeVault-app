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
            gtag('config', 'GA_MEASUREMENT_ID');
          `}
        </Script>

        {children}
      </body>
    </html>
  )
}
