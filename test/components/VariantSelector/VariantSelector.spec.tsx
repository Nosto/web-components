/** @jsx createElement */
import { describe, it, expect, beforeEach } from "vitest"
import { VariantSelector, selectOption, getSelectedVariant } from "@/components/VariantSelector/VariantSelector"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import type { ShopifyProduct } from "@/shopify/graphql/types"
import { mockProductWithSingleValueOptionTest, mockProductWithAllSingleValueOptionsTest } from "@/mock/products"
import { clearProductCache } from "@/shopify/graphql/fetchProduct"
import { apiUrl } from "@/shopify/graphql/constants"

describe("VariantSelector", () => {
  beforeEach(() => {
    clearProductCache()
  })

  function addProductHandlers(responses: Record<string, { product?: ShopifyProduct; status?: number }>) {
    const graphqlPath = apiUrl.pathname

    addHandlers(
      http.post(graphqlPath, async ({ request }) => {
        const body = (await request.json()) as { variables: { handle: string } }
        const handle = body.variables.handle
        const response = responses[handle]
        if (!response) {
          return HttpResponse.json({ errors: [{ message: "Not Found" }] }, { status: 404 })
        }
        const product = (response.product || response) as ShopifyProduct
        // Wrap images and variants in nodes structure for GraphQL response
        const graphqlProduct = {
          ...product,
          images: { nodes: product.images }
        }
        return HttpResponse.json({ data: { product: graphqlProduct } }, { status: response.status || 200 })
      })
    )
  }

  function getShadowContent(selector: VariantSelector) {
    const shadowContent = selector.shadowRoot?.innerHTML || ""
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
  }

  const mockProductWithVariants: ShopifyProduct = {
    id: "gid://shopify/Product/123456",
    title: "Variant Test Product",
    vendor: "Test Brand",
    description: "A product with variants for testing",
    encodedVariantExistence: "",
    onlineStoreUrl: "/products/variant-test-product",
    availableForSale: true,
    adjacentVariants: [],
    images: [
      {
        altText: "Product image 1",
        height: 300,
        width: 300,
        thumbhash: null,
        url: "https://example.com/image1.jpg"
      },
      {
        altText: "Product image 2",
        height: 300,
        width: 300,
        thumbhash: null,
        url: "https://example.com/image2.jpg"
      }
    ],
    featuredImage: {
      altText: "Product image 1",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image1.jpg"
    },
    options: [
      {
        name: "Size",
        optionValues: [
          {
            name: "Small",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1001",
              title: "Small / Red",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "19.99" },
              compareAtPrice: null,
              product: { onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Medium",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1002",
              title: "Medium / Blue",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "24.99" },
              compareAtPrice: null,
              product: { onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Large",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1003",
              title: "Large / Red",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "29.99" },
              compareAtPrice: null,
              product: { onlineStoreUrl: "/products/variant-test-product" }
            }
          }
        ]
      },
      {
        name: "Color",
        optionValues: [
          {
            name: "Red",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1001",
              title: "Small / Red",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "19.99" },
              compareAtPrice: null,
              product: { onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Blue",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1002",
              title: "Medium / Blue",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "24.99" },
              compareAtPrice: null,
              product: { onlineStoreUrl: "/products/variant-test-product" }
            }
          },
          {
            name: "Green",
            swatch: null,
            firstSelectableVariant: {
              id: "gid://shopify/ProductVariant/1004",
              title: "Small / Green",
              availableForSale: true,
              price: { currencyCode: "USD", amount: "19.99" },
              compareAtPrice: null,
              product: { onlineStoreUrl: "/products/variant-test-product" }
            }
          }
        ]
      }
    ],
    price: { currencyCode: "USD", amount: "19.99" },
    compareAtPrice: null,
    variants: [
      {
        id: "gid://shopify/ProductVariant/1001",
        title: "Small / Red",
        availableForSale: true,
        selectedOptions: [
          { name: "Size", value: "Small" },
          { name: "Color", value: "Red" }
        ],
        price: { currencyCode: "USD", amount: "19.99" },
        compareAtPrice: null
      },
      {
        id: "gid://shopify/ProductVariant/1002",
        title: "Medium / Blue",
        availableForSale: true,
        selectedOptions: [
          { name: "Size", value: "Medium" },
          { name: "Color", value: "Blue" }
        ],
        price: { currencyCode: "USD", amount: "24.99" },
        compareAtPrice: null
      },
      {
        id: "gid://shopify/ProductVariant/1003",
        title: "Large / Red",
        availableForSale: true,
        selectedOptions: [
          { name: "Size", value: "Large" },
          { name: "Color", value: "Red" }
        ],
        price: { currencyCode: "USD", amount: "29.99" },
        compareAtPrice: null
      }
    ]
  }

  const mockProductWithoutVariants: ShopifyProduct = {
    ...mockProductWithVariants,
    options: [],
    variants: [
      {
        id: "gid://shopify/ProductVariant/2001",
        title: "Default",
        availableForSale: true,
        selectedOptions: [],
        price: { currencyCode: "USD", amount: "19.99" },
        compareAtPrice: null
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

  it("should not render selector UI for products without variants but include slot", async () => {
    addProductHandlers({
      "no-variants": { product: mockProductWithoutVariants }
    })

    const selector = (<nosto-variant-selector handle="no-variants" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toBe("<slot></slot>")
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
    expect((eventDetail as any)?.variant?.id).toBe("gid://shopify/ProductVariant/1003") // Large / Red
  })

  it("should update selected variant when options change", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" preselect={true} />) as VariantSelector
    await selector.connectedCallback()

    // Initial selection should be first variant (Small/Red)
    expect(getSelectedVariant(selector, mockProductWithVariants)?.id).toBe("gid://shopify/ProductVariant/1001")

    // Change to Medium/Blue
    await selectOption(selector, "Size", "Medium")
    await selectOption(selector, "Color", "Blue")

    expect(getSelectedVariant(selector, mockProductWithVariants)?.id).toBe("gid://shopify/ProductVariant/1002")
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
    expect(smallButton.getAttribute("part")).toBe("value active")
    expect(mediumButton.getAttribute("part")).toBe("value")

    // Click Medium
    mediumButton.click()

    // Now Medium should be active
    expect(smallButton.getAttribute("part")).toBe("value")
    expect(mediumButton.getAttribute("part")).toBe("value active")
  })

  it("should preselect when preselect attribute is present", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" preselect />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBe("Small")
    expect(selector.selectedOptions["Color"]).toBe("Red")

    expect(selector.shadowRoot!.querySelector("[part='value active']")).toBeTruthy()
  })

  it("should not preselect by default when preselect attribute is not specified", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBeUndefined()
    expect(selector.selectedOptions["Color"]).toBeUndefined()

    expect(selector.shadowRoot!.querySelector("[part='value active']")).toBeFalsy()
  })

  it("should include default slot in shadow DOM", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector.connectedCallback()

    const shadowRoot = selector.shadowRoot!
    const slot = shadowRoot.querySelector("slot")
    expect(slot).toBeTruthy()
    expect(slot?.tagName.toLowerCase()).toBe("slot")
  })

  it("should include default slot even when no variants are rendered", async () => {
    addProductHandlers({
      "no-variants": { product: mockProductWithoutVariants }
    })

    const selector = (<nosto-variant-selector handle="no-variants" />) as VariantSelector
    await selector.connectedCallback()

    const shadowRoot = selector.shadowRoot!
    const slot = shadowRoot.querySelector("slot")
    expect(slot).toBeTruthy()
    expect(slot?.tagName.toLowerCase()).toBe("slot")
  })

  it("should render slotted content correctly", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector

    // Add some content to be slotted
    const slottedContent = document.createElement("div")
    slottedContent.textContent = "Slotted Content"
    slottedContent.className = "slotted-test-content"
    selector.appendChild(slottedContent)

    document.body.appendChild(selector)
    await selector.connectedCallback()

    // Check that slot exists
    const shadowRoot = selector.shadowRoot!
    const slot = shadowRoot.querySelector("slot")
    expect(slot).toBeTruthy()

    // Check that slotted content is accessible via the slot
    const assignedNodes = (slot as HTMLSlotElement).assignedNodes()
    expect(assignedNodes).toHaveLength(1)
    expect((assignedNodes[0] as Element).className).toBe("slotted-test-content")

    // Cleanup
    document.body.removeChild(selector)
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

    it("should not render selector UI when all options are single-value but include slot", async () => {
      addProductHandlers({
        "all-single-value-test": { product: mockProductWithAllSingleValueOptionsTest }
      })

      const selector = (<nosto-variant-selector handle="all-single-value-test" />) as VariantSelector
      await selector.connectedCallback()

      const shadowContent = getShadowContent(selector)
      expect(shadowContent).toBe("<slot></slot>")

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
      expect((eventDetail as any)?.variant?.id).toBe("gid://shopify/ProductVariant/4001")
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
      expect(variant?.id).toBe("gid://shopify/ProductVariant/3003") // Large / Cotton
      expect(variant?.selectedOptions).toEqual([
        { name: "Size", value: "Large" },
        { name: "Material", value: "Cotton" }
      ])
    })
  })

  it("should preselect options based on given variantId", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" variantId={1002} />) as VariantSelector
    await selector.connectedCallback()

    expect(selector.selectedOptions["Size"]).toBe("Medium")
    expect(selector.selectedOptions["Color"]).toBe("Blue")
  })

  it("should emit VariantSelector/rendered event when content is loaded", async () => {
    addProductHandlers({
      "event-test-handle": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="event-test-handle" />) as VariantSelector

    // Set up event listener to capture the event
    let eventEmitted = false
    selector.addEventListener("@nosto/VariantSelector/rendered", () => {
      eventEmitted = true
    })

    // Call connectedCallback manually since it's not automatically triggered in tests
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("Size:")
    expect(eventEmitted).toBe(true)
    expect(selector.hasAttribute("loading")).toBe(false)
  })

  it("should emit VariantSelector/rendered event even for products without variants", async () => {
    addProductHandlers({
      "no-variants": { product: mockProductWithoutVariants }
    })

    const selector = (<nosto-variant-selector handle="no-variants" />) as VariantSelector

    // Set up event listener to capture the event
    let eventEmitted = false
    selector.addEventListener("@nosto/VariantSelector/rendered", () => {
      eventEmitted = true
    })

    // Call connectedCallback manually since it's not automatically triggered in tests
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toBe("<slot></slot>")
    expect(eventEmitted).toBe(true)
    expect(selector.hasAttribute("loading")).toBe(false)
  })

  it("should use placeholder content when placeholder attribute is set", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    // First, render without placeholder to populate cache
    const selector1 = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector1.connectedCallback()

    const initialContent = getShadowContent(selector1)
    expect(initialContent).toContain("Size:")

    // Second, render with placeholder enabled - should use cached content immediately
    const selector2 = (<nosto-variant-selector handle="variant-test-product" placeholder={true} />) as VariantSelector
    await selector2.connectedCallback()

    const placeholderContent = getShadowContent(selector2)
    expect(placeholderContent).toContain("Size:")
    expect(selector2.hasAttribute("loading")).toBe(false)
  })

  it("should use cached placeholder content even with different handle", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants },
      "different-handle": { product: mockProductWithVariants }
    })

    // First, render without placeholder to populate cache for variant-test-product
    const selector1 = (<nosto-variant-selector handle="variant-test-product" />) as VariantSelector
    await selector1.connectedCallback()

    // Second, render with placeholder enabled with different handle - should use cached content
    const selector2 = (<nosto-variant-selector handle="different-handle" placeholder={true} />) as VariantSelector
    await selector2.connectedCallback()

    const content = getShadowContent(selector2)
    expect(content).toContain("Size:")
    expect(selector2.hasAttribute("loading")).toBe(false)
  })
})
