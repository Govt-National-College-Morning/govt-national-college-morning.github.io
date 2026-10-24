/* GNCK Admission - service worker (website v1.8.5).
   Our own files: the page opens even without internet (last saved copy).
   Google links (form, status, portal): never stored, always live from Google. */
var CACHE = 'gnck-v1.8.5';
var CORE = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/icon-maskable-512.png', '/favicon.png', '/favicon-48.png', '/principal-full.jpg', '/pages.css'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;            // Google, fonts: straight to the internet
  if (req.mode === 'navigate' || url.pathname === '/' || url.pathname === '/index.html') {
    // pages: newest from the internet, each page's saved copy only when offline (v1.8: every page keeps its own copy)
    var key = url.origin + url.pathname;
    e.respondWith(fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(key, copy); }); }
      return res;
    }).catch(function () { return caches.match(key).then(function (hit) { return hit || caches.match('/'); }); }));
    return;
  }
  e.respondWith(caches.match(req).then(function (hit) {
    return hit || fetch(req).then(function (res) {
      if (res.ok) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(req, copy); }); }
      return res;
    });
  }));
});
