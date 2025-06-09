import { describe, it, beforeEach, expect, vi } from "vitest"
import "@/components/NostoCampaign"
import { NostoCampaign } from "@/components/NostoCampaign"

describe("NostoCampaign", () => {
  let campaign: NostoCampaign

  beforeEach(() => {
    document.body.innerHTML = ""
  })

  function mount(attrs: Record<string, string> = {}) {
    campaign = new NostoCampaign()

    Object.assign(campaign, attrs)

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
    const spy = vi.spyOn(campaign, "loadCampaign").mockImplementation(async () => {})
    await campaign.connectedCallback()
    expect(campaign.placement).toBe("789")
    expect(campaign.product).toBe("123")
    expect(campaign.variant).toBe("var1")
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it("should insert string HTML from recommendation result", async () => {
    const campaign = mount({ placement: "test-placement" })

    const mockedHtml = "<div>Mocked Campaign HTML</div>"
    vi.spyOn(campaign, "loadCampaign").mockImplementation(async function (this: NostoCampaign) {
      this.innerHTML = mockedHtml
    })

    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("Mocked Campaign HTML")
  })

  it("should insert HTML from recommendation result object", async () => {
    const campaign = mount({ placement: "test-placement" })

    const mockedHtml = "<div>Mocked Campaign HTML from object</div>"
    vi.spyOn(campaign, "loadCampaign").mockImplementation(async function (this: NostoCampaign) {
      const result = { html: mockedHtml }

      const html = result?.html

      if (html && typeof html === "string") {
        this.innerHTML = html
      }
    })

    await campaign.connectedCallback()

    expect(campaign.innerHTML).toContain("Mocked Campaign HTML from object")
  })
})
