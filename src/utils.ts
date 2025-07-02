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

let hasLogged = false

export function maybeLogFirstUsage() {
  if (hasLogged) return
  hasLogged = true

  new Promise(nostojs).then(api => {
    api.internal.logger.info("Nosto/web-components: First component initialized.")
  })
}
