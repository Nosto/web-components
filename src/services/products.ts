import { getSettings } from "@nosto/nosto-js"

type Params = {
  productId?: string
  handle: string
  recoId: string
}

export async function getData(data: Params) {
  // TODO support more platforms
  return getShopifyData(data)
}

async function getShopifyData({ handle, recoId }: Params) {
  const data = await fetch(`/products/${handle}.json`)
  if (!data.ok) {
    throw new Error(`Failed to fetch product data: ${data.status} ${data.statusText}`)
  }
  const product = (await data.json()).product
  const { parameterlessAttribution, nostoRefParam } = getSettings() ?? {}
  // TODO how to handle parameterless attribution
  if (!parameterlessAttribution && nostoRefParam) {
    product.url = `/products/${handle}?${nostoRefParam}=${recoId}`
  }
  // TODO thumb image
  return product
}

// TODO BigCommerce
// TODO Magento
// TODO Shopware
