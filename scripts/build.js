const esbuild = require("esbuild");
const esBuildSettings = require("./esBuildSettings");
const fs = require("fs/promises");
const path = require("path");

async function build() {
    await fs.rmdir(path.resolve(__dirname, "../dist"), { recursive: true });
    try {
        await esbuild.build(esBuildSettings);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

build();
