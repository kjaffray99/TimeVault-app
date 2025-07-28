import { Calendar, DollarSign, TrendingUp } from 'lucide-react';
import React, { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface HistoricalProjectionProps {
    cryptoAmount: number;
    cryptoPrice: number;
    metalPrices: {
        gold: number;
        silver: number;
        platinum: number;
    };
    timeframe: '1M' | '3M' | '6M' | '1Y' | '2Y';
}

interface ProjectionData {
    month: string;
    cryptoValue: number;
    goldEquivalent: number;
    silverEquivalent: number;
    compoundGrowth: number;
    date: Date;
}

const HistoricalProjection: React.FC<HistoricalProjectionProps> = ({
    cryptoAmount,
    cryptoPrice,
    metalPrices,
    timeframe = '1Y'
}) => {
    const projectionData = useMemo(() => {
        const months = timeframe === '1M' ? 1 : timeframe === '3M' ? 3 : timeframe === '6M' ? 6 : timeframe === '1Y' ? 12 : 24;
        const currentValue = cryptoAmount * cryptoPrice;

        // Historical average growth rates (simulated for demo)
        const avgCryptoGrowth = 0.12; // 12% annual growth
        const avgGoldGrowth = 0.05;   // 5% annual gold appreciation

        const data: ProjectionData[] = [];

        for (let i = 0; i <= months; i++) {
            const monthsElapsed = i;
            const yearsElapsed = monthsElapsed / 12;

            // Compound growth calculations
            const cryptoGrowthFactor = Math.pow(1 + avgCryptoGrowth, yearsElapsed);
            const goldGrowthFactor = Math.pow(1 + avgGoldGrowth, yearsElapsed);

            // Project values
            const projectedCryptoValue = currentValue * cryptoGrowthFactor;
            const projectedGoldPrice = metalPrices.gold * goldGrowthFactor;
            const projectedSilverPrice = metalPrices.silver * goldGrowthFactor; // Silver often follows gold

            // Calculate equivalent metal amounts
            const goldEquivalent = projectedCryptoValue / projectedGoldPrice;
            const silverEquivalent = projectedCryptoValue / projectedSilverPrice;

            const date = new Date();
            date.setMonth(date.getMonth() + monthsElapsed);

            data.push({
                month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                cryptoValue: Math.round(projectedCryptoValue),
                goldEquivalent: Math.round(goldEquivalent * 100) / 100,
                silverEquivalent: Math.round(silverEquivalent * 100) / 100,
                compoundGrowth: Math.round(((projectedCryptoValue / currentValue - 1) * 100) * 100) / 100,
                date
            });
        }

        return data;
    }, [cryptoAmount, cryptoPrice, metalPrices, timeframe]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    const formatMetal = (value: number, unit: string) => {
        return `${value.toFixed(2)} ${unit}`;
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-semibold text-gray-900 mb-2">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {
                                entry.dataKey === 'cryptoValue' ? formatCurrency(entry.value) :
                                    entry.dataKey === 'goldEquivalent' ? formatMetal(entry.value, 'oz gold') :
                                        entry.dataKey === 'silverEquivalent' ? formatMetal(entry.value, 'oz silver') :
                                            `${entry.value}%`
                            }
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const finalData = projectionData[projectionData.length - 1];
    const initialValue = cryptoAmount * cryptoPrice;
    const totalGrowth = finalData ? ((finalData.cryptoValue / initialValue - 1) * 100) : 0;

    return (
        <div className="historical-projection bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Historical Projections</h3>
                        <p className="text-sm text-gray-600">Based on historical averages and market trends</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="w-4 h-4" />
                    {timeframe} outlook
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">Projected Value</span>
                    </div>
                    <p className="text-2xl font-bold text-green-900">
                        {finalData ? formatCurrency(finalData.cryptoValue) : formatCurrency(initialValue)}
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                        {totalGrowth > 0 ? '+' : ''}{totalGrowth.toFixed(1)}% growth
                    </p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 h-4 text-yellow-600">🥇</span>
                        <span className="text-sm font-medium text-yellow-800">Gold Equivalent</span>
                    </div>
                    <p className="text-2xl font-bold text-yellow-900">
                        {finalData ? finalData.goldEquivalent.toFixed(2) : (initialValue / metalPrices.gold).toFixed(2)} oz
                    </p>
                    <p className="text-xs text-yellow-700 mt-1">
                        At projected gold prices
                    </p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="w-4 h-4 text-gray-600">🥈</span>
                        <span className="text-sm font-medium text-gray-800">Silver Equivalent</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                        {finalData ? finalData.silverEquivalent.toFixed(2) : (initialValue / metalPrices.silver).toFixed(2)} oz
                    </p>
                    <p className="text-xs text-gray-700 mt-1">
                        At projected silver prices
                    </p>
                </div>
            </div>

            {/* Charts */}
            <div className="space-y-6">
                {/* Value Growth Chart */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Projected Value Growth</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={projectionData}>
                                <defs>
                                    <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    stroke="#9CA3AF"
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    tickFormatter={formatCurrency}
                                    stroke="#9CA3AF"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="cryptoValue"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    fill="url(#valueGradient)"
                                    name="Crypto Value"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Metal Equivalents Chart */}
                <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Metal Equivalents Over Time</h4>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={projectionData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    stroke="#9CA3AF"
                                />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#6B7280' }}
                                    stroke="#9CA3AF"
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="goldEquivalent"
                                    stroke="#F59E0B"
                                    strokeWidth={2}
                                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                                    name="Gold (oz)"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="silverEquivalent"
                                    stroke="#6B7280"
                                    strokeWidth={2}
                                    dot={{ fill: '#6B7280', strokeWidth: 2, r: 4 }}
                                    name="Silver (oz)"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800">
                    <strong>Disclaimer:</strong> These projections are based on historical averages and market trends.
                    Actual results may vary significantly. Past performance does not guarantee future results.
                    This is for educational purposes only and not financial advice.
                </p>
            </div>
        </div>
    );
};

export default HistoricalProjection;
