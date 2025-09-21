import type { ShopifyProduct } from "./types"
import type { SimpleCard } from "./SimpleCard"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct) {
  const hasDiscount =
    element.discount &&
    product.compare_at_price &&
    product.compare_at_price > product.price

  return `
    <div class="simple-card">
      <a href="/products/${product.handle}" class="simple-card__link">
        ${generateImageHTML(element, product)}
        <div class="simple-card__content">
          ${element.brand && product.vendor ? `<div class="simple-card__brand">${escapeHTML(product.vendor)}</div>` : ""}
          <h3 class="simple-card__title">
            ${escapeHTML(product.title)}
          </h3>
          <div class="simple-card__price">
            <span class="simple-card__price-current">
              ${formatPrice(product.price)}
            </span>
            ${hasDiscount ? `<span class="simple-card__price-original">${formatPrice(product.compare_at_price!)}</span>` : ""}
          </div>
          ${element.discount && hasDiscount ? generateDiscountHTML(product.compare_at_price!, product.price) : ""}
          ${element.rating ? generateRatingHTML() : ""}
        </div>
      </a>
    </div>
  `
}

export function generateImageHTML(element: SimpleCard, product: ShopifyProduct) {
  const primaryImage = product.images?.[0]
  if (!primaryImage) {
    return '<div class="simple-card__image simple-card__image--placeholder"></div>'
  }

  const hasAlternate = element.alternate && product.images.length > 1

  return `
    <div class="simple-card__image ${hasAlternate ? "simple-card__image--alternate" : ""}">
      <img 
        src="${primaryImage}" 
        alt="${escapeHTML(product.title)}"
        loading="lazy"
        class="simple-card__img simple-card__img--primary"
      />
      ${hasAlternate ? generateAlternateImageHTML(product.images[1], product) : ""}
    </div>
  `
}

export function generateAlternateImageHTML(alternateImage: string, product: ShopifyProduct) {
  return `
    <img 
      src="${alternateImage}" 
      alt="${escapeHTML(product.title)}"
      loading="lazy"
      class="simple-card__img simple-card__img--alternate"
    />
  `
}

export function generateDiscountHTML(compareAtPrice: number, price: number) {
  const discountPercent = Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
  return `<div class="simple-card__discount">Save ${discountPercent}%</div>`
}

export function generateRatingHTML() {
  // Since product rating isn't typically in Shopify product.js,
  // this is a placeholder for potential integration with review apps
  return `<div class="simple-card__rating">★★★★☆ (4.0)</div>`
}

export function formatPrice(price: number) {
  // Convert from cents to dollars and format
  const dollars = price / 100
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(dollars)
}

export function escapeHTML(text: string) {
  return text.replace(/[&<>"']/g, match => {
    switch (match) {
      case "&":
        return "&amp;"
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case '"':
        return "&quot;"
      case "'":
        return "&#39;"
      default:
        return match
    }
  })
}
