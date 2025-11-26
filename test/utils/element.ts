import { html as litHtml, render } from "lit-html"

/**
 * Tagged template function that creates a DOM element from a lit-html template
 * @param strings - Template strings array
 * @param values - Interpolated values
 * @returns The parsed DOM element
 * @throws Error if the template does not produce a valid element
 * @example
 * const div = element`<div>Hello</div>` as HTMLDivElement
 */
export function element(strings: TemplateStringsArray, ...values: unknown[]): HTMLElement {
  const template = litHtml(strings, ...values)
  const container = document.createElement("div")
  render(template, container)
  const el = container.firstElementChild
  if (!(el instanceof HTMLElement)) {
    throw new Error("Template did not produce a valid HTMLElement")
  }
  return el
}

/**
 * Tagged template function that creates an array of DOM elements from lit-html templates
 * Note: This function expects a template with multiple root elements
 * @param strings - Template strings array
 * @param values - Interpolated values
 * @returns Array of parsed DOM elements
 * @example
 * const [div1, div2] = elements`<div>One</div><div>Two</div>` as HTMLDivElement[]
 */
export function elements(strings: TemplateStringsArray, ...values: unknown[]): HTMLElement[] {
  const template = litHtml(strings, ...values)
  const container = document.createElement("div")
  render(template, container)
  return Array.from(container.children) as HTMLElement[]
}
