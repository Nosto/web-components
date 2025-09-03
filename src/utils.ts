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

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
}

export function createShopifyUrl(url: string) {
  const root = window.Shopify?.routes?.root ?? "/"
  return new URL(`${root}${url}`, window.location.href)
}
