/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { html, define } from "hybrids"
import { assertRequired } from "@/utils/assertRequired"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import type { ShopifyProduct } from "@/shopify/types"
import { generateCardHTML, updateSimpleCardContent } from "./markup"
import styles from "./styles.css?raw"
import type { VariantChangeDetail } from "@/shopify/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { shadowContentFactory } from "@/utils/shadowContentFactory"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "./convertProduct"
import { logFirstUsage } from "@/logger"

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
const SimpleCard = {
  tag: "nosto-simple-card",
  handle: "",
  alternate: false,
  brand: false,
  discount: false,
  rating: 0,
  sizes: "",
  product: undefined,
  productId: 0,
  variantId: 0,

  render: () => html`<slot></slot>`,

  connect: (host: any) => {
    logFirstUsage()

    // Create shadow DOM
    if (!host.shadowRoot) {
      host.attachShadow({ mode: "open" })
    }

    const handleEvent = (event: Event) => {
      switch (event.type) {
        case "click":
          onClick(host, event as MouseEvent)
          break
        case "variantchange":
          onVariantChange(host, event as CustomEvent<VariantChangeDetail>)
      }
    }

    const init = async () => {
      assertRequired(host, "handle")
      await loadAndRenderMarkup(host)
      host.addEventListener("click", handleEvent)
      host.addEventListener("variantchange", handleEvent)
    }

    // Watch for attribute changes
    const observer = new MutationObserver(() => {
      if (host.isConnected) {
        loadAndRenderMarkup(host).catch(console.error)
      }
    })

    observer.observe(host, {
      attributes: true,
      attributeFilter: ["handle", "alternate", "brand", "discount", "rating", "sizes"]
    })

    init().catch(console.error)

    return () => {
      observer.disconnect()
      host.removeEventListener("click", handleEvent)
      host.removeEventListener("variantchange", handleEvent)
    }
  }
}

function isAddToCartClick(event: MouseEvent) {
  return event.target instanceof HTMLElement && event.target.hasAttribute("n-atc")
}

async function onClick(element: any, event: MouseEvent) {
  if (isAddToCartClick(event) && element.productId && element.variantId) {
    event.stopPropagation()
    await addSkuToCart({
      productId: element.productId.toString(),
      skuId: element.variantId.toString()
    })
  }
}

function onVariantChange(element: any, event: CustomEvent<VariantChangeDetail>) {
  event.stopPropagation()
  const { variant } = event.detail
  element.variantId = variant.id
  updateSimpleCardContent(element, variant)
}

async function loadAndRenderMarkup(element: any) {
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

// Define the hybrid component
define(SimpleCard)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card": HTMLElement & {
      handle: string
      alternate?: boolean
      brand?: boolean
      discount?: boolean
      rating?: number
      sizes?: string
      product?: JSONProduct
      productId?: number
      variantId?: number
    }
  }
}

export { SimpleCard }
