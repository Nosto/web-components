import ky, { HTTPError } from "ky"

interface FetchOptions {
  cached?: boolean
}

// Create a base HTTP client with ky
const httpClient = ky.create({
  throwHttpErrors: true,
  retry: 0
})

const textCache = new Map<string, string>()
const jsonCache = new Map<string, unknown>()

/**
 * Clears all cached responses
 */
export function clearCache() {
  textCache.clear()
  jsonCache.clear()
}

/**
 * Fetches a URL and returns the response as text.
 * @param url - The URL to fetch
 * @param options - Optional configuration object
 * @param options.cached - If true, uses in-memory cache for the response
 * @returns Promise that resolves to the response text
 * @throws Error if the fetch request fails
 */
export async function getText(url: string, options?: FetchOptions): Promise<string> {
  if (options?.cached && textCache.has(url)) {
    return textCache.get(url)!
  }

  try {
    const text = await httpClient.get(url).text()

    if (options?.cached) {
      textCache.set(url, text)
    }

    return text
  } catch (error) {
    if (error instanceof HTTPError) {
      const response = error.response
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
    }
    throw error
  }
}

/**
 * Fetches a URL and returns the response as a JSON object.
 * @param url - The URL to fetch
 * @param options - Optional configuration object
 * @param options.cached - If true, uses in-memory cache for the response
 * @returns Promise that resolves to the parsed JSON response
 * @throws Error if the fetch request fails or JSON parsing fails
 */
export async function getJSON<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
  if (options?.cached && jsonCache.has(url)) {
    return jsonCache.get(url) as T
  }

  try {
    const json = await httpClient.get(url).json<T>()

    if (options?.cached) {
      jsonCache.set(url, json)
    }

    return json
  } catch (error) {
    if (error instanceof HTTPError) {
      const response = error.response
      throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
    }
    throw error
  }
}
