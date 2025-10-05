import { escapeHtml } from "@/utils/escapeHtml"

export interface TemplateExpression {
  html: string
}

/**
 * Valid expression types that can be interpolated in template literals
 */
export type TemplateInterpolation =
  | string
  | number
  | boolean
  | undefined
  | null
  | TemplateExpression
  | TemplateInterpolation[]

/**
 * Processes template literal expressions according to their type:
 * - Arrays: contents are flattened and joined
 * - { html: string } objects: html is injected as-is
 * - Strings: HTML escaped for safety
 * - Other values: converted to string and HTML escaped
 */
function processExpression(expression: TemplateInterpolation): string {
  if (Array.isArray(expression)) {
    return expression.map(processExpression).join("")
  }

  if (expression && typeof expression === "object" && "html" in expression) {
    return (expression as TemplateExpression).html
  }

  if (expression === undefined || expression === null) {
    return ""
  }

  return escapeHtml(String(expression))
}

/**
 * A minimal lit-html like templating function that returns a TemplateExpression
 *
 * @example
 * ```typescript
 * const name = "World"
 * const template = html`<h1>Hello ${name}!</h1>`
 * console.log(template.html) // "<h1>Hello World!</h1>"
 * ```
 *
 * @example
 * ```typescript
 * const items = ["apple", "banana", "cherry"]
 * const template = html`<ul>${items.map(item => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * @example
 * ```typescript
 * const rawHtml = { html: "<em>emphasized</em>" }
 * const template = html`<p>This is ${rawHtml} text</p>`
 * ```
 */
export function html(strings: TemplateStringsArray, ...expressions: TemplateInterpolation[]): TemplateExpression {
  let result = ""

  for (let i = 0; i < strings.length; i++) {
    result += strings[i]
    if (i < expressions.length) {
      result += processExpression(expressions[i])
    }
  }

  return { html: result }
}

/**
 * A utility function that creates an HTML element from a template literal,
 * similar to `html` but returns an HTMLElement instead of a TemplateExpression.
 *
 * @example
 * ```typescript
 * const button = el`<button class="btn">Click me</button>`
 * document.body.appendChild(button)
 * ```
 *
 * @example
 * ```typescript
 * const name = "World"
 * const element = el`<h1>Hello ${name}!</h1>`
 * ```
 */
export function el(strings: TemplateStringsArray, ...expressions: TemplateInterpolation[]): HTMLElement {
  const template = html(strings, ...expressions)
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = template.html

  // Return the first element child, or throw if none exists or multiple exist
  const children = Array.from(tempDiv.children)
  if (children.length === 0) {
    throw new Error("el() template must contain at least one HTML element")
  }
  if (children.length > 1) {
    throw new Error("el() template must contain exactly one root HTML element")
  }

  return children[0] as HTMLElement
}
