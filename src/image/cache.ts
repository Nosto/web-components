import { Layout } from "@unpic/core"

let imageCacheInstance: ReturnType<typeof createImageCache> | null = null

export const createImageCache = (persistance: boolean = false) => {
  // In-memory cache
  const memoryCache = new Map<string, string>()

  // Helper functions for memory cache
  const setMemoryCache = (url: string, value: string) => {
    memoryCache.set(url, value)
  }

  const getMemoryCache = (url: string) => {
    return memoryCache.get(url)
  }

  // Helper functions for localStorage cache
  const setLocalStorageCache = (url: string, value: string) => {
    localStorage.setItem(url, value)
  }

  const getLocalStorageCache = (url: string) => {
    return localStorage.getItem(url)
  }

  // Main cache functions
  const set = (url: string, value: string): void => {
    if (persistance) {
      setLocalStorageCache(url, value)
    } else {
      setMemoryCache(url, value)
    }
  }

  const get = (url: string) => {
    if (persistance) {
      return getLocalStorageCache(url) || undefined
    } else {
      return getMemoryCache(url)
    }
  }

  return {
    get,
    set
  }
}

export function generateCacheKey(
  src: string,
  width?: number | string,
  height?: number | string,
  layout: Layout = "constrained"
) {
  const parts = [src]
  if (width !== undefined) parts.push(`w${width}`)
  if (height !== undefined) parts.push(`h${height}`)
  if (layout) parts.push(`l${layout}`)
  return parts.join("_")
}

/**
 * This method is used to cache the transformed image URL
 * Caching is done in-memory or localStorage based on the `persistance` parameter.
 * cache key is a combination of the image URL and layout.
 *
 * @param key url+layout
 * @param fn transformer function that returns the image URL
 * @param persistance should the cache be persistent (localStorage) or in-memory?
 * @returns
 */
export const withCache = (key: string, fn: () => string, persistance = false) => {
  if (!imageCacheInstance) {
    imageCacheInstance = createImageCache(persistance)
  }
  const cachedValue = imageCacheInstance.get(key)

  if (!cachedValue) {
    const value = fn()
    imageCacheInstance.set(key, value)
    return value
  }

  return cachedValue
}
