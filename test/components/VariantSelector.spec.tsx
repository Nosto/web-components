/** @jsx createElement */
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest"
import { VariantSelector } from "@/components/VariantSelector/VariantSelector"
import { addHandlers } from "../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../utils/jsx"
import { createShopifyUrl } from "@/utils"
import type { ShopifyProduct, VariantSelectionEvent } from "@/components/VariantSelector/types"

describe("VariantSelector", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-variant-selector")) {
      customElements.define("nosto-variant-selector", VariantSelector)
    }
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ error: "Product not found" }, { status: 404 })
        }
        return HttpResponse.json(response.product, { status: response.status || 200 })
      })
    )
  }

  const sampleProduct: ShopifyProduct = {
    id: 123456,
    title: "Test T-Shirt",
    handle: "test-t-shirt",
    description: "A test t-shirt",
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    vendor: "Test Vendor",
    type: "Apparel",
    tags: ["test", "shirt"],
    price: 2999,
    price_min: 2999,
    price_max: 3999,
    available: true,
    price_varies: true,
    compare_at_price: null,
    compare_at_price_min: null,
    compare_at_price_max: null,
    compare_at_price_varies: false,
    variants: [
      {
        id: 11111,
        title: "Red / Small",
        option1: "Red",
        option2: "Small",
        option3: null,
        sku: "TEST-RED-S",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Red / Small",
        public_title: "Red / Small",
        options: ["Red", "Small"],
        price: 2999,
        weight: 100,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      },
      {
        id: 22222,
        title: "Red / Large",
        option1: "Red",
        option2: "Large",
        option3: null,
        sku: "TEST-RED-L",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Red / Large",
        public_title: "Red / Large",
        options: ["Red", "Large"],
        price: 3999,
        weight: 120,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      },
      {
        id: 33333,
        title: "Blue / Small",
        option1: "Blue",
        option2: "Small",
        option3: null,
        sku: "TEST-BLUE-S",
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: false,
        name: "Blue / Small",
        public_title: "Blue / Small",
        options: ["Blue", "Small"],
        price: 2999,
        weight: 100,
        compare_at_price: null,
        inventory_management: null,
        barcode: null,
        featured_media: null
      }
    ],
    images: [],
    featured_image: "",
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
    media: [],
    requires_selling_plan: false,
    selling_plan_groups: [],
    url: "/products/test-t-shirt"
  }

  it("fetches product data and renders button inputs", async () => {
    addProductHandlers({
      "test-t-shirt": {
        product: sampleProduct
      }
    })

    const selector = (<nosto-variant-selector handle="test-t-shirt" />) as VariantSelector

    await selector.connectedCallback()

    expect(selector.shadowRoot?.innerHTML).toContain("Color")
    expect(selector.shadowRoot?.innerHTML).toContain("Size")
    expect(selector.shadowRoot?.querySelectorAll(".option-button")).toHaveLength(4) // Red, Blue, Small, Large
    expect(selector.hasAttribute("loading")).toBe(false)
  })

  it("preselects the first variant on load", async () => {
    addProductHandlers({
      "test-t-shirt": {
        product: sampleProduct
      }
    })

    const selector = (<nosto-variant-selector handle="test-t-shirt" />) as VariantSelector

    await selector.connectedCallback()

    const redButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Color"][data-value="Red"]'
    ) as HTMLButtonElement
    const smallButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Size"][data-value="Small"]'
    ) as HTMLButtonElement

    expect(redButton?.classList.contains("selected")).toBe(true)
    expect(smallButton?.classList.contains("selected")).toBe(true)
    expect(selector.getSelectedVariant()?.id).toBe(11111)
  })

  it("updates selected variant when options change", async () => {
    addProductHandlers({
      "test-t-shirt": {
        product: sampleProduct
      }
    })

    const selector = (<nosto-variant-selector handle="test-t-shirt" />) as VariantSelector

    await selector.connectedCallback()

    const largeButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Size"][data-value="Large"]'
    ) as HTMLButtonElement

    // Change size to Large
    largeButton.click()

    expect(selector.getSelectedVariant()?.id).toBe(22222)
    expect(selector.getSelectedVariant()?.title).toBe("Red / Large")
  })

  it("emits variant-selected event when selection changes", async () => {
    addProductHandlers({
      "test-t-shirt": {
        product: sampleProduct
      }
    })

    const selector = (<nosto-variant-selector handle="test-t-shirt" />) as VariantSelector

    let eventDetail: VariantSelectionEvent | null = null
    selector.addEventListener("@nosto/VariantSelector/variant-selected", ((
      event: CustomEvent<VariantSelectionEvent>
    ) => {
      eventDetail = event.detail
    }) as EventListener)

    await selector.connectedCallback()

    // Event should be emitted on initial load
    expect(eventDetail).not.toBeNull()
    expect(eventDetail!.variant!.id).toBe(11111)
    expect(eventDetail!.product.handle).toBe("test-t-shirt")

    // Reset for next test
    eventDetail = null

    const blueButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Color"][data-value="Blue"]'
    ) as HTMLButtonElement

    // Change color to Blue
    blueButton.click()

    // Event should be emitted again
    expect(eventDetail).not.toBeNull()
    expect(eventDetail!.variant!.id).toBe(33333)
  })

  it("handles products with no variants gracefully", async () => {
    const productNoVariants = {
      ...sampleProduct,
      variants: [],
      options: []
    }

    addProductHandlers({
      "no-variants": {
        product: productNoVariants
      }
    })

    const selector = (<nosto-variant-selector handle="no-variants" />) as VariantSelector

    await selector.connectedCallback()

    expect(selector.shadowRoot?.innerHTML).toContain("No options available")
    expect(selector.getSelectedVariant()).toBeNull()
  })

  it("works with single option products", async () => {
    const singleOptionProduct = {
      ...sampleProduct,
      options: [
        {
          name: "Color",
          position: 1,
          values: ["Red", "Blue", "Green"]
        }
      ],
      variants: [
        {
          id: 44444,
          title: "Red",
          option1: "Red",
          option2: null,
          option3: null,
          sku: "TEST-RED",
          requires_shipping: true,
          taxable: true,
          featured_image: null,
          available: true,
          name: "Red",
          public_title: "Red",
          options: ["Red"],
          price: 2999,
          weight: 100,
          compare_at_price: null,
          inventory_management: null,
          barcode: null,
          featured_media: null
        },
        {
          id: 55555,
          title: "Blue",
          option1: "Blue",
          option2: null,
          option3: null,
          sku: "TEST-BLUE",
          requires_shipping: true,
          taxable: true,
          featured_image: null,
          available: true,
          name: "Blue",
          public_title: "Blue",
          options: ["Blue"],
          price: 2999,
          weight: 100,
          compare_at_price: null,
          inventory_management: null,
          barcode: null,
          featured_media: null
        }
      ]
    }

    addProductHandlers({
      "single-option": {
        product: singleOptionProduct
      }
    })

    const selector = (<nosto-variant-selector handle="single-option" />) as VariantSelector

    await selector.connectedCallback()

    expect(selector.shadowRoot?.querySelectorAll(".option-button")).toHaveLength(3) // Red, Blue, Green
    expect(selector.getSelectedVariant()?.id).toBe(44444)

    const blueButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Color"][data-value="Blue"]'
    ) as HTMLButtonElement
    blueButton.click()

    expect(selector.getSelectedVariant()?.id).toBe(55555)
  })

  it("provides accessibility attributes", async () => {
    addProductHandlers({
      "test-t-shirt": {
        product: sampleProduct
      }
    })

    const selector = (<nosto-variant-selector handle="test-t-shirt" />) as VariantSelector

    await selector.connectedCallback()

    const form = selector.shadowRoot?.querySelector("form")
    expect(form?.getAttribute("role")).toBe("group")
    expect(form?.getAttribute("aria-label")).toBe("Product variant selection")

    const buttons = selector.shadowRoot?.querySelectorAll(".option-button")
    buttons?.forEach(button => {
      expect(button.hasAttribute("aria-label")).toBe(true)
      expect(button.getAttribute("data-option-name")).toBeTruthy()
      expect(button.getAttribute("data-value")).toBeTruthy()
    })
  })

  it("handles variant not found for option combination", async () => {
    // Product with limited variant combinations
    const limitedProduct = {
      ...sampleProduct,
      variants: [
        {
          ...sampleProduct.variants[0],
          options: ["Red", "Small"]
        }
        // Only Red/Small variant exists
      ]
    }

    addProductHandlers({
      "limited-variants": {
        product: limitedProduct
      }
    })

    const selector = (<nosto-variant-selector handle="limited-variants" />) as VariantSelector

    let eventDetail: VariantSelectionEvent | null = null
    selector.addEventListener("@nosto/VariantSelector/variant-selected", ((
      event: CustomEvent<VariantSelectionEvent>
    ) => {
      eventDetail = event.detail
    }) as EventListener)

    await selector.connectedCallback()

    const blueButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Color"][data-value="Blue"]'
    ) as HTMLButtonElement
    const smallButton = selector.shadowRoot?.querySelector(
      '.option-button[data-option-name="Size"][data-value="Small"]'
    ) as HTMLButtonElement

    // Change to an unavailable combination
    blueButton.click()
    smallButton.click()

    expect(selector.getSelectedVariant()).toBeNull()
    expect(eventDetail!.variant).toBeNull()
  })
})
