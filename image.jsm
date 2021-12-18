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
    "_workerFetch.fragment.js": `exports = async function onFetch(e, localforage) {
    console.log("Handling request for " + e.request.url + " in service worker");

    let thisOrigin = new URL(location.href).origin;
    let urlObj = new URL(e.request.url);
    if(urlObj.origin !== thisOrigin) return fetch(e.request);

    let url = urlObj.pathname.slice(1);
    if(url.length === 0) url = "index.html";

    const val = await localforage.getItem(url);
    return new Response(
        val ?? "404 not found", {
            headers: { "Content-Type": (url.endsWith(".js") || url.endsWith(".jsm")) ? "text/javascript" : url.endsWith(".html") ? "text/html" : "text/plain" },
            status: val ? 200 : 404,
            statusText: val ? "OK" : "Not found"
        }
    );
}`,
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    Hello world from reflection!
    <button id="saveBtn">Save</button>
    <button onclick="window.location.reload">Reload</button>
    <br>
    <textarea id="code"></textarea>
    <script type="module">
        import localforage from "https://cdn.skypack.dev/localforage";

        void async function() {
            document.getElementById("code").value = await localforage.getItem("index.html");
        }();

        async function save() {
            await localforage.setItem("index.html", document.getElementById("code").value);
        }

        document.getElementById("saveBtn").addEventListener("click", save);
    </script>
</body>
</html>`
};