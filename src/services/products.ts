import { getSettings } from "@nosto/nosto-js"
import { magentoQuery } from "./graphql"

type Params = {
  productId?: string
  handle: string
  recoId: string
}

function getMode(): keyof typeof modes {
  // TODO serialize platform into client script settings
  if (window.Shopify || window.Nosto?.shopifyScript) {
    return "shopify"
  } else if (window.Nosto?.bigCommerceScript) {
    return "bigcommerce"
  }
  throw new Error("Unsupported platform")
}

export async function getData(data: Params, mode = getMode()) {
  return modes[mode](data)
}

const modes = {
  shopify: getShopifyData,
  bigcommerce: getBigCommerceData,
  magento2: getMagentoData,
  shopware6: getShopwareData
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

async function getBigCommerceData() {
  // TODO use storefront GraphQL API
  throw new Error("Not implemented")
}

async function getMagentoData({ handle, recoId }: Params) {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: magentoQuery, variables: { handle } })
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch product data: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()
  const items = result?.data?.products?.items
  if (!items || items.length === 0) {
    throw new Error(`Product with handle "${handle}" not found.`)
  }
  const product = items[0]
  product.url = recoId ? `/${product.url_key}?ref=${recoId}` : `/${product.url_key}`
  return product
}

async function getShopwareData() {
  throw new Error("Not implemented.")
}
