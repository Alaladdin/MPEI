const CACHE_VERSION = 'offline-v1.0';
const allowedCacheHosts = [
  self.location.origin,
  'https://mpei-server.herokuapp.com',
  'https://fonts.gstatic.com',
  'https://api.netlify.com',
  'https://cdnjs.cloudflare.com',
];
const filesToCache = [
  '/',
  '/assets/css/main.css',
  '/assets/css/home.css',
  '/assets/css/watch.css',

  '/assets/js/main.js',
  '/assets/js/homepage.js',
  '/assets/js/watch.js',

  '/assets/img/physics.webp',
  '/assets/img/math.webp',
  '/assets/img/probability.webp',
  '/assets/img/english.webp',
  '/assets/img/informatics.webp',
  '/assets/img/oib.webp',
  '/assets/img/history.webp',

  'https://mpei-server.herokuapp.com/api/getActuality',
  'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.10.0/toastify.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.10.0/toastify.min.js',
];

// update cache
const updateCache = async (request) => {
  const cache = await caches.open(CACHE_VERSION);
  return fetch(request)
    .then((response) => cache.put(request.url, response.clone()));
};

// Return from cache, if exists
const fromCache = async (request) => {
  const cache = await caches.open(CACHE_VERSION);
  return cache.match(request)
    .then((response) => response || Promise.reject('no-match'));
};

// Install
self.addEventListener('install', (e) => {
  console.log('[SW] Installing...');
  self.skipWaiting();

  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then((cache) => cache.addAll(filesToCache)),
  );
});

// Activate
self.addEventListener('activate', async (e) => {
  console.log('[SW] Activate');

  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.map((key) => {
          if (key === CACHE_VERSION) return;
          return caches.delete(key);
        }),
      ))
      .then(() => console.log(`[SW] Cache: ${CACHE_VERSION}`)),
  );
});

// Fetch
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const { origin } = new URL(request.url);

  // Не обрабатываем домены не из списка разрешенных и не GET запросы
  if (!allowedCacheHosts.includes(origin) || request.method !== 'GET') {
    return fetch(request)
      .catch((err) => console.log(err));
  }

  // response immediately
  e.respondWith(
    fromCache(request)
      .catch(() => fetch(request)),
  );

  // update cache
  e.waitUntil(updateCache(request));
});
