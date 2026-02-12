import { beforeAll, beforeEach, vi } from "vitest"
import { clearCache } from "@/utils/fetch"
// Import all components to trigger their @customElement decorators
import "@/components/Campaign/Campaign"
import "@/components/Control/Control"
import "@/components/DynamicCard/DynamicCard"
import "@/components/Image/Image"
import "@/components/Product/Product"
import "@/components/SkuOptions/SkuOptions"
import "@/components/Bundle/Bundle"

beforeAll(() => {
  // Components are automatically registered by their @customElement decorators
  // when the modules are imported above.
})

beforeEach(() => {
  document.body.innerHTML = ""
  vi.resetAllMocks()
  vi.unstubAllGlobals()
  clearCache()
})
