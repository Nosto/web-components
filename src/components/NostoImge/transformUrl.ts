type ProviderConfig = {
  [provider: string]: {
    keyMaps: Record<string, string>
    urlPlaceholder: string
    urlMappings: {
      regex: RegExp
      groups: string[]
    }
  }
}

export type TransformOptions = {
  url: string
  width: number
  height: number
  provider: string
}

const providerConfig: ProviderConfig = {
  bigcommerce: {
    keyMaps: {
      storeHash: "storeHash",
      productId: "productId",
      imageId: "imageId",
      filename: "filename"
    },
    urlPlaceholder:
      "https://{base}/s-{storeHash}/images/stencil/{width}x{height}/products/{productId}/{imageId}/{filename}",
    urlMappings: {
      regex: /^https?:\/\/([^/]+)\/s-([^/]+)\/products\/(\d+)\/images\/(\d+)\/(.+)$/,
      groups: ["base", "storeHash", "productId", "imageId", "filename"]
    }
  },
  shopify: {
    keyMaps: {
      productId: "productId",
      imageId: "imageId"
    },
    urlPlaceholder: "https://{base}/s/files/1/1183/1048/products/{productId}_{width}x{height}.{imageId}{query}",
    urlMappings: {
      regex: /^https?:\/\/([^/]+)\/s\/files\/\d+\/\d+\/\d+\/products\/([^/]+)\.(.+)(\?.+)?$/,
      groups: ["base", "productId", "imageId", "query"]
    }
  }
}

export function extractParams(url: string, provider: string): Record<string, string> {
  const config = providerConfig[provider]
  const { urlMappings } = config

  const match = url.match(urlMappings.regex)
  if (!match) {
    throw new Error(`URL does not match the expected format for provider: ${provider}`)
  }

  const params: Record<string, string> = {}
  urlMappings.groups.forEach((key, index) => {
    params[key] = match[index + 1] // Match groups start at index 1
  })

  return params
}
// https://cdn.shopify.com/s/files/1/1183/1048/products/boat-shoes.jpeg?v=1459175177
// https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg
function generate({ url, width, height, provider }: TransformOptions): string {
  const config = providerConfig[provider]
  const params = extractParams(url, provider)

  const allParams = { ...params, width: width.toString(), height: height.toString() }

  return Object.entries(allParams).reduce(
    (resultUrl, [key, value]) => resultUrl.replace(`{${key}}`, value || ""),
    config.urlPlaceholder
  )
}

export const transformUrl = (options: TransformOptions) => {
  if (!providerConfig[options.provider]) {
    return options.url
  }
  try {
    return generate({
      ...options,
      ...extractParams(options.url, options.provider)
    })
  } catch (error) {
    console.error(`Error transforming URL for provider ${options.provider}:`, error)
    return options.url
  }
}
