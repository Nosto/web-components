export function customElement(tagName: string) {
  return function (constructor: CustomElementConstructor) {
    if (!window.customElements.get(tagName)) {
      window.customElements.define(tagName, constructor)
    }
  }
}
