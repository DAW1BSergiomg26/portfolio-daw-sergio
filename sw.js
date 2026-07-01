/**
 * Service Worker - Portfolio DAW Sergio
 * Version: 3.12.0
 * Estrategia: Cache-first para HTML, network-first para JS/CSS/JSON.
 */
const CACHE_NAME = 'portfolio-daw-v3.12.0';
const DATA_CACHE_NAME = 'portfolio-daw-data-v3.12.0';
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '');

const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/proyecto.html`,
  `${BASE_PATH}/entrada.html`,
  `${BASE_PATH}/cv.html`,
  `${BASE_PATH}/admin.html`,
  `${BASE_PATH}/404.html`,
  `${BASE_PATH}/css/styles.css`,
  `${BASE_PATH}/css/filters.css`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/proyecto.js`,
  `${BASE_PATH}/js/blog.js`,
  `${BASE_PATH}/js/admin.js`,
  `${BASE_PATH}/js/theme.js`,
  `${BASE_PATH}/js/cv.js`,
  `${BASE_PATH}/js/sandbox.js`,
  `${BASE_PATH}/js/ruta-map.js`,
  `${BASE_PATH}/js/github-dashboard.js`,
  `${BASE_PATH}/data/projects.json`,
  `${BASE_PATH}/data/lang.json`,
  `${BASE_PATH}/data/blog.json`,
  `${BASE_PATH}/data/ruta.json`,
  `${BASE_PATH}/site.webmanifest`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/og-image.svg`,
  `${BASE_PATH}/icons.svg`,
  `${BASE_PATH}/api/index.html`,
  `${BASE_PATH}/api/projects.json`,
  `${BASE_PATH}/api/blog.json`,
  `${BASE_PATH}/api/cv.json`
];

const OFFLINE_PAGE = `${BASE_PATH}/index.html`;

self.addEventListener('install', event => {
  event.waitUntil(
    precacheAssets().then(() => self.skipWaiting())
  );
});

async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  const results = await Promise.allSettled(
    PRECACHE_URLS.map(url =>
      fetch(url).then(res => {
        if (res.ok) cache.put(url, res);
      }).catch(() => {})
    )
  );
  const failed = results.filter(r => r.status === 'rejected').length;
  if (failed > 0) console.warn('[SW] Fallaron ' + failed + ' assets en precache');
}

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== DATA_CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  if (!url.protocol.startsWith('http')) return;

  const isJSON = url.pathname.endsWith('.json');
  const isJS = url.pathname.endsWith('.js');
  const isCSS = url.pathname.endsWith('.css');
  const isData = url.pathname.includes('/data/');
  const isDemo = url.pathname.includes('/demos/');
  const isAPI = url.pathname.includes('/api/');

  if (isJSON || isData || isAPI) {
    event.respondWith(networkFirst(request));
  } else if (isJS || isCSS) {
    event.respondWith(networkFirst(request));
  } else if (isDemo) {
    event.respondWith(networkFirst(request));
  } else {
    event.respondWith(cacheFirst(request));
  }
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    if (request.mode === 'navigate') {
      const offline = await cache.match(OFFLINE_PAGE);
      if (offline) return offline;
    }
    throw err;
  }
}

async function networkFirst(request) {
  const cache = await caches.open(DATA_CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await cache.match(request);
    if (cached) return cached;
    throw err;
  }
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
