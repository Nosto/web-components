/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"

export interface SimpleCardInterface {
  alternate?: boolean
}

export function createMediaSection(simpleCard: SimpleCardInterface, product: ShopifyProduct): HTMLElement {
  const mediaClass = `media media--transparent${simpleCard.alternate && product.images.length > 1 ? ' media--hover-effect' : ''}`
  
  return (
    <div className="card__media">
      <div className={mediaClass}>
        <img 
          src={product.featured_image || product.images[0]}
          alt={product.title}
          className="motion-reduce"
          loading="lazy"
        />
        {simpleCard.alternate && product.images.length > 1 && (
          <img 
            src={product.images[1]}
            alt={product.title}
            className="motion-reduce"
            loading="lazy"
          />
        )}
      </div>
    </div>
  )
}