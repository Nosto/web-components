# Nosto Web Components

Nosto web components provides the necessary APIs to handle side-effects of a recommendation template like ATC button events (addSkuToCart), and other platform specific APIs.

**Note**:
Currently, this package doesn't render HTML markups on it's own and the template needs to be provided by the user. 

## Components

The package currently offers the following two web components. 

1. NostoProduct
2. NostoSkuOptions
3. NostoShopify

### NostoProduct

When the markup for rendering product is wrapped with `NostoProduct` component, the APIs for SKU selection and Add to cart functionality is automatically handled by the component. By encapsulating the necessary APIs, this component reduces any JavaScript logic that otherwise gets included in the template and helps the team to concentrate only on building the template rather than implementating the JavaScript logic. 

This component requires two attributes
a. `product-id`
Id of the product being rendered. For example, in reco template, this value is available in `$!product.productId` variable

b. `reco-id`
The Id of the recommendation being rendered. For example, in reco template, this value is available in `$!product.attributionKey` variable

**Note**:
The following examples of rendering product Skus are applicable only for simple use-cases. For complex cases, like multi-directional SKU selections where selecting color renders the matching size and vice-versa, consider using `NostoSku` component.

**Example #1**: 

Render Product with Sku selection dropdown and an ATC button

```html
<nosto-product>
    ...
    ...
    <select n-sku-selector>
        <option value="456">SKU 1</option>
        <option value="457">SKU 2</option>
    </select>
    ...
    <div n-atc>ATC</div>
    ...
    ...
</nosto-product>
```

**Example #2**: 

Render Product with individual Sku item acting as ATC button. When using this approach, the structure 

```html
<nosto-product>
    ...
    ...
    <div n-sku-id="456">
        <span n-atc>Blue</span>
    </div>
    <div n-sku-id="101">
        <span n-atc>Black</span>
    </div>
    ...
    ...
</nosto-product>
```

#### Attributes

This component requires the following attributes to parse the markup, extract product & SKU data and attach the event handlers to the selector/button elements

`n-sku-selector`
This attribute marks the SKU select dropdown. When specified, the component attaches an `onchange` event to the element. Clicking on the ATC button adds the SKU value selected from the dropdown to the cart. 

`n-sku-id`
This option is relevant when SKU options are rendered as ATC button. This attribute supplies the ID of the SKU option value and should be supplied on the parent of ATC button

```html
<div n-sku-id="456">
    <span n-atc>Blue</span>
</div>
```

`n-atc`
Marks an element as ATC trigger and attaches click event to the element. Clicking on this element triggers `addSkuToCart` API and supplies the selected SKU Id.

### NostoSkuOptions

The `NostoSkuOptions` component is recommended for cases rendering multiple SKU option groups (color, size). It manages the state and interactions of SKU options, including preselection, state changes, and click events.

**Example #1**:

Dual SKU selection group

```html
<nosto-product product-id="1223456" reco-id="789011">
    <nosto-sku-options name="color">
        <span n-option n-skus="123,145">Black</span>
        <span n-option n-skus="223,234,245">White</span>
        <span n-option n-skus="334,345">Blue</span>
    </nosto-sku-options>
    <nosto-sku-options name="size">
        <span n-option n-skus="123,223">L</span>
        <span n-option n-skus="234,334">M</span>
        <span n-option n-skus="145,245,345">S</span>
    </nosto-sku-options>
    <span n-atc>Add to cart</span>
</nosto-product>
```

**Example #2**:

Trio SKU selection group

```html
<nosto-product product-id="1223456" reco-id="789011">
    <nosto-sku-options name="color">
        <span n-option n-skus="123,145">Black</span>
        <span white n-option n-skus="223,234,245">White</span>
        <span blue n-option n-skus="334,345">Blue</span>
    </nosto-sku-options>
    <nosto-sku-options name="size">
        <span n-option n-skus="123,223">L</span>
        <span n-option n-skus="234,334">M</span>
        <span n-option n-skus="145,245,345">S</span>
    </nosto-sku-options>
    <nosto-sku-options name="material">
        <span n-option n-skus="123,234,345">Cotton</span>
        <span n-option n-skus="145,223,334">Silk</span>
        <span n-option n-skus="245">Wool</span>
    </nosto-sku-options>  
    <span n-atc>Add to cart</span>
</nosto-product>
```

#### Attributes

`name`
A required attribute supplied on the `nosto-sku-options` element. Supplies the option group name (color/size/material etc...)

