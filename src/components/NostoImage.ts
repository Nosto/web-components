import { customElement } from "./decorators"
import { assertRequired } from "@/utils"
import { transformUrl } from "unpic"

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

    const transformedUrl = transformUrl({
      url: src,
      width: width ? parseInt(width, 10) : undefined,
      height: height ? parseInt(height, 10) : undefined
    })

    const fallbackHTML = `
      <img 
        src="${transformedUrl}" 
        width="${width}" 
        height="${height}" 
        loading="lazy">
    `
    this.innerHTML = fallbackHTML
  }
}
