import { customElement } from "./decorators"
import { assertRequired } from "@/utils"
import { transformUrl } from "unpic"
import { transformBigcommerce } from "./NostoImge/bigcommerceHandler"

@customElement("nosto-image")
export class NostoImage extends HTMLElement {
  static attributes = {
    src: String,
    width: String,
    height: String
  }

  src!: string
  width?: string
  height?: string

  connectedCallback() {
    assertRequired(this, "src")
    const { src, width, height } = this

    const transormer = this.getProvider() === "bigcommerce" ? transformBigcommerce : transformUrl
    const transformedUrl = transormer({
      url: src,
      width: width ? parseInt(width, 10) : 300,
      height: height ? parseInt(height, 10) : 300
    })
    const imageHtml = `
      <img 
        src="${transformedUrl}" 
        width="${width}" 
        height="${height}" 
        loading="lazy">
    `
    this.innerHTML = imageHtml
  }

  getProvider() {
    if (this.src.includes("shopify")) {
      return "shopify"
    }
    if (this.src.includes("bigcommerce")) {
      return "bigcommerce"
    }
    return "nosto"
  }
}
