/**
 * Merges HTML string content into a target HTML element.
 * Parses the HTML string and appends all resulting nodes to the element.
 *
 * @param element - The target HTML element to merge content into
 * @param html - The HTML string to parse and merge
 *
 * @example
 * ```typescript
 * const container = document.createElement('div')
 * mergeDom(container, '<p>Hello</p><span>World</span>')
 * // container now contains: <p>Hello</p><span>World</span>
 * ```
 */
export function mergeDom(element: HTMLElement, html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Append all parsed nodes from the body to the target element
  Array.from(doc.body.childNodes).forEach(node => {
    element.appendChild(node.cloneNode(true))
  })
}
