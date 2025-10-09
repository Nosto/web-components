import type { ShopifyProduct } from "../components/SimpleCard/types"

export const mockProductWithSingleValueOption: ShopifyProduct = {
  id: 123456,
  title: "Single Value Demo T-Shirt",
  handle: "single-value-demo-tshirt",
  description: "A demo product showing single-value option behavior",
  vendor: "Demo Brand",
  tags: ["demo", "single-value"],
  images: ["https://picsum.photos/400/400?random=1"],
  featured_image: "https://picsum.photos/400/400?random=1",
  price: 2499,
  compare_at_price: 2999,
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  type: "Clothing",
  price_min: 2499,
  price_max: 2999,
  available: true,
  price_varies: true,
  compare_at_price_min: 2999,
  compare_at_price_max: 2999,
  compare_at_price_varies: false,
  url: "/products/single-value-demo-tshirt",
  media: [
    {
      id: 1,
      src: "https://picsum.photos/400/400?random=1",
      alt: "Product image",
      position: 1,
      aspect_ratio: 1,
      height: 400,
      width: 400,
      media_type: "image",
      preview_image: {
        aspect_ratio: 1,
        height: 400,
        width: 400,
        src: "https://picsum.photos/400/400?random=1"
      }
    }
  ],
  requires_selling_plan: false,
  selling_plan_groups: [],
  options: [
    {
      name: "Size",
      position: 1,
      values: ["Small", "Medium", "Large"] // Multi-value option (visible)
    },
    {
      name: "Material",
      position: 2,
      values: ["Cotton"] // Single-value option (hidden)
    }
  ],
  variants: [
    {
      id: 1001,
      title: "Small / Cotton",
      option1: "Small",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-SM-COT",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Small / Cotton",
      public_title: null,
      options: ["Small", "Cotton"],
      price: 2499,
      weight: 100,
      compare_at_price: 2999,
      inventory_quantity: 10,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    },
    {
      id: 1002,
      title: "Medium / Cotton",
      option1: "Medium",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-MD-COT",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Medium / Cotton",
      public_title: null,
      options: ["Medium", "Cotton"],
      price: 2499,
      weight: 120,
      compare_at_price: 2999,
      inventory_quantity: 15,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    },
    {
      id: 1003,
      title: "Large / Cotton",
      option1: "Large",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-LG-COT",
      requires_shipping: true,
      taxable: true,
      featured_image: null,
      available: true,
      name: "Large / Cotton",
      public_title: null,
      options: ["Large", "Cotton"],
      price: 2999,
      weight: 140,
      compare_at_price: 2999,
      inventory_quantity: 8,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    }
  ]
}

export const mockProductAllSingleValue: ShopifyProduct = {
  ...mockProductWithSingleValueOption,
  id: 789012,
  title: "All Single Value Product",
  handle: "all-single-value-product",
  description: "Product where all options have only one value each",
  options: [
    {
      name: "Size",
      position: 1,
      values: ["One Size"] // Single value
    },
    {
      name: "Color",
      position: 2,
      values: ["Natural"] // Single value
    }
  ],
  variants: [
    {
      ...mockProductWithSingleValueOption.variants[0],
      id: 2001,
      title: "One Size / Natural",
      option1: "One Size",
      option2: "Natural",
      options: ["One Size", "Natural"],
      sku: "DEMO-OS-NAT"
    }
  ]
}
