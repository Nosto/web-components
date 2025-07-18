import { describe, beforeEach, it, expect, vi } from "vitest"
import { NostoControl } from "@/components/NostoControl/NostoControl"
import { mockNostojs } from "@nosto/nosto-js/testing"
import { createElement } from "../utils/jsx"

describe("NostoControl", () => {
  beforeEach(() => {
    document.body.innerHTML = ""
    vi.resetAllMocks()
    mockNostojs({
      getSearchSessionParams: () => Promise.resolve({ segments: ["test"] })
    })
  })

  it("should replace children with matching template content when a matching template exists", async () => {
    const control = new NostoControl()
    control.append(<template segment="test">test content</template>, <template segment="other">other content</template>)
    await control.connectedCallback()

    expect(control.innerHTML).toBe("test content")
  })

  it("should do nothing when no matching template is found", async () => {
    const control = new NostoControl()
    control.append(
      <template segment="non-existent">test content</template>,
      <template segment="other">other content</template>
    )
    const originalContent = control.innerHTML
    await control.connectedCallback()

    expect(control.innerHTML).toBe(originalContent)
  })
})
