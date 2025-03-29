import { customElement } from "./decorators"
import { getStyle } from "./tailwind"

@customElement("nosto-atomic")
export class NostoAtomic extends HTMLElement {
  static attributes = {
    target: String
  }

  target!: string

  connectedCallback() {
    this.applyStyles()
  }

  applyStyles() {
    const element = this.target ? document.querySelector<HTMLElement>(this.target) : this
    const classNames = getClassNames(element!)
    if (classNames.size === 0) return
    const style = createStyleSheet(classNames)
    document.head.appendChild(style)
  }
}

function getClassNames(element: HTMLElement) {
  const nested = Array.from(element.querySelectorAll<HTMLElement>("*[class]"))
  const classNames = [...nested, element].flatMap(c => Array.from(c.classList))
  return new Set(classNames)
}

function createStyleSheet(classNames: Set<string>) {
  const styleSheet = document.createElement("style")

  classNames.forEach(className => {
    const styles = getStyle(className)
    if (styles) {
      const [name, rules] = styles
      const ruleString = Object.entries(rules)
        .map(([key, value]) => `${key}: ${value};`)
        .join(" ")
      styleSheet.append(`${name} { ${ruleString} }`)
    }
  })
  return styleSheet
}
