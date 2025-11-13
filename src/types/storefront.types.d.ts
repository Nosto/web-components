export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never }
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never }

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  /** Represents an [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)-encoded date and time string */
  DateTime: { input: string; output: string }
  /** A signed decimal number */
  Decimal: { input: string; output: string }
  /** A string containing HTML code */
  HTML: { input: string; output: string }
  /** A [JSON](https://www.json.org/json-en.html) object */
  JSON: { input: unknown; output: unknown }
  /** A monetary value string */
  Money: { input: string; output: string }
  /** An RFC 3986 and RFC 3987-compliant URI string */
  URL: { input: string; output: string }
}

/** ISO 3166-1 alpha-2 country codes with some differences. */
export enum CountryCode {
  Us = "US",
  Gb = "GB",
  Ca = "CA",
  De = "DE",
  Fr = "FR",
  Au = "AU"
  // Add more as needed
}

/** Language codes supported by Shopify. */
export enum LanguageCode {
  En = "EN",
  Fr = "FR",
  De = "DE",
  Es = "ES"
  // Add more as needed
}

/** Currency codes. */
export enum CurrencyCode {
  Usd = "USD",
  Eur = "EUR",
  Gbp = "GBP",
  Cad = "CAD"
  // Add more as needed
}

/** Represents a money amount */
export type MoneyV2 = {
  __typename?: "MoneyV2"
  /** Decimal money amount. */
  amount: Scalars["Decimal"]["output"]
  /** Currency of the money. */
  currencyCode: CurrencyCode
}

/** Represents an image. */
export type Image = {
  __typename?: "Image"
  /** A word or phrase to share the nature or contents of an image. */
  altText?: Maybe<Scalars["String"]["output"]>
  /** The original height of the image in pixels. Returns `null` if the image is not hosted by Shopify. */
  height?: Maybe<Scalars["Int"]["output"]>
  /** A unique identifier for the image. */
  id?: Maybe<Scalars["ID"]["output"]>
  /** The location of the image as a URL. */
  url: Scalars["URL"]["output"]
  /** The original width of the image in pixels. Returns `null` if the image is not hosted by Shopify. */
  width?: Maybe<Scalars["Int"]["output"]>
}

/** An auto-generated type for paginating through multiple Images. */
export type ImageConnection = {
  __typename?: "ImageConnection"
  /** A list of edges. */
  edges: Array<ImageEdge>
  /** A list of the nodes contained in ImageEdge. */
  nodes: Array<Image>
}

/** An auto-generated type which holds one Image and a cursor during pagination. */
export type ImageEdge = {
  __typename?: "ImageEdge"
  /** A cursor for use in pagination. */
  cursor: Scalars["String"]["output"]
  /** The item at the end of ImageEdge. */
  node: Image
}

/** A product represents an individual item for sale in a Shopify store. */
export type Product = {
  __typename?: "Product"
  /** Indicates if at least one product variant is available for sale. */
  availableForSale: Scalars["Boolean"]["output"]
  /** A human-friendly unique string for the Product automatically generated from its title. */
  handle: Scalars["String"]["output"]
  /** A globally-unique ID. */
  id: Scalars["ID"]["output"]
  /** List of images associated with the product. */
  images: ImageConnection
  /** The product's title. */
  title: Scalars["String"]["output"]
  /** The product's vendor name. */
  vendor: Scalars["String"]["output"]
  /** A stripped description of the product, single line with HTML tags removed. */
  description: Scalars["String"]["output"]
  /** The featured image for the product. */
  featuredImage?: Maybe<Image>
  /** The online store URL for the product. */
  onlineStoreUrl?: Maybe<Scalars["URL"]["output"]>
  /** List of product options. */
  options: Array<ProductOption>
  /** List of product variants that are adjacent in the admin. */
  adjacentVariants: Array<ProductVariant>
  /** The metafield associated with the resource. */
  encodedVariantExistence?: Maybe<Scalars["String"]["output"]>
}

/** Product property names like "Size", "Color", and "Material" that the customers can select. */
export type ProductOption = {
  __typename?: "ProductOption"
  /** A globally-unique ID. */
  id: Scalars["ID"]["output"]
  /** The product option's name. */
  name: Scalars["String"]["output"]
  /** The corresponding value to the product option name. */
  optionValues: Array<ProductOptionValue>
}

/** The product option value names. For example, "Red", "Blue", and "Green" for a "Color" option. */
export type ProductOptionValue = {
  __typename?: "ProductOptionValue"
  /** A globally-unique ID. */
  id: Scalars["ID"]["output"]
  /** The name of the product option value. */
  name: Scalars["String"]["output"]
  /** The first selectable variant with this option value. */
  firstSelectableVariant?: Maybe<ProductVariant>
  /** The swatch value. */
  swatch?: Maybe<ProductOptionValueSwatch>
}

/** Product option value swatch. */
export type ProductOptionValueSwatch = {
  __typename?: "ProductOptionValueSwatch"
  /** The swatch color. */
  color?: Maybe<Scalars["String"]["output"]>
  /** The swatch image. */
  image?: Maybe<Media>
}

/** Represents a media interface. */
export type Media = {
  /** A word or phrase to share the nature or contents of a media. */
  alt?: Maybe<Scalars["String"]["output"]>
  /** A globally-unique ID. */
  id: Scalars["ID"]["output"]
  /** The media content type. */
  mediaContentType: MediaContentType
  /** The preview image for the media. */
  previewImage?: Maybe<Image>
}

/** Media content types. */
export enum MediaContentType {
  ExternalVideo = "EXTERNAL_VIDEO",
  Image = "IMAGE",
  Model_3d = "MODEL_3D",
  Video = "VIDEO"
}

/** A product variant represents a different version of a product. */
export type ProductVariant = {
  __typename?: "ProductVariant"
  /** Indicates if the product variant is available for sale. */
  availableForSale: Scalars["Boolean"]["output"]
  /** The compare at price of the variant. */
  compareAtPrice?: Maybe<MoneyV2>
  /** A globally-unique ID. */
  id: Scalars["ID"]["output"]
  /** Image associated with the product variant. */
  image?: Maybe<Image>
  /** The product variant's price. */
  price: MoneyV2
  /** The product object that the product variant belongs to. */
  product: Product
  /** List of product options applied to the variant. */
  selectedOptions: Array<SelectedOption>
  /** The product variant's title. */
  title: Scalars["String"]["output"]
}

/** Name and value pair for product options. */
export type SelectedOption = {
  __typename?: "SelectedOption"
  /** The product option's name. */
  name: Scalars["String"]["output"]
  /** The product option's value. */
  value: Scalars["String"]["output"]
}

/** The schema's entry-point for queries. */
export type QueryRoot = {
  __typename?: "QueryRoot"
  /** Find a product by its handle. */
  product?: Maybe<Product>
}

export type QueryRootProductArgs = {
  handle: Scalars["String"]["input"]
}
