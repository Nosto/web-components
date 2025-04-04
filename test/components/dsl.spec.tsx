import { describe, it, expect } from "vitest"
import { createElement } from "../utils/jsx"

function component(name: string, renderFn: () => string) {
  class DynamicComponent extends HTMLElement {
    connectedCallback() {
      this.innerHTML = renderFn.bind(this)()
    }
  }

  if (!customElements.get(name)) {
    customElements.define(name, DynamicComponent)
  }
}

describe("mini dsl", () => {
  it("should render components created with the component function", () => {
    // Define a simple header component
    component("app-header", function (this: HTMLElement) {
      const title = this.getAttribute("title") || "Default Title"
      return `<header class="app-header"><h1>${title}</h1></header>`
    })

    // Define a button component
    component("app-button", function (this: HTMLElement) {
      const label = this.getAttribute("label") || "Click me"
      const type = this.getAttribute("type") || "button"
      return `<button type="${type}" class="app-button">${label}</button>`
    })

    // Define a card component
    component("app-card", function (this: HTMLElement) {
      const heading = this.getAttribute("heading") || "Card Title"
      return `
        <div class="app-card">
          <div class="app-card-header">${heading}</div>
          <div class="app-card-content">${this.innerHTML}</div>
        </div>
      `
    })

    // Create a JSX example using the components
    const app = (
      <div class="app">
        <app-header title="My Application"></app-header>
        <main>
          <app-card heading="Welcome">
            <p>This is a simple example of using web components with JSX.</p>
            <app-button label="Learn More" type="button"></app-button>
          </app-card>
        </main>
      </div>
    )

    // Append to document for testing
    document.body.appendChild(app)

    // Assertions
    expect(document.querySelector("app-header h1")?.textContent).toBe("My Application")
    expect(document.querySelector("app-card .app-card-header")?.textContent).toBe("Welcome")
    expect(document.querySelector("app-button")?.textContent).toBe("Learn More")
  })
})
