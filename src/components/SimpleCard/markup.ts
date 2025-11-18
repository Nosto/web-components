import { html } from "@/templating/html"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { transform } from "../Image/transform"
import { setImageProps } from "../Image/Image"
import { ShopifyMoney, ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"
import { generateCarouselHTML } from "./carousel"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct) {
  const hasDiscount = element.discount && isDiscounted(product)

  return html`
    <div class="card" part="card">
      <a href="${normalizeUrl(product.onlineStoreUrl)}" class="link" part="link">
        ${generateImageHTML(element, product)}
        <div class="content" part="content">
          ${element.brand && product.vendor ? html`<div class="brand" part="brand">${product.vendor}</div>` : ""}
          <h3 class="title" part="title">${product.title}</h3>
          <div class="price" part="price">
            <span class="price-current" part="price-current"> ${formatPrice(product.price)} </span>
            ${hasDiscount
              ? html`<span class="price-original" part="price-original">${formatPrice(product.compareAtPrice!)}</span>`
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
  const primaryImage = product.images?.[0]?.url
  if (!primaryImage) {
    return html`<div class="image placeholder"></div>`
  }

  // Carousel mode takes precedence over alternate mode
  if (element.carousel && product.images?.length > 1) {
    return generateCarouselHTML(element, product)
  }

  const hasAlternate = element.alternate && product.images?.length > 1
  const alternateImage = hasAlternate ? product.images[1].url : undefined

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

function formatPrice({ amount, currencyCode }: ShopifyMoney) {
  // Convert from cents to dollars and format
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: currencyCode
  }).format(+amount)
}

export function updateSimpleCardContent(element: SimpleCard, variant: ShopifyVariant) {
  updateImages(element, variant)
  updatePrices(element, variant)
}

function updateImages(element: SimpleCard, variant: ShopifyVariant) {
  // Handle carousel mode - update all carousel images
  if (element.carousel && variant.images && variant.images.length > 0) {
    updateCarouselImages(element, variant)
    return
  }

  // Handle non-carousel mode - update primary/alternate images
  if (!variant.image) return

  const props = {
    src: normalizeUrl(variant.image.url),
    width: 800,
    sizes: element.sizes
  }
  const imagesToUpdate = [
    element.shadowRoot!.querySelector(".img.primary"),
    element.alternate && element.shadowRoot!.querySelector(".img.alternate")
  ].filter(Boolean) as HTMLImageElement[]

  imagesToUpdate.forEach(img => setImageProps(img, props))
}

function updateCarouselImages(element: SimpleCard, variant: ShopifyVariant) {
  const carouselImages = element.shadowRoot!.querySelector(".carousel-images")
  if (!carouselImages || !variant.images) return

  // Get all carousel image elements
  const carouselImgs = carouselImages.querySelectorAll(".carousel-img") as NodeListOf<HTMLImageElement>

  // Update each carousel image with corresponding variant image
  variant.images.forEach((variantImage, index) => {
    const img = carouselImgs[index]
    if (img) {
      const props = {
        src: normalizeUrl(variantImage.url),
        width: 800,
        sizes: element.sizes
      }
      setImageProps(img, props)
    }
  })
}

function updatePrices(element: SimpleCard, variant: ShopifyVariant) {
  const hasDiscount = element.discount && isDiscounted(variant)

  const currentPriceElement = element.shadowRoot!.querySelector(".price-current")
  if (currentPriceElement) {
    currentPriceElement.textContent = formatPrice(variant.price)
  }

  const originalPriceElement = element.shadowRoot!.querySelector(".price-original")
  if (hasDiscount && originalPriceElement) {
    originalPriceElement.textContent = formatPrice(variant.compareAtPrice!)
  }
}

function isDiscounted(prices: { compareAtPrice: ShopifyMoney | null; price: ShopifyMoney }) {
  return prices.compareAtPrice && +prices.compareAtPrice.amount > +prices.price.amount
}
