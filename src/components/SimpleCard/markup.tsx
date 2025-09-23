/** @jsx createElement */
import { createElement } from "@/utils/jsx"
import type { ShopifyProduct } from "./types"
import type { SimpleCard } from "./SimpleCard"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct): HTMLElement {
  const hasDiscount = element.discount && product.compare_at_price && product.compare_at_price > product.price

  return (
    <div className="simple-card">
      <a href={product.url} className="simple-card__link">
        {generateImageHTML(element, product)}
        <div className="simple-card__content">
          {element.brand && product.vendor && <div className="simple-card__brand">{product.vendor}</div>}
          <h3 className="simple-card__title">{product.title}</h3>
          <div className="simple-card__price">
            <span className="simple-card__price-current">{formatPrice(product.price || 0)}</span>
            {hasDiscount && (
              <span className="simple-card__price-original">{formatPrice(product.compare_at_price!)}</span>
            )}
          </div>
          {element.rating && generateRatingHTML(element.rating)}
        </div>
      </a>
    </div>
  )
}

export function generateImageHTML(element: SimpleCard, product: ShopifyProduct): HTMLElement {
  // Use media objects first, fallback to images array
  const primaryImage = product.media?.[0]?.src || product.images?.[0]
  if (!primaryImage) {
    return <div className="simple-card__image simple-card__image--placeholder"></div>
  }

  const hasAlternate =
    element.alternate && ((product.media && product.media.length > 1) || (product.images && product.images.length > 1))
  const alternateImage = product.media?.[1]?.src || product.images?.[1]

  // Get aspect ratio from media object, fallback to 1
  const aspectRatio = product.media?.[0]?.aspect_ratio || 1

  return (
    <div className={`simple-card__image ${hasAlternate ? "simple-card__image--alternate" : ""}`}>
      <nosto-image
        src={primaryImage}
        width={300}
        aspectRatio={aspectRatio}
        className="simple-card__img simple-card__img--primary"
      />
      {hasAlternate && alternateImage && generateAlternateImageHTML(alternateImage, product)}
    </div>
  )
}

export function generateAlternateImageHTML(alternateImage: string, product: ShopifyProduct): HTMLElement {
  // Get aspect ratio from the second media object, fallback to 1
  const aspectRatio = product.media?.[1]?.aspect_ratio || 1

  return (
    <nosto-image
      src={alternateImage}
      width={300}
      aspectRatio={aspectRatio}
      className="simple-card__img simple-card__img--alternate"
    />
  )
}

export function generateRatingHTML(rating: number): HTMLElement {
  // Generate star display based on numeric rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))

  return (
    <div className="simple-card__rating">
      {starDisplay} ({rating.toFixed(1)})
    </div>
  )
}

export function formatPrice(price: number): string {
  // Convert from cents to dollars and format
  const amount = price / 100
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: window.Shopify?.currency?.active ?? "USD"
  }).format(amount)
}
