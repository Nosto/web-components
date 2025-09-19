export function element(tagName: string, attributes: Record<string, string> = {}, text = ""): HTMLElement {
  const el = document.createElement(tagName)
  
  // Set attributes
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === "className") {
      el.className = value
    } else {
      el.setAttribute(key, value)
    }
  })
  
  // Set text content if provided
  if (text) {
    el.textContent = text
  }
  
  return el
}