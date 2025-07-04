function getRandomId(offset: number) {
  return offset * Math.floor(Math.random() * 100)
}

function generateProducts() {
  return Array.from(new Array(11).keys())
    .slice(1)
    .map(index => {
      const price = (Math.random() * (index + 100)).toFixed(2)
      const listPrice = (Math.random() * (index + 150)).toFixed(2)
      return {
        name: `Product ${index}`,
        url: `https://picsum.photos/id/${index + 20}/800/800`,
        thumbUrl: `https://picsum.photos/id/${index + 20}/300/300`,
        productId: getRandomId(index + 1),
        imageUrl: `https://picsum.photos/id/${index + 20}/800/800`,
        price,
        priceCurrencyCode: "EUR",
        skus: [
          {
            name: "BURGUNDY / XS",
            id: getRandomId(index + 2),
            available: true,
            imageUrl: `https://picsum.photos/id/${index + 100}/300/300`,
            price,
            listPrice
          },
          {
            name: "BURGUNDY / S",
            id: getRandomId(index + 3),
            available: true,
            imageUrl: `https://picsum.photos/id/${index + 101}/300/300`,
            price,
            listPrice
          },
          {
            name: "BURGUNDY / M",
            id: getRandomId(index + 4),
            available: true,
            imageUrl: `https://picsum.photos/id/${index + 102}/300/300`,
            price,
            listPrice
          },
          {
            name: "BURGUNDY / L",
            id: getRandomId(index + 5),
            available: true,
            imageUrl: `https://picsum.photos/id/${index + 103}/300/300`,
            price,
            listPrice
          }
        ],
        priceText: `${price}€`,
        listPrice: listPrice,
        brand: `brand ${index + 1}`,
        datePublished: new Date().getTime(),
        listPriceText: `${listPrice}€`,
        description: `description for product ${index + 1}`
      }
    })
}

const imageTestProducts = [
  {
    name: "Big commerce product",
    imageUrl:
      "https://cdn11.bigcommerce.com/s-hm8pjhul3k/products/4055/images/23603/7-15297__04892.1719977920.1280.1280.jpg",
    productId: getRandomId(1)
  },
  {
    name: "Shopify product",
    imageUrl: "https://cdn.shopify.com/s/files/1/1183/1048/products/boat-shoes.jpeg?v=1459175177",
    productId: getRandomId(1)
  }
]

export default function () {
  return {
    divId: "productpage-nosto-1",
    resultId: "productslot-nosto-1",
    title: "Nosto recommendation",
    products: generateProducts(),
    imageProducts: imageTestProducts
  }
}
