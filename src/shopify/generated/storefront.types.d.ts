/**
 * This file contains base Shopify Storefront API types
 * Generated to match @shopify/api-codegen-preset output structure
 * Based on Shopify Storefront API 2025-10
 */

export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }

/** Represents a monetary value with currency */
export type MoneyV2 = {
  __typename?: "MoneyV2"
  /** Decimal money amount */
  amount: Scalars["Decimal"]
  /** Currency of the money */
  currencyCode: CurrencyCode
}

/** ISO 4217 currency codes */
export enum CurrencyCode {
  Usd = "USD",
  Eur = "EUR",
  Gbp = "GBP",
  Cad = "CAD",
  Aud = "AUD"
  // Add more as needed
}

/** Represents an image */
export type Image = {
  __typename?: "Image"
  /** A word or phrase to share the nature or contents of an image */
  altText?: Maybe<Scalars["String"]>
  /** The original height of the image in pixels */
  height?: Maybe<Scalars["Int"]>
  /** The original width of the image in pixels */
  width?: Maybe<Scalars["Int"]>
  /** A unique identifier for the image */
  id?: Maybe<Scalars["ID"]>
  /** The location of the image as a URL */
  url: Scalars["URL"]
  /** The Thumbhash for the image */
  thumbhash?: Maybe<Scalars["String"]>
}

/** Represents a product */
export type Product = {
  __typename?: "Product"
  /** A globally-unique ID */
  id: Scalars["ID"]
  /** The product's title */
  title: Scalars["String"]
  /** The product's vendor name */
  vendor: Scalars["String"]
  /** Stripped description of the product, single line with HTML tags removed */
  description: Scalars["String"]
  /** A human-friendly unique string for the Product automatically generated from its title */
  handle: Scalars["String"]
  /** Encoded string that holds information about the product's available variants */
  encodedVariantExistence: Scalars["String"]
  /** The online store URL for the product */
  onlineStoreUrl?: Maybe<Scalars["URL"]>
  /** Whether the product is available for sale */
  availableForSale: Scalars["Boolean"]
  /** The featured image for the product */
  featuredImage?: Maybe<Image>
  /** List of images associated with the product */
  images: ImageConnection
  /** List of product options */
  options: ProductOption[]
  /** Variants that are adjacent to this product in the option value graph */
  adjacentVariants?: ProductVariant[]
}

/** Product options */
export type ProductOption = {
  __typename?: "ProductOption"
  /** The product option's ID */
  id?: Scalars["ID"]
  /** The product option's name */
  name: Scalars["String"]
  /** The product option values */
  optionValues: ProductOptionValue[]
}

/** Product option value */
export type ProductOptionValue = {
  __typename?: "ProductOptionValue"
  /** The ID of the option value */
  id?: Scalars["ID"]
  /** The name of the option value */
  name: Scalars["String"]
  /** The swatch associated with this option value */
  swatch?: Maybe<Swatch>
  /** The first selectable variant for this option value */
  firstSelectableVariant?: Maybe<ProductVariant>
}

/** Swatch information */
export type Swatch = {
  __typename?: "Swatch"
  /** The color value */
  color?: Maybe<Scalars["String"]>
  /** The swatch image */
  image?: Maybe<Image>
}

/** Represents a product variant */
export type ProductVariant = {
  __typename?: "ProductVariant"
  /** A globally-unique ID */
  id: Scalars["ID"]
  /** The variant's title */
  title: Scalars["String"]
  /** Whether the variant is available for sale */
  availableForSale: Scalars["Boolean"]
  /** Image associated with the product variant */
  image?: Maybe<Image>
  /** The product variant's price */
  price: MoneyV2
  /** The compare-at price of the variant */
  compareAtPrice?: Maybe<MoneyV2>
  /** List of product options applied to the variant */
  selectedOptions?: SelectedOption[]
  /** The product object that the product variant belongs to */
  product: Product
}

/** Selected option */
export type SelectedOption = {
  __typename?: "SelectedOption"
  /** The product option's name */
  name: Scalars["String"]
  /** The product option's value */
  value: Scalars["String"]
}

/** Connection to images */
export type ImageConnection = {
  __typename?: "ImageConnection"
  /** A list of edges */
  edges?: ImageEdge[]
  /** A list of the nodes contained in ImageEdge */
  nodes?: Image[]
}

/** Image edge */
export type ImageEdge = {
  __typename?: "ImageEdge"
  /** The item at the end of ImageEdge */
  node: Image
}

/** Scalar types */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Decimal: string
  URL: string
}

/** ISO 3166-1 alpha-2 country codes */
export enum CountryCode {
  Us = "US",
  Ca = "CA",
  Gb = "GB",
  Au = "AU"
  // Add more as needed
}

/** ISO 639-1 language codes */
export enum LanguageCode {
  En = "EN",
  Fr = "FR",
  De = "DE",
  Es = "ES"
  // Add more as needed
}

export type MediaContentType = "IMAGE" | "VIDEO" | "MODEL_3D" | "EXTERNAL_VIDEO"
