/* eslint-disable */
import type * as StorefrontTypes from './storefront.types.d.ts';

export type VariantFragmentFragment = Pick<
  StorefrontTypes.ProductVariant,
  'availableForSale' | 'title' | 'id'
> & {
  image?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>>;
  price: Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>;
  compareAtPrice?: StorefrontTypes.Maybe<Pick<StorefrontTypes.MoneyV2, 'currencyCode' | 'amount'>>;
  product: Pick<StorefrontTypes.Product, 'onlineStoreUrl'>;
  selectedOptions?: Array<Pick<StorefrontTypes.SelectedOption, 'name' | 'value'>>;
};

export type ProductByHandleQueryVariables = StorefrontTypes.Exact<{
  country: StorefrontTypes.CountryCode;
  language: StorefrontTypes.LanguageCode;
  handle: StorefrontTypes.Scalars['String']['input'];
}>;

export type ProductByHandleQuery = {
  product?: StorefrontTypes.Maybe<
    Pick<
      StorefrontTypes.Product,
      | 'id'
      | 'title'
      | 'vendor'
      | 'description'
      | 'encodedVariantExistence'
      | 'onlineStoreUrl'
      | 'availableForSale'
    > & {
      images: {
        nodes: Array<Pick<StorefrontTypes.Image, 'url'>>;
      };
      featuredImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>>;
      adjacentVariants: Array<VariantFragmentFragment>;
      options: Array<
        Pick<StorefrontTypes.ProductOption, 'name'> & {
          optionValues: Array<
            Pick<StorefrontTypes.ProductOptionValue, 'name'> & {
              firstSelectableVariant?: StorefrontTypes.Maybe<VariantFragmentFragment>;
              swatch?: StorefrontTypes.Maybe<
                Pick<StorefrontTypes.ProductOptionValueSwatch, 'color'> & {
                  image?: StorefrontTypes.Maybe<
                    Pick<StorefrontTypes.Media, 'alt' | 'id' | 'mediaContentType'> & {
                      previewImage?: StorefrontTypes.Maybe<Pick<StorefrontTypes.Image, 'url'>>;
                    }
                  >;
                }
              >;
            }
          >;
        }
      >;
    }
  >;
};

export type ProductsByIdsQueryVariables = StorefrontTypes.Exact<{
  country: StorefrontTypes.CountryCode;
  ids: Array<StorefrontTypes.Scalars['ID']['input']> | StorefrontTypes.Scalars['ID']['input'];
}>;

export type ProductsByIdsQuery = {
  nodes: Array<
    | (Pick<
        StorefrontTypes.Product,
        | 'id'
        | 'title'
        | 'vendor'
        | 'description'
        | 'encodedVariantExistence'
        | 'onlineStoreUrl'
        | 'availableForSale'
      > & {
        images: {
          nodes: Array<
            Pick<StorefrontTypes.Image, 'altText' | 'height' | 'width' | 'url'>
          >;
        };
        featuredImage?: StorefrontTypes.Maybe<
          Pick<StorefrontTypes.Image, 'altText' | 'height' | 'width' | 'url'>
        >;
        options: Array<
          Pick<StorefrontTypes.ProductOption, 'name'> & {
            optionValues: Array<
              Pick<StorefrontTypes.ProductOptionValue, 'name'> & {
                swatch?: StorefrontTypes.Maybe<
                  Pick<StorefrontTypes.ProductOptionValueSwatch, 'color'> & {
                    image?: StorefrontTypes.Maybe<
                      Pick<StorefrontTypes.Media, 'alt' | 'id' | 'mediaContentType'> & {
                        previewImage?: StorefrontTypes.Maybe<
                          Pick<StorefrontTypes.Image, 'url' | 'width' | 'height' | 'altText'>
                        >;
                      }
                    >;
                  }
                >;
              }
            >;
          }
        >;
      })
    | { __typename: 'NotProduct' }
  >;
};

interface GeneratedQueryTypes {
  '#graphql\nquery ProductByHandle': {
    return: ProductByHandleQuery;
    variables: ProductByHandleQueryVariables;
  };
  '#graphql\nquery ProductsByIds': {
    return: ProductsByIdsQuery;
    variables: ProductsByIdsQueryVariables;
  };
}

declare module '@shopify/storefront-api-client' {
  type InputMaybe<T> = StorefrontTypes.InputMaybe<T>;
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations {}
}
