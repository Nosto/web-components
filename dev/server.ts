import express from "express"
import { ProxyOptions, ViteDevServer } from "vite"
import { Liquid } from "liquidjs"
import { readFileSync } from "fs"
import { resolve } from "path"

const app = express()
const engine = new Liquid({
  root: resolve(__dirname, "templates"),
  extname: ".liquid",
  cache: process.env.NODE_ENV === "production"
})

console.log("global: ", resolve(__dirname, "templates"))

app.engine("liquid", engine.express())
app.set("views", resolve(__dirname, "templates"))
app.set("view engine", "liquid")
app.use(express.static("dist"))

const proxy: Record<string, string | ProxyOptions> = {
  "/": {}
}

app.get("/", (req, res) => {
  res.send("Nosto web components")
})

app.get("/simple", (req, res) => {
  console.log(resolve(__dirname, "templates"))
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
