const staticCacheName = 'site-static-v1.0';
const dynamicCache = 'site-dynamic-v1';
const assets = [
    '/',
    '/index.html',
    '/js/app.js',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/css/styles.css',
    '/css/materialize.min.css', 
    '/img/dish.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons'
];

self.addEventListener('install',(evt)=>{
    // console.log('Service worker has been installed');
    evt.waitUntil(
        caches.open(staticCacheName).then(cache=>{
            cache.addAll(assets);
            console.log("Caching assets:");
        })
    );
});


// activate evt
self.addEventListener('activate',(evt)=>{
    // console.log('Service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys =>{
            return Promise.all(keys.filter(key=>key !== staticCacheName).map(key=>caches.delete(key))
            )
        })
    )
})

// fetch event
 self.addEventListener('fetch',(evt)=>{
    // console.log('fetch event triggered',evt);
    evt.respondWith(
        caches.match(evt.request).then(cacheRes =>{
            return cacheRes || fetch(evt.request).then(async fetchRes =>{
                const cache = await caches.open(dynamicCache);
                cache.put(evt.request.url, fetchRes.clone());
                return fetchRes;
            });
        })
    )
})
