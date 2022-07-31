const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
    entry: "./bootstrap.js",
    output: {
        path: path.resolve(path.join(__dirname, ".."), "docs"),
        filename: "bootstrap.js",
    },
    mode: "production",
    plugins: [
        new CopyWebpackPlugin([
            "index.html",
            "style.css",
            {
                from: "./roms/loktar00",
                to: "roms/loktar00",
            },
            {
                from: "./roms/mattmikolay",
                to: "roms/mattmikolay",
            },
        ]),
    ],
};
