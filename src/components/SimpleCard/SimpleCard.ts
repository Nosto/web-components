import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/graphql/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { parseId, toHandle } from "@/shopify/graphql/utils"
import { handleIndicatorClick, onCarouselScroll } from "./carousel"
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
 * @property {boolean} [carousel] - Show image carousel with arrow navigation. Defaults to false.
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
  @property(Boolean) carousel?: boolean
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
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
    this.addEventListener("click", this)
    this.shadowRoot?.addEventListener("click", this)
    this.addEventListener("variantchange", this)

    // Add scroll listener for carousel to update indicators
    if (this.carousel) {
      this.shadowRoot?.addEventListener("scroll", this, { capture: true })
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        onClick(this, event as MouseEvent)
        break
      case "variantchange":
        onVariantChange(this, event as CustomEvent<VariantChangeDetail>)
        break
      case "scroll":
        onCarouselScroll(this, event)
        break
    }
  }
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

function isCarouselIndicatorClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.classList.contains("carousel-indicator")
}

async function onClick(element: SimpleCard, event: MouseEvent) {
  if (isCarouselIndicatorClick(event)) {
    event.preventDefault()
    event.stopPropagation()
    handleIndicatorClick(element, event)
    return
  }

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
  element.productId = parseId(variant.product.id)
  element.variantId = parseId(variant.id)
  const handle = toHandle(variant.product.onlineStoreUrl)
  if (handle && handle !== element.handle) {
    element.handle = handle
  } else {
    updateSimpleCardContent(element, variant)
  }
}

async function loadAndRenderMarkup(element: SimpleCard) {
  if (element.product) {
    const normalized = convertProduct(element.product)
    const cardHTML = generateCardHTML(element, normalized)
    setShadowContent(element, cardHTML.html)
    element.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
  }
  element.toggleAttribute("loading", true)
  try {
    const productData = element.mock ? mockProduct : await fetchProduct(element.handle)
    element.productId = parseId(productData.id)

    const cardHTML = generateCardHTML(element, productData)
    setShadowContent(element, cardHTML.html)
    if (!element.product) {
      element.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    }
  } finally {
    element.toggleAttribute("loading", false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
