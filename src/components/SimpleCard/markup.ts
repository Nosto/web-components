import { html } from "@/templating/html"
import type { ShopifyProduct, ShopifyVariant } from "./types"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct) {
  const hasDiscount = element.discount && product.compare_at_price && product.compare_at_price > product.price

  return html`
    <div class="card" part="card">
      <a href="${product.url}" class="link" part="link">
        ${generateImageHTML(element, product)}
        <div class="content" part="content">
          ${element.brand && product.vendor ? html`<div class="brand" part="brand">${product.vendor}</div>` : ""}
          <div class="title" part="title">${product.title}</div>
          <div class="price" part="price">
            <span class="price-current" part="price-current"> ${formatPrice(product.price || 0)} </span>
            ${hasDiscount
              ? html`<span class="price-original" part="price-original"
                  >${formatPrice(product.compare_at_price!)}</span
                >`
              : ""}
          </div>
          ${element.rating ? generateRatingHTML(element.rating) : ""}
        </div>
      </a>
      <div class="slot">
        <slot></slot>
      </div>
    </div>
  `
}

function generateImageHTML(element: SimpleCard, product: ShopifyProduct) {
  // Use media objects first, fallback to images array
  const primaryImage = product.media?.[0]?.src || product.images?.[0]
  if (!primaryImage) {
    return html`<div class="image placeholder"></div>`
  }

  const hasAlternate =
    element.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
  const alternateImage = product.media?.[1]?.src || product.images?.[1]

  // Get aspect ratio from media object, fallback to 1
  const aspectRatio = product.media?.[0]?.aspect_ratio || 1

  return html`
    <div class="image ${hasAlternate ? "alternate" : ""}" part="image">
      ${generateNostoImageHTML(primaryImage, product.title, aspectRatio, "img primary", element.sizes)}
      ${hasAlternate && alternateImage ? generateAlternateImageHTML(alternateImage, product, element.sizes) : ""}
    </div>
  `
}

function normalizeUrl(url: string) {
  if (url.startsWith("//") || !url.startsWith("/")) {
    return url
  }
  return createShopifyUrl(url).toString()
}

function generateNostoImageHTML(src: string, alt: string, aspectRatio: number, className: string, sizes?: string) {
  return html`
    <nosto-image
      src="${normalizeUrl(src)}"
      alt="${alt}"
      width="300"
      aspect-ratio="${aspectRatio}"
      loading="lazy"
      class="${className}"
      ${sizes ? html`sizes="${sizes}"` : ""}
    ></nosto-image>
  `
}

function generateAlternateImageHTML(alternateImage: string, product: ShopifyProduct, sizes?: string) {
  // Get aspect ratio from the second media object, fallback to 1
  const aspectRatio = product.media?.[1]?.aspect_ratio || 1

  return generateNostoImageHTML(alternateImage, product.title, aspectRatio, "img alternate", sizes)
}

function generateRatingHTML(rating: number) {
  // Generate star display based on numeric rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  return html`<div class="rating" part="rating">${starDisplay} (${rating.toFixed(1)})</div>`
}

function formatPrice(price: number) {
  // Convert from cents to dollars and format
  const amount = price / 100
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active ?? "USD"
  }).format(amount)
}

export function updateSimpleCardContent(element: SimpleCard, variant: ShopifyVariant) {
  if (!element.shadowRoot) return

  updateImages(element, variant)
  updatePrices(element, variant)
}

function updateImages(element: SimpleCard, variant: ShopifyVariant) {
  if (!element.shadowRoot) return

  const primaryImage = variant.featured_image

  const primaryImgElement = element.shadowRoot.querySelector(".img.primary") as HTMLElement
  if (primaryImgElement && primaryImage) {
    primaryImgElement.setAttribute("src", normalizeUrl(primaryImage.src))
    primaryImgElement.setAttribute("alt", variant.name)
  }

  if (element.alternate && primaryImage) {
    const alternateImgElement = element.shadowRoot.querySelector(".img.alternate") as HTMLElement
    if (alternateImgElement) {
      alternateImgElement.setAttribute("src", normalizeUrl(primaryImage.src))
      alternateImgElement.setAttribute("alt", variant.name)
    }
  }
}

function updatePrices(element: SimpleCard, variant: ShopifyVariant) {
  if (!element.shadowRoot) return
  const hasDiscount = element.discount && variant.compare_at_price && variant.compare_at_price > variant.price

  const currentPriceElement = element.shadowRoot.querySelector(".price-current")
  if (currentPriceElement) {
    currentPriceElement.textContent = formatPrice(variant.price || 0)
  }

  const originalPriceElement = element.shadowRoot.querySelector(".price-original")
  if (hasDiscount && originalPriceElement) {
    originalPriceElement.textContent = formatPrice(variant.compare_at_price!)
  }
}
