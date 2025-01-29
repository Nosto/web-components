interface Window {
  Nosto?: {
    addSkuToCart?: import("./types").AddSkuToCart
  }
}

declare module "*.module.css" {
  const classes: { [key: string]: string }
  export default classes
}
