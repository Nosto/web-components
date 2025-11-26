import { render, type TemplateResult } from "lit-html"

/**
 * Converts a lit-html template result into a DOM element
 * @param template - The template result from lit-html's html function
 * @returns The parsed DOM element
 * @throws Error if the template does not produce a valid element
 */
export function createElement(template: TemplateResult): HTMLElement {
  const container = document.createElement("div")
  render(template, container)
  const element = container.firstElementChild
  if (!(element instanceof HTMLElement)) {
    throw new Error("Template did not produce a valid HTMLElement")
  }
  return element
}

/**
 * Converts a lit-html template result into a DocumentFragment containing multiple elements
 * @param template - The template result from lit-html's html function
 * @returns A DocumentFragment containing the parsed elements
 */
export function createFragment(template: TemplateResult): DocumentFragment {
  const container = document.createElement("div")
  render(template, container)
  const fragment = document.createDocumentFragment()
  fragment.append(...container.childNodes)
  return fragment
}
