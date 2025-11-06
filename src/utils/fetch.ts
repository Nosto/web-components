interface FetchOptions {
  cached?: boolean
}

interface GetJSONProps {
  url: string
  requestInit?: RequestInit
}

/**
 * Internal function to handle common fetch logic with error checking.
 * @param url - The URL to fetch
 * @returns Promise that resolves to the Response object
 * @throws Error if the fetch request fails
 */
async function fetchWithErrorHandling({ url, requestInit: options }: GetJSONProps) {
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }
  return response
}

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

  const response = await fetchWithErrorHandling({ url })
  const text = await response.text()

  if (options?.cached) {
    textCache.set(url, text)
  }

  return text
}

/**
 * Fetches a URL and returns the response as a JSON object.
 * @param url - The URL to fetch
 * @param options - Optional configuration object
 * @param options.cached - If true, uses in-memory cache for the response
 * @returns Promise that resolves to the parsed JSON response
 * @throws Error if the fetch request fails or JSON parsing fails
 */
export async function getJSON<T = unknown>(props: GetJSONProps, options?: FetchOptions): Promise<T> {
  const { url } = props
  if (options?.cached && jsonCache.has(url)) {
    return jsonCache.get(url) as T
  }

  const response = await fetchWithErrorHandling(props)
  const json = await response.json()

  if (options?.cached) {
    jsonCache.set(url, json)
  }

  return json
}
