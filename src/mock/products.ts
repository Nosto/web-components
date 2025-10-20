import type { ShopifyProduct, ShopifyVariant } from "../components/SimpleCard/types"

// Base variant template with common fields
const baseVariant: Omit<
  ShopifyVariant,
  "id" | "option1" | "option2" | "option3" | "name" | "options" | "price" | "compare_at_price"
> = {
  featured_image: null,
  available: true
}

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
      alt: "Product image",
      aspect_ratio: 1,
      preview_image: {
        aspect_ratio: 1,
        height: 400,
        width: 400,
        src: "https://picsum.photos/400/400?random=1"
      }
    }
  ],
  options: [
    {
      name: "Size",
      values: ["Small", "Medium", "Large"] // Multi-value option (visible)
    },
    {
      name: "Material",
      values: ["Cotton"] // Single-value option (hidden)
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 1001,
      option1: "Small",
      option2: "Cotton",
      option3: null,
      name: "Small / Cotton",
      options: ["Small", "Cotton"],
      price: 2499,
      compare_at_price: 2999
    },
    {
      ...baseVariant,
      id: 1002,
      option1: "Medium",
      option2: "Cotton",
      option3: null,
      name: "Medium / Cotton",
      options: ["Medium", "Cotton"],
      price: 2499,
      compare_at_price: 2999
    },
    {
      ...baseVariant,
      id: 1003,
      option1: "Large",
      option2: "Cotton",
      option3: null,
      name: "Large / Cotton",
      options: ["Large", "Cotton"],
      price: 2999,
      compare_at_price: 2999
    }
  ]
}

export const mockProductAllSingleValue: ShopifyProduct = {
  ...mockProductWithSingleValueOption,
  id: 789012,
  title: "All Single Value Product",
  options: [
    {
      name: "Size",
      values: ["One Size"] // Single value
    },
    {
      name: "Color",
      values: ["Natural"] // Single value
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 2001,
      option1: "One Size",
      option2: "Natural",
      option3: null,
      name: "One Size / Natural",
      options: ["One Size", "Natural"],
      price: 2499,
      compare_at_price: 2999
    }
  ]
}

// Base product for tests
const baseTestProduct: ShopifyProduct = {
  id: 123456,
  title: "Variant Test Product",
  vendor: "Test Brand",
  price: 1999,
  compare_at_price: 2499,
  url: "/products/variant-test-product",
  images: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  media: [
    {
      src: "https://example.com/image1.jpg",
      alt: "Product image 1",
      aspect_ratio: 1,
      preview_image: {
        aspect_ratio: 1,
        height: 300,
        width: 300,
        src: "https://example.com/image1.jpg"
      }
    }
  ],
  options: [
    {
      name: "Size",
      values: ["Small", "Medium", "Large"]
    },
    {
      name: "Color",
      values: ["Red", "Blue", "Green"]
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 1001,
      option1: "Small",
      option2: "Red",
      option3: null,
      name: "Small / Red",
      options: ["Small", "Red"],
      price: 1999,
      compare_at_price: null
    }
  ]
}

// Test products for VariantSelector component tests
export const mockProductWithSingleValueOptionTest: ShopifyProduct = {
  ...baseTestProduct,
  options: [
    {
      name: "Size",
      values: ["Small", "Medium", "Large"]
    },
    {
      name: "Material",
      values: ["Cotton"] // Single value option
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 3001,
      option1: "Small",
      option2: "Cotton",
      option3: null,
      name: "Small / Cotton",
      options: ["Small", "Cotton"],
      price: 1999,
      compare_at_price: null
    },
    {
      ...baseVariant,
      id: 3002,
      option1: "Medium",
      option2: "Cotton",
      option3: null,
      name: "Medium / Cotton",
      options: ["Medium", "Cotton"],
      price: 1999,
      compare_at_price: null
    },
    {
      ...baseVariant,
      id: 3003,
      option1: "Large",
      option2: "Cotton",
      option3: null,
      name: "Large / Cotton",
      options: ["Large", "Cotton"],
      price: 1999,
      compare_at_price: null
    }
  ]
}

export const mockProductWithAllSingleValueOptionsTest: ShopifyProduct = {
  ...baseTestProduct,
  options: [
    {
      name: "Size",
      values: ["Medium"] // Single value
    },
    {
      name: "Color",
      values: ["Red"] // Single value
    }
  ],
  variants: [
    {
      ...baseVariant,
      id: 4001,
      option1: "Medium",
      option2: "Red",
      option3: null,
      name: "Medium / Red",
      options: ["Medium", "Red"],
      price: 1999,
      compare_at_price: null
    }
  ]
}
