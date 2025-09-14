/** @jsx createElement */
import { describe, it, expect, beforeEach, afterEach, beforeAll, vi } from "vitest"
import { QuickView } from "@/components/QuickView/QuickView"
import { Product } from "@/components/Product/Product"
import { SkuOptions } from "@/components/SkuOptions/SkuOptions"
import { createElement } from "../utils/jsx"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"

// Mock product data
const mockProductData = {
  id: 123456789,
  title: "Test Product",
  handle: "test-product",
  description: "A test product",
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  vendor: "Test Vendor",
  type: "Test Type",
  tags: ["test"],
  price: 2500, // $25.00
  price_min: 2500,
  price_max: 3000,
  available: true,
  price_varies: true,
  compare_at_price: null,
  compare_at_price_min: 0,
  compare_at_price_max: 0,
  compare_at_price_varies: false,
  variants: [
    {
      id: 987654321,
      title: "Red / Small",
      option1: "Red",
      option2: "Small",
      option3: null,
      sku: "TEST-RED-S",
      requires_shipping: true,
      taxable: true,
      featured_image: {
        id: 1,
        product_id: 123456789,
        position: 1,
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        alt: "Red variant",
        width: 800,
        height: 800,
        src: "https://example.com/red-small.jpg",
        variant_ids: [987654321]
      },
      available: true,
      name: "Red / Small",
      public_title: "Red / Small",
      options: ["Red", "Small"],
      price: 2500,
      weight: 500,
      compare_at_price: 3000,
      inventory_management: "shopify",
      barcode: "123456789012",
      featured_media: null
    },
    {
      id: 987654322,
      title: "Blue / Large",
      option1: "Blue",
      option2: "Large",
      option3: null,
      sku: "TEST-BLUE-L",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: false,
      name: "Blue / Large",
      public_title: "Blue / Large",
      options: ["Blue", "Large"],
      price: 3000,
      weight: 600,
      compare_at_price: null,
      inventory_management: "shopify",
      barcode: "123456789013",
      featured_media: null
    }
  ],
  images: ["https://example.com/product.jpg"],
  featured_image: "https://example.com/product.jpg",
  options: [
    {
      name: "Color",
      position: 1,
      values: ["Red", "Blue"]
    },
    {
      name: "Size",
      position: 2,
      values: ["Small", "Large"]
    }
  ],
  url: "/products/test-product",
  media: []
}

