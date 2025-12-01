import { toKebabCase } from "./toKebabCase"

/**
 * Applies default values to an element if the corresponding attributes are not present in HTML.
 * This allows HTML attributes to always override programmatic defaults.
 *
 * @param element - The HTML element to apply defaults to
 * @param defaults - An object containing default values for element properties
 */
export function applyDefaults<T extends HTMLElement>(element: T, defaults: Partial<T>) {
  Object.entries(defaults).forEach(([key, value]) => {
    const attributeName = toKebabCase(key)
    if (!element.hasAttribute(attributeName)) {
      // @ts-expect-error - Dynamic property access
      element[key] = value
    }
  })
}
