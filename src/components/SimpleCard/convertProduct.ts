import { JSONProduct } from "@nosto/nosto-js/client"
import { SimpleProduct } from "./types"

export function convertProduct(product: JSONProduct) {
  return {
    media: [product.image_url!, ...(product.alternate_image_urls ?? [])].map(src => ({ src })),
    title: product.name,
    vendor: product.brand!,
    url: product.url,
    images: [],
    compare_at_price: normalizePrice(product.list_price!),
    price: normalizePrice(product.price)
  } satisfies SimpleProduct
}

function normalizePrice(price: number) {
  return price ? price * 100 : price
}
