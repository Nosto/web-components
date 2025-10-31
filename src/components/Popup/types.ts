/**
 * Props for the Popup custom element
 */
export type PopupProps = {
  /** Required name used for analytics and localStorage persistence */
  name: string
  /** Optional Nosto segment that acts as a precondition for activation */
  segment?: string
}
