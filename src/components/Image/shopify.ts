import { normalizeUrl } from "./normalizeUrl"
import type { Options } from "./types"

export function transform(src: string | URL, { width, height }: Options = {}): string {
  const u = new URL(src.toString(), window.location.origin)

  // Extract path and extension
  const pathMatch = u.pathname.match(
    /^(.*\/[^\/]+?)(?:_(?:pico|icon|thumb|small|compact|medium|large|grande|original|master))?(?:_([0-9]*)x([0-9]*)(?:_(?:crop_)?([a-zA-Z0-9]+))?)?(\.[a-z0-9]+)$/i
  )
  if (!pathMatch) return src.toString()
  const [, base, wStr, hStr, , ext] = pathMatch

  // Remove size/crop from path, restore original filename
  u.pathname = `${base}${ext}`

  const params = {
    width: width ?? (wStr && parseInt(wStr, 10)),
    height: height ?? (hStr && parseInt(hStr, 10))
  }
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      u.searchParams.set(key, String(value))
    }
  })

  return normalizeUrl(src, u)
}
