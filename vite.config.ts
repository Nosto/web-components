import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { ViteDevServer } from "vite"
import expressApp from "./dev/server"

function expressMiddleware() {
  return {
    name: "express",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(expressApp)
    }
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [expressMiddleware()],
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
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src")
    }
  },
  server: {
    port: 8080
  },
  test: {
    environment: "jsdom"
  }
}))
