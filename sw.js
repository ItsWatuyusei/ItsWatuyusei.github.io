const CACHE_NAME = 'itswatuyusei-portfolio-v' + Date.now();
const urlsToCache = [
    '/',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://avatars.githubusercontent.com/u/184704658?v=4'
];

// Files that should never be cached (always fetch fresh)
const noCacheFiles = [
    '/style.css',
    '/main.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    const isNoCacheFile = noCacheFiles.some(file => url.pathname.includes(file));
    
    // For CSS and JS files, always fetch fresh from network
    if (isNoCacheFile) {
        event.respondWith(
            fetch(event.request)
                .catch(function() {
                    // Fallback to cache only if network fails
                    return caches.match(event.request);
                })
        );
        return;
    }
    
    // For other files, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
        )
    );
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
}); 