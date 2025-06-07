/**
 * A minimal Vue template compiler for HTML elements.
 *
 * Supported directives:
 *   v-text, v-html, v-show, v-if, v-else, v-elseif (TODO), v-for, v-pre, v-cloak
 * Unsupported:
 *   v-on, v-model, v-slot, v-once
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
  if (el.hasAttribute("v-pre")) {
    // Skip processing for elements with v-pre directive.
    el.removeAttribute("v-pre")
    return
  }

  // Process v-if directive: remove element if condition is false.
  if (el.hasAttribute("v-if")) {
    const condition = el.getAttribute("v-if")!
    if (!evaluate(condition, context)) {
      el.remove()
      return
    }
    el.removeAttribute("v-if")
    // @ts-expect-error flag for v-else
    el.vif = true
  }

  if (el.hasAttribute("v-else-if")) {
    const prevSibling = el.previousElementSibling
    // @ts-expect-error vif flag set by v-if handling
    if (prevSibling && prevSibling.vif) {
      el.remove()
      return
    }
    const condition = el.getAttribute("v-else-if")!
    if (!evaluate(condition, context)) {
      el.remove()
      return
    }
    el.removeAttribute("v-else-if")
    // @ts-expect-error flag for v-else
    el.vif = true
  }

  // Process v-else directive: remove element if the previous v-if flagged element was not removed.
  if (el.hasAttribute("v-else")) {
    // v-else should be processed only if the previous element was removed.
    const prevSibling = el.previousElementSibling
    // @ts-expect-error vif flag set by v-if handling
    if (prevSibling && prevSibling.vif) {
      el.remove()
      return
    }
    el.removeAttribute("v-else")
  }

  if (el instanceof HTMLElement && el.hasAttribute("v-show")) {
    // v-show directive: toggle visibility based on condition.
    const condition = el.getAttribute("v-show")!
    el.style.display = evaluate(condition, context) ? "" : "none"
    el.removeAttribute("v-show")
  }

  // Process v-for directive: clone element for each item in the list.
  if (el.hasAttribute("v-for")) {
    const directive = el.getAttribute("v-for")!
    const match = parseVfor(directive)
    if (match) {
      const { aliasExp, indexExp, listExp } = match
      const list = evaluate(listExp, context)
      if (Array.isArray(list)) {
        const parent = el.parentElement
        if (parent) {
          list.forEach((item, index) => {
            // Clone the element and remove the v-for attribute.
            const clone = el.cloneNode(true) as HTMLElement
            clone.removeAttribute("v-for")
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

  // Process v-bind and v-text on the current element.
  Array.from(el.attributes).forEach(attr => {
    // v-bind:property
    if (attr.name.startsWith("v-bind:")) {
      const prop = attr.name.slice("v-bind:".length)
      const val = evaluate(attr.value, context)
      setAttribute(el, prop, val)
      el.removeAttribute(attr.name)
    }
    // shorthand for v-bind:property
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
    // v-html: set innerHTML to evaluated expression.
    if (attr.name === "v-html") {
      el.innerHTML = String(evaluate(attr.value, context))
      el.removeAttribute("v-html")
    }
    // v-text: set textContent to evaluated expression.
    if (attr.name === "v-text") {
      el.textContent = String(evaluate(attr.value, context))
      el.removeAttribute("v-text")
    }
    // v-bind: set attributes from an object.
    if (attr.name === "v-bind") {
      const bindings = evaluate(attr.value, context) as object
      for (const [key, value] of Object.entries(bindings)) {
        setAttribute(el, key, value)
      }
      el.removeAttribute("v-bind")
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

  if (el.hasAttribute("v-cloak")) {
    // Remove v-cloak attribute to hide the element after processing.
    el.removeAttribute("v-cloak")
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
