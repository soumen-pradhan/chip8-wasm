export default {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    plugins: [
        "@typescript-eslint",
        "prettier"
    ],
    rules: {
        "@typescript-eslint/no-unused-vars": [
            "error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": true }
        ]
    },
};
