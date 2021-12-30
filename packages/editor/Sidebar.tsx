import React from "react";
import localforage from "localforage";
import { css } from "@emotion/css";
import {
    TabList,
    useDialogState,
    Dialog,
    DialogDisclosure,
    DialogBackdrop,
    unstable_useFormState as useFormState,
    unstable_Form as Form,
    unstable_FormLabel as FormLabel,
    unstable_FormInput as FormInput,
    unstable_FormMessage as FormMessage,
    unstable_FormSubmitButton as FormSubmitButton,
    Tab,
    useMenuState,
    Menu,
    MenuItem,
    Portal,
    useDisclosureState,
    Disclosure,
    DisclosureContent,
    TabStateReturn,
    DialogStateReturn
} from "reakit";

function CreateFileDialog(props: DialogStateReturn) {
    const form = useFormState({
        values: { name: "" },
        onValidate: (values) => {
            if(!values.name) {
                const errors = {
                    name: "Please enter a filename"
                };
                throw errors;
            }
        },
        onSubmit: async (values) => {
            await localforage.setItem(values.name, "");
            props.hide();
            document.dispatchEvent(new CustomEvent("update-files-list", {
                detail: values.name
            }));
        },
        resetOnSubmitSucceed: true
    });

    return (
        <DialogBackdrop {...props}>
            <Dialog {...props} aria-label="Create file">
                <Form {...form}>
                    <FormLabel {...form} name="name">Filename</FormLabel>
                    <FormInput {...form} name="name" placeholder="Component.jsx" />
                    <FormMessage {...form} name="name" />
                    <FormSubmitButton {...form}>Create</FormSubmitButton>
                </Form>
            </Dialog>
        </DialogBackdrop>
    );
}

function FileTab({ file, tab }: { file: string, tab: TabStateReturn }) {
    const menu = useMenuState();
    const [coords, setCoords] = React.useState<[number, number] | undefined>(undefined);

    return (
        <>
            <Tab {...tab} className={css`
                overflow-wrap: break-word;
                font-size: 0.8rem !important;
            `} onContextMenu={(e: any) => {
                e.preventDefault();
                console.log(e);
                console.log(menu);
                setCoords([e.clientX, e.clientY]);
                menu.show();
            }}>
                {file}
            </Tab>
            <Portal>
                <Menu {...menu} aria-label="File actions" className={css`
                    position: absolute !important;
                    top: ${coords?.[1] ?? 0}px !important;
                    left: ${coords?.[0] ?? 0}px !important;
                    transform: inherit !important;
                `}>
                    <MenuItem {...menu} onClick={async () => {
                        menu.hide();
                        const name = prompt("Enter new filename");
                        if(name && name.length > 0) {
                            if(globalThis.models[file]) {
                                globalThis.models[name] = globalThis.models[file];
                                delete globalThis.models[file];
                            }
                            const fileContents = globalThis.models[file] ? globalThis.models[file].getValue() : await localforage.getItem(file);
                            await localforage.setItem(name, fileContents);
                            await localforage.removeItem(file);

                            document.dispatchEvent(new CustomEvent("update-files-list", {
                                detail: name
                            }));
                        }
                    }}>Rename</MenuItem>
                    <MenuItem {...menu} onClick={async () => {
                        menu.hide();
                        if(confirm(`Are you sure you would like to delete ${file}?`)) {
                            await localforage.removeItem(file);
                            document.dispatchEvent(new CustomEvent("update-files-list"));
                        }
                    }}>Delete</MenuItem>
                </Menu>
            </Portal>
        </>
    );
}

// Array of file names associated with the editor, so they can be hidden in the UI
const EDITOR_FILES = [
    // "ActionsMenu.jsx",
    // "Editor.jsx",
    // "Sidebar.jsx",
    // "TextEditor.jsx",
    // "Window.jsx",
    "_originalImage.js",
    "_workerFetch.fragment.js",
    // "FunctionalErrorBoundary.mjs",
    // ".babelrc.json",
    // "reactTypeDefs.mjs"
];

type SplitFiles = [string[], string[]];
function makeSplitFiles(files: string[]) {
    return files.reduce<SplitFiles>(([a, b], cur) => EDITOR_FILES.includes(cur) ? [a, [...b, cur]] : [[...a, cur], b], [[], []]);
}

export default function Sidebar({ tab }: { tab: TabStateReturn }) {
    const [splitFiles, setSplitFiles] = React.useState<SplitFiles>([[], []]);

    async function updateFilesList(fileName: string) {
        const f = await localforage.keys();
        const split = makeSplitFiles(f);
        setSplitFiles(split);
        if(fileName) {
            tab.select(tab.baseId + "-" + (split[0].concat(split[1]).indexOf(fileName) + 1));
        }
    }

    React.useEffect(() => {
        void async function () {
            await updateFilesList("index.tsx");
        }();
    }, []);

    React.useEffect(() => {
        const onEvent = (e: any) => updateFilesList(e.detail)
        document.addEventListener("update-files-list", onEvent);
        return () => document.removeEventListener("update-files-list", onEvent);
    }, []);

    const dialog = useDialogState();
    const disclosure = useDisclosureState();

    return (
        <>
            <TabList {...tab} aria-label="Files" className={css`margin-right: 0.5rem !important;`}>
                {splitFiles[0].map(file => (
                    <FileTab file={file} tab={tab} />
                ))}
                <DisclosureContent {...disclosure}>
                    {() => disclosure.visible && splitFiles[1].map(file => (
                        <FileTab file={file} tab={tab} />
                    ))}
                </DisclosureContent>
            </TabList>
            <Disclosure {...disclosure} className={css`
                padding: 0 0.5rem !important;
                font-size: small !important;
                background-color: #efefef !important;
                color: black !important;
                margin-top: 0.5rem;
                white-space: inherit !important;
            `}>
                {disclosure.visible ? "Hide" : "Show"} editor internals
            </Disclosure>
            <DialogDisclosure {...dialog} className={css`margin-top: 0.5rem;`}>Add file</DialogDisclosure>
            <CreateFileDialog {...dialog} />
        </>
    );
}