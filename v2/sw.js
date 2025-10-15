const CACHE_NAME = 'portfolio-v2-2025';
const CACHE_VERSION = '1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic-${CACHE_VERSION}`;

const IS_DEVELOPMENT = location.hostname === 'localhost' || location.hostname === '127.0.0.1';

const FORCE_RELOAD_INTERVAL = 5000;

const STATIC_ASSETS = IS_DEVELOPMENT ? [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115'
] : [
    '/v2/',
    '/v2/index.html',
    '/v2/style.css',
    '/v2/main.js',
    '/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115'
];

const DYNAMIC_PATTERNS = [
    /^https:\/\/ik\.imagekit\.io\/ItsWatuyusei\/Image\//,
    /^https:\/\/fonts\.googleapis\.com\/css/,
    /^https:\/\/cdnjs\.cloudflare\.com/,
    /^https:\/\/fonts\.gstatic\.com/
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                return self.skipWaiting();
            })
            .catch(error => {
                // Installation failed
            })
    );
    
    if (IS_DEVELOPMENT) {
        self.skipWaiting();
    }
});

self.addEventListener('activate', event => {
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
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    if (request.method !== 'GET') {
        return;
    }
    
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
    
    if (IS_DEVELOPMENT && (url.origin === location.origin)) {
        try {
            const networkResponse = await fetch(request);
            return networkResponse;
        } catch (error) {
            return new Response('Development mode: Network error', {
                status: 503,
                statusText: 'Service Unavailable'
            });
        }
    }
    
    try {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            const cacheDate = cachedResponse.headers.get('sw-cache-date');
            const isImage = request.destination === 'image';
            const maxAge = isImage ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000;
            
            if (cacheDate && (Date.now() - parseInt(cacheDate)) < maxAge) {
                return cachedResponse;
            }
        }
        
        const networkResponse = await fetch(request);
        
        const responseClone = networkResponse.clone();
        
        if (networkResponse.ok && shouldCache(request)) {
            const headers = new Headers(responseClone.headers);
            headers.set('sw-cache-date', Date.now().toString());
            
            const cachedResponse = new Response(responseClone.body, {
                status: responseClone.status,
                statusText: responseClone.statusText,
                headers: headers
            });
            
            await cache.put(request, cachedResponse);
        }
        
        return networkResponse;
        
    } catch (error) {
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        if (request.destination === 'document') {
            return caches.match('/v2/index.html');
        }
        
        return new Response('Portfolio V2 is offline', {
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
    
    if (request.destination === 'image' || request.destination === 'font') {
        return true;
    }
    
    if (url.origin === location.origin) {
        return true;
    }
    
    return DYNAMIC_PATTERNS.some(pattern => pattern.test(request.url));
}

self.addEventListener('sync', event => {
    if (event.tag === 'portfolio-v2-analytics') {
        event.waitUntil(
            syncPortfolioV2Analytics()
        );
    }
});

async function syncPortfolioV2Analytics() {
    // Analytics sync for V2
}

self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            vibrate: [200, 100, 200],
            data: {
                url: data.url || '/v2/'
            },
            actions: [
                {
                    action: 'open',
                    title: 'Open Portfolio V2'
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

self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data.url || '/v2/')
        );
    }
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'PORTFOLIO_V2_PERFORMANCE') {
        // Handle performance data
    }
});

async function manageCacheSize() {
    const cacheNames = await caches.keys();
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        
        if (keys.length > 100) {
            const keysToDelete = keys.slice(0, 20);
            await Promise.all(keysToDelete.map(key => cache.delete(key)));
        }
    }
}

setInterval(manageCacheSize, 24 * 60 * 60 * 1000);

self.addEventListener('install', event => {
    event.waitUntil(
        preloadPortfolioV2Resources()
    );
});

async function preloadPortfolioV2Resources() {
    const criticalResources = [
        'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
    ];
    
    const cache = await caches.open(STATIC_CACHE);
    
    for (const resource of criticalResources) {
        try {
            const response = await fetch(resource);
            if (response.ok) {
                await cache.put(resource, response);
            }
        } catch (error) {
            // Resource preload failed
        }
    }
}

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    if (url.pathname === '/v2/' || url.pathname === '/v2') {
        event.respondWith(
            caches.match('/v2/index.html')
        );
        return;
    }
});

if (IS_DEVELOPMENT) {
    // Development mode specific code
}
