/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { jsx } from "@/templating/jsx/jsx-runtime"
import type { TemplateExpression } from "@/templating/jsx/jsx-runtime"

export function generateMockMarkup(): TemplateExpression {
  return (
    <div class="card">
      <div class="image">
        <img src="https://cdn.nosto.com/nosto/7/mock" alt="Mock Product Image" />
      </div>
      <h3 class="title">Mock Product Title</h3>
      <p class="brand">Mock Brand</p>
      <div class="price">
        <span class="price-current">XX.XX</span>
        <span class="price-original">XX.XX</span>
      </div>
    </div>
  ) as unknown as TemplateExpression
}
