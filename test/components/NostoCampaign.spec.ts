import { describe, it, beforeEach, expect, vi } from "vitest"
import "@/components/NostoCampaign"
import type { NostoCampaign } from "@/components/NostoCampaign"

describe("NostoCampaign", () => {
  let campaign: NostoCampaign

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  function mount(attrs: Record<string, string> = {}) {
    campaign = document.createElement("nosto-campaign") as NostoCampaign

    Object.entries(attrs).forEach(([k, v]) => campaign.setAttribute(k, v))

    document.body.appendChild(campaign)
    return campaign
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-campaign")).toBeDefined()
  })

  it("should log error if placement is missing", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {})
    campaign = mount()
    campaign.connectedCallback()
    expect(spy).toHaveBeenCalledWith('<nosto-campaign> requires a "placement" or "div-id" attribute.')
    spy.mockRestore()
  })

  it("should call loadCampaign() with placement, product, and variant", async () => {
    campaign = mount({
      placement: "789",
      product: "123",
      variant: "var1"
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    const spy = vi.spyOn(campaign, "loadCampaign").mockImplementation(async () => {})
    await campaign.connectedCallback()
    expect(campaign.placement).toBe("789")
    expect(campaign.product).toBe("123")
    expect(campaign.variant).toBe("var1")
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })
})
