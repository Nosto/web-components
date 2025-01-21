import { ProductComponent } from "./product.component"

export function ProductTemplate(_component: ProductComponent) {
  return `
        <slot></slot>
    `
}
