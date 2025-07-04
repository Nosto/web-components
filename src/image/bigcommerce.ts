import type { BaseTransformerProps } from "./types"
import { BigCommerceUrlGroups } from "./types"

function parseUrl(url: string) {
  const regex =
    /^(?<prefix>https:\/\/[a-z0-9.]+\/[a-z0-9-]+\/)products\/(?<productId>\d+)\/images\/(?<imageId>\d+)(?<suffix>\/[a-zA-Z0-9_-]+\.\d+)\.(?<width>\d+)\.(?<height>\d+)\.(?<format>.*)(\?(?<params>.*))?$/g

  const match = [...url.matchAll(regex)]

  return match.length ? (match[0].groups as BigCommerceUrlGroups) : null
}

export function transform({ imageUrl, width, height }: BaseTransformerProps) {
  const parseResult = parseUrl(imageUrl)

  if (!parseResult) {
    return imageUrl
  }

  const { prefix, suffix, productId, imageId, params, format, width: extractedW, height: extractedH } = parseResult

  const dimenH = height || extractedH
  const dimenW = width || extractedW
  const dimenStr = dimenH ? `${dimenW}x${dimenH}` : `${dimenW}w`
  return `${prefix}images/stencil/${dimenStr}/products/${productId}/${imageId}${suffix}.${format}${params ? `?${params}` : ""}`
}
