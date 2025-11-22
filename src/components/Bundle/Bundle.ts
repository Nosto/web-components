import { JSONProduct } from "@nosto/nosto-js/client"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"

@customElement("nosto-bundle")
export class Bundle extends NostoElement {
  products!: JSONProduct[]
  selectedProducts!: JSONProduct[]

  async connectedCallback() {
    // TODO Sum product prices and render and attach currency code
    this.selectedProducts = this.products
    setSummaryPrice(this)
    this.addEventListener("click", this)
    this.addEventListener("input", this)
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
  console.log("Setting initial bundle summary price")
  const initialPrice = bundle.selectedProducts.reduce((sum, product) => {
    const priceString = String(product.price)?.replace(/[^0-9.-]+/g, "") || "0"
    return sum + parseFloat(priceString)
  }, 0)
  document.querySelector("[n-summary-price]")!.textContent = `Total: ${initialPrice.toFixed(2)}`
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

async function onClick(bundle: Bundle, event: MouseEvent) {
  // ATC click inside the bundle
  if (isAddToCartClick(event)) {
    console.log("Bundle Add to Cart clicked", bundle.selectedProducts)
  }
}

function onChange(bundle: Bundle, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.type === "checkbox" && target.value) {
    const productId = target.value

    const card = bundle.querySelector(`nosto-simple-card[handle="${productId}"]`) as HTMLElement | null
    if (!target.checked) {
      // Remove product from selection
      target.removeAttribute("checked")
      bundle.selectedProducts = bundle.selectedProducts.filter(p => p.id !== productId)
      card?.style.setProperty("display", "none")
      target.setAttribute("checked", "")
    } else {
      // Add product to selection
      const product = bundle.products.find(p => p.id === productId)
      if (product && !bundle.selectedProducts.find(p => p.id === productId)) {
        bundle.selectedProducts = [...bundle.selectedProducts, product]
        card?.style.setProperty("display", "block")
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
