const staticCacheName = "site-static-v1.02";
const dynamicCacheName = "site-dynamic-v1.02";
const assets = [
  "/",
  "/pages/fallback.html",
  "/index.html",
  "/js/app.js",
  "/js/ui.js",
  "/js/materialize.min.js",
  "/css/styles.css",
  "/css/materialize.min.css",
  "/img/dish.png",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
];

// cache size limiting
const limitCacheSize = (name,size) =>{
    caches.open(name).then((cache)=>{
        cache.keys().then(keys =>{
            if(keys.length > size){
                cache.delete(keys[0]).then(()=>limitCacheSize(name,size))
            }
        })
    })
}

self.addEventListener("install", (evt) => {
  // console.log('Service worker has been installed');
  evt.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
      console.log("Caching assets:");
    })
  );
});

// activate evt
self.addEventListener("activate", (evt) => {
  // console.log('Service worker has been activated');
  evt.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName && key !== dynamicCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

// fetch event
self.addEventListener("fetch", (evt) => {
  // console.log('fetch event triggered',evt);
  evt.respondWith(
    caches
      .match(evt.request)
      .then((cacheRes) => {
        return (
          cacheRes ||
          fetch(evt.request).then(async (fetchRes) => {
            const cache = await caches.open(dynamicCacheName);
            cache.put(evt.request.url, fetchRes.clone());
            limitCacheSize(dynamicCacheName,5)
            return fetchRes;
          })
        );
      })
      .catch(() => {
        if(evt.request.url.indexOf('.html') > -1){
            return caches.match("pages/fallback.html");
        }
      })
  );
});
