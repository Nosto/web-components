import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "@/shopify/types"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"

const setShadowContent = shadowContentFactory(styles)

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` and renders a card with
 * product image, title, price, and optional brand, discount, and rating information.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
 *
 * @category Campaign level templating
 *
 * @attribute {string} handle - The Shopify product handle to fetch data for. Required.
 * @attribute {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @attribute {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @attribute {boolean} [discount] - Show discount data. Defaults to false.
 * @attribute {boolean} [rating] - Show product rating. Defaults to false.
 * @attribute {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 *
 * @example
 * ```html
 * <nosto-simple-card handle="awesome-product" alternate brand discount rating></nosto-simple-card>
 * ```
 */
@customElement("nosto-simple-card", { observe: true })
export class SimpleCard extends NostoElement {
  /** @private */
  static properties = {
    handle: String,
    alternate: Boolean,
    brand: Boolean,
    discount: Boolean,
    rating: Number,
    sizes: String
  }

  handle!: string
  alternate?: boolean
  brand?: boolean
  discount?: boolean
  rating?: number
  sizes?: string

  product?: JSONProduct

  /** @hidden */
  productId?: number
  /** @hidden */
  variantId?: number

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback() {
    if (this.isConnected) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
    this.addEventListener("click", this)
    this.addEventListener("variantchange", this)
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

async function loadAndRenderMarkup(element: SimpleCard) {
  if (element.product) {
    const normalized = convertProduct(element.product)
    const cardHTML = generateCardHTML(element, normalized)
    setShadowContent(element, cardHTML.html)
  }
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle)
    element.productId = productData.id

    const cardHTML = generateCardHTML(element, productData)
    setShadowContent(element, cardHTML.html)
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
