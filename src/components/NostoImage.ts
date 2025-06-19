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
  width!: string
  height!: string
  transformer!: typeof transformUrl | typeof transformBigcommerce

  connectedCallback() {
    assertRequired(this, "src", "width", "height")
    const { src, width, height } = this

    this.transformer = this.getProvider() === "bigcommerce" ? transformBigcommerce : transformUrl
    const transformedUrl = this.transformer({
      url: src,
      width: parseInt(width, 10),
      height: parseInt(height, 10)
    })

    const imageHtml = `
      <img 
        src="${transformedUrl}" 
        width="${width}" 
        height="${height}" 
        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        srcset="${this.generateSrcset()}"
        loading="lazy">
    `
    this.innerHTML = imageHtml
  }

  generateSrcset(): string {
    const widths = [300, 600, 900, 1200]
    return widths
      .map(width => {
        const aspectRatio = this.getAspectRatio()
        const height = Math.round(width / aspectRatio)
        const url = this.transformer({
          url: this.src,
          width,
          height
        })
        return `${url} ${width}w`
      })
      .join(", ")
  }

  getAspectRatio(): number {
    return parseInt(this.width, 10) / parseInt(this.height)
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
