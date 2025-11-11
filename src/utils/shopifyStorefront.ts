import type { ShopifyProduct, ShopifyVariant, ShopifyOption } from "@/shopify/types"

/**
 * GraphQL query for fetching product data from Shopify Storefront API
 */
const PRODUCT_QUERY = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      vendor
      productType
      tags
      createdAt
      publishedAt
      availableForSale
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 250) {
        edges {
          node {
            url
            altText
          }
        }
      }
      featuredImage {
        url
        altText
      }
      media(first: 250) {
        edges {
          node {
            ... on MediaImage {
              id
              image {
                url
                altText
                width
                height
              }
              mediaContentType
            }
          }
        }
      }
      options {
        name
        values
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            availableForSale
            sku
            requiresShipping
            taxable
            barcode
            weight
            weightUnit
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            image {
              url
              altText
              width
              height
            }
            quantityAvailable
          }
        }
      }
    }
  }
`

type StorefrontApiConfig = {
  storefrontAccessToken: string
  shopDomain: string
  apiVersion?: string
}

/**
 * Fetch product data from Shopify Storefront API using GraphQL
 * @param handle - Product handle
 * @param config - Storefront API configuration
 * @returns Promise that resolves to ShopifyProduct
 */
export async function fetchProductFromStorefront(handle: string, config: StorefrontApiConfig): Promise<ShopifyProduct> {
  const { storefrontAccessToken, shopDomain, apiVersion = "2024-01" } = config

  const url = `https://${shopDomain}/api/${apiVersion}/graphql.json`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken
    },
    body: JSON.stringify({
      query: PRODUCT_QUERY,
      variables: { handle }
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch product from Storefront API: ${response.status} ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`)
  }

  if (!result.data?.product) {
    throw new Error(`Product not found: ${handle}`)
  }

  // Transform GraphQL response to match ShopifyProduct type
  return transformStorefrontProduct(result.data.product)
}

/**
 * Transform Storefront API GraphQL response to ShopifyProduct format
 */
function transformStorefrontProduct(gqlProduct: GraphQLProduct): ShopifyProduct {
  // Extract numeric ID from Shopify GID
  const numericId = extractNumericId(gqlProduct.id)

  // Transform images
  const images = gqlProduct.images.edges.map(edge => edge.node.url)
  const featuredImage = gqlProduct.featuredImage?.url || images[0] || ""

  // Transform media
  const media = gqlProduct.media.edges.map((edge, index) => {
    const node = edge.node
    return {
      id: index + 1,
      src: node.image.url,
      alt: node.image.altText || null,
      position: index + 1,
      aspect_ratio: node.image.width / node.image.height,
      height: node.image.height,
      width: node.image.width,
      media_type: "image",
      preview_image: {
        aspect_ratio: node.image.width / node.image.height,
        height: node.image.height,
        width: node.image.width,
        src: node.image.url
      }
    }
  })

  // Transform price range
  const priceMin = Math.round(parseFloat(gqlProduct.priceRange.minVariantPrice.amount) * 100)
  const priceMax = Math.round(parseFloat(gqlProduct.priceRange.maxVariantPrice.amount) * 100)
  const compareAtPriceMin = gqlProduct.compareAtPriceRange.minVariantPrice
    ? Math.round(parseFloat(gqlProduct.compareAtPriceRange.minVariantPrice.amount) * 100)
    : 0
  const compareAtPriceMax = gqlProduct.compareAtPriceRange.maxVariantPrice
    ? Math.round(parseFloat(gqlProduct.compareAtPriceRange.maxVariantPrice.amount) * 100)
    : 0

  // Transform options
  const options: ShopifyOption[] = gqlProduct.options.map((option, index) => ({
    name: option.name,
    position: index + 1,
    values: option.values
  }))

  // Transform variants
  const variants: ShopifyVariant[] = gqlProduct.variants.edges.map(edge => {
    const variant = edge.node
    const variantId = extractNumericId(variant.id)

    // Map selected options to option1, option2, option3
    const optionValues = variant.selectedOptions.map(opt => opt.value)
    const option1 = optionValues[0] || null
    const option2 = optionValues[1] || null
    const option3 = optionValues[2] || null

    return {
      id: variantId,
      title: variant.title,
      option1,
      option2,
      option3,
      sku: variant.sku || null,
      requires_shipping: variant.requiresShipping,
      taxable: variant.taxable,
      featured_image: variant.image
        ? {
            id: 0,
            product_id: numericId,
            position: 0,
            created_at: "",
            updated_at: "",
            alt: variant.image.altText || null,
            width: variant.image.width,
            height: variant.image.height,
            src: variant.image.url,
            variant_ids: [variantId]
          }
        : null,
      available: variant.availableForSale,
      name: variant.title,
      public_title: variant.title === "Default Title" ? null : variant.title,
      options: optionValues,
      price: Math.round(parseFloat(variant.price.amount) * 100),
      weight: variant.weight || 0,
      compare_at_price: variant.compareAtPrice ? Math.round(parseFloat(variant.compareAtPrice.amount) * 100) : null,
      inventory_quantity: variant.quantityAvailable || 0,
      inventory_management: null,
      inventory_policy: "deny",
      barcode: variant.barcode || null,
      quantity_rule: { min: 1, max: null, increment: 1 },
      quantity_price_breaks: [],
      requires_selling_plan: false,
      selling_plan_allocations: []
    }
  })

  return {
    id: numericId,
    title: gqlProduct.title,
    handle: gqlProduct.handle,
    description: gqlProduct.description,
    published_at: gqlProduct.publishedAt || "",
    created_at: gqlProduct.createdAt,
    vendor: gqlProduct.vendor,
    type: gqlProduct.productType,
    tags: gqlProduct.tags,
    price: priceMin,
    price_min: priceMin,
    price_max: priceMax,
    available: gqlProduct.availableForSale,
    price_varies: priceMin !== priceMax,
    compare_at_price: compareAtPriceMin > 0 ? compareAtPriceMin : null,
    compare_at_price_min: compareAtPriceMin,
    compare_at_price_max: compareAtPriceMax,
    compare_at_price_varies: compareAtPriceMin !== compareAtPriceMax,
    variants,
    images,
    featured_image: featuredImage,
    options,
    url: `/products/${gqlProduct.handle}`,
    media,
    requires_selling_plan: false,
    selling_plan_groups: []
  }
}

/**
 * Extract numeric ID from Shopify GID format (gid://shopify/Product/123456)
 */
function extractNumericId(gid: string): number {
  const parts = gid.split("/")
  return parseInt(parts[parts.length - 1], 10)
}

// GraphQL response types
type GraphQLProduct = {
  id: string
  title: string
  handle: string
  description: string
  vendor: string
  productType: string
  tags: string[]
  createdAt: string
  publishedAt: string
  availableForSale: boolean
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string }
    maxVariantPrice: { amount: string; currencyCode: string }
  }
  compareAtPriceRange: {
    minVariantPrice: { amount: string; currencyCode: string } | null
    maxVariantPrice: { amount: string; currencyCode: string } | null
  }
  images: {
    edges: Array<{ node: { url: string; altText: string | null } }>
  }
  featuredImage: { url: string; altText: string | null } | null
  media: {
    edges: Array<{
      node: {
        id: string
        image: { url: string; altText: string | null; width: number; height: number }
        mediaContentType: string
      }
    }>
  }
  options: Array<{ name: string; values: string[] }>
  variants: {
    edges: Array<{
      node: {
        id: string
        title: string
        availableForSale: boolean
        sku: string | null
        requiresShipping: boolean
        taxable: boolean
        barcode: string | null
        weight: number | null
        weightUnit: string
        selectedOptions: Array<{ name: string; value: string }>
        price: { amount: string; currencyCode: string }
        compareAtPrice: { amount: string; currencyCode: string } | null
        image: { url: string; altText: string | null; width: number; height: number } | null
        quantityAvailable: number
      }
    }>
  }
}
