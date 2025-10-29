import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement, property } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "@/shopify/types"
import { html } from "@/templating/html"
import type { SimpleVariant, SimpleProduct } from "./types"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"

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
      await this.#loadAndRenderMarkup()
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await this.#loadAndRenderMarkup()
    this.addEventListener("click", this)
    this.addEventListener("variantchange", this)
  }

  handleEvent(event: Event) {
    switch (event.type) {
      case "click":
        this.#onClick(event as MouseEvent)
        break
      case "variantchange":
        this.#onVariantChange(event as CustomEvent<VariantChangeDetail>)
    }
  }

  #isAddToCartClick(event: MouseEvent) {
    return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
  }

  async #onClick(event: MouseEvent) {
    if (this.#isAddToCartClick(event) && this.productId && this.variantId) {
      event.stopPropagation()
      await addSkuToCart({
        productId: this.productId.toString(),
        skuId: this.variantId.toString()
      })
    }
  }

  #onVariantChange(event: CustomEvent<VariantChangeDetail>) {
    event.stopPropagation()
    const { variant } = event.detail
    this.variantId = variant.id
    this.#updateSimpleCardContent(variant)
  }

  async #loadAndRenderMarkup() {
    if (this.product) {
      const normalized = convertProduct(this.product)
      const cardHTML = this.#generateCardHTML(normalized)
      setShadowContent(this, cardHTML.html)
      this.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
    }
    this.toggleAttribute("loading", true)
    try {
      const productData = await this.#fetchProductData(this.handle)
      this.productId = productData.id

      const cardHTML = this.#generateCardHTML(productData)
      setShadowContent(this, cardHTML.html)
      if (!this.product) {
        this.dispatchEvent(new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, { bubbles: true, cancelable: true }))
      }
    } finally {
      this.toggleAttribute("loading", false)
    }
  }

  async #fetchProductData(handle: string) {
    const url = createShopifyUrl(`/products/${handle}.js`)
    return getJSON<ShopifyProduct>(url.href, { cached: true })
  }

  #updateSimpleCardContent(variant: SimpleVariant) {
    this.#updateImages(variant)
    this.#updatePrices(variant)
  }

  #updateImages(variant: SimpleVariant) {
    if (!variant.featured_image) return

    const primaryImgElement = this.shadowRoot!.querySelector(".img.primary") as HTMLElement
    if (primaryImgElement) {
      primaryImgElement.setAttribute("src", this.#normalizeUrl(variant.featured_image.src))
      primaryImgElement.setAttribute("alt", variant.name)
    }

    if (this.alternate) {
      const alternateImgElement = this.shadowRoot!.querySelector(".img.alternate") as HTMLElement
      if (alternateImgElement) {
        alternateImgElement.setAttribute("src", this.#normalizeUrl(variant.featured_image.src))
        alternateImgElement.setAttribute("alt", variant.name)
      }
    }
  }

  #updatePrices(variant: SimpleVariant) {
    const hasDiscount = this.discount && variant.compare_at_price && variant.compare_at_price > variant.price

    const currentPriceElement = this.shadowRoot!.querySelector(".price-current")
    if (currentPriceElement) {
      currentPriceElement.textContent = this.#formatPrice(variant.price || 0)
    }

    const originalPriceElement = this.shadowRoot!.querySelector(".price-original")
    if (hasDiscount && originalPriceElement) {
      originalPriceElement.textContent = this.#formatPrice(variant.compare_at_price!)
    }
  }

  #normalizeUrl(url: string) {
    if (!url || url.startsWith("//") || !url.startsWith("/")) {
      return url
    }
    return createShopifyUrl(url).toString()
  }

  #formatPrice(price: number) {
    // Convert from cents to dollars and format
    const amount = price / 100
    return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
      style: "currency",
      currency: window.Shopify?.currency?.active ?? "USD"
    }).format(amount)
  }

  #generateCardHTML(product: SimpleProduct) {
    const hasDiscount = this.discount && product.compare_at_price && product.compare_at_price > product.price

    return html`
      <div class="card" part="card">
        <a href="${this.#normalizeUrl(product.url)}" class="link" part="link">
          ${this.#generateImageHTML(product)}
          <div class="content" part="content">
            ${this.brand && product.vendor ? html`<div class="brand" part="brand">${product.vendor}</div>` : ""}
            <h3 class="title" part="title">${product.title}</h3>
            <div class="price" part="price">
              <span class="price-current" part="price-current"> ${this.#formatPrice(product.price || 0)} </span>
              ${hasDiscount
                ? html`<span class="price-original" part="price-original"
                    >${this.#formatPrice(product.compare_at_price!)}</span
                  >`
                : ""}
            </div>
            ${this.rating ? this.#generateRatingHTML(this.rating) : ""}
          </div>
        </a>
        <div class="slot">
          <slot></slot>
        </div>
      </div>
    `
  }

  #generateImageHTML(product: SimpleProduct) {
    // Use media objects first, fallback to images array
    const primaryImage = product.media?.[0]?.src || product.images?.[0]
    if (!primaryImage) {
      return html`<div class="image placeholder"></div>`
    }

    const hasAlternate =
      this.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
    const alternateImage = product.media?.[1]?.src || product.images?.[1]

    return html`
      <div class="image ${hasAlternate ? "alternate" : ""}" part="image">
        ${this.#generateNostoImageHTML(primaryImage, product.title, "img primary", this.sizes)}
        ${hasAlternate && alternateImage
          ? this.#generateNostoImageHTML(alternateImage, product.title, "img alternate", this.sizes)
          : ""}
      </div>
    `
  }

  #generateNostoImageHTML(src: string, alt: string, className: string, sizes?: string) {
    return html`
      <nosto-image
        src="${this.#normalizeUrl(src)}"
        alt="${alt}"
        width="800"
        loading="lazy"
        class="${className}"
        ${sizes ? html`sizes="${sizes}"` : ""}
      ></nosto-image>
    `
  }

  #generateRatingHTML(rating: number) {
    // Generate star display based on numeric rating
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const starDisplay =
      "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
    return html`<div class="rating" part="rating">${starDisplay} (${rating.toFixed(1)})</div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": SimpleCard
  }
}
