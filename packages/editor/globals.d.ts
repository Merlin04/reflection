import monaco from 'monaco-editor/esm/vs/editor/editor.api';

declare global {
    var monacoEditor: monaco.editor.IStandaloneCodeEditor | undefined;
    var models: { [key: string]: monaco.editor.ITextModel };
}