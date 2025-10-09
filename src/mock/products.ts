import type { ShopifyProduct, ShopifyVariant } from "../components/SimpleCard/types"

// Base variant template with common fields
const baseVariant: Omit<
  ShopifyVariant,
  | "id"
  | "title"
  | "option1"
  | "option2"
  | "option3"
  | "name"
  | "options"
  | "sku"
  | "price"
  | "weight"
  | "compare_at_price"
  | "inventory_quantity"
> = {
  requires_shipping: true,
  taxable: true,
  featured_image: null,
  available: true,
  public_title: null,
  inventory_management: null,
  inventory_policy: "deny",
  barcode: null,
  quantity_rule: { min: 1, max: null, increment: 1 },
  quantity_price_breaks: [],
  requires_selling_plan: false,
  selling_plan_allocations: []
}

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
      ...baseVariant,
      id: 1001,
      title: "Small / Cotton",
      option1: "Small",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-SM-COT",
      name: "Small / Cotton",
      options: ["Small", "Cotton"],
      price: 2499,
      weight: 100,
      compare_at_price: 2999,
      inventory_quantity: 10
    },
    {
      ...baseVariant,
      id: 1002,
      title: "Medium / Cotton",
      option1: "Medium",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-MD-COT",
      name: "Medium / Cotton",
      options: ["Medium", "Cotton"],
      price: 2499,
      weight: 120,
      compare_at_price: 2999,
      inventory_quantity: 15
    },
    {
      ...baseVariant,
      id: 1003,
      title: "Large / Cotton",
      option1: "Large",
      option2: "Cotton",
      option3: null,
      sku: "DEMO-LG-COT",
      name: "Large / Cotton",
      options: ["Large", "Cotton"],
      price: 2999,
      weight: 140,
      compare_at_price: 2999,
      inventory_quantity: 8
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
      ...baseVariant,
      id: 2001,
      title: "One Size / Natural",
      option1: "One Size",
      option2: "Natural",
      option3: null,
      sku: "DEMO-OS-NAT",
      name: "One Size / Natural",
      options: ["One Size", "Natural"],
      price: 2499,
      weight: 100,
      compare_at_price: 2999,
      inventory_quantity: 10
    }
  ]
}

// Base product for tests
const baseTestProduct: ShopifyProduct = {
  id: 123456,
  title: "Variant Test Product",
  handle: "variant-test-product",
  description: "A product with variants for testing",
  vendor: "Test Brand",
  tags: ["test", "variants"],
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  featured_image: "https://example.com/image1.jpg",
  price: 1999,
  compare_at_price: 2499,
  published_at: "2023-01-01T00:00:00Z",
  created_at: "2023-01-01T00:00:00Z",
  type: "Test",
  price_min: 1999,
  price_max: 2999,
  available: true,
  price_varies: true,
  compare_at_price_min: 2499,
  compare_at_price_max: 3499,
  compare_at_price_varies: true,
  url: "/products/variant-test-product",
  media: [
    {
      id: 1,
      src: "https://example.com/image1.jpg",
      alt: "Product image 1",
      position: 1,
      aspect_ratio: 1,
      height: 300,
      width: 300,
      media_type: "image",
      preview_image: {
        aspect_ratio: 1,
        height: 300,
        width: 300,
        src: "https://example.com/image1.jpg"
      }
    }
  ],
  requires_selling_plan: false,
  selling_plan_groups: [],
  options: [
    {
      name: "Size",
      position: 1,
      values: ["Small", "Medium", "Large"]
    },
    {
      name: "Color",
      position: 2,
      values: ["Red", "Blue", "Green"]
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 1001,
      title: "Small / Red",
      option1: "Small",
      option2: "Red",
      option3: null,
      sku: null,
      name: "Small / Red",
      options: ["Small", "Red"],
      price: 1999,
      weight: 100,
      compare_at_price: null,
      inventory_quantity: 10
    }
  ]
}

// Test products for VariantSelector component tests
export const mockProductWithSingleValueOptionTest: ShopifyProduct = {
  ...baseTestProduct,
  options: [
    {
      name: "Size",
      position: 1,
      values: ["Small", "Medium", "Large"]
    },
    {
      name: "Material",
      position: 2,
      values: ["Cotton"] // Single value option
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 3001,
      title: "Small / Cotton",
      option1: "Small",
      option2: "Cotton",
      option3: null,
      sku: null,
      name: "Small / Cotton",
      options: ["Small", "Cotton"],
      price: 1999,
      weight: 100,
      compare_at_price: null,
      inventory_quantity: 10
    },
    {
      ...baseVariant,
      id: 3002,
      title: "Medium / Cotton",
      option1: "Medium",
      option2: "Cotton",
      option3: null,
      sku: null,
      name: "Medium / Cotton",
      options: ["Medium", "Cotton"],
      price: 1999,
      weight: 100,
      compare_at_price: null,
      inventory_quantity: 10
    },
    {
      ...baseVariant,
      id: 3003,
      title: "Large / Cotton",
      option1: "Large",
      option2: "Cotton",
      option3: null,
      sku: null,
      name: "Large / Cotton",
      options: ["Large", "Cotton"],
      price: 1999,
      weight: 100,
      compare_at_price: null,
      inventory_quantity: 10
    }
  ]
}

export const mockProductWithAllSingleValueOptionsTest: ShopifyProduct = {
  ...baseTestProduct,
  options: [
    {
      name: "Size",
      position: 1,
      values: ["Medium"] // Single value
    },
    {
      name: "Color",
      position: 2,
      values: ["Red"] // Single value
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 4001,
      title: "Medium / Red",
      option1: "Medium",
      option2: "Red",
      option3: null,
      sku: null,
      name: "Medium / Red",
      options: ["Medium", "Red"],
      price: 1999,
      weight: 100,
      compare_at_price: null,
      inventory_quantity: 10
    }
  ]
}
