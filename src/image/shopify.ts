import type { Crop } from "./types"
import type { Dimension, ShopifyTransformerProps, ShopifyUrlGroups } from "./types"

function parseUrl(url: string) {
  const regex =
    /^(?<name>[a-z0-9-]+)(_(?<dimen>pico|icon|thumb|small|compact|medium|large|grande|original|master|(\d+x\d+))(_(?<crop>[a-z_]+))?)?\.(?<format>[a-z]+)(\?(?<params>.*))?$/g

  const lastURLSegment = url.substring(url.lastIndexOf("/") + 1)

  const match = [...lastURLSegment.matchAll(regex)]

  return match.length ? (match[0].groups as ShopifyUrlGroups) : null
}

function applyDimension({ width, height }: Dimension, params: URLSearchParams, extractedDimension = "") {
  const [partW, partH] = /^\d+x\d+$/.test(extractedDimension) ? extractedDimension.split("x") : []

  if (width || partW) {
    params.set("width", width || partW)
  }

  if (height || partH) {
    params.set("height", height || partH)
  }
}

function applyCrop(provided: Crop | undefined, extracted: Crop | undefined, params: URLSearchParams) {
  if (!extracted && !provided) {
    return
  }

  const cropPosition = extracted?.includes("_") ? extracted.split("_")[1] : undefined

  const cropValue = (provided || cropPosition)!
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

  applyDimension({ width: width?.toString(), height: height?.toString() }, searchParams, dimen)
  applyCrop(crop, cropMatch, searchParams)

  const url = new URL(`${name}.${format}`, baseUrlPrefix)
  url.search = searchParams.toString()
  return url.toString()
}
