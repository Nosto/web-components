import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct } from "./types"
import { generateCardHTML } from "./markup"
import { cardStyles } from "./styles"
import type { VariantChangeDetail } from "./types"

// Cache the stylesheet for reuse across component instances
let cachedStyleSheet: CSSStyleSheet | null = null

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Fetches product data from `/products/<handle>.js` and renders a card with
 * product image, title, price, and optional brand, discount, and rating information.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
 *
 * @csspart host - The host element styles
 * @cssprop --simple-card-border - Border color (default: #e1e1e1)
 * @cssprop --simple-card-bg - Background color (default: white)
 * @cssprop --simple-card-hover-shadow - Box shadow on hover (default: 0 4px 12px rgba(0, 0, 0, 0.1))
 * @cssprop --simple-card-loading-opacity - Opacity when loading (default: 0.7)
 * @cssprop --simple-card-border-radius - Border radius (default: 8px)
 * @cssprop --simple-card-content-padding - Content area padding (default: 1rem)
 * @cssprop --simple-card-brand-color - Brand text color (default: #666)
 * @cssprop --simple-card-title-color - Title text color (default: inherit)
 * @cssprop --simple-card-link-color - Link color (default: #333)
 * @cssprop --simple-card-link-hover-color - Link hover color (default: #0066cc)
 * @cssprop --simple-card-price-color - Current price color (default: inherit)
 * @cssprop --simple-card-price-original-color - Original price color (default: #999)
 * @cssprop --simple-card-discount-bg - Discount badge background (default: #e74c3c)
 * @cssprop --simple-card-discount-color - Discount badge text color (default: white)
 *
 * @property {string} handle - The Shopify product handle to fetch data for. Required.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {boolean} [rating] - Show product rating. Defaults to false.
 *
 * @example
 * ```html
 * <nosto-simple-card handle="awesome-product" alternate brand discount rating></nosto-simple-card>
 * ```
 */
@customElement("nosto-simple-card", { observe: true })
export class SimpleCard extends NostoElement {
  /** @private */
  static attributes = {
    handle: String,
    alternate: Boolean,
    brand: Boolean,
    discount: Boolean,
    rating: Number
  }

  handle!: string
  alternate?: boolean
  brand?: boolean
  discount?: boolean
  rating?: number

  /** Current product data */
  currentProduct: ShopifyProduct | null = null

  /** @private Bound event handler for cleanup */
  private boundHandleVariantChange: EventListener

  constructor() {
    super()
    this.attachShadow({ mode: "open" })
    this.boundHandleVariantChange = this.handleVariantChange.bind(this)
  }

  async attributeChangedCallback() {
    if (this.isConnected) {
      await loadAndRenderMarkup(this)
    }
  }

  async connectedCallback() {
    assertRequired(this, "handle")
    await loadAndRenderMarkup(this)
    this.addEventListener("variantchange", this.boundHandleVariantChange)
  }

  disconnectedCallback() {
    this.removeEventListener("variantchange", this.boundHandleVariantChange)
  }

  /** @private Handle variant change events from VariantSelector */
  private async handleVariantChange(event: Event) {
    event.stopPropagation()
    const customEvent = event as CustomEvent<VariantChangeDetail>
    const { variant } = customEvent.detail

    // Update current product data and re-render with variant-specific data
    if (this.currentProduct) {
      this.currentProduct = {
        ...this.currentProduct,
        // Update price with variant price
        price: variant.price,
        compare_at_price: variant.compare_at_price,
        // Update featured image if variant has one
        featured_image: variant.featured_image || this.currentProduct.featured_image,
        // Update images array with variant image if available
        images: variant.featured_image
          ? [variant.featured_image, ...this.currentProduct.images.filter(img => img !== variant.featured_image)]
          : this.currentProduct.images
      }
    }

    await this.updateCardContent()
  }

  /** @private Update card content with current product data */
  private async updateCardContent() {
    if (!this.currentProduct || !this.shadowRoot) return

    // Update images efficiently using querySelector
    this.updateImages()

    // Update prices efficiently using querySelector
    this.updatePrices()
  }

  /** @private Update image elements without full re-render */
  private updateImages() {
    if (!this.currentProduct || !this.shadowRoot) return

    const product = this.currentProduct
    const primaryImage = product.media?.[0]?.src || product.images?.[0]

    // Update primary image
    const primaryImgElement = this.shadowRoot.querySelector(".simple-card__img--primary") as HTMLElement
    if (primaryImgElement && primaryImage) {
      primaryImgElement.setAttribute("src", primaryImage)
      primaryImgElement.setAttribute("alt", product.title)
    }

    // Handle alternate image
    const hasAlternate =
      this.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
    const alternateImage = product.media?.[1]?.src || product.images?.[1]
    const imageContainer = this.shadowRoot.querySelector(".simple-card__image")

    if (hasAlternate && alternateImage) {
      // Add or update alternate image
      imageContainer?.classList.add("simple-card__image--alternate")
      let alternateImgElement = this.shadowRoot.querySelector(".simple-card__img--alternate") as HTMLElement

      if (!alternateImgElement) {
        // Create alternate image if it doesn't exist
        alternateImgElement = document.createElement("nosto-image")
        alternateImgElement.className = "simple-card__img simple-card__img--alternate"
        imageContainer?.appendChild(alternateImgElement)
      }

      alternateImgElement.setAttribute("src", alternateImage)
      alternateImgElement.setAttribute("alt", product.title)
      alternateImgElement.setAttribute("width", "300")
      alternateImgElement.setAttribute("aspect-ratio", String(product.media?.[1]?.aspect_ratio || 1))
      alternateImgElement.setAttribute("loading", "lazy")
    } else {
      // Remove alternate image if not needed
      imageContainer?.classList.remove("simple-card__image--alternate")
      const alternateImgElement = this.shadowRoot.querySelector(".simple-card__img--alternate")
      alternateImgElement?.remove()
    }
  }

  /** @private Update price elements without full re-render */
  private updatePrices() {
    if (!this.currentProduct || !this.shadowRoot) return

    const product = this.currentProduct
    const hasDiscount = this.discount && product.compare_at_price && product.compare_at_price > product.price

    // Update current price
    const currentPriceElement = this.shadowRoot.querySelector(".simple-card__price-current")
    if (currentPriceElement) {
      currentPriceElement.textContent = ` ${this.formatPrice(product.price || 0)} `
    }

    // Handle original/discount price
    const originalPriceElement = this.shadowRoot.querySelector(".simple-card__price-original")

    if (hasDiscount) {
      if (originalPriceElement) {
        // Update existing original price
        originalPriceElement.textContent = this.formatPrice(product.compare_at_price!)
      } else {
        // Create original price element
        const priceContainer = this.shadowRoot.querySelector(".simple-card__price")
        if (priceContainer) {
          const originalPrice = document.createElement("span")
          originalPrice.className = "simple-card__price-original"
          originalPrice.textContent = this.formatPrice(product.compare_at_price!)
          priceContainer.appendChild(originalPrice)
        }
      }
    } else {
      // Remove original price if no discount
      originalPriceElement?.remove()
    }
  }

  /** @private Format price using Shopify locale settings */
  private formatPrice(price: number): string {
    const amount = price / 100
    return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
      style: "currency",
      currency: window.Shopify?.currency?.active ?? "USD"
    }).format(amount)
  }
}

async function loadAndRenderMarkup(element: SimpleCard) {
  element.toggleAttribute("loading", true)
  try {
    const productData = await fetchProductData(element.handle)
    element.currentProduct = productData

    const cardHTML = generateCardHTML(element, productData)

    // Use constructible stylesheets if supported, fallback to inline styles
    if ("adoptedStyleSheets" in element.shadowRoot!) {
      if (!cachedStyleSheet) {
        cachedStyleSheet = new CSSStyleSheet()
        await cachedStyleSheet.replace(cardStyles)
      }
      element.shadowRoot!.adoptedStyleSheets = [cachedStyleSheet]
      element.shadowRoot!.innerHTML = cardHTML.html
    } else {
      element.shadowRoot!.innerHTML = `
        <style>${cardStyles}</style>
        ${cardHTML.html}
      `
    }
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
