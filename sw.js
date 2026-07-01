/**
 * Service Worker - Portfolio DAW Sergio
 * Version: 3.6.0
 * Estrategia: Cache-first para el shell/app, network-first para datos JSON.
 */

const CACHE_NAME = 'portfolio-daw-v3.6.0';
const DATA_CACHE_NAME = 'portfolio-daw-data-v3.6.0';

// Detectar base path automáticamente (local /portfolio-daw-sergio/ o raíz)
const BASE_PATH = self.location.pathname.replace(/\/sw\.js$/, '');

const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/proyecto.html`,
  `${BASE_PATH}/entrada.html`,
  `${BASE_PATH}/admin.html`,
  `${BASE_PATH}/404.html`,
  `${BASE_PATH}/css/styles.css`,
  `${BASE_PATH}/css/filters.css`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/proyecto.js`,
  `${BASE_PATH}/js/blog.js`,
  `${BASE_PATH}/js/admin.js`,
  `${BASE_PATH}/js/theme.js`,
  `${BASE_PATH}/data/projects.json`,
  `${BASE_PATH}/data/lang.json`,
  `${BASE_PATH}/data/blog.json`,
  `${BASE_PATH}/site.webmanifest`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/og-image.svg`,
  `${BASE_PATH}/icons.svg`
];

const OFFLINE_PAGE = `${BASE_PATH}/index.html`;

// Instalación: precachear shell estático
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Algunos recursos no se pudieron precachear:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activación: limpiar caches antiguas
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== DATA_CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: estrategia híbrida
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorar peticiones no GET (POST a formularios, analytics, etc.)
  if (request.method !== 'GET') return;

  // Ignorar chrome-extension y protocolos no soportados
  if (!url.protocol.startsWith('http')) return;

  // Datos JSON: network-first con fallback a cache
  if (url.pathname.endsWith('.json') || url.pathname.includes('/data/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Shell estático: cache-first con fallback a network
  event.respondWith(cacheFirst(request));
});

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.status === 200 && response.type === 'basic') {
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    // Si falla y es una navegación, devolver offline page
    if (request.mode === 'navigate') {
      const offline = await cache.match(OFFLINE_PAGE);
      if (offline) return offline;
    }
    throw err;
  }
}

async function networkFirst(request) {
  const dataCache = await caches.open(DATA_CACHE_NAME);
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.status === 200) {
      dataCache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (err) {
    const cached = await dataCache.match(request);
    if (cached) {
      console.log('[SW] Sirviendo JSON desde cache:', request.url);
      return cached;
    }
    throw err;
  }
}

// Mensajes desde la app (skipWaiting manual, etc.)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
