import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "@/shopify/types"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"
import { mockProduct } from "./mockProduct"

const setShadowContent = shadowContentFactory(styles)

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
 * @property {boolean} [mock] - If true, uses mock data instead of fetching from Shopify. Defaults to false.
 *
 * @fires @nosto/SimpleCard/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-simple-card", { observe: true })
export class SimpleCard extends NostoElement {
  @property(String) handle!: string
  @property(Boolean) alternate?: boolean
  @property(Boolean) brand?: boolean
  @property(Boolean) discount?: boolean
  @property(Number) rating?: number
  @property(String) sizes?: string
  @property(Boolean) mock?: boolean

  product?: JSONProduct

  /** @hidden */
  productId?: number
  /** @hidden */
  variantId?: number

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async attributeChangedCallback(_: string, oldValue: string | null, newValue: string | null) {
    if (this.isConnected && oldValue !== newValue) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    if (!this.mock) {
      assertRequired(this, "handle")
    }
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
  if (element.mock) {
    const cardHTML = generateCardHTML(element, mockProduct)
    setShadowContent(element, cardHTML.html)
    element.dispatchEvent(
      new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true, detail: { mock: true } })
    )
    return
  }
  if (element.product) {
    const normalized = convertProduct(element.product)
    const cardHTML = generateCardHTML(element, normalized)
    setShadowContent(element, cardHTML.html)
    element.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  }
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle)
    element.productId = productData.id

    const cardHTML = generateCardHTML(element, productData)
    setShadowContent(element, cardHTML.html)
    if (!element.product) {
      element.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`/products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
