import { customElement } from "./decorators"
import styles from "./NostoProductCard/styles"

const templateElement = document.createElement("template")
templateElement.innerHTML = `
  <nosto-product reco-id="dummy">
    <slot name="top"></slot>
    <div class="product-ribbon">
      <slot name="ribbon"></slot>
    </div>
    <a n-url class="product-link">
      <div class="product-img">
        <img n-img alt="Product Image" />
        <img n-alt-img alt="Product Alt Image" />
      </div>
    </a>
    <slot></slot>
  </nosto-product>
`

const sheet = new CSSStyleSheet()
sheet.replaceSync(styles)

/**
 * A custom element that renders a product card based on Nosto recommendation data.
 */
@customElement("nosto-product-card")
export class NostoProductCard extends HTMLElement {
  static attributes = {
    productId: String,
    url: String,
    imageUrl: String,
    altImageUrl: String
  }

  productId!: string
  url!: string
  imageUrl!: string
  altImageUrl!: string

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" })
    shadow.adoptedStyleSheets = [sheet]
    const content = templateElement.content.cloneNode(true) as HTMLElement
    content.querySelector("nosto-product")!.setAttribute("product-id", this.productId || "")
    if (this.altImageUrl) {
      content.querySelector("nosto-product")!.toggleAttribute("alt-img", true)
    }
    content.querySelectorAll("[n-url]").forEach(el => el.setAttribute("href", this.url || "#"))
    setImage(content.querySelector("img[n-img]"), this.imageUrl)
    setImage(content.querySelector("img[n-alt-img]"), this.altImageUrl)
    shadow.appendChild(content)
  }
}

function setImage(img: HTMLElement | null, imageUrl: string) {
  if (imageUrl) {
    img?.setAttribute("src", imageUrl)
  } else {
    img?.remove()
  }
}
