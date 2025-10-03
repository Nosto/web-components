export function normalizeUrl(src: string | URL, u: URL) {
  if (src.toString().startsWith("//")) {
    // Preserve protocol-relative URLs
    return u.toString().substring(u.protocol.length)
  }
  return u.toString()
}
