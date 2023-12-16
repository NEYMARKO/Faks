const cacheName = "cache";

const cacheFilesList = [
    "/",
    "manifest.json",
    "/images/samurai_image-64_x_64.png",
    "/images/samurai_image-128_x_128.png",
    "/images/samurai_image-256_x_256.png",
    "/images/samurai_image-512_x_512.png",
    "/images/samurai_image-1024_x_1024.png",
    "index.html", 
    "audioHandler.js",
    "/quotes/quote1.mp3",
    "/quotes/quote2.mp3",
    "quote.html",  
    "/css/shared.css",
    "/css/index.css"
];

self.addEventListener('install', e => 
{
    console.log("Service worker installed");
    e.waitUntil(
        caches.open(cacheName).then((cache) =>
            {
                return cache.addAll(cacheFilesList);
            }).then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (e) =>
{
    console.log("Service worker activated");
    e.waitUntil(
        caches.keys().then((cachesNames) =>
            {
                return Promise.all(cachesNames.map((cache) =>
                    {
                        if (cache !== cacheName)
                        {
                            return caches.delete(cache);
                        }
                    }))
            })
    )
})

self.addEventListener('fetch', (e) =>
{
    //console.log("Fetching");
    //console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((res) =>
        {
            return res || fetch(e.request).catch(() => 
            {
                return caches.match('index.html');
            });
        })
        // fetch(e.request).catch(() => caches.match(e.request))
    )
})