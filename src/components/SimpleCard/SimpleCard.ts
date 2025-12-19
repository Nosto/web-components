import { assertRequired } from "@/utils/assertRequired"
import { customElement, property } from "../decorators"
import { ReactiveElement } from "../Element"
import { generateCardHTML } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/graphql/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { applyDefaults } from "@/utils/applyDefaults"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"
import { fetchProduct } from "@/shopify/graphql/fetchProduct"
import { parseId } from "@/shopify/graphql/utils"
import { handleIndicatorClick, onCarouselScroll } from "./carousel"
import { mockProduct } from "./mockProduct"
import { EVENT_NAME_VARIANT_CHANGE } from "../VariantSelector/emitVariantChange"

const setShadowContent = shadowContentFactory(styles)

/** Event name for the SimpleCard rendered event */
const SIMPLE_CARD_RENDERED_EVENT = "@nosto/SimpleCard/rendered"

type DefaultProps = Pick<SimpleCard, "imageMode" | "brand" | "discount" | "rating" | "imageSizes" | "mock">

/** Default values for SimpleCard attributes */
let simpleCardDefaults: DefaultProps = {}

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

  #productId?: number

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
  }

  async connectedCallback() {
    // Apply default values before rendering
    applyDefaults(this, simpleCardDefaults as this)
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

  disconnectedCallback() {
    this.removeEventListener("click", this)
    this.shadowRoot?.removeEventListener("click", this)
    this.removeEventListener(EVENT_NAME_VARIANT_CHANGE, this)

    if (this.imageMode === "carousel") {
      this.shadowRoot?.removeEventListener("scroll", this, { capture: true })
    }
  }

  async render() {
    if (this.product) {
      const normalized = convertProduct(this.product)
      const cardHTML = generateCardHTML(this, normalized)
      setShadowContent(this, cardHTML.html)
      this.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    }
    this.toggleAttribute("loading", true)
    try {
      const productData = this.mock ? mockProduct : await fetchProduct(this.handle)
      this.#productId = parseId(productData.id)

      const cardHTML = generateCardHTML(this, productData)
      setShadowContent(this, cardHTML.html)
      if (!this.product) {
        this.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
      }
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        this.#onClick(event as MouseEvent)
        break
      case EVENT_NAME_VARIANT_CHANGE:
        this.#onVariantChange(event as CustomEvent<VariantChangeDetail>)
        break
      case "scroll":
        onCarouselScroll(this, event)
        break
    }
  }

  async #onClick(event: MouseEvent) {
    if (isCarouselIndicatorClick(event)) {
      event.preventDefault()
      event.stopPropagation()
      handleIndicatorClick(this, event)
      return
    }

    if (isAddToCartClick(event) && this.#productId && this.variantId) {
      event.stopPropagation()
      await addSkuToCart({
        productId: this.#productId.toString(),
        skuId: this.variantId.toString()
      })
    }
  }

  #onVariantChange(event: CustomEvent<VariantChangeDetail>) {
    const { productId, variantId, handle } = event.detail
    const selectedProductId = parseId(productId)
    const selectedVariantId = parseId(variantId)
    if (this.#productId === selectedProductId && this.variantId === selectedVariantId) {
      return
    }
    this.#productId = selectedProductId
    this.variantId = selectedVariantId
    if (handle && handle !== this.handle) {
      this.handle = handle
    }
  }
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

function isCarouselIndicatorClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.classList.contains("carousel-indicator")
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
export function setSimpleCardDefaults(defaults: DefaultProps) {
  simpleCardDefaults = { ...defaults }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
