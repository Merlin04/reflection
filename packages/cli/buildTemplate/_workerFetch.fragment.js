const transformExtensions = ["ts", "tsx", "jsx"];
const jsExtensions = ["js", "mjs", ...transformExtensions];

const extensionContentTypes = {
    "html": "text/html",
    "css": "text/css",
    "json": "application/json",
    ...(Object.fromEntries(jsExtensions.map(e => [e, "text/javascript"])))
};

async function transformFile(fileSrc) {
    if(self.transformCache) {
        const v = self.transformCache.get(fileSrc);
        if(v) return v;
    }
    else {
        self.transformCache = new Map();
    }
    const { code } = Babel.transform(fileSrc, {
        ...(JSON.parse(await localforage.getItem(".babelrc.json"))),
        filename: "a.tsx"
    });
    self.transformCache.set(fileSrc, code);
    return code;
}

const defaultHeaders = {
    "Server": "Reflection editor service worker"
};

exports = async function onFetch(e, localforage) {
    let thisOrigin = new URL(location.href).origin;
    let urlObj = new URL(e.request.url);
    if(urlObj.origin !== thisOrigin || e.request.url.includes("_localforage")) return fetch(e.request);

    let url = urlObj.pathname.slice(1);
    if(url.length === 0) url = "index.html";

    let val = await localforage.getItem(url);
    if(!val) return new Response(
        "404 not found", {
            headers: { ...defaultHeaders, "Content-Type": "text/plain" },
            status: 404,
            statusText: "Not found"
        }
    );

    const extension = url.split(".").pop();
    if(transformExtensions.includes(extension)) val = await transformFile(val);

    const contentType = extensionContentTypes[extension] ?? "text/plain";

    return new Response(
        val, {
            headers: { ...defaultHeaders, "Content-Type": contentType },
            status: 200,
            statusText: "OK"
        }
    );
}