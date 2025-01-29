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
        thumb_url: `https://picsum.photos/id/${index + 20}/300/300`,
        product_id: getRandomId(index + 1),
        image_url: `https://picsum.photos/id/${index + 20}/800/800`,
        price,
        price_currency_code: "EUR",
        skus: [
          {
            name: "BURGUNDY / XS",
            id: getRandomId(index + 2),
            available: true,
            image_url: `https://picsum.photos/id/${index + 100}/300/300`,
            price,
            list_price: listPrice
          },
          {
            name: "BURGUNDY / S",
            id: getRandomId(index + 3),
            available: true,
            image_url: `https://picsum.photos/id/${index + 101}/300/300`,
            price,
            list_price: listPrice
          },
          {
            name: "BURGUNDY / M",
            id: getRandomId(index + 4),
            available: true,
            image_url: `https://picsum.photos/id/${index + 102}/300/300`,
            price,
            list_price: listPrice
          },
          {
            name: "BURGUNDY / L",
            id: getRandomId(index + 5),
            available: true,
            image_url: `https://picsum.photos/id/${index + 103}/300/300`,
            price,
            list_price: listPrice
          }
        ],
        price_text: `${price}€`,
        list_price: listPrice,
        brand: `brand ${index + 1}`,
        date_published: new Date().getTime(),
        list_price_text: `${listPrice}€`,
        description: `description for product ${index + 1}`
      }
    })
}

function generateData() {
  return {
    "productslot-nosto-1": {
      result_id: "productslot-nosto-1",
      div_id: "productpage-nosto-1",
      result_type: "REAL",
      element: "productpage-nosto-1",
      title: "Nosto recommendation",
      products: generateProducts()
    }
  }
}

export type Product = ReturnType<typeof generateProducts>[number]
export type RecoResponse = ReturnType<typeof generateData>

export default generateData
