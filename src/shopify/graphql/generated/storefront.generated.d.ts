/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontTypes from './storefront.types';

export type ProductByHandleQueryVariables = StorefrontTypes.Exact<{
  country: StorefrontTypes.CountryCode;
  language: StorefrontTypes.LanguageCode;
  handle: StorefrontTypes.Scalars['String']['input'];
}>;


export type ProductByHandleQuery = { product?: StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'title' | 'handle' | 'vendor' | 'description' | 'encodedVariantExistence' | 'onlineStoreUrl' | 'availableForSale'>
    & { images: { nodes: Array<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height'>> }, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height'>>, adjacentVariants: Array<(
      Pick<StorefrontTypes.ProductVariant, 'availableForSale' | 'title' | 'id'>
      & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height'>>, price: Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>, compareAtPrice?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>>, product: Pick<StorefrontTypes.Product, 'id' | 'onlineStoreUrl'>, selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
    )>, options: Array<(
      Pick<StorefrontTypes.ProductOption, 'name'>
      & { optionValues: Array<(
        Pick<StorefrontTypes.ProductOptionValue, 'name'>
        & { firstSelectableVariant?: StorefrontTypes.Maybe<(
          Pick<StorefrontTypes.ProductVariant, 'availableForSale' | 'title' | 'id'>
          & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height'>>, price: Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>, compareAtPrice?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>>, product: Pick<StorefrontTypes.Product, 'id' | 'onlineStoreUrl'>, selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
        )>, swatch?: StorefrontTypes.Maybe<(
          Pick<StorefrontTypes.ProductOptionValueSwatch, 'color'>
          & { image?: StorefrontTypes.Maybe<(
            Pick<StorefrontTypes.ExternalVideo, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>> }
          ) | (
            Pick<StorefrontTypes.MediaImage, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>> }
          ) | (
            Pick<StorefrontTypes.Model3d, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>> }
          ) | (
            Pick<StorefrontTypes.Video, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>> }
          )> }
        )> }
      )> }
    )> }
  )> };

export type VariantFragmentFragment = (
  Pick<StorefrontTypes.ProductVariant, 'availableForSale' | 'title' | 'id'>
  & { image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height'>>, price: Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>, compareAtPrice?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>>, product: Pick<StorefrontTypes.Product, 'id' | 'onlineStoreUrl'>, selectedOptions: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>> }
);

export type ProductsByIdsQueryVariables = StorefrontTypes.Exact<{
  country: StorefrontTypes.CountryCode;
  ids: Array<StorefrontTypes.Scalars['ID']['input']> | StorefrontTypes.Scalars['ID']['input'];
}>;


export type ProductsByIdsQuery = { nodes: Array<StorefrontTypes.Maybe<(
    Pick<StorefrontTypes.Product, 'id' | 'title' | 'handle' | 'vendor' | 'description' | 'encodedVariantExistence' | 'onlineStoreUrl' | 'availableForSale'>
    & { images: { nodes: Array<Pick<StorefrontTypes.Image, 'altText' | 'height' | 'width' | 'thumbhash' | 'url'>> }, featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'altText' | 'height' | 'width' | 'thumbhash' | 'url'>>, options: Array<(
      Pick<StorefrontTypes.ProductOption, 'name'>
      & { optionValues: Array<(
        Pick<StorefrontTypes.ProductOptionValue, 'name'>
        & { swatch?: StorefrontTypes.Maybe<(
          Pick<StorefrontTypes.ProductOptionValueSwatch, 'color'>
          & { image?: StorefrontTypes.Maybe<(
            Pick<StorefrontTypes.ExternalVideo, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height' | 'altText' | 'thumbhash'>> }
          ) | (
            Pick<StorefrontTypes.MediaImage, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height' | 'altText' | 'thumbhash'>> }
          ) | (
            Pick<StorefrontTypes.Model3d, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height' | 'altText' | 'thumbhash'>> }
          ) | (
            Pick<StorefrontTypes.Video, 'alt' | 'id' | 'mediaContentType'>
            & { previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url' | 'width' | 'height' | 'altText' | 'thumbhash'>> }
          )> }
        )> }
      )> }
    )> }
  )>> };

export type ExampleHandlesQueryVariables = StorefrontTypes.Exact<{
  first: StorefrontTypes.Scalars['Int']['input'];
}>;


export type ExampleHandlesQuery = { products: { edges: Array<{ node: Pick<StorefrontTypes.Product, 'handle'> }> } };

interface GeneratedQueryTypes {
  "query ProductByHandle($country: CountryCode!, $language: LanguageCode!, $handle: String!) @inContext(country: $country, language: $language) {\n  product(handle: $handle) {\n    id\n    title\n    handle\n    vendor\n    description\n    encodedVariantExistence\n    onlineStoreUrl\n    availableForSale\n    images(first: 10) {\n      nodes {\n        url\n        width\n        height\n      }\n    }\n    featuredImage {\n      url\n      width\n      height\n    }\n    adjacentVariants {\n      ...VariantFragment\n    }\n    options(first: 50) {\n      name\n      optionValues {\n        firstSelectableVariant {\n          ...VariantFragment\n        }\n        name\n        swatch {\n          color\n          image {\n            alt\n            id\n            mediaContentType\n            previewImage {\n              url\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment VariantFragment on ProductVariant {\n  availableForSale\n  title\n  id\n  image {\n    url\n    width\n    height\n  }\n  price {\n    currencyCode\n    amount\n  }\n  compareAtPrice {\n    currencyCode\n    amount\n  }\n  product {\n    id\n    onlineStoreUrl\n  }\n  selectedOptions {\n    name\n    value\n  }\n}": {return: ProductByHandleQuery, variables: ProductByHandleQueryVariables},
  "query ProductsByIds($country: CountryCode!, $ids: [ID!]!) @inContext(country: $country) {\n  nodes(ids: $ids) {\n    ... on Product {\n      id\n      title\n      handle\n      vendor\n      description\n      encodedVariantExistence\n      onlineStoreUrl\n      availableForSale\n      images(first: 10) {\n        nodes {\n          altText\n          height\n          width\n          thumbhash\n          url\n        }\n      }\n      featuredImage {\n        altText\n        height\n        width\n        thumbhash\n        url\n      }\n      options(first: 50) {\n        name\n        optionValues {\n          name\n          swatch {\n            color\n            image {\n              alt\n              id\n              mediaContentType\n              previewImage {\n                url\n                width\n                height\n                altText\n                thumbhash\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}": {return: ProductsByIdsQuery, variables: ProductsByIdsQueryVariables},
  "query ExampleHandles($first: Int!) {\n  products(first: $first) {\n    edges {\n      node {\n        handle\n      }\n    }\n  }\n}": {return: ExampleHandlesQuery, variables: ExampleHandlesQueryVariables},
}

interface GeneratedMutationTypes {
}
declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
