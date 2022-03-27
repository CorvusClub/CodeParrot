const esbuild = require("esbuild");
const path = require("path");

const esBuildSettings = require("./esBuildSettings");

require("./build");

esbuild
    .serve(
        { servedir: path.resolve(__dirname, "../dist"), host: "localhost" },
        esBuildSettings.main
    )
    .then(({ host, port }) => {
        console.log(`Serving on http://${host}:${port}`);
    });
