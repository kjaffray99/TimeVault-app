import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    // Add security headers
    const response = NextResponse.next();

    // Content compression and caching
    if (request.nextUrl.pathname.startsWith('/api/')) {
        response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    }

    // Static assets caching
    if (request.nextUrl.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
        response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    }

    // Gzip compression
    const acceptEncoding = request.headers.get('accept-encoding') || '';
    if (acceptEncoding.includes('gzip')) {
        response.headers.set('Content-Encoding', 'gzip');
    }

    // Performance monitoring headers
    response.headers.set('X-Response-Time', Date.now().toString());

    return response;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
