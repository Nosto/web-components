import { beforeAll, beforeEach, vi } from "vitest"
import { clearCache } from "@/utils/fetch"
// Import all components to trigger their @customElement decorators
import "@/components/Campaign/Campaign"
import "@/components/Control/Control"
import "@/components/DynamicCard/DynamicCard"
import "@/components/Image/Image"
import "@/components/Popup/Popup"
import "@/components/Product/Product"
import "@/components/SectionCampaign/SectionCampaign"
import "@/components/SimpleCard/SimpleCard"
import "@/components/SkuOptions/SkuOptions"
import "@/components/VariantSelector/VariantSelector"

HTMLDialogElement.prototype.showModal = function () {
  this.toggleAttribute("open", true)
}
HTMLDialogElement.prototype.close = function () {
  this.toggleAttribute("open", false)
}

beforeAll(() => {
  // Components are automatically registered by their @customElement decorators
  // when the modules are imported above.
})

beforeEach(() => {
  document.body.innerHTML = ""
  vi.resetAllMocks()
  clearCache()
})
