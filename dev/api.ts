import { Liquid } from "liquidjs"
import { resolve } from "path"
import { readFileSync } from "fs"

const engine = new Liquid({
  root: resolve("templates/"),
  extname: ".liquid"
})

export function render(template: string, dataJson: string) {
  const data = readFileSync(dataJson, "utf-8")
  return engine.renderFileSync(template, JSON.parse(data))
}
