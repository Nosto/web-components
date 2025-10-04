/** @jsx createElement */
import { describe, it, expect, beforeAll, beforeEach } from "vitest"
import { VariantSelector, selectOption } from "@/components/VariantSelector/VariantSelector"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { clearCache } from "@/utils/fetch"
import type { ShopifyProduct } from "@/components/SimpleCard/types"

describe("VariantSelector", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-variant-selector")) {
      customElements.define("nosto-variant-selector", VariantSelector)
    }
  })

  beforeEach(() => {
    clearCache()
  })

  function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    const productUrl = createShopifyUrl("products/:handle.js")
    const productPath = productUrl.pathname

    addHandlers(
      http.get(productPath, ({ params }) => {
        const handle = params.handle as string
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ error: "Not Found" }, { status: 404 })
        }
        return HttpResponse.json(response.product || response, { status: response.status || 200 })
      })
    )
  }

  function getShadowContent(selector: VariantSelector) {
    const shadowContent = selector.shadowRoot?.innerHTML || ""
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
  }

  const mockProductWithVariants: ShopifyProduct = {
    id: 123456,
    title: "Variant Test Product",
    handle: "variant-test-product",
    description: "A product with variants for testing",
    vendor: "Test Brand",
    tags: ["test", "variants"],
    images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    featured_image: "https://example.com/image1.jpg",
    price: 1999, // $19.99 in cents
    compare_at_price: 2499, // $24.99 in cents
    published_at: "2023-01-01T00:00:00Z",
    created_at: "2023-01-01T00:00:00Z",
    type: "Test",
    price_min: 1999,
    price_max: 2999,
    available: true,
    price_varies: true,
    compare_at_price_min: 2499,
    compare_at_price_max: 3499,
    compare_at_price_varies: true,
    url: "/products/variant-test-product",
    media: [
      {
        id: 1,
        src: "https://example.com/image1.jpg",
        alt: "Product image 1",
        position: 1,
        aspect_ratio: 1,
        height: 300,
        width: 300,
        media_type: "image",
        preview_image: {
          aspect_ratio: 1,
          height: 300,
          width: 300,
          src: "https://example.com/image1.jpg"
        }
      }
    ],
    requires_selling_plan: false,
    selling_plan_groups: [],
    options: [
      {
        name: "Size",
        position: 1,
        values: ["Small", "Medium", "Large"]
      },
      {
        name: "Color",
        position: 2,
        values: ["Red", "Blue", "Green"]
      }
    ],
    variants: [
      {
        id: 1001,
        title: "Small / Red",
        option1: "Small",
        option2: "Red",
        option3: null,
        sku: "TEST-SM-RED",
        requires_shipping: true,
        taxable: true,
        featured_image: "https://example.com/red-small.jpg",
        available: true,
        name: "Small / Red",
        public_title: "Small / Red",
        options: ["Small", "Red"],
        price: 1999,
        weight: 100,
        compare_at_price: 2499,
        inventory_quantity: 10,
        inventory_management: "shopify",
        inventory_policy: "deny",
        barcode: "123456789",
        quantity_rule: {
          min: 1,
          max: null,
          increment: 1
        },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      },
      {
        id: 1002,
        title: "Medium / Blue",
        option1: "Medium",
        option2: "Blue",
        option3: null,
        sku: "TEST-MD-BLUE",
        requires_shipping: true,
        taxable: true,
        featured_image: "https://example.com/blue-medium.jpg",
        available: true,
        name: "Medium / Blue",
        public_title: "Medium / Blue",
        options: ["Medium", "Blue"],
        price: 2499,
        weight: 120,
        compare_at_price: 2999,
        inventory_quantity: 5,
        inventory_management: "shopify",
        inventory_policy: "deny",
        barcode: "123456790",
        quantity_rule: {
          min: 1,
          max: null,
          increment: 1
        },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      },
      {
        id: 1003,
        title: "Large / Red",
        option1: "Large",
        option2: "Red",
        option3: null,
        sku: "TEST-LG-RED",
        requires_shipping: true,
        taxable: true,
        featured_image: "https://example.com/red-large.jpg",
        available: true,
        name: "Large / Red",
        public_title: "Large / Red",
        options: ["Large", "Red"],
        price: 2999,
        weight: 150,
        compare_at_price: 3499,
        inventory_quantity: 3,
        inventory_management: "shopify",
        inventory_policy: "deny",
        barcode: "123456791",
        quantity_rule: {
          min: 1,
          max: null,
          increment: 1
        },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      }
    ]
  }

  const mockProductWithoutVariants: ShopifyProduct = {
    ...mockProductWithVariants,
    options: [],
    variants: [
      {
        ...mockProductWithVariants.variants[0],
        id: 2001,
        title: "Default",
        option1: null,
        option2: null,
        options: []
      }
    ]
  }

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-variant-selector")).toBe(VariantSelector)
  })

  it("should throw an error if handle attribute is not provided", async () => {
    const selector = (<nosto-variant-selector />) as VariantSelector
    await expect(selector.connectedCallback()).rejects.toThrow("Property handle is required.")
  })

  it("should render variant options for products with multiple variants", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("variant-selector")
    expect(shadowContent).toContain("Size:")
    expect(shadowContent).toContain("Color:")
    expect(shadowContent).toContain("Small")
    expect(shadowContent).toContain("Medium")
    expect(shadowContent).toContain("Large")
    expect(shadowContent).toContain("Red")
    expect(shadowContent).toContain("Blue")
    expect(shadowContent).toContain("Green")
  })

  it("should not render for products without variants", async () => {
    addProductHandlers({
      "no-variants": { product: mockProductWithoutVariants }
    })

    const selector = (<nosto-variant-selector handle="no-variants" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toBe("")
  })

  it("should preselect first values for each option", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBe("Small")
    expect(selector.selectedOptions["Color"]).toBe("Red")

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("variant-option-value--active")
  })

  it("should emit variantchange event on option selection", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    let eventDetail: Record<string, unknown> | null = null
    selector.addEventListener("variantchange", (event: Event) => {
      eventDetail = (event as CustomEvent).detail
    })

    selectOption(selector, "Size", "Large")

    expect(eventDetail).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((eventDetail as any)?.variant).toBeTruthy()
  })

  it("should update selected variant when options change", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    // Initial selection should be first variant (Small/Red)
    expect(selector.selectedVariant?.id).toBe(1001)

    // Change to Medium/Blue
    selectOption(selector, "Size", "Medium")
    selectOption(selector, "Color", "Blue")

    expect(selector.selectedVariant?.id).toBe(1002)
  })

  it("should handle option button clicks", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    const shadowRoot = selector.shadowRoot!
    const mediumButton = shadowRoot.querySelector(
      '[data-option-name="Size"][data-option-value="Medium"]'
    ) as HTMLButtonElement
    const blueButton = shadowRoot.querySelector(
      '[data-option-name="Color"][data-option-value="Blue"]'
    ) as HTMLButtonElement

    expect(mediumButton).toBeTruthy()
    expect(blueButton).toBeTruthy()

    let eventFired = false
    selector.addEventListener("variantchange", () => {
      eventFired = true
    })

    // Click Medium and Blue to create a valid variant combination (Medium / Blue)
    mediumButton.click()
    blueButton.click()

    expect(selector.selectedOptions["Size"]).toBe("Medium")
    expect(selector.selectedOptions["Color"]).toBe("Blue")
    expect(eventFired).toBe(true)
  })

  it("should update active states when selection changes", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    const shadowRoot = selector.shadowRoot!
    const smallButton = shadowRoot.querySelector(
      '[data-option-name="Size"][data-option-value="Small"]'
    ) as HTMLButtonElement
    const mediumButton = shadowRoot.querySelector(
      '[data-option-name="Size"][data-option-value="Medium"]'
    ) as HTMLButtonElement

    // Initially Small should be active
    expect(smallButton.classList.contains("variant-option-value--active")).toBe(true)
    expect(mediumButton.classList.contains("variant-option-value--active")).toBe(false)

    // Click Medium
    mediumButton.click()

    // Now Medium should be active
    expect(smallButton.classList.contains("variant-option-value--active")).toBe(false)
    expect(mediumButton.classList.contains("variant-option-value--active")).toBe(true)
  })
})
