const esbuild = require("esbuild");
const path = require("path");

const esBuildSettings = require("./esBuildSettings");

esbuild.serve({ servedir: path.resolve(__dirname, "../dist") }, esBuildSettings);
