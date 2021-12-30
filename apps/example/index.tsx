// Welcome to reflection editor!
// Everything here is being served from your browser's
// IndexedDB using a service worker, including this
// editor's code, and you can edit all of it from here

import { useState } from "react";
import ReactDOM from "react-dom";
import { css } from '@emotion/css';
import { EditorProvider, EditorButton, Catch } from "@reflectkit/editor";

function App() {
    const [counter, setCounter] = useState(0);

    return(
        <div className={css`
            font-family: sans-serif;
        `}>
            <h1>Hello world!</h1>
            <p>Click the button in the bottom right corner to open the editor</p>
            <p>Counter value: {counter}</p>
            <button onClick={() => setCounter(counter + 1)}>Increment counter</button>
        </div>
    );
}

// Catch errors so the editor still works if the app crashes
const ErrorBoundary = Catch((props: {
    children: React.ReactNode
}, error: Error) => {
    if(error) {
        return (
            <div className={css`
                font-family: sans-serif;
            `}>
                <h1 className={css`color: red`}>An error has occured in your app</h1>
                <pre>{error.stack}</pre>
            </div>
        );
    }
    return props.children;
});

ReactDOM.render(<>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
    {/* Don't remove this! */}
    <EditorProvider>
        <EditorButton />
    </EditorProvider>
</>, document.getElementById("app"));