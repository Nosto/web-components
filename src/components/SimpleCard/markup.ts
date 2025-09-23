import { html, TemplateResult } from "lit"
import type { ShopifyProduct } from "./types"
import type { SimpleCard } from "./SimpleCard"

export function generateCardTemplate(element: SimpleCard, product: ShopifyProduct): TemplateResult {
  const hasDiscount = element.discount && product.compare_at_price && product.compare_at_price > product.price

  return html`
    <div class="simple-card">
      <a href="${product.url}" class="simple-card__link">
        ${generateImageTemplate(element, product)}
        <div class="simple-card__content">
          ${element.brand && product.vendor ? html`<div class="simple-card__brand">${product.vendor}</div>` : ""}
          <h3 class="simple-card__title">${product.title}</h3>
          <div class="simple-card__price">
            <span class="simple-card__price-current"> ${formatPrice(product.price || 0)} </span>
            ${hasDiscount
              ? html`<span class="simple-card__price-original">${formatPrice(product.compare_at_price!)}</span>`
              : ""}
          </div>
          ${element.rating ? generateRatingTemplate(element.rating) : ""}
        </div>
      </a>
    </div>
  `
}

export function generateImageTemplate(element: SimpleCard, product: ShopifyProduct): TemplateResult {
  // Use media objects first, fallback to images array
  const primaryImage = product.media?.[0]?.src || product.images?.[0]
  if (!primaryImage) {
    return html`<div class="simple-card__image simple-card__image--placeholder"></div>`
  }

  const hasAlternate =
    element.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
  const alternateImage = product.media?.[1]?.src || product.images?.[1]

  // Get aspect ratio from media object, fallback to 1
  const aspectRatio = product.media?.[0]?.aspect_ratio || 1

  return html`
    <div class="simple-card__image ${hasAlternate ? "simple-card__image--alternate" : ""}">
      <nosto-image
        src="${primaryImage}"
        alt="${product.title}"
        width="300"
        aspect-ratio="${aspectRatio}"
        loading="lazy"
        class="simple-card__img simple-card__img--primary"
      ></nosto-image>
      ${hasAlternate && alternateImage ? generateAlternateImageTemplate(alternateImage, product) : ""}
    </div>
  `
}

export function generateAlternateImageTemplate(alternateImage: string, product: ShopifyProduct): TemplateResult {
  // Get aspect ratio from the second media object, fallback to 1
  const aspectRatio = product.media?.[1]?.aspect_ratio || 1

  return html`
    <nosto-image
      src="${alternateImage}"
      alt="${product.title}"
      width="300"
      aspect-ratio="${aspectRatio}"
      loading="lazy"
      class="simple-card__img simple-card__img--alternate"
    ></nosto-image>
  `
}

export function generateRatingTemplate(rating: number): TemplateResult {
  // Generate star display based on numeric rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  const ratingText = `${starDisplay} (${rating.toFixed(1)})`
  return html`<div class="simple-card__rating">${ratingText}</div>`
}

export function formatPrice(price: number): string {
  // Convert from cents to dollars and format
  const amount = price / 100
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active ?? "USD"
  }).format(amount)
}
