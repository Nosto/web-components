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

  const params = {
    width: width ?? (wStr && parseInt(wStr, 10)),
    height: height ?? (hStr && parseInt(hStr, 10)),
    crop: crop ?? cropStr
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      u.searchParams.set(key, String(value))
    }
  })
  return u.toString()
}
