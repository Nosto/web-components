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

/**
 * Removes a specific key-value pair from the provided mapping for the given element.
 *
 * @param element - The HTMLElement to remove the provided value from
 * @param key - The symbol key to remove
 *
 * @example
 * ```typescript
 * const element = document.createElement('div');
 * const key = Symbol('data');
 * provide(element, key, 'value');
 * unprovide(element, key);
 * inject(element, key); // returns undefined
 * ```
 */
export function unprovide(element: HTMLElement, key: symbol): void

/**
 * Removes all provided values for the given element.
 * This completely removes the element's mapping from the internal WeakMap.
 *
 * @param element - The HTMLElement to remove all provided values from
 *
 * @example
 * ```typescript
 * const element = document.createElement('div');
 * const key1 = Symbol('data1');
 * const key2 = Symbol('data2');
 * provide(element, key1, 'value1');
 * provide(element, key2, 'value2');
 * unprovide(element);
 * inject(element, key1); // returns undefined
 * inject(element, key2); // returns undefined
 * ```
 */
export function unprovide(element: HTMLElement): void

export function unprovide(element: HTMLElement, key?: symbol): void {
  if (key === undefined) {
    // Remove entire element mapping
    mapping.delete(element)
  } else {
    // Remove specific key from element mapping
    const map = mapping.get(element)
    if (map) {
      map.delete(key)
      // Clean up empty map
      if (map.size === 0) {
        mapping.delete(element)
      }
    }
  }
}
