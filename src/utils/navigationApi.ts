export function isNavigationApiSupported() {
  return typeof navigation !== "undefined" && !!navigation?.addEventListener && !!navigation?.removeEventListener
}
