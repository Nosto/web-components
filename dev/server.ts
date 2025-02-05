import express from "express"
import { Liquid } from "liquidjs"
import path, { resolve } from "path"
import favicon from "serve-favicon"
import dataSeed from "./data-seed"

const app = express()
const engine = new Liquid({
  root: resolve(__dirname, "templates"),
  extname: ".liquid",
  cache: process.env.NODE_ENV === "production"
})

app.engine("liquid", engine.express())
app.set("views", resolve(__dirname, "templates"))
app.set("view engine", "liquid")

app.use("*.css", (req, res) => {
  res.sendFile(path.resolve(import.meta.dirname, `templates/${req.baseUrl}`))
})

app.use(express.static("dist"))
app.use(favicon(path.join(import.meta.dirname, "asset", "favcon_Nosto_32x32.png")))

engine.registerFilter("reco_data", it => {
  return Object.values(it)
})

app.get("/", (_req, res) => {
  try {
    res.render("select/reco-sku-select", { recs: dataSeed() })
  } catch (e) {
    console.error(e)
  }
})

app.get("/sku-overlay", (req, res) => {
  try {
    res.render("overlay/reco-sku-overlay", { recs: dataSeed() })
  } catch (e) {
    console.error(e)
  }
})

app.get("/dual", (req, res) => {
  try {
    res.render("dual/dual-sku", { recs: dataSeed() })
  } catch (e) {
    console.error(e)
  }
})

export default app
