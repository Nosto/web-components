/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"
import { Media } from "./Media"
import { Price } from "./Price"
import { Brand } from "./Brand"

import { Badge } from "./Badge"

export interface SimpleCardInterface {
  brand?: boolean
  discount?: boolean
  alternate?: boolean
}

export function CardWrapper(simpleCard: SimpleCardInterface, product: ShopifyProduct): HTMLElement {
  return (
    <div className="card-wrapper product-card-wrapper underline-links-hover">
      <div className={`card card--standard${product.featured_image ? " card--media" : " card--text"}`}>
        <a href={product.url} className="full-unstyled-link">
          <div className="card__inner ratio">
            {product.featured_image && <Media alternate={simpleCard.alternate} product={product} />}
          </div>
          <div className="card__content">
            <div className="card__information">
              <h3 className="card__heading">{product.title}</h3>
              <div className="card-information">
                {simpleCard.brand && product.vendor && <Brand product={product} />}
                <Price discount={simpleCard.discount} product={product} />
              </div>
            </div>
            <Badge product={product} discount={simpleCard.discount} />
          </div>
        </a>
      </div>
    </div>
  )
}
