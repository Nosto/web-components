const mapping = new WeakMap<HTMLElement, Map<symbol, unknown>>()

export function provide<T>(element: HTMLElement, key: symbol, value: T) {
  let map = mapping.get(element)
  if (!map) {
    map = new Map()
    mapping.set(element, map)
  }
  map.set(key, value)
}

export function inject<T>(element: HTMLElement, key: symbol): T | undefined {
  let current: HTMLElement | null = element
  while (current) {
    const map = mapping.get(current)
    if (map && map.has(key)) {
      return map.get(key) as T
    }
    if (current.parentElement) {
      current = current.parentElement
    } else {
      const rootNode = current.getRootNode()
      if (rootNode instanceof ShadowRoot) {
        current = rootNode.host as HTMLElement | null
      } else {
        current = null
      }
    }
  }
  return undefined
}
