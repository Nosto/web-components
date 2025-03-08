export function customElement(tagName: string) {
  return function (constructor: CustomElementConstructor) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

export function attribute(attrName: string) {
  return function (prototype: HTMLElement, propertyKey: string) {
    const constructor = prototype.constructor as { observedAttributes?: string[] }
    if (!constructor.observedAttributes) {
      constructor.observedAttributes = []
    }
    constructor.observedAttributes.push(attrName)

    Object.defineProperty(prototype, propertyKey, {
      get() {
        return this.getAttribute(attrName)
      },
      enumerable: true,
      configurable: true
    })
  }
}
