const esbuild = require("esbuild");
const path = require("path");

const esBuildSettings = require("./esBuildSettings");

async function dev() {
    await require("./build");

    const { host, port } = await esbuild.serve(
        { servedir: path.resolve(__dirname, "../dist"), host: "localhost" },
        esBuildSettings.main
    );
    console.log(`Serving on http://${host}:${port}`);
}

module.exports = dev();
