import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'performance';

    try {
        const metrics = {
            performance: {
                timestamp: new Date().toISOString(),
                loadTime: Math.random() * 1000 + 500, // Simulated load time
                interactionTime: Math.random() * 100 + 50,
                errorCount: Math.floor(Math.random() * 3),
                memoryUsage: Math.random() * 100 + 50,
            },
            user: {
                timestamp: new Date().toISOString(),
                activeUsers: Math.floor(Math.random() * 100) + 20,
                conversions: Math.floor(Math.random() * 10) + 5,
                bounceRate: (Math.random() * 0.3 + 0.2).toFixed(2),
                avgSessionDuration: Math.floor(Math.random() * 300) + 180,
            },
            revenue: {
                timestamp: new Date().toISOString(),
                dailyRevenue: (Math.random() * 1000 + 500).toFixed(2),
                conversions: Math.floor(Math.random() * 20) + 10,
                conversionRate: (Math.random() * 0.05 + 0.02).toFixed(3),
                avgOrderValue: (Math.random() * 50 + 25).toFixed(2),
            },
        };

        return NextResponse.json(metrics[type as keyof typeof metrics] || metrics.performance);
    } catch (error) {
        console.error('Metrics API error:', error);
        return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
    }
}
