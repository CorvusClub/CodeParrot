const copy = require("esbuild-plugin-copy").copy;
const path = require("path");

const workerEntryPoints = [
    "vs/language/json/json.worker.js",
    "vs/language/css/css.worker.js",
    "vs/language/html/html.worker.js",
    "vs/language/typescript/ts.worker.js",
    "vs/editor/editor.worker.js",
];

module.exports = {
    main: {
        entryPoints: ["src/index.ts"],
        bundle: true,
        outdir: path.resolve(__dirname, "../dist"),
        format: "esm",
        plugins: [
            copy({
                assets: {
                    from: ["src/index.html"],
                    to: ["index.html"],
                },
            }),
        ],
        loader: {
            ".ttf": "file",
        },
    },
    worker: {
        entryPoints: workerEntryPoints.map(entry =>
            path.resolve(__dirname, `../node_modules/monaco-editor/esm/${entry}`)
        ),
        bundle: true,
        format: "iife",
        outbase: path.resolve(__dirname, "../node_modules/monaco-editor/esm/"),
        outdir: path.resolve(__dirname, "../dist"),
    },
};
