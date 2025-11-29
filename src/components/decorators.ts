import { toKebabCase } from "@/utils/toKebabCase"

type FieldType = StringConstructor | NumberConstructor | BooleanConstructor | ArrayConstructor

type ConstructorMetadata<T extends HTMLElement> = {
  new (): T
  mappedAttributes?: string[]
  observedAttributes?: string[]
}

export function customElement<T extends HTMLElement>(tagName: string, flags?: { observe?: boolean }) {
  return function (constructor: ConstructorMetadata<T>) {
    if (flags?.observe) {
      constructor.observedAttributes = constructor.prototype.mappedAttributes || []
    }
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

export function property(type: FieldType) {
  return function (target: unknown, propertyName: string) {
    Object.defineProperty(target, propertyName, getPropertyDescriptor(propertyName, type))
    const prototype = target as ConstructorMetadata<HTMLElement>
    const attributeName = toKebabCase(propertyName)
    if (!prototype.mappedAttributes) {
      prototype.mappedAttributes = [attributeName]
    } else if (!prototype.mappedAttributes.includes(attributeName)) {
      prototype.mappedAttributes.push(attributeName)
    }
  }
}

function getPropertyDescriptor(propertyName: string, type: FieldType) {
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
