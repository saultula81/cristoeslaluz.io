// service-worker.js

const CACHE_NAME = 'cristo-player-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/player.html',
  '/fondo.png',
  '/fondodark.png',
  '/manifest.json',
  '/script.js',
   // Asegúrate de agregar todos los archivos estáticos que deseas almacenar en caché
  'https://stream.zeno.fm/mfer4shs398uv'  // Agrega recursos externos que deseas almacenar en caché
];

// Instalar el service worker y almacenar en caché los archivos
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Archivos en caché durante la instalación');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
});

// Activar el service worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Manejar las solicitudes de los recursos
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si el recurso está en caché, devuelve la respuesta almacenada
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Si no está en caché, realiza la solicitud de red (network)
      return fetch(event.request).then((response) => {
        // Si la respuesta no es válida, retorna la respuesta de red
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Si la respuesta es válida, almacenarla en caché
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      });
    })
  );
});
