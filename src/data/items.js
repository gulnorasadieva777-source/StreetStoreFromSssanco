const imageFiles = [
  'catalog 1.png','catalog 2.png','catalog 3.jpg','catalog 4.jpg','catalog 5.jpg','catalog 6.png','catalog 7.png','catalog 8.png','catalog 9.png','catalog 10.jpg'
]

export const sampleItems = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  name: `Сет Одежды ${i + 1}`,
  price: 1000000,
  description: `Описание сета одежды ${i + 1}`,
  image: imageFiles[i % imageFiles.length]
}))
