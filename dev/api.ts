import { Liquid } from "liquidjs"
import { resolve } from "path"
import { readFileSync } from "fs"

const engine = new Liquid({
  root: resolve("templates/"),
  extname: ".liquid"
})

/**
 * Renders liquid template specified by the template parameter with context data from the json file
 *
 * @param template liquid template name
 * @param jsonPath path to json file containing context object
 */
export function render(template: string, jsonPath: string) {
  const data = readFileSync(jsonPath, "utf-8")
  return engine.renderFileSync(template, JSON.parse(data))
}
