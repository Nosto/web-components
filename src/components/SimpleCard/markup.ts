import { html } from "@/templating/html"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { transform } from "../Image/transform"
import { ShopifyImage, ShopifyMoney, ShopifyProduct } from "@/shopify/graphql/types"
import { generateCarouselHTML } from "./carousel"
import { parseId } from "@/shopify/graphql/utils"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct) {
  const hasDiscount = element.discount && isDiscounted(product)

  const selectedVariant =
    (element.variantId && product.variants.find(v => parseId(v.id) === element.variantId)) || undefined
  const prices = selectedVariant ?? product
  const images = selectedVariant && !element.imageMode ? [selectedVariant.image!] : product.images

  return html`
    <div class="card" part="card">
      <a href="${normalizeUrl(product.onlineStoreUrl)}" class="link" part="link">
        ${generateImageHTML(element, product.title, images)}
        <div class="content" part="content">
          ${element.brand && product.vendor ? html`<div class="brand" part="brand">${product.vendor}</div>` : ""}
          <h3 class="title" part="title">${product.title}</h3>
          <div class="price" part="price">
            <span class="price-current" part="price-current"> ${formatPrice(prices.price)} </span>
            ${hasDiscount
              ? html`<span class="price-original" part="price-original">${formatPrice(prices.compareAtPrice!)}</span>`
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

function generateImageHTML(element: SimpleCard, title: string, images: ShopifyImage[]) {
  // Use media objects first, fallback to images array
  const primaryImage = images[0]
  if (!primaryImage) {
    return html`<div class="image placeholder"></div>`
  }

  // Carousel mode takes precedence over alternate mode
  if (element.imageMode === "carousel" && images?.length > 1) {
    return generateCarouselHTML(element, title, images)
  }

  const hasAlternate = element.imageMode === "alternate" && images?.length > 1
  const alternateImage = hasAlternate ? images[1] : undefined

  return html`
    <div class="image ${hasAlternate ? "alternate" : ""}" part="image">
      ${generateImgHtml(primaryImage, title, "img primary", element.sizes)}
      ${hasAlternate && alternateImage ? generateImgHtml(alternateImage, title, "img alternate", element.sizes) : ""}
    </div>
  `
}

function normalizeUrl(url: string) {
  if (!url || url.startsWith("//") || !url.startsWith("/")) {
    return url
  }
  return createShopifyUrl(url).toString()
}

const defaultImageSizes = `(min-width: 1024px) 25vw,
    (min-width: 768px) 33.33vw,
    (min-width: 375px) 50vw,
    100vw`

export function generateImgHtml(image: ShopifyImage, alt: string, className: string, sizes?: string) {
  const { style, ...props } = transform(getImageProps(image, sizes))
  return html`<img
    alt="${alt}"
    part="${className}"
    class="${className}"
    width="${image.width}"
    height="${image.height}"
    ${Object.entries(props)
      .filter(([, value]) => value != null)
      .map(([key, value]) => html`${key}="${value}" `)}
    style="${styleText(style as object)}"
  />`
}

function getImageProps(image: ShopifyImage, sizes?: string) {
  return {
    src: normalizeUrl(image.url),
    width: image.width,
    height: image.height,
    sizes: sizes || defaultImageSizes
  }
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

function formatPrice({ amount, currencyCode }: ShopifyMoney) {
  // Convert from cents to dollars and format
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: currencyCode
  }).format(+amount)
}

function isDiscounted(prices: { compareAtPrice: ShopifyMoney | null; price: ShopifyMoney }) {
  return prices.compareAtPrice && +prices.compareAtPrice.amount > +prices.price.amount
}
