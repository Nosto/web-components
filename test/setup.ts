import { beforeAll, beforeEach, vi } from "vitest"
// Import all components to trigger their @customElement decorators
import "@/components/BundledCampaign/BundledCampaign"
import "@/components/Campaign/Campaign"
import "@/components/Control/Control"
import "@/components/DynamicCard/DynamicCard"
import "@/components/Image/Image"
import "@/components/Product/Product"
import "@/components/ProductCard/ProductCard"
import "@/components/SectionCampaign/SectionCampaign"
import "@/components/SkuOptions/SkuOptions"

beforeAll(() => {
  // Components are automatically registered by their @customElement decorators
  // when the modules are imported above.
})

beforeEach(() => {
  document.body.innerHTML = ""
  vi.resetAllMocks()
})
