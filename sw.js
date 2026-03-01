const CACHE_NAME = 'voskh-cup-v1';
const ASSETS = [
  '/index.html',
  '/informace.html',
  '/misto.html',
  '/odmeny.html',
  '/rozpis.html',
  '/faq.html',
  '/style.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Bebas+Neue&family=Barlow+Condensed:wght@400;600&display=swap'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Pouze GET požadavky, přeskoč Google Sheets API
  if (e.request.method !== 'GET') return;
  if (e.request.url.includes('script.google.com')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      const networkFetch = fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return res;
      }).catch(() => cached);
      return cached || networkFetch;
    })
  );
});
