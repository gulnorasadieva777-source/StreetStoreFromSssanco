const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const DB_FILE = path.resolve(__dirname, '../server-db.json')
const defaultDb = {
  users: [],
  products: [],
  orders: [],
  invoices: []
}

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), 'utf-8')
      return JSON.parse(JSON.stringify(defaultDb))
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'))
  } catch (error) {
    console.error('Failed to read DB file:', error)
    return JSON.parse(JSON.stringify(defaultDb))
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

function generateId(prefix = '') {
  return prefix + crypto.randomBytes(8).toString('hex')
}

function createInitialProducts() {
  return [
    {
      id: 'prod-hoodie-1',
      name: 'Худи Street Minimal',
      category: 'hoodies',
      gender: 'unisex',
      thumbnail: 'men hoodies/Burberry.jpg',
      description: 'Удобное худи в уличном стиле.',
      variants: [
        { sku: 'HOD-M-BLK-S', color: 'чёрный', size: 'S', price: 145000, stock: 4, image: 'men hoodies/Burberry.jpg' },
        { sku: 'HOD-M-BLK-M', color: 'чёрный', size: 'M', price: 145000, stock: 0, image: 'men hoodies/Burberry.jpg' },
        { sku: 'HOD-M-GRY-L', color: 'серый', size: 'L', price: 145000, stock: 3, image: 'men hoodies/Essentails.jpg' }
      ]
    },
    {
      id: 'prod-hoodie-2',
      name: 'Худи Neon Vibe',
      category: 'hoodies',
      gender: 'women',
      thumbnail: 'girl hoodies/Champion.jpg',
      description: 'Яркое худи с неоновым принтом.',
      variants: [
        { sku: 'HOD-W-PNK-S', color: 'розовый', size: 'S', price: 150000, stock: 5, image: 'girl hoodies/Champion.jpg' },
        { sku: 'HOD-W-PNK-M', color: 'розовый', size: 'M', price: 150000, stock: 2, image: 'girl hoodies/Champion.jpg' }
      ]
    },
    {
      id: 'prod-sneakers-1',
      name: 'Кроссовки Air Sport',
      category: 'sneakers',
      gender: 'men',
      thumbnail: 'men sneakers/Nike Jordan.jpg',
      description: 'Комфортные кроссовки для улицы.',
      variants: [
        { sku: 'SNK-M-WHT-42', color: 'белый', size: '42', price: 130000, stock: 2, image: 'men sneakers/Nike Jordan.jpg' },
        { sku: 'SNK-M-BLK-43', color: 'чёрный', size: '43', price: 130000, stock: 1, image: 'men sneakers/Air Force 1.jpg' }
      ]
    },
    {
      id: 'prod-sneakers-2',
      name: 'Кроссовки Pink Runner',
      category: 'sneakers',
      gender: 'women',
      thumbnail: 'girl sneakers/Pink sneakers.jpg',
      description: 'Женские кроссовки в розовом цвете.',
      variants: [
        { sku: 'SNK-W-PNK-38', color: 'розовый', size: '38', price: 135000, stock: 4, image: 'girl sneakers/Pink sneakers.jpg' },
        { sku: 'SNK-W-PNK-39', color: 'розовый', size: '39', price: 135000, stock: 0, image: 'girl sneakers/Pink sneakers.jpg' }
      ]
    },
    {
      id: 'prod-jeans-1',
      name: 'Джинсы Classic Blue',
      category: 'jeans',
      gender: 'men',
      thumbnail: 'men jeans/Big Boy.jpg',
      description: 'Классические прямые джинсы.',
      variants: [
        { sku: 'JNS-M-BLU-32', color: 'синий', size: '32', price: 140000, stock: 6, image: 'men jeans/Big Boy.jpg' },
        { sku: 'JNS-M-BLU-34', color: 'синий', size: '34', price: 140000, stock: 3, image: 'men jeans/Dime.jpg' }
      ]
    },
    {
      id: 'prod-jeans-2',
      name: 'Джинсы Girl Fit',
      category: 'jeans',
      gender: 'women',
      thumbnail: 'girl jeans/Female jeans (1).jpg',
      description: 'Узкие женские джинсы.',
      variants: [
        { sku: 'JNS-W-BLU-26', color: 'синий', size: '26', price: 145000, stock: 4, image: 'girl jeans/Female jeans (1).jpg' },
        { sku: 'JNS-W-BLU-27', color: 'синий', size: '27', price: 145000, stock: 2, image: 'girl jeans/Female jeans (2).jpg' }
      ]
    },
    {
      id: 'prod-acc-1',
      name: 'Рюкзак Urban',
      category: 'accessories',
      gender: 'unisex',
      thumbnail: 'men accessories/Акссесуар (1).jpg',
      description: 'Стильный рюкзак для города.',
      variants: [
        { sku: 'ACC-BAG-01', color: 'чёрный', size: 'one-size', price: 80000, stock: 10, image: 'men accessories/Акссесуар (1).jpg' }
      ]
    },
    {
      id: 'prod-acc-2',
      name: 'Кепка Classic',
      category: 'accessories',
      gender: 'unisex',
      thumbnail: 'men accessories/Акссесуар (2).jpg',
      description: 'Бейсболка с лого.',
      variants: [
        { sku: 'ACC-CAP-01', color: 'белый', size: 'one-size', price: 45000, stock: 8, image: 'men accessories/Акссесуар (2).jpg' }
      ]
    }
  ]
}

const db = readDb()

if (!db.products || db.products.length === 0) {
  db.products = createInitialProducts()
  writeDb(db)
}

module.exports = {
  db,
  readDb,
  writeDb,
  generateId
}
