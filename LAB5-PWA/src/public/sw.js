//treba cacheati manifest.json

const cacheName = "cache2";

const cacheFilesList = [
    "manifest.json",
    "index.html",
    "about.html",
    "/css/shared.css"
];

self.addEventListener('install', e => 
{
    console.log("Service worker installed");
    e.waitUntil(
        caches.open(cacheName).then((cache) =>
            {
                return cache.addAll(cacheFilesList);
            })
    )
})

self.addEventListener('activate', e =>
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

// self.addEventListener('fetch', (e) =>
// {
//     console.log("Fetching");
//     console.log(e.request.url);
//     e.respondWith(
//         caches.match(e.request).then((res) =>
//         {
//             return res || fetch(e.res);
//         })
//     )
// })