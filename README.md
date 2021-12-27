# reflection

### Self-hosting web code editor (originally for Hack Club CodeJelly)

![Screenshot of editor](screenshot.png)

Reflection editor is a code editor that edits its own code, and uses modern web technologies to run everything on your browser. A "file system" is stored in your browser's IndexedDB, and a service worker serves the pages as if it was an actual server. As much of the code as possible is editable directly from the editor, from the editor frontend (written with React and Monaco) to the service worker's network request handler. 

Try it out here: [https://reflection-editor.netlify.app](https://reflection-editor.netlify.app)