import type {
  ShopifyProduct,
  ShopifyVariant,
  ShopifyOption,
  ShopifyOptionValue,
  ShopifyImage,
  ShopifyMoney,
  ShopifySelectedOption
} from "@/shopify/graphql/types"

// Builder functions for creating mock data

export function createMoney(amount: string, currencyCode = "USD"): ShopifyMoney {
  return { currencyCode, amount }
}

export function createImage(url: string, options: Partial<ShopifyImage> = {}): ShopifyImage {
  return {
    altText: options.altText ?? "Product image",
    height: options.height ?? 400,
    width: options.width ?? 400,
    thumbhash: options.thumbhash ?? null,
    url
  }
}

export function createSelectedOption(name: string, value: string): ShopifySelectedOption {
  return { name, value }
}

export function createVariant(
  id: string,
  title: string,
  options: {
    availableForSale?: boolean
    selectedOptions?: ShopifySelectedOption[]
    price?: string | ShopifyMoney
    compareAtPrice?: string | ShopifyMoney | null
    image?: ShopifyImage
    productUrl?: string
  } = {}
): ShopifyVariant {
  return {
    id: `gid://shopify/ProductVariant/${id}`,
    title,
    availableForSale: options.availableForSale ?? true,
    selectedOptions: options.selectedOptions ?? [],
    price: typeof options.price === "string" ? createMoney(options.price) : (options.price ?? createMoney("19.99")),
    compareAtPrice:
      options.compareAtPrice === undefined
        ? null
        : typeof options.compareAtPrice === "string"
          ? createMoney(options.compareAtPrice)
          : options.compareAtPrice,
    image: options.image,
    product: options.productUrl ? { onlineStoreUrl: options.productUrl } : undefined
  }
}

export function createOptionValue(
  name: string,
  firstSelectableVariant: ShopifyVariant | null,
  swatch: string | null = null
): ShopifyOptionValue {
  return {
    name,
    swatch,
    firstSelectableVariant
  }
}

export function createOption(name: string, optionValues: ShopifyOptionValue[]): ShopifyOption {
  return {
    name,
    optionValues
  }
}

export function createProduct(
  id: string,
  options: {
    title?: string
    vendor?: string
    description?: string
    onlineStoreUrl?: string
    availableForSale?: boolean
    images?: ShopifyImage[]
    featuredImage?: ShopifyImage
    shopifyOptions?: ShopifyOption[]
    price?: string | ShopifyMoney
    compareAtPrice?: string | ShopifyMoney | null
    variants?: ShopifyVariant[]
    adjacentVariants?: ShopifyVariant[]
    encodedVariantExistence?: string
  } = {}
): ShopifyProduct {
  const defaultImage = createImage("https://picsum.photos/400/400?random=1")
  const images = options.images ?? [defaultImage]
  const featuredImage = options.featuredImage ?? images[0] ?? defaultImage

  return {
    id: `gid://shopify/Product/${id}`,
    title: options.title ?? "Mock Product",
    vendor: options.vendor ?? "Mock Brand",
    description: options.description ?? "A mock product for testing",
    encodedVariantExistence: options.encodedVariantExistence ?? "",
    onlineStoreUrl: options.onlineStoreUrl ?? "/products/mock-product",
    availableForSale: options.availableForSale ?? true,
    images,
    featuredImage,
    options: options.shopifyOptions ?? [],
    price: typeof options.price === "string" ? createMoney(options.price) : (options.price ?? createMoney("19.99")),
    compareAtPrice:
      options.compareAtPrice === undefined
        ? null
        : typeof options.compareAtPrice === "string"
          ? createMoney(options.compareAtPrice)
          : options.compareAtPrice,
    variants: options.variants ?? [],
    adjacentVariants: options.adjacentVariants ?? []
  }
}

// Legacy exports - refactored to use builder functions

const productUrl = "/products/single-value-demo-tshirt"

const smallCottonVariant = createVariant("1001", "Small / Cotton", {
  price: "24.99",
  compareAtPrice: "29.99",
  selectedOptions: [createSelectedOption("Size", "Small"), createSelectedOption("Material", "Cotton")],
  productUrl
})

