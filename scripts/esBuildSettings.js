const copy = require("esbuild-plugin-copy").copy;

module.exports = {
    entryPoints: ["src/index.ts"],
    bundle: true,
    outfile: "dist/index.js",
    format: "esm",
    plugins: [
        copy({
            assets: {
                from: ["src/index.html"],
                to: ["index.html"],
            },
        }),
    ],
};
