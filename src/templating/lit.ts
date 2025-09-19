import { render, TemplateResult } from "lit"

/**
 * Renders a lit-html template result to an HTML element.
 *
 * @param element - The target HTML element to render into
 * @param template - The lit-html template result to render
 */
export function renderTemplate(element: HTMLElement, template: TemplateResult) {
  render(template, element)
}

/**
 * Re-export lit-html utilities for convenience
 */
export { html, render } from "lit"
