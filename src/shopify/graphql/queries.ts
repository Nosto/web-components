import { graphql } from "./graphql"

// Fragment for variant data used across queries
const VariantFragment = graphql(`
  fragment VariantFragment on ProductVariant {
    availableForSale
    title
    id
    image {
      url
    }
    price {
      currencyCode
      amount
    }
    compareAtPrice {
      currencyCode
      amount
    }
    product {
      id
      onlineStoreUrl
    }
    selectedOptions {
      name
      value
    }
  }
`)

// Query to get product by handle
export const ProductByHandleQuery = graphql(
  `
    query ProductByHandle($country: CountryCode!, $language: LanguageCode!, $handle: String!)
    @inContext(country: $country, language: $language) {
      product(handle: $handle) {
        id
        title
        vendor
        description
        encodedVariantExistence
        onlineStoreUrl
        availableForSale
        images(first: 10) {
          nodes {
            url
          }
        }
        featuredImage {
          url
        }
        adjacentVariants {
          ...VariantFragment
        }
        options(first: 50) {
          name
          optionValues {
            firstSelectableVariant {
              ...VariantFragment
            }
            name
            swatch {
              color
              image {
                alt
                id
                mediaContentType
                previewImage {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
  [VariantFragment]
)

// Query to get products by IDs
export const ProductsByIdsQuery = graphql(`
  query ProductsByIds($country: CountryCode!, $ids: [ID!]!) @inContext(country: $country) {
    nodes(ids: $ids) {
      ... on Product {
        id
        title
        vendor
        description
        encodedVariantExistence
        onlineStoreUrl
        availableForSale
        images(first: 10) {
          nodes {
            altText
            height
            width
            thumbhash
            url
          }
        }
        featuredImage {
          altText
          height
          width
          thumbhash
          url
        }
        options(first: 50) {
          name
          optionValues {
            name
            swatch {
              color
              image {
                alt
                id
                mediaContentType
                previewImage {
                  url
                  width
                  height
                  altText
                  thumbhash
                }
              }
            }
          }
        }
      }
    }
  }
`)

// Query to get example handles
export const ExampleHandlesQuery = graphql(`
  query ExampleHandles($first: Int!) {
    products(first: $first) {
      edges {
        node {
          handle
        }
      }
    }
  }
`)
