import { resolve } from "path"
import { defineConfig } from "vitest/config"

export default defineConfig(() => ({
  plugins: [],
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
      exclude: ["src/main.ts", "src/**/*.stories.ts"],
      skipFull: true,
      thresholds: {
        statements: 90,
        branches: 85,
        lines: 90,
        functions: 90
      }
    },
    environment: "jsdom",
    setupFiles: ["./test/setup.ts", "./test/msw.setup.ts"]
  }
}))
