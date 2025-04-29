import { Store } from "./NostoProduct/store"

export function syncSkuData(element: HTMLElement, setter: Store["setSkuFields"]) {
  setter({
    image: element.getAttribute("n-img") ?? undefined,
    altImage: element.getAttribute("n-alt-img") ?? undefined,
    price: element.getAttribute("n-price") ?? undefined,
    listPrice: element.getAttribute("n-list-price") ?? undefined
  })
}
