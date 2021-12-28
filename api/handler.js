import image from "../image";
import { transform } from "@babel/standalone";

// Set up mocked worker environment

const Babel = { transform };

const location = {
    // The domain the server is serving on
    href: "https://" + process.env.VERCEL_URL
};

// Mocked `Response` class
class Response {
    constructor(body = null, options = {}) {
        this.status = typeof options.status === "number" ? options.status : 200;
        this.ok = this.status >= 200 && this.status < 300;
        this.statusText = options.statusText || "OK";
        this.headers = options.headers || {};
        this.body = body;
    }
}

// Mocked `localforage` instance that pulls from the `image` object

// Define a handler for non-implemented methods
const unimplemented = () => {
    throw new Error("Not implemented");
};

const localforage = {
    getItem: async key => image[key],
    setItem: async (key, value) => {
        image[key] = value;
    },
    removeItem: async key => {
        delete image[key];
    },
    clear: async () => {
        image = {};
    },
    length: async () => Object.keys(image).length,
    key: async index => Object.keys(image)[index],
    keys: async () => Object.keys(image),
    iterate: async iteratorCallback => {
        // Iterate over all value/key pairs in datastore.
        // `iteratorCallback` is called once for each pair, with the following arguments:
        // 1. value
        // 2. key
        // 3. iterationNumber
        // `iterate` supports early exit by returning non `undefined` value inside the callback.
        // Resulting value will be passed to `iterate`'s return value.

        const keys = Object.keys(image);
        for(let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = image[key];
            const result = await iteratorCallback(value, key, i);
            if(result !== undefined) return result;
        }
    },
    setDriver: unimplemented,
    config: unimplemented,
    defineDriver: unimplemented,
    driver: unimplemented,
    ready: unimplemented,
    supports: unimplemented,
    createInstance: unimplemented,
    createInstance: unimplemented
};

// Mocked `fetch` that returns a 404 `Response`
const fetch = async (..._) => new Response("404 not found", {
    headers: {
        "Content-Type": "text/plain"
    },
    status: 404,
    statusText: "Not found"
});

// Mocked `self` object (nothing needs to be in it for now, it's just storage for the worker to use)
const self = {};

// Load the worker code from the image (in closure to not redeclare exports)
const onFetch = (() => {
    let exports;
    eval(image["_workerFetch.fragment.js"]);
    return exports;
})();

// Handles all requests to the page
export default async function handler(req, res) {
    // Run the fetch handler
    const newReq = { ...req, url: location.href + req.url };
    const response = await onFetch({
        request: newReq
    }, localforage);

    if (req.url === "/" || req.url === "/index.html") {
        // Inject bootstrap script
        const scriptTag = `<script type="module" src="/bootstrap.mjs"></script>`;
        response.body = response.body.replace(/<\/body>/, scriptTag + "</body>");
    }

    // Call `res` functions with data from `response`
    res.writeHead(response.status, response.statusText, response.headers);
    res.end(response.body);
}