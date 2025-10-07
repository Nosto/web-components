import { resolve } from "path"
import { defineConfig } from "vitest/config"
import fs from "fs"

export default defineConfig(() => ({
  plugins: [
    {
      name: "css-inline",
      resolveId(id, importer) {
        if (id.endsWith(".css?inline")) {
          // Resolve the actual CSS file path
          return this.resolve(id.replace("?inline", ""), importer).then(result => {
            return result ? result.id + "?inline" : null
          })
        }
      },
      load(id) {
        if (id.endsWith("?inline")) {
          const cssPath = id.replace("?inline", "")
          const css = fs.readFileSync(cssPath, "utf-8")
          return `export default ${JSON.stringify(css)}`
        }
      }
    }
  ],
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
