import globals from "globals"
import tseslint from "typescript-eslint"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import barrelFiles from "eslint-plugin-barrel-files"

export default tseslint.config(
  { ignores: ["dist", "docs"] },
  // Base TypeScript rules for all source and test files
  {
    extends: [...tseslint.configs.recommended],
    files: ["src/**/*.{js,ts,tsx}", "test/**/*.{js,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  },
  // Barrel files rules for source code
  {
    plugins: {
      "barrel-files": barrelFiles
    },
    files: ["src/**/*.{js,ts,tsx}"],
    rules: {
      "barrel-files/avoid-barrel-files": 2,
      "barrel-files/avoid-importing-barrel-files": 2,
      "barrel-files/avoid-namespace-import": 2,
      "barrel-files/avoid-re-export-all": 2
    }
  },
  // Test-specific rules (more permissive for testing convenience)
  {
    plugins: {
      "barrel-files": barrelFiles
    },
    files: ["test/**/*.{js,ts,tsx}"],
    rules: {
      // Allow barrel imports in tests for convenience (e.g., test setup)
      "barrel-files/avoid-importing-barrel-files": 0,
      // Allow namespace imports in tests (e.g., for dynamic registration in test setup)
      "barrel-files/avoid-namespace-import": 0,
      "barrel-files/avoid-re-export-all": 2,
      "barrel-files/avoid-barrel-files": 2
    }
  },
  // JSX/TSX specific rules for both src and test
  {
    files: ["src/**/*.tsx", "test/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "createElement"
        }
      ]
    }
  },
  eslintConfigPrettier,
  eslintPluginPrettierRecommended
)
