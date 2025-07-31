/**
 * 🔧 TIMEVAULT SERVICE WORKER
 * Offline functionality and performance optimization
 */

const CACHE_NAME = 'timevault-v2.0.0';
const STATIC_CACHE = 'timevault-static-v2';
const API_CACHE = 'timevault-api-v2';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
    '/favicon.ico',
    '/_next/static/css/',
    '/_next/static/js/'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/crypto/prices',
    '/api/metals/prices'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installing...');

    event.waitUntil(
        Promise.all([
            // Cache static assets
            caches.open(STATIC_CACHE).then((cache) => {
                console.log('📦 Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS.filter(url => url !== '/'));
            }),

            // Skip waiting to activate immediately
            self.skipWaiting()
        ])
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('✅ Service Worker: Activating...');

    event.waitUntil(
        Promise.all([
            // Take control of all pages immediately
            self.clients.claim(),

            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== API_CACHE) {
                            console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch event - handle requests with caching strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension requests
    if (url.protocol === 'chrome-extension:') {
        return;
    }

    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
        // API requests - Network first, cache fallback
        event.respondWith(handleApiRequest(request));
    } else if (url.pathname.startsWith('/_next/static/')) {
        // Static assets - Cache first
        event.respondWith(handleStaticAsset(request));
    } else if (url.pathname === '/' || url.pathname.startsWith('/calculator')) {
        // HTML pages - Network first, cache fallback
        event.respondWith(handlePageRequest(request));
    } else {
        // Other requests - Network only
        event.respondWith(fetch(request));
    }
});

// Handle API requests - Network first with cache fallback
async function handleApiRequest(request) {
    const cache = await caches.open(API_CACHE);

    try {
        // Try network first
        const response = await fetch(request);

        if (response.ok) {
            // Cache successful responses
            cache.put(request, response.clone());
            return response;
        }

        // If network fails, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📡 Service Worker: Serving API from cache:', request.url);
            return cachedResponse;
        }

        return response;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📡 Service Worker: Network failed, serving API from cache:', request.url);
            return cachedResponse;
        }

        // Return offline response for critical API endpoints
        if (request.url.includes('/api/crypto/prices')) {
            return new Response(JSON.stringify({
                bitcoin: { usd: 97500, usd_24h_change: 2.4 },
                ethereum: { usd: 3850, usd_24h_change: 1.8 },
                solana: { usd: 185, usd_24h_change: 3.2 }
            }), {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            });
        }

        throw error;
    }
}

// Handle static assets - Cache first
async function handleStaticAsset(request) {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const response = await fetch(request);
        if (response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        console.error('❌ Service Worker: Failed to fetch static asset:', request.url);
        throw error;
    }
}

// Handle page requests - Network first with cache fallback
async function handlePageRequest(request) {
    const cache = await caches.open(STATIC_CACHE);

    try {
        // Try network first
        const response = await fetch(request);

        if (response.ok) {
            // Cache successful responses
            cache.put(request, response.clone());
            return response;
        }

        // If network fails, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📄 Service Worker: Serving page from cache:', request.url);
            return cachedResponse;
        }

        return response;
    } catch (error) {
        // Network failed, try cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('📄 Service Worker: Network failed, serving page from cache:', request.url);
            return cachedResponse;
        }

        // Return offline page
        return new Response(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>TimeVault - Offline</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              background: linear-gradient(135deg, #001F3F 0%, #003366 100%);
              color: white;
              margin: 0;
              padding: 20px;
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
            }
            .container {
              max-width: 400px;
            }
            .icon {
              font-size: 64px;
              margin-bottom: 20px;
            }
            h1 {
              color: #D4AF37;
              margin-bottom: 16px;
            }
            p {
              color: #B8C5D6;
              line-height: 1.6;
            }
            button {
              background: #D4AF37;
              color: #001F3F;
              border: none;
              padding: 12px 24px;
              border-radius: 8px;
              font-weight: 600;
              margin-top: 20px;
              cursor: pointer;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="icon">🔒</div>
            <h1>You're Offline</h1>
            <p>TimeVault is temporarily unavailable. Please check your internet connection and try again.</p>
            <p>Some features may still work with cached data.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
      </html>
    `, {
            headers: { 'Content-Type': 'text/html' },
            status: 200
        });
    }
}

// Background sync for when connection returns
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        console.log('🔄 Service Worker: Background sync triggered');
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Refresh critical data when connection returns
        const cache = await caches.open(API_CACHE);

        // Update crypto prices
        const cryptoResponse = await fetch('/api/crypto/prices');
        if (cryptoResponse.ok) {
            cache.put('/api/crypto/prices', cryptoResponse.clone());
        }

        // Update metals prices
        const metalsResponse = await fetch('/api/metals/prices');
        if (metalsResponse.ok) {
            cache.put('/api/metals/prices', metalsResponse.clone());
        }

        console.log('✅ Service Worker: Background sync completed');
    } catch (error) {
        console.error('❌ Service Worker: Background sync failed:', error);
    }
}

// Push notifications (for future premium features)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/icons/icon-192.png',
            badge: '/icons/badge-72.png',
            tag: 'timevault-notification',
            actions: [
                {
                    action: 'view',
                    title: 'View Calculator'
                }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'view') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('✅ TimeVault Service Worker loaded successfully');
