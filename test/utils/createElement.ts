import type { TemplateExpression } from "@/templating/html"

/**
 * Converts an html template expression into a DOM element
 * @param template - The template expression from the html function
 * @returns The parsed DOM element
 * @throws Error if the template does not produce a valid element
 */
export function createElement(template: TemplateExpression): HTMLElement {
  const div = document.createElement("div")
  div.innerHTML = template.html.trim()
  const element = div.firstElementChild
  if (!(element instanceof HTMLElement)) {
    throw new Error(`Template did not produce a valid HTMLElement: ${template.html}`)
  }
  return element
}

/**
 * Converts an html template expression into a DocumentFragment containing multiple elements
 * @param template - The template expression from the html function
 * @returns A DocumentFragment containing the parsed elements
 */
export function createFragment(template: TemplateExpression): DocumentFragment {
  const div = document.createElement("div")
  div.innerHTML = template.html.trim()
  const fragment = document.createDocumentFragment()
  fragment.append(...div.childNodes)
  return fragment
}
