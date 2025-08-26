import { describe, beforeEach, it, expect } from "vitest"
import { NostoControl } from "@/components/NostoControl/NostoControl"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { createElement } from "../utils/jsx"

describe("NostoControl", () => {
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
    ) as NostoControl
    await control.connectedCallback()

    expect(control.innerHTML).toBe("test content")
  })

  it("should do nothing when no matching template is found", async () => {
    const control = (
      <nosto-control>
        <template segment="non-existent">test content</template>
        <template segment="other">other content</template>
      </nosto-control>
    ) as NostoControl
    const originalContent = control.innerHTML
    await control.connectedCallback()

    expect(control.innerHTML).toBe(originalContent)
  })
})
