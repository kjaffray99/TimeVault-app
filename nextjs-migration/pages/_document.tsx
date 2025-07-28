import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    render() {
        return (
            <Html lang="en">
                <Head>
                    {/* Primary Meta Tags */}
                    <meta name="title" content="TimeVault - Convert Crypto to Time & Precious Metals" />
                    <meta name="description" content="Transform your Bitcoin, Ethereum, and crypto assets into personal time equivalents and precious metals. Learn, earn TVLT tokens, and optimize your digital wealth." />
                    <meta name="keywords" content="crypto calculator, bitcoin to time, ethereum calculator, precious metals, digital assets, cryptocurrency converter, time value, TVLT token" />
                    <meta name="author" content="TimeVault" />
                    <meta name="robots" content="index, follow" />

                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://timevault.vercel.app/" />
                    <meta property="og:title" content="TimeVault - Convert Crypto to Time & Precious Metals" />
                    <meta property="og:description" content="Transform your Bitcoin, Ethereum, and crypto assets into personal time equivalents and precious metals. Learn, earn TVLT tokens, and optimize your digital wealth." />
                    <meta property="og:image" content="https://timevault.vercel.app/og-image.png" />

                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://timevault.vercel.app/" />
                    <meta property="twitter:title" content="TimeVault - Convert Crypto to Time & Precious Metals" />
                    <meta property="twitter:description" content="Transform your Bitcoin, Ethereum, and crypto assets into personal time equivalents and precious metals." />
                    <meta property="twitter:image" content="https://timevault.vercel.app/og-image.png" />

                    {/* Favicon */}
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

                    {/* Structured Data */}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "WebApplication",
                                "name": "TimeVault",
                                "description": "Convert cryptocurrency to time and precious metals",
                                "url": "https://timevault.vercel.app",
                                "applicationCategory": "FinanceApplication",
                                "operatingSystem": "Web Browser",
                                "offers": {
                                    "@type": "Offer",
                                    "price": "0",
                                    "priceCurrency": "USD"
                                }
                            })
                        }}
                    />

                    {/* Performance hints */}
                    <link rel="preconnect" href="https://api.coingecko.com" />
                    <link rel="preconnect" href="https://metals.live" />
                    <link rel="dns-prefetch" href="https://api.coingecko.com" />
                    <link rel="dns-prefetch" href="https://metals.live" />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
