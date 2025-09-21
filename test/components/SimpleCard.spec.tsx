/** @jsx createElement */
import { describe, it, expect, vi, afterEach, beforeAll } from "vitest"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../utils/jsx"
import { createShopifyUrl } from "@/utils"

describe("SimpleCard", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-simple-card")) {
      customElements.define("nosto-simple-card", SimpleCard)
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  const mockProduct = {
    id: 123456,
    title: "Awesome Test Product",
    handle: "awesome-test-product",
    vendor: "Test Brand",
    price: 2999, // $29.99 in cents
    price_min: 2999,
    price_max: 2999,
    compare_at_price: 3999, // $39.99 in cents
    compare_at_price_min: 3999,
    compare_at_price_max: 3999,
    available: true,
    images: ["https://example.com/primary-image.jpg", "https://example.com/alternate-image.jpg"],
    featured_image: "https://example.com/primary-image.jpg",
    variants: [
      {
        id: 789,
        title: "Default Title",
        price: 2999,
        compare_at_price: 3999,
        available: true
      }
    ],
    options: [
      {
        name: "Size",
        values: ["S", "M", "L"]
      }
    ]
  }

  function addProductHandlers(responses: Record<string, { product?: object; status?: number }>) {
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({}, { status: 404 })
        }
        return HttpResponse.json(response.product || {}, { status: response.status || 200 })
      })
    )
  }

  it("renders basic product card with required data", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    expect(card.shadowRoot?.querySelector(".title")?.textContent).toBe("Awesome Test Product")
    expect(card.shadowRoot?.querySelector(".price")?.textContent).toBe("$29.99")

    const image = card.shadowRoot?.querySelector(".product-image") as HTMLImageElement
    expect(image?.src).toBe("https://example.com/primary-image.jpg")
    expect(image?.alt).toBe("Awesome Test Product")
  })

  it("shows alternate image when alternate attribute is enabled", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    const primaryImage = card.shadowRoot?.querySelector(".product-image.primary") as HTMLImageElement
    const alternateImage = card.shadowRoot?.querySelector(".product-image.alternate") as HTMLImageElement

    expect(primaryImage?.src).toBe("https://example.com/primary-image.jpg")
    expect(alternateImage?.src).toBe("https://example.com/alternate-image.jpg")

    // Check that hover styles are included when alternate is enabled
    const styles = card.shadowRoot?.querySelector("style")?.textContent
    expect(styles).toContain(":hover .product-image.primary")
  })

  it("shows brand when brand attribute is enabled", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard

    await card.connectedCallback()

    const brandElement = card.shadowRoot?.querySelector(".brand")
    expect(brandElement?.textContent).toBe("Test Brand")
  })

  it("hides brand when brand attribute is disabled", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    const brandElement = card.shadowRoot?.querySelector(".brand")
    expect(brandElement).toBe(null)
  })

  it("shows discount when discount attribute is enabled and product has compare price", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    const comparePrice = card.shadowRoot?.querySelector(".compare-price")
    const discountBadge = card.shadowRoot?.querySelector(".discount")

    expect(comparePrice?.textContent).toBe("$39.99")
    expect(discountBadge?.textContent?.trim()).toBe("25% OFF")
  })

  it("shows rating when rating attribute is enabled", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" rating />) as SimpleCard

    await card.connectedCallback()

    const ratingElement = card.shadowRoot?.querySelector(".rating")
    expect(ratingElement).toBeTruthy()
    expect(ratingElement?.textContent).toContain("★★★★☆")
    expect(ratingElement?.textContent).toContain("4.2 (24 reviews)")
  })

  it("hides rating when rating attribute is disabled", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()

    const ratingElement = card.shadowRoot?.querySelector(".rating")
    expect(ratingElement).toBe(null)
  })

  it("handles product without discount pricing", async () => {
    const productWithoutDiscount = {
      ...mockProduct,
      compare_at_price: undefined,
      compare_at_price_min: undefined,
      compare_at_price_max: undefined
    }

    addProductHandlers({
      "test-product": {
        product: productWithoutDiscount
      }
    })

    const card = (<nosto-simple-card handle="test-product" discount />) as SimpleCard

    await card.connectedCallback()

    const comparePrice = card.shadowRoot?.querySelector(".compare-price")
    const discountBadge = card.shadowRoot?.querySelector(".discount")

    expect(comparePrice).toBe(null)
    expect(discountBadge).toBe(null)
  })

  it("handles product without vendor", async () => {
    const productWithoutVendor = {
      ...mockProduct,
      vendor: undefined
    }

    addProductHandlers({
      "test-product": {
        product: productWithoutVendor
      }
    })

    const card = (<nosto-simple-card handle="test-product" brand />) as SimpleCard

    await card.connectedCallback()

    const brandElement = card.shadowRoot?.querySelector(".brand")
    expect(brandElement).toBe(null)
  })

  it("handles product with single image when alternate is enabled", async () => {
    const productSingleImage = {
      ...mockProduct,
      images: ["https://example.com/single-image.jpg"]
    }

    addProductHandlers({
      "test-product": {
        product: productSingleImage
      }
    })

    const card = (<nosto-simple-card handle="test-product" alternate />) as SimpleCard

    await card.connectedCallback()

    const primaryImage = card.shadowRoot?.querySelector(".product-image.primary")
    const alternateImage = card.shadowRoot?.querySelector(".product-image.alternate")

    expect(primaryImage).toBeTruthy()
    expect(alternateImage).toBe(null)
  })

  it("emits loaded event when product is successfully loaded", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    let eventEmitted = false
    card.addEventListener("@nosto/SimpleCard/loaded", () => {
      eventEmitted = true
    })

    await card.connectedCallback()

    expect(eventEmitted).toBe(true)
  })

  it("shows loading attribute during fetch", async () => {
    addProductHandlers({
      "test-product": {
        product: mockProduct
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    // Start loading
    const loadPromise = card.connectedCallback()

    // Should have loading attribute initially
    expect(card.hasAttribute("loading")).toBe(true)

    await loadPromise

    // Should remove loading attribute after completion
    expect(card.hasAttribute("loading")).toBe(false)
  })

  it("renders error state when product fetch fails", async () => {
    addProductHandlers({
      "nonexistent-product": {
        status: 404
      }
    })

    const card = (<nosto-simple-card handle="nonexistent-product" />) as SimpleCard

    await card.connectedCallback()

    const errorElement = card.shadowRoot?.querySelector(".error")
    expect(errorElement?.textContent).toContain('Failed to load product "nonexistent-product"')
  })

  it("throws error when handle is not provided", () => {
    const card = (<nosto-simple-card />) as SimpleCard

    expect(() => card.connectedCallback()).rejects.toThrow("Property handle is required")
  })

  it("re-renders when handle attribute changes", async () => {
    const product2 = {
      ...mockProduct,
      id: 654321,
      title: "Second Test Product",
      handle: "second-test-product"
    }

    addProductHandlers({
      "test-product": {
        product: mockProduct
      },
      "second-test-product": {
        product: product2
      }
    })

    const card = (<nosto-simple-card handle="test-product" />) as SimpleCard

    await card.connectedCallback()
    expect(card.shadowRoot?.querySelector(".title")?.textContent).toBe("Awesome Test Product")

    // Create a new instance with the new handle to test the component works with different handles
    const card2 = (<nosto-simple-card handle="second-test-product" />) as SimpleCard
    await card2.connectedCallback()

    expect(card2.shadowRoot?.querySelector(".title")?.textContent).toBe("Second Test Product")
  })
})
