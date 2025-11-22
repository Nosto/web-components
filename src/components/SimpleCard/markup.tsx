/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@/templating/jsx"
import type { SimpleCard } from "./SimpleCard"
import type { TemplateExpression } from "@/templating/jsx"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { transform } from "../Image/transform"
import { setImageProps } from "../Image/Image"
import { ShopifyImage, ShopifyMoney, ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"
import { generateCarouselHTML } from "./carousel"
import { parseId } from "@/shopify/graphql/utils"
import { escapeHtml } from "@/utils/escapeHtml"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct): TemplateExpression {
  const hasDiscount = element.discount && isDiscounted(product)

  const prices = (element.variantId && product.variants.find(v => parseId(v.id) === element.variantId)) || product

  return (
    <div class="card" part="card">
      <a href={normalizeUrl(product.onlineStoreUrl)} class="link" part="link">
        {generateImageHTML(element, product)}
        <div class="content" part="content">
          {element.brand && product.vendor && (
            <div class="brand" part="brand">
              {product.vendor}
            </div>
          )}
          <h3 class="title" part="title">
            {product.title}
          </h3>
          <div class="price" part="price">
            <span class="price-current" part="price-current">
              {" "}
              {formatPrice(prices.price)}{" "}
            </span>
            {hasDiscount && (
              <span class="price-original" part="price-original">
                {formatPrice(prices.compareAtPrice!)}
              </span>
            )}
          </div>
          {element.rating && generateRatingHTML(element.rating)}
        </div>
      </a>
      <div class="slot">
        <slot></slot>
      </div>
    </div>
  ) as unknown as TemplateExpression
}

function generateImageHTML(element: SimpleCard, product: ShopifyProduct): TemplateExpression {
  // Use media objects first, fallback to images array
  const primaryImage = product.images?.[0]
  if (!primaryImage) {
    return (<div class="image placeholder"></div>) as unknown as TemplateExpression
  }

  // Carousel mode takes precedence over alternate mode
  if (element.imageMode === "carousel" && product.images?.length > 1) {
    return generateCarouselHTML(element, product)
  }

  const hasAlternate = element.imageMode === "alternate" && product.images?.length > 1
  const alternateImage = hasAlternate ? product.images[1] : undefined

  return (
    <div class={`image ${hasAlternate ? "alternate" : ""}`} part="image">
      {generateImgHtml(primaryImage, product.title, "img primary", element.sizes)}
      {hasAlternate && alternateImage && generateImgHtml(alternateImage, product.title, "img alternate", element.sizes)}
    </div>
  ) as unknown as TemplateExpression
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

export function generateImgHtml(
  image: ShopifyImage,
  alt: string,
  className: string,
  sizes?: string
): TemplateExpression {
  const { style, ...props } = transform(getImageProps(image, sizes))

  // Manual HTML construction is necessary here because the transform() function
  // returns a dynamic set of attributes (srcset, sizes, etc.) that can't be
  // statically expressed in JSX. This approach ensures all values are properly escaped.
  const additionalAttrs = Object.entries(props)
    .filter(([, value]) => value != null)
    .map(([key, value]) => `${key}="${escapeHtml(String(value))}"`)
    .join(" ")

  return {
    html: `<img alt="${escapeHtml(alt)}" part="${escapeHtml(className)}" class="${escapeHtml(className)}" width="${image.width}" height="${image.height}" ${additionalAttrs} style="${escapeHtml(styleText(style as object))}" />`
  }
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

function generateRatingHTML(rating: number): TemplateExpression {
  // Generate star display based on numeric rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  return (
    <div class="rating" part="rating">
      {starDisplay} ({rating.toFixed(1)})
    </div>
  ) as unknown as TemplateExpression
}

function formatPrice({ amount, currencyCode }: ShopifyMoney) {
  // Convert from cents to dollars and format
  return new Intl.NumberFormat(window.Shopify?.locale ?? "en-US", {
    style: "currency",
    currency: currencyCode
  }).format(+amount)
}

export function updateSimpleCardContent(element: SimpleCard, variant: ShopifyVariant) {
  const skipImageUpdate = element.imageMode === "carousel" || element.imageMode === "alternate"
  if (!skipImageUpdate) {
    updateImages(element, variant)
  }
  updatePrices(element, variant)
}

function updateImages(element: SimpleCard, variant: ShopifyVariant) {
  if (!variant.image) return

  const props = getImageProps(variant.image, element.sizes)
  const imagesToUpdate = [
    element.shadowRoot!.querySelector(".img.primary"),
    element.imageMode === "alternate" && element.shadowRoot!.querySelector(".img.alternate")
  ].filter(Boolean) as HTMLImageElement[]

  imagesToUpdate.forEach(img => setImageProps(img, props))
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
