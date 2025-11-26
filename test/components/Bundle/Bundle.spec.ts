import { describe, it, expect } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import { SimpleCard } from "@/components/SimpleCard/SimpleCard"
import { element } from "../../utils/element"
import { mockSimpleCardProduct } from "@/mock/products"
import type { JSONProduct } from "@nosto/nosto-js/client"
import { addProductHandlers } from "../../utils/addProductHandlers"

describe("Bundle", () => {
  const mockProduct = mockSimpleCardProduct
  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundle")).toBeDefined()
  })

  it("initializes selectedProducts and updates summary on connectedCallback", () => {
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" checked />
      </nosto-bundle>
    `
    bundle.products = products

    const summary = bundle.querySelector("span[n-summary-price]") as HTMLSpanElement

    document.body.appendChild(bundle) // triggers connectedCallback

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $15.00")
  })

  it("removes product from selection when checkbox with checked attribute is inputted", () => {
    addProductHandlers({
      a: { product: mockProduct }
    })
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <nosto-simple-card handle="a"></nosto-simple-card>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" checked />
      </nosto-bundle>
    `
    bundle.products = products

    bundle.selectedProducts = [...products]

    const summary = bundle.querySelector("span[n-summary-price]") as HTMLSpanElement

    const input = bundle.querySelector('input[type="checkbox"]') as HTMLInputElement

    document.body.appendChild(bundle)

    // dispatch input event
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find((p: JSONProduct) => p.handle === "a")).toBeUndefined()
    expect(summary.textContent).toBe("Total: $5.00")
  })

  it("adds product to selection when checkbox without checked attribute is inputted", () => {
    addProductHandlers({
      a: { product: mockProduct },
      b: { product: mockProduct }
    })
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <nosto-simple-card handle="a"></nosto-simple-card>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" />
      </nosto-bundle>
    `
    bundle.products = products

    bundle.selectedProducts = [products[1]] // Only 'b' selected initially

    const summary = bundle.querySelector("span[n-summary-price]") as HTMLSpanElement
    const input = bundle.querySelector('input[type="checkbox"]') as HTMLInputElement

    document.body.appendChild(bundle)

    // dispatch input event to add product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find((p: JSONProduct) => p.handle === "a")).toBeTruthy()
    expect(input.checked).toBe(true)
    expect(summary.textContent).toBe("Total: $15.00")
  })

  it("calculates correct total for multiple selected products", () => {
    const products = [
      { handle: "a", price: 10.5, price_currency_code: "USD" },
      { handle: "b", price: 5.25, price_currency_code: "USD" },
      { handle: "c", price: 15.75, price_currency_code: "USD" }
    ] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <span n-summary-price=""></span>
      </nosto-bundle>
    `
    bundle.products = products

    document.body.appendChild(bundle)

    const summary = bundle.querySelector("span[n-summary-price]") as HTMLSpanElement
    expect(summary.textContent).toBe("Total: $31.50")
  })

  it("does not add duplicate product when already selected", () => {
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <nosto-simple-card handle="a"></nosto-simple-card>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" checked />
      </nosto-bundle>
    `
    bundle.products = products

    const input = bundle.querySelector('input[type="checkbox"]') as HTMLInputElement
    const summary = bundle.querySelector("span[n-summary-price]") as HTMLSpanElement

    document.body.appendChild(bundle)

    // Try to add already selected product
    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $15.00")
  })

  it("handles empty selectedProducts array", () => {
    const products = [{ handle: "a", price: 10, price_currency_code: "USD" }] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" />
      </nosto-bundle>
    `
    bundle.products = products

    document.body.appendChild(bundle)

    // Manually trigger summary update
    const input = bundle.querySelector('input[type="checkbox"]') as HTMLInputElement

    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))
    const summary = bundle.querySelector("span[n-summary-price]") as HTMLSpanElement
    expect(summary.textContent).toBe("Total: $0.00")
  })

  it("shows card when product is added to selection", async () => {
    const products = [{ handle: "a", price: 10, price_currency_code: "USD" }] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <nosto-simple-card handle="a"></nosto-simple-card>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" />
      </nosto-bundle>
    `
    bundle.products = products

    document.body.appendChild(bundle)

    const input = bundle.querySelector('input[type="checkbox"]') as HTMLInputElement
    const cardA = bundle.querySelector('nosto-simple-card[handle="a"]') as SimpleCard

    input.checked = true
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(cardA.style.display).toBe("block")
  })

  it("hides card when product is removed from selection", async () => {
    const products = [{ handle: "a", price: 10, price_currency_code: "USD" }] as JSONProduct[]
    const bundle = element<Bundle>`
      <nosto-bundle>
        <nosto-simple-card handle="a"></nosto-simple-card>
        <span n-summary-price=""></span>
        <input type="checkbox" value="a" checked />
      </nosto-bundle>
    `
    bundle.products = products

    document.body.appendChild(bundle)

    const input = bundle.querySelector('input[type="checkbox"]') as HTMLInputElement
    const cardA = bundle.querySelector('nosto-simple-card[handle="a"]') as SimpleCard

    // Remove product from selection
    input.checked = false
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(cardA.style.display).toBe("none")
  })
})
