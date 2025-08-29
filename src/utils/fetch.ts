/**
 * Simple fetch facade module that provides convenient methods for common fetch operations.
 */

/**
 * Fetches a URL and returns the response as text.
 * @param url - The URL to fetch
 * @returns Promise that resolves to the response text
 * @throws Error if the fetch request fails
 */
export async function getText(url: string): Promise<string> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }
  return await response.text()
}

/**
 * Fetches a URL and returns the response as a JSON object.
 * @param url - The URL to fetch
 * @returns Promise that resolves to the parsed JSON response
 * @throws Error if the fetch request fails or JSON parsing fails
 */
export async function getJSON(url: string): Promise<object> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
  }
  return await response.json()
}
