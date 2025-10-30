interface Window {
  Nosto?: {
    addSkuToCart?: import("@nosto/nosto-js").addSkuToCart
    migrateToShopifyMarket?: import("./shopify").MigrateToShopifyMarket
  }
  Shopify?: {
    routes?: {
      root?: string
    }
    currency?: {
      active?: string
    }
    locale?: string
  }
}

// Navigation API types for browser feature detection
interface NavigateEvent extends Event {
  readonly canIntercept: boolean
  readonly destination: NavigationDestination
  readonly downloadRequest: string | null
  readonly formData: FormData | null
  readonly hashChange: boolean
  readonly info: unknown
  readonly navigationType: NavigationType
  readonly signal: AbortSignal
  readonly userInitiated: boolean
  intercept(options?: NavigationInterceptOptions): void
  scroll(): void
}

interface NavigationDestination {
  readonly url: string
  readonly key: string
  readonly id: string
  readonly index: number
  readonly sameDocument: boolean
  getState(): unknown
}

type NavigationType = "reload" | "push" | "replace" | "traverse"

interface NavigationInterceptOptions {
  handler?: () => Promise<void>
  focusReset?: "after-transition" | "manual"
  scroll?: "after-transition" | "manual"
}

interface Navigation extends EventTarget {
  readonly currentEntry: NavigationHistoryEntry | null
  readonly canGoBack: boolean
  readonly canGoForward: boolean
  navigate(url: string, options?: NavigationNavigateOptions): NavigationResult
  reload(options?: NavigationReloadOptions): NavigationResult
  traverseTo(key: string, options?: NavigationOptions): NavigationResult
  back(options?: NavigationOptions): NavigationResult
  forward(options?: NavigationOptions): NavigationResult
  readonly entries: ReadonlyArray<NavigationHistoryEntry>
  readonly transition: NavigationTransition | null
  addEventListener(
    type: "navigate" | "navigatesuccess" | "navigateerror" | "currententrychange",
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void
  removeEventListener(
    type: "navigate" | "navigatesuccess" | "navigateerror" | "currententrychange",
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void
}

interface NavigationHistoryEntry {
  readonly url: string
  readonly key: string
  readonly id: string
  readonly index: number
  readonly sameDocument: boolean
  getState(): unknown
}

interface NavigationNavigateOptions {
  state?: unknown
  history?: "auto" | "push" | "replace"
  info?: unknown
}

interface NavigationReloadOptions {
  state?: unknown
  info?: unknown
}

interface NavigationOptions {
  info?: unknown
}

interface NavigationResult {
  committed: Promise<NavigationHistoryEntry>
  finished: Promise<NavigationHistoryEntry>
}

interface NavigationTransition {
  readonly navigationType: NavigationType
  readonly from: NavigationHistoryEntry
  readonly finished: Promise<void>
}

declare const navigation: Navigation

declare module "*.css" {
  const content: string
  export default content
}

declare module "*.css?raw" {
  const content: string
  export default content
}
