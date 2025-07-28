// app/calculator/[crypto]/[amount]/page.tsx - Dynamic SSR calculator pages for SEO
import { calculateTimeValue, generateShareableText, getCryptoPrices, getMetalPrices } from '@/lib/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

// Define supported cryptocurrencies
const SUPPORTED_CRYPTOS = [
    'bitcoin', 'ethereum', 'ripple', 'cardano', 'solana', 'dogecoin',
    'litecoin', 'chainlink', 'polygon', 'avalanche'
];

interface PageProps {
    params: Promise<{
        crypto: string;
        amount: string;
    }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { crypto, amount } = await params;

    // Validate parameters
    if (!SUPPORTED_CRYPTOS.includes(crypto) || isNaN(Number(amount))) {
        return {
            title: 'Calculator Not Found - TimeVault',
            description: 'The requested crypto calculator page was not found.'
        };
    }

    // Fetch data for metadata
    const [cryptoPrices, metalPrices] = await Promise.all([
        getCryptoPrices([crypto]),
        getMetalPrices()
    ]);

    const cryptoData = cryptoPrices[0];
    if (!cryptoData) {
        return {
            title: 'Calculator Not Found - TimeVault',
            description: 'The requested cryptocurrency was not found.'
        };
    }

    const amountNum = Number(amount);
    const totalValue = cryptoData.current_price * amountNum;
    const workHoursNum = totalValue / 25; // Simple hours calculation
    const goldOunces = totalValue / metalPrices.gold;

    const title = `${amount} ${cryptoData.symbol.toUpperCase()} = ${workHoursNum.toFixed(1)} Hours | ${goldOunces.toFixed(2)} oz Gold - TimeVault Calculator`;
    const description = `${amount} ${cryptoData.name} (${cryptoData.symbol.toUpperCase()}) is worth $${totalValue.toLocaleString()} = ${workHoursNum.toFixed(1)} hours of work at $25/hour or ${goldOunces.toFixed(2)} ounces of gold. Free crypto time calculator.`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url: `https://timevaultai.com/calculator/${crypto}/${amount}`,
            images: [
                {
                    url: `/api/og/calculator?crypto=${crypto}&amount=${amount}&value=${totalValue}&hours=${workHoursNum.toFixed(1)}`,
                    width: 1200,
                    height: 630,
                    alt: `${amount} ${cryptoData.symbol.toUpperCase()} Time Calculator`
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`/api/og/calculator?crypto=${crypto}&amount=${amount}&value=${totalValue}&hours=${workHoursNum.toFixed(1)}`]
        }
    };
}

// Generate static paths for popular combinations
export async function generateStaticParams() {
    const popularCombos = [
        { crypto: 'bitcoin', amount: '1' },
        { crypto: 'bitcoin', amount: '0.1' },
        { crypto: 'bitcoin', amount: '0.01' },
        { crypto: 'ethereum', amount: '1' },
        { crypto: 'ethereum', amount: '10' },
        { crypto: 'ripple', amount: '1000' },
        { crypto: 'ripple', amount: '10000' },
        { crypto: 'cardano', amount: '1000' },
        { crypto: 'solana', amount: '10' },
        { crypto: 'solana', amount: '100' }
    ];

    return popularCombos;
}

