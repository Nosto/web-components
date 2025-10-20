import type { ShopifyProduct } from "../components/SimpleCard/types"

// Simplified mock products for testing
export const mockProductWithSingleValueOption: ShopifyProduct = {
  id: 123456,
  title: "Single Value Demo T-Shirt",
  vendor: "Demo Brand",
  price: 2499,
  compare_at_price: 2999,
  url: "/products/single-value-demo-tshirt",
  images: ["https://picsum.photos/400/400?random=1"],
  media: [
    {
      src: "https://picsum.photos/400/400?random=1",
      aspect_ratio: 1
    }
  ],
  handle: "single-value-demo-tshirt",
  description: "A demo product showing single-value option behavior",
  tags: ["demo", "single-value"],
  featured_image: "https://picsum.photos/400/400?random=1",
  variants: [
    {
      id: 1001,
      name: "Small / Cotton",
      price: 2499,
      compare_at_price: 2999,
      featured_image: {
        src: "https://picsum.photos/400/400?random=1"
      }
    },
    {
      id: 1002,
      name: "Medium / Cotton",
      price: 2499,
      compare_at_price: 2999,
      featured_image: {
        src: "https://picsum.photos/400/400?random=1"
      }
    },
    {
      id: 1003,
      name: "Large / Cotton",
      price: 2999,
      compare_at_price: 2999,
      featured_image: {
        src: "https://picsum.photos/400/400?random=1"
      }
    }
  ]
}

export const mockProductAllSingleValue: ShopifyProduct = {
  ...mockProductWithSingleValueOption,
  id: 789012,
  title: "All Single Value Product",
  handle: "all-single-value-product",
  description: "Product where all options have only one value each",
  variants: [
    {
      id: 2001,
      name: "One Size / Natural",
      price: 2499,
      compare_at_price: 2999,
      featured_image: {
        src: "https://picsum.photos/400/400?random=1"
      }
    }
  ]
}

// These are simplified stubs for compatibility
export const mockProductWithSingleValueOptionTest = mockProductWithSingleValueOption
export const mockProductWithAllSingleValueOptionsTest = mockProductAllSingleValue
