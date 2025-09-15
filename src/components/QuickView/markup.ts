import { styles } from "./styles"
import { ShopifyProduct, ShopifyProductOption } from "./types"

export function createDialog(product: ShopifyProduct, recoId: string) {
  const dialog = document.createElement("dialog")
  dialog.classList.add("quickview-dialog")

  const shadow = dialog.attachShadow({ mode: "open" })
  shadow.innerHTML = `
    <style>
     ${styles}
    </style>
    <nosto-product product-id="${product.id}" reco-id="${recoId}" class="grid">
      <div>
        <img 
          src="${product.images?.[0]?.src || ""}" 
          alt="${product.title}" 
          class="image"
        />
      </div>
      <div>
        <h2 class="title">${product.title}</h2>
        <div class="price">
          ${product.price ? `$${(product.price / 100).toFixed(2)}` : ""}
        </div>
        <!-- TODO listPrice -->
        <div class="swatches">
          ${product.options.map(option => createOption(product, option)).join("")}
        </div>
        <button class="add-btn" n-atc>Add to cart</button>
        <button class="close-btn">Close</button>
      </div>
    </nosto-product>
    `

  shadow.querySelector(".close-btn")?.addEventListener("click", () => dialog.close())
  return dialog
}

function createOption(product: ShopifyProduct, option: ShopifyProductOption) {
  return `
    <nosto-sku-options name="${option.name}">
      ${option.values
        .map(value => {
          const skuIds = getSkuIdsForOption(product, option, value)
          return `<div n-option n-skus='${JSON.stringify(skuIds)}' class="swatch">${value}</div>`
        })
        .join("")}
    </nosto-sku-options>`
}

const optionFields = ["option1", "option2", "option3"] as const

function getSkuIdsForOption(product: ShopifyProduct, option: ShopifyProductOption, value: string) {
  const optionField = optionFields[option.position - 1]
  return product.variants.filter(v => v[optionField] === value).map(v => v.id)
}
