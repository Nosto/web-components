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

export default defineConfig(() => ({
  plugins: [expressMiddleware()],
  resolve: {
    alias: {
      "@": resolve(import.meta.dirname, "./src")
    }
  },
  server: {
    port: 8080
  },
  test: {
    coverage: {
      include: ["src/**/*.{js,ts}"],
      exclude: ["src/main.ts"],
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
