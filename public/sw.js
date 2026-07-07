const CACHE_NAME = 'e-library-v3';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/styles/style.css',
  '/manifest.json',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/logo-dark.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/about.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Excel_Phy.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/MANEB_Maths.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/zips.png',
  'https://raw.githubusercontent.com/Wycliffe147/e-library-media/main/images/Q&A.png'
];

// Install Event
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('SW: Pre-caching assets');
        // addAll is all-or-nothing: if any single URL fails, NONE of the
        // assets get cached. The cross-origin GitHub image URLs above are
        // an extra point of failure compared to same-origin assets, so we
        // cache them individually and don't let one bad image break
        // caching for the rest of the app shell.
        return Promise.allSettled(
          ASSETS_TO_CACHE.map(url =>
            cache.add(url).catch(err => {
              console.warn('SW: Failed to pre-cache', url, err);
            })
          )
        );
      })
  );
});

// Activate Event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('SW: Deleting old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  // We want a Network-First strategy for the UI assets so they update when online,
  // but fall back to cache when offline.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If successful, clone the response and save it to cache
        if (response.ok) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, resClone);
          });
        }
        return response;
      })
      .catch(() => {
        // If network fails, look in cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          
          // If it's not in cache and it's a page navigation, return index.html
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
      })
  );
});
