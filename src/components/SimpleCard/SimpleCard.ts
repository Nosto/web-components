import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement, property } from "lit/decorators.js"
import { LitElement, html, css, unsafeCSS } from "lit"
import { logFirstUsage } from "@/logger"
import type { ShopifyProduct } from "@/shopify/types"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { JSONProduct } from "@nosto/nosto-js/client"


/** Event name for the SimpleCard rendered event */
const SIMPLE_CARD_RENDERED_EVENT = "@nosto/SimpleCard/rendered"

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` and renders a card with
 * product image, title, price, and optional brand, discount, and rating information.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
 *
 * {@include ./examples.md}
 *
 * @category Campaign level templating
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show product rating. Defaults to false.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 *
 * @fires @nosto/SimpleCard/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-simple-card")
export class SimpleCard extends LitElement {
  static styles = css`${unsafeCSS(styles)}`

  @property() handle!: string
  @property({ type: Boolean }) alternate?: boolean
  @property({ type: Boolean }) brand?: boolean
  @property({ type: Boolean }) discount?: boolean
  @property({ type: Number }) rating?: number
  @property() sizes?: string

  product?: JSONProduct
  private shopifyProduct?: ShopifyProduct

  /** @hidden */
  productId?: number
  /** @hidden */
  variantId?: number

  constructor() {
    super()
    logFirstUsage()
  }

  async connectedCallback() {
    super.connectedCallback()
    assertRequired(this, "handle")
    await this.loadProductData()
    this.addEventListener("click", this)
    this.addEventListener("variantchange", this)
  }

  protected async updated() {
    if (this.isConnected && this.handle) {
      await this.loadProductData()
    }
  }

  render() {
    if (!this.shopifyProduct) {
      return html`<div>Loading...</div>`
    }
    
    return generateCardHTML(this, this.shopifyProduct)
  }

  private async loadProductData() {
    if (!this.handle) return
    
    try {
      const url = createShopifyUrl(`/products/${this.handle}.js`)
      const response = await getJSON<ShopifyProduct>(url.href, { cached: true })
      this.shopifyProduct = response
      this.productId = response.id
      this.variantId = response.variants[0]?.id
      
      // Trigger re-render
      this.requestUpdate()
      
      // Dispatch rendered event
      this.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true }))
    } catch (error) {
      console.error("Failed to load product:", error)
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        onClick(this, event as MouseEvent)
        break
      case "variantchange":
        onVariantChange(this, event as CustomEvent<VariantChangeDetail>)
    }
  }
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

async function onClick(element: SimpleCard, event: MouseEvent) {
  if (isAddToCartClick(event) && element.productId && element.variantId) {
    event.stopPropagation()
    await addSkuToCart({
      productId: element.productId.toString(),
      skuId: element.variantId.toString()
    })
  }
}

function onVariantChange(element: SimpleCard, event: CustomEvent<VariantChangeDetail>) {
  event.stopPropagation()
  const { variant } = event.detail
  element.variantId = variant.id
  updateSimpleCardContent(element, variant)
}



declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
