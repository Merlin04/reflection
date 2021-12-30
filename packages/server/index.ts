import { transform } from "@babel/standalone";
import type { NextApiRequest, NextApiResponse } from "next";

// TODO: Load image
const image: Record<string, string> = {
    // Sure copilot, that works
    "index.html": "<!DOCTYPE html><html><head><title>Image</title></head><body><img src=\"/image.png\" /></body></html>",
}

// Set up mocked worker environment

const Babel = { transform };

const location = {
    // The domain the server is serving on
    href: "https://" + process.env.VERCEL_URL
};

// Mocked `Response` class
class Response {
    status: number;
    ok: boolean;
    statusText: string;
    headers: Record<string, string>;
    body: string | null;

    constructor(body: string | null = null, options: {
        status?: number;
        statusText?: string;
        headers?: Record<string, string>;
    } = {}) {
        this.status = options.status ?? 200;
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

const readonly = () => {
    throw new Error("Localforage on server is read-only");
}

const localforage = {
    getItem: async (key: string) => image[key],
    setItem: readonly,
    removeItem: readonly,
    clear: readonly,
    length: async () => Object.keys(image).length,
    key: async (index: number) => Object.keys(image)[index],
    keys: async () => Object.keys(image),
    iterate: async <T = any>(iteratorCallback: { (value: string, key: string, iterationNumber: number): T | undefined }): Promise<T | void> => {
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
    dropInstance: unimplemented
};

// Mocked `fetch` that returns a 404 `Response`
// Can accept parameters but they aren't used for anything
const fetch = async (..._: any) => new Response("404 not found", {
    headers: {
        "Content-Type": "text/plain"
    },
    status: 404,
    statusText: "Not found"
});

// Mocked `self` object (nothing needs to be in it for now, it's just storage for the worker to use)
const self = {};

// Load the worker code from the image (in closure to not redeclare exports)
type WorkerFetchHandler = (e: {
    request: unknown
}, localforageInst: typeof localforage) => Promise<Response>;

const onFetch = (() => {
    let exports: WorkerFetchHandler | undefined;
    eval(image["_workerFetch.fragment.js"]);
    return exports!;
})();

// Handles all requests to the page
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Run the fetch handler
    const newReq = { ...req, url: location.href + req.url };
    const response = await onFetch({
        request: newReq
    }, localforage);

    if (req.url === "/" || req.url === "/index.html") {
        // Inject bootstrap script
        const scriptTag = `<script type="module" src="/bootstrap.mjs"></script>`;
        response.body = response.body?.replace(/<\/body>/, scriptTag + "</body>") ?? null;
    }

    // Call `res` functions with data from `response`
    res.writeHead(response.status, response.statusText, response.headers);
    res.end(response.body);
}