const mediumCottonVariant = createVariant("1002", "Medium / Cotton", {
  price: "24.99",
  compareAtPrice: "29.99",
  selectedOptions: [createSelectedOption("Size", "Medium"), createSelectedOption("Material", "Cotton")],
  productUrl
})

const largeCottonVariant = createVariant("1003", "Large / Cotton", {
  price: "29.99",
  compareAtPrice: "29.99",
  selectedOptions: [createSelectedOption("Size", "Large"), createSelectedOption("Material", "Cotton")],
  productUrl
})

export const mockProductWithSingleValueOption: ShopifyProduct = createProduct("123456", {
  title: "Single Value Demo T-Shirt",
  vendor: "Demo Brand",
  description: "A demo product showing single-value option behavior",
  onlineStoreUrl: productUrl,
  price: "24.99",
  compareAtPrice: "29.99",
  shopifyOptions: [
    createOption("Size", [
      createOptionValue("Small", smallCottonVariant),
      createOptionValue("Medium", mediumCottonVariant),
      createOptionValue("Large", largeCottonVariant)
    ]),
    createOption("Material", [createOptionValue("Cotton", smallCottonVariant)])
  ],
  variants: [smallCottonVariant, mediumCottonVariant, largeCottonVariant]
})

export const mockProductAllSingleValue: ShopifyProduct = (() => {
  const productUrl2 = "/products/all-single-value-product"
  const oneSizeNaturalVariant = createVariant("2001", "One Size / Natural", {
    price: "24.99",
    compareAtPrice: "29.99",
    selectedOptions: [createSelectedOption("Size", "One Size"), createSelectedOption("Color", "Natural")],
    productUrl: productUrl2
  })

  return createProduct("789012", {
    title: "All Single Value Product",
    vendor: "Demo Brand",
    description: "Product where all options have only one value each",
    onlineStoreUrl: productUrl2,
    price: "24.99",
    compareAtPrice: "29.99",
    shopifyOptions: [
      createOption("Size", [createOptionValue("One Size", oneSizeNaturalVariant)]),
      createOption("Color", [createOptionValue("Natural", oneSizeNaturalVariant)])
    ],
    variants: [oneSizeNaturalVariant]
  })
})()

// Base test product with common structure
const baseTestProductUrl = "/products/variant-test-product"
const baseTestImages = [
  createImage("https://example.com/image1.jpg", { altText: "Product image 1", height: 300, width: 300 }),
  createImage("https://example.com/image2.jpg", { altText: "Product image 2", height: 300, width: 300 })
]

const baseTestProduct: ShopifyProduct = createProduct("123456", {
  title: "Variant Test Product",
  vendor: "Test Brand",
  description: "A product with variants for testing",
  onlineStoreUrl: baseTestProductUrl,
  images: baseTestImages,
  featuredImage: baseTestImages[0],
  price: "19.99",
  shopifyOptions: [
    createOption("Size", [
      createOptionValue(
        "Small",
        createVariant("1001", "Small / Red", {
          price: "19.99",
          productUrl: baseTestProductUrl
        })
      ),
      createOptionValue(
        "Medium",
        createVariant("1002", "Medium / Blue", {
          price: "24.99",
          productUrl: baseTestProductUrl
        })
      ),
      createOptionValue(
        "Large",
        createVariant("1003", "Large / Red", {
          price: "29.99",
          productUrl: baseTestProductUrl
        })
      )
    ]),
    createOption("Color", [
      createOptionValue(
        "Red",
        createVariant("1001", "Small / Red", {
          price: "19.99",
          productUrl: baseTestProductUrl
        })
      ),
      createOptionValue(
        "Blue",
        createVariant("1002", "Medium / Blue", {
          price: "24.99",
          productUrl: baseTestProductUrl
        })
      ),
      createOptionValue(
        "Green",
        createVariant("1004", "Small / Green", {
          price: "19.99",
          productUrl: baseTestProductUrl
        })
      )
    ])
  ],
  variants: [
    createVariant("1001", "Small / Red", {
      price: "19.99",
      selectedOptions: [createSelectedOption("Size", "Small"), createSelectedOption("Color", "Red")]
    })
  ]
})

