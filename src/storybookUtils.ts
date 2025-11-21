import type { ArgTypes, Decorator } from "@storybook/web-components-vite"
import { exampleHandlesLoader, updateShopifyRoot } from "./storybook"

/**
 * Common decorator for Shopify stories that updates the Shopify root URL
 */
export const shopifyRootDecorator: Decorator = (story, context) => {
  if (context.args?.root && typeof context.args.root === "string") {
    updateShopifyRoot(context.args.root)
  }
  return story()
}

/**
 * Common argTypes for Shopify product components
 */
export const shopifyProductArgTypes: ArgTypes = {
  root: {
    control: "text",
    description: "The Shopify store root URL"
  },
  imageMode: {
    control: "select",
    options: ["", "alternate", "carousel"],
    description:
      'Image display mode. Use "alternate" for hover image swap or "carousel" for image carousel with navigation'
  },
  brand: {
    control: "boolean",
    description: "Show brand/vendor data"
  },
  discount: {
    control: "boolean",
    description: "Show discount data"
  },
  rating: {
    control: "number",
    description: "Product rating (0-5 stars)"
  },
  sizes: {
    control: "text",
    description: "The sizes attribute for responsive images"
  }
}

/**
 * Common argTypes for grid layout in stories
 */
export const gridLayoutArgTypes: ArgTypes = {
  columns: {
    description: "Number of columns to display in the grid",
    control: { type: "range", min: 1, max: 8, step: 1 },
    table: {
      category: "Layout options"
    }
  },
  products: {
    description: "Number of products to display in the grid",
    control: { type: "range", min: 1, max: 20, step: 1 },
    table: {
      category: "Layout options"
    }
  }
}

/**
 * Common loaders for Shopify stories
 */
export const shopifyLoaders = [exampleHandlesLoader]

/**
 * Mock Nosto cart function for stories
 */
export function setupMockNostoCart(includeRecoId = true) {
  if (typeof window !== "undefined") {
    interface NostoWindow extends Window {
      Nosto?: {
        addSkuToCart: (skuId: string, productId: string, recoId: string) => void
      }
    }
    ;(window as NostoWindow).Nosto = {
      addSkuToCart: (skuId: string, productId: string, recoId: string) => {
        console.log("Add to cart clicked:", { skuId, productId, recoId })
        const message = includeRecoId
          ? `Added SKU ${skuId} of product ${productId} to cart (Recommendation: ${recoId})`
          : `Added SKU ${skuId} of product ${productId} to cart`
        alert(message)
      }
    }
  }
}
