export default {
    "_loadESString.fragment.js": `exports = async function(codeStr) { return await import("data:text/javascript;charset=utf-8," + encodeURIComponent(codeStr)); }`,
    "_bootstrapEntrypoint.jsm": `import localforage from "https://cdn.skypack.dev/localforage";
export default async function main(image) {
    // TODO: is this really how I should do this?
    image["_bootstrap.html"] = await (await fetch("/")).text();
    console.log("Hello from the bootstrap entrypoint!");
    console.log(image);

    // Load image into localStorage
    for(const [key, value] of Object.entries(image)) {
        await localforage.setItem(key, value);
    }

    // Register worker
    await navigator.serviceWorker.register("/worker.jsm", { type: "module", scope: "/" });
    window.location.reload();
}`,
    "_workerFetch.fragment.js": `exports = async function onFetch(event, localforage) {
    // if(event.request.url === "/" || event.request.url === "/index.html") {

    // }
    console.log("Hello!");
    return new Response(
        /*new Blob(["Hello from the worker!"], { type: "text/plain" }) */
        "Hello from the worker!", {
            headers: { "Content-Type": "text/plain" }
        }
    );
}`
};