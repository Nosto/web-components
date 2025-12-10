import type { GraphQLProduct } from "@/shopify/graphql/types"

export const mockProductWithSingleValueOption: GraphQLProduct = {
  id: "gid://shopify/Product/123456",
  handle: "single-value-demo-tshirt",
  title: "Single Value Demo T-Shirt",
  vendor: "Demo Brand",
  description: "A demo product showing single-value option behavior",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/single-value-demo-tshirt",
  availableForSale: true,
  images: {
    nodes: [
      {
        height: 400,
        width: 400,
        url: "https://picsum.photos/400/400?random=1"
      }
    ]
  },
  featuredImage: {
    height: 400,
    width: 400,
    url: "https://picsum.photos/400/400?random=1"
  },
  options: [
    {
      name: "Size",
      optionValues: [
        {
          name: "Small",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1001",
            title: "Small / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: { currencyCode: "USD", amount: "29.99" },
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" },
            selectedOptions: []
          }
        },
        {
          name: "Medium",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1002",
            title: "Medium / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: { currencyCode: "USD", amount: "29.99" },
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" },
            selectedOptions: []
          }
        },
        {
          name: "Large",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1003",
            title: "Large / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "29.99" },
            compareAtPrice: { currencyCode: "USD", amount: "29.99" },
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" },
            selectedOptions: []
          }
        }
      ]
    },
    {
      name: "Material",
      optionValues: [
        {
          name: "Cotton",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1001",
            title: "Small / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: { currencyCode: "USD", amount: "29.99" },
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" },
            selectedOptions: []
          }
        }
      ]
    }
  ],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/1001",
      title: "Small / Cotton",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Small" },
        { name: "Material", value: "Cotton" }
      ],
      price: { currencyCode: "USD", amount: "24.99" },
      compareAtPrice: { currencyCode: "USD", amount: "29.99" },
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
    },
    {
      id: "gid://shopify/ProductVariant/1002",
      title: "Medium / Cotton",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Medium" },
        { name: "Material", value: "Cotton" }
      ],
      price: { currencyCode: "USD", amount: "24.99" },
      compareAtPrice: { currencyCode: "USD", amount: "29.99" },
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
    },
    {
      id: "gid://shopify/ProductVariant/1003",
      title: "Large / Cotton",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Large" },
        { name: "Material", value: "Cotton" }
      ],
      price: { currencyCode: "USD", amount: "29.99" },
      compareAtPrice: { currencyCode: "USD", amount: "29.99" },
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
    }
  ]
}

export const mockProductAllSingleValue: GraphQLProduct = {
  id: "gid://shopify/Product/789012",
  title: "All Single Value Product",
  handle: "all-single-value-product",
  vendor: "Demo Brand",
  description: "Product where all options have only one value each",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/all-single-value-product",
  availableForSale: true,
  images: {
    nodes: [
      {
        height: 400,
        width: 400,
        url: "https://picsum.photos/400/400?random=1"
      }
    ]
  },
  featuredImage: {
    height: 400,
    width: 400,
    url: "https://picsum.photos/400/400?random=1"
  },
  options: [
    {
      name: "Size",
      optionValues: [
        {
          name: "One Size",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/2001",
            title: "One Size / Natural",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: { currencyCode: "USD", amount: "29.99" },
            product: { id: "gid://shopify/Product/789012", onlineStoreUrl: "/products/all-single-value-product" },
            selectedOptions: []
          }
        }
      ]
    },
    {
      name: "Color",
      optionValues: [
        {
          name: "Natural",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/2001",
            title: "One Size / Natural",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: { currencyCode: "USD", amount: "29.99" },
            product: { id: "gid://shopify/Product/789012", onlineStoreUrl: "/products/all-single-value-product" },
            selectedOptions: []
          }
        }
      ]
    }
  ],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/2001",
      title: "One Size / Natural",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "One Size" },
        { name: "Color", value: "Natural" }
      ],
      price: { currencyCode: "USD", amount: "24.99" },
      compareAtPrice: { currencyCode: "USD", amount: "29.99" },
      product: { id: "gid://shopify/Product/789012", onlineStoreUrl: "/products/all-single-value-product" }
    }
  ]
}

