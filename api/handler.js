import image from "../image";

const extensionContentTypes = {
    "html": "text/html",
    "css": "text/css",
    "js": "application/javascript",
    "json": "application/json",
    "mjs": "application/javascript"
};

// Handles all requests to the page
export default function handler(req, res) {
    let filename = req.url.slice(1);
    if (filename === "") {
        filename = "index.html";
    }
    const fileSrc = image[filename];

    if (!fileSrc) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
        return;
    }

    const extension = filename.split(".").pop();
    const contentType = extensionContentTypes[extension] || "text/plain";

    res.writeHead(200, { "Content-Type": contentType });
    res.end(fileSrc);
}