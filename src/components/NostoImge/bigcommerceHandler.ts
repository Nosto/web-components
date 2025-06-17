import { Operations, URLExtractor, URLGenerator, UrlTransformerOptions } from "unpic"
import { createOperationsHandlers, toUrl, toCanonicalUrlString, createExtractAndGenerate } from "unpic/utils"

//https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg
const myCdnOpsHandlers = createOperationsHandlers<Operations>({
  kvSeparator: "x",
  paramSeparator: "/"
})

const extract: URLExtractor = (src, options) => {
  const url = toUrl(src)
  const m = url.pathname.match(/^\/s-([^/]+)\/products\/(\d+)\/images\/(\d+)\/(.+)$/)
  if (!m) {
    return {
      src: toCanonicalUrlString(url),
      operations: {},
      options: {}
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, storeHash, productId, imageId, filename] = m

  // Remove query
  url.search = ""

  return {
    src: toCanonicalUrlString(url),
    operations: {},
    options: {
      ...options,
      baseUrl: url.origin,
      storeHash,
      productId,
      imageId,
      filename
    }
  }
}

const generate: URLGenerator = (src, operations, options) => {
  const url = toUrl(src)
  const localOptions = options as Record<string, unknown>
  url.search = myCdnOpsHandlers.operationsGenerator(operations)
  if (!localOptions?.storeHash || !localOptions?.productId || !localOptions?.imageId || !localOptions?.filename) {
    return toCanonicalUrlString(url)
  }

  const { width, height } = operations
  url.pathname = `/s-${localOptions.storeHash}/images/stencil/${width}x${height}/products/${localOptions.productId}/${localOptions.imageId}/${localOptions.filename}`
  return toCanonicalUrlString(url)
}

export const transformBigcommerce = (options: Pick<UrlTransformerOptions, "height" | "width" | "url">) =>
  createExtractAndGenerate(extract, generate)(options.url, options) as string
