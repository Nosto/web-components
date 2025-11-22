import { createElement } from "@/templating/jsx"
import type { SimpleCard } from "./SimpleCard"
import { createShopifyUrl } from "@/utils/createShopifyUrl"
import { transform } from "../Image/transform"
import { setImageProps } from "../Image/Image"
import { ShopifyImage, ShopifyMoney, ShopifyProduct, ShopifyVariant } from "@/shopify/graphql/types"
import { generateCarouselHTML } from "./carousel"
import { parseId } from "@/shopify/graphql/utils"

export function generateCardHTML(element: SimpleCard, product: ShopifyProduct) {
  const hasDiscount = element.discount && isDiscounted(product)

  const prices = (element.variantId && product.variants.find(v => parseId(v.id) === element.variantId)) || product

  return (
    <div class="card" part="card">
      <a href={normalizeUrl(product.onlineStoreUrl)} class="link" part="link">
        <ImageHTML element={element} product={product} />
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
          {element.rating && <RatingHTML rating={element.rating} />}
        </div>
      </a>
      <div class="slot">
        <slot></slot>
      </div>
    </div>
  )
}

function ImageHTML({ element, product }: { element: SimpleCard; product: ShopifyProduct }) {
  // Use media objects first, fallback to images array
  const primaryImage = product.images?.[0]
  if (!primaryImage) {
    return <div class="image placeholder"></div>
  }

  // Carousel mode takes precedence over alternate mode
  if (element.imageMode === "carousel" && product.images?.length > 1) {
    return generateCarouselHTML(element, product)
  }

  const hasAlternate = element.imageMode === "alternate" && product.images?.length > 1
  const alternateImage = hasAlternate ? product.images[1] : undefined

  return (
    <div class={`image ${hasAlternate ? "alternate" : ""}`} part="image">
      <ImgHtml image={primaryImage} alt={product.title} className="img primary" sizes={element.sizes} />
      {hasAlternate && alternateImage && (
        <ImgHtml image={alternateImage} alt={product.title} className="img alternate" sizes={element.sizes} />
      )}
    </div>
  )
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

export function ImgHtml({
  image,
  alt,
  className,
  sizes
}: {
  image: ShopifyImage
  alt: string
  className: string
  sizes?: string
}) {
  const { style, ...props } = transform(getImageProps(image, sizes))

  // Use JSX to create img element
  return (
    <img
      alt={alt}
      part={className}
      class={className}
      width={image.width}
      height={image.height}
      {...props}
      style={style as Record<string, string>}
    />
  )
}

// Legacy function export for backward compatibility
export function generateImgHtml(image: ShopifyImage, alt: string, className: string, sizes?: string) {
  return <ImgHtml image={image} alt={alt} className={className} sizes={sizes} />
}

function getImageProps(image: ShopifyImage, sizes?: string) {
  return {
    src: normalizeUrl(image.url),
    width: image.width,
    height: image.height,
    sizes: sizes || defaultImageSizes
  }
}

function RatingHTML({ rating }: { rating: number }) {
  // Generate star display based on numeric rating
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const starDisplay =
    "★".repeat(fullStars) + (hasHalfStar ? "☆" : "") + "☆".repeat(5 - fullStars - (hasHalfStar ? 1 : 0))
  return (
    <div class="rating" part="rating">
      {starDisplay} ({rating.toFixed(1)})
    </div>
  )
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
