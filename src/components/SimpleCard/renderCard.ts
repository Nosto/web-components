/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"
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
  const cardWrapper = (
    <div className="card-wrapper product-card-wrapper underline-links-hover">
      <div className={`card card--standard${product.featured_image ? ' card--media' : ' card--text'}`}>
        <div className="card__inner ratio">
          {product.featured_image && createMediaSection(simpleCard, product)}
        </div>
        <div className="card__content">
          <div className="card__information">
            <h3 className="card__heading">
              <a href={product.url} className="full-unstyled-link">
                {product.title}
              </a>
            </h3>
            <div className="card-information">
              {simpleCard.brand && product.vendor && (
                <div className="caption-with-letter-spacing light">
                  {product.vendor}
                </div>
              )}
              {simpleCard.rating && (
                <div className="rating">Rating not available</div>
              )}
              {createPriceSection(simpleCard, product)}
            </div>
          </div>
          {simpleCard.discount && product.compare_at_price && product.compare_at_price > product.price && (
            <div className="card__badge">
              <span className="badge badge--bottom-left">Sale</span>
            </div>
          )}
          {!product.available && (
            <div className="card__badge">
              <span className="badge badge--bottom-left">Sold out</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  // Clear existing content and append new card
  simpleCard.innerHTML = ""
  simpleCard.appendChild(cardWrapper)
}