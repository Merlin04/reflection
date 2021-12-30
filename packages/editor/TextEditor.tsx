import localforage from "localforage";
import { css } from "@emotion/css";
import ActionsMenu from "./ActionsMenu";
import reactTypeDefs from "./reactTypeDefs";
import { Group, Button } from "reakit";
import React from "react";
import monaco from "monaco-editor/esm/vs/editor/editor.api";

function EditorLoader(props: Omit<EditorProps, "fileContents">) {
    // TODO: can probably remove this now that we're importing monaco as an ES module
    const [loading, setLoading] = React.useState(() => !monaco);
    React.useEffect(() => {
        if (!loading) return;

        document.addEventListener("monaco-editor-ready", () => {
            setLoading(false);
        });
    }, []);

    return loading ? <div>Loading...</div> : <EditorDataProvider {...props} />;
}

export default EditorLoader;

let lastCurrentFile: string | null = null;
function EditorDataProvider(props: Omit<EditorProps, "fileContents">) {
    const { currentFile } = props;
    const [fileContents, setFileContents] = React.useState<string | false>(false);

    // Need to do this as soon as possible so the component doesn't render with the new currentFile but old fileContents
    if(lastCurrentFile !== currentFile) {
        setFileContents(false);
        lastCurrentFile = currentFile;
    }

    React.useEffect(() => {
        void async function() {
            setFileContents((await localforage.getItem(currentFile))!);
        }();
    }, [currentFile]);

    return fileContents === false ? <div>Loading...</div> : <Editor {...props} fileContents={fileContents} />;
}

globalThis.models = {};
globalThis.monacoEditor = undefined;

// Monaco TSX setup from https://github.com/Microsoft/monaco-editor/issues/264#issuecomment-654578687
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    esModuleInterop: true,
    jsx: monaco.languages.typescript.JsxEmit.React,
    reactNamespace: "React",
    allowJs: true,
    typeRoots: ["node_modules/@types"],
  });

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
});

monaco.languages.typescript.typescriptDefaults.addExtraLib(
    reactTypeDefs,
    `file:///node_modules/@react/types/index.d.ts`
);
// End Monaco TSX setup

const languages: Record<string, string> = {
    "js": "javascript",
    "mjs": "javascript",
    "jsx": "javascript",
    "ts": "typescript",
    "tsx": "typescript"
};

interface EditorProps extends React.HTMLAttributes<HTMLDivElement> {
    currentFile: string;
    fileContents: string;
}

function Editor(props: EditorProps) {
    const { currentFile, fileContents, ...divProps } = props;
    const editorDiv = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        monacoEditor = monaco.editor.create(editorDiv.current!, {
            // These values don't matter because the default model will be replaced immediately
            value: "",
            language: "javascript"
        });
    }, []);

    React.useEffect(() => {
        // Set editor contents to fileContents
        if(!models[currentFile]) {
            const ext = currentFile.split(".").pop()!;
            models[currentFile] = monaco.editor.createModel(fileContents,
                languages[ext] ?? ext,
                // TODO: source file path integration with Monaco
                //@ts-ignore
                "file:///" + currentFile
            );
        }
        monacoEditor?.setModel(models[currentFile]);
    }, [currentFile]);

    return (
        <>
            <Group>
                <ActionsMenu />
                <Button onClick={async () => await localforage.setItem(currentFile, models[currentFile].getValue())}>Save</Button>
                <Button onClick={() => window.location.reload()}>Reload</Button>
            </Group>
            <div className={css`flex: 1; position: relative;`} {...divProps}>
                <div ref={editorDiv} className={css`position: absolute; width: 100%; height: 100%;`} />
            </div>
        </>
    );
}