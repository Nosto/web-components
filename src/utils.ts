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

/**
 * Creates a Shopify URL with the proper root path and search parameters.
 * @param path - The path relative to the Shopify root (e.g., 'products/handle', 'search')
 * @param searchParams - Optional search parameters to add to the URL
 * @returns URL object with the proper Shopify root and search parameters
 */
export function createShopifyUrl(path: string, searchParams?: Record<string, string>): URL {
  const root = window.Shopify?.routes?.root ?? "/"
  const target = new URL(`${root}${path}`, window.location.href)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      target.searchParams.set(key, value)
    })
  }

  return target
}
