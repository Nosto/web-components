import { describe, it, beforeEach, expect, vi } from "vitest"
import { evaluate } from "../../src/services/templating"
import { createElement } from "../utils/jsx"

describe("evaluate", () => {
  beforeEach(() => {
    vi.resetAllMocks()
    document.body.innerHTML = ""
  })

  it("should throw an error if the template element is not found", async () => {
    await expect(evaluate("non-existent-template", {})).rejects.toThrowError(
      'Template with id "non-existent-template" not found.'
    )
  })

  it("should throw an error if the template type is not supported", async () => {
    document.body.append(
      <script id="unsupported-template" type="text/unsupported">
        content
      </script>
    )
    await expect(evaluate("unsupported-template", {})).rejects.toThrowError(
      'Unsupported template type "text/unsupported".'
    )
  })

  it("should evaluate a liquid template", async () => {
    document.body.append(
      <script id="liquid-template" type="text/x-liquid-template">
        {"Hello {{ name }}!"}
      </script>
    )
    const result = await evaluate("liquid-template", { name: "World" })
    expect(result).toBe("Hello World!")
  })

  it("should evaluate a handlebars template", async () => {
    document.body.append(
      <script id="handlebars-template" type="text/x-handlebars-template">
        {"Hello {{ name }}!"}
      </script>
    )
    const result = await evaluate("handlebars-template", { name: "World" })
    expect(result).toBe("Hello World!")
  })
})
