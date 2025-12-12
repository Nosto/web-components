import { JSONProduct } from "@nosto/nosto-js/client"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { ShopifyProduct, VariantChangeDetail } from "@/shopify/graphql/types"
import { formatPrice } from "@/shopify/formatPrice"
import { parseId } from "@/shopify/graphql/utils"
import { EVENT_NAME_VARIANT_CHANGE } from "../VariantSelector/emitVariantChange"
import { SelectedProduct } from "./types"

/** Event name for the Bundle rendered event */
const BUNDLE_RENDERED_EVENT = "@nosto/Bundle/rendered"

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

  products!: JSONProduct[]
  /** @hidden */
  selectedProducts: SelectedProduct[] = []
  /** @hidden */
  shopifyProducts: ShopifyProduct[] = []

  async connectedCallback() {
    addListeners(this)
    await fetchShopifyProducts(this)
    this.dispatchEvent(new CustomEvent(BUNDLE_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  }

  disconnectedCallback() {
    removeListeners(this)
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        onClick(this, event as MouseEvent)
        break
      case "input":
        onChange(this, event as Event)
        break
      case EVENT_NAME_VARIANT_CHANGE:
        onVariantChange(this, event as CustomEvent<VariantChangeDetail>)
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
  bundle.addEventListener(EVENT_NAME_VARIANT_CHANGE, bundle)
}

function removeListeners(bundle: Bundle) {
  bundle.removeEventListener("click", bundle)
  bundle.removeEventListener("input", bundle)
  bundle.removeEventListener(EVENT_NAME_VARIANT_CHANGE, bundle)
}

function initializeSelectedProducts(bundle: Bundle) {
  const checkedProducts = Array.from(bundle.querySelectorAll<HTMLInputElement>('input[type="checkbox"][value]')).filter(
    checkbox => checkbox.checked
  )

  bundle.selectedProducts = checkedProducts
    .map(checkboxChecked => {
      const handle = checkboxChecked.value
      return bundle.shopifyProducts.find(p => p.handle === handle)
    })
    .filter(product => !!product)
    .map(product => ({
      ...product,
      selectedVariant: product.combinedVariants[0]
    }))
}

function onVariantChange(bundle: Bundle, event: CustomEvent<VariantChangeDetail>) {
  event.stopPropagation()
  const { variant } = event.detail
  const matchedSelectedProduct = bundle.selectedProducts.find(p => p.id === variant.product.id)
  if (matchedSelectedProduct) {
    matchedSelectedProduct.price = variant.price
    matchedSelectedProduct.compareAtPrice = variant.compareAtPrice || null
    matchedSelectedProduct.selectedVariant = variant
    setSummaryPrice(bundle)
  }
}

function setSummaryPrice(bundle: Bundle) {
  const summaryElement = bundle.querySelector("[n-summary-price]")
  if (!summaryElement) {
    throw new Error("Element with attribute n-summary-price not found")
  }
  const currencyCode = bundle.shopifyProducts[0]?.price.currencyCode || "USD"
  const totalAmount =
    bundle.selectedProducts.reduce((sum, product) => {
      return sum + Number(product.price.amount)
    }, 0) || 0
  const formatted = formatPrice({ amount: totalAmount.toString(), currencyCode })
  summaryElement.textContent = `Total: ${formatted}`
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
        skuId: String(parseId(product.selectedVariant.id)),
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
        const selectedProduct = {
          ...product,
          selectedVariant: product.combinedVariants[0]
        }
        bundle.selectedProducts = [...bundle.selectedProducts, selectedProduct]
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
