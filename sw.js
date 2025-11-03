const CACHE_NAME = 'laphetra-v1';
const urlsToCache = [
  '/LAPPHetra/',
  '/LAPPHetra/index.html',
  '/LAPPHetra/manifest.json',
  '/LAPPHetra/icon-192.png',
  '/LAPPHetra/icon-512.png'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          console.log('📦 Depuis le cache:', event.request.url);
          return response;
        }
        console.log('🌐 Depuis le réseau:', event.request.url);
        return fetch(event.request);
      })
      .catch(() => {
        // En cas d'erreur, retourne la page d'accueil si navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/LAPPHetra/index.html');
        }
      })
  );
});
