/**
 * Creates a cached version of an asynchronous function.
 * Returns a tuple containing the wrapped function and a clear cache function.
 *
 * @param fn - The asynchronous function to be cached.
 * @returns A tuple with the cached function and a function to clear the cache.
 */
export function cached<K extends unknown[], V>(fn: (...keys: K) => Promise<V>) {
  const cache = new Map<string, Promise<V>>()

  function wrapped(...keys: K): Promise<V> {
    const cacheKey = keys.join(":")
    if (!cache.has(cacheKey)) {
      const promise = fn(...keys).catch(err => {
        cache.delete(cacheKey)
        throw err
      })
      cache.set(cacheKey, promise)
    }
    return cache.get(cacheKey)!
  }

  function clear() {
    cache.clear()
  }

  return [wrapped, clear] as const
}
