import { assertRequired } from "@/utils"
import { createStore, provideStore, Store } from "./NostoProduct/store"
import { customElement } from "./decorators"

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
    store.listen("selectedSkuId", selectedSkuId => {
      this.selectedSkuId = selectedSkuId
      this.skuSelected = !!selectedSkuId
    })
    store.listen("image", image => {
      this.style.setProperty("--n-img", `url(${image})`)
      this.querySelector("img[n-img]:not([data-tracked])")?.setAttribute("src", image!)
    })
    store.listen("altImage", altImage => {
      this.style.setProperty("--n-alt-img", `url(${altImage})`)
      this.querySelector("img[n-alt-img]:not([data-tracked])")?.setAttribute("src", altImage!)
    })
    store.listen("price", price => {
      this.querySelectorAll<HTMLElement>("[n-price]:not([data-tracked])").forEach(e => (e.innerHTML = price!))
    })
    store.listen("listPrice", listPrice => {
      this.querySelectorAll("[n-list-price]:not([data-tracked])").forEach(e => (e.innerHTML = listPrice!))
    })

    registerSKUSelectors(this, store)
    registerSKUIds(this, store)
    registerATCButtons(this, store)
  }
}

function registerSKUSelectors(element: NostoProduct, { selectSkuId }: Store) {
  element.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
    element.dataset.tracked = "true"
    selectSkuId(element.value)
    element.addEventListener("change", () => selectSkuId(element.value))
  })
}

function registerSKUIds(element: NostoProduct, { selectSkuId, setImages, setPrices }: Store) {
  element.querySelectorAll<HTMLElement>("[n-sku-id]:not([n-atc])").forEach(element => {
    element.dataset.tracked = "true"
    element.addEventListener("click", () => {
      selectSkuId(element.getAttribute("n-sku-id")!)

      const image = element.getAttribute("n-img")
      if (image) {
        const altImage = element.getAttribute("n-alt-img")
        setImages(image, altImage || undefined)
      }

      const price = element.getAttribute("n-price")
      if (price) {
        const listPrice = element.getAttribute("n-list-price")
        setPrices(price, listPrice || undefined)
      }
    })
  })
}

function registerATCButtons(element: NostoProduct, { addToCart, selectSkuId }: Store) {
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
