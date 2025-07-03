/**
 * A minimal Vue template compiler for HTML elements.
 *
 * Supported directives:
 *   n-text, n-html, n-show, n-if, n-else, n-elseif (TODO), n-for, n-pre, n-cloak
 * Unsupported:
 *   n-on, n-model, n-slot, n-once
 */
export function compile(root: HTMLElement, context: object) {
  processElement(root, context)
}

function parseVfor(directive: string) {
  let match = directive.match(/(\w+)\s+in\s+(.+)/)
  if (match) {
    const [, aliasExp, listExp] = match
    return { aliasExp, indexExp: "$index", listExp }
  }
  match = directive.match(/\((\w+)\s*,\s*(\w+)\)\s+in\s+(.+)/)
  if (match) {
    const [, aliasExp, indexExp, listExp] = match
    return { aliasExp, indexExp, listExp }
  }
}

function setAttribute(el: Element, name: string, value: unknown) {
  if (el instanceof HTMLElement && name === "style" && value && typeof value === "object") {
    Object.entries(value).forEach(([key, val]) => {
      el.style.setProperty(key, String(val))
    })
  } else {
    el.setAttribute(name, String(value))
  }
}

function processElement(el: Element, context: object) {
  if (el.hasAttribute("n-pre")) {
    // Skip processing for elements with n-pre directive.
    el.removeAttribute("n-pre")
    return
  }

  // Process n-if directive: remove element if condition is false.
  if (el.hasAttribute("n-if")) {
    const condition = el.getAttribute("n-if")!
    if (!evaluate(condition, context)) {
      el.remove()
      return
    }
    el.removeAttribute("n-if")
    // @ts-expect-error flag for n-else
    el.vif = true
  }

  if (el.hasAttribute("n-else-if")) {
    const prevSibling = el.previousElementSibling
    // @ts-expect-error vif flag set by n-if handling
    if (prevSibling && prevSibling.vif) {
      el.remove()
      return
    }
    const condition = el.getAttribute("n-else-if")!
    if (!evaluate(condition, context)) {
      el.remove()
      return
    }
    el.removeAttribute("n-else-if")
    // @ts-expect-error flag for n-else
    el.vif = true
  }

  // Process n-else directive: remove element if the previous n-if flagged element was not removed.
  if (el.hasAttribute("n-else")) {
    // n-else should be processed only if the previous element was removed.
    const prevSibling = el.previousElementSibling
    // @ts-expect-error vif flag set by n-if handling
    if (prevSibling && prevSibling.vif) {
      el.remove()
      return
    }
    el.removeAttribute("n-else")
  }

  if (el instanceof HTMLElement && el.hasAttribute("n-show")) {
    // n-show directive: toggle visibility based on condition.
    const condition = el.getAttribute("n-show")!
    el.style.display = evaluate(condition, context) ? "" : "none"
    el.removeAttribute("n-show")
  }

  // Process n-for directive: clone element for each item in the list.
  if (el.hasAttribute("n-for")) {
    const directive = el.getAttribute("n-for")!
    const match = parseVfor(directive)
    if (match) {
      const { aliasExp, indexExp, listExp } = match
      const list = evaluate(listExp, context)
      if (Array.isArray(list)) {
        const parent = el.parentElement
        if (parent) {
          list.forEach((item, index) => {
            // Clone the element and remove the n-for attribute.
            const clone = el.cloneNode(true) as HTMLElement
            clone.removeAttribute("n-for")
            // Extend context with the current item and index.
            const childContext = { ...context, [aliasExp]: item, [indexExp]: index }
            processElement(clone, childContext)
            parent.insertBefore(clone, el)
          })
          // Remove original element after processing.
          el.remove()
          return
        }
      }
    }
  }

  // Process n-bind and n-text on the current element.
  Array.from(el.attributes).forEach(attr => {
    // n-bind:property
    if (attr.name.startsWith("n-bind:")) {
      const prop = attr.name.slice("n-bind:".length)
      const val = evaluate(attr.value, context)
      setAttribute(el, prop, val)
      el.removeAttribute(attr.name)
    }
    // shorthand for n-bind:property
    if (attr.name.startsWith(":")) {
      const prop = attr.name.slice(1)
      const val = evaluate(attr.value, context)
      setAttribute(el, prop, val)
      el.removeAttribute(attr.name)
    }
    // property binding
    if (attr.name.startsWith(".")) {
      const prop = attr.name.slice(1)
      const val = evaluate(attr.value, context)
      // @ts-expect-error setting property directly
      el[prop] = val
      el.removeAttribute(attr.name)
    }
    // n-html: set innerHTML to evaluated expression.
    if (attr.name === "n-html") {
      el.innerHTML = String(evaluate(attr.value, context))
      el.removeAttribute("n-html")
    }
    // n-text: set textContent to evaluated expression.
    if (attr.name === "n-text") {
      el.textContent = String(evaluate(attr.value, context))
      el.removeAttribute("n-text")
    }
    // n-bind: set attributes from an object.
    if (attr.name === "n-bind") {
      const bindings = evaluate(attr.value, context) as object
      for (const [key, value] of Object.entries(bindings)) {
        setAttribute(el, key, value)
      }
      el.removeAttribute("n-bind")
    }
  })

  // Recursively process child elements.
  Array.from(el.childNodes).forEach(child => {
    if (child.nodeType === Node.TEXT_NODE) {
      child.textContent = child.textContent!.replace(/\{\{(.*?)\}\}/g, (_, expr) => {
        return evaluate(expr.trim(), context) || ""
      })
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      processElement(child as Element, context)
    } else {
      child.remove()
    }
  })

  if (el.hasAttribute("n-cloak")) {
    // Remove n-cloak attribute to hide the element after processing.
    el.removeAttribute("n-cloak")
  }
}

// Cache for compiled function objects.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const functionCache = new Map<string, Function>()

// Evaluates a JS expression in the context of provided data.
function evaluate(expression: string, context: object) {
  // Build a cache key based on the expression and the context keys.
  let fn = functionCache.get(expression)
  if (!fn) {
    // TODO sanitize the expression to prevent code injection.
    fn = new Function("$data", `with ($data) { return ${expression}; }`)
    functionCache.set(expression, fn)
  }
  return fn(context)
}
