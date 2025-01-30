import { SkuOptionVM } from "@/types"

export default [
  {
    optionType: "color",
    optionValue: "red",
    skus: [
      {
        id: "11",
        productId: "productId",
        name: "skuName",
        listPrice: 100.0,
        price: 100.0,
        url: "https://localhost.com?nosto=recId",
        imageUrl: "https://localhost.com/imgage.jpg",
        customFields: [{ color: "red" }, { size: "L" }],
        available: true,
        discounted: false
      },
      {
        id: "12",
        productId: "productId",
        name: "skuName",
        listPrice: 100.0,
        price: 90.0,
        discount: { percent: 10.0, amount: 10.0, rawPercentage: 10.0 },
        url: "https://localhost.com?nosto=recId",
        imageUrl: "https://localhost.com/imgage.jpg",
        customFields: [{ color: "red" }, { size: "M" }],
        available: true,
        discounted: true
      },
      {
        id: "13",
        productId: "productId",
        name: "skuName",
        listPrice: 400.0,
        price: 200.0,
        discount: { percent: 50.0, amount: 200.0, rawPercentage: 50.0 },
        url: "https://localhost.com?nosto=recId",
        imageUrl: "https://localhost.com/imgage.jpg",
        customFields: [{ color: "red" }, { size: "S" }],
        available: true,
        discounted: true
      },
      {
        id: "14",
        productId: "productId",
        name: "skuName",
        listPrice: 400.0,
        price: 200.0,
        discount: { percent: 50.0, amount: 200.0, rawPercentage: 50.0 },
        url: "https://localhost.com?nosto=recId",
        imageUrl: "https://localhost.com/imgage.jpg",
        customFields: [{ size: "XL" }, { color: "red" }],
        available: true,
        discounted: true
      }
    ],
    nextLayerOptions: [
      {
        optionType: "size",
        optionValue: "L",
        skus: [
          {
            id: "11",
            productId: "productId",
            name: "skuName",
            listPrice: 100.0,
            price: 100.0,
            url: "https://localhost.com?nosto=recId",
            imageUrl: "https://localhost.com/imgage.jpg",
            customFields: [{ color: "red" }, { size: "L" }],
            available: true,
            discounted: false
          }
        ],
        nextLayerOptions: [],
        available: true
      },
      {
        optionType: "size",
        optionValue: "M",
        skus: [
          {
            id: "12",
            productId: "productId",
            name: "skuName",
            listPrice: 100.0,
            price: 90.0,
            discount: {
              percent: 10.0,
              amount: 10.0,
              rawPercentage: 10.0
            },
            url: "https://localhost.com?nosto=recId",
            imageUrl: "https://localhost.com/imgage.jpg",
            customFields: [{ color: "red" }, { size: "M" }],
            available: true,
            discounted: true
          }
        ],
        nextLayerOptions: [],
        available: true
      },
      {
        optionType: "size",
        optionValue: "S",
        skus: [
          {
            id: "13",
            productId: "productId",
            name: "skuName",
            listPrice: 400.0,
            price: 200.0,
            discount: {
              percent: 50.0,
              amount: 200.0,
              rawPercentage: 50.0
            },
            url: "https://localhost.com?nosto=recId",
            imageUrl: "https://localhost.com/imgage.jpg",
            customFields: [{ color: "red" }, { size: "S" }],
            available: true,
            discounted: true
          }
        ],
        nextLayerOptions: [],
        available: true
      },
      {
        optionType: "size",
        optionValue: "XL",
        skus: [
          {
            id: "14",
            productId: "productId",
            name: "skuName",
            listPrice: 400.0,
            price: 200.0,
            discount: {
              percent: 50.0,
              amount: 200.0,
              rawPercentage: 50.0
            },
            url: "https://localhost.com?nosto=recId",
            imageUrl: "https://localhost.com/imgage.jpg",
            customFields: [{ size: "XL" }, { color: "red" }],
            available: true,
            discounted: true
          }
        ],
        nextLayerOptions: [],
        available: true
      }
    ],
    available: true
  },
  {
    optionType: "color",
    optionValue: "blue",
    skus: [
      {
        id: "21",
        productId: "productId",
        name: "skuName",
        listPrice: null,
        price: 21.2,
        url: "https://localhost.com?nosto=recId",
        imageUrl: "https://localhost.com/imgage.jpg",
        customFields: [{ color: "blue" }, { size: "M" }],
        available: true,
        discounted: false
      },
      {
        id: "22",
        productId: "productId",
        name: "skuName",
        listPrice: null,
        price: 21.2,
        url: "https://localhost.com?nosto=recId",
        imageUrl: "https://localhost.com/imgage.jpg",
        customFields: [{ color: "blue" }, { size: "L" }],
        available: true,
        discounted: false
      }
    ],
    nextLayerOptions: [
      {
        optionType: "size",
        optionValue: "M",
        skus: [
          {
            id: "21",
            productId: "productId",
            name: "skuName",
            listPrice: null,
            price: 21.2,
            url: "https://localhost.com?nosto=recId",
            imageUrl: "https://localhost.com/imgage.jpg",
            customFields: [{ color: "blue" }, { size: "M" }],
            available: true,
            discounted: false
          }
        ],
        nextLayerOptions: [],
        available: true
      },
      {
        optionType: "size",
        optionValue: "L",
        skus: [
          {
            id: "22",
            productId: "productId",
            name: "skuName",
            listPrice: null,
            price: 21.2,
            url: "https://localhost.com?nosto=recId",
            imageUrl: "https://localhost.com/imgage.jpg",
            customFields: [{ color: "blue" }, { size: "L" }],
            available: true,
            discounted: false
          }
        ],
        nextLayerOptions: [],
        available: true
      }
    ],
    available: true
  }
] as unknown as Array<Partial<SkuOptionVM>>
