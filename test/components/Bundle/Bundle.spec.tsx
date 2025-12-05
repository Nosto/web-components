import { describe, it, expect, vi } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { createElement } from "@/utils/jsx"
import { createSimpleCardProductsMock } from "@/mock/products"
import type { JSONProduct } from "@nosto/nosto-js/client"
import { addProductHandlers } from "../../utils/addProductHandlers"

describe("Bundle", () => {
  const mocks = createSimpleCardProductsMock(2)
  const mockedProducts = {
    "product-1": mocks[0],
    "product-2": mocks[1]
  }
  const products = [{ handle: "product-1" }, { handle: "product-2" }] as JSONProduct[]

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundle")).toBeDefined()
  })

  it("initializes selectedProducts and updates summary on connectedCallback", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] },
      "product-2": { product: mockedProducts["product-2"] }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <span n-summary-price></span>
        <input type="checkbox" value="product-1" checked />
      </nosto-bundle>
    ) as Bundle

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!

    await bundle.connectedCallback()

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $22.98")
  })

  it("removes product from selection when checkbox with checked attribute is inputted", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product-1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product-1" checked />
      </nosto-bundle>
    ) as Bundle

    bundle.selectedProducts = [mockedProducts["product-1"], mockedProducts["product-2"]]
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()

    // dispatch input event
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts?.find(p => p.handle === "product-1")).toBeUndefined()
    expect(summary.textContent).toBe("Total: $11.99")
  })

  it("adds product to selection when checkbox without checked attribute is inputted", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] },
      "product-2": { product: mockedProducts["product-2"] }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product-1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product-1" />
      </nosto-bundle>
    ) as Bundle

    bundle.selectedProducts = [mockedProducts["product-2"]] // Only 'product-2' selected initially

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()

    // dispatch input event to add product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find(p => p.handle === "product-1")).toBeTruthy()
    expect(input.checked).toBe(true)
    expect(summary.textContent).toBe("Total: $22.98")
  })

  it("handles empty selectedProducts array", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] },
      "product-2": { product: mockedProducts["product-2"] }
    })

    const bundle = (
      <nosto-bundle>
        <span n-summary-price></span>
        <input type="checkbox" value="product-1" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    // Manually trigger summary update
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!

    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))
    expect(summary.textContent).toBe("Total: $0.00")
  })

  it("shows card when product is added to selection", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] },
      "product-2": { product: mockedProducts["product-2"] }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product-1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product-1" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<SimpleCard>('nosto-simple-card[handle="product-1"]')

    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).toBe("block")
  })

  it("hides card when product is removed from selection", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] },
      "product-2": { product: mockedProducts["product-2"] }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product-1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product-1" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<SimpleCard>('nosto-simple-card[handle="product-1"]')

    // Remove product from selection
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).toBe("none")
  })

  it("should not hide bundle card if checkbox is inside the card", async () => {
    addProductHandlers({
      "product-1": { product: mockedProducts["product-1"] },
      "product-2": { product: mockedProducts["product-2"] }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product-1">
          <input type="checkbox" value="product-1" checked />
        </nosto-simple-card>
        <span n-summary-price></span>
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<SimpleCard>('nosto-simple-card[handle="product-1"]')

    // Remove product from selection
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).not.toBe("none")
  })

  it("triggers add to cart logic when clicking element with n-atc attribute", async () => {
    const consoleSpy = vi.spyOn(console, "log")
    const bundle = (
      <nosto-bundle>
        <button n-atc>Add to Cart</button>
        <span n-summary-price></span>
      </nosto-bundle>
    ) as Bundle
    bundle.products = products

    await bundle.connectedCallback()

    const button = bundle.querySelector<HTMLButtonElement>("button[n-atc]")!
    button.click()
    // TODO: Replace with proper add to cart logic verification
    expect(consoleSpy).toHaveBeenCalledWith("Bundle Add to Cart clicked", expect.any(Array))
  })
})
