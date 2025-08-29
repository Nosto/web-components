export function intersectionOf(...arrays: string[][]) {
  if (arrays.length === 0) {
    return []
  }
  return arrays?.reduce((intersection, currentArray) => {
    return currentArray.filter(item => intersection.includes(item))
  })
}

export function assertRequired<T>(object: T, ...properties: (keyof T & string)[]) {
  properties.forEach(property => {
    if (object[property] === undefined || object[property] === null) {
      throw new Error(`Property ${property} is required.`)
    }
  })
}

export function toCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, l) => l.toUpperCase())
}

// Section Rendering API utilities
import { JSONResult } from "@nosto/nosto-js/client"

/**
 * Interface for elements that have a section property
 */
export interface SectionElement {
  section: string
}

/**
 * Fetches section markup using Shopify's Section Rendering API
 * @param sectionId - The section ID to render
 * @param searchQuery - The search query (typically product handles joined with ":")
 * @returns Promise that resolves to the rendered HTML markup
 * @throws Error if the fetch fails
 */
export async function fetchSectionMarkup(sectionId: string, searchQuery: string): Promise<string> {
  const target = new URL("/search", window.location.href)
  target.searchParams.set("section_id", sectionId)
  target.searchParams.set("q", searchQuery)

  const result = await fetch(target)
  if (!result.ok) {
    throw new Error(`Failed to fetch section ${sectionId}`)
  }

  return await result.text()
}

/**
 * Fetches product markup using Shopify's Section Rendering API
 * @param handle - The product handle
 * @param sectionId - The section ID to render
 * @param variantId - Optional variant ID
 * @returns Promise that resolves to the rendered HTML markup
 * @throws Error if the fetch fails
 */
export async function fetchProductSectionMarkup(
  handle: string,
  sectionId: string,
  variantId?: string
): Promise<string> {
  const params = new URLSearchParams()
  params.set("section_id", sectionId)
  if (variantId) {
    params.set("variant", variantId)
  }

  const result = await fetch(`/products/${handle}?${params}`)
  if (!result.ok) {
    throw new Error("Failed to fetch product data")
  }

  return await result.text()
}

/**
 * Extracts HTML content from the first element in the body of parsed HTML
 * @param html - The HTML string to parse
 * @returns The inner HTML of the first body element, or the original HTML if parsing fails
 */
export function extractSectionContent(html: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  return doc.body.firstElementChild?.innerHTML?.trim() || html
}

/**
 * Replaces title content in elements with nosto-title attribute
 * @param html - The HTML string to process
 * @param title - The title to set
 * @returns The processed HTML string
 */
export function replaceTitleInMarkup(html: string, title: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  const headingEl = doc.querySelector("[nosto-title]")
  if (headingEl) {
    headingEl.textContent = title
  }

  return doc.body.firstElementChild?.innerHTML?.trim() || html
}

/**
 * Gets section markup for a campaign using the Section Rendering API
 * @param element - Element with section property
 * @param rec - JSON result containing products and optional title
 * @returns Promise that resolves to the processed HTML markup
 */
export async function getCampaignSectionMarkup(element: SectionElement, rec: JSONResult): Promise<string> {
  const handles = rec.products.map(product => product.handle).join(":")
  const sectionHtml = await fetchSectionMarkup(element.section, handles)
  let markup = extractSectionContent(sectionHtml)

  if (rec.title) {
    markup = replaceTitleInMarkup(`<body><div>${markup}</div></body>`, rec.title)
  }

  return markup
}
