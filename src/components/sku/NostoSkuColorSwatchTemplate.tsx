import { createElement } from "@/jsx-render"
import { NostoSkuColorSwatch } from "./NostoSkuColorSwatch"
import styles from "./NostoSkuColorSwatch.module.css"

export default function (component: NostoSkuColorSwatch) {
  return (
    <div className={styles.colorDotsTemplate}>
      {component.colors.map(color => (
        <span key={color} style={{ "background-color": `${color}` }}></span>
      ))}
    </div>
  )
}
