const APP_VERSION = '1.5.1'; // Version de l'application
const CACHE_NAME = 'daily-schedule-v4'; // Incrémenter pour forcer une mise à jour
const PENDING_CACHE_NAME = 'daily-schedule-pending-v4';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Installation - mise en cache des ressources
self.addEventListener('install', (event) => {
  console.log('[SW] Installation du nouveau service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
  // Ne pas appeler skipWaiting() automatiquement
  // L'application décidera quand activer le nouveau SW
});

// Activation - nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation du nouveau service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Message pour activer le nouveau service worker
self.addEventListener('message', async (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Activation forcée du nouveau service worker');
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'APPLY_UPDATE') {
    console.log('[SW] Application des mises à jour en attente');
    // Copier le cache en attente vers le cache actif
    const pendingCache = await caches.open(PENDING_CACHE_NAME);
    const activeCache = await caches.open(CACHE_NAME);
    const requests = await pendingCache.keys();

    for (const request of requests) {
      const response = await pendingCache.match(request);
      if (response) {
        await activeCache.put(request, response);
      }
    }

    // Nettoyer le cache en attente
    await caches.delete(PENDING_CACHE_NAME);

    // Informer le client
    event.ports[0].postMessage({ type: 'UPDATE_APPLIED' });
  }
});

// Fetch - stratégie Stale-While-Revalidate avec mise à jour manuelle
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Déterminer si c'est une ressource "dynamique" (HTML, JS, CSS)
  const isDynamicResource =
    request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json');

  if (isDynamicResource) {
    // Stratégie Stale-While-Revalidate avec notification de mise à jour
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        // Fetch en arrière-plan pour vérifier les mises à jour
        const fetchPromise = fetch(request).then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            // Comparer avec la version en cache
            const cachedClone = cachedResponse ? await cachedResponse.clone().text() : '';
            const networkClone = await networkResponse.clone().text();

            if (cachedClone !== networkClone) {
              console.log('[SW] Nouvelle version détectée pour:', url.pathname);

              // Stocker dans le cache en attente
              const pendingCache = await caches.open(PENDING_CACHE_NAME);
              await pendingCache.put(request, networkResponse.clone());

              // Notifier tous les clients qu'une mise à jour est disponible
              const clients = await self.clients.matchAll();
              clients.forEach(client => {
                client.postMessage({
                  type: 'CONTENT_UPDATE_AVAILABLE',
                  url: url.pathname,
                  newVersion: APP_VERSION
                });
              });
            }
          }
          return networkResponse;
        }).catch(err => {
          console.log('[SW] Erreur réseau, utilisation du cache:', err);
          return cachedResponse;
        });

        // Retourner immédiatement la version en cache si disponible
        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // Stratégie Cache First pour les ressources statiques (images, fonts, etc.)
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }

          return fetch(request).then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
            }
            return response;
          });
        })
    );
  }
});
