import { resolve } from "path"
import { defineConfig } from "vite"
import { expressPlugin } from "./dev/server"

export default defineConfig({
  plugins: [expressPlugin()],
  build: {
    lib: {
      name: "@nosto/nosto-web-components",
      entry: [resolve(__dirname, "src/main.ts")],
      formats: ["es", "cjs"],
      fileName: (format, name) => `${name}.${format}.js`
    }
  },
  server: {
    port: 8080
  }
})
