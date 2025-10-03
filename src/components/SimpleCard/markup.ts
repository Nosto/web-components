import { html } from "@/templating/html"
import type { ShopifyProduct } from "./types"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct) {
  const hasDiscount = element.discount && product.compare_at_price && product.compare_at_price > product.price
  const hasProductDiscount = product.compare_at_price && product.compare_at_price > product.price

  return html`
    <div class="simple-card">
      <a href="${product.url}" class="simple-card__link">
        <div class="simple-card__image-container">
          ${generateImageHTML(element, product)} ${element.oosBadge && !product.available ? generateOosBadgeHTML() : ""}
          ${element.saleBadge && hasProductDiscount ? generateSaleBadgeHTML(element, product) : ""}
        </div>
        <div class="simple-card__content">
          ${element.brand && product.vendor ? html`<div class="simple-card__brand">${product.vendor}</div>` : ""}
          <h3 class="simple-card__title">${product.title}</h3>
          ${element.swatches ? generateSwatchesHTML(element, product) : ""}
          <div class="simple-card__price">
            <span class="simple-card__price-current"> ${formatPrice(product.price || 0)} </span>
            ${hasDiscount
              ? html`<span class="simple-card__price-original">${formatPrice(product.compare_at_price!)}</span>`
              : ""}
          </div>
          ${element.rating ? generateRatingHTML(element.rating) : ""}
        </div>
      </a>
    </div>
  `
}

function generateImageHTML(element: SimpleCard, product: ShopifyProduct) {
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
      ${generateNostoImageHTML(
        primaryImage,
        product.title,
        aspectRatio,
        "simple-card__img simple-card__img--primary",
        element.sizes
      )}
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
  if (sizes) {
    return html`
      <nosto-image
        src="${normalizeUrl(src)}"
        alt="${alt}"
        width="300"
        aspect-ratio="${aspectRatio}"
        loading="lazy"
        class="${className}"
        sizes="${sizes}"
      ></nosto-image>
    `
  }
  return html`
    <nosto-image
      src="${normalizeUrl(src)}"
      alt="${alt}"
      width="300"
      aspect-ratio="${aspectRatio}"
      loading="lazy"
      class="${className}"
    ></nosto-image>
  `
}

function generateAlternateImageHTML(alternateImage: string, product: ShopifyProduct, sizes?: string) {
  // Get aspect ratio from the second media object, fallback to 1
  const aspectRatio = product.media?.[1]?.aspect_ratio || 1

  return generateNostoImageHTML(
    alternateImage,
    product.title,
    aspectRatio,
    "simple-card__img simple-card__img--alternate",
    sizes
  )
}

function generateRatingHTML(rating: number) {
  // Generate star display based on numeric rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  return html`<div class="simple-card__rating">${starDisplay} (${rating.toFixed(1)})</div>`
}

function formatPrice(price: number) {
  // Convert from cents to dollars and format
  const amount = price / 100
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active ?? "USD"
  }).format(amount)
}

function generateSwatchesHTML(element: SimpleCard, product: ShopifyProduct) {
  // Look for color options in the product options
  const colorOption = product.options?.find(
    option => option.name.toLowerCase().includes("color") || option.name.toLowerCase().includes("colour")
  )

  if (!colorOption || !colorOption.values.length) {
    return ""
  }

  const maxSwatches = element.maxSwatches || colorOption.values.length
  const swatchColors = colorOption.values.slice(0, maxSwatches)

  const swatchElements = swatchColors
    .map(
      color =>
        `<span class="simple-card__swatch" style="background-color: ${getColorValue(color)}" title="${color}"></span>`
    )
    .join("")

  const moreElement =
    colorOption.values.length > maxSwatches
      ? `<span class="simple-card__swatch-more">+${colorOption.values.length - maxSwatches}</span>`
      : ""

  return html`
    <div class="simple-card__swatches">
      ${swatchElements}
      ${moreElement}
    </div>
  `
}

function getColorValue(colorName: string): string {
  // Simple color name to hex mapping for common colors
  const colorMap: Record<string, string> = {
    black: "#000000",
    white: "#ffffff",
    red: "#ff0000",
    blue: "#0000ff",
    green: "#008000",
    yellow: "#ffff00",
    orange: "#ffa500",
    purple: "#800080",
    pink: "#ffc0cb",
    brown: "#a52a2a",
    gray: "#808080",
    grey: "#808080",
    navy: "#000080",
    beige: "#f5f5dc",
    cream: "#fffdd0",
    gold: "#ffd700",
    silver: "#c0c0c0"
  }

  const normalizedColor = colorName.toLowerCase().trim()

  // Check if it's already a hex color
  if (normalizedColor.startsWith("#")) {
    return normalizedColor
  }

  // Look for exact match in color map
  if (colorMap[normalizedColor]) {
    return colorMap[normalizedColor]
  }

  // Try to match partial color names
  for (const [key, value] of Object.entries(colorMap)) {
    if (normalizedColor.includes(key)) {
      return value
    }
  }

  // Default to a neutral gray if we can't determine the color
  return "#cccccc"
}

function generateOosBadgeHTML() {
  return html` <div class="simple-card__badge simple-card__badge--oos">Sold Out</div> `
}

function generateSaleBadgeHTML(element: SimpleCard, product: ShopifyProduct) {
  const saleBadgeType = element.saleBadgeType || "text"
  let badgeText = "Sale"

  if (saleBadgeType === "percentage" && product.compare_at_price && product.price) {
    const discountPercent = Math.round(((product.compare_at_price - product.price) / product.compare_at_price) * 100)
    badgeText = `-${discountPercent}%`
  } else if (saleBadgeType === "fixed" && product.compare_at_price && product.price) {
    const discountAmount = product.compare_at_price - product.price
    badgeText = `-${formatPrice(discountAmount)}`
  }

  return html` <div class="simple-card__badge simple-card__badge--sale">${badgeText}</div> `
}
