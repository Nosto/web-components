export function customElement(tagName: string) {
  return function (constructor: CustomElementConstructor) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}

export function withProperties(properties: Record<string, string>) {
  return function (constructor: CustomElementConstructor) {
    Object.defineProperty(constructor, "observedAttributes", {
      value: Object.values(properties)
    })

    Object.entries(properties).forEach(([key, value]) => {
      Object.defineProperty(constructor.prototype, key, {
        get() {
          return this.getAttribute(value)
        },
        enumerable: true,
        configurable: true
      })
    })
  }
}
