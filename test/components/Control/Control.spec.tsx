import { describe, beforeEach, it, expect } from "vitest"
import { Control } from "@/components/Control/Control"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { createElement } from "../../utils/jsx"

describe("Control", () => {
  beforeEach(() => {
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["test"])
      }
    })
  })

  it("should replace children with matching template content when a matching template exists", async () => {
    const control = (
      <nosto-control>
        <template segment="test">test content</template>
        <template segment="other">other content</template>
      </nosto-control>
    ) as Control
    await control.connectedCallback()

    expect(control.innerHTML).toBe("test content")
  })

  it("should do nothing when no matching template is found", async () => {
    const control = (
      <nosto-control>
        <template segment="non-existent">test content</template>
        <template segment="other">other content</template>
      </nosto-control>
    ) as Control
    const originalContent = control.innerHTML
    await control.connectedCallback()

    expect(control.innerHTML).toBe(originalContent)
  })

  it("should only select direct template children with segment attribute, not nested ones", async () => {
    const control = (
      <nosto-control>
        <template segment="test">direct template content</template>
      </nosto-control>
    ) as Control

    // Add a nested template inside a div (should be ignored)
    const wrapper = document.createElement("div")
    const nestedTemplate = document.createElement("template")
    nestedTemplate.setAttribute("segment", "test")
    nestedTemplate.innerHTML = "nested content that should be ignored"
    wrapper.appendChild(nestedTemplate)
    control.appendChild(wrapper)

    await control.connectedCallback()

    // Should use the direct template, not the nested one
    expect(control.innerHTML).toBe("direct template content")
  })
})
