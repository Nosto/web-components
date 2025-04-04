type FieldType<T> = T extends string ? StringConstructor : T extends boolean ? BooleanConstructor : never

type ConstructorMetadata<T extends HTMLElement> = {
  new (): T
  observedAttributes?: string[]
  attributes?: { [K in keyof T]?: FieldType<T[K]> }
}

export function customElement<T extends HTMLElement>(tagName: string) {
  return function (constructor: ConstructorMetadata<T>) {
    if (constructor.attributes) {
      const attributes: string[] = []
      Object.entries(constructor.attributes).forEach(([fieldName, type]) => {
        const attribute = toKebabCase(fieldName)
        attributes.push(attribute)
        const property = (type === String ? stringAttribute : booleanAttribute)(attribute)
        Object.defineProperty(constructor.prototype, fieldName, property)
      })
      constructor.observedAttributes = attributes
    }
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
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
