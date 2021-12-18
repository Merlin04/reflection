// We can't create workers from strings (https://github.com/w3c/ServiceWorker/issues/578),
// but we can create a skeleton of a worker that just loads code from localStorage.

import localforage from "https://cdn.skypack.dev/localforage";

self.addEventListener("install", event => {
    event.waitUntil(async function() {
        console.log("service worker installed!");
    }());
});

console.log("hello world!");

self.addEventListener("fetch", event => {
    console.log("received fetch event");
    event.respondWith(async function() {
        const workerSrc = await localforage.getItem("_workerFetch.fragment.js");
        let exports;
        eval(workerSrc);
        return await exports(event, localforage);
    }());
});