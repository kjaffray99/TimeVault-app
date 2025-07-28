import type { NextApiRequest, NextApiResponse } from 'next';

// Health check endpoint for monitoring
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const healthData = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        features: {
            premium: process.env.NEXT_PUBLIC_ENABLE_PREMIUM === 'true',
            nftMinting: process.env.NEXT_PUBLIC_ENABLE_NFT_MINTING === 'true',
            analytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
        },
        apis: {
            coingecko: process.env.NEXT_PUBLIC_COINGECKO_API_URL,
            metals: process.env.NEXT_PUBLIC_METALS_API_URL,
        },
    };

    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(healthData);
}
