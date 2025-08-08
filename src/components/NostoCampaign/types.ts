import { JSONResult } from "@nosto/nosto-js/client"

export type Renderer = (rec: JSONResult, target: HTMLElement) => Promise<void>
