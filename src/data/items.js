const imageFiles = [
  'catalog 1.png','catalog 2.png','catalog 3.jpg','catalog 4.jpg','catalog 5.jpg','catalog 6.png','catalog 7.png','catalog 8.png','catalog 9.png','catalog 10.jpg'
]

const sizes = ["S", "M", "L", "XL"]
const colors = ["чёрный","белый","серый","хаки","синий","бордовый"]

// Сеты одежды удалены — используем только отдельные элементы из папок img

// Files in img/Man shirt — add as tshirts category items
const manShirtFiles = [
  'Ami paris.jpg',
  'Bear.jpg',
  'Broken planet.jpg',
  'Dior.jpg',
  'Essentails.jpg',
  'Eyes.jpg',
  'Hermes.jpg',
  'Los angeles cal.jpg',
  'Maison Margela Paris.jpg',
  'Marlbaro.jpg',
  'Master Piece.jpg',
  'mini spider man.jpg',
  'Moncler (2).jpg',
  'Moncler.jpg',
  'Monte Carlo.jpg',
  'Nirvana.jpg',
  'Paper.jpg',
  'Pas aitatau.jpg',
  'Prada.jpg',
  'Saint Laurent.jpg',
  'Time seaside.jpg',
  'Tommy Hilfliger.jpg'
]

