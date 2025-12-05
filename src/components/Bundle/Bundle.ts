import { JSONProduct } from "@nosto/nosto-js/client"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { ShopifyProduct } from "@/shopify/graphql/types"

/**
 * This component allows users to select multiple products from a bundle and displays
 * the total price. Products can be toggled on/off via checkboxes, and the component
 * automatically updates the summary price and product visibility. The selected products can
 * be added to the cart as a group.
 *
 *
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {JSONProduct[]} products - Array of products in the bundle
 *
 * @remarks
 *
 * ## Required elements
 *
 * The component requires the following attribute within a child element to function correctly:
 *
 * - `n-summary-price`: An element (e.g., `<span>`, `<div>`) where the total price of selected products will be displayed.
 * Example: `<span n-summary-price></span>`
 */

@customElement("nosto-bundle")
export class Bundle extends NostoElement {
  products!: JSONProduct[]
  /** @hidden */
  selectedProducts?: ShopifyProduct[]
  /** @hidden */
  shopifyProducts?: ShopifyProduct[]

  async connectedCallback() {
    this.selectedProducts = []
    await fetchShopifyProducts(this)
    addListeners(this)
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

async function fetchShopifyProducts(bundle: Bundle) {
  bundle.shopifyProducts = []
  if (!bundle.products || bundle.products.length === 0) {
    return
  }
  bundle.toggleAttribute("loading", true)
  for (const product of bundle.products) {
    const fetchedProduct = await getProduct(product.handle)
    if (fetchedProduct) {
      bundle.shopifyProducts.push(fetchedProduct)
      bundle.selectedProducts!.push(fetchedProduct)
    }
  }
  bundle.toggleAttribute("loading", false)
  setSummaryPrice(bundle)
}

async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    return await fetchProduct(handle)
  } catch (error) {
    console.error(`Error fetching product with handle ${handle}:`, error)
    return null
  }
}

function addListeners(bundle: Bundle) {
  bundle.addEventListener("click", bundle)
  bundle.addEventListener("input", bundle)
}

function setSummaryPrice(bundle: Bundle) {
  const currencyCode = bundle.selectedProducts?.[0]?.price.currencyCode || "USD"
  const totalAmount =
    bundle.selectedProducts?.reduce((sum, product) => {
      return sum + Number(product.price.amount)
    }, 0) || 0
  const formatted = new Intl.NumberFormat("en-US", {
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

function setCardVisibility(card: HTMLElement | null, visible: boolean) {
  if (card) {
    card.style.display = visible ? "block" : "none"
  }
}

function onChange(bundle: Bundle, event: Event) {
  const target = event.target as HTMLInputElement
  if (target.type !== "checkbox") {
    return
  }

  const handle = target.value
  const card = bundle.querySelector<HTMLElement>(`[handle="${handle}"]`)
  const isCheckboxInsideCard = card?.contains(target)
  if (target.value) {
    if (!target.checked) {
      // Remove product from selection
      target.removeAttribute("checked")
      bundle.selectedProducts = bundle.selectedProducts?.filter(p => p.handle !== handle)
    } else {
      // Add product to selection
      const product = bundle.shopifyProducts?.find(p => p.handle === handle)
      if (product && !bundle.selectedProducts?.find(p => p.handle === handle)) {
        bundle.selectedProducts = [...(bundle.selectedProducts ?? []), product]
        target.setAttribute("checked", "")
      }
    }
    if (!isCheckboxInsideCard) {
      setCardVisibility(card, target.checked)
    }
    setSummaryPrice(bundle)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-bundle": Bundle
  }
}
