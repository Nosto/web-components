/** @jsx createElement */
import { describe, it, expect, vi, beforeAll, afterEach, beforeEach } from "vitest"
import { QuickView } from "@/components/QuickView/QuickView"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../utils/jsx"
import { createShopifyUrl } from "@/utils"

describe("QuickView", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-quick-view")) {
      customElements.define("nosto-quick-view", QuickView)
    }
  })

  beforeEach(() => {
    // Reset body styles
    document.body.style.overflow = ""
  })

  afterEach(() => {
    vi.clearAllMocks()
    // Clean up any open modals
    document.querySelectorAll("nosto-quick-view").forEach(modal => modal.remove())
    document.body.style.overflow = ""
  })

  const mockProduct = {
    id: 123456789,
    title: "Test Product",
    handle: "test-product",
    description: "A test product description",
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    updated_at: "2023-01-01T00:00:00Z",
    vendor: "Test Vendor",
    product_type: "Test Type",
    tags: ["test", "product"],
    price: 2495, // $24.95 in cents
    price_min: 2495,
    price_max: 2995,
    available: true,
    price_varies: true,
    compare_at_price: null,
    compare_at_price_min: 0,
    compare_at_price_max: 0,
    compare_at_price_varies: false,
    variants: [
      {
        id: 987654321,
        title: "Default Title",
        option1: "Black",
        option2: "Small",
        option3: null,
        sku: "TEST-SKU-1",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        price: 2495,
        grams: 500,
        compare_at_price: null,
        position: 1,
        product_id: 123456789,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      },
      {
        id: 987654322,
        title: "White / Medium",
        option1: "White",
        option2: "Medium",
        option3: null,
        sku: "TEST-SKU-2",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        price: 2995,
        grams: 500,
        compare_at_price: 3495,
        position: 2,
        product_id: 123456789,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z"
      }
    ],
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    featured_image: "https://example.com/featured.jpg",
    options: [
      {
        name: "Color",
        position: 1,
        values: ["Black", "White"]
      },
      {
        name: "Size",
        position: 2,
        values: ["Small", "Medium"]
      }
    ],
    url: "/products/test-product"
  }

  function addProductHandlers(responses: Record<string, { product?: typeof mockProduct; status?: number }>) {
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ error: "Product not found" }, { status: 404 })
        }
        return HttpResponse.json(response.product || mockProduct, { status: response.status || 200 })
      })
    )
  }

  function addCartHandlers() {
    addHandlers(
      http.post("/cart/add.js", async ({ request }) => {
        const body = (await request.json()) as { id: number; quantity: number }
        return HttpResponse.json({
          id: body.id,
          quantity: body.quantity,
          variant_id: body.id,
          product_id: mockProduct.id,
          title: mockProduct.title
        })
      })
    )
  }

  it("creates component with required handle attribute", () => {
    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView

    expect(quickView.handle).toBe("test-product")
    expect(quickView.open).toBe(false)
  })

  it("throws error when handle attribute is missing", async () => {
    const quickView = (<nosto-quick-view />) as QuickView

    await expect(async () => await quickView.connectedCallback()).rejects.toThrow("Property handle is required.")
  })

  it("initializes modal structure on connection", () => {
    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    quickView.connectedCallback()

    expect(quickView.getAttribute("role")).toBe("dialog")
    expect(quickView.getAttribute("aria-modal")).toBe("true")
    expect(quickView.style.position).toBe("fixed")
    expect(quickView.style.display).toBe("none")

    const modal = quickView.querySelector(".quick-view-modal")
    expect(modal).toBeTruthy()

    const closeButton = quickView.querySelector(".quick-view-close")
    expect(closeButton).toBeTruthy()
    expect(closeButton?.getAttribute("aria-label")).toBe("Close quick view")
  })

  it("opens modal when open attribute is set", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" open={true} />) as QuickView
    document.body.appendChild(quickView)

    // First, check if the attribute is properly set
    expect(quickView.hasAttribute("open")).toBe(true)

    await quickView.connectedCallback()
    // Wait a bit for the async loading to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(quickView.style.display).toBe("flex")
    expect(document.body.style.overflow).toBe("hidden")

    // Check that product data was loaded and rendered
    const title = quickView.querySelector("#quick-view-title")
    expect(title?.textContent).toBe("Test Product")
  })

  it("loads and displays product data correctly", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()

    // Manually trigger modal opening
    quickView.openQuickView()
    await new Promise(resolve => setTimeout(resolve, 100)) // Wait for async load

    const title = quickView.querySelector("#quick-view-title")
    expect(title?.textContent).toBe("Test Product")

    const price = quickView.querySelector(".quick-view-price")
    expect(price?.textContent?.trim()).toBe("$24.95")

    const image = quickView.querySelector(".quick-view-image img") as HTMLImageElement
    expect(image?.src).toBe("https://example.com/featured.jpg")
  })

  it("displays compare at price when available", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()

    // Manually select variant with compare_at_price
    quickView.openQuickView()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Select White/Medium variant which has compare_at_price
    const whiteOption = quickView.querySelector('[data-option="Color"][data-value="White"]') as HTMLButtonElement
    if (whiteOption) {
      whiteOption.click()
    }

    const mediumOption = quickView.querySelector('[data-option="Size"][data-value="Medium"]') as HTMLButtonElement
    if (mediumOption) {
      mediumOption.click()
    }

    await new Promise(resolve => setTimeout(resolve, 50)) // Wait for re-render

    const price = quickView.querySelector(".quick-view-price")
    expect(price?.innerHTML).toContain("$29.95")
    expect(price?.innerHTML).toContain("$34.95") // Compare at price
  })

  it("renders swatch options correctly", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    const colorSwatches = quickView.querySelectorAll('[data-option="Color"][data-value]')
    expect(colorSwatches).toHaveLength(2) // Black and White options

    const sizeSwatches = quickView.querySelectorAll('[data-option="Size"][data-value]')
    expect(sizeSwatches).toHaveLength(2) // Small and Medium options

    // Check first option is selected by default
    const blackOption = quickView.querySelector('[data-option="Color"][data-value="Black"]') as HTMLButtonElement
    expect(blackOption?.style.backgroundColor).toBe("rgb(0, 0, 0)") // Selected state
  })

  it("updates selected variant when swatch is clicked", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    // Initially should show first variant price ($24.95)
    let price = quickView.querySelector(".quick-view-price")
    expect(price?.textContent?.trim()).toBe("$24.95")

    // Click White option
    const whiteOption = quickView.querySelector('[data-option="Color"][data-value="White"]') as HTMLButtonElement
    whiteOption?.click()

    // Click Medium option
    const mediumOption = quickView.querySelector('[data-option="Size"][data-value="Medium"]') as HTMLButtonElement
    mediumOption?.click()

    await new Promise(resolve => setTimeout(resolve, 50))

    // Should now show second variant price ($29.95)
    price = quickView.querySelector(".quick-view-price")
    expect(price?.textContent).toContain("$29.95")
  })

  it("handles add to cart functionality", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })
    addCartHandlers()

    // Mock fetch for cart API
    const fetchSpy = vi.spyOn(window, "fetch")

    const quickView = (
      <nosto-quick-view handle="test-product" product-id="nosto-123" reco-id="test-reco" />
    ) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    const addToCartBtn = quickView.querySelector(".add-to-cart-btn") as HTMLButtonElement
    expect(addToCartBtn?.textContent?.includes("Add to Cart")).toBe(true)

    addToCartBtn?.click()

    await new Promise(resolve => setTimeout(resolve, 50))

    // Should have called the cart API
    expect(fetchSpy).toHaveBeenCalledWith(
      "/cart/add.js",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: 987654321, // First variant ID
          quantity: 1
        })
      })
    )
  })

  it("handles quantity changes correctly", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    const quantityInput = quickView.querySelector(".quantity-input") as HTMLInputElement
    const increaseBtn = quickView.querySelector(".quantity-increase") as HTMLButtonElement
    const decreaseBtn = quickView.querySelector(".quantity-decrease") as HTMLButtonElement

    expect(quantityInput?.value).toBe("1")

    // Test increase
    increaseBtn?.click()
    expect(quantityInput?.value).toBe("2")

    increaseBtn?.click()
    expect(quantityInput?.value).toBe("3")

    // Test decrease
    decreaseBtn?.click()
    expect(quantityInput?.value).toBe("2")

    decreaseBtn?.click()
    expect(quantityInput?.value).toBe("1")

    // Should not go below 1
    decreaseBtn?.click()
    expect(quantityInput?.value).toBe("1")
  })

  it("closes modal when close button is clicked", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" open />) as QuickView
    document.body.appendChild(quickView)

    await quickView.connectedCallback()
    await new Promise(resolve => setTimeout(resolve, 50)) // Wait for modal to open
    expect(quickView.style.display).toBe("flex")

    const closeBtn = quickView.querySelector(".quick-view-close") as HTMLButtonElement
    closeBtn?.click()

    expect(quickView.style.display).toBe("none")
    expect(quickView.open).toBe(false)
    expect(document.body.style.overflow).toBe("")
  })

  it("closes modal when backdrop is clicked", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" open />) as QuickView
    document.body.appendChild(quickView)

    await quickView.connectedCallback()
    await new Promise(resolve => setTimeout(resolve, 50)) // Wait for modal to open
    expect(quickView.style.display).toBe("flex")

    // Click on the backdrop (the quickView element itself)
    quickView.click()

    expect(quickView.style.display).toBe("none")
    expect(quickView.open).toBe(false)
  })

  it("closes modal when Escape key is pressed", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" open />) as QuickView
    document.body.appendChild(quickView)

    await quickView.connectedCallback()
    await new Promise(resolve => setTimeout(resolve, 50)) // Wait for modal to open
    expect(quickView.style.display).toBe("flex")

    // Simulate Escape key press
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" })
    quickView.dispatchEvent(escapeEvent)

    expect(quickView.style.display).toBe("none")
    expect(quickView.open).toBe(false)
  })

  it("handles product loading errors gracefully", async () => {
    addProductHandlers({
      "test-product": { status: 404 }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    const errorElement = quickView.querySelector(".quick-view-error")
    expect(errorElement).toBeTruthy()
    expect(errorElement?.textContent).toContain("Error:")
  })

  it("shows sold out state for unavailable variants", async () => {
    const unavailableProduct = {
      ...mockProduct,
      available: false,
      variants: [
        {
          ...mockProduct.variants[0],
          available: false
        }
      ]
    }

    addProductHandlers({
      "sold-out-product": { product: unavailableProduct }
    })

    const quickView = (<nosto-quick-view handle="sold-out-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    const addToCartBtn = quickView.querySelector(".add-to-cart-btn") as HTMLButtonElement
    expect(addToCartBtn?.textContent?.includes("Sold Out")).toBe(true)
    expect(addToCartBtn?.disabled).toBe(true)

    const quantityControls = quickView.querySelectorAll(".quantity-decrease, .quantity-increase, .quantity-input")
    quantityControls.forEach(control => {
      expect((control as HTMLInputElement | HTMLButtonElement).disabled).toBe(true)
    })
  })

  it("emits custom events correctly", async () => {
    addProductHandlers({
      "test-product": { product: mockProduct }
    })

    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)

    let openEventFired = false
    let loadedEventFired = false
    let closeEventFired = false

    quickView.addEventListener("@nosto/QuickView/open", () => {
      openEventFired = true
    })

    quickView.addEventListener("@nosto/QuickView/loaded", () => {
      loadedEventFired = true
    })

    quickView.addEventListener("@nosto/QuickView/close", () => {
      closeEventFired = true
    })

    quickView.connectedCallback()
    quickView.openQuickView()

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(openEventFired).toBe(true)
    expect(loadedEventFired).toBe(true)

    quickView.closeQuickView()
    expect(closeEventFired).toBe(true)
  })

  it("handles programmatic open and close methods", () => {
    const quickView = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(quickView)
    quickView.connectedCallback()

    expect(quickView.open).toBe(false)

    quickView.openQuickView()
    expect(quickView.open).toBe(true)

    quickView.closeQuickView()
    expect(quickView.open).toBe(false)
  })
})
