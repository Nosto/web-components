/** @jsx createElement */
import { describe, it, expect, beforeEach } from "vitest"
import { VariantSelector } from "@/components/VariantSelector/VariantSelector"
import { createElement } from "@/utils/jsx"
import type { VariantChangeDetail } from "@/shopify/types"
import { mockProductWithSingleValueOptionTest, mockProductWithVariants } from "@/mock/products"
import { clearProductCache } from "@/shopify/graphql/fetchProduct"
import { EVENT_NAME_VARIANT_CHANGE } from "@/components/VariantSelector/emitVariantChange"
import { addProductHandlers } from "../../utils/addProductHandlers"

describe("VariantSelector - Compact Mode", () => {
  beforeEach(() => {
    clearProductCache()
  })

  function getShadowContent(selector: VariantSelector) {
    const shadowContent = selector.shadowRoot?.innerHTML || ""
    return shadowContent.replace(/<style>[\s\S]*?<\/style>/g, "").trim()
  }

  it("should render a dropdown in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).toContain("compact-selector")
    expect(shadowContent).toContain("variant-dropdown")
    expect(shadowContent).toContain("<select")
  })

  it("should render all variants as dropdown options in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    expect(dropdown).toBeTruthy()

    const options = dropdown.querySelectorAll("option")
    expect(options.length).toBe(3) // Small/Red, Medium/Blue, Large/Red

    expect(options[0].value).toBe("gid://shopify/ProductVariant/1001")
    expect(options[0].textContent).toContain("Small / Red")
    expect(options[0].disabled).toBe(false)

    expect(options[1].value).toBe("gid://shopify/ProductVariant/1002")
    expect(options[1].textContent).toContain("Medium / Blue")
    expect(options[1].disabled).toBe(false)

    expect(options[2].value).toBe("gid://shopify/ProductVariant/1003")
    expect(options[2].textContent).toContain("Large / Red")
    expect(options[2].disabled).toBe(false)
  })

  it("should mark unavailable variants as disabled in compact mode", async () => {
    const productWithUnavailableVariants = {
      ...mockProductWithVariants,
      adjacentVariants: [
        ...mockProductWithVariants.adjacentVariants.map((v, idx) => ({
          ...v,
          availableForSale: idx === 1 // Only Medium/Blue is available
        }))
      ]
    }

    addProductHandlers({
      "variant-test-product": { product: productWithUnavailableVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    const options = dropdown.querySelectorAll("option")

    expect(options[0].disabled).toBe(true)
    expect(options[1].disabled).toBe(false)
    expect(options[2].disabled).toBe(true)
  })

  it("should preselect first available variant in compact mode when preselect is true", async () => {
    const productWithUnavailableVariants = {
      ...mockProductWithVariants,
      adjacentVariants: [
        ...mockProductWithVariants.adjacentVariants.map((v, idx) => ({
          ...v,
          availableForSale: idx !== 0 // First variant is unavailable
        }))
      ]
    }

    addProductHandlers({
      "variant-test-product": { product: productWithUnavailableVariants }
    })

    const selector = (
      <nosto-variant-selector handle="variant-test-product" mode="compact" preselect />
    ) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    expect(dropdown.value).toBe("gid://shopify/ProductVariant/1002") // Should select Medium/Blue
  })

  it("should emit variantchange event when dropdown selection changes in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    let eventFired = false
    let eventDetail: VariantChangeDetail | undefined

    selector.addEventListener(EVENT_NAME_VARIANT_CHANGE, e => {
      eventFired = true
      eventDetail = (e as CustomEvent).detail
    })

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    dropdown.value = "gid://shopify/ProductVariant/1002"
    dropdown.dispatchEvent(new Event("change", { bubbles: true }))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(eventFired).toBe(true)
    expect(eventDetail).toBeDefined()
    expect(eventDetail!.variant.id).toBe("gid://shopify/ProductVariant/1002")
    expect(eventDetail!.variant.title).toBe("Medium / Blue")
  })

  it("should not render dropdown if product has only one variant in compact mode", async () => {
    const productWithSingleVariant = {
      ...mockProductWithVariants,
      adjacentVariants: [mockProductWithVariants.adjacentVariants[0]]
    }

    addProductHandlers({
      "single-variant-product": { product: productWithSingleVariant }
    })

    const selector = (<nosto-variant-selector handle="single-variant-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const shadowContent = getShadowContent(selector)
    expect(shadowContent).not.toContain("variant-dropdown")
    expect(shadowContent).toContain("<slot")
  })

  it("should update variantId when variant is selected in compact mode", async () => {
    addProductHandlers({
      "variant-test-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="variant-test-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    dropdown.value = "gid://shopify/ProductVariant/1002"
    dropdown.dispatchEvent(new Event("change", { bubbles: true }))

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(selector.variantId).toBe(1002)
    expect(dropdown.value).toBe("gid://shopify/ProductVariant/1002")
  })

  it("should skip single-value options in compact mode dropdown titles", async () => {
    addProductHandlers({
      "single-value-test": { product: mockProductWithSingleValueOptionTest }
    })

    const selector = (<nosto-variant-selector handle="single-value-test" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    expect(dropdown).toBeTruthy()

    const options = dropdown.querySelectorAll("option")
    expect(options.length).toBe(3) // Small, Medium, Large

    // Material is fixed to "Cotton" across all variants, so it should not appear in option text
    expect(options[0].textContent).toBe("Small")
    expect(options[0].textContent).not.toContain("Cotton")
    expect(options[1].textContent).toBe("Medium")
    expect(options[1].textContent).not.toContain("Cotton")
    expect(options[2].textContent).toBe("Large")
    expect(options[2].textContent).not.toContain("Cotton")
  })

  it("should disable dropdown when all variants are unavailable", async () => {
    const productWithAllUnavailable = {
      ...mockProductWithVariants,
      adjacentVariants: mockProductWithVariants.adjacentVariants.map(v => ({
        ...v,
        availableForSale: false
      }))
    }

    addProductHandlers({
      "all-unavailable-product": { product: productWithAllUnavailable }
    })

    const selector = (<nosto-variant-selector handle="all-unavailable-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    expect(dropdown).toBeTruthy()
    expect(dropdown.disabled).toBe(true)
  })

  it("should enable dropdown when at least one variant is available", async () => {
    const productWithOneAvailable = {
      ...mockProductWithVariants,
      adjacentVariants: mockProductWithVariants.adjacentVariants.map((v, idx) => ({
        ...v,
        availableForSale: idx === 1 // Only second variant is available
      }))
    }

    addProductHandlers({
      "one-available-product": { product: productWithOneAvailable }
    })

    const selector = (<nosto-variant-selector handle="one-available-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    expect(dropdown).toBeTruthy()
    expect(dropdown.disabled).toBe(false)
  })

  it("should sort variants by first option value order", async () => {
    addProductHandlers({
      "unordered-variant-product": { product: mockProductWithVariants }
    })

    const selector = (<nosto-variant-selector handle="unordered-variant-product" mode="compact" />) as VariantSelector
    await selector.connectedCallback()

    const dropdown = selector.shadowRoot!.querySelector("select") as HTMLSelectElement
    const options = dropdown.querySelectorAll("option")

    // Expect options to be sorted as Small, Medium, Large based on first option value order
    expect(options[0].textContent).toContain("Small / Red")
    expect(options[1].textContent).toContain("Medium / Blue")
    expect(options[2].textContent).toContain("Large / Red")
  })
})
