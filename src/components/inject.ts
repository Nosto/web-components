const mapping = new WeakMap<HTMLElement, Map<Symbol, unknown>>()

export function provide<T>(element: HTMLElement, key: Symbol, value: T) {
  let map = mapping.get(element)
  if (!map) {
    map = new Map()
    mapping.set(element, map)
  }
  map.set(key, value)
}

export function inject<T>(element: HTMLElement, key: Symbol): T | undefined {
  let current: HTMLElement | null = element
  while (current) {
    const map = mapping.get(current)
    if (map && map.has(key)) {
      return map.get(key) as T
    }
    current = current.parentElement ?? (current.getRootNode() as ShadowRoot).host as HTMLElement | null
  }
  return undefined
}
