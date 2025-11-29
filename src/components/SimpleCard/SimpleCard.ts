import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { ReactiveElement } from "../Element"
import { generateCardHTML } from "./markup"
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
import { EVENT_NAME_VARIANT_CHANGE } from "../VariantSelector/emitVariantChange"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the SimpleCard rendered event */
const SIMPLE_CARD_RENDERED_EVENT = "@nosto/SimpleCard/rendered"

/** Default values for SimpleCard attributes */
let simpleCardDefaults: Partial<Pick<SimpleCard, "brand" | "discount" | "rating" | "imageMode" | "imageSizes">> = {}

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from the Shopify Storefront GraphQL API and renders a card with
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
 * @property {number} [variantId] - The specific variant ID to display. When set, shows this variant's data instead of the default variant.
 * @property {string} [imageMode] - Image display mode. Use "alternate" for hover image swap or "carousel" for image carousel with navigation. Defaults to undefined.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show product rating. Defaults to false.
 * @property {string} [imageSizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 * @property {boolean} [mock] - If true, uses mock data instead of fetching from Shopify. Defaults to false.
 *
 * @fires @nosto/SimpleCard/rendered - Emitted when the component has finished rendering
 */
@customElement("nosto-simple-card", { observe: true })
export class SimpleCard extends ReactiveElement {
  @property(String) handle!: string
  @property(Number) variantId?: number
  @property(String) imageMode?: "alternate" | "carousel"
  @property(Boolean) brand?: boolean
  @property(Boolean) discount?: boolean
  @property(Number) rating?: number
  @property(String) imageSizes?: string
  @property(Boolean) mock?: boolean

  product?: JSONProduct

  /** @hidden */
  productId?: number

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    // Apply default values before rendering
    applySimpleCardDefaults(this)
    assertRequired(this, "handle")
    await this.render()
    this.addEventListener("click", this)
    this.shadowRoot?.addEventListener("click", this)
    this.addEventListener(EVENT_NAME_VARIANT_CHANGE, this)

    // Add scroll listener for carousel to update indicators
    if (this.imageMode === "carousel") {
      this.shadowRoot?.addEventListener("scroll", this, { capture: true })
    }
  }

  async render() {
    await loadAndRenderMarkup(this)
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        onClick(this, event as MouseEvent)
        break
      case EVENT_NAME_VARIANT_CHANGE:
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

/**
 * Sets default values for SimpleCard attributes.
 * These defaults will be applied to all SimpleCard instances created after this function is called.
 *
 * @param defaults - An object containing default values for SimpleCard attributes
 *
 * @example
 * ```typescript
 * import { setSimpleCardDefaults } from '@nosto/web-components'
 *
 * setSimpleCardDefaults({
 *   brand: true,
 *   discount: true,
 *   imageMode: 'alternate'
 * })
 * ```
 */
export function setSimpleCardDefaults(
  defaults: Partial<Pick<SimpleCard, "brand" | "discount" | "rating" | "imageMode" | "imageSizes">>
) {
  simpleCardDefaults = { ...defaults }
}

function applySimpleCardDefaults(element: SimpleCard) {
  // For boolean attributes, only apply default if attribute is not present in HTML
  if (simpleCardDefaults.brand !== undefined && !element.hasAttribute("brand")) {
    element.brand = simpleCardDefaults.brand
  }
  if (simpleCardDefaults.discount !== undefined && !element.hasAttribute("discount")) {
    element.discount = simpleCardDefaults.discount
  }
  // For other attributes, only apply default if not already set (check for both undefined and null)
  if (simpleCardDefaults.rating !== undefined && element.rating === undefined) {
    element.rating = simpleCardDefaults.rating
  }
  if (simpleCardDefaults.imageMode !== undefined && !element.imageMode) {
    element.imageMode = simpleCardDefaults.imageMode
  }
  if (simpleCardDefaults.imageSizes !== undefined && !element.imageSizes) {
    element.imageSizes = simpleCardDefaults.imageSizes
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
