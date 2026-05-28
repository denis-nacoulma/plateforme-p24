const CACHE_NAME = 'p24-cache-v1';
const urlsToCache = [
    '/plateforme-p24/',
    '/plateforme-p24/index.html',
    '/plateforme-p24/login.html',
    '/plateforme-p24/inscription.html',
    '/plateforme-p24/emploidutemps.html',
    '/plateforme-p24/cahier.html',
    '/plateforme-p24/cours.html',
    '/plateforme-p24/admin.html',
    '/plateforme-p24/supabase.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) return response;
            return fetch(event.request).catch(() => {
                return caches.match('/plateforme-p24/index.html');
            });
        })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
});