// Test products for VariantSelector component tests
export const mockProductWithSingleValueOptionTest: ShopifyProduct = (() => {
  const v1 = createVariant("3001", "Small / Cotton", {
    price: "19.99",
    selectedOptions: [createSelectedOption("Size", "Small"), createSelectedOption("Material", "Cotton")],
    productUrl: baseTestProductUrl
  })
  const v2 = createVariant("3002", "Medium / Cotton", {
    price: "19.99",
    selectedOptions: [createSelectedOption("Size", "Medium"), createSelectedOption("Material", "Cotton")],
    productUrl: baseTestProductUrl
  })
  const v3 = createVariant("3003", "Large / Cotton", {
    price: "19.99",
    selectedOptions: [createSelectedOption("Size", "Large"), createSelectedOption("Material", "Cotton")],
    productUrl: baseTestProductUrl
  })

  return {
    ...baseTestProduct,
    options: [
      createOption("Size", [
        createOptionValue("Small", v1),
        createOptionValue("Medium", v2),
        createOptionValue("Large", v3)
      ]),
      createOption("Material", [createOptionValue("Cotton", v1)])
    ],
    variants: [v1, v2, v3]
  }
})()

export const mockProductWithAllSingleValueOptionsTest: ShopifyProduct = (() => {
  const v1 = createVariant("4001", "Medium / Red", {
    price: "19.99",
    selectedOptions: [createSelectedOption("Size", "Medium"), createSelectedOption("Color", "Red")],
    productUrl: baseTestProductUrl
  })

  return {
    ...baseTestProduct,
    options: [
      createOption("Size", [createOptionValue("Medium", v1)]),
      createOption("Color", [createOptionValue("Red", v1)])
    ],
    variants: [v1]
  }
})()

// Mock products for test files

// For VariantSelector tests
export const mockProductWithVariants: ShopifyProduct = (() => {
  const smallRed = createVariant("1001", "Small / Red", {
    price: "19.99",
    selectedOptions: [createSelectedOption("Size", "Small"), createSelectedOption("Color", "Red")],
    productUrl: baseTestProductUrl
  })
  const mediumBlue = createVariant("1002", "Medium / Blue", {
    price: "24.99",
    selectedOptions: [createSelectedOption("Size", "Medium"), createSelectedOption("Color", "Blue")],
    productUrl: baseTestProductUrl
  })
  const largeRed = createVariant("1003", "Large / Red", {
    price: "29.99",
    selectedOptions: [createSelectedOption("Size", "Large"), createSelectedOption("Color", "Red")],
    productUrl: baseTestProductUrl
  })

  return {
    ...baseTestProduct,
    options: [
      createOption("Size", [
        createOptionValue("Small", smallRed),
        createOptionValue("Medium", mediumBlue),
        createOptionValue("Large", largeRed)
      ]),
      createOption("Color", [
        createOptionValue("Red", smallRed),
        createOptionValue("Blue", mediumBlue),
        createOptionValue(
          "Green",
          createVariant("1004", "Small / Green", {
            price: "19.99",
            productUrl: baseTestProductUrl
          })
        )
      ])
    ],
    variants: [smallRed, mediumBlue, largeRed]
  }
})()

export const mockProductWithoutVariants: ShopifyProduct = (() => {
  return {
    ...baseTestProduct,
    options: [],
    variants: [
      createVariant("2001", "Default", {
        price: "19.99",
        selectedOptions: []
      })
    ]
  }
})()

// For SimpleCard tests
const simpleCardImages = [
  createImage("https://example.com/image1.jpg", { altText: "Product image 1" }),
  createImage("https://example.com/image2.jpg", { altText: "Product image 2" })
]

export const mockProduct: ShopifyProduct = createProduct("123456", {
  title: "Awesome Test Product",
  vendor: "Test Brand",
  description: "A great product for testing",
  onlineStoreUrl: "/products/awesome-test-product",
  images: simpleCardImages,
  featuredImage: simpleCardImages[0],
  price: "19.99",
  compareAtPrice: "24.99",
  variants: [
    createVariant("789", "Default Title", {
      price: "19.99",
      compareAtPrice: "24.99",
      selectedOptions: []
    })
  ]
})
