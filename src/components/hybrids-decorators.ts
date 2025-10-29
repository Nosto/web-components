/* eslint-disable @typescript-eslint/no-explicit-any */
import { define } from "hybrids"
import { customElement as originalCustomElement } from "./decorators"

/**
 * Enhanced customElement decorator that supports both traditional custom elements
 * and hybrids-based elements. When a hybrids descriptor is provided, it uses
 * hybrids for element definition, otherwise falls back to the original decorator.
 */
export function customElement<T extends HTMLElement>(
  tagName: string,
  descriptor?: Record<string, any>,
  flags?: { observe?: boolean }
) {
  return function (constructor: any) {
    if (descriptor) {
      // Use hybrids to define the element
      const hybridDescriptor = { ...descriptor, tag: tagName }
      define(hybridDescriptor)
    } else {
      // Fall back to original decorator for backward compatibility
      originalCustomElement<T>(tagName, flags)(constructor)
    }
  }
}

/**
 * Helper to create a hybrids descriptor from a class-based component
 * This helps transition existing components to hybrids gradually
 */
export function createHybridDescriptor<T extends HTMLElement>(
  ComponentClass: new () => T,
  template?: (host: HTMLElement) => any
): Record<string, any> {
  const descriptor: Record<string, any> = {}

  // Extract properties from the class
  const properties = (ComponentClass as any).properties || {}
  Object.keys(properties).forEach(prop => {
    descriptor[prop] = properties[prop]
  })

  // Add template if provided
  if (template) {
    descriptor.render = template
  }

  return descriptor
}
