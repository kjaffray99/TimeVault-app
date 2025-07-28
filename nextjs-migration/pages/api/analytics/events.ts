import type { NextApiRequest, NextApiResponse } from 'next';

interface AnalyticsEvent {
    event: string;
    data: any;
    timestamp: number;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const events: AnalyticsEvent[] = req.body;

        // Validate events
        if (!Array.isArray(events)) {
            return res.status(400).json({ error: 'Invalid events format' });
        }

        // Process events (in production, you'd store these in a database)
        console.log(`Received ${events.length} analytics events`);

        // Log interesting events
        events.forEach(event => {
            if (event.event === 'performance_alert' || event.event === 'error') {
                console.warn('Important event:', event);
            }
        });

        // Send success response
        res.status(200).json({
            success: true,
            processed: events.length,
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Analytics processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
