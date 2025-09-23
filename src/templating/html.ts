export interface TemplateExpression {
  html: string
}

/**
 * HTML escapes a string for safe insertion into HTML
 */
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/**
 * Processes template literal expressions according to their type:
 * - Arrays: contents are flattened and joined
 * - { html: string } objects: html is injected as-is
 * - Strings: HTML escaped for safety
 * - Other values: converted to string and HTML escaped
 */
function processExpression(expression: unknown): string {
  if (Array.isArray(expression)) {
    return expression.map(processExpression).join("")
  }

  if (expression && typeof expression === "object" && "html" in expression) {
    return (expression as TemplateExpression).html
  }

  if (expression === null || expression === undefined) {
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
export function html(strings: TemplateStringsArray, ...expressions: unknown[]): TemplateExpression {
  let result = ""

  for (let i = 0; i < strings.length; i++) {
    result += strings[i]
    if (i < expressions.length) {
      result += processExpression(expressions[i])
    }
  }

  return { html: result }
}
