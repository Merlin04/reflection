import localforage from "https://cdn.skypack.dev/localforage";
import image from "./image.js";

const registerWorker = async () => await navigator.serviceWorker.register("/worker.js", { scope: "/" });

void async function() {
    // Sometimes chrome will just ignore the service worker or not import the scripts the worker depends on
    // Often re-registering the worker is necessary, other times reloading is enough, but it's easier to always re-register it
    if((await localforage.keys()).length > 0) {
        if((await navigator.serviceWorker.getRegistrations()).length > 0)
            await (await navigator.serviceWorker.getRegistrations())[0].unregister();
        await registerWorker();
        window.location.reload();
    }

    // Make sure user doesn't navigate away during install
    const eventListener = event => {
        event.preventDefault();
        event.returnValue = "";
    };
    window.addEventListener("beforeunload", eventListener);

    image["_originalImage.js"] = await (await fetch("/image.js")).text();

    // Load image into localStorage
    for(const [key, value] of Object.entries(image)) {
        await localforage.setItem(key, value);
    }

    await registerWorker();

    // Re-allow reloading
    window.removeEventListener("beforeunload", eventListener);

    console.log("Bootstrap complete");

    const event = new CustomEvent("bootstrapcomplete");
    window.dispatchEvent(event);
}();