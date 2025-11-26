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
 * Converts multiple lit-html template results into an array of DOM elements
 * @param templates - Variable number of template results from lit-html's html function
 * @returns Array of parsed DOM elements
 */
export function createElements(...templates: TemplateResult[]): HTMLElement[] {
  return templates.map(template => createElement(template))
}
