/* prettier-ignore */

/**
 * Shopify Storefront API Introspection
 * This file is auto-generated and should not be edited manually
 */

export type introspection = {
  "__schema": {
    "description": null,
    "queryType": {
      "name": "Query",
      "kind": "OBJECT"
    },
    "mutationType": null,
    "subscriptionType": null,
    "types": [
      {
        "kind": "OBJECT",
        "name": "Product",
        "description": "Represents a product.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "id",
            "description": "A globally-unique ID.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "handle",
            "description": "A human-friendly unique string for the Product automatically generated from its title.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "title",
            "description": "The product's title.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "vendor",
            "description": "The product's vendor name.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "description",
            "description": "Stripped description of the product, single line with HTML tags removed.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "encodedVariantExistence",
            "description": "A comma separated list of variant IDs encoded in a base64 string.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "onlineStoreUrl",
            "description": "The URL to the product's page on the online store.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "URL",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "availableForSale",
            "description": "Whether the product is available for sale on the online store.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "images",
            "description": "List of images associated with the product.",
            "args": [
              {
                "name": "first",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "ImageConnection",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "featuredImage",
            "description": "The featured image for the product.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "Image",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "options",
            "description": "List of product options.",
            "args": [
              {
                "name": "first",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ProductOption",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "adjacentVariants",
            "description": "Adjacent variants for the product.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ProductVariant",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "SCALAR",
        "name": "ID",
        "description": "The `ID` scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as `\"4\"`) or integer (such as `4`) input value will be accepted as an ID.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "SCALAR",
        "name": "String",
        "description": "The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "SCALAR",
        "name": "Boolean",
        "description": "The `Boolean` scalar type represents `true` or `false`.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "SCALAR",
        "name": "Int",
        "description": "The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "Image",
        "description": "An image resource.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "altText",
            "description": "A word or phrase to share the nature or contents of an image.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "height",
            "description": "The original height of the image in pixels.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "Int",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "width",
            "description": "The original width of the image in pixels.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "Int",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "thumbhash",
            "description": "The thumbhash of the image.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "url",
            "description": "The location of the image as a URL.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "URL",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "id",
            "description": "The ID of the media.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "ID",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "mediaContentType",
            "description": "The media content type.",
            "args": [],
            "type": {
              "kind": "ENUM",
              "name": "MediaContentType",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "previewImage",
            "description": "The preview image for the media.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "Image",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ImageConnection",
        "description": "Connection to a list of images.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "nodes",
            "description": "List of images.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "Image",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ProductOption",
        "description": "A product option.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": "The product option's name.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "optionValues",
            "description": "The corresponding value to the product option name.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ProductOptionValue",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ProductOptionValue",
        "description": "A value for a product option.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": "The product option value's name.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "firstSelectableVariant",
            "description": "The first available variant with this option value.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "ProductVariant",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "swatch",
            "description": "The swatch for the option value.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "ProductOptionValueSwatch",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ProductVariant",
        "description": "A product variant represents a different version of a product.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "id",
            "description": "A globally-unique ID.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "title",
            "description": "The product variant's title.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "availableForSale",
            "description": "Whether the product variant is available for sale.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "image",
            "description": "Image associated with the product variant.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "Image",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "price",
            "description": "The product variant's price.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "MoneyV2",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "compareAtPrice",
            "description": "The compare at price of the variant.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "MoneyV2",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "product",
            "description": "The product object that the product variant belongs to.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "Product",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "selectedOptions",
            "description": "List of product options applied to the variant.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "SelectedOption",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "MoneyV2",
        "description": "A monetary value with currency.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "amount",
            "description": "Decimal money amount.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "currencyCode",
            "description": "Currency of the money.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "ENUM",
                "name": "CurrencyCode",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "SelectedOption",
        "description": "An option selection of a variant.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": "The product option's name.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "value",
            "description": "The product option's value.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ProductOptionValueSwatch",
        "description": "A swatch for a product option value.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "color",
            "description": "The swatch color.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "image",
            "description": "The swatch image.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "MediaImage",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "MediaImage",
        "description": "Represents a Shopify hosted image.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "alt",
            "description": "A word or phrase to share the nature or contents of a media.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "id",
            "description": "A globally-unique ID.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "ID",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "mediaContentType",
            "description": "The media content type.",
            "args": [],
            "type": {
              "kind": "ENUM",
              "name": "MediaContentType",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "previewImage",
            "description": "The preview image for the media.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "Image",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ProductConnection",
        "description": "Connection type for Product.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "edges",
            "description": "A list of edges.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "ProductEdge",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "ProductEdge",
        "description": "An edge in a Product connection.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "node",
            "description": "The item at the end of the edge.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "Product",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "QueryRoot",
        "description": "The root query type.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "product",
            "description": "Fetch a specific product by handle.",
            "args": [
              {
                "name": "handle",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "OBJECT",
              "name": "Product",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "products",
            "description": "Fetch a list of products.",
            "args": [
              {
                "name": "first",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "ProductConnection",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "nodes",
            "description": "Fetch nodes by ID.",
            "args": [
              {
                "name": "ids",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "LIST",
                    "name": null,
                    "ofType": {
                      "kind": "NON_NULL",
                      "name": null,
                      "ofType": {
                        "kind": "SCALAR",
                        "name": "ID",
                        "ofType": null
                      }
                    }
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "INTERFACE",
                  "name": "Node",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "INTERFACE",
        "name": "Node",
        "description": "An object with an ID field.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "id",
            "description": "A globally-unique ID.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "ID",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": []
      },
      {
        "kind": "ENUM",
        "name": "CountryCode",
        "description": "ISO 3166-1 alpha-2 country codes.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": [
          {
            "name": "US",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CA",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "GB",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "AU",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NZ",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "JP",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "DE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ES",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "IT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "DK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FI",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CZ",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "AT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "BE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CH",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "IE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "GR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HU",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "RO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SI",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "BG",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "LT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "LV",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "EE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CY",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "MT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "LU",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "possibleTypes": null
      },
      {
        "kind": "ENUM",
        "name": "LanguageCode",
        "description": "ISO 639-1 language codes.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": [
          {
            "name": "EN",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "DE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ES",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "IT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "JA",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SV",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "DA",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FI",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CS",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HU",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "RO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "BG",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "LT",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "LV",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ET",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "EL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "TR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "RU",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "UK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "AR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "TH",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ZH",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "KO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "possibleTypes": null
      },
      {
        "kind": "ENUM",
        "name": "CurrencyCode",
        "description": "Supported currency codes.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": [
          {
            "name": "USD",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "EUR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "GBP",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CAD",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "AUD",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "JPY",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NZD",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SEK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "DKK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NOK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CHF",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PLN",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CZK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HUF",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "RON",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "BGN",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "HRK",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "TRY",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "RUB",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "UAH",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "AED",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SAR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CNY",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "KRW",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "THB",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SGD",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "MYR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "IDR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PHP",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "VND",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "BRL",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "MXN",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ARS",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "CLP",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "COP",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "PEN",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ZAR",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "possibleTypes": null
      },
      {
        "kind": "ENUM",
        "name": "MediaContentType",
        "description": "The type of content hosted by a media object.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": [
          {
            "name": "IMAGE",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "VIDEO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "MODEL_3D",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "EXTERNAL_VIDEO",
            "description": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "possibleTypes": null
      },
      {
        "kind": "SCALAR",
        "name": "URL",
        "description": "A custom scalar that represents a URL string.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "Query",
        "description": "The schema's entry-point for queries.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "product",
            "description": "Fetch a specific product by handle.",
            "args": [
              {
                "name": "handle",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "String",
                    "ofType": null
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "OBJECT",
              "name": "Product",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "products",
            "description": "Fetch a list of products.",
            "args": [
              {
                "name": "first",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "SCALAR",
                    "name": "Int",
                    "ofType": null
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "ProductConnection",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "nodes",
            "description": "Fetch nodes by ID.",
            "args": [
              {
                "name": "ids",
                "description": null,
                "type": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "LIST",
                    "name": null,
                    "ofType": {
                      "kind": "NON_NULL",
                      "name": null,
                      "ofType": {
                        "kind": "SCALAR",
                        "name": "ID",
                        "ofType": null
                      }
                    }
                  }
                },
                "defaultValue": null,
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "INTERFACE",
                  "name": "Node",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "__Schema",
        "description": "A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "description",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "types",
            "description": "A list of all types supported by this server.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__Type",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "queryType",
            "description": "The type that query operations will be rooted at.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "__Type",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "mutationType",
            "description": "If this server supports mutation, the type that mutation operations will be rooted at.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "__Type",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "subscriptionType",
            "description": "If this server support subscription, the type that subscription operations will be rooted at.",
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "__Type",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "directives",
            "description": "A list of all directives supported by this server.",
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__Directive",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "__Type",
        "description": "The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.\n\nDepending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByURL`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "kind",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "ENUM",
                "name": "__TypeKind",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "name",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "description",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "specifiedByURL",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "fields",
            "description": null,
            "args": [
              {
                "name": "includeDeprecated",
                "description": null,
                "type": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                },
                "defaultValue": "false",
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "LIST",
              "name": null,
              "ofType": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__Field",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "interfaces",
            "description": null,
            "args": [],
            "type": {
              "kind": "LIST",
              "name": null,
              "ofType": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__Type",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "possibleTypes",
            "description": null,
            "args": [],
            "type": {
              "kind": "LIST",
              "name": null,
              "ofType": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__Type",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "enumValues",
            "description": null,
            "args": [
              {
                "name": "includeDeprecated",
                "description": null,
                "type": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                },
                "defaultValue": "false",
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "LIST",
              "name": null,
              "ofType": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__EnumValue",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "inputFields",
            "description": null,
            "args": [
              {
                "name": "includeDeprecated",
                "description": null,
                "type": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                },
                "defaultValue": "false",
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "LIST",
              "name": null,
              "ofType": {
                "kind": "NON_NULL",
                "name": null,
                "ofType": {
                  "kind": "OBJECT",
                  "name": "__InputValue",
                  "ofType": null
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ofType",
            "description": null,
            "args": [],
            "type": {
              "kind": "OBJECT",
              "name": "__Type",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "isOneOf",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "Boolean",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "ENUM",
        "name": "__TypeKind",
        "description": "An enum describing what kind of type a given `__Type` is.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": [
          {
            "name": "SCALAR",
            "description": "Indicates this type is a scalar.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "OBJECT",
            "description": "Indicates this type is an object. `fields` and `interfaces` are valid fields.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INTERFACE",
            "description": "Indicates this type is an interface. `fields`, `interfaces`, and `possibleTypes` are valid fields.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "UNION",
            "description": "Indicates this type is a union. `possibleTypes` is a valid field.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ENUM",
            "description": "Indicates this type is an enum. `enumValues` is a valid field.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INPUT_OBJECT",
            "description": "Indicates this type is an input object. `inputFields` is a valid field.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "LIST",
            "description": "Indicates this type is a list. `ofType` is a valid field.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "NON_NULL",
            "description": "Indicates this type is a non-null. `ofType` is a valid field.",
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "__Field",
        "description": "Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "description",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "args",
            "description": null,
            "args": [
              {
                "name": "includeDeprecated",
                "description": null,
                "type": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                },
                "defaultValue": "false",
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__InputValue",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "type",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "__Type",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "isDeprecated",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "deprecationReason",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "__InputValue",
        "description": "Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "description",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "type",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "OBJECT",
                "name": "__Type",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "defaultValue",
            "description": "A GraphQL-formatted string representing the default value for this input value.",
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "isDeprecated",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "deprecationReason",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "__EnumValue",
        "description": "One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "description",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "isDeprecated",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "deprecationReason",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "OBJECT",
        "name": "__Directive",
        "description": "A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.\n\nIn some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": [
          {
            "name": "name",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "description",
            "description": null,
            "args": [],
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "isRepeatable",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "locations",
            "description": null,
            "args": [],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "ENUM",
                    "name": "__DirectiveLocation",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "args",
            "description": null,
            "args": [
              {
                "name": "includeDeprecated",
                "description": null,
                "type": {
                  "kind": "SCALAR",
                  "name": "Boolean",
                  "ofType": null
                },
                "defaultValue": "false",
                "isDeprecated": false,
                "deprecationReason": null
              }
            ],
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "LIST",
                "name": null,
                "ofType": {
                  "kind": "NON_NULL",
                  "name": null,
                  "ofType": {
                    "kind": "OBJECT",
                    "name": "__InputValue",
                    "ofType": null
                  }
                }
              }
            },
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "inputFields": null,
        "interfaces": [],
        "enumValues": null,
        "possibleTypes": null
      },
      {
        "kind": "ENUM",
        "name": "__DirectiveLocation",
        "description": "A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.",
        "specifiedByURL": null,
        "isOneOf": null,
        "fields": null,
        "inputFields": null,
        "interfaces": null,
        "enumValues": [
          {
            "name": "QUERY",
            "description": "Location adjacent to a query operation.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "MUTATION",
            "description": "Location adjacent to a mutation operation.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SUBSCRIPTION",
            "description": "Location adjacent to a subscription operation.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FIELD",
            "description": "Location adjacent to a field.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FRAGMENT_DEFINITION",
            "description": "Location adjacent to a fragment definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FRAGMENT_SPREAD",
            "description": "Location adjacent to a fragment spread.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INLINE_FRAGMENT",
            "description": "Location adjacent to an inline fragment.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "VARIABLE_DEFINITION",
            "description": "Location adjacent to a variable definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SCHEMA",
            "description": "Location adjacent to a schema definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "SCALAR",
            "description": "Location adjacent to a scalar definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "OBJECT",
            "description": "Location adjacent to an object type definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "FIELD_DEFINITION",
            "description": "Location adjacent to a field definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ARGUMENT_DEFINITION",
            "description": "Location adjacent to an argument definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INTERFACE",
            "description": "Location adjacent to an interface definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "UNION",
            "description": "Location adjacent to a union definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ENUM",
            "description": "Location adjacent to an enum definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "ENUM_VALUE",
            "description": "Location adjacent to an enum value definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INPUT_OBJECT",
            "description": "Location adjacent to an input object type definition.",
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "INPUT_FIELD_DEFINITION",
            "description": "Location adjacent to an input object field definition.",
            "isDeprecated": false,
            "deprecationReason": null
          }
        ],
        "possibleTypes": null
      }
    ],
    "directives": [
      {
        "name": "inContext",
        "description": "The Storefront API version used",
        "isRepeatable": false,
        "locations": [
          "QUERY"
        ],
        "args": [
          {
            "name": "country",
            "description": null,
            "type": {
              "kind": "ENUM",
              "name": "CountryCode",
              "ofType": null
            },
            "defaultValue": null,
            "isDeprecated": false,
            "deprecationReason": null
          },
          {
            "name": "language",
            "description": null,
            "type": {
              "kind": "ENUM",
              "name": "LanguageCode",
              "ofType": null
            },
            "defaultValue": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ]
      },
      {
        "name": "include",
        "description": "Directs the executor to include this field or fragment only when the `if` argument is true.",
        "isRepeatable": false,
        "locations": [
          "FIELD",
          "FRAGMENT_SPREAD",
          "INLINE_FRAGMENT"
        ],
        "args": [
          {
            "name": "if",
            "description": "Included when true.",
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "defaultValue": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ]
      },
      {
        "name": "skip",
        "description": "Directs the executor to skip this field or fragment when the `if` argument is true.",
        "isRepeatable": false,
        "locations": [
          "FIELD",
          "FRAGMENT_SPREAD",
          "INLINE_FRAGMENT"
        ],
        "args": [
          {
            "name": "if",
            "description": "Skipped when true.",
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "Boolean",
                "ofType": null
              }
            },
            "defaultValue": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ]
      },
      {
        "name": "deprecated",
        "description": "Marks an element of a GraphQL schema as no longer supported.",
        "isRepeatable": false,
        "locations": [
          "FIELD_DEFINITION",
          "ARGUMENT_DEFINITION",
          "INPUT_FIELD_DEFINITION",
          "ENUM_VALUE"
        ],
        "args": [
          {
            "name": "reason",
            "description": "Explains why this element was deprecated, usually also including a suggestion for how to access supported similar data. Formatted using the Markdown syntax, as specified by [CommonMark](https://commonmark.org/).",
            "type": {
              "kind": "SCALAR",
              "name": "String",
              "ofType": null
            },
            "defaultValue": "\"No longer supported\"",
            "isDeprecated": false,
            "deprecationReason": null
          }
        ]
      },
      {
        "name": "specifiedBy",
        "description": "Exposes a URL that specifies the behavior of this scalar.",
        "isRepeatable": false,
        "locations": [
          "SCALAR"
        ],
        "args": [
          {
            "name": "url",
            "description": "The URL that specifies the behavior of this scalar.",
            "type": {
              "kind": "NON_NULL",
              "name": null,
              "ofType": {
                "kind": "SCALAR",
                "name": "String",
                "ofType": null
              }
            },
            "defaultValue": null,
            "isDeprecated": false,
            "deprecationReason": null
          }
        ]
      },
      {
        "name": "oneOf",
        "description": "Indicates exactly one field must be supplied and this field must not be `null`.",
        "isRepeatable": false,
        "locations": [
          "INPUT_OBJECT"
        ],
        "args": []
      }
    ]
  }
};
