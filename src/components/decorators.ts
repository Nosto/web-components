type FieldType<T> = T extends string
  ? StringConstructor
  : T extends boolean
    ? BooleanConstructor
    : T extends number
      ? NumberConstructor
      : never

type ConstructorMetadata<T extends HTMLElement> = {
  new (): T
  attributes?: { [K in keyof T]?: FieldType<T[K]> }
}

export function customElement<T extends HTMLElement>(tagName: string) {
  return function (constructor: ConstructorMetadata<T>) {
    if (constructor.attributes) {
      Object.entries(constructor.attributes).forEach(([fieldName, type]) =>
        defineProperty(constructor.prototype, fieldName, type)
      )
    }
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

function defineProperty(target: unknown, propertyName: string, type: unknown) {
  const attributeName = toKebabCase(propertyName)
  if (type === Boolean) {
    Object.defineProperty(target, propertyName, booleanAttribute(attributeName))
  } else if (type === Number) {
    Object.defineProperty(target, propertyName, numberAttribute(attributeName))
  } else {
    Object.defineProperty(target, propertyName, stringAttribute(attributeName))
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
