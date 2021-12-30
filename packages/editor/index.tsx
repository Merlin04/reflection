import React from "react";
import localforage from "localforage";
import { css } from "@emotion/css";
import TextEditor from "./TextEditor";
import Sidebar from "./Sidebar";
import Window from "./Window";
import {
    Provider,
    useTabState,
    Portal,
    Button
} from "reakit";
import ReakitSystemBootstrap from "reakit-system-bootstrap";

import _Catch from "./FunctionalErrorBoundary";
export const Catch = _Catch;

function EditorInner() {
    const tab = useTabState({ orientation: "vertical", selectedId: null });

    const currentFile = tab.selectedId && document.getElementById(tab.selectedId)?.innerText;

    return (
        <div className={css`
            flex: 1;
            display: flex;
        `}>
            {/* Files */}
            <div className={css`
                flex: 1;
                max-width: 200px;
                overflow: auto;
            `}>
                <Sidebar tab={tab} />
            </div>
            {/* Editor */}
            <div className={css`
                flex: 4;
                display: flex;
                flex-direction: column;
                width: 0px;
            `}>
                {currentFile && <TextEditor currentFile={currentFile} />}
            </div>
        </div>
    );
}

function Editor() {
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        void async function() {
            if((await localforage.keys()).length === 0) {
                window.addEventListener("bootstrapcomplete", () => {
                    setLoading(false);
                });
            }
            else {
                setLoading(false);
            }
        }();
    }, []);

    return loading ? <p>Loading...</p> : <EditorInner />;
}

const EditorStateContext = React.createContext<[boolean, () => void]>(null as any);

// Also provides Reakit styles to the children in case they want to use Reakit
export function EditorProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const ctxFn = React.useCallback(() => setOpen(true), [setOpen]);

    return (
        <Provider unstable_system={ReakitSystemBootstrap}>
            <EditorStateContext.Provider value={[open, ctxFn]}>
                {children}
            </EditorStateContext.Provider>
            {open && (
                <Portal>
                    <Window onClose={() => setOpen(false)}>
                        <Editor />
                    </Window>
                </Portal>
            )}
        </Provider>
    );
}

export const useEditorState = () => React.useContext(EditorStateContext);

export function EditorButton() {
    const [isOpen, openEditor] = useEditorState();
    return isOpen ? null : (
        <Portal>
            <div className={css`
                position: absolute !important;
                bottom: 1rem;
                right: 0px;
                overflow: hidden;
            `}>
                <Button onClick={openEditor} className={css`
                    border-radius: 0.25rem 0 0 0.25rem !important;
                    position: relative;
                    right: -82px;
                    transition: right 0.1s cubic-bezier(0.79, 0.26, 0, 0.97) 0s, box-shadow 0.15s ease-in-out 0s !important;
                    &:hover {
                        right: 0;
                    }
                `}>{"</>  Edit code"}</Button>
            </div>
        </Portal>
    );
}