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

/**
 * Fetches a URL and returns the response as text.
 * @param url - The URL to fetch
 * @returns Promise that resolves to the response text
 * @throws Error if the fetch request fails
 */
export async function getText(url: string) {
  const response = await fetchWithErrorHandling(url)
  return response.text()
}

/**
 * Fetches a URL and returns the response as a JSON object.
 * @param url - The URL to fetch
 * @returns Promise that resolves to the parsed JSON response
 * @throws Error if the fetch request fails or JSON parsing fails
 */
export async function getJSON(url: string) {
  const response = await fetchWithErrorHandling(url)
  return response.json()
}

/**
 * Posts JSON data to a URL and returns the response as text.
 * @param url - The URL to post to
 * @param data - The JSON data to post
 * @returns Promise that resolves to the response text
 * @throws Error if the request fails
 */
export async function postJSON(url: string, data: unknown) {
  const response = await fetchWithErrorHandling(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  return response.text()
}
