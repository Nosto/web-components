export default function () {
  const products = Array.from(Array(11).keys())
    .slice(1)
    .map(id => ({
      id,
      name: `Simple Product ${id}`,
      price: id * 100,
      url: `https://picsum.photos/id/${id}/500/600`,
      image_url: `https://picsum.photos/id/${id}/200/300`,
      variants: [
        {
          id: id * 10,
          title: "variant #1"
        },
        {
          id: id * 11,
          title: "variant #2"
        }
      ]
    }))

  return { products }
}
