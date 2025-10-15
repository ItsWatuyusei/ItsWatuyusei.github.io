// ===== SERVICE WORKER FOR PORTFOLIO V2 =====

const CACHE_NAME = 'portfolio-v2-2025';
const STATIC_CACHE_VERSION = 'v1.0.0';

// Resources to cache
const STATIC_RESOURCES = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://ik.imagekit.io/ItsWatuyusei/Image/bio.png?updatedAt=1752020060115'
];

// Dynamic resources to cache
const DYNAMIC_CACHE = 'portfolio-dynamic-v1';

// Install event
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching static resources...');
                return cache.addAll(STATIC_RESOURCES);
            })
            .then(() => {
                console.log('Static resources cached successfully');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Error caching static resources:', error);
            })
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (request.destination === 'image') {
        event.respondWith(handleImageRequest(request));
    } else if (request.destination === 'font') {
        event.respondWith(handleFontRequest(request));
    } else if (url.origin === location.origin) {
        event.respondWith(handlePageRequest(request));
    } else {
        event.respondWith(handleExternalRequest(request));
    }
});

// Handle image requests
async function handleImageRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error handling image request:', error);
        return new Response('Image not available', { status: 404 });
    }
}

// Handle font requests
async function handleFontRequest(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error handling font request:', error);
        return new Response('Font not available', { status: 404 });
    }
}

// Handle page requests
async function handlePageRequest(request) {
    try {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error handling page request:', error);
        
        // Return offline page if available
        const offlineResponse = await cache.match('/index.html');
        if (offlineResponse) {
            return offlineResponse;
        }
        
        return new Response('Page not available offline', { status: 404 });
    }
}

// Handle external requests
async function handleExternalRequest(request) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Error handling external request:', error);
        return new Response('Resource not available', { status: 404 });
    }
}

// Background sync for analytics
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    try {
        // Perform background tasks like analytics
        console.log('Performing background sync...');
        
        // You can add analytics tracking here
        // Example: send analytics data to server
        
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notifications (if needed in the future)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body,
            icon: '/icon-192x192.png',
            badge: '/badge-72x72.png',
            vibrate: [100, 50, 100],
            data: {
                dateOfArrival: Date.now(),
                primaryKey: 1
            },
            actions: [
                {
                    action: 'explore',
                    title: 'View Portfolio',
                    icon: '/icon-192x192.png'
                },
                {
                    action: 'close',
                    title: 'Close',
                    icon: '/icon-192x192.png'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );
    }
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handler for communication with main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: STATIC_CACHE_VERSION });
    }
});

// Cache management utilities
async function cleanupOldCaches() {
    const cacheNames = await caches.keys();
    const oldCaches = cacheNames.filter(name => 
        name.startsWith('portfolio-') && 
        name !== CACHE_NAME && 
        name !== DYNAMIC_CACHE
    );
    
    return Promise.all(
        oldCaches.map(cacheName => caches.delete(cacheName))
    );
}

// Periodic cache cleanup
setInterval(cleanupOldCaches, 24 * 60 * 60 * 1000); // Daily cleanup

console.log('Service Worker loaded successfully! 🚀');
