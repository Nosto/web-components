import type { ShopifyProduct } from "@/shopify/graphql/types"

export const mockProductWithSingleValueOption: ShopifyProduct = {
  id: "gid://shopify/Product/123456",
  title: "Single Value Demo T-Shirt",
  vendor: "Demo Brand",
  description: "A demo product showing single-value option behavior",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/single-value-demo-tshirt",
  availableForSale: true,
  images: [
    {
      altText: "Product image",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://picsum.photos/400/400?random=1"
    }
  ],
  featuredImage: {
    altText: "Product image",
    height: 400,
    width: 400,
    thumbhash: null,
    url: "https://picsum.photos/400/400?random=1"
  },
  adjacentVariants: [],
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/single-value-demo-tshirt" }
          }
        }
      ]
    }
  ],
  price: { currencyCode: "USD", amount: "24.99" },
  compareAtPrice: { currencyCode: "USD", amount: "29.99" },
  variants: [
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

export const mockProductAllSingleValue: ShopifyProduct = {
  id: "gid://shopify/Product/789012",
  title: "All Single Value Product",
  vendor: "Demo Brand",
  description: "Product where all options have only one value each",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/all-single-value-product",
  availableForSale: true,
  adjacentVariants: [],
  images: [
    {
      altText: "Product image",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://picsum.photos/400/400?random=1"
    }
  ],
  featuredImage: {
    altText: "Product image",
    height: 400,
    width: 400,
    thumbhash: null,
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
            product: { id: "gid://shopify/Product/789012", onlineStoreUrl: "/products/all-single-value-product" }
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
            product: { id: "gid://shopify/Product/789012", onlineStoreUrl: "/products/all-single-value-product" }
          }
        }
      ]
    }
  ],
  price: { currencyCode: "USD", amount: "24.99" },
  compareAtPrice: { currencyCode: "USD", amount: "29.99" },
  variants: [
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
const baseTestProduct: ShopifyProduct = {
  id: "gid://shopify/Product/123456",
  title: "Variant Test Product",
  vendor: "Test Brand",
  description: "A product with variants for testing",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/variant-test-product",
  availableForSale: true,
  adjacentVariants: [],
  images: [
    {
      altText: "Product image 1",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image1.jpg"
    },
    {
      altText: "Product image 2",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image2.jpg"
    }
  ],
  featuredImage: {
    altText: "Product image 1",
    height: 300,
    width: 300,
    thumbhash: null,
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
          }
        }
      ]
    }
  ],
  price: { currencyCode: "USD", amount: "19.99" },
  compareAtPrice: null,
  variants: [
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
export const mockProductWithSingleValueOptionTest: ShopifyProduct = {
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
          }
        }
      ]
    }
  ],
  variants: [
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

export const mockProductWithAllSingleValueOptionsTest: ShopifyProduct = {
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
          }
        }
      ]
    }
  ],
  variants: [
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
export const mockProductWithVariants: ShopifyProduct = {
  id: "gid://shopify/Product/123456",
  title: "Variant Test Product",
  vendor: "Test Brand",
  description: "A product with variants for testing",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/variant-test-product",
  availableForSale: true,
  adjacentVariants: [],
  images: [
    {
      altText: "Product image 1",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image1.jpg"
    },
    {
      altText: "Product image 2",
      height: 300,
      width: 300,
      thumbhash: null,
      url: "https://example.com/image2.jpg"
    }
  ],
  featuredImage: {
    altText: "Product image 1",
    height: 300,
    width: 300,
    thumbhash: null,
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
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
            product: { id: "gid://shopify/Product/123456", onlineStoreUrl: "/products/variant-test-product" }
          }
        }
      ]
    }
  ],
  price: { currencyCode: "USD", amount: "19.99" },
  compareAtPrice: null,
  variants: [
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
export const mockProductWithoutVariants: ShopifyProduct = {
  ...mockProductWithVariants,
  options: [],
  variants: [
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
export const mockSimpleCardProduct: ShopifyProduct = {
  id: "gid://shopify/Product/123456",
  title: "Awesome Test Product",
  vendor: "Test Brand",
  description: "A great product for testing",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/awesome-test-product",
  availableForSale: true,
  adjacentVariants: [],
  images: [
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
  ],
  featuredImage: {
    altText: "Product image 1",
    height: 400,
    width: 400,
    thumbhash: null,
    url: "https://example.com/image1.jpg"
  },
  options: [],
  price: { currencyCode: "USD", amount: "19.99" },
  compareAtPrice: { currencyCode: "USD", amount: "24.99" },
  variants: [
    {
      id: "gid://shopify/ProductVariant/789",
      title: "Default Title",
      availableForSale: true,
      selectedOptions: [],
      price: { currencyCode: "USD", amount: "19.99" },
      compareAtPrice: { currencyCode: "USD", amount: "24.99" },
      product: { id: "gid://shopify/Product/123", onlineStoreUrl: "/products/test-product" }
    }
  ]
}

export const mockFetchProduct1: ShopifyProduct = {
  id: "gid://shopify/Product/1",
  title: "Product 1",
  vendor: "Vendor 1",
  description: "Description 1",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/product-1",
  availableForSale: true,
  adjacentVariants: [],
  images: [
    {
      altText: "Image 1",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://example.com/image1.jpg"
    }
  ],
  featuredImage: {
    altText: "Image 1",
    height: 400,
    width: 400,
    thumbhash: null,
    url: "https://example.com/image1.jpg"
  },
  options: [],
  price: { currencyCode: "USD", amount: "10.00" },
  compareAtPrice: null,
  variants: []
}

export const mockFetchProduct2: ShopifyProduct = {
  id: "gid://shopify/Product/2",
  title: "Product 2",
  vendor: "Vendor 2",
  description: "Description 2",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/product-2",
  availableForSale: true,
  adjacentVariants: [],
  images: [
    {
      altText: "Image 2",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://example.com/image2.jpg"
    }
  ],
  featuredImage: {
    altText: "Image 2",
    height: 400,
    width: 400,
    thumbhash: null,
    url: "https://example.com/image2.jpg"
  },
  options: [],
  price: { currencyCode: "USD", amount: "20.00" },
  compareAtPrice: null,
  variants: []
}

export const mockFetchProduct3: ShopifyProduct = {
  id: "gid://shopify/Product/3",
  title: "Product 3",
  vendor: "Vendor 3",
  description: "Description 3",
  encodedVariantExistence: "",
  onlineStoreUrl: "/products/product-3",
  availableForSale: true,
  adjacentVariants: [],
  images: [
    {
      altText: "Image 3",
      height: 400,
      width: 400,
      thumbhash: null,
      url: "https://example.com/image3.jpg"
    }
  ],
  featuredImage: {
    altText: "Image 3",
    height: 400,
    width: 400,
    thumbhash: null,
    url: "https://example.com/image3.jpg"
  },
  options: [],
  price: { currencyCode: "USD", amount: "30.00" },
  compareAtPrice: null,
  variants: []
}