export default async function CalculatorPage({ params }: PageProps) {
    const { crypto, amount } = await params;

    // Validate parameters
    if (!SUPPORTED_CRYPTOS.includes(crypto) || isNaN(Number(amount))) {
        notFound();
    }

    const amountNum = Number(amount);
    if (amountNum <= 0 || amountNum > 1000000) {
        notFound();
    }

    // Fetch data server-side for SEO
    const [cryptoPrices, metalPrices] = await Promise.all([
        getCryptoPrices([crypto, 'bitcoin', 'ethereum']),
        getMetalPrices()
    ]);

    const cryptoData = cryptoPrices.find(c => c.id === crypto);
    if (!cryptoData) {
        notFound();
    }

    // Calculate all conversions
    const totalValue = cryptoData.current_price * amountNum;
    const timeCalc = calculateTimeValue(amountNum, cryptoData.current_price, 25);
    const workHours = (totalValue / 25); // Simple hours calculation for display
    const goldOunces = totalValue / metalPrices.gold;
    const silverOunces = totalValue / metalPrices.silver;

    // Different wage calculations
    const wageCalculations = [
        { wage: 15, hours: totalValue / 15, label: "Minimum Wage ($15/hr)" },
        { wage: 25, hours: totalValue / 25, label: "Average Wage ($25/hr)" },
        { wage: 50, hours: totalValue / 50, label: "Professional ($50/hr)" },
        { wage: 100, hours: totalValue / 100, label: "Expert ($100/hr)" }
    ];

    // Generate shareable content
    const shareText = generateShareableText(timeCalc, cryptoData.symbol.toUpperCase());

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800">
            {/* Hero Section with Calculation Results */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {amount} {cryptoData.symbol.toUpperCase()} =
                        <span className="text-yellow-400"> {workHours.toFixed(1)} Hours</span>
                    </h1>
                    <p className="text-xl text-gray-300 mb-8">
                        {amount} {cryptoData.name} is worth <strong>${totalValue.toLocaleString()}</strong>
                        <br />
                        That&apos;s {workHours.toFixed(1)} hours of work at $25/hour
                    </p>

                    {/* Main Result Card */}
                    <div className="bg-blue-800 rounded-lg p-8 mb-8 border-l-4 border-yellow-400">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">
                                    ${totalValue.toLocaleString()}
                                </div>
                                <div className="text-gray-300">Total Value</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">
                                    {workHours.toFixed(1)}h
                                </div>
                                <div className="text-gray-300">Work Hours</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-yellow-400">
                                    {goldOunces.toFixed(2)} oz
                                </div>
                                <div className="text-gray-300">Gold Equivalent</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Conversions */}
            <section className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-12">
                    {/* Work Hours at Different Wages */}
                    <div className="bg-blue-800 rounded-lg p-8">
                        <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                            ⏰ Work Hours Breakdown
                        </h3>
                        <div className="space-y-4">
                            {wageCalculations.map((calc) => (
                                <div key={calc.wage} className="flex justify-between items-center p-4 bg-blue-700 rounded">
                                    <span className="text-white">{calc.label}</span>
                                    <span className="text-yellow-400 font-bold">
                                        {calc.hours.toFixed(1)} hours
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Precious Metals Conversions */}
                    <div className="bg-blue-800 rounded-lg p-8">
                        <h3 className="text-2xl font-bold text-yellow-400 mb-6">
                            🥇 Precious Metals
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-blue-700 rounded">
                                <span className="text-white">Gold (${metalPrices.gold}/oz)</span>
                                <span className="text-yellow-400 font-bold">
                                    {goldOunces.toFixed(3)} oz
                                </span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-blue-700 rounded">
                                <span className="text-white">Silver (${metalPrices.silver}/oz)</span>
                                <span className="text-yellow-400 font-bold">
                                    {silverOunces.toFixed(1)} oz
                                </span>
                            </div>
                            <div className="p-4 bg-blue-700 rounded">
                                <p className="text-gray-300 text-sm">
                                    Prices updated in real-time from Metals.live
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Share Section */}
            <section className="container mx-auto px-4 py-16 text-center">
                <div className="max-w-2xl mx-auto bg-blue-800 rounded-lg p-8">
                    <h3 className="text-2xl font-bold text-white mb-4">
                        📤 Share This Calculation
                    </h3>
                    <p className="text-gray-300 mb-6">
                        {shareText}
                    </p>
                    <div className="text-sm text-gray-400">
                        <p>Calculated at {new Date().toLocaleString()} using real-time prices</p>
                        <p>Data from CoinGecko • Metals.live • TimeVault.ai</p>
                    </div>
                </div>
            </section>

            {/* Related Calculations */}
            <section className="container mx-auto px-4 py-16">
                <h2 className="text-3xl font-bold text-white text-center mb-12">
                    🧮 Try Other Amounts
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[0.1, 0.5, 1, 2, 5, 10, 25, 100].map((relatedAmount) => {
                        const relatedValue = cryptoData.current_price * relatedAmount;
                        const relatedHours = relatedValue / 25; // Simple hours calculation
                        return (
                            <a
                                key={relatedAmount}
                                href={`/calculator/${crypto}/${relatedAmount}`}
                                className="bg-blue-800 hover:bg-blue-700 rounded-lg p-4 text-center transition-colors"
                            >
                                <div className="text-yellow-400 font-bold">
                                    {relatedAmount} {cryptoData.symbol.toUpperCase()}
                                </div>
                                <div className="text-white text-sm">
                                    {relatedHours.toFixed(1)} hours
                                </div>
                                <div className="text-gray-400 text-xs">
                                    ${relatedValue.toLocaleString()}
                                </div>
                            </a>
                        );
                    })}
                </div>
            </section>
        </main>
    );
}
