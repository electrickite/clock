const VERSION = 3;
let cacheName = 'clock-v' + VERSION;

let filesToCache = [
  './',
  './manifest.json',
  './icon-180x180.png',
  './icon-192x192.png'
];


self.addEventListener('install', function(event) {
  console.log('Service Worker: Installing...');

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      console.log('Service Worker: Caching app files...');
      return cache.addAll(filesToCache);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});


self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activating....');

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(cacheNames.map(function(key) {
        if (key !== cacheName) {
          console.log('Service Worker: Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});


self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(cacheName).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        return response || fetch(event.request);
        });
      });
    })
  );
});
