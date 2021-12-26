// We can't create workers from strings (https://github.com/w3c/ServiceWorker/issues/578),
// but we can create a skeleton of a worker that just loads code from localStorage.

self.importScripts("_localforage/localforage.js");

self.addEventListener("fetch", event => {
    event.respondWith(async function() {
        const workerSrc = await localforage.getItem("_workerFetch.fragment.js");
        let exports;
        eval(workerSrc);
        return await exports(event, localforage);
    }());
});