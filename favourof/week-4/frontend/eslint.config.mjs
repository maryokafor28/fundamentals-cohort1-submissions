import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend recommended Next.js and TypeScript rules
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rule configuration
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
    },
  },

  // Ignore unnecessary files and folders
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
];

export default eslintConfig;
