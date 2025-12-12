import { JSONProduct } from "@nosto/nosto-js/client"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { ShopifyProduct } from "@/shopify/graphql/types"
import { formatPrice } from "@/shopify/formatPrice"
import { parseId } from "@/shopify/graphql/utils"

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
 * @property {string} [summary] - Template string for summary display. Use {amount} for product count and {total} for formatted price. Default: "Total: {total}"
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
  @property(String) resultId?: string
  @property(String) summary?: string

  products!: JSONProduct[]
  /** @hidden */
  selectedProducts: ShopifyProduct[] = []
  /** @hidden */
  shopifyProducts: ShopifyProduct[] = []

  async connectedCallback() {
    addListeners(this)
    await fetchShopifyProducts(this)
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
  if (!bundle.products?.length) {
    return
  }
  bundle.toggleAttribute("loading", true)
  const fetchPromises = bundle.products.map(product => getProduct(product.handle))
  const fetchedProducts = await Promise.all(fetchPromises)
  bundle.shopifyProducts = fetchedProducts.filter(p => p !== null)
  bundle.toggleAttribute("loading", false)
  initializeSelectedProducts(bundle)
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

function initializeSelectedProducts(bundle: Bundle) {
  const checkboxes = bundle.querySelectorAll<HTMLInputElement>('input[type="checkbox"][value]')

  bundle.selectedProducts = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkboxChecked => {
      const handle = checkboxChecked.value
      return bundle.shopifyProducts.find(p => p.handle === handle)
    })
    .filter(product => !!product)
}

function formatSummaryTemplate(template: string, amount: number, total: string): string {
  return template.replace(/{amount}/g, amount.toString()).replace(/{total}/g, total)
}

function setSummaryPrice(bundle: Bundle) {
  const summaryElement = bundle.querySelector("[n-summary-price]")
  if (!summaryElement) {
    throw new Error("Element with attribute n-summary-price not found")
  }
  const currencyCode = bundle.shopifyProducts[0]?.price.currencyCode || "USD"
  const totalAmount =
    bundle.selectedProducts.reduce((sum, product) => {
      // TODO use price of selected variant instead
      return sum + Number(product.price.amount)
    }, 0) || 0
  const formatted = formatPrice({ amount: totalAmount.toString(), currencyCode })
  const template = bundle.summary || "Total: {total}"
  const amount = bundle.selectedProducts.length

  summaryElement.textContent = formatSummaryTemplate(template, amount, formatted)
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

function onClick(bundle: Bundle, event: MouseEvent) {
  // ATC click inside the bundle
  if (isAddToCartClick(event)) {
    const payload = bundle.selectedProducts.map(product => {
      return {
        productId: String(parseId(product.id)),
        // TODO use selected variant id instead
        skuId: String(parseId(product.combinedVariants[0].id)),
        quantity: 1
      }
    })
    window.Nosto?.addMultipleProductsToCart(payload, bundle.resultId)
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
      bundle.selectedProducts = bundle.selectedProducts.filter(p => p.handle !== handle)
    } else {
      // Add product to selection
      const product = bundle.shopifyProducts.find(p => p.handle === handle)
      if (product && !bundle.selectedProducts.find(p => p.handle === handle)) {
        bundle.selectedProducts = [...bundle.selectedProducts, product]
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
