import type { Operations } from "unpic/types"
import { Crop } from "./types"

export function transform(src: string | URL, { width, height, crop }: Operations & { crop?: Crop } = {}): string {
  const u = new URL(src.toString())

  // Extract path and extension
  const pathMatch = u.pathname.match(
    /^(.*\/[^\/]+?)(?:_(?:pico|icon|thumb|small|compact|medium|large|grande|original|master))?(?:_([0-9]*)x([0-9]*)(?:_(?:crop_)?([a-zA-Z0-9]+))?)?(\.[a-z0-9]+)$/i
  )
  if (!pathMatch) return src.toString()
  const [, base, wStr, hStr, cropStr, ext] = pathMatch

  // Remove size/crop from path, restore original filename
  u.pathname = `${base}${ext}`

  // Clear existing width/height query params to avoid mixed old/new dimensions
  u.searchParams.delete("width")
  u.searchParams.delete("height")

  // Build params object - only use extracted dimensions if no new dimensions are provided
  const params: Record<string, string | number | undefined> = {}

  if (width !== undefined) {
    params.width = width
  } else if (height === undefined && wStr) {
    // Only use extracted width if neither width nor height is provided
    params.width = parseInt(wStr, 10)
  }

  if (height !== undefined) {
    params.height = height
  } else if (width === undefined && hStr) {
    // Only use extracted height if neither width nor height is provided
    params.height = parseInt(hStr, 10)
  }

  if (crop !== undefined) {
    params.crop = crop
  } else if (cropStr) {
    params.crop = cropStr
  }

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      u.searchParams.set(key, String(value))
    }
  })
  return u.toString()
}
