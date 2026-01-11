const CACHE_NAME = 'bkm-admin-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './vite.svg'
];

// Installation du Service Worker et mise en cache des ressources de base
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Stratégie : Network First, falling back to Cache
// On essaie le réseau, si ça échoue (offline), on prend le cache
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});