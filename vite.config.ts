import path, { resolve } from "path"
import { defineConfig } from "vitest/config"
import { ProxyOptions, ViteDevServer } from "vite"
import expressApp from "./dev/server"
import { exec } from "child_process"

const proxy: Record<string, string | ProxyOptions> = {
  "/": {}
}

function expressMiddleware() {
  return {
    name: "express",
    config() {
      return {
        server: { proxy },
        preview: { proxy }
      }
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(expressApp)
    }
  }
}

function customHMRReload() {
  let bundling = false

  const hmrBuild = () => {
    bundling = true
    exec("npm run build -- --mode development", (_, output, err) => {
      if (output) console.info(output)
      if (err) console.error(err)
    })
  }

  return {
    name: "custom-hmr-reload",
    handleHotUpdate: ({ file, server }) => {
      const fileName = path.basename(file)
      if (file.includes("/src/") && file.endsWith(".ts")) {
        console.log(`${fileName} changed, build and reload src changes`)

        if (!bundling) {
          hmrBuild()
          bundling = false

          server.ws.send({
            type: "custom",
            event: "src-reload"
          })
        }
      } else if (file.includes("/dev/")) {
        console.log(`${fileName} changed, reload dev server changes`)
        server.ws.send({
          type: "custom",
          event: "server-reload"
        })
      }
    }
  }
}

export default defineConfig(({ mode }) => ({
  plugins: [expressMiddleware(), customHMRReload()],
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
    },
    extensions: [".ts", ".tsx", ".json"]
  },
  server: {
    port: 8080
  },
  test: {
    environment: "jsdom"
  }
}))
