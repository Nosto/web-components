export function isNavigationApiSupported(): boolean {
  return typeof navigation !== "undefined" && !!navigation?.addEventListener && !!navigation?.removeEventListener
}
