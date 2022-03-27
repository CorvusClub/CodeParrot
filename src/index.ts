import * as monaco from "monaco-editor";
import "./index.css";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

const ydoc = new Y.Doc();
const provider = new WebrtcProvider("monaco", ydoc);
const type = ydoc.getText("monaco");

self.MonacoEnvironment = {
    getWorkerUrl: function (moduleId, label) {
        if (label === "json") {
            return "./vs/language/json/json.worker.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
            return "./vs/language/css/css.worker.js";
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
            return "./vs/language/html/html.worker.js";
        }
        if (label === "typescript" || label === "javascript") {
            return "./vs/language/typescript/ts.worker.js";
        }
        return "./vs/editor/editor.worker.js";
    },
};

const editor = monaco.editor.create(document.getElementById("editor")!, {
    value: ["function x() {", '\tconsole.log("Hello world!");', "}"].join("\n"),
    language: "javascript",
});

const monacoBinding = new MonacoBinding(
    type,
    editor.getModel(),
    new Set([editor]),
    provider.awareness
);
