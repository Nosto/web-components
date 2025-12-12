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
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $22.98")
  })

  it("populates selectedProducts based on default checked state", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(bundle.selectedProducts).toHaveLength(1)
    expect(summary.textContent).toBe("Total: $10.99")
  })

  it("removes product from selection when checkbox is unchecked", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1" />
        <nosto-simple-card handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()
    expect(bundle.selectedProducts).toHaveLength(2)

    // dispatch input event
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))
    expect(bundle.selectedProducts).toHaveLength(1)
    expect(bundle.selectedProducts?.find(p => p.handle === "product1")).toBeUndefined()
    expect(summary.textContent).toBe("Total: $11.99")
  })

  it("adds product to selection when checkbox is checked", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <nosto-simple-card handle="product1" />
        <nosto-simple-card handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()
    expect(bundle.selectedProducts).toHaveLength(1)

    // dispatch input event to add product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))
    expect(bundle.selectedProducts).toHaveLength(2)
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
        <input type="checkbox" value="product2" />
      </nosto-bundle>
    ) as Bundle

    bundle.products = products

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!

    expect(bundle.selectedProducts).toHaveLength(0)
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
        <nosto-simple-card handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
        <input type="checkbox" value="product2" />
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
        <nosto-simple-card handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
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
        <nosto-simple-card handle="product2">
          <input type="checkbox" value="product2" checked />
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
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    // @ts-expect-error partial mock
    window.Nosto = {
      addMultipleProductsToCart: vi.fn()
    }

    const bundle = (
      <nosto-bundle result-id="test-result">
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
        <button n-atc>Add to Cart</button>
        <span n-summary-price></span>
      </nosto-bundle>
    ) as Bundle
    bundle.products = products

    await bundle.connectedCallback()

    const button = bundle.querySelector<HTMLButtonElement>("button[n-atc]")!
    button.click()
    expect(window.Nosto?.addMultipleProductsToCart).toHaveBeenCalledWith(
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

  it("uses default template when no template property is provided", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Total: $22.98")
  })

  it("formats summary with custom template containing both placeholders", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} template="Buy {amount} items for {total}">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Buy 2 items for $22.98")
  })

  it("formats summary with template containing only {amount} placeholder", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} template="{amount} items selected">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("1 items selected")
  })

  it("formats summary with template containing only {total} placeholder", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} template="Bundle Total: {total}">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Bundle Total: $22.98")
  })

  it("updates summary with custom template when products are added", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} template="{amount} items - {total}">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
        <input type="checkbox" value="product2" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("0 items - $0.00")

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(summary.textContent).toBe("1 items - $10.99")
  })

  it("updates summary with custom template when products are removed", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} template="Selected: {amount} for {total}">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Selected: 2 for $22.98")

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(summary.textContent).toBe("Selected: 1 for $11.99")
  })

  it("handles template with multiple occurrences of same placeholder", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} template="{amount} items ({amount} selected) - {total}">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("1 items (1 selected) - $10.99")
  })
})
