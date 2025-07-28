// app/page.tsx - SEO-optimized homepage with server-side crypto data
import CryptoCalculator from '@/components/CryptoCalculator';
import { getCryptoPrices, getMetalPrices } from '@/lib/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TimeVault - Convert Your Crypto to Time & Precious Metals',
  description: 'Free crypto calculator: Convert Bitcoin, Ethereum, XRP to gold ounces, silver, and work hours. Real-time prices from CoinGecko. Calculate your crypto\'s true value now.',
  keywords: ['crypto calculator', 'bitcoin calculator', 'ethereum calculator', 'crypto to time', 'bitcoin to gold', 'crypto converter', 'work hours calculator'],
  openGraph: {
    title: 'TimeVault - Free Crypto Time Calculator',
    description: 'See how many hours of work your Bitcoin, Ethereum & other crypto is worth. Plus gold/silver conversions with real-time prices.',
    url: 'https://timevaultai.com',
    images: [
      {
        url: '/api/og/homepage',
        width: 1200,
        height: 630,
        alt: 'TimeVault Crypto Time Calculator'
      }
    ]
  }
};

// This is a Server Component - data is fetched server-side for SEO
export default async function HomePage() {
  // Fetch crypto and metal prices server-side with fallbacks for instant load
  let cryptoPrices, metalPrices;

  try {
    [cryptoPrices, metalPrices] = await Promise.all([
      getCryptoPrices(['bitcoin', 'ethereum', 'ripple', 'cardano', 'solana']),
      getMetalPrices()
    ]);
  } catch (error) {
    // Fallback data for immediate content rendering
    console.log('Using fallback data for SSR:', error);
    cryptoPrices = [
      { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 97500, price_change_percentage_24h: 2.5, market_cap: 1900000000000, last_updated: new Date().toISOString(), price_change_24h: 2375 },
      { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 3400, price_change_percentage_24h: 1.8, market_cap: 410000000000, last_updated: new Date().toISOString(), price_change_24h: 60 },
      { id: 'ripple', symbol: 'xrp', name: 'XRP', current_price: 2.45, price_change_percentage_24h: 0.5, market_cap: 140000000000, last_updated: new Date().toISOString(), price_change_24h: 0.012 },
      { id: 'cardano', symbol: 'ada', name: 'Cardano', current_price: 1.12, price_change_percentage_24h: -0.8, market_cap: 40000000000, last_updated: new Date().toISOString(), price_change_24h: -0.009 },
      { id: 'solana', symbol: 'sol', name: 'Solana', current_price: 245, price_change_percentage_24h: 3.2, market_cap: 115000000000, last_updated: new Date().toISOString(), price_change_24h: 7.6 }
    ];
    metalPrices = { gold: 2650, silver: 29.50, timestamp: new Date().toISOString() };
  }

  // Generate sample calculations for SEO content
  const btcSampleCalc = {
    amount: 1,
    price: cryptoPrices.find(c => c.id === 'bitcoin')?.current_price || 97500,
    hours: (cryptoPrices.find(c => c.id === 'bitcoin')?.current_price || 97500) / 25
  };

  const ethSampleCalc = {
    amount: 1,
    price: cryptoPrices.find(c => c.id === 'ethereum')?.current_price || 3400,
    hours: (cryptoPrices.find(c => c.id === 'ethereum')?.current_price || 3400) / 25
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
      {/* Hero Section with SEO-rich content */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            🏆 <span className="text-yellow-400">TimeVault</span>
            <br />Free Crypto Time Calculator
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Convert your Bitcoin, Ethereum, XRP to <strong>work hours</strong> and <strong>precious metals</strong>
            <br />Real-time prices • Free forever • No signup required
          </p>

          {/* Live sample calculations for SEO */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-blue-800 rounded-lg p-6 border-l-4 border-yellow-400">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">
                🟡 Bitcoin Calculator
              </h3>
              <p className="text-white text-lg">
                1 BTC = <strong>{btcSampleCalc.hours.toFixed(1)} hours</strong> of work
                <br />
                <span className="text-gray-400">
                  ${btcSampleCalc.price.toLocaleString()} ÷ $25/hour
                </span>
              </p>
            </div>

            <div className="bg-blue-800 rounded-lg p-6 border-l-4 border-yellow-400">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">
                🔹 Ethereum Calculator
              </h3>
              <p className="text-white text-lg">
                1 ETH = <strong>{ethSampleCalc.hours.toFixed(1)} hours</strong> of work
                <br />
                <span className="text-gray-400">
                  ${ethSampleCalc.price.toLocaleString()} ÷ $25/hour
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Calculator Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            🧮 Calculate Your Crypto&apos;s True Value
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Enter any amount of cryptocurrency below to see how many hours of work it represents
            and how much gold or silver you could buy with it.
          </p>
        </div>


        <CryptoCalculator
          initialCryptoPrices={cryptoPrices}
          initialMetalPrices={metalPrices}
        />
      </section>      {/* SEO Content Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Live Price Display for SEO */}
          <div className="bg-blue-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">
              📊 Live Crypto Prices
            </h3>
            <div className="space-y-4">
              {cryptoPrices.slice(0, 5).map((crypto) => (
                <div key={crypto.id} className="flex justify-between items-center">
                  <span className="text-white font-medium">
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </span>
                  <div className="text-right">
                    <div className="text-yellow-400 font-bold">
                      ${crypto.current_price.toLocaleString()}
                    </div>
                    <div className={`text-sm ${crypto.price_change_percentage_24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {crypto.price_change_percentage_24h > 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Precious Metals for SEO */}
          <div className="bg-blue-800 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-yellow-400 mb-6">
              🥇 Precious Metals Prices
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Gold (1 oz)</span>
                <div className="text-yellow-400 font-bold">
                  ${metalPrices.gold.toLocaleString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Silver (1 oz)</span>
                <div className="text-yellow-400 font-bold">
                  ${metalPrices.silver.toLocaleString()}
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-700 rounded">
                <p className="text-gray-300 text-sm">
                  <strong>Example:</strong> 1 Bitcoin could buy{' '}
                  <span className="text-yellow-400">
                    {(btcSampleCalc.price / metalPrices.gold).toFixed(2)} oz
                  </span>{' '}
                  of gold
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Footer Content */}
      <section className="container mx-auto px-4 py-16 border-t border-blue-700">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">
            Why Calculate Crypto in Time & Precious Metals?
          </h2>
          <div className="text-gray-300 space-y-4 text-lg leading-relaxed">
            <p>
              TimeVault helps you understand the <strong>real value</strong> of your cryptocurrency
              investments by converting them into tangible metrics: work hours based on your wage,
              and precious metals like gold and silver.
            </p>
            <p>
              Our free crypto calculator uses real-time data from CoinGecko and Metals.live to give
              you accurate conversions for Bitcoin (BTC), Ethereum (ETH), XRP, Cardano (ADA),
              Solana (SOL), and more cryptocurrencies.
            </p>
            <p>
              Whether you&apos;re tracking your portfolio growth, planning investments, or simply
              curious about your crypto&apos;s purchasing power, TimeVault provides the perspective
              you need to make informed decisions.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
