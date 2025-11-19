import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import jest from "eslint-plugin-jest";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default [
  // Files/folders to ignore
  {
    ignores: ["dist/", "node_modules/"],
  },

  // Base JS recommended config
  pluginJs.configs.recommended,

  // TypeScript recommended config
  ...tseslint.configs.recommended,

  // Node.js global variables + parser settings
  {
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },

  // Jest config for tests
  {
    files: ["tests/**/*.{js,ts}", "**/*.test.{js,ts}"],
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off",
    },
  },

  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_", // <-- THIS IS THE KEY FIX
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },

  // Prettier recommended config (must come last)
  prettierRecommended,
];