describe("QuickView", () => {
  let element: QuickView

  beforeAll(() => {
    if (!customElements.get("nosto-quick-view")) {
      customElements.define("nosto-quick-view", QuickView)
    }
    if (!customElements.get("nosto-product")) {
      customElements.define("nosto-product", Product)
    }
    if (!customElements.get("nosto-sku-options")) {
      customElements.define("nosto-sku-options", SkuOptions)
    }
  })

  beforeEach(() => {
    // Setup successful product fetch
    addHandlers(
      http.get("*/products/test-product.js", () => {
        return HttpResponse.json(mockProductData)
      })
    )

    // Mock window.Nosto for addSkuToCart
    window.Nosto = { addSkuToCart: vi.fn(() => Promise.resolve()) }

    // Mock Shopify routes
    window.Shopify = { routes: { root: "/" } }

    element = (<nosto-quick-view handle="test-product" />) as QuickView
    document.body.appendChild(element)
  })

  afterEach(() => {
    document.body.innerHTML = ""
    vi.clearAllMocks()
  })

  describe("Component setup", () => {
    it("should be defined as a custom element", () => {
      expect(customElements.get("nosto-quick-view")).toBe(QuickView)
    })

    it("should require handle attribute", () => {
      const elementWithoutHandle = new QuickView()
      expect(() => elementWithoutHandle.connectedCallback()).toThrow("Property handle is required.")
    })

    it("should have handle attribute", () => {
      expect(element.handle).toBe("test-product")
    })
  })

  describe("Modal functionality", () => {
    it("should open modal on click", async () => {
      expect(document.querySelector(".nosto-quick-view-backdrop")).toBeNull()

      element.click()

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(document.querySelector(".nosto-quick-view-backdrop")).not.toBeNull()
      expect(document.querySelector(".nosto-quick-view-modal")).not.toBeNull()
    })

    it("should close modal when close button is clicked", async () => {
      element.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      const closeBtn = document.querySelector(".nosto-quick-view-close") as HTMLButtonElement
      expect(closeBtn).not.toBeNull()

      closeBtn.click()

      await new Promise(resolve => setTimeout(resolve, 300))

      expect(document.querySelector(".nosto-quick-view-backdrop")).toBeNull()
    })

    it("should close modal when backdrop is clicked", async () => {
      element.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      const backdrop = document.querySelector(".nosto-quick-view-backdrop") as HTMLElement
      expect(backdrop).not.toBeNull()

      backdrop.click()

      await new Promise(resolve => setTimeout(resolve, 300))

      expect(document.querySelector(".nosto-quick-view-backdrop")).toBeNull()
    })

    it("should close modal when Escape key is pressed", async () => {
      element.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(document.querySelector(".nosto-quick-view-backdrop")).not.toBeNull()

      // Simulate Escape key
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))

      await new Promise(resolve => setTimeout(resolve, 300))

      expect(document.querySelector(".nosto-quick-view-backdrop")).toBeNull()
    })
  })

  describe("Product data rendering", () => {
    beforeEach(async () => {
      element.click()
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    afterEach(async () => {
      // Clean up modal
      const closeBtn = document.querySelector(".nosto-quick-view-close") as HTMLButtonElement
      if (closeBtn) {
        closeBtn.click()
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    })

    it("should render product title", () => {
      const title = document.querySelector("#quick-view-title")
      expect(title?.textContent).toBe("Test Product")
    })

    it("should render product image", () => {
      const image = document.querySelector("img[n-img]") as HTMLImageElement
      expect(image).not.toBeNull()
      expect(image.src).toBe("https://example.com/product.jpg")
      expect(image.alt).toBe("Test Product")
    })

    it("should render product price", () => {
      const price = document.querySelector("[n-price]")
      expect(price?.textContent?.trim()).toBe("$25.00")
    })

    it("should render compare at price when available", () => {
      const listPrice = document.querySelector("[n-list-price]")
      expect(listPrice?.textContent?.trim()).toBe("$30.00")
    })

    it("should render nosto-product with correct attributes", () => {
      const nostoProduct = document.querySelector("nosto-product")
      expect(nostoProduct).not.toBeNull()
      expect(nostoProduct?.getAttribute("product-id")).toBe("123456789")
      expect(nostoProduct?.getAttribute("reco-id")).toBe("quickview")
    })

    it("should render add to cart button", () => {
      const addToCartBtn = document.querySelector("[n-atc]")
      expect(addToCartBtn).not.toBeNull()
      expect(addToCartBtn?.textContent?.trim()).toBe("Add to Cart")
    })
  })

  describe("Variant selection", () => {
    beforeEach(async () => {
      element.click()
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    afterEach(async () => {
      // Clean up modal
      const closeBtn = document.querySelector(".nosto-quick-view-close") as HTMLButtonElement
      if (closeBtn) {
        closeBtn.click()
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    })

    it("should render sku options for each product option", () => {
      const colorOptions = document.querySelector('nosto-sku-options[name="color"]')
      const sizeOptions = document.querySelector('nosto-sku-options[name="size"]')

      expect(colorOptions).not.toBeNull()
      expect(sizeOptions).not.toBeNull()
    })

    it("should render option values as clickable elements", () => {
      const redOption = document.querySelector('[n-option][n-skus*="987654321"]')
      const blueOption = document.querySelector('[n-option][n-skus-oos*="987654322"]')

      expect(redOption).not.toBeNull()
      expect(redOption?.textContent?.trim()).toBe("Red")

      expect(blueOption).not.toBeNull()
      expect(blueOption?.textContent?.trim()).toBe("Blue")
    })

    it("should mark unavailable variants correctly", () => {
      const blueOption = document.querySelector('[n-option][n-skus-oos*="987654322"]')
      expect(blueOption).not.toBeNull()
      // Blue variant should be marked as out of stock since available = false
    })

    it("should include SKU data script", () => {
      const skuScript = document.querySelector("script[n-sku-data]")
      expect(skuScript).not.toBeNull()

      const skuData = JSON.parse(skuScript!.textContent!)
      expect(Array.isArray(skuData)).toBe(true)
      expect(skuData).toHaveLength(2)
      expect(skuData[0]).toMatchObject({
        id: "987654321",
        price: "$25.00"
      })
    })
  })

  describe("Error handling", () => {
    it("should show error message on fetch failure", async () => {
      addHandlers(
        http.get("*/products/test-product.js", () => {
          return HttpResponse.json({ error: "Server error" }, { status: 500 })
        })
      )

      element.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      // Should show error notification
      const errorDiv = document.querySelector('div[style*="position: fixed"]')
      expect(errorDiv?.textContent).toContain("Error:")
    })
  })

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", async () => {
      element.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      const modal = document.querySelector(".nosto-quick-view-modal")
      expect(modal?.getAttribute("role")).toBe("dialog")
      expect(modal?.getAttribute("aria-modal")).toBe("true")
      expect(modal?.getAttribute("aria-labelledby")).toBe("quick-view-title")
    })

    it("should focus the modal when opened", async () => {
      element.click()

      await new Promise(resolve => setTimeout(resolve, 100))

      // Should focus the first focusable element (close button)
      const closeBtn = document.querySelector(".nosto-quick-view-close") as HTMLElement
      expect(document.activeElement).toBe(closeBtn)
    })
  })
})
