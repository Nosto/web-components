/** @jsx createElement */
import { describe, it, expect } from "vitest"
import { VariantSelector, selectOption, getSelectedVariant } from "@/components/VariantSelector/VariantSelector"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import type { ShopifyProduct } from "@/components/SimpleCard/types"
import { mockProductWithSingleValueOptionTest, mockProductWithAllSingleValueOptionsTest } from "@/mock/products"

describe("VariantSelector", () => {
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
        sku: null,
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Small / Red",
        public_title: null,
        options: ["Small", "Red"],
        price: 1999,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 10,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
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
        sku: null,
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Medium / Blue",
        public_title: null,
        options: ["Medium", "Blue"],
        price: 2499,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 5,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
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
        sku: null,
        requires_shipping: true,
        taxable: true,
        featured_image: null,
        available: true,
        name: "Large / Red",
        public_title: null,
        options: ["Large", "Red"],
        price: 2999,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 3,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
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
    expect(shadowContent).toContain("selector")
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

  it("should not preselect by default", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBeUndefined()
    expect(selector.selectedOptions["Color"]).toBeUndefined()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).not.toContain("value active")
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

    await selectOption(selector, "Size", "Large")
    await selectOption(selector, "Color", "Red")

    expect(eventDetail).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((eventDetail as any)?.variant).toBeTruthy()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((eventDetail as any)?.variant?.id).toBe(1003) // Large / Red
  })

  it("should update selected variant when options change", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" preselect={true} />) as VariantSelector
    await selector.connectedCallback()

    // Initial selection should be first variant (Small/Red)
    expect(getSelectedVariant(selector, mockProductWithVariants)?.id).toBe(1001)

    // Change to Medium/Blue
    await selectOption(selector, "Size", "Medium")
    await selectOption(selector, "Color", "Blue")

    expect(getSelectedVariant(selector, mockProductWithVariants)?.id).toBe(1002)
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

    // Wait for async event handlers to complete
    await new Promise(resolve => setTimeout(resolve, 100))

    expect(selector.selectedOptions["Size"]).toBe("Medium")
    expect(selector.selectedOptions["Color"]).toBe("Blue")
    expect(eventFired).toBe(true)
  })

  it("should update active states when selection changes", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" preselect={true} />) as VariantSelector
    await selector.connectedCallback()

    const shadowRoot = selector.shadowRoot!
    const smallButton = shadowRoot.querySelector(
      '[data-option-name="Size"][data-option-value="Small"]'
    ) as HTMLButtonElement
    const mediumButton = shadowRoot.querySelector(
      '[data-option-name="Size"][data-option-value="Medium"]'
    ) as HTMLButtonElement

    // Initially Small should be active
    expect(smallButton.classList.contains("active")).toBe(true)
    expect(mediumButton.classList.contains("active")).toBe(false)

    // Click Medium
    mediumButton.click()

    // Now Medium should be active
    expect(smallButton.classList.contains("active")).toBe(false)
    expect(mediumButton.classList.contains("active")).toBe(true)
  })

  it("should preselect when preselect attribute is present", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" preselect />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBe("Small")
    expect(selector.selectedOptions["Color"]).toBe("Red")

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("value active")
  })

  it("should not preselect by default when preselect attribute is not specified", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBeUndefined()
    expect(selector.selectedOptions["Color"]).toBeUndefined()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).not.toContain("value active")
  })

  describe("Single-value options", () => {
    it("should auto-select single-value options regardless of preselect attribute", async () => {
      addProductHandlers({
        "single-value-test": { product: mockProductWithSingleValueOptionTest }
      })

      const selector = (<nosto-variant-selector handle="single-value-test" />) as VariantSelector
      await selector.connectedCallback()

      // Material should be auto-selected even without preselect
      expect(selector.selectedOptions["Material"]).toBe("Cotton")
      // Size should not be selected since preselect is false
      expect(selector.selectedOptions["Size"]).toBeUndefined()
    })

    it("should auto-select single-value options even when preselect is true", async () => {
      addProductHandlers({
        "single-value-test": { product: mockProductWithSingleValueOptionTest }
      })

      const selector = (<nosto-variant-selector handle="single-value-test" preselect />) as VariantSelector
      await selector.connectedCallback()

      // Both should be selected - Material auto-selected, Size preselected
      expect(selector.selectedOptions["Material"]).toBe("Cotton")
      expect(selector.selectedOptions["Size"]).toBe("Small")
    })

    it("should hide single-value options from rendered UI", async () => {
      addProductHandlers({
        "single-value-test": { product: mockProductWithSingleValueOptionTest }
      })

      const selector = (<nosto-variant-selector handle="single-value-test" />) as VariantSelector
      await selector.connectedCallback()

      const shadowContent = getShadowContent(selector)

      // Size (multi-value) should be visible
      expect(shadowContent).toContain("Size:")
      expect(shadowContent).toContain("Small")
      expect(shadowContent).toContain("Medium")
      expect(shadowContent).toContain("Large")

      // Material (single-value) should be hidden
      expect(shadowContent).not.toContain("Material:")
      expect(shadowContent).not.toContain("Cotton")
    })

    it("should not render UI when all options are single-value", async () => {
      addProductHandlers({
        "all-single-value-test": { product: mockProductWithAllSingleValueOptionsTest }
      })

      const selector = (<nosto-variant-selector handle="all-single-value-test" />) as VariantSelector
      await selector.connectedCallback()

      const shadowContent = getShadowContent(selector)
      expect(shadowContent).toBe("")

      // But selections should still be made internally
      expect(selector.selectedOptions["Size"]).toBe("Medium")
      expect(selector.selectedOptions["Color"]).toBe("Red")
    })

    it("should emit variantchange event for products with single-value options", async () => {
      addProductHandlers({
        "all-single-value-test": { product: mockProductWithAllSingleValueOptionsTest }
      })

      const selector = (<nosto-variant-selector handle="all-single-value-test" />) as VariantSelector

      let eventDetail: Record<string, unknown> | null = null
      selector.addEventListener("variantchange", (event: Event) => {
        eventDetail = (event as CustomEvent).detail
      })

      await selector.connectedCallback()

      expect(eventDetail).toBeTruthy()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((eventDetail as any)?.variant?.id).toBe(4001)
    })

    it("should correctly select variants with mixed single and multi-value options", async () => {
      addProductHandlers({
        "single-value-test": { product: mockProductWithSingleValueOptionTest }
      })

      const selector = (<nosto-variant-selector handle="single-value-test" />) as VariantSelector
      await selector.connectedCallback()

      // Select a size option (Material is auto-selected)
      await selectOption(selector, "Size", "Large")

      const variant = getSelectedVariant(selector, mockProductWithSingleValueOptionTest)
      expect(variant?.id).toBe(3003) // Large / Cotton
      expect(variant?.options).toEqual(["Large", "Cotton"])
    })
  })
})
