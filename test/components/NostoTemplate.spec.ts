import { describe, it, expect } from "vitest"
import { NostoTemplate } from "../../src/components/NostoTemplate"
import * as Liquid from "liquidjs"
import * as Handlebars from "handlebars"

describe("NostoTemplate", () => {
  it("should throw an error if no data element is found", () => {
    const element = new NostoTemplate()
    element.language = "liquid"
    expect(() => element.connectedCallback()).toThrowError("No data element found.")
  })

  it("should throw an error for unsupported template language", () => {
    const element = new NostoTemplate()
    const script = document.createElement("script")
    script.type = "application/json"
    script.textContent = JSON.stringify({})
    element.appendChild(script)

    expect(() => element.connectedCallback()).toThrowError("Unsupported template language null")
  })

  it("should render using Handlebars", async () => {
    const element = new NostoTemplate()
    element.language = "handlebars"
    const script = document.createElement("script")
    script.type = "application/json"
    script.textContent = JSON.stringify({ name: "World" })
    element.appendChild(script)

    const template = document.createElement("template")
    template.innerHTML = "Hello, {{name}}!"
    element.appendChild(template)

    window.Handlebars = Handlebars
    await element.connectedCallback()
    expect(element.innerHTML).toContain("Hello, World!")
  })

  it("should render using Liquid", async () => {
    const element = new NostoTemplate()
    element.language = "liquid"
    const script = document.createElement("script")
    script.type = "application/json"
    script.textContent = JSON.stringify({ name: "World" })
    element.appendChild(script)

    const template = document.createElement("template")
    template.innerHTML = "Hello, {{name}}!"
    element.appendChild(template)

    window.Liquid = Liquid
    await element.connectedCallback()
    expect(element.innerHTML).toContain("Hello, World!")
  })
})
