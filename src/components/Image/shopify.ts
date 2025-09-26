import type { Operations } from "unpic/types"
import { Crop } from "./types"

export function transform(src: string | URL, { width, height, crop }: Operations & { crop?: Crop } = {}): string {
  const u = new URL(src.toString())

  // Extract path and extension
  const pathMatch = u.pathname.match(
    /^(.*\/[^\/]+?)(?:_(?:pico|icon|thumb|small|compact|medium|large|grande|original|master))?(?:_([0-9]*)x([0-9]*)(?:_(?:crop_)?([a-zA-Z0-9]+))?)?(\.[a-z0-9]+)$/i
  )
  if (!pathMatch) return src.toString()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, base, _wStr, _hStr, cropStr, ext] = pathMatch

  // Remove size/crop from path, restore original filename
  u.pathname = `${base}${ext}`

  const params = {
    width,
    height,
    crop: crop ?? cropStr
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      u.searchParams.set(key, String(value))
    } else {
      u.searchParams.delete(key)
    }
  })
  return u.toString()
}
