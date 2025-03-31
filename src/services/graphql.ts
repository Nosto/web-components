export const magentoQuery = `
    query getProductByUrlKey($handle: String!) {
      products(filter: { url_key: { eq: $handle } }) {
        items {
          id
          name
          sku
          description {
            html
          }
          url_key
          price_range {
            maximum_price {
              final_price {
                value
                currency
              }
            }
          }
          image {
            url
            label
          }
        }
      }
    }
  `
