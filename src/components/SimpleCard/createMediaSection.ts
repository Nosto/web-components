import type { ShopifyProduct } from "./types"
import { element } from "./element"

export interface SimpleCardInterface {
  alternate?: boolean
}

export function createMediaSection(simpleCard: SimpleCardInterface, product: ShopifyProduct): HTMLElement {
  const cardMedia = element("div", { className: "card__media" })

  const media = element("div", { className: "media media--transparent" })
  if (simpleCard.alternate && product.images.length > 1) {
    media.classList.add("media--hover-effect")
  }

  const img = element("img", {
    src: product.featured_image || product.images[0],
    alt: product.title,
    className: "motion-reduce",
    loading: "lazy"
  }) as HTMLImageElement

  media.appendChild(img)

  // Add alternate image for hover effect
  if (simpleCard.alternate && product.images.length > 1) {
    const altImg = element("img", {
      src: product.images[1],
      alt: product.title,
      className: "motion-reduce",
      loading: "lazy"
    }) as HTMLImageElement
    media.appendChild(altImg)
  }

  cardMedia.appendChild(media)
  return cardMedia
}