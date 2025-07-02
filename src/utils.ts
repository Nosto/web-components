import { nostojs } from "@nosto/nosto-js"

export function intersectionOf(...arrays: string[][]) {
  if (arrays.length === 0) {
    return []
  }
  return arrays?.reduce((intersection, currentArray) => {
    return currentArray.filter(item => intersection.includes(item))
  })
}

export function assertRequired<T>(object: T, ...properties: (keyof T & string)[]) {
  properties.forEach(property => {
    if (object[property] === undefined || object[property] === null) {
      throw new Error(`Property ${property} is required.`)
    }
  })
}

export async function logFirstUsage() {
  if (localStorage.getItem("nosto:web-components:logged")) return
  localStorage.setItem("nosto:web-components:logged", "true")

  const api = await new Promise(nostojs)
  api.internal.logger.info("Nosto/web-components: First component initialized.")
}
