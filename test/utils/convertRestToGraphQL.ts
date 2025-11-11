import type { ShopifyProduct as RestProduct, ShopifyVariant as RestVariant } from "@/shopify/rest/types"
import type { ShopifyProduct, ShopifyVariant, ShopifyOption, ShopifyOptionValue } from "@/shopify/graphql/types"

/**
 * Converts a REST API product mock to GraphQL format for testing
 */
export function convertRestToGraphQL(restProduct: RestProduct): { data: { product: ShopifyProduct } } {
  // Build option values with adjacentVariants
  const options: ShopifyOption[] = restProduct.options.map(restOption => {
    const optionValues: ShopifyOptionValue[] = restOption.values.map(valueName => {
      // Find all variants that have this option value
      const adjacentVariants = restProduct.variants
        .filter(v => {
          const optionIndex = restProduct.options.findIndex(o => o.name === restOption.name)
          return v.options[optionIndex] === valueName
        })
        .map(v => convertRestVariantToGraphQL(v, restProduct.options))

      // Use the first variant as firstSelectableVariant
      const firstSelectableVariant = adjacentVariants[0]

      return {
        name: valueName,
        firstSelectableVariant,
        adjacentVariants,
        swatch: null
      }
    })

    return {
      name: restOption.name,
      optionValues
    }
  })

  // Get all unique variants
  const variants = restProduct.variants.map(v => convertRestVariantToGraphQL(v, restProduct.options))

  const graphQLProduct: ShopifyProduct = {
    id: `gid://shopify/Product/${restProduct.id}`,
    title: restProduct.title,
    vendor: restProduct.vendor,
    description: restProduct.description,
    encodedVariantExistence: "",
    onlineStoreUrl: restProduct.url,
    availableForSale: restProduct.available,
    images:
      restProduct.images?.map(url => ({
        altText: null,
        height: 400,
        width: 400,
        thumbhash: null,
        url
      })) || [],
    featuredImage: {
      altText: null,
      height: 400,
      width: 400,
      thumbhash: null,
      url: restProduct.featured_image
    },
    options,
    price: {
      currencyCode: "USD",
      amount: (restProduct.price / 100).toFixed(2)
    },
    compareAtPrice: restProduct.compare_at_price
      ? {
          currencyCode: "USD",
          amount: (restProduct.compare_at_price / 100).toFixed(2)
        }
      : null,
    variants
  }

  return {
    data: {
      product: graphQLProduct
    }
  }
}

function convertRestVariantToGraphQL(restVariant: RestVariant, options: RestProduct["options"]): ShopifyVariant {
  return {
    id: `gid://shopify/ProductVariant/${restVariant.id}`,
    title: restVariant.title,
    availableForSale: restVariant.available,
    image: restVariant.featured_image
      ? {
          altText: null,
          height: 400,
          width: 400,
          thumbhash: null,
          url: restVariant.featured_image.src
        }
      : undefined,
    price: {
      currencyCode: "USD",
      amount: (restVariant.price / 100).toFixed(2)
    },
    compareAtPrice: restVariant.compare_at_price
      ? {
          currencyCode: "USD",
          amount: (restVariant.compare_at_price / 100).toFixed(2)
        }
      : null,
    selectedOptions: options.map((option, index) => ({
      name: option.name,
      value: restVariant.options[index]
    })),
    product: {
      onlineStoreUrl: ""
    }
  }
}
