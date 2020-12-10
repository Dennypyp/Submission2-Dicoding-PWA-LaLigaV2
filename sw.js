const CACHE_NAME = "LaLiga";
let urlsToCache = [
    "/",
    "/manifest.json",
    "/nav.html",
    "/index.html",
    "/detilPemain.html",
    "/detilClub.html",
    "/assets/halaman/profile.html",
    "/assets/halaman/beranda.html",
    "/assets/halaman/klasemen.html",
    "/assets/css/materialize.min.css",
    "/assets/js/api.js",
    "/assets/js/db.js",
    "/assets/js/idb.js",
    "/assets/js/materialize.min.js",
    "/assets/js/script.js",
    "/assets/js/nav.js",
    "/assets/img/twit.png",
    "/assets/img/fb.png",
    "/assets/img/ig.png",
    "/assets/img/icon.png",
    "/assets/img/icon2.png",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v52/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener("fetch", function (event) {
    let baseUrl = "https://api.football-data.org/v2";

    if (event.request.url.indexOf(baseUrl) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());

                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + "dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener("push", function (event) {
    let body;

    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }

    let options = {
        body: body,
        icon: "images/icons/icon.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});