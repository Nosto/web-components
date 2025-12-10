// @ts-check
import eslint from "@eslint/js"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"
import storybook from "eslint-plugin-storybook"
import globals from "globals"
import eslintConfigPrettier from "eslint-config-prettier/flat"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import barrelFiles from "eslint-plugin-barrel-files"

export default defineConfig(
  { ignores: ["*", "!src", "!test", "src/shopify/graphql/generated/**"] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ["**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        jsx: true
      }
    }
  },
  {
    plugins: {
      // @ts-expect-error incompatible type for rules
      "barrel-files": barrelFiles
    },
    files: ["src/**/*.{js,ts,tsx}"],
    rules: {
      "barrel-files/avoid-barrel-files": 2,
      "barrel-files/avoid-namespace-import": 2,
      "barrel-files/avoid-re-export-all": 2
    }
  },
  {
    files: ["**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "createElement|createFragment|h"
        }
      ]
    }
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  storybook.configs["flat/recommended"]
)
