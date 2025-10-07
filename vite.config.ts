import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { cssInlinePlugin } from "./build/css-inline-plugin.js"

export default defineConfig(() => ({
  plugins: [cssInlinePlugin()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src")
    }
  },
  server: {
    port: 8080
  },
  assetsInclude: ["**/*.css"],
  css: {
    // Ensure CSS is treated as text for import as string
    transformer: "postcss"
  },
  test: {
    coverage: {
      include: ["src/**/*.{js,ts}"],
      exclude: ["src/main.ts", "src/**/*.stories.ts"],
      skipFull: true,
      thresholds: {
        statements: 90,
        branches: 90,
        lines: 90,
        functions: 90
      }
    },
    environment: "jsdom",
    setupFiles: ["./test/setup.ts", "./test/msw.setup.ts"]
  }
}))
