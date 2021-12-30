import localforage from "localforage";
import { css } from "@emotion/css";
import {
    useMenuState,
    Menu,
    MenuItem,
    MenuButton
} from "reakit";

async function makeImage() {
    // An image is just a snapshot of the IndexedDB filesystem
    // formatted as an ES module.
    const files = Object.fromEntries(
        await Promise.all(
            (await localforage.keys())
            // _originalImage.js is dynamically added at the time of bootstrapping
            .filter(key => key !== "_originalImage.js")
            .map(async file => [file, await localforage.getItem(file)])
        )
    );
    
    return `export default ${JSON.stringify(files, null, 4)};`;
}

async function exportImage() {
    window.open(URL.createObjectURL(new Blob([await makeImage()], { type: "text/javascript" })));
}

export default function ActionsMenu() {
    const menu = useMenuState();
    return <>
        <MenuButton {...menu} className={css`
            border-right: 1px solid rgb(0 83 195) !important;
        `} />
        <Menu {...menu} aria-label="Actions">
            <MenuItem {...menu} onClick={() => {
                menu.hide();
                exportImage();
            }}>Create image</MenuItem>
        </Menu>
    </>;
}