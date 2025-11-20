import { resolve } from "path"
import { defineConfig } from "vitest/config"
import { parse, print } from "graphql"

const graphqlPlugin = () => ({
  name: "vite-plugin-graphql",
  transform(src, id) {
    if (id.endsWith(".graphql")) {
      const document = parse(src)
      const minified = print(document).replace(/\s+/g, " ").trim()
      return {
        code: `export default ${JSON.stringify(minified)}`,
        map: null
      }
    }
  }
})

export default defineConfig(() => ({
  plugins: [graphqlPlugin()],
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
