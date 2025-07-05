import type { Operations } from "unpic/types"

type BigCommerceUrlGroups = {
  prefix: string
  suffix: string
  productId: string
  imageId: string
  format: string
  params?: string
  width: string
  height: string
}

function parseUrl(url: string) {
  const regex =
    /^(?<prefix>\/[a-z0-9-]+\/)products\/(?<productId>\d+)\/images\/(?<imageId>\d+)(?<suffix>\/[a-zA-Z0-9_-]+\.\d+)\.(?<width>\d+)\.(?<height>\d+)\.(?<format>.*)$/g
  const match = [...url.matchAll(regex)]
  return match.length ? (match[0].groups as BigCommerceUrlGroups) : null
}

function dimensionString(width: string | number | undefined, height: string | number | undefined) {
  return height ? `${width}x${height}` : `${width}w`
}

export function transform(src: string | URL, { width, height }: Operations) {
  const u = new URL(src.toString())
  if (u.pathname.includes("/images/stencil/")) {
    const dimenStr = dimensionString(width, height)
    u.pathname = u.pathname.replace(/images\/stencil\/[^/]+/, `images/stencil/${dimenStr}`)
    return u.toString()
  }
  const parseResult = parseUrl(u.pathname)

  if (!parseResult) {
    return src.toString()
  }

  const { prefix, suffix, productId, imageId, format, width: pathWidth, height: pathHeight } = parseResult
  const dimenStr = dimensionString(width || pathWidth, height || pathHeight)
  u.pathname = `${prefix}images/stencil/${dimenStr}/products/${productId}/${imageId}${suffix}.${format}`
  return u.toString()
}
