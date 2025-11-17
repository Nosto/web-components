/**
 * This file contains generated types for GraphQL operations
 * Generated to match @shopify/api-codegen-preset output structure
 * Based on queries in src/shopify/graphql directory
 */

import type * as StorefrontTypes from "./storefront.types"

// ProductByHandle Query
export type ProductByHandleQueryVariables = StorefrontTypes.Exact<{
  country: StorefrontTypes.CountryCode
  language: StorefrontTypes.LanguageCode
  handle: StorefrontTypes.Scalars["String"]
}>

export type ProductByHandleQuery = {
  __typename?: "QueryRoot"
  product?: Maybe<ProductByHandleFragment>
}

export type ProductByHandleFragment = {
  __typename?: "Product"
  id: string
  title: string
  vendor: string
  description: string
  encodedVariantExistence: string
  onlineStoreUrl?: Maybe<string>
  availableForSale: boolean
  images: {
    __typename?: "ImageConnection"
    nodes?: Maybe<
      Array<{
        __typename?: "Image"
        url: string
      }>
    >
  }
  featuredImage?: Maybe<{
    __typename?: "Image"
    url: string
  }>
  adjacentVariants?: Maybe<Array<VariantFragment>>
  options: Array<{
    __typename?: "ProductOption"
    name: string
    optionValues: Array<{
      __typename?: "ProductOptionValue"
      firstSelectableVariant?: Maybe<VariantFragment>
      name: string
      swatch?: Maybe<{
        __typename?: "Swatch"
        color?: Maybe<string>
        image?: Maybe<{
          __typename?: "Image"
          alt?: Maybe<string>
          id?: Maybe<string>
          mediaContentType?: Maybe<string>
          previewImage?: Maybe<{
            __typename?: "Image"
            url: string
          }>
        }>
      }>
    }>
  }>
}

export type VariantFragment = {
  __typename?: "ProductVariant"
  availableForSale: boolean
  title: string
  id: string
  image?: Maybe<{
    __typename?: "Image"
    url: string
  }>
  price: {
    __typename?: "MoneyV2"
    currencyCode: string
    amount: string
  }
  compareAtPrice?: Maybe<{
    __typename?: "MoneyV2"
    currencyCode: string
    amount: string
  }>
  product: {
    __typename?: "Product"
    id: string
    onlineStoreUrl?: Maybe<string>
  }
  selectedOptions?: Maybe<
    Array<{
      __typename?: "SelectedOption"
      name: string
      value: string
    }>
  >
}

// ProductsByIds Query
export type ProductsByIdsQueryVariables = StorefrontTypes.Exact<{
  country: StorefrontTypes.CountryCode
  ids: Array<StorefrontTypes.Scalars["ID"]> | StorefrontTypes.Scalars["ID"]
}>

export type ProductsByIdsQuery = {
  __typename?: "QueryRoot"
  nodes: Array<
    | {
        __typename: "Product"
        id: string
        title: string
        vendor: string
        description: string
        encodedVariantExistence: string
        onlineStoreUrl?: Maybe<string>
        availableForSale: boolean
        images: {
          __typename?: "ImageConnection"
          nodes?: Maybe<
            Array<{
              __typename?: "Image"
              altText?: Maybe<string>
              height?: Maybe<number>
              width?: Maybe<number>
              thumbhash?: Maybe<string>
              url: string
            }>
          >
        }
        featuredImage?: Maybe<{
          __typename?: "Image"
          altText?: Maybe<string>
          height?: Maybe<number>
          width?: Maybe<number>
          thumbhash?: Maybe<string>
          url: string
        }>
        options: Array<{
          __typename?: "ProductOption"
          name: string
          optionValues: Array<{
            __typename?: "ProductOptionValue"
            name: string
            swatch?: Maybe<{
              __typename?: "Swatch"
              color?: Maybe<string>
              image?: Maybe<{
                __typename?: "Image"
                alt?: Maybe<string>
                id?: Maybe<string>
                mediaContentType?: Maybe<string>
                previewImage?: Maybe<{
                  __typename?: "Image"
                  url: string
                  width?: Maybe<number>
                  height?: Maybe<number>
                  altText?: Maybe<string>
                  thumbhash?: Maybe<string>
                }>
              }>
            }>
          }>
        }>
      }
    | { __typename: string }
  >
}

type Maybe<T> = T | null