// Base product for tests
const baseTestProduct: GraphQLProduct = {
  id: "gid://shopify/Product/123456",
  title: "Variant Test Product",
  handle: "variant-test-product",
  vendor: "Test Brand",
  description: "A product with variants for testing",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/variant-test-product",
  availableForSale: true,
  images: {
    nodes: [
      {
        height: 300,
        width: 300,
        url: "https://example.com/image1.jpg"
      },
      {
        height: 300,
        width: 300,
        url: "https://example.com/image2.jpg"
      }
    ]
  },
  featuredImage: {
    height: 300,
    width: 300,
    url: "https://example.com/image1.jpg"
  },
  options: [
    {
      name: "Size",
      optionValues: [
        {
          name: "Small",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1001",
            title: "Small / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Medium",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1002",
            title: "Medium / Blue",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Large",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1003",
            title: "Large / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "29.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    },
    {
      name: "Color",
      optionValues: [
        {
          name: "Red",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1001",
            title: "Small / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Blue",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1002",
            title: "Medium / Blue",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Green",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1004",
            title: "Small / Green",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    }
  ],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/1001",
      title: "Small / Red",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Small" },
        { name: "Color", value: "Red" }
      ],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    }
  ]
}

// Test products for VariantSelector component tests
export const mockProductWithSingleValueOptionTest: GraphQLProduct = {
  ...baseTestProduct,
  options: [
    {
      name: "Size",
      optionValues: [
        {
          name: "Small",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/3001",
            title: "Small / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Medium",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/3002",
            title: "Medium / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Large",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/3003",
            title: "Large / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    },
    {
      name: "Material",
      optionValues: [
        {
          name: "Cotton",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/3001",
            title: "Small / Cotton",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    }
  ],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/3001",
      title: "Small / Cotton",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Small" },
        { name: "Material", value: "Cotton" }
      ],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    },
    {
      id: "gid://shopify/ProductVariant/3002",
      title: "Medium / Cotton",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Medium" },
        { name: "Material", value: "Cotton" }
      ],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    },
    {
      id: "gid://shopify/ProductVariant/3003",
      title: "Large / Cotton",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Large" },
        { name: "Material", value: "Cotton" }
      ],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    }
  ]
}

export const mockProductWithAllSingleValueOptionsTest: GraphQLProduct = {
  ...baseTestProduct,
  options: [
    {
      name: "Size",
      optionValues: [
        {
          name: "Medium",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/4001",
            title: "Medium / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    },
    {
      name: "Color",
      optionValues: [
        {
          name: "Red",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/4001",
            title: "Medium / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    }
  ],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/4001",
      title: "Medium / Red",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Medium" },
        { name: "Color", value: "Red" }
      ],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    }
  ]
}

// Product with multiple variants for VariantSelector tests
export const mockProductWithVariants: GraphQLProduct = {
  id: "gid://shopify/Product/123456",
  handle: "variant-test-product",
  title: "Variant Test Product",
  vendor: "Test Brand",
  description: "A product with variants for testing",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/variant-test-product",
  availableForSale: true,
  images: {
    nodes: [
      {
        height: 300,
        width: 300,
        url: "https://example.com/image1.jpg"
      },
      {
        height: 300,
        width: 300,
        url: "https://example.com/image2.jpg"
      }
    ]
  },
  featuredImage: {
    height: 300,
    width: 300,
    url: "https://example.com/image1.jpg"
  },
  options: [
    {
      name: "Size",
      optionValues: [
        {
          name: "Small",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1001",
            title: "Small / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Medium",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1002",
            title: "Medium / Blue",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Large",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1003",
            title: "Large / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "29.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    },
    {
      name: "Color",
      optionValues: [
        {
          name: "Red",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1001",
            title: "Small / Red",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Blue",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1002",
            title: "Medium / Blue",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "24.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        },
        {
          name: "Green",
          swatch: null,
          firstSelectableVariant: {
            id: "gid://shopify/ProductVariant/1004",
            title: "Small / Green",
            availableForSale: true,
            price: { currencyCode: "USD", amount: "19.99" },
            compareAtPrice: null,
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" },
            selectedOptions: []
          }
        }
      ]
    }
  ],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/1001",
      title: "Small / Red",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Small" },
        { name: "Color", value: "Red" }
      ],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    },
    {
      id: "gid://shopify/ProductVariant/1002",
      title: "Medium / Blue",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Medium" },
        { name: "Color", value: "Blue" }
      ],
      price: { currencyCode: "USD", amount: "24.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    },
    {
      id: "gid://shopify/ProductVariant/1003",
      title: "Large / Red",
      availableForSale: true,
      selectedOptions: [
        { name: "Size", value: "Large" },
        { name: "Color", value: "Red" }
      ],
      price: { currencyCode: "USD", amount: "29.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    }
  ]
}

// Product without variants for VariantSelector tests
export const mockProductWithoutVariants: GraphQLProduct = {
  ...mockProductWithVariants,
  options: [],
  adjacentVariants: [
    {
      id: "gid://shopify/ProductVariant/2001",
      title: "Default",
      availableForSale: true,
      selectedOptions: [],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: null,
      product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
    }
  ]
}

// Basic product for SimpleCard tests
/**
 * Creates mock products for SimpleCard testing with unique handles and IDs.
 * @param count - Number of mock products to create
 * @returns Array of ShopifyProduct objects with handles like "product1", "product2", etc.
 *
 * Each product will have:
 *   - A unique handle ("product1", "product2", ...)
 *   - A unique product ID ("gid://shopify/Product/1", ...)
 *   - A unique variant ID ("gid://shopify/ProductVariant/1", ...)
 */
export const createMockShopifyProducts = (count: number): GraphQLProduct[] =>
  Array.from({ length: count }, (_, i) => {
    const handle = `product${i + 1}`
    return {
      id: `gid://shopify/Product/${i + 1}`,
      title: "Awesome Test Product",
      handle: handle,
      vendor: "Test Brand",
      description: "A great product for testing",
      encodedVariantExistence: "",
      onlineStoreUrl: `/products/${handle}`,
      availableForSale: true,
      images: {
        nodes: [
          {
            altText: "Product image 1",
            height: 400,
            width: 400,
            thumbhash: null,
            url: "https://example.com/image1.jpg"
          },
          {
            altText: "Product image 2",
            height: 400,
            width: 400,
            thumbhash: null,
            url: "https://example.com/image2.jpg"
          }
        ]
      },
      featuredImage: {
        altText: "Product image 1",
        height: 400,
        width: 400,
        thumbhash: null,
        url: "https://example.com/image1.jpg"
      },
      options: [],
      price: { currencyCode: "USD", amount: String(10.99 + i) },
      compareAtPrice: { currencyCode: "USD", amount: String(15.99 + i) },
      adjacentVariants: [
        {
          id: `gid://shopify/ProductVariant/${i + 1}`,
          title: "Default Title",
          availableForSale: true,
          selectedOptions: [],
          price: { currencyCode: "USD", amount: String(10.99 + i) },
          compareAtPrice: { currencyCode: "USD", amount: String(15.99 + i) },
          product: {
            id: `gid://shopify/Product/${i + 1}`,
            onlineStoreUrl: `/products/${handle}`
          }
        }
      ]
    }
  })
