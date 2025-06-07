/**
 * A minimal Vue-like template compiler for HTML elements.
 * Supports: v-if, v-else, v-for, v-bind and v-text.
 *
 * Usage:
 *   import { compile } from './vue';
 *   compile(document.getElementById('app')!, { your: 'context' });
 */
export function compile(root: HTMLElement, context: object) {
  processElement(root, context)
}

function processElement(el: Element, context: object) {
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

  // Process v-for directive: clone element for each item in the list.
  if (el.hasAttribute("v-for")) {
    const directive = el.getAttribute("v-for")!
    // Expecting format: "item in items" (simple implementation).
    const inMatch = directive.match(/(\w+)\s+in\s+(.+)/)
    if (inMatch) {
      const [, alias, listExp] = inMatch
      const list = evaluate(listExp, context)
      if (Array.isArray(list)) {
        const parent = el.parentElement
        if (parent) {
          list.forEach((item, index) => {
            // Clone the element and remove the v-for attribute.
            const clone = el.cloneNode(true) as HTMLElement
            clone.removeAttribute("v-for")
            // Extend context with the current item and index.
            const childContext = { ...context, [alias]: item, $index: index }
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
      el.setAttribute(prop, String(val))
      el.removeAttribute(attr.name)
    }
    // shorthand for v-bind:property
    if (attr.name.startsWith(":")) {
      const prop = attr.name.slice(1)
      const val = evaluate(attr.value, context)
      el.setAttribute(prop, String(val))
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
    // v-text: set textContent to evaluated expression.
    if (attr.name === "v-text") {
      el.textContent = String(evaluate(attr.value, context))
      el.removeAttribute("v-text")
    }
    // v-bind: set attributes from an object.
    if (attr.name === "v-bind") {
      const bindings = evaluate(attr.value, context) as object
      for (const [key, value] of Object.entries(bindings)) {
        el.setAttribute(key, String(value))
      }
      el.removeAttribute("v-bind")
    }
  })

  // Recursively process child elements.
  Array.from(el.children).forEach(child => processElement(child, context))
}

// Cache for compiled function objects.
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const functionCache = new Map<string, Function>()

// Evaluates a JS expression in the context of provided data.
function evaluate(expression: string, context: object) {
  // Use sorted keys to ensure consistent order.
  const keys = Object.keys(context).sort()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const values = keys.map(key => (context as any)[key])
  // Build a cache key based on the expression and the context keys.
  const cacheKey = [expression, ...keys].join("|")
  let fn = functionCache.get(cacheKey)
  if (!fn) {
    // TODO sanitize the expression to prevent code injection.
    fn = new Function(...keys, `return ${expression};`)
    functionCache.set(cacheKey, fn)
  }
  return fn(...values)
}
