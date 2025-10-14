// Modern Service Worker for Portfolio Hub 2025
const CACHE_NAME = 'portfolio-hub-2025';
const CACHE_VERSION = '1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic-${CACHE_VERSION}`;

// Development mode detection
const IS_DEVELOPMENT = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

// Static assets to cache (only external resources in development)
const STATIC_ASSETS = IS_DEVELOPMENT ? [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115'
] : [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115'
];

// Dynamic assets patterns
const DYNAMIC_PATTERNS = [
    /^https:\/\/ik\.imagekit\.io\/ItsWatuyusei\/Image\//,
    /^https:\/\/fonts\.googleapis\.com\/css/,
    /^https:\/\/cdnjs\.cloudflare\.com/,
    /^https:\/\/fonts\.gstatic\.com/
];

// Install event - cache static assets
self.addEventListener('install', event => {
    console.log('Portfolio Hub Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static assets for Portfolio Hub...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Portfolio Hub static assets cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache Portfolio Hub static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Portfolio Hub Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(cacheName => {
                            return cacheName.startsWith(CACHE_NAME) && 
                                   cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE;
                        })
                        .map(cacheName => {
                            console.log('Deleting old Portfolio Hub cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('Portfolio Hub Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip chrome-extension and other non-http requests
    if (!request.url.startsWith('http')) {
        return;
    }
    
    event.respondWith(
        handleRequest(request)
    );
});

async function handleRequest(request) {
    const url = new URL(request.url);
    const cache = await caches.open(DYNAMIC_CACHE);
    
    // In development, skip cache for local files
    if (IS_DEVELOPMENT && (url.origin === location.origin)) {
        try {
            console.log('Development mode: fetching from network:', request.url);
            const networkResponse = await fetch(request);
            return networkResponse;
        } catch (error) {
            console.error('Network request failed in development:', request.url, error);
            return new Response('Development mode: Network error', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        }
    }
    
    try {
        // Try to serve from cache first
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            // Check if cache is still fresh (less than 24 hours for images, 1 hour for others)
            const cacheDate = cachedResponse.headers.get('sw-cache-date');
            const isImage = request.destination === 'image';
            const maxAge = isImage ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 24h for images, 1h for others
            
            if (cacheDate && (Date.now() - parseInt(cacheDate)) < maxAge) {
                console.log('Serving Portfolio Hub from cache:', request.url);
                return cachedResponse;
            }
        }
        
        // Fetch from network
        console.log('Fetching Portfolio Hub from network:', request.url);
        const networkResponse = await fetch(request);
        
        // Clone response for caching
        const responseClone = networkResponse.clone();
        
        // Cache successful responses
        if (networkResponse.ok && shouldCache(request)) {
            // Add cache timestamp
            const headers = new Headers(responseClone.headers);
            headers.set('sw-cache-date', Date.now().toString());
            
            const cachedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
            });
            
            await cache.put(request, cachedResponse);
            console.log('Cached Portfolio Hub response for:', request.url);
        }
        
        return networkResponse;
        
    } catch (error) {
        console.error('Network request failed for Portfolio Hub:', request.url, error);
        
        // Return cached version if available
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            console.log('Serving stale Portfolio Hub cache for:', request.url);
            return cachedResponse;
        }
        
        // Return offline page for navigation requests
        if (request.destination === 'document') {
            return caches.match('/index.html');
        }
        
        // Return a generic offline response
        return new Response('Portfolio Hub is offline', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    }
}

function shouldCache(request) {
    const url = new URL(request.url);
    
    // Cache images and fonts
    if (request.destination === 'image' || request.destination === 'font') {
        return true;
    }
    
    // Cache assets from our domain
    if (url.origin === location.origin) {
        return true;
    }
    
    // Cache assets from trusted CDNs
    return DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url));
}

// Background sync for analytics (if needed)
self.addEventListener('sync', event => {
    if (event.tag === 'portfolio-hub-analytics') {
        event.waitUntil(
            syncPortfolioHubAnalytics()
        );
    }
});

async function syncPortfolioHubAnalytics() {
    console.log('Syncing Portfolio Hub analytics data...');
    // Implement analytics sync logic here
}

// Push notifications (for future use)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Open Portfolio Hub'
                },
                {
                    action: 'close',
                    title: 'Close'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/')
        );
    }
});

// Performance monitoring
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PORTFOLIO_HUB_PERFORMANCE') {
        console.log('Portfolio Hub performance metric:', event.data.metric);
    }
});

// Cache size management
async function manageCacheSize() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        // If cache has more than 100 items, remove oldest 20
        if (keys.length > 100) {
            const keysToDelete = keys.slice(0, 20);
            await Promise.all(keysToDelete.map(key => cache.delete(key)));
            console.log(`Cleaned up ${keysToDelete.length} items from Portfolio Hub ${cacheName}`);
        }
    }
}

// Run cache cleanup periodically
setInterval(manageCacheSize, 24 * 60 * 60 * 1000); // Every 24 hours

// Preload critical resources for Portfolio Hub
self.addEventListener('install', event => {
    event.waitUntil(
        preloadPortfolioHubResources()
    );
});

async function preloadPortfolioHubResources() {
    const criticalResources = [
        'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@300;400;500;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
    ];
    
    const cache = await caches.open(STATIC_CACHE);
    
    for (const resource of criticalResources) {
        try {
            const response = await fetch(resource);
            if (response.ok) {
                await cache.put(resource, response);
                console.log('Preloaded Portfolio Hub critical resource:', resource);
            }
        } catch (error) {
            console.warn('Failed to preload Portfolio Hub resource:', resource, error);
        }
    }
}

// Handle version-specific routing
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // Handle version routing
    if (url.pathname === '/v1/' || url.pathname === '/v1') {
        event.respondWith(
            caches.match('/v1/index.html')
        );
        return;
    }
    
    if (url.pathname === '/v2/' || url.pathname === '/v2') {
        event.respondWith(
            caches.match('/v2/index.html')
        );
        return;
    }
});

console.log('Portfolio Hub 2025 Service Worker loaded successfully!');
