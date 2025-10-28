type ConstructorWithProperties = {
  new (...args: unknown[]): HTMLElement
  properties?: Record<string, unknown>
  observedAttributes?: string[]
}

type Flags = {
  observe?: boolean
}

type PropertyOptions = {
  type?: typeof String | typeof Number | typeof Boolean | typeof Array
  attribute?: string | boolean
}

export function customElement(tagName: string, flags?: Flags) {
  return function (constructor: ConstructorWithProperties, _context?: ClassDecoratorContext): void {
    // Define properties immediately - this must happen synchronously
    if (constructor.properties) {
      Object.entries(constructor.properties).forEach(([fieldName, type]) => {
        const propertyDescriptor = getPropertyDescriptor(fieldName, type)
        Object.defineProperty(constructor.prototype, fieldName, propertyDescriptor)
      })
      if (flags?.observe) {
        constructor.observedAttributes = Object.keys(constructor.properties).map(toKebabCase)
      }
    }

    // Register the element immediately - the timing doesn't matter for element registration
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

/**
 * A property decorator that creates a reactive property which reflects to an attribute.
 * Similar to Lit's @property decorator but adapted for this component system.
 *
 * @example
 * ```ts
 * class MyElement extends HTMLElement {
 *   @property({ type: String })
 *   name: string = '';
 *
 *   @property({ type: Boolean })
 *   disabled: boolean = false;
 * }
 * ```
 */
export function property(options: PropertyOptions = {}) {
  return function <T extends HTMLElement, V>(_target: undefined, context: ClassFieldDecoratorContext<T, V>) {
    const fieldName = String(context.name)
    const { type = String, attribute } = options

    // Determine attribute name
    const attributeName =
      typeof attribute === "string" ? attribute : attribute === false ? null : toKebabCase(fieldName)

    if (context.kind === "field") {
      context.addInitializer(function () {
        if (attributeName) {
          // Define property descriptor that syncs with attribute
          const propertyDescriptor = getPropertyDescriptor(fieldName, type)
          Object.defineProperty(
            (this.constructor as ConstructorWithProperties).prototype,
            fieldName,
            propertyDescriptor
          )

          // Add to observedAttributes if needed
          const constructor = this.constructor as ConstructorWithProperties
          if (!constructor.observedAttributes) {
            constructor.observedAttributes = []
          }
          if (!constructor.observedAttributes.includes(attributeName)) {
            constructor.observedAttributes.push(attributeName)
          }
        }
      })
    }
  }
}

function getPropertyDescriptor(propertyName: string, type: unknown) {
  const attributeName = toKebabCase(propertyName)
  if (type === Boolean) {
    return booleanAttribute(attributeName)
  } else if (type === Number) {
    return numberAttribute(attributeName)
  } else if (type === Array) {
    return arrayAttribute(attributeName)
  }
  return stringAttribute(attributeName)
}

function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

// Note: These helper functions are available for future use if needed
// Currently the field decorator uses the existing getPropertyDescriptor approach

// function getAttributeValue(element: HTMLElement, attributeName: string, type: unknown) {
//   if (type === Boolean) {
//     return element.hasAttribute(attributeName)
//   } else if (type === Number) {
//     const value = element.getAttribute(attributeName)
//     return value ? Number(value) : undefined
//   } else if (type === Array) {
//     if (element.hasAttribute(attributeName)) {
//       const value = element.getAttribute(attributeName)
//       if (value) {
//         try {
//           const parsed = JSON.parse(value)
//           return Array.isArray(parsed) ? parsed : undefined
//         } catch {
//           return undefined
//         }
//       }
//     }
//     return undefined
//   }
//   // String type (default)
//   return element.getAttribute(attributeName)
// }

// function setAttributeValue(element: HTMLElement, attributeName: string, value: unknown, type: unknown) {
//   if (type === Boolean) {
//     element.toggleAttribute(attributeName, Boolean(value))
//   } else if (value === null || value === undefined) {
//     element.removeAttribute(attributeName)
//   } else if (type === Array && Array.isArray(value)) {
//     element.setAttribute(attributeName, JSON.stringify(value))
//   } else if (type === Array && !Array.isArray(value)) {
//     // Ignore non-array values for array properties
//     return
//   } else {
//     element.setAttribute(attributeName, String(value))
//   }
// }

function stringAttribute(attributeName: string) {
  return {
    get(this: HTMLElement) {
      return this.getAttribute(attributeName)!
    },
    set(this: HTMLElement, value?: string) {
      if (value === null || value === undefined) {
        this.removeAttribute(attributeName)
      } else {
        this.setAttribute(attributeName, value)
      }
    },
    configurable: true,
    enumerable: true
  }
}

function booleanAttribute(attributeName: string) {
  return {
    get(this: HTMLElement) {
      return this.hasAttribute(attributeName)
    },
    set(this: HTMLElement, value: boolean) {
      this.toggleAttribute(attributeName, value)
    },
    configurable: true,
    enumerable: true
  }
}

function numberAttribute(attributeName: string) {
  return {
    get(this: HTMLElement) {
      const value = this.getAttribute(attributeName)
      return value ? Number(value) : undefined
    },
    set(this: HTMLElement, value?: number) {
      if (value === null || value === undefined) {
        this.removeAttribute(attributeName)
      } else {
        this.setAttribute(attributeName, value.toString())
      }
    },
    configurable: true,
    enumerable: true
  }
}

function arrayAttribute(attributeName: string) {
  return {
    get(this: HTMLElement) {
      if (this.hasAttribute(attributeName)) {
        const value = this.getAttribute(attributeName)
        if (value) {
          try {
            const parsed = JSON.parse(value)
            return Array.isArray(parsed) ? parsed : undefined
          } catch {
            return undefined
          }
        }
      }
      return undefined
    },
    set(this: HTMLElement, value?: unknown[]) {
      if (value === null || value === undefined) {
        this.removeAttribute(attributeName)
      } else if (Array.isArray(value)) {
        this.setAttribute(attributeName, JSON.stringify(value))
      }
    },
    configurable: true,
    enumerable: true
  }
}
