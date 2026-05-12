var CACHE_NAME = 'hkw-cache-v1';

var PRECACHE_URLS = [
  'index.html',
  'data/beginner.js',
  'data/intermediate.js',
  'data/advanced.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(PRECACHE_URLS);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE_NAME; })
          .map(function(k) { return caches.delete(k); })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var url = new URL(event.request.url);
  var isAudio = url.pathname.match(/\.mp3$/i);

  if (isAudio) {
    event.respondWith(
      fetch(event.request).then(function(res) {
        if (res.ok) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
        }
        return res;
      }).catch(function() {
        return caches.match(event.request);
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function(cached) {
        return cached || fetch(event.request).then(function(res) {
          if (res && res.status === 200) {
            var copy = res.clone();
            caches.open(CACHE_NAME).then(function(cache) { cache.put(event.request, copy); });
          }
          return res;
        }).catch(function() {
          return caches.match(event.request);
        });
      })
    );
  }
});
