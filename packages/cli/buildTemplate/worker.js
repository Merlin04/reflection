// We can't create workers from strings (https://github.com/w3c/ServiceWorker/issues/578),
// but we can create a skeleton of a worker that just loads code from localStorage.

// TODO: move babel to a local file if this breaks things
self.importScripts("_localforage/localforage.js", "https://unpkg.com/@babel/standalone@7.16.6/babel.min.js");

self.addEventListener("fetch", event => {
    event.respondWith(async function() {
        const workerSrc = await localforage.getItem("_workerFetch.fragment.js");
        let exports;
        eval(workerSrc);
        return await exports(event, localforage);
    }());
});