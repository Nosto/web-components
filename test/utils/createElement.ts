import type { TemplateExpression } from "@/templating/html"

/**
 * Converts an html template expression into a DOM element
 * @param template - The template expression from the html function
 * @returns The parsed DOM element
 */
export function createElement(template: TemplateExpression): HTMLElement {
  const div = document.createElement("div")
  div.innerHTML = template.html.trim()
  return div.firstElementChild as HTMLElement
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
  while (div.firstChild) {
    fragment.appendChild(div.firstChild)
  }
  return fragment
}
