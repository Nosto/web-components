import { JSONProduct } from "@nosto/nosto-js/client"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { ShopifyProduct, VariantChangeDetail } from "@/shopify/graphql/types"
import { formatPrice } from "@/shopify/formatPrice"
import { parseId, toVariantGid } from "@/shopify/graphql/utils"
import { EVENT_NAME_VARIANT_CHANGE } from "../VariantSelector/emitVariantChange"
import { SelectableProduct } from "./types"

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
  #shopifyProducts: SelectableProduct[] = []

  get #selectedProducts(): SelectableProduct[] {
    return this.#shopifyProducts.filter(product => product.selected)
  }

  async connectedCallback() {
    this.#addListeners()
    await this.#fetchShopifyProducts()
    this.dispatchEvent(new CustomEvent(BUNDLE_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  }

  disconnectedCallback() {
    this.#removeListeners()
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        this.#onClick(event as MouseEvent)
        break
      case "input":
        this.#onChange(event as Event)
        break
      case EVENT_NAME_VARIANT_CHANGE:
        this.#onVariantChange(event as CustomEvent<VariantChangeDetail>)
        break
    }
  }

  async #fetchShopifyProducts() {
    if (!this.products?.length) {
      return
    }
    this.toggleAttribute("loading", true)
    await this.#initializeProducts()
    this.#setSummaryPrice()
    this.toggleAttribute("loading", false)
  }

  #addListeners() {
    this.addEventListener("click", this)
    this.addEventListener("input", this)
    this.addEventListener(EVENT_NAME_VARIANT_CHANGE, this)
  }

  #removeListeners() {
    this.removeEventListener("click", this)
    this.removeEventListener("input", this)
    this.removeEventListener(EVENT_NAME_VARIANT_CHANGE, this)
  }

  #getInitialVariant(product: ShopifyProduct) {
    const recommendedSkuId = this.products.find(p => p.handle === product.handle)?.recommended_sku?.id
    if (recommendedSkuId) {
      const gid = toVariantGid(Number(recommendedSkuId))
      const variant = product.combinedVariants.find(variant => variant.id === gid)
      if (variant) {
        return variant
      }
    }
    return product!.combinedVariants.find(v => v.availableForSale) ?? product.combinedVariants[0]
  }

  async #initializeProducts() {
    const fetchPromises = this.products.map(product => getProduct(product.handle))
    const fetchedProducts = await Promise.all(fetchPromises)
    this.#shopifyProducts = fetchedProducts.filter(Boolean).map(product => ({
      ...product!,
      selected: !!this.querySelector<HTMLElement>(`input[type="checkbox"][value="${product!.handle}"]:checked`),
      selectedVariant: this.#getInitialVariant(product!)!
    }))
  }

  #onVariantChange(event: CustomEvent<VariantChangeDetail>) {
    event.stopPropagation()
    const { variantId, productId } = event.detail
    const product = this.#shopifyProducts.find(p => p.id === productId)
    if (product) {
      const variant = product.combinedVariants.find(v => v.id === variantId)
      if (variant) {
        product.selectedVariant = variant
        if (product.selected) {
          this.#setSummaryPrice()
        }
      }
    }
  }

  #setSummaryPrice() {
    const summaryElement = this.querySelector("[n-summary-price]")
    if (!summaryElement) {
      throw new Error("Element with attribute n-summary-price not found")
    }
    const currencyCode = this.#shopifyProducts[0]?.price.currencyCode || "USD"
    const totalAmount = this.#selectedProducts.reduce((sum, product) => {
      return sum + Number(product.selectedVariant.price.amount)
    }, 0)

    const formatted = formatPrice({ amount: totalAmount.toString(), currencyCode })
    const template = this.summary || "Total: {total}"
    const amount = this.#selectedProducts.length

    summaryElement.textContent = formatSummaryTemplate(template, amount, formatted)
  }

  #onClick(event: MouseEvent) {
    // ATC click inside the bundle
    if (isAddToCartClick(event)) {
      const payload = this.#selectedProducts.map(product => ({
        productId: String(parseId(product.id)),
        skuId: String(parseId(product.selectedVariant.id)),
        quantity: 1
      }))
      window.Nosto?.addMultipleProductsToCart(payload, this.resultId)
    }
  }

  #onChange(event: Event) {
    const target = event.target as HTMLInputElement
    if (target.type !== "checkbox") {
      return
    }

    const handle = target.value
    const card = this.querySelector<HTMLElement>(`[handle="${handle}"]`)
    const isCheckboxInsideCard = card?.contains(target)
    if (target.value) {
      const product = this.#shopifyProducts.find(p => p.handle === handle)
      if (!product) {
        return
      }
      product.selected = target.checked
      if (!isCheckboxInsideCard) {
        setCardVisibility(card, target.checked)
      }
      this.#setSummaryPrice()
    }
  }
}

async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  try {
    return await fetchProduct(handle)
  } catch (error) {
    console.error(`Error fetching product with handle ${handle}:`, error)
    return null
  }
}

function formatSummaryTemplate(template: string, amount: number, total: string) {
  return template.replace(/{amount}/g, amount.toString()).replace(/{total}/g, total)
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

function setCardVisibility(card: HTMLElement | null, visible: boolean) {
  if (card) {
    card.style.display = visible ? "block" : "none"
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-bundle": Bundle
  }
}
