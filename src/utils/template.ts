/**
 * Create a template element with raw HTML content
 * This is useful for Vue-like template syntax that needs to be processed at runtime
 */
export function Template(props: { children?: unknown }): HTMLTemplateElement {
  const template = document.createElement("template")
  const children = props.children ?? []
  const childArray = Array.isArray(children) ? children : [children]
  const htmlContent = childArray.map(child => String(child)).join("")
  template.innerHTML = htmlContent
  return template
}
