import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NostoQuickBuy } from "../../src/components/NostoQuickBuy"

describe("NostoQuickBuy", () => {
  let originalFetch: typeof fetch

  beforeEach(() => {
    originalFetch = global.fetch
  })

  afterEach(() => {
    global.fetch = originalFetch
    vi.restoreAllMocks()
    document.body.innerHTML = ""
  })

  it("renders direct quick buy buttons when a single filtered option exists", async () => {
    // Test data with one filtered option (values.length > 1)
    const testData = {
      options: [{ name: "Size", position: 1, values: ["S", "M"] }],
      variants: [
        { id: "skuS", option1: "S", option2: "", option3: "" },
        { id: "skuM", option1: "M", option2: "", option3: "" }
      ]
    }

    // Mock fetch to return testData
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => testData
    } as Response)

    // Create the element and set required attribute
    const element = new NostoQuickBuy()
    element.handle = "test-product"
    document.body.appendChild(element)

    await element.connectedCallback()

    // The expected innerHTML is buttons for each value in direct quick buy.
    const expectedHTML = `<button n-sku-id="skuS">S</button>` + `<button n-sku-id="skuM">M</button>`
    expect(element.innerHTML).toBe(expectedHTML)
  })

  it("renders faceted quick buy options and ATC button when multiple filtered options exist", async () => {
    // Test data with two filtered options (each option has values.length > 1)
    const testData = {
      options: [
        { name: "Color", position: 1, values: ["Red", "Blue"] },
        { name: "Size", position: 2, values: ["Small", "Large"] }
      ],
      variants: [
        { id: "sku1", option1: "Red", option2: "Small", option3: "" },
        { id: "sku2", option1: "Red", option2: "Large", option3: "" },
        { id: "sku3", option1: "Blue", option2: "Small", option3: "" },
        { id: "sku4", option1: "Blue", option2: "Large", option3: "" }
      ]
    }

    // Mock fetch to return testData
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => testData
    } as Response)

    // Create the element and set required attribute
    const element = new NostoQuickBuy()
    element.handle = "test-product"
    document.body.appendChild(element)

    await element.connectedCallback()

    // Since faceted quick buy renders two <nosto-sku-options> components and one Add To Cart button,
    // we expect the innerHTML to contain both option groups and the ATC button.
    expect(element.innerHTML).toBe(`<nosto-sku-options name="Color">
        <h3>Color</h3>
        <span n-option="" n-skus="sku1,sku2">Red</span>
        <span n-option="" n-skus="sku3,sku4">Blue</span>
      </nosto-sku-options>
      <nosto-sku-options name="Size">
        <h3>Size</h3>
        <span n-option="" n-skus="sku1,sku3">Small</span>
        <span n-option="" n-skus="sku2,sku4">Large</span>
      </nosto-sku-options>
      <button n-atc="">Add to Cart</button>`.replace(/>\s+</g, "><"))
  })

  it.skip("throws an error if fetch response is not ok", async () => {
    // Mock fetch to return a failed response
    global.fetch = vi.fn().mockResolvedValue({
      ok: false
    } as Response)

    const element = new NostoQuickBuy()
    element.setAttribute("handle", "test-product")
    document.body.appendChild(element)

    await expect(element.connectedCallback()).rejects.toThrow("Failed to fetch product data")
  })

  it.skip("throws if required attribute 'handle' is missing", async () => {
    // We don't need to call fetch if attribute validation fails.
    const element = new NostoQuickBuy()
    document.body.appendChild(element)

    // Since assertRequired should throw, we wrap in expect.
    await expect(element.connectedCallback()).rejects.toThrow()
  })
})
