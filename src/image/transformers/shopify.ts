import type { Crop } from "../types"
import type { Dimension, ShopifyTransformerProps, ShopifyUrlGroups } from "../types"

function parseUrl(url: string) {
  const regex =
    /^(?<name>[a-z0-9-]+)(_(?<dimen>pico|icon|thumb|small|compact|medium|large|grande|original|master|(\d+x\d+))(_(?<crop>[a-z_]+))?)?\.(?<format>[a-z]+)(\?(?<params>.*))?$/g

  const lastURLSegment = url.substring(url.lastIndexOf("/") + 1)

  const match = [...lastURLSegment.matchAll(regex)]

  return match.length ? (match[0].groups as ShopifyUrlGroups) : null
}

function applyDimension(
  { width, height }: Dimension,
  extractedDimension: string | undefined,
  pathSegments: string[] = [],
  params: URLSearchParams
) {
  if (width) {
    params.set("width", width)
  }
  if (height) {
    params.set("height", height)
  }

  // checking params object to make sure dimensions is not populated from extracted params
  const dimenMissing = !params.has("width") || !params.has("height")

  if (dimenMissing && extractedDimension) {
    if (/^\d+x\d+$/.test(extractedDimension)) {
      const [partW, partH] = extractedDimension.split("x")
      params.set("width", width || partW)
      params.set("height", height || partH)
    } else {
      pathSegments.push(extractedDimension)
    }
  }
}

function applyCrop(provided: Crop | undefined, extracted: Crop | undefined, params: URLSearchParams) {
  if (!extracted && !provided) {
    return
  }

  const cropValue = (provided || extracted)!
  params.set("crop", cropValue)
}

// TODO: support as many params as possible from unpic documentation
// https://unpic.pics/providers/shopify/
export function transform({ imageUrl, width, height, crop }: ShopifyTransformerProps) {
  const baseUrlPrefix = imageUrl.substring(0, imageUrl.lastIndexOf("/") + 1)

  const parseResult = parseUrl(imageUrl)

  if (!parseResult) {
    return imageUrl
  }

  const { name, dimen, crop: cropMatch = crop, format, params } = parseResult
  const searchParams = new URLSearchParams(params)
  const lastPathSegments = [name]

  applyDimension({ width: width?.toString(), height: height?.toString() }, dimen, lastPathSegments, searchParams)
  applyCrop(crop, cropMatch, searchParams)

  const url = new URL(`${lastPathSegments.join("_")}.${format}`, baseUrlPrefix)
  url.search = searchParams.toString()
  return url.toString()
}
