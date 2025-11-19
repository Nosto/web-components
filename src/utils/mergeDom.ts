/**
 * Merges HTML string content into a target HTML element by morphing the existing DOM tree.
 * This function intelligently updates the DOM by comparing the existing tree with the parsed HTML,
 * preserving nodes where possible and only making necessary changes.
 *
 * @param element - The target HTML element to merge content into
 * @param html - The HTML string to parse and merge
 *
 * @example
 * ```typescript
 * const container = document.createElement('div')
 * container.innerHTML = '<p>Hello</p>'
 * mergeDom(container, '<p>Hello World</p><span>New</span>')
 * // The <p> element is updated in place, <span> is added
 * ```
 */
export function mergeDom(element: HTMLElement, html: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")
  const newNodes = Array.from(doc.body.childNodes)

  morphChildren(element, newNodes)
}

function morphChildren(parent: Node, newChildren: Node[]) {
  const existingChildren = Array.from(parent.childNodes)
  const maxLength = Math.max(existingChildren.length, newChildren.length)

  for (let i = 0; i < maxLength; i++) {
    const existingChild = existingChildren[i]
    const newChild = newChildren[i]

    if (!newChild) {
      // No corresponding new child, remove the existing child
      if (existingChild) {
        parent.removeChild(existingChild)
      }
    } else if (!existingChild) {
      // No existing child, append the new child
      parent.appendChild(newChild.cloneNode(true))
    } else if (shouldReplace(existingChild, newChild)) {
      // Nodes are not compatible, replace the existing child
      parent.replaceChild(newChild.cloneNode(true), existingChild)
    } else if (existingChild.nodeType === Node.ELEMENT_NODE && newChild.nodeType === Node.ELEMENT_NODE) {
      // Both are elements, morph the existing element
      morphElement(existingChild as Element, newChild as Element)
    } else if (existingChild.nodeType === Node.TEXT_NODE && newChild.nodeType === Node.TEXT_NODE) {
      // Both are text nodes, update the text content if different
      if (existingChild.nodeValue !== newChild.nodeValue) {
        existingChild.nodeValue = newChild.nodeValue
      }
    } else {
      // Different node types, replace
      parent.replaceChild(newChild.cloneNode(true), existingChild)
    }
  }
}

function shouldReplace(oldNode: Node, newNode: Node): boolean {
  // Different node types
  if (oldNode.nodeType !== newNode.nodeType) {
    return true
  }

  // Different element tag names
  if (oldNode.nodeType === Node.ELEMENT_NODE && newNode.nodeType === Node.ELEMENT_NODE) {
    const oldElement = oldNode as Element
    const newElement = newNode as Element
    if (oldElement.tagName !== newElement.tagName) {
      return true
    }
  }

  return false
}

function morphElement(oldElement: Element, newElement: Element) {
  // Update attributes
  const oldAttrs = oldElement.attributes
  const newAttrs = newElement.attributes

  // Remove attributes that don't exist in the new element
  for (let i = oldAttrs.length - 1; i >= 0; i--) {
    const attr = oldAttrs[i]
    if (!newElement.hasAttribute(attr.name)) {
      oldElement.removeAttribute(attr.name)
    }
  }

  // Add or update attributes from the new element
  for (let i = 0; i < newAttrs.length; i++) {
    const attr = newAttrs[i]
    if (oldElement.getAttribute(attr.name) !== attr.value) {
      oldElement.setAttribute(attr.name, attr.value)
    }
  }

  // Recursively morph children
  morphChildren(oldElement, Array.from(newElement.childNodes))
}
