import express from "express"
import { ProxyOptions, ViteDevServer } from "vite"
import { Liquid } from "liquidjs"
import path, { resolve } from "path"
import favicon from "serve-favicon"
import dataSeed from "./data-seed.json"

const app = express()
const engine = new Liquid({
  root: resolve(__dirname, "templates"),
  extname: ".liquid",
  cache: process.env.NODE_ENV === "production"
})

app.engine("liquid", engine.express())
app.set("views", resolve(__dirname, "templates"))
app.set("view engine", "liquid")
app.use(express.static("dist"))
app.use(favicon(path.join(import.meta.dirname, "asset", "favcon_Nosto_32x32.png")))

engine.registerFilter("reco_data", it => {
  return Object.entries(it).map(([_divId, data]) => data)
})

const proxy: Record<string, string | ProxyOptions> = {
  "/": {}
}

app.get("/", (req, res) => {
  try {
    res.render("reco-sku-select", { recs: dataSeed })
  } catch (e) {
    console.log(e)
  }
})

app.get("/sku-overlay", (req, res) => {
  try {
    res.render("reco-sku-overlay", { recs: dataSeed })
  } catch (e) {
    console.log(e)
  }
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
