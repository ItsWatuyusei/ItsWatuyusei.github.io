const CACHE_NAME = 'bakery-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './config.js',
  './artisan_bread_savory_1777561153256.png',
  './bakery_background_texture_1777567586978.png',
  './chocolate_cake_sweet_1777561087967.png',
  './croissant_savory_1777560964071.png',
  './strawberry_tart_sweet_1777561230311.png',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
