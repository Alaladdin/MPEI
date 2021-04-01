const CACHE_VERSION = 'cache-v8';
const filesToCache = [
  '/',
  '/assets/css/main.css',
  '/assets/css/home.css',
  '/assets/js/main.js',
  '/assets/js/homepage.js',
  '/css/timeago.css',

  '/js/timeago.min.js',
  '/js/timeago_mkdocs_material.js',
  '/assets/img/physics.webp',

  '/assets/img/math.webp',
  '/assets/img/probability.webp',
  '/assets/img/english.webp',
  '/assets/img/informatics.webp',
  '/assets/img/oib.webp',
  '/assets/img/history.webp',
];

// Install
self.addEventListener('install', (e) => {
  console.log('[SW] Installing');
  self.skipWaiting();

  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_VERSION);
    await cache.addAll(filesToCache);
  })());
});

// Activate
self.addEventListener('activate', async (e) => {
  console.log('[SW] Activate');

  e.waitUntil(
    caches.keys()
      .then((keys) => Promise
        .all(keys.map((key) => {
          if (key === CACHE_VERSION) return;
          return caches.delete(key);
        })))
      .then(() => console.log(`[SW] Cache: ${CACHE_VERSION}`)),
  );
});

// Fetch
self.addEventListener('fetch', (e) => {
  // if (e.request.method !== 'GET') return;
  console.log('fetching');
});
