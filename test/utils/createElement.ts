import { html as litHtml, render, type TemplateResult } from "lit-html"

/**
 * Tagged template function that creates a DOM element from a lit-html template
 * @param strings - Template strings array
 * @param values - Interpolated values
 * @returns The parsed DOM element
 * @throws Error if the template does not produce a valid element
 * @example
 * const div = element<HTMLDivElement>`<div>Hello</div>`
 */
export function element<E extends HTMLElement = HTMLElement>(strings: TemplateStringsArray, ...values: unknown[]): E {
  const template = litHtml(strings, ...values)
  const container = document.createElement("div")
  render(template, container)
  const el = container.firstElementChild
  if (!(el instanceof HTMLElement)) {
    throw new Error("Template did not produce a valid HTMLElement")
  }
  return el as E
}

/**
 * Tagged template function that creates an array of DOM elements from lit-html templates
 * Note: This function expects a template with multiple root elements
 * @param strings - Template strings array
 * @param values - Interpolated values
 * @returns Array of parsed DOM elements
 * @example
 * const [div1, div2] = elements<HTMLDivElement>`<div>One</div><div>Two</div>`
 */
export function elements<E extends HTMLElement = HTMLElement>(
  strings: TemplateStringsArray,
  ...values: unknown[]
): E[] {
  const template = litHtml(strings, ...values)
  const container = document.createElement("div")
  render(template, container)
  return Array.from(container.children) as E[]
}

/**
 * Converts a lit-html template result into a DOM element
 * @param template - The template result from lit-html's html function
 * @returns The parsed DOM element
 * @throws Error if the template does not produce a valid element
 * @deprecated Use `element` tagged template function instead
 */
export function createElement<E extends HTMLElement = HTMLElement>(template: TemplateResult): E {
  const container = document.createElement("div")
  render(template, container)
  const el = container.firstElementChild
  if (!(el instanceof HTMLElement)) {
    throw new Error("Template did not produce a valid HTMLElement")
  }
  return el as E
}

/**
 * Converts multiple lit-html template results into an array of DOM elements
 * @param templates - Variable number of template results from lit-html's html function
 * @returns Array of parsed DOM elements
 * @deprecated Use `elements` tagged template function instead
 */
export function createElements<E extends HTMLElement = HTMLElement>(...templates: TemplateResult[]): E[] {
  return templates.map(template => createElement<E>(template))
}
