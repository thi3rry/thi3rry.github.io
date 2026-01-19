const CACHE_NAME = 'daily-schedule-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installation - mise en cache des ressources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - stratégie Cache First avec fallback sur le réseau
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - retourne la réponse du cache
        if (response) {
          return response;
        }

        // Clone de la requête
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Vérifier si réponse valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone de la réponse
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Si offline et pas dans le cache, retourner une page par défaut
          return caches.match('/');
        });
      })
  );
});