`n-option`
Marks an element as SKU option element

`n-skus`
Comma-separated value of linked SKU Ids. This value is available in `$!product.getSkuAggregateOptions`. For more info on `getSkuAggregateOptions`, please refer [getSkuAggregateOptions](#getskuaggregateoptions)

### NostoShopify

A component wrapper for performing Shopify specific APIs.

**Example**:

Migrate to Shopify market

```html
<div id="frontpage-nosto-1" class="nosto-element">
    <nosto-shopify>
        <nosto-product product-id="123456" reco-id="789011">
            <div class="product-card nosto-item" n-handle="$!product.lastPathOfProductUrl()" >
                <span n-url="$product.url"></span>
                <h3 n-title>Test Product</h3>
                <span n-description>This is a product for demonstration</span>
                <span class="product-price" n-price>
                    110$
                </span>
                <span class="product-list-price" n-list-price>
                    110$
                </span>
                <nosto-sku-options name="colors">
                    <span black n-option n-skus="123,145">Black</span>
                    <span white n-option n-skus="223,234,245">White</span>
                    <span blue n-option n-skus="334,345">Blue</span>
                </nosto-sku-options>
                <nosto-sku-options name="sizes">
                    <span l n-option n-skus="123,223">L</span>
                    <span m n-option n-skus="234,334">M</span>
                    <span s n-option n-skus="145,245,345">S</span>
                </nosto-sku-options>
                <span n-atc>Add to cart</span>
            </div>
        </nosto-product>
    </nosto-shopify>
</div>
```

## Pre-selected options

In addition to handling APIs, Nosto Web Components also supports pre-selection of SKU options and disabling some SKUs by default. For example in the template below, option `SKU 2` is rendered with `selected` attribute. With this template, when clicking ATC button, `SKU 2` gets added to the cart.

```html
<nosto-product>
    ...
    ...
    <select n-sku-selector>
        <option value="456">SKU 1</option>
        <option value="457" selected>SKU 2</option>
    </select>
    ...
    <button n-atc>ATC</button>
    ...
    ...
</nosto-product>
```

with `nosto-sku-options` component

```html
<nosto-product>
    ...
    ...
    <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145" selected>Black</span>
        <span white n-option n-skus="223,234,245">White</span>
        <span blue n-option n-skus="334,345">Blue</span>
    </nosto-sku-options>
    ...
    ...
</nosto-product>
```

Note:
The component does not handle styling for selected options and it has to be applied from the template.

## Default disabled

Similarly, cases where some options would be disabled by default is also supported. This is useful for cases when SKU options that are Out-Of-Stock needs to be hidden or greyed out. By default, the `disabled` attribute is added to all unsupported SKU options. For example, when there is no `M` size in `Blue` color, on selection of `Blue` color, the component adds `disabled` attribute to option `M`. 

Note:
The default disabled options are applicable only when using `nosto-sku-options` component
The component does not handle styling for disabled options and it has to be applied from the template.

```html
<nosto-product>
    ...
    ...
    <nosto-sku-options name="colors">
        <span black n-option n-skus="123,145">Black</span>
        <span white n-option n-skus="223,234,245" disabled>White</span>
        <span blue n-option n-skus="334,345">Blue</span>
    </nosto-sku-options>
    ...
    ...
</nosto-product>
```

## APIs supported

### addSkuToCart

API triggered when ATC button is clicked. Triggers the `addSkuToCart` API with the selected Sku Id.

### migrateToShopifyMarket

Performs migration of price and text rendered in recommendation to shopify market current & language

## New Velocity Model (VM) methods

### getSkuAggregateOptions

Accepts a single mandatory `customField` parameter and returns an aggregate of linked SkuIds for the provided custom field (color/size/material etc...)

**Examples**:

When a product has multiple variants (color & size) with following vairant options

color-size: 
Blue - S (10), M (11), XL (12)
Green - M (11), XL (12)
Red - S (10), M (11)

Now the method call 

```js
$!product.getSkuAggregateOptions('color')
```

returns an array of the following objects

```json
[
    { "optionValue": "blue", "skuIds": ["10", "11", "12"], "skus": /*array of SkuVm object*/ },
    { "optionValue": "green", "skuIds": ["11", "12"], "skus": /*array of SkuVm object*/ }
    { "optionValue": "red", "skuIds": ["10", "11"], "skus": /*array of SkuVm object*/ }
]
```