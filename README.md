# nosto-web-components

Nosto web components provides the necessary APIs to handle side-effects of a recommendation template like ATC button events (addSkuToCart), Shopify specific APIs etc.

## Attributes

## Markup requirements

The web components works based on the attributes defined on the HTML elements in the recommendation template. Below are the list of attributes markings required for the components to perform the necessary functions.

### Add To Cart Button - [n-atc]

Any button designated with `n-atc` attribute will be considered the Add To Cart button. A `click` event listener gets attached to this button which triggers `addSkuToCart` API.

## APIs covered

### addSkuToCart

`addSkuToCart` API is triggered when the ATC button is clicked. The API requires three parameters
