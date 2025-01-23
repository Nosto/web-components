import express from "express"
import { ProxyOptions, ViteDevServer } from "vite"
import { Liquid } from "liquidjs"
import { readFileSync } from "fs"
import { resolve } from "path"

const app = express()
const engine = new Liquid({
  root: __dirname,
  extname: ".liquid"
})

app.engine("liquid", engine.express())
app.set("views", ["./dev/templates"])
app.set("view engine", "liquid")

const proxy: Record<string, string | ProxyOptions> = {
  "/": {}
}

app.get("/", (req, res) => {
  res.send("Nosto web components")
})

app.get("/simple", (req, res) => {
  const data = readFileSync(resolve(__dirname, "data/simple-product.json"), "utf-8")
  res.render("reco-template", JSON.parse(data))
})

export function expressPlugin() {
  return {
    name: "express",
    config() {
      return {
        server: { proxy },
        preview: { proxy }
      }
    },
    configureServer(server: ViteDevServer) {
      server.middlewares.use(app)
    }
  }
}
