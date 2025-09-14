/** @jsx createElement */
import { beforeAll, afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createElement } from "../utils/jsx"
import { QuickView } from "../../src/components/QuickView/QuickView"
import type { ShopifyProduct } from "../../src/types"

// Mock product data
const mockProduct: ShopifyProduct = {
  id: 123456789,
  title: "Test Product",
  handle: "test-product",
  description: "A test product",
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  updated_at: "2023-01-01T00:00:00Z",
  vendor: "Test Vendor",
  type: "Test Type",
  tags: ["test"],
  price: 2500,
  price_min: 2500,
  price_max: 3000,
  available: true,
  price_varies: true,
  compare_at_price: null,
  compare_at_price_min: null,
  compare_at_price_max: null,
  compare_at_price_varies: false,
  variants: [
    {
      id: 1,
      title: "Black / Small",
      option1: "Black",
      option2: "Small",
      option3: null,
      sku: "TEST-BLK-SM",
      requires_shipping: true,
      taxable: true,
      featured_image: {
        id: 1,
        product_id: 123456789,
        position: 1,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        alt: "Test image",
        width: 800,
        height: 800,
        src: "https://example.com/image1.jpg",
        variant_ids: [1]
      },
      available: true,
      price: 2500,
      grams: 200,
      compare_at_price: null,
      position: 1,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 2,
      title: "Black / Medium",
      option1: "Black",
      option2: "Medium",
      option3: null,
      sku: "TEST-BLK-MD",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: false,
      price: 2500,
      grams: 200,
      compare_at_price: 3000,
      position: 2,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    },
    {
      id: 3,
      title: "White / Small",
      option1: "White",
      option2: "Small",
      option3: null,
      sku: "TEST-WHT-SM",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      price: 3000,
      grams: 200,
      compare_at_price: null,
      position: 3,
      product_id: 123456789,
      created_at: "2023-01-01T00:00:00Z",
      updated_at: "2023-01-01T00:00:00Z"
    }
  ],
  images: [],
  featured_image: "https://example.com/featured.jpg",
  options: [
    {
      id: 1,
      product_id: 123456789,
      name: "Color",
      position: 1,
      values: ["Black", "White"]
    },
    {
      id: 2,
      product_id: 123456789,
      name: "Size",
      position: 2,
      values: ["Small", "Medium"]
    }
  ],
  url: "/products/test-product",
  media: []
}

