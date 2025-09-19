import type { ShopifyProduct } from "./types"
import { element } from "./element"
import { createMediaSection } from "./createMediaSection"
import { createPriceSection } from "./createPriceSection"

export interface SimpleCardInterface {
  brand?: boolean
  rating?: boolean
  discount?: boolean
  alternate?: boolean
  innerHTML: string
  appendChild(child: Node): Node
}

export function renderCard(simpleCard: SimpleCardInterface, product: ShopifyProduct) {
  const cardWrapper = element("div", { className: "card-wrapper product-card-wrapper underline-links-hover" })

  const card = element("div", { className: "card card--standard" })
  if (product.featured_image) {
    card.classList.add("card--media")
  } else {
    card.classList.add("card--text")
  }

  // Create card inner with media
  const cardInner = element("div", { className: "card__inner ratio" })

  if (product.featured_image) {
    const cardMedia = createMediaSection(simpleCard, product)
    cardInner.appendChild(cardMedia)
  }

  // Create card content
  const cardContent = element("div", { className: "card__content" })

  const cardInformation = element("div", { className: "card__information" })

  // Title
  const heading = element("h3", { className: "card__heading" })
  const link = element("a", { 
    href: product.url, 
    className: "full-unstyled-link" 
  }, product.title)
  heading.appendChild(link)
  cardInformation.appendChild(heading)

  // Additional information based on attributes
  const cardInfo = element("div", { className: "card-information" })

  // Brand/Vendor
  if (simpleCard.brand && product.vendor) {
    const vendorDiv = element("div", { 
      className: "caption-with-letter-spacing light" 
    }, product.vendor)
    cardInfo.appendChild(vendorDiv)
  }

  // Rating placeholder (Shopify doesn't provide rating in .js endpoint by default)
  if (simpleCard.rating) {
    const ratingDiv = element("div", { className: "rating" }, "Rating not available")
    cardInfo.appendChild(ratingDiv)
  }

  // Price
  const priceDiv = createPriceSection(simpleCard, product)
  cardInfo.appendChild(priceDiv)

  cardInformation.appendChild(cardInfo)
  cardContent.appendChild(cardInformation)

  // Badge for discount
  if (simpleCard.discount && product.compare_at_price && product.compare_at_price > product.price) {
    const badge = element("div", { className: "card__badge" })
    const span = element("span", { className: "badge badge--bottom-left" }, "Sale")
    badge.appendChild(span)
    cardContent.appendChild(badge)
  }

  // Availability badge
  if (!product.available) {
    const badge = element("div", { className: "card__badge" })
    const span = element("span", { className: "badge badge--bottom-left" }, "Sold out")
    badge.appendChild(span)
    cardContent.appendChild(badge)
  }

  card.appendChild(cardInner)
  card.appendChild(cardContent)
  cardWrapper.appendChild(card)

  // Clear existing content and append new card
  simpleCard.innerHTML = ""
  simpleCard.appendChild(cardWrapper)
}