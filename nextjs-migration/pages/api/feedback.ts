import type { NextApiRequest, NextApiResponse } from 'next';

interface FeedbackData {
    rating: number;
    feedback: string;
    context: string;
    timestamp: number;
    user_id: string;
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const feedbackData: FeedbackData = req.body;

        // Validate feedback data
        if (!feedbackData.rating || feedbackData.rating < 1 || feedbackData.rating > 5) {
            return res.status(400).json({ error: 'Invalid rating' });
        }

        if (!feedbackData.context) {
            return res.status(400).json({ error: 'Context is required' });
        }

        // Process feedback (in production, store in database)
        console.log('Customer feedback received:', {
            rating: feedbackData.rating,
            context: feedbackData.context,
            has_feedback: feedbackData.feedback.length > 0,
            timestamp: feedbackData.timestamp
        });

        // Alert for low ratings
        if (feedbackData.rating <= 2) {
            console.warn('🚨 Low rating feedback:', feedbackData);
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: 'Feedback received',
            timestamp: Date.now()
        });

    } catch (error) {
        console.error('Feedback processing error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
