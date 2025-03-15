type FieldMappings = Record<string, StringConstructor | BooleanConstructor>

export function customElement(tagName: string) {
  return function (constructor: CustomElementConstructor & { attributes?: FieldMappings }) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }

    if (constructor.attributes) {
      Object.entries(constructor.attributes).forEach(([fieldName, type]) => {
        const attribute = toKebabCase(fieldName)
        const property = (type === String ? stringAttribute : booleanAttribute)(attribute)
        Object.defineProperty(constructor.prototype, fieldName, property)
      })
    }
  }
}

function toKebabCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function stringAttribute(attributeName: string) {
  return {
    get(this: HTMLElement) {
      return this.getAttribute(attributeName)!
    },
    set(this: HTMLElement, value: string) {
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
