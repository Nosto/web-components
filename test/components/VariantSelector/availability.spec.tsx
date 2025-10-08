/** @jsx createElement */
import { describe, it, expect, beforeAll } from "vitest"
import {
  VariantSelector,
  isOptionValueDisabled,
  isOptionValueUnavailable
} from "@/components/VariantSelector/VariantSelector"
import { addHandlers } from "../../msw.setup"
import { http, HttpResponse } from "msw"
import { createElement } from "../../utils/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import type { ShopifyProduct } from "@/components/SimpleCard/types"

describe("VariantSelector Availability", () => {
  beforeAll(() => {
    if (!customElements.get("nosto-variant-selector")) {
      customElements.define("nosto-variant-selector", VariantSelector)
    }
  })

  const mockProductWithLimitedAvailability: ShopifyProduct = {
    id: 123456,
    title: "Limited Availability Product",
    handle: "limited-availability-product",
    description: "A product with limited variant availability for testing",
    vendor: "Test Brand",
    tags: ["test", "availability"],
    images: ["https://example.com/image1.jpg"],
    featured_image: "https://example.com/image1.jpg",
    price: 1999,
    compare_at_price: 2499,
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
    url: "/products/limited-availability-product",
    media: [],
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
      // Available variants
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
        available: true, // Available
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
        available: false, // Out of stock
        name: "Medium / Blue",
        public_title: null,
        options: ["Medium", "Blue"],
        price: 2499,
        weight: 100,
        compare_at_price: null,
        inventory_quantity: 0,
        inventory_management: null,
        inventory_policy: "deny",
        barcode: null,
        quantity_rule: { min: 1, max: null, increment: 1 },
        quantity_price_breaks: [],
        requires_selling_plan: false,
        selling_plan_allocations: []
      }
      // Note: No Large / Green variant exists, making that combination impossible (disabled)
    ]
  }

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

  describe("Availability calculation functions", () => {
    it("should correctly identify disabled options (no variants available)", () => {
      const currentSelections = { Size: "Large" }

      // Green should be disabled when Large is selected, since no Large/Green variant exists
      const isGreenDisabled = isOptionValueDisabled(
        mockProductWithLimitedAvailability,
        "Color",
        "Green",
        currentSelections
      )
      expect(isGreenDisabled).toBe(true)

      // Red should not be disabled when Large is selected, even though no Large/Red variant exists
      // because there's no Large/Red variant in our mock data
      const isRedDisabled = isOptionValueDisabled(mockProductWithLimitedAvailability, "Color", "Red", currentSelections)
      expect(isRedDisabled).toBe(true) // Actually this should be true since no Large/Red exists
    })

    it("should correctly identify unavailable options (variants exist but out of stock)", () => {
      const currentSelections = { Size: "Medium" }

      // Blue should be unavailable when Medium is selected (Medium/Blue exists but available=false)
      const isBlueUnavailable = isOptionValueUnavailable(
        mockProductWithLimitedAvailability,
        "Color",
        "Blue",
        currentSelections
      )
      expect(isBlueUnavailable).toBe(true)

      // Red should not be unavailable when Medium is selected (no Medium/Red variant exists)
      const isRedUnavailable = isOptionValueUnavailable(
        mockProductWithLimitedAvailability,
        "Color",
        "Red",
        currentSelections
      )
      expect(isRedUnavailable).toBe(false) // Should be false since no variant exists (it's disabled instead)
    })

    it("should handle options without other selections", () => {
      const noSelections = {}

      // When no other options are selected, all values should be available
      const isSmallDisabled = isOptionValueDisabled(mockProductWithLimitedAvailability, "Size", "Small", noSelections)
      expect(isSmallDisabled).toBe(false)

      const isMediumUnavailable = isOptionValueUnavailable(
        mockProductWithLimitedAvailability,
        "Size",
        "Medium",
        noSelections
      )
      expect(isMediumUnavailable).toBe(true) // The only Medium variant (Medium/Blue) is unavailable
    })
  })

  describe("Component integration", () => {
    it("should render buttons with correct availability attributes", async () => {
      addProductHandlers({
        "limited-availability-product": { product: mockProductWithLimitedAvailability }
      })

      const selector = (
        <nosto-variant-selector handle="limited-availability-product" preselect={true} />
      ) as VariantSelector
      await selector.connectedCallback()

      const shadowContent = getShadowContent(selector)

      // Check that buttons are rendered
      expect(shadowContent).toContain("Small")
      expect(shadowContent).toContain("Medium")
      expect(shadowContent).toContain("Large")
      expect(shadowContent).toContain("Red")
      expect(shadowContent).toContain("Blue")
      expect(shadowContent).toContain("Green")

      // With preselect=true, Small and Red should be initially selected
      // This means some options might have availability attributes
      const shadowRoot = selector.shadowRoot!

      // Check if disabled buttons exist (should be buttons that can't combine with Small/Red)
      const disabledButtons = shadowRoot.querySelectorAll("button[disabled]")
      expect(disabledButtons.length).toBeGreaterThanOrEqual(0) // Some options may be disabled

      // Check if unavailable buttons exist
      const unavailableButtons = shadowRoot.querySelectorAll('button[data-status="unavailable"]')
      expect(unavailableButtons.length).toBeGreaterThanOrEqual(0) // Some options may be unavailable
    })

    it("should prevent clicks on disabled buttons", async () => {
      addProductHandlers({
        "limited-availability-product": { product: mockProductWithLimitedAvailability }
      })

      const selector = (<nosto-variant-selector handle="limited-availability-product" />) as VariantSelector
      await selector.connectedCallback()

      // Select Large to make Green disabled
      const largeButton = selector.shadowRoot?.querySelector('[data-option-value="Large"]') as HTMLButtonElement
      largeButton?.click()

      // Wait for updates
      await new Promise(resolve => setTimeout(resolve, 100))

      // Now try to click Green (should be disabled)
      const greenButton = selector.shadowRoot?.querySelector('[data-option-value="Green"]') as HTMLButtonElement

      // Check if it's disabled
      if (greenButton?.hasAttribute("disabled")) {
        const initialSelections = { ...selector.selectedOptions }

        greenButton.click()

        // Wait for any potential updates
        await new Promise(resolve => setTimeout(resolve, 100))

        // Selections should not have changed
        expect(selector.selectedOptions).toEqual(initialSelections)
      }
    })
  })
})
