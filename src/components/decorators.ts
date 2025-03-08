export function customElement(tagName: string) {
  return function (constructor: CustomElementConstructor) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

type Accessor<E, T> = (_: ClassAccessorDecoratorTarget<E, T>) => ClassAccessorDecoratorTarget<E, T>

export function attribute<E extends HTMLElement>(attributeName: string, type?: StringConstructor): Accessor<E, string>
export function attribute<E extends HTMLElement>(attributeName: string, type: BooleanConstructor): Accessor<E, boolean>

export function attribute(attributeName: string, type?: unknown): unknown {
  return function () {
    if (type === Boolean) {
      return booleanAttribute(attributeName)
    }
    return stringAttribute(attributeName)
  }
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
    }
  }
}

function booleanAttribute(attributeName: string) {
  return {
    get(this: HTMLElement) {
      return this.hasAttribute(attributeName)
    },
    set(this: HTMLElement, value: boolean) {
      this.toggleAttribute(attributeName, value)
    }
  }
}
