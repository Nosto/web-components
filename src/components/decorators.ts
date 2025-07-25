type FieldType<T> = T extends string
  ? StringConstructor
  : T extends number
    ? NumberConstructor
    : T extends boolean
      ? BooleanConstructor
      : never

type ConstructorMetadata<T extends HTMLElement> = {
  new (): T
  attributes?: { [K in keyof T]?: FieldType<T[K]> }
  observedAttributes?: string[]
}

type Flags = {
  observe?: boolean
}

export function customElement<T extends HTMLElement>(tagName: string, flags?: Flags) {
  return function (constructor: ConstructorMetadata<T>) {
    if (constructor.attributes) {
      Object.entries(constructor.attributes).forEach(([fieldName, type]) => {
        const propertyDescriptor = getPropertyDescriptor(fieldName, type)
        Object.defineProperty(constructor.prototype, fieldName, propertyDescriptor)
      })
      if (flags?.observe) {
        constructor.observedAttributes = Object.keys(constructor.attributes).map(toKebabCase)
      }
    }
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

function getPropertyDescriptor(propertyName: string, type: unknown) {
  const attributeName = toKebabCase(propertyName)
  if (type === Boolean) {
    return booleanAttribute(attributeName)
  } else if (type === Number) {
    return numberAttribute(attributeName)
  }
  return stringAttribute(attributeName)
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
