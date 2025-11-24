import { JSONProduct } from "@nosto/nosto-js/client"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

/**
 * This component allows users to select multiple products from a bundle and displays
 * the total price. Products can be toggled on/off via checkboxes, and the component
 * automatically updates the summary price and product visibility. The selected products can
 * be added to the cart as a group.
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {JSONProduct[]} products - Array of products in the bundle
 * @property {JSONProduct[]} selectedProducts - Currently selected products in the bundle
 */

@customElement("nosto-bundle")
export class Bundle extends NostoElement {
  products!: JSONProduct[]
  selectedProducts!: JSONProduct[]

  connectedCallback() {
    // TODO Sum product prices and render and attach currency code
    this.selectedProducts = this.products
    setSummaryPrice(this)
    this.addEventListener("click", this)
    this.addEventListener("input", this)
  }

  disconnectedCallback() {
    this.removeEventListener("click", this)
    this.removeEventListener("input", this)
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        onClick(this, event as MouseEvent)
        break
      case "input":
        onChange(this, event as Event)
        break
    }
  }
}

function setSummaryPrice(bundle: Bundle) {
  const currencyCode = bundle.selectedProducts[0]?.price_currency_code || "USD"
  const totalAmount = bundle.selectedProducts.reduce((sum, product) => {
    return sum + product.price
  }, 0)
  const formatted = new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: currencyCode
  }).format(totalAmount)
  const summaryElement = bundle.querySelector("[n-summary-price]")
  summaryElement!.textContent = `Total: ${formatted}`
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

function onClick(bundle: Bundle, event: MouseEvent) {
  // ATC click inside the bundle
  if (isAddToCartClick(event)) {
    console.log("Bundle Add to Cart clicked", bundle.selectedProducts)
  }
}

function onChange(bundle: Bundle, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.type === "checkbox" && target.value) {
    const handle = target.value
    const card = bundle.querySelector<HTMLElement>(`[handle="${handle}"]`)
    if (target.hasAttribute("checked")) {
      // Remove product from selection
      target.removeAttribute("checked")
      bundle.selectedProducts = bundle.selectedProducts.filter(p => p.handle !== handle)
      card?.style.setProperty("display", "none")
    } else {
      // Add product to selection
      const product = bundle.products.find(p => p.handle === handle)
      if (product && !bundle.selectedProducts.find(p => p.handle === handle)) {
        bundle.selectedProducts = [...bundle.selectedProducts, product]
        card?.style.setProperty("display", "block")
        target.setAttribute("checked", "")
      }
    }
    setSummaryPrice(bundle)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-bundle": Bundle
  }
}
