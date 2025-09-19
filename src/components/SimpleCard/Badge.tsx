/** @jsx createElement */
import type { ShopifyProduct } from "./types"
import { createElement } from "@/utils/jsx"

interface BadgeProps {
  product: ShopifyProduct
  discount?: boolean
}

export function Badge({ product, discount }: BadgeProps): HTMLElement {
  return (
    <div className="card__badge">
      {discount && product.compare_at_price && product.compare_at_price > product.price && (
        <span className="badge badge--bottom-left">Sale</span>
      )}
      {!product.available && <span className="badge badge--bottom-left">Sold out</span>}
    </div>
  )
}
