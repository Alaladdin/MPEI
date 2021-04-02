// @todo permanent cache / cache with time limit / exclude from cache
const CACHE_VERSION = 'cache-v4';
const allowedCacheHosts = [
  'https://beta.mpei.space',
  'https://mpei.space',
  'https://mpei-server.herokuapp.com',
  'https://fonts.gstatic.com',
  'https://api.netlify.com',
  'http://localhost:8000',
];
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
