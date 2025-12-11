const CACHE_NAME = 'laphetra-v2.5'; // ⚠️ Changez la version pour forcer la mise à jour
const urlsToCache = [
  // URLs ABSOLUES depuis la racine de votre domaine
  'https://awreel-ink.github.io/LAPPHetra/',
  'https://awreel-ink.github.io/LAPPHetra/index.html',
  'https://awreel-ink.github.io/LAPPHetra/manifest.json',
  'https://awreel-ink.github.io/LAPPHetra/192.png',
  'https://awreel-ink.github.io/LAPPHetra/512.png',
  
  // ⚠️ AJOUTEZ ces fichiers critiques :
  'https://awreel-ink.github.io/LAPPHetra/sw.js'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Installation v2...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('✅ Cache ouvert, ajout des fichiers...');
        return cache.addAll(urlsToCache)
          .then(() => console.log('✅ Tous les fichiers en cache !'))
          .catch((err) => console.error('❌ Erreur cache:', err));
      })
  );
  // Force l'activation immédiate
  self.skipWaiting();
});

// Activation
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker: Activation v2...');
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
  // Prend le contrôle immédiatement
  return self.clients.claim();
});

// Stratégie: Cache First, puis Network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          console.log('📦 Cache:', event.request.url);
          return cachedResponse;
        }

        console.log('🌐 Network:', event.request.url);
        return fetch(event.request)
          .then((response) => {
            // Clone la réponse pour la mettre en cache
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          })
          .catch((error) => {
            console.error('❌ Fetch error:', error);
            // Fallback vers index.html pour les navigations
            if (event.request.mode === 'navigate') {
              return caches.match('https://awreel-ink.github.io/LAPPHetra/index.html');
            }
            throw error;
          });
      })
  );
});

