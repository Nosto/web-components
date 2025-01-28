import { resolve } from "path"
import { expressPlugin } from "./dev/server"
import { defineConfig } from "vitest/config"

export default defineConfig(({ mode }) => ({
  plugins: [expressPlugin()],
  build: {
    emptyOutDir: true,
    minify: true,
    sourcemap: mode === "development",
    lib: {
      name: "@nosto/nosto-web-components",
      entry: [resolve(__dirname, "src/main.ts")],
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format}.js`
    }
  },
  server: {
    port: 8080
  },
  test: {
    environment: "jsdom"
  }
}))
