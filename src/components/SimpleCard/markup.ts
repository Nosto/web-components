import { html } from "@/templating/html"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { SimpleProduct, SimpleVariant } from "./types"
import { transform } from "../Image/transform"
import { setImageProps } from "../Image/Image"

export function generateMockCardHTML(element: SimpleCard) {
  return html`
    <div class="card mock" part="card">
      <div class="link" part="link">
        <div class="image placeholder mock" part="image"></div>
        <div class="content" part="content">
          ${element.brand ? html`<div class="brand" part="brand">Mock Brand</div>` : ""}
          <h3 class="title" part="title">Mock Product Title</h3>
          <div class="price" part="price">
            <span class="price-current" part="price-current"> XX.XX </span>
            ${element.discount ? html`<span class="price-original" part="price-original">XX.XX</span>` : ""}
          </div>
          ${element.rating ? generateRatingHTML(element.rating) : ""}
        </div>
      </div>
      <div class="slot">
        <slot></slot>
      </div>
    </div>
  `
}

export function generateCardHTML(element: SimpleCard, product: SimpleProduct) {
  const hasDiscount = element.discount && product.compare_at_price && product.compare_at_price > product.price

  return html`
    <div class="card" part="card">
      <a href="${normalizeUrl(product.url)}" class="link" part="link">
        ${generateImageHTML(element, product)}
        <div class="content" part="content">
          ${element.brand && product.vendor ? html`<div class="brand" part="brand">${product.vendor}</div>` : ""}
          <h3 class="title" part="title">${product.title}</h3>
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

function generateImageHTML(element: SimpleCard, product: SimpleProduct) {
  // Use media objects first, fallback to images array
  const primaryImage = product.media?.[0]?.src || product.images?.[0]
  if (!primaryImage) {
    return html`<div class="image placeholder"></div>`
  }

  const hasAlternate =
    element.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
  const alternateImage = product.media?.[1]?.src || product.images?.[1]

  return html`
    <div class="image ${hasAlternate ? "alternate" : ""}" part="image">
      ${generateImgHtml(primaryImage, product.title, "img primary", element.sizes)}
      ${hasAlternate && alternateImage
        ? generateImgHtml(alternateImage, product.title, "img alternate", element.sizes)
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

export function generateImgHtml(src: string, alt: string, className: string, sizes?: string) {
  const { style, ...props } = transform({
    src: normalizeUrl(src),
    width: 800,
    sizes
  })
  return html`<img
    alt="${alt}"
    part="${className}"
    class="${className}"
    ${Object.entries(props)
      .filter(([, value]) => value != null)
      .map(([key, value]) => html`${key}="${value}" `)}
    style="${styleText(style as object)}"
  />`
}

function styleText(style: object) {
  return Object.entries(style)
    .map(([key, value]) => `${key}: ${value};`)
    .join(" ")
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

export function updateSimpleCardContent(element: SimpleCard, variant: SimpleVariant) {
  updateImages(element, variant)
  updatePrices(element, variant)
}

function updateImages(element: SimpleCard, variant: SimpleVariant) {
  if (!variant.featured_image) return

  const props = {
    src: normalizeUrl(variant.featured_image.src),
    width: 800,
    sizes: element.sizes
  }
  const imagesToUpdate = [
    element.shadowRoot!.querySelector(".img.primary"),
    element.alternate && element.shadowRoot!.querySelector(".img.alternate")
  ].filter(Boolean) as HTMLImageElement[]

  imagesToUpdate.forEach(img => setImageProps(img, props))
}

function updatePrices(element: SimpleCard, variant: SimpleVariant) {
  const hasDiscount = element.discount && variant.compare_at_price && variant.compare_at_price > variant.price

  const currentPriceElement = element.shadowRoot!.querySelector(".price-current")
  if (currentPriceElement) {
    currentPriceElement.textContent = formatPrice(variant.price || 0)
  }

  const originalPriceElement = element.shadowRoot!.querySelector(".price-original")
  if (hasDiscount && originalPriceElement) {
    originalPriceElement.textContent = formatPrice(variant.compare_at_price!)
  }
}
