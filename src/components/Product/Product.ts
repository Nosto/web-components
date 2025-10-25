import { assertRequired } from "@/utils/assertRequired"
import { createStore, injectKey, Store } from "./store"
import { customElement } from "../decorators"
import { syncSkuData } from "../common"
import { NostoElement } from "../Element"
import { provide } from "../inject"

/**
 * Custom element that represents a Nosto product component.
 *
 * This component manages product selection, SKU selection, and add-to-cart functionality.
 * It creates a store and provides methods to interact with product and SKU data.
 *
 * @category Campaign level templating
 *
 * @property {string} productId (`product-id`) - Required. The ID of the product.
 * @property {string} recoId (`reco-id`) - Required. The recommendation slot ID.
 * @property {boolean} skuSelected (`sku-selected`) - Indicates whether a SKU is currently selected.
 *
 * @document ./examples.md
 *
 */
@customElement("nosto-product")
export class Product extends NostoElement {
  /** @private */
  static properties = {
    productId: String,
    recoId: String,
    skuSelected: Boolean
  }

  productId!: string
  recoId!: string
  skuSelected?: boolean

  /** @hidden */
  selectedSkuId?: string

  connectedCallback() {
    assertRequired(this, "productId", "recoId")
    const store = createStore(this)
    provide(this, injectKey, store)
    addListeners(this, store)
    registerSkuSelectors(this, store)
    registerSkuIds(this, store)
    registerAtcButtons(this, store)
    registerSkuData(this, store)
  }
}

function addListeners(element: Product, { listen }: Store) {
  listen("selectedSkuId", selectedSkuId => {
    element.selectedSkuId = selectedSkuId
    element.skuSelected = !!selectedSkuId
  })
  listen("skuFields", ({ image, altImage, price, listPrice }) => {
    if (image) {
      element.style.setProperty("--n-img", `url(${image})`)
      element.querySelector("img[n-img]:not([data-tracked])")?.setAttribute("src", image)
    }
    if (altImage) {
      element.style.setProperty("--n-alt-img", `url(${altImage})`)
      element.querySelector("img[n-alt-img]:not([data-tracked])")?.setAttribute("src", altImage)
    }
    if (price) {
      element.querySelectorAll<HTMLElement>("[n-price]:not([data-tracked])").forEach(e => (e.innerHTML = price))
    }
    if (listPrice) {
      element.querySelectorAll("[n-list-price]:not([data-tracked])").forEach(e => (e.innerHTML = listPrice))
    }
  })
}

function registerSkuSelectors(element: Product, { selectSkuId }: Store) {
  element.querySelectorAll<HTMLSelectElement>("select[n-sku-selector]").forEach(element => {
    element.dataset.tracked = "true"
    selectSkuId(element.value)
    element.addEventListener("change", () => selectSkuId(element.value))
  })
}

function registerSkuIds(element: Product, { selectSkuId, setSkuFields }: Store) {
  element.querySelectorAll<HTMLElement>("[n-sku-id]:not([n-atc])").forEach(element => {
    element.dataset.tracked = "true"
    element.addEventListener("click", () => {
      selectSkuId(element.getAttribute("n-sku-id")!)
      syncSkuData(element, setSkuFields)
    })
  })
}

function registerAtcButtons(element: Product, { addToCart, selectSkuId }: Store) {
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

function registerSkuData(element: Product, { setSkus }: Store) {
  const dataEl = element.querySelector("script[n-sku-data]")
  if (dataEl) {
    const parsed = JSON.parse(dataEl.innerHTML)
    if (!Array.isArray(parsed)) {
      throw new Error("Invalid SKU data format. Expected an array.")
    }
    if (parsed.some(entry => typeof entry !== "object")) {
      throw new Error("Invalid SKU data format. Expected an array of objects.")
    }
    setSkus(parsed)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "nosto-product": Product
  }
}
