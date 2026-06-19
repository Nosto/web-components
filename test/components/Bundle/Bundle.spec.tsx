import { describe, it, expect, vi, afterEach } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { createElement } from "@/utils/jsx"
import { createMockShopifyProducts } from "@/mock/products"
import type { JSONProduct } from "@nosto/nosto-js/client"
import { addProductHandlers } from "../../utils/addProductHandlers"
import { EVENT_NAME_VARIANT_CHANGE } from "@/components/events"
import { VariantChangeDetail } from "@/shopify/graphql/types"
import { getEventPromise } from "../../utils/getEventPromise"

async function waitForRender(bundle: Bundle) {
  // Set up all listeners BEFORE appending to DOM or calling connectedCallback
  const bundlePromise = getEventPromise(bundle, "@nosto/Bundle/rendered")

  // Now append to DOM to trigger connectedCallback
  document.body.appendChild(bundle)

  // Wait for all render events
  return await bundlePromise
}

describe("Bundle", () => {
  const mocks = createMockShopifyProducts(2)
  const mockedProducts = {
    product1: mocks[0],
    product2: mocks[1]
  }
  const products = [{ handle: "product1" }, { handle: "product2" }] as JSONProduct[]

  afterEach(() => {
    document.body.innerHTML = ""
    vi.clearAllMocks()
  })

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
    expect(summary.textContent).toBe("Total: $201.00")
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
    expect(summary.textContent).toBe("Total: $100.00")
  })

  it("removes product from selection when checkbox is unchecked", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()

    // dispatch input event
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))
    expect(summary.textContent).toBe("Total: $101.00")
  })

  it("adds product to selection when checkbox is checked", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!

    await bundle.connectedCallback()

    // dispatch input event to add product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(input.checked).toBe(true)
    expect(summary.textContent).toBe("Total: $201.00")
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

    expect(summary.textContent).toBe("Total: $0.00")
  })

  it("shows card when product is added to selection", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" />
        <input type="checkbox" value="product2" />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<HTMLElement>('div[handle="product1"]')

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
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<HTMLElement>('div[handle="product1"]')

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
        <div handle="product1">
          <input type="checkbox" value="product1" checked />
        </div>
        <div handle="product2">
          <input type="checkbox" value="product2" checked />
        </div>
        <span n-summary-price></span>
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()

    const input = bundle.querySelector<HTMLInputElement>('input[type="checkbox"]')!
    const card = bundle.querySelector<HTMLElement>('div[handle="product1"]')

    // Remove product from selection
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(card?.style.display).not.toBe("none")
  })

  it("updates summary price when variant changes", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })

    const bundle = (
      <nosto-bundle products={products}>
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await waitForRender(bundle)

    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Total: $201.00")

    // Simulate variant change event
    const variantChangeEvent = new CustomEvent<VariantChangeDetail>(EVENT_NAME_VARIANT_CHANGE, {
      detail: {
        variantId: "gid://shopify/ProductVariant/2",
        productId: "gid://shopify/Product/1",
        handle: "product1"
      },
      bubbles: true
    })

    bundle.dispatchEvent(variantChangeEvent)

    expect(summary.textContent).toBe("Total: $221.00")
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
          skuId: "5"
        }
      ],
      "test-result"
    )
  })

  it("uses default template when no summary property is provided", async () => {
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
    expect(summary.textContent).toBe("Total: $201.00")
  })

  it("formats summary with custom summary containing both placeholders", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products} summary="Buy {amount} items for {total}">
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await bundle.connectedCallback()
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Buy 2 items for $201.00")
  })

  // TODO: Add support for pending variant changes in bundle logic and then enable this test
  it.skip("handles variant change events triggered before bundle is initialized", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle products={products}>
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await waitForRender(bundle)
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Total: $271.00")
  })

  it("considers recommended_sku when no variant change is pending", async () => {
    addProductHandlers({
      product1: { product: mockedProducts.product1 },
      product2: { product: mockedProducts.product2 }
    })
    const bundle = (
      <nosto-bundle
        products={
          [
            { handle: "product1", recommended_sku: { id: 3 } },
            { handle: "product2", recommended_sku: { id: 6 } }
          ] as unknown as JSONProduct[]
        }
      >
        <div handle="product1" />
        <div handle="product2" />
        <span n-summary-price></span>
        <input type="checkbox" value="product1" checked />
        <input type="checkbox" value="product2" checked />
      </nosto-bundle>
    ) as Bundle

    await waitForRender(bundle)
    const summary = bundle.querySelector<HTMLSpanElement>("span[n-summary-price]")!
    expect(summary.textContent).toBe("Total: $271.00")
  })
})
