import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { Bundle } from "@/components/Bundle/Bundle"
import type { JSONProduct } from "@nosto/nosto-js/client"

beforeEach(() => {
  // clean DOM before each test
  document.body.innerHTML = ""
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ""
})

describe("Bundle", () => {
  it("should be defined as a custom element", () => {
    expect(customElements.get("nosto-bundle")).toBeDefined()
  })
  it("initializes selectedProducts and updates summary on connectedCallback", () => {
    const bundle = document.createElement("nosto-bundle") as unknown as Bundle
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]
    bundle.products = products

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    document.body.appendChild(bundle) // triggers connectedCallback

    expect(bundle.selectedProducts).toHaveLength(2)
    expect(summary.textContent).toBe("Total: $15.00")
  })

  it("removes product from selection when checkbox with checked attribute is inputted", () => {
    const bundle = document.createElement("nosto-bundle") as unknown as Bundle
    const products = [
      { handle: "a", price: 10, price_currency_code: "USD" },
      { handle: "b", price: 5, price_currency_code: "USD" }
    ] as JSONProduct[]

    bundle.products = products
    bundle.selectedProducts = [...products]

    const cardA = document.createElement("nosto-simple-card")
    cardA.setAttribute("handle", "a")
    cardA.style.display = "block"
    bundle.appendChild(cardA)

    const summary = document.createElement("span")
    summary.setAttribute("n-summary-price", "")
    bundle.appendChild(summary)

    const input = document.createElement("input")
    input.type = "checkbox"
    input.value = "a"
    input.setAttribute("checked", "")
    bundle.appendChild(input)

    document.body.appendChild(bundle) // attach to run connectedCallback listeners

    // dispatch input event
    input.dispatchEvent(new Event("input", { bubbles: true }))

    expect(bundle.selectedProducts.find((p: JSONProduct) => p.handle === "a")).toBeUndefined()
    expect(cardA.style.display).toBe("none")
    expect(summary.textContent).toBe("Total: $5.00")
  })
})
