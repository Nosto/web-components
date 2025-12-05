import { describe, it, expect, vi } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { createElement } from "@/utils/jsx"
import { createMockShopifyProducts } from "@/mock/products"
import type { JSONProduct } from "@nosto/nosto-js/client"
import { addProductHandlers } from "../../utils/addProductHandlers"

describe("Bundle", () => {
  const mocks = createMockShopifyProducts(2)
  const mockedProducts = {
    product1: mocks[0],
    product2: mocks[1]
  }
  const products = [{ handle: "product1" }, { handle: "product2" }] as JSONProduct[]

  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundle")).toBeDefined()
  })

  it("initializes selectedProducts and updates summary on connectedCallback", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
      </nosto-bundle>
    ) as Bundle

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!

    await bundle.connectedCallback()

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $22.98")
  })

  it("removes product from selection when checkbox with checked attribute is inputted", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
      </nosto-bundle>
    ) as Bundle

    bundle.selectedProducts = [mockedProducts.product1, mockedProducts.product2]
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()

    // dispatch input event
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts?.find(p => p.handle === "product1")).toBeUndefined()
    expect(summary.textContent).toBe("Total: $11.99")
  })

  it("adds product to selection when checkbox without checked attribute is inputted", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
      </nosto-bundle>
    ) as Bundle

    bundle.selectedProducts = [mockedProducts.product2] // Only 'product2' selected initially

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()

    // dispatch input event to add product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find(p => p.handle === "product1")).toBeTruthy()
    expect(input.checked).toBe(true)
    expect(summary.textContent).toBe("Total: $22.98")
  })

  it("handles empty selectedProducts array", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    const bundle = (
      <nosto-bundle>
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
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
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<SimpleCard>('nosto-simple-card[handle="product1"]')

    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).toBe("block")
  })

  it("hides card when product is removed from selection", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<SimpleCard>('nosto-simple-card[handle="product1"]')

    // Remove product from selection
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).toBe("none")
  })

  it("should not hide bundle card if checkbox is inside the card", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1">
          <input type="checkbox" value="product1" checked />
        </nosto-simple-card>
        <span n-summary-price></span>
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<SimpleCard>('nosto-simple-card[handle="product1"]')

    // Remove product from selection
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).not.toBe("none")
  })

  it("triggers add to cart logic when clicking element with n-atc attribute", async () => {
    window.Nosto = {
      addMultipleProductsToCart: vi.fn()
    }

    const bundle = (
      <nosto-bundle result-id="test-result">
        <button n-atc>Add to Cart</button>
        <span n-summary-price></span>
      </nosto-bundle>
    ) as Bundle
    bundle.products = products

    await bundle.connectedCallback()

    const button = bundle.querySelector<HTMLButtonElement>("button[n-atc]")!
    button.click()
    expect(window.Nosto.addMultipleProductsToCart).toHaveBeenCalledWith(
      [
        {
          productId: "1",
          quantity: 1,
          skuId: "1"
        },
        {
          productId: "2",
          quantity: 1,
          skuId: "2"
        }
      ],
      "test-result"
    )
  })
})
