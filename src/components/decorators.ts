// Internal metadata storage for property decorators
const OBSERVED_ATTRIBUTES_KEY = Symbol("observedAttributes")
const PROPERTY_METADATA_KEY = Symbol("propertyMetadata")

type PropertyMetadata = {
  attributeName: string
  type: "string" | "boolean" | "number" | "array"
}

type ConstructorWithMetadata = {
  new (): HTMLElement
  [OBSERVED_ATTRIBUTES_KEY]?: string[]
  [PROPERTY_METADATA_KEY]?: Map<string, PropertyMetadata>
  observedAttributes?: string[]
}

type Flags = {
  observe?: boolean
}

// Legacy type for backward compatibility
type FieldType<T> = T extends string
  ? StringConstructor
  : T extends number
    ? NumberConstructor
    : T extends boolean
      ? BooleanConstructor
      : T extends unknown[]
        ? ArrayConstructor
        : never

type LegacyConstructorMetadata<T extends HTMLElement> = {
  new (): T
  properties?: { [K in keyof T]?: FieldType<T[K]> }
  observedAttributes?: string[]
}

export function customElement<T extends HTMLElement>(tagName: string, flags?: Flags) {
  return function (constructor: ConstructorWithMetadata | LegacyConstructorMetadata<T>) {
    // Handle new property decorator metadata
    const metadata = (constructor as ConstructorWithMetadata)[PROPERTY_METADATA_KEY]
    if (metadata) {
      metadata.forEach((propMeta, propertyName) => {
        const propertyDescriptor = getPropertyDescriptorByType(propMeta.attributeName, propMeta.type)
        Object.defineProperty(constructor.prototype, propertyName, propertyDescriptor)
      })

      if (flags?.observe) {
        const observedAttrs = Array.from(metadata.values()).map(meta => meta.attributeName)
        constructor.observedAttributes = observedAttrs
      }
    }

    // Handle legacy static properties for backward compatibility
    const legacyConstructor = constructor as LegacyConstructorMetadata<T>
    if (legacyConstructor.properties) {
      Object.entries(legacyConstructor.properties).forEach(([fieldName, type]) => {
        const propertyDescriptor = getPropertyDescriptor(fieldName, type)
        Object.defineProperty(constructor.prototype, fieldName, propertyDescriptor)
      })
      if (flags?.observe) {
        constructor.observedAttributes = Object.keys(legacyConstructor.properties).map(toKebabCase)
      }
    }

    // Register the custom element
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

// Property decorators
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attrString(target: any, propertyKey: string) {
  addPropertyMetadata(target, propertyKey, "string")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attrBoolean(target: any, propertyKey: string) {
  addPropertyMetadata(target, propertyKey, "boolean")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attrNumber(target: any, propertyKey: string) {
  addPropertyMetadata(target, propertyKey, "number")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function attrArray(target: any, propertyKey: string) {
  addPropertyMetadata(target, propertyKey, "array")
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function addPropertyMetadata(target: any, propertyKey: string, type: "string" | "boolean" | "number" | "array") {
  const constructor = target.constructor as ConstructorWithMetadata
  if (!constructor[PROPERTY_METADATA_KEY]) {
    constructor[PROPERTY_METADATA_KEY] = new Map()
  }

  const attributeName = toKebabCase(propertyKey)
  constructor[PROPERTY_METADATA_KEY].set(propertyKey, { attributeName, type })
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

function getPropertyDescriptorByType(attributeName: string, type: "string" | "boolean" | "number" | "array") {
  switch (type) {
    case "boolean":
      return booleanAttribute(attributeName)
    case "number":
      return numberAttribute(attributeName)
    case "array":
      return arrayAttribute(attributeName)
    case "string":
    default:
      return stringAttribute(attributeName)
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