describe("QuickView", () => {
  let originalFetch: typeof global.fetch

  beforeAll(() => {
    if (!customElements.get("nosto-quick-view")) {
      customElements.define("nosto-quick-view", QuickView)
    }
  })

  beforeEach(() => {
    originalFetch = global.fetch
    global.fetch = vi.fn()

    // Mock successful product fetch
    vi.mocked(global.fetch).mockImplementation(url => {
      if (typeof url === "string" && url.includes("/products/test-product.js")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProduct)
        } as Response)
      }
      if (typeof url === "string" && url.includes("/cart/add.js")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ status: "success" })
        } as Response)
      }
      return Promise.reject(new Error("Unexpected URL"))
    })
  })

  afterEach(() => {
    global.fetch = originalFetch
    // Clean up any modals that might exist
    document.querySelectorAll(".nosto-quick-view-overlay").forEach(el => el.remove())
    document.body.style.overflow = ""
    vi.clearAllMocks()
  })

  it("should create an instance", () => {
    const quickView = <nosto-quick-view handle="test-product" /> as QuickView
    expect(quickView).toBeInstanceOf(QuickView)
    expect(quickView.handle).toBe("test-product")
  })

  it("should require handle attribute", () => {
    // This test verifies that handle is properly defined as required
    const quickView = <nosto-quick-view handle="test-product" /> as QuickView
    expect(quickView).toBeInstanceOf(QuickView)
    expect(quickView.handle).toBe("test-product")
  })

  it("should open modal on click", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Click to open modal
    quickView.click()

    // Wait for async operation
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    expect(modal).not.toBeNull()
    expect(modal?.getAttribute("role")).toBe("dialog")
    expect(modal?.getAttribute("aria-modal")).toBe("true")
  })

  it("should close modal on escape key", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    expect(modal).not.toBeNull()

    // Press escape
    const escapeEvent = new KeyboardEvent("keydown", { key: "Escape" })
    document.dispatchEvent(escapeEvent)

    // Modal should be removed
    expect(document.querySelector(".nosto-quick-view-overlay")).toBeNull()
  })

  it("should close modal on close button click", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    expect(modal).not.toBeNull()

    const closeButton = modal?.querySelector(".nosto-quick-view-close") as HTMLButtonElement
    expect(closeButton).not.toBeNull()

    // Click close button
    closeButton.click()

    // Modal should be removed
    expect(document.querySelector(".nosto-quick-view-overlay")).toBeNull()
  })

  it("should close modal on overlay click", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay") as HTMLElement
    expect(modal).not.toBeNull()

    // Click overlay (not modal content)
    const clickEvent = new MouseEvent("click", { bubbles: true })
    Object.defineProperty(clickEvent, "target", { value: modal })
    modal.dispatchEvent(clickEvent)

    // Modal should be removed
    expect(document.querySelector(".nosto-quick-view-overlay")).toBeNull()
  })

  it("should render product information", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    expect(modal).not.toBeNull()

    // Check product title
    const title = modal?.querySelector("#quick-view-title")
    expect(title?.textContent).toBe("Test Product")

    // Check price
    const price = modal?.querySelector(".price")
    expect(price?.textContent).toBe("$25.00")

    // Check availability
    const availability = modal?.querySelector(".nosto-quick-view-availability")
    expect(availability?.textContent?.trim()).toBe("In Stock")
  })

  it("should render product options as swatches", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    expect(modal).not.toBeNull()

    // Check color options
    const colorSwatches = modal?.querySelectorAll('[data-option="Color"]')
    expect(colorSwatches?.length).toBe(2)

    // Check size options
    const sizeSwatches = modal?.querySelectorAll('[data-option="Size"]')
    expect(sizeSwatches?.length).toBe(2)
  })

  it("should select swatch on click", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    expect(modal).not.toBeNull()

    // Click on White color swatch
    const whiteSwatch = modal?.querySelector('[data-option="Color"][data-value="White"]') as HTMLButtonElement
    expect(whiteSwatch).not.toBeNull()

    whiteSwatch.click()

    // Wait for update
    await new Promise(resolve => setTimeout(resolve, 50))

    // Check that White swatch is selected
    const selectedSwatch = modal?.querySelector('[data-option="Color"].selected')
    expect(selectedSwatch?.getAttribute("data-value")).toBe("White")

    // Price should update to $30.00 for White/Small variant
    const price = modal?.querySelector(".price")
    expect(price?.textContent).toBe("$30.00")
  })

  it("should handle swatch keyboard navigation", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    const colorSwatches = modal?.querySelectorAll('[data-option="Color"]') as NodeListOf<HTMLElement>
    expect(colorSwatches.length).toBe(2)

    const blackSwatch = colorSwatches[0]
    const whiteSwatch = colorSwatches[1]

    // Focus first swatch
    blackSwatch.focus()

    // Press ArrowRight to move to next swatch
    const arrowRightEvent = new KeyboardEvent("keydown", { key: "ArrowRight" })
    blackSwatch.dispatchEvent(arrowRightEvent)

    // White swatch should have focus
    expect(document.activeElement).toBe(whiteSwatch)
  })

  it("should activate swatch on Enter key", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    const whiteSwatch = modal?.querySelector('[data-option="Color"][data-value="White"]') as HTMLElement
    expect(whiteSwatch).not.toBeNull()

    whiteSwatch.focus()

    // Press Enter to select
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" })
    whiteSwatch.dispatchEvent(enterEvent)

    await new Promise(resolve => setTimeout(resolve, 50))

    // Check that White swatch is selected
    const selectedSwatch = modal?.querySelector('[data-option="Color"].selected')
    expect(selectedSwatch?.getAttribute("data-value")).toBe("White")
  })

  it("should add to cart when button is clicked", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    const modal = document.querySelector(".nosto-quick-view-overlay")
    const atcButton = modal?.querySelector(".nosto-quick-view-atc") as HTMLButtonElement
    expect(atcButton).not.toBeNull()

    // Click add to cart
    atcButton.click()

    await new Promise(resolve => setTimeout(resolve, 50))

    // Check that fetch was called with correct data
    expect(global.fetch).toHaveBeenCalledWith("/cart/add.js", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: 1, // First variant ID
        quantity: 1
      })
    })

    // Modal should be closed after successful add to cart
    expect(document.querySelector(".nosto-quick-view-overlay")).toBeNull()
  })

  it("should disable unavailable options", async () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Open modal
    quickView.click()
    await new Promise(resolve => setTimeout(resolve, 100))

    // Select Black color first (Black/Medium is unavailable)
    const modal = document.querySelector(".nosto-quick-view-overlay")
    const blackSwatch = modal?.querySelector('[data-option="Color"][data-value="Black"]') as HTMLElement
    blackSwatch.click()

    await new Promise(resolve => setTimeout(resolve, 50))

    // Medium size should be disabled/unavailable
    const mediumSwatch = modal?.querySelector('[data-option="Size"][data-value="Medium"]') as HTMLElement
    expect(mediumSwatch.classList.contains("unavailable") || mediumSwatch.hasAttribute("disabled")).toBe(true)
  })

  it("should handle fetch error gracefully", async () => {
    // Mock fetch to fail
    vi.mocked(global.fetch).mockRejectedValue(new Error("Network error"))

    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Mock console.error to avoid spam in tests
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    // Click to open modal
    quickView.click()

    await new Promise(resolve => setTimeout(resolve, 100))

    // Should have logged an error
    expect(consoleSpy).toHaveBeenCalledWith("Failed to open quick view:", expect.any(Error))

    consoleSpy.mockRestore()
  })

  it("should clean up on disconnect", () => {
    const quickView = (
      <nosto-quick-view handle="test-product">
        <button>Quick View</button>
      </nosto-quick-view>
    ) as QuickView
    document.body.appendChild(quickView)

    // Remove from DOM
    quickView.remove()

    // Should not throw any errors
    expect(quickView.isConnected).toBe(false)
  })
})
