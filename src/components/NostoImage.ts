import { customElement } from "./decorators"
import { checkRequired } from "@/utils"
import { useTransformer } from "@/image/transformers"
import type { Layout, CoreImageAttributes, Operations, UnpicBaseImageProps } from "@unpic/core/base"
import { transformBaseImageProps } from "@unpic/core/base"

@customElement("nosto-image")
export class NostoImage extends HTMLElement {
  static attributes = {
    src: String,
    width: String,
    height: String,
    aspectRatio: String,
    layout: String
  }

  src!: string
  width?: string
  height?: string
  aspectRatio?: string
  layout?: Layout

  connectedCallback() {
    this.validateProps()
    const { src, width, height, layout = "constrained" } = this

    const { transformer } = useTransformer(src, layout)

    const imageProps = {
      src,
      ...(width && { width: parseInt(width, 10) }),
      ...(height && { height: parseInt(height, 10) }),
      ...(this.aspectRatio && { aspectRatio: parseFloat(this.aspectRatio) }),
      layout: layout || ("constrained" as Layout),
      transformer
    } as UnpicBaseImageProps<Operations, unknown, CoreImageAttributes<unknown>>

    const transformedImagePros = transformBaseImageProps(imageProps)

    const imageHtml = `
      <img ${convertAttributesToHTMLProps(transformedImagePros)}>
    `
    this.innerHTML = imageHtml
  }

  validateProps() {
    if (this.layout && !["fixed", "constrained", "fullWidth"].includes(this.layout)) {
      throw new Error(`Invalid layout: ${this.layout}. Allowed values are 'fixed', 'constrained', 'fullWidth'.`)
    }

    if (this.layout !== "fullWidth") {
      if (checkRequired(this, "width", "aspectRatio") || checkRequired(this, "height", "aspectRatio")) {
        throw new Error("Either 'width' and 'aspectRatio' or 'height' and 'aspectRatio' must be provided.")
      }
    }
  }
}

function convertAttributesToHTMLProps(props: CoreImageAttributes<unknown>) {
  const attributes = Object.entries(props)
    .filter(([key, value]) => key !== "style" && value !== undefined && value !== null)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ")

  const styles = Object.entries(props.style as object)
    .map(([k, v]) => `${k}:${v}`)
    .join(";")

  return `${attributes} style="${styles}"`.trim()
}
