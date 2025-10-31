import { html } from "@/templating/html"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { SimpleProduct, SimpleVariant } from "./types"
import { transform } from "@/components/Image/transform"

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
      ${generateNostoImageHTML(primaryImage, product.title, "img primary", element.sizes)}
      ${hasAlternate && alternateImage
        ? generateNostoImageHTML(alternateImage, product.title, "img alternate", element.sizes)
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
  const normalizedSrc = normalizeUrl(src)

  if (sizes) {
    // When sizes is provided, use the full transform to generate srcset
    const imageProps = transform({
      src: normalizedSrc,
      width: 800,
      alt,
      sizes
    })

    return html`
      <img
        src="${imageProps.src}"
        ${imageProps.srcset ? html`srcset="${imageProps.srcset}"` : ""}
        alt="${imageProps.alt || alt}"
        width="800"
        loading="lazy"
        class="${className}"
        sizes="${imageProps.sizes}"
        ${imageProps.style ? buildStyleAttribute(imageProps.style) : ""}
      />
    `
  } else {
    // When sizes is not provided, generate a simple img without srcset
    const imageProps = transform({
      src: normalizedSrc,
      width: 800,
      alt
    })

    return html`
      <img
        src="${imageProps.src}"
        alt="${imageProps.alt || alt}"
        width="800"
        loading="lazy"
        class="${className}"
        ${imageProps.style ? buildStyleAttribute(imageProps.style) : ""}
      />
    `
  }
}

function buildStyleAttribute(style: CSSStyleDeclaration) {
  const styleString = Object.entries(style)
    .filter(([, value]) => value != null && value !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ")
  return styleString ? html`style="${styleString}"` : ""
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

  const primaryImgElement = element.shadowRoot!.querySelector(".img.primary") as HTMLImageElement
  if (primaryImgElement) {
    const normalizedSrc = normalizeUrl(variant.featured_image.src)
    const imageProps = transform({
      src: normalizedSrc,
      width: 800,
      alt: variant.name,
      sizes: element.sizes
    })

    if (imageProps.src) {
      primaryImgElement.src = String(imageProps.src)
    }
    if (imageProps.srcset) {
      primaryImgElement.srcset = String(imageProps.srcset)
    }
    primaryImgElement.alt = variant.name
  }

  if (element.alternate) {
    const alternateImgElement = element.shadowRoot!.querySelector(".img.alternate") as HTMLImageElement
    if (alternateImgElement) {
      const normalizedSrc = normalizeUrl(variant.featured_image.src)
      const imageProps = transform({
        src: normalizedSrc,
        width: 800,
        alt: variant.name,
        sizes: element.sizes
      })

      if (imageProps.src) {
        alternateImgElement.src = String(imageProps.src)
      }
      if (imageProps.srcset) {
        alternateImgElement.srcset = String(imageProps.srcset)
      }
      alternateImgElement.alt = variant.name
    }
  }
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
