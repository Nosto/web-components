import { ProductCard } from "@/components/ProductCard/ProductCard"
import { describe, expect, it } from "vitest"
import { createElement } from "../utils/jsx"

describe("ProductCard", () => {
  it("should throw an error if template is not provided", async () => {
    const card = (<nosto-product-card />) as ProductCard
    await expect(card.connectedCallback()).rejects.toThrowError("Property template is required.")
  })

  it("should throw an error if template cannot be found", async () => {
    const card = (<nosto-product-card template="non-existent-template" />) as ProductCard
    await expect(card.connectedCallback()).rejects.toThrowError('Template with id "non-existent-template" not found.')
  })

  it("should render the product", async () => {
    const card = (<nosto-product-card template="test1" />) as ProductCard

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test1">
        <h1 v-text="product.title"></h1>
      </template>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.innerHTML).toBe("<h1>Test Product</h1>")
  })

  it("should render the product from DOM data", async () => {
    const card = (<nosto-product-card template="test2" />) as ProductCard

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test2">
        <h1 v-text="product.title"></h1>
      </template>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.innerHTML).toBe("<h1>Test Product</h1>")
  })

  it("should expose dataset to template context", async () => {
    const card = (<nosto-product-card template="test3" data-test="test" />) as ProductCard

    const mockProductData = { product: { id: 123, title: "Test Product" } }
    document.body.append(
      <template id="test3">
        <h1 v-text="product.title"></h1>
      </template>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(mockProductData.product)}
      </script>
    )

    await card.connectedCallback()

    expect(card.innerHTML).toBe("<h1>Test Product</h1>")
  })

  it("should scale to complex examples", async () => {
    const data = {
      name: "Tiffany Fitness Tee",
      review_count: 3,
      custom_fields: {
        new: "No",
        sale: "Yes",
        performance_fabric: "No",
        material: "Organic Cotton",
        erin_recommends: "No",
        pattern: "Solid",
        eco_collection: "Yes",
        climate: "Indoor, Warm",
        style_general: "Tee"
      },
      alternate_image_urls: [
        "https://thumbs.staging.eu.nosto.com/quick/magento-b3e1aa27/orig/1514_alt_136de467f231dd1bcaf66b056925bbaf8bcaad2c3bbdd79234bf871cb1d467b6/708571805dc7d03bbba7e341e40aed8b5da678e2232173925ea19b3d3b7a4f93/A"
      ],
      date_published: 1744588800000,
      list_price_text: "28.00",
      description: "You'll work out and look cute doing it in the short-sleeve Tiffany Fitness Tee.",
      url: "https://magento2.plugintest.nos.to/tiffany-fitness-tee.html",
      product_id: "1514",
      image_url:
        "https://thumbs.staging.eu.nosto.com/quick/magento-b3e1aa27/orig/1514/86e72dd06f0ce452a4df1c1aa1e95f7bd83b0bcad29d25c2dde24feda7818a8e/A",
      categories: ["/Promotions/Tees", "/Promotions/Women Sale", "/Collections/Eco Friendly", "/Women/Tops/Tees"],
      tags1: [],
      tags2: [],
      tags3: [],
      price: 28.0,
      list_price: 28.0,
      rating_value: 3.7,
      price_currency_code: "EUR"
    }

    const card = (<nosto-product-card template="test3" data-test="test" />) as ProductCard

    // NOTE more verbose v-bind: syntax is used due to TSX limitations with shorthand syntax in this context.
    document.body.append(
      <template id="test3">
        <div class="product">
          <a v-bind:href="product.url" class="product-link">
            <img v-bind:src="product.imageUrl" v-bind:alt="product.name" class="product-image" />
          </a>
          <h1 v-text="product.name"></h1>
          <span class="product-material" v-text="product.customFields.material"></span>
          <span class="product-description" v-text="product.description"></span>
          <span class="product-price" v-text="product.price"></span>
          <span class="product-list-price" v-text="product.listPrice"></span>
          <span class="product-rating" v-text="product.ratingValue"></span>
        </div>
      </template>
    )
    card.append(
      <script type="application/json" product-data>
        {JSON.stringify(data)}
      </script>
    )

    await card.connectedCallback()

    const expected = (
      <div class="product">
        <a class="product-link" href="https://magento2.plugintest.nos.to/tiffany-fitness-tee.html">
          <img
            class="product-image"
            src="https://thumbs.staging.eu.nosto.com/quick/magento-b3e1aa27/orig/1514/86e72dd06f0ce452a4df1c1aa1e95f7bd83b0bcad29d25c2dde24feda7818a8e/A"
            alt="Tiffany Fitness Tee"
          />
        </a>
        <h1>Tiffany Fitness Tee</h1>
        <span class="product-material">Organic Cotton</span>
        <span class="product-description">
          You'll work out and look cute doing it in the short-sleeve Tiffany Fitness Tee.
        </span>
        <span class="product-price">28</span>
        <span class="product-list-price">28</span>
        <span class="product-rating">3.7</span>
      </div>
    )

    expect(card.innerHTML).toBe(expected.outerHTML)
  })
})
