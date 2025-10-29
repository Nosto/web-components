/* eslint-disable @typescript-eslint/no-explicit-any */
import { html, define } from "hybrids"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { getJSON } from "@/utils/fetch"
import type { ShopifyProduct } from "@/shopify/types"
import { addSkuToCart } from "@nosto/nosto-js"
import { JSONProduct } from "@nosto/nosto-js/client"
import { convertProduct } from "../SimpleCard/convertProduct"
import { SimpleProduct } from "../SimpleCard/types"
import styles from "../SimpleCard/styles.css?raw"

/** Event name for the SimpleCard rendered event */
const SIMPLE_CARD_RENDERED_EVENT = "@nosto/SimpleCard/rendered"

function generateCardHTML(host: any, product: SimpleProduct) {
  const hasDiscount = host.discount && product.compare_at_price && product.compare_at_price > product.price

  return html`
    <style>
      ${styles}
    </style>
    <div class="card" part="card">
      <a href="${normalizeUrl(product.url)}" class="link" part="link">
        ${generateImageHTML(host, product)}
        <div class="content" part="content">
          ${host.brand && product.vendor ? html`<div class="brand" part="brand">${product.vendor}</div>` : ""}
          <h3 class="title" part="title">${product.title}</h3>
          <div class="price" part="price">
            <span class="price-current" part="price-current"> ${formatPrice(product.price || 0)} </span>
            ${hasDiscount
              ? html`<span class="price-original" part="price-original"
                  >${formatPrice(product.compare_at_price!)}</span
                >`
              : ""}
          </div>
          ${host.rating ? generateRatingHTML(host.rating) : ""}
        </div>
      </a>
      <div class="slot">
        <slot></slot>
      </div>
    </div>
  `
}

function generateImageHTML(host: any, product: SimpleProduct) {
  const primaryImage = product.media?.[0]?.src || product.images?.[0]
  if (!primaryImage) {
    return html`<div class="image placeholder"></div>`
  }

  const hasAlternate =
    host.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
  const alternateImage = product.media?.[1]?.src || product.images?.[1]

  return html`
    <div class="image ${hasAlternate ? "alternate" : ""}" part="image">
      ${generateNostoImageHTML(primaryImage, product.title, "img primary", host.sizes)}
      ${hasAlternate && alternateImage
        ? generateNostoImageHTML(alternateImage, product.title, "img alternate", host.sizes)
        : ""}
    </div>
  `
}

function normalizeUrl(url: string) {
  if (!url || url.startsWith("//") || !url.startsWith("/")) {
    return url
  }
  return createShopifyUrl(url).toString()
}

function generateNostoImageHTML(src: string, alt: string, className: string, sizes?: string) {
  return html`
    <nosto-image
      src="${normalizeUrl(src)}"
      alt="${alt}"
      width="800"
      loading="lazy"
      class="${className}"
      ${sizes ? html`sizes="${sizes}"` : ""}
    ></nosto-image>
  `
}

function generateRatingHTML(rating: number) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  return html`<div class="rating" part="rating">${starDisplay} (${rating.toFixed(1)})</div>`
}

function formatPrice(price: number) {
  const amount = price / 100
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active ?? "USD"
  }).format(amount)
}

async function fetchProductData(handle: string) {
  const url = createShopifyUrl(`/products/${handle}.js`)
  return getJSON<ShopifyProduct>(url.href, { cached: true })
}

async function loadProductData(host: any) {
  if (!host.handle || host.loading) return

  host.loading = true
  try {
    const productData = await fetchProductData(host.handle)
    host.productId = productData.id
    // Store the raw product data - conversion happens in render
    host.product = productData as unknown as JSONProduct

    host.dispatchEvent(
      new CustomEvent(SIMPLE_CARD_RENDERED_EVENT, {
        bubbles: true,
        cancelable: true
      })
    )
  } catch (error) {
    console.error("Failed to load product data:", error)
  } finally {
    host.loading = false
  }
}

// Hybrids descriptor for SimpleCard
const HybridSimpleCardDescriptor = {
  tag: "nosto-simple-card-hybrid",
  handle: "",
  alternate: false,
  brand: false,
  discount: false,
  rating: 0,
  sizes: "",
  product: undefined,
  productId: 0,
  variantId: 0,
  loading: false,

  render: (host: any) => {
    if (host.loading) {
      return html`<style>
          ${styles}
        </style>
        <div class="card loading">Loading...</div>`
    }

    if (host.product) {
      const normalized = convertProduct(host.product)
      return generateCardHTML(host, normalized)
    }

    return html`<style>
        ${styles}
      </style>
      <div class="card">No product data</div>`
  },

  connect: (host: any) => {
    if (host.handle && !host.product && !host.loading) {
      loadProductData(host).catch(error => console.error("Failed to load product data:", error))
    }

    const clickHandler = async (event: MouseEvent) => {
      if (
        event.target instanceof HTMLElement &&
        event.target.hasAttribute("n-atc") &&
        host.productId &&
        host.variantId
      ) {
        event.stopPropagation()
        await addSkuToCart({
          productId: host.productId.toString(),
          skuId: host.variantId.toString()
        })
      }
    }

    host.addEventListener("click", clickHandler)

    return () => {
      host.removeEventListener("click", clickHandler)
    }
  }
}

// Define the hybrid component
define(HybridSimpleCardDescriptor)

declare global {
  interface HTMLElementTagNameMap {
    "nosto-simple-card-hybrid": HTMLElement & {
      handle: string
      alternate?: boolean
      brand?: boolean
      discount?: boolean
      rating?: number
      sizes?: string
      product?: JSONProduct
      productId?: number
      variantId?: number
      loading?: boolean
    }
  }
}

export { HybridSimpleCardDescriptor }
