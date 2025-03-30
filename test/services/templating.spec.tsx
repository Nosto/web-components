import { describe, it, beforeEach, expect, vi } from "vitest"
import { evaluate } from "../../src/services/templating"
import * as Liquid from "liquidjs"
import * as Handlebars from "handlebars"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { createElement } from "../utils/jsx"

describe("evaluate", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    document.body.innerHTML = ""
    window.Liquid = Liquid
    window.Handlebars = Handlebars
  })

  it("should throw an error if the template element is not found", async () => {
    await expect(evaluate("non-existent-template", {})).rejects.toThrowError(
      'Template with id "non-existent-template" not found.'
    )
  })

  it("should throw an error if the template type is not supported", async () => {
    document.body.append(
      <template id="unsupported-template" type="text/unsupported">
        content
      </template>
    )
    await expect(evaluate("unsupported-template", {})).rejects.toThrowError(
      'Unsupported template type "text/unsupported".'
    )
  })

  it("should evaluate a liquid template", async () => {
    document.body.append(
      <template id="liquid-template" type="text/liquid">
        {"Hello {{ name }}!"}
      </template>
    )
    const result = await evaluate("liquid-template", { name: "World" })
    expect(result).toBe("Hello World!")
  })

  it("should evaluate a handlebars template", async () => {
    document.body.append(
      <template id="handlebars-template" type="text/handlebars">
        {"Hello {{ name }}!"}
      </template>
    )
    const result = await evaluate("handlebars-template", { name: "World" })
    expect(result).toBe("Hello World!")
  })
})
