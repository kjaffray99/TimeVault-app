/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        appDir: true
    },
    images: {
        domains: ['api.coingecko.com', 'assets.coingecko.com', 'timevaultai.com'],
        formats: ['image/webp', 'image/avif']
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.coingecko.com https://api.metals.live; frame-ancestors 'none'; base-uri 'self'"
                    }
                ]
            }
        ];
    },
    async rewrites() {
        return [
            {
                source: '/api/og/:path*',
                destination: '/api/og/:path*'
            }
        ];
    }
};

module.exports = nextConfig;
