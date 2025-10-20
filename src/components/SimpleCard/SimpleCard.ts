import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import { customElement } from "../decorators"
import { NostoElement } from "../Element"
import type { ShopifyProduct, SimpleProduct, VariantChangeDetail } from "./types"
import { toSimpleProduct } from "./types"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"

const setShadowContent = shadowContentFactory(styles)

/**
 * A custom element that displays a product card using Shopify product data.
 *
 * Can either fetch product data from `/products/<handle>.js` or render with preloaded
 * product data via the `product` property. When both `handle` and `product` are provided,
 * the preloaded `product` data takes precedence.
 *
 * The component renders inside a shadow DOM with encapsulated styles. Styling can be
 * customized using the following CSS custom properties:
 *
 * @category Campaign level templating
 *
 * @property {string} [handle] - The Shopify product handle to fetch data for. Required when product is not provided.
 * @property {SimpleProduct} [product] - Preloaded product data. When provided, no fetch is performed.
 * @property {boolean} [alternate] - Show alternate product image on hover. Defaults to false.
 * @property {boolean} [brand] - Show brand/vendor data. Defaults to false.
 * @property {boolean} [discount] - Show discount data. Defaults to false.
 * @property {string} [sizes] - The sizes attribute for responsive images to help the browser choose the right image size.
 *
 * @example
 * ```html
 * <!-- Fetch product data -->
 * <nosto-simple-card handle="awesome-product" alternate brand discount rating></nosto-simple-card>
 *
 * <!-- Use preloaded product data -->
 * <script>
 *   const product = { id: 123, title: "My Product", url: "/products/my-product", price: 1999 };
 *   document.querySelector('nosto-simple-card').product = product;
 * </script>
 * <nosto-simple-card brand discount></nosto-simple-card>
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

  handle?: string
  product?: SimpleProduct
  alternate?: boolean
  brand?: boolean
  discount?: boolean
  rating?: number
  sizes?: string

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
    // Either handle OR product must be provided
    if (!this.handle && !this.product) {
      throw new Error("Either handle or product property is required.")
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
  element.toggleAttribute("loading", true)
  try {
    let productData: SimpleProduct

    if (element.product) {
      // Use preloaded product data
      productData = element.product
    } else if (element.handle) {
      // Fetch product data and convert to SimpleProduct
      const shopifyProduct = await fetchProductData(element.handle)
      productData = toSimpleProduct(shopifyProduct)
    } else {
      throw new Error("Either handle or product property is required.")
    }

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
