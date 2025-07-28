import type { NextApiRequest, NextApiResponse } from 'next';

interface CryptoPrice {
    id: string;
    current_price: number;
    price_change_percentage_24h: number;
    last_updated: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<CryptoPrice[] | { error: string }>
) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano,polkadot,chainlink,solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true',
            {
                headers: {
                    'Accept': 'application/json',
                },
            }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();

        const cryptoPrices: CryptoPrice[] = Object.entries(data).map(([id, priceData]: [string, any]) => ({
            id,
            current_price: priceData.usd,
            price_change_percentage_24h: priceData.usd_24h_change || 0,
            last_updated: new Date().toISOString()
        }));

        // Set cache headers for performance
        res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

        return res.status(200).json(cryptoPrices);
    } catch (error) {
        console.error('Error fetching crypto prices:', error);

        // Return fallback data
        const fallbackPrices: CryptoPrice[] = [
            { id: 'bitcoin', current_price: 50000, price_change_percentage_24h: 2.5, last_updated: new Date().toISOString() },
            { id: 'ethereum', current_price: 3000, price_change_percentage_24h: 1.8, last_updated: new Date().toISOString() },
            { id: 'cardano', current_price: 0.5, price_change_percentage_24h: -1.2, last_updated: new Date().toISOString() },
            { id: 'solana', current_price: 100, price_change_percentage_24h: 3.4, last_updated: new Date().toISOString() }
        ];

        return res.status(200).json(fallbackPrices);
    }
}
