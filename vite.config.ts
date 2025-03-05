import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { ViteDevServer, Rollup } from "vite"
import expressApp from "./dev/server"

function expressMiddleware() {
  return {
    name: "express",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(expressApp)
    }
  }
}

function outputOptions(mode: string) {
  const output = [
    {
      entryFileNames: "[name].[format].js",
      dir: "dist",
      format: "es"
    },
    {
      entryFileNames: "[name].[format].js",
      dir: "dist",
      format: "cjs"
    }
  ]

  if (mode === "development") {
    output.push({
      entryFileNames: "nwc.min.js",
      dir: resolve(__dirname, "../playcart/public/jsbuild/web-components"),
      format: "es"
    })
  }

  return output as Rollup.OutputOptions[]
}

export default defineConfig(({ mode }) => ({
  plugins: [expressMiddleware()],
  build: {
    emptyOutDir: true,
    minify: true,
    sourcemap: true,
    lib: {
      name: "@nosto/web-components",
      entry: [resolve(__dirname, "src/main.ts")],
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format}.js`
    },
    rollupOptions: { output: outputOptions(mode) }
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
