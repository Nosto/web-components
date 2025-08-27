import type { Preview } from "@storybook/web-components-vite"
import { NostoCampaign } from "../src/components/NostoCampaign/NostoCampaign"
import { NostoCampaignSection } from "../src/components/NostoCampaignSection/NostoCampaignSection"
import { NostoControl } from "../src/components/NostoControl/NostoControl"
import { NostoDynamicCard } from "../src/components/NostoDynamicCard/NostoDynamicCard"
import { NostoImage } from "../src/components/NostoImage/NostoImage"
import { NostoProduct } from "../src/components/NostoProduct/NostoProduct"
import { NostoProductCard } from "../src/components/NostoProductCard/NostoProductCard"
import { NostoSkuOptions } from "../src/components/NostoSkuOptions/NostoSkuOptions"

// Register all custom elements globally for Storybook
if (!customElements.get("nosto-campaign")) {
  customElements.define("nosto-campaign", NostoCampaign)
}
if (!customElements.get("nosto-campaign-section")) {
  customElements.define("nosto-campaign-section", NostoCampaignSection)
}
if (!customElements.get("nosto-control")) {
  customElements.define("nosto-control", NostoControl)
}
if (!customElements.get("nosto-dynamic-card")) {
  customElements.define("nosto-dynamic-card", NostoDynamicCard)
}
if (!customElements.get("nosto-image")) {
  customElements.define("nosto-image", NostoImage)
}
if (!customElements.get("nosto-product")) {
  customElements.define("nosto-product", NostoProduct)
}
if (!customElements.get("nosto-product-card")) {
  customElements.define("nosto-product-card", NostoProductCard)
}
if (!customElements.get("nosto-sku-options")) {
  customElements.define("nosto-sku-options", NostoSkuOptions)
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    docs: {
      description: {
        component: "Web Components developed by Nosto for e-commerce platforms."
      }
    }
  },
  globalTypes: {
    theme: {
      description: "Global theme for components",
      defaultValue: "light",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: ["light", "dark"],
        showName: true
      }
    }
  }
}

export default preview
