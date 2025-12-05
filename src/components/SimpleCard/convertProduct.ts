import { ShopifyImage, ShopifyProduct } from "@/shopify/types"
import { JSONProduct } from "@nosto/nosto-js/client"

export function convertProduct({
  price_currency_code,
  list_price,
  price,
  name,
  brand,
  image_url,
  alternate_image_urls
}: JSONProduct) {
  return {
    images: [image_url!, ...(alternate_image_urls ?? [])].map(url => ({ url }) as ShopifyImage),
    title: name,
    vendor: brand!,
    compareAtPrice: {
      amount: String(list_price!),
      currencyCode: price_currency_code!
    },
    price: {
      amount: String(price),
      currencyCode: price_currency_code!
    }
  } as ShopifyProduct
}
