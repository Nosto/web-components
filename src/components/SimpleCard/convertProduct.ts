import { ShopifyImage, ShopifyProduct } from "@/shopify/graphql/types"
import { JSONProduct } from "@nosto/nosto-js/client"

export function convertProduct(product: JSONProduct) {
  return {
    images: [product.image_url!, ...(product.alternate_image_urls ?? [])].map(url => ({ url }) as ShopifyImage),
    title: product.name,
    vendor: product.brand!,
    compareAtPrice: {
      amount: String(normalizePrice(product.list_price!)),
      currencyCode: product.price_currency_code!
    },
    price: {
      amount: String(normalizePrice(product.price)),
      currencyCode: product.price_currency_code!
    }
  } as ShopifyProduct
}

function normalizePrice(price: number) {
  return price ? price * 100 : price
}
