import { assertRequired } from "@/utils"
import { createStore, provideStore, Store } from "./NostoProduct/store"
import { customElement } from "./decorators"
import { syncSkuData } from "./common"

/**
 * Custom element that represents a Nosto product component.
 *
 * This component manages product selection, SKU selection, and add-to-cart functionality.
 * It creates a store and provides methods to interact with product and SKU data.
 *
 * @property {string} productId - Required. The ID of the product.
 * @property {string} recoId - Required. The recommendation slot ID.
 * @property {boolean} skuSelected - Indicates whether a SKU is currently selected.
 *
 * @example
 * ```html
 * <nosto-product product-id="123" reco-id="front-page">
 *   <select n-sku-selector>
 *     <option value="sku1">Option 1</option>
 *     <option value="sku2">Option 2</option>
 *   </select>
 *   <button n-atc>Add to Cart</button>
 * </nosto-product>
 * ```
 *
 * @example
 * ```html
 * <nosto-product product-id="123" reco-id="front-page">
 *   <div n-sku-id="456">
 *     <span n-atc>Blue</span>
 *   </div>,
 *   <div n-sku-id="101">
 *     <span n-atc>Black</span>
 *   </div>
 * </nosto-product>
 * ```
 *
 */
@customElement("nosto-product")
export class NostoProduct extends HTMLElement {
  static attributes = {
    productId: String,
    recoId: String,
    skuSelected: Boolean
  }

  selectedSkuId: string | undefined
  productId!: string
  recoId!: string
  skuSelected!: boolean

  connectedCallback() {
    assertRequired(this, "productId", "recoId")
    const store = createStore(this)
    provideStore(this, store)
    addListeners(this, store)
    registerSkuSelectors(this, store)
    registerSkuIds(this, store)
    registerAtcButtons(this, store)
    registerSkuData(this, store)
  }
}

function addListeners(element: NostoProduct, { listen }: Store) {
  listen("selectedSkuId", selectedSkuId => {
    element.selectedSkuId = selectedSkuId
    element.skuSelected = !!selectedSkuId
  })
  listen("image", image => {
    element.style.setProperty("--n-img", `url(${image})`)
    element.querySelector("img[n-img]:not([data-tracked])")?.setAttribute("src", image!)
  })
  listen("altImage", altImage => {
    element.style.setProperty("--n-alt-img", `url(${altImage})`)
    element.querySelector("img[n-alt-img]:not([data-tracked])")?.setAttribute("src", altImage!)
  })
  listen("price", price => {
    element.querySelectorAll<HTMLElement>("[n-price]:not([data-tracked])").forEach(e => (e.innerHTML = price!))
  })
  listen("listPrice", listPrice => {
    element.querySelectorAll("[n-list-price]:not([data-tracked])").forEach(e => (e.innerHTML = listPrice!))
  })
}

function registerSkuSelectors(element: NostoProduct, { selectSkuId }: Store) {
  element.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
    element.dataset.tracked = "true"
    selectSkuId(element.value)
    element.addEventListener("change", () => selectSkuId(element.value))
  })
}

function registerSkuIds(element: NostoProduct, { selectSkuId, setSkuData }: Store) {
  element.querySelectorAll<HTMLElement>("[n-sku-id]:not([n-atc])").forEach(element => {
    element.dataset.tracked = "true"
    element.addEventListener("click", () => {
      selectSkuId(element.getAttribute("n-sku-id")!)
      syncSkuData(element, setSkuData)
    })
  })
}

function registerAtcButtons(element: NostoProduct, { addToCart, selectSkuId }: Store) {
  element.querySelectorAll<HTMLElement>("[n-atc]:not([n-option])").forEach(element => {
    element.dataset.tracked = "true"
    element.addEventListener("click", async () => {
      const skuId = element.closest("[n-sku-id]")?.getAttribute("n-sku-id")
      if (skuId) {
        selectSkuId(skuId)
      }
      await addToCart()
    })
  })
}

function registerSkuData(element: NostoProduct, { setSkus }: Store) {
  const dataEl = element.querySelector("script[n-sku-data]")
  if (dataEl) {
    const parsed = JSON.parse(dataEl.innerHTML)
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid SKU data format. Expected an array.")
    }
    setSkus(parsed)
  }
}
