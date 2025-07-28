/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    // Production optimizations
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',

    // Performance optimizations
    optimizeFonts: true,
    compress: true,

    // SEO optimizations
    poweredByHeader: false,
    generateEtags: true,

    // Image optimization
    images: {
        domains: ['assets.coingecko.com', 'cdn.jsdelivr.net'],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 86400,
    },

    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://api.coingecko.com",
                            "style-src 'self' 'unsafe-inline'",
                            "img-src 'self' data: https: blob:",
                            "font-src 'self' data:",
                            "connect-src 'self' https://api.coingecko.com https://metals.live https://api.thirdweb.com",
                            "media-src 'self'",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-ancestors 'none'",
                            "upgrade-insecure-requests",
                        ].join('; '),
                    },
                ],
            },
        ];
    },

    // Redirects for SEO
    async redirects() {
        return [
            {
                source: '/home',
                destination: '/',
                permanent: true,
            },
        ];
    },

    // Webpack configuration for production
    webpack: (config, { isServer, dev }) => {
        // Production optimizations
        if (!dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all',
                    },
                },
            };
        }

        // Bundle analyzer in development
        if (process.env.ANALYZE === 'true' && !isServer) {
            const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
            config.plugins.push(
                new BundleAnalyzerPlugin({
                    analyzerMode: 'static',
                    openAnalyzer: false,
                })
            );
        }

        return config;
    },
};

module.exports = withBundleAnalyzer(nextConfig);
