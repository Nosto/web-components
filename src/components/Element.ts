import { logFirstUsage } from "@/logger"

export abstract class NostoElement extends HTMLElement {
  constructor() {
    super()
    logFirstUsage()
  }
}
