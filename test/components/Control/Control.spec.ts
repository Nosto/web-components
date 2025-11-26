import { describe, beforeEach, it, expect } from "vitest"
import { Control } from "@/components/Control/Control"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { html } from "lit-html"
import { createElement } from "../../utils/createElement"

describe("Control", () => {
  beforeEach(() => {
    mockNostojs({
      internal: {
        getSegments: () => Promise.resolve(["test"])
      }
    })
  })

  it("should replace children with matching template content when a matching template exists", async () => {
    const control = createElement<Control>(html`
      <nosto-control>
        <template segment="test">test content</template>
        <template segment="other">other content</template>
      </nosto-control>
    `)
    await control.connectedCallback()

    expect(control.innerHTML).toBe("test content")
  })

  it("should do nothing when no matching template is found", async () => {
    const control = createElement<Control>(html`
      <nosto-control>
        <template segment="non-existent">test content</template>
        <template segment="other">other content</template>
      </nosto-control>
    `)
    const originalContent = control.innerHTML
    await control.connectedCallback()

    expect(control.innerHTML).toBe(originalContent)
  })
})
