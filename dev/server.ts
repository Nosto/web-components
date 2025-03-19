import express from "express"
import { Liquid } from "liquidjs"
import path, { resolve } from "path"
import favicon from "serve-favicon"
import dataSeed from "./data-seed"

const engine = new Liquid({
  root: resolve(__dirname, "templates"),
  extname: ".liquid",
  cache: process.env.NODE_ENV === "production"
})

const app = express()
app.engine("liquid", engine.express())
app.set("views", resolve(__dirname, "templates"))
app.set("view engine", "liquid")

app.use("*.css", (req, res) => {
  res.sendFile(path.resolve(import.meta.dirname, `templates/${req.baseUrl}`))
})

app.use(express.static("dist"))
app.use(favicon(path.join(import.meta.dirname, "asset", "favcon_Nosto_32x32.png")))

const mapping = {
  "/": "select/reco-sku-select",
  "/sku-overlay": "overlay/reco-sku-overlay",
  "/dual": "dual/dual-sku",
  "/dual-select": "dual-select/dual-sku",
  "/trio": "trio/trio"
}
Object.entries(mapping).forEach(([path, template]) => {
  app.get(path, (req, res) => {
    res.render(template, dataSeed())
  })
})

export default app
