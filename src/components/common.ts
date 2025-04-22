import { Store } from "./NostoProduct/store"

export function syncPrices(element: HTMLElement, setter: Store["setPrices"]) {
  const price = element.getAttribute("n-price")
  if (price) {
    const listPrice = element.getAttribute("n-list-price")
    setter(price, listPrice || undefined)
  }
}

export function syncImages(element: HTMLElement, setter: Store["setImages"]) {
  const image = element.getAttribute("n-img")
  if (image) {
    const altImage = element.getAttribute("n-alt-img")
    setter(image, altImage || undefined)
  }
}
