interface FetchOptions {
  cached?: boolean
}

/**
 * Internal function to handle common fetch logic with error checking.
 * @param url - The URL to fetch
 * @param options - Optional fetch options
 * @returns Promise that resolves to the Response object
 * @throws Error if the fetch request fails
 */
async function fetchWithErrorHandling(url: string, options?: RequestInit) {
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

  const response = await fetchWithErrorHandling(url)
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
export async function getJSON<T = unknown>(url: string, options?: FetchOptions): Promise<T> {
  if (options?.cached && jsonCache.has(url)) {
    return jsonCache.get(url) as T
  }

  const response = await fetchWithErrorHandling(url)
  const json = await response.json()

  if (options?.cached) {
    jsonCache.set(url, json)
  }

  return json
}

/**
 * Sends a POST request with JSON body and returns the response as a JSON object.
 *
 * @example
 * ```typescript
 * // Simple POST request
 * const result = await postJSON('/api/data', { name: 'John' })
 *
 * // GraphQL request
 * const product = await postJSON('/graphql', {
 *   query: '{ product(handle: "test") { title } }',
 *   variables: { handle: 'test' }
 * })
 * ```
 *
 * @param url - The URL to POST to
 * @param body - The request body to be JSON-serialized
 * @returns Promise that resolves to the parsed JSON response
 * @throws Error if the fetch request fails or JSON parsing fails
 */
export async function postJSON<T = unknown>(url: string, body: unknown): Promise<T> {
  const response = await fetchWithErrorHandling(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })

  const json = await response.json()

  return json
}
