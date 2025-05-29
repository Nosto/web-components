export default `:host {
    --image-width: 300px;
    --image-height: 300px;
    --ribbon-top: 0;
    --ribbon-right: 0;
  }

  nosto-product {
    position: relative;
  }

  .product-ribbon {
    position: absolute;
    top: var(--ribbon-top);
    right: var(--ribbon-right);
    z-index: 1;
  }

  .product-img {
    position: relative;
    width: var(--image-width);
    height: var(--image-height);
  }

  img {
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.3s ease-in-out;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  nosto-product[alt-img] img[n-alt-img],
  nosto-product[alt-img]:hover img[n-img] {
    opacity: 0;
  }
  nosto-product[alt-img]:hover img[n-alt-img] {
    opacity: 1;
  }`
