const esbuild = require("esbuild");
const esBuildSettings = require("./esBuildSettings");

async function build() {
    try {
        await esbuild.build(esBuildSettings);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

build();