function humanizeFilename(fn) {
  const noExt = fn.replace(/\.[^/.]+$/, '')
  const cleaned = noExt.replace(/[_-]+/g, ' ').replace(/\s+/g, ' ').trim()
  return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

const itemOverrides = {
  'girl sneakers/Not name.jpg': { name: 'air force 1 nocta pink', price: 400000 },
  'men hoodies/Polo bear.jpg': { price: 400000 },
  'man shirt/Moncler.jpg': { price: 250000 },
  'man shirt/Moncler (2).jpg': { name: 'Moncler text', price: 150000 },
  'girl jeans/Female jeans (14).jpg': { name: 'American Vintage', price: 300000 },
  'girl hoodies/Champs.jpg': { price: 130000 },
  'man shirt/Broken planet.jpg': { price: 300000 },
  'men hoodies/Broken Planet.jpg': { price: 350000 },
  'men hoodies/Marvel.jpg': { price: 250000 },
  'girl hoodies/Noname.jpg': { price: 350000 },
  'girl hoodies/Nocta.jpg': { price: 500000 },
  'girl hoodies/King.jpg': { price: 350000 },
  'girl hoodies/Burberry.jpg': { name: 'Burberry fm', price: 500000 },
  'girl hoodies/Champ.jpg': { price: 350000 },
  'girl hoodies/Champion.jpg': { price: 350000 },
  'men sneakers/No name (2).jpg': { name: 'Europe casual', price: 800000 },
  'girl jeans/Female jeans (10).jpg': { price: 350000 },
  'girl hoodies/Champions.jpg': { price: 250000 },
  'men accessories/Акссесуар (7).jpg': { name: 'Nike bag', price: 250000 },
  'girl hoodies/Love.jpg': { price: 350000 },
  'men sneakers/Saint Laurent.jpg': { price: 550000 },
  'girl shirt/Polo.jpg': { price: 150000 },
  'men hoodies/Polo.jpg': { price: 350000 },
  'girl hoodies/Polo.jpg': { price: 350000 },
  'men sneakers/Polo.jpg': { name: 'USPA shoes', price: 750000 },
  'girl jeans/Female jeans (5).jpg': { name: 'American vinta', price: 250000 },
  'girl sneakers/Air Force.jpg': { price: 400000 },
  'girl shirt/No name.jpg': { name: 'summer', price: 140000 },
  'girl sneakers/No name.jpg': { name: 'summer', price: 600000 },
  'man shirt/Eyes.jpg': { price: 200000 },
  'men jeans/Eyes.jpg': { name: 'Eyes jeans', price: 300000 },
  'girl jeans/Female jeans (11).jpg': { name: 'NewBF', price: 250000 },
  'men jeans/Sakura.jpg': { price: 350000 },
  'girl sneakers/Adidas (2).jpg': { name: 'Adidas class', price: 350000 },
  'girl shirt/idk.jpg': { name: 'Angel', price: 150000 },
  'girl jeans/Female jeans (12).jpg': { name: 'Versatile', price: 350000 },
  'men hoodies/Барберри.jpg': { price: 500000 },
  'man shirt/Prada.jpg': { price: 200000 },
  'girl shirt/Usa.jpg': { price: 150000 },
  'girl sneakers/noname.jpg': { name: 'Isabel', price: 450000 },
  'girl jeans/Female jeans (16).jpg': { name: 'Spice Petite', price: 350000 },
  'men hoodies/Brooklyn.jpg': { price: 200000 },
  'man shirt/Pas aitatau.jpg': { price: 200000 },
  'girl hoodies/GM.jpg': { price: 400000 },
  'girl hoodies/Red.jpg': { price: 400000 },
  'girl hoodies/Supreme.jpg': { price: 400000 },
  'girl hoodies/Nike.jpg': { price: 600000 },
  'man shirt/Time seaside.jpg': { price: 200000 },
  'men accessories/Акссесуар (8).jpg': { name: 'F1 bolide case' },
  'man shirt/Tommy Hilfliger.jpg': { price: 200000 },
  'men hoodies/Tommy Hilfliger.jpg': { price: 250000 },
  'men accessories/Акссесуар (5).jpg': { name: 'Jordan Bag', price: 200000 },
  'men accessories/Акссесуар (1).jpg': { name: 'No time sorry case', price: 50000 },
  'girl jeans/Female jeans (3).jpg': { name: 'Ribbet jeans', price: 300000 },
  'girl sneakers/Adidas p.jpg': { price: 450000 },
  'girl jeans/Female jeans (19).jpg': { name: 'Black jeans', price: 300000 },
  'girl shirt/white Heart.jpg': { price: 130000 },
  'girl jeans/Female jeans (20).jpg': { name: 'white look jeans', price: 300000 },
  'girl hoodies/Spider.jpg': { price: 300000 },
  'girl shirt/Ami paris.jpg': { price: 130000 },
  'girl shirt/Amiri.jpg': { price: 140000 },
  'girl shirt/Batman.jpg': { price: 130000 },
  'girl shirt/Cat.jpg': { price: 150000 },
  'girl shirt/Champs (2).jpg': { price: 130000 },
  'girl shirt/K mask.jpg': { price: 140000 },
  'girl shirt/Leopard.jpg': { price: 130000 },
  'girl shirt/World Gone Mad.jpg': { price: 150000 },
  'girl shirt/Love green.jpg': { price: 150000 },
  'girl shirt/Just do it.jpg': { price: 150000 },
  'girl shirt/Gepard.jpg': { price: 140000 },
  'men sneakers/Europe.jpg': { price: 550000 },
  'men sneakers/Casual.jpg': { price: 300000 },
  'men sneakers/Cartelo.jpg': { price: 300000 },
  'men sneakers/Air Force 1.jpg': { price: 400000 },
  'men sneakers/Nike Jordan.jpg': { price: 400000 },
  'men sneakers/Numeris.jpg': { price: 450000 },
  'men sneakers/Golden Goose.jpg': { price: 550000 },
  'girl sneakers/Pink nike.jpg': { price: 450000 },
  'girl sneakers/Yellow Nike.jpg': { price: 550000 },
  'girl sneakers/Nike.jpg': { price: 500000 },
  'girl sneakers/Pink sneakers.jpg': { price: 500000 },
  'girl sneakers/Adidas (3).jpg': { price: 500000 },
  'girl sneakers/Adidas.jpg': { price: 400000 },
  'girl sneakers/SuperStar.jpg': { price: 500000 },
  'girl sneakers/NIke (2).jpg': { price: 500000 },
  'girl sneakers/Nike jordan.jpg': { price: 500000 },
  'girl sneakers/Dolce&Gabbana.jpg': { price: 500000 },
  'girl sneakers/Nike jor.jpg': { price: 500000 },
  'girl sneakers/Sneak.jpg': { price: 450000 },
  'girl sneakers/Red Force.jpg': { price: 500000 },
  'girl sneakers/Red ship.jpg': { price: 500000 },
  'men hoodies/Essentails.jpg': { price: 500000 },
  'men hoodies/Qazaqsha.jpg': { price: 250000 },
  'men hoodies/Money.jpg': { price: 250000 },
  'men hoodies/Burberry.jpg': { price: 500000 },
  'men hoodies/Los angeles.jpg': { price: 350000 },
  // men jeans overrides
  'men jeans/NoName.jpg': { name: 'Retro', price: 350000 },
  'men jeans/Polo.jpg': { price: 350000 },
  'men jeans/Linen.jpg': { price: 350000 },
  'men jeans/Kiton.jpg': { price: 500000 },
  'men jeans/SakuraWar.jpg': { price: 450000 },
  'men jeans/Big Boy.jpg': { price: 350000 },
  'men jeans/Men Jeans.jpg': { price: 300000 },
  'men jeans/Dime.jpg': { price: 350000 },
  // girl jeans overrides
  'girl jeans/Female jeans (2).jpg': { name: 'Xike Ciko', price: 300000 },
  'girl jeans/Female jeans (15).jpg': { name: 'CowBoy', price: 300000 },
  'girl jeans/Female jeans (4).jpg': { name: 'Camoufls', price: 250000 },
  'girl jeans/Female jeans (10).jpg': { name: 'Cherry blossom', price: 450000 },
  'girl jeans/Female jeans (6).jpg': { name: 'LooseFit', price: 450000 },
  'girl jeans/Female jeans (17).jpg': { name: 'DeconStructed', price: 350000 },
  'girl jeans/Female jeans (13).jpg': { name: 'Low-Rise Flared', price: 350000 },
  'girl jeans/Female jeans (21).jpg': { name: 'StreetLight', price: 450000 },
  'girl jeans/Female jeans (18).jpg': { name: 'LeopardPrint', price: 350000 },
  'girl jeans/Female jeans (8).jpg': { name: 'PinkHome', price: 400000 },
  // additional female jeans and accessories requested now
  'girl jeans/Female jeans (1).jpg': { name: 'Roses', price: 350000 },
  'girl jeans/Female jeans (7).jpg': { name: 'White leop', price: 350000 },
  'girl jeans/Female jeans (9).jpg': { name: 'Jaded Letter', price: 400000 },
  'men accessories/Акссесуар (11).jpg': { name: 'Adidas bag pink', price: 250000 },
  'men accessories/Акссесуар (2).jpg': { name: 'Nike bag red', price: 250000 },
  'men accessories/Акссесуар (9).jpg': { name: 'Adidas bag red', price: 250000 },
  'men accessories/Акссесуар (10).jpg': { name: 'Pitaka', price: 50000 },
  'men accessories/Акссесуар (3).jpg': { name: 'Adidas bag blue', price: 250000 },
  'men accessories/Акссесуар (4).jpg': { name: 'Nike bag pink', price: 250000 },
  'men accessories/Акссесуар (6).jpg': { name: 'Lacoste bag', price: 280000 }
}

function applyItemOverrides(item, fileName, folder) {
  const imageKey = `${folder}/${fileName}`
  return { ...item, ...(itemOverrides[imageKey] || itemOverrides[fileName] || {}) }
}

const manShirtItems = manShirtFiles.map((f, i) => applyItemOverrides({
  id: 1000 + i,
  name: humanizeFilename(f),
  price: 120000 + (i % 4) * 10000,
  description: `Футболка ${humanizeFilename(f)}`,
  image: `man shirt/${f}`,
  sizes: sizes,
  colors: [colors[i % colors.length], colors[(i + 1) % colors.length]],
  category: 'tshirts',
  stock: i % 5 === 0 ? 2 : 12
}, f, 'man shirt'))

// Files in img/girl shirt — add as women's tshirts
const girlShirtFiles = [
  'Ami paris.jpg',
  'Amiri.jpg',
  'Batman.jpg',
  'Cat.jpg',
  'Champs (2).jpg',
  'Champs.jpg',
  'Gepard.jpg',
  'idk.jpg',
  'Just do it.jpg',
  'K mask.jpg',
  'Leopard.jpg',
  'Love green.jpg',
  'No name.jpg',
  'Polo.jpg',
  'Usa.jpg',
  'white Heart.jpg',
  'World Gone Mad.jpg'
]

const girlShirtItems = girlShirtFiles.map((f, i) => applyItemOverrides({
  id: 2000 + i,
  name: humanizeFilename(f),
  price: 110000 + (i % 5) * 8000,
  description: `Футболка ${humanizeFilename(f)} (женская)`,
  image: `girl shirt/${f}`,
  sizes: sizes,
  colors: [colors[(i+2) % colors.length], colors[(i + 3) % colors.length]],
  category: 'tshirts-women',
  stock: i % 6 === 0 ? 1 : 10
}, f, 'girl shirt'))

const menHoodiesFiles = [
  'Broken Planet.jpg',
  'Brooklyn.jpg',
  'Burberry.jpg',
  'Essentails.jpg',
  'Los angeles.jpg',
  'Marvel.jpg',
  'Money.jpg',
  'Polo bear.jpg',
  'Polo.jpg',
  'Qazaqsha.jpg',
  'Tommy Hilfliger.jpg',
  'Барберри.jpg'
]

const girlHoodiesFiles = [
  'Burberry.jpg',
  'Champ.jpg',
  'Champion.jpg',
  'Champions.jpg',
  'GM.jpg',
  'King.jpg',
  'Love.jpg',
  'Nike.jpg',
  'Nocta.jpg',
  'Noname.jpg',
  'Polo.jpg',
  'Red.jpg',
  'Spider.jpg',
  'Supreme.jpg'
]

const menSneakersFiles = [
  'Air Force 1.jpg',
  'Cartelo.jpg',
  'Casual.jpg',
  'Europe.jpg',
  'Golden Goose.jpg',
  'Nike Jordan.jpg',
  'No name (2).jpg',
  'Numeris.jpg',
  'Polo.jpg',
  'Saint Laurent.jpg'
]

const girlSneakersFiles = [
  'Adidas (2).jpg',
  'Adidas (3).jpg',
  'Adidas p.jpg',
  'Adidas.jpg',
  'Air Force.jpg',
  'Dolce&Gabbana.jpg',
  'NIke (2).jpg',
  'Nike jor.jpg',
  'Nike jordan.jpg',
  'Nike.jpg',
  'No name.jpg',
  'noname.jpg',
  'Not name.jpg',
  'Pink nike.jpg',
  'Pink sneakers.jpg',
  'Red Force.jpg',
  'Red ship.jpg',
  'Sneak.jpg',
  'SuperStar.jpg',
  'Yellow Nike.jpg'
]

const menSneakersItems = menSneakersFiles.map((f, i) => applyItemOverrides({
  id: 3000 + i,
  name: humanizeFilename(f),
  price: 130000 + (i % 5) * 9000,
  description: `Кроссовки ${humanizeFilename(f)} для мужчин`,
  image: `men sneakers/${f}`,
  sizes: sizes,
  colors: [colors[(i + 1) % colors.length], colors[(i + 2) % colors.length]],
  category: 'sneakers',
  gender: 'men',
  stock: i % 4 === 0 ? 2 : 8
}, f, 'men sneakers'))

const girlSneakersItems = girlSneakersFiles.map((f, i) => applyItemOverrides({
  id: 4000 + i,
  name: humanizeFilename(f),
  price: 135000 + (i % 5) * 9000,
  description: `Кроссовки ${humanizeFilename(f)} для женщин`,
  image: `girl sneakers/${f}`,
  sizes: sizes,
  colors: [colors[(i + 2) % colors.length], colors[(i + 3) % colors.length]],
  category: 'sneakers',
  gender: 'women',
  stock: i % 4 === 0 ? 2 : 7
}, f, 'girl sneakers'))

const menHoodiesItems = menHoodiesFiles.map((f, i) => applyItemOverrides({
  id: 5000 + i,
  name: humanizeFilename(f),
  price: 145000 + (i % 5) * 9000,
  description: `Худи ${humanizeFilename(f)} для мужчин`,
  image: `men hoodies/${f}`,
  sizes: sizes,
  colors: [colors[(i + 1) % colors.length], colors[(i + 2) % colors.length]],
  category: 'hoodies',
  gender: 'men',
  stock: i % 4 === 0 ? 2 : 9
}, f, 'men hoodies'))

const girlHoodiesItems = girlHoodiesFiles.map((f, i) => applyItemOverrides({
  id: 6000 + i,
  name: humanizeFilename(f),
  price: 150000 + (i % 5) * 9000,
  description: `Худи ${humanizeFilename(f)} для женщин`,
  image: `girl hoodies/${f}`,
  sizes: sizes,
  colors: [colors[(i + 2) % colors.length], colors[(i + 3) % colors.length]],
  category: 'hoodies',
  gender: 'women',
  stock: i % 4 === 0 ? 1 : 8
}, f, 'girl hoodies'))

const menJeansFiles = [
  'Big Boy.jpg',
  'Dime.jpg',
  'Eyes.jpg',
  'Kiton.jpg',
  'Linen.jpg',
  'Men Jeans.jpg',
  'NoName.jpg',
  'Polo.jpg',
  'Sakura.jpg',
  'SakuraWar.jpg'
]

const girlJeansFiles = [
  'Female jeans (1).jpg',
  'Female jeans (2).jpg',
  'Female jeans (3).jpg',
  'Female jeans (4).jpg',
  'Female jeans (5).jpg',
  'Female jeans (6).jpg',
  'Female jeans (7).jpg',
  'Female jeans (8).jpg',
  'Female jeans (9).jpg',
  'Female jeans (10).jpg',
  'Female jeans (11).jpg',
  'Female jeans (12).jpg',
  'Female jeans (13).jpg',
  'Female jeans (14).jpg',
  'Female jeans (15).jpg',
  'Female jeans (16).jpg',
  'Female jeans (17).jpg',
  'Female jeans (18).jpg',
  'Female jeans (19).jpg',
  'Female jeans (20).jpg',
  'Female jeans (21).jpg'
]

const menJeansItems = menJeansFiles.map((f, i) => applyItemOverrides({
  id: 7000 + i,
  name: humanizeFilename(f),
  price: 140000 + (i % 5) * 8000,
  description: `Джинсы ${humanizeFilename(f)} для мужчин`,
  image: `men jeans/${f}`,
  sizes: sizes,
  colors: [colors[i % colors.length], colors[(i + 1) % colors.length]],
  category: 'jeans',
  gender: 'men',
  stock: i % 4 === 0 ? 2 : 8
}, f, 'men jeans'))

const girlJeansItems = girlJeansFiles.map((f, i) => applyItemOverrides({
  id: 8000 + i,
  name: humanizeFilename(f),
  price: 145000 + (i % 5) * 8000,
  description: `Джинсы ${humanizeFilename(f)} для женщин`,
  image: `girl jeans/${f}`,
  sizes: sizes,
  colors: [colors[(i + 1) % colors.length], colors[(i + 2) % colors.length]],
  category: 'jeans',
  gender: 'women',
  stock: i % 4 === 0 ? 1 : 7
}, f, 'girl jeans'))

const accessoriesFiles = [
  'Акссесуар (1).jpg',
  'Акссесуар (2).jpg',
  'Акссесуар (3).jpg',
  'Акссесуар (4).jpg',
  'Акссесуар (5).jpg',
  'Акссесуар (6).jpg',
  'Акссесуар (7).jpg',
  'Акссесуар (8).jpg',
  'Акссесуар (9).jpg',
  'Акссесуар (10).jpg',
  'Акссесуар (11).jpg'
]

const accessoriesItems = accessoriesFiles.map((f, i) => applyItemOverrides({
  id: 9000 + i,
  name: humanizeFilename(f),
  price: 40000 + (i % 5) * 5000,
  description: `Аксессуар ${humanizeFilename(f)}`,
  image: `men accessories/${f}`,
  sizes: [],
  colors: [colors[i % colors.length]],
  category: 'accessories',
  stock: 8
}, f, 'men accessories'))

export const sampleItems = [...manShirtItems, ...girlShirtItems, ...menSneakersItems, ...girlSneakersItems, ...menHoodiesItems, ...girlHoodiesItems, ...menJeansItems, ...girlJeansItems, ...accessoriesItems]
