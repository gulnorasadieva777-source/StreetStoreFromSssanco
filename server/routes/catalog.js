const express = require('express')
const { db, writeDb } = require('../data/store')
const router = express.Router()

function normalize(value) {
  return (value || '').toString().trim().toLowerCase()
}

function filterVariant(variant, filters) {
  if (!variant) return false
  if (filters.color && normalize(variant.color) !== normalize(filters.color)) return false
  if (filters.size && normalize(variant.size) !== normalize(filters.size)) return false
  if (filters.minPrice && Number(variant.price) < Number(filters.minPrice)) return false
  if (filters.maxPrice && Number(variant.price) > Number(filters.maxPrice)) return false
  return true
}

router.get('/', (req, res) => {
  const { category, gender, color, size, minPrice, maxPrice, sort } = req.query
  const products = db.products.map((product) => {
    const matchCategory = category ? normalize(product.category) === normalize(category) : true
    const matchGender = gender ? normalize(product.gender) === normalize(gender) || normalize(product.gender) === 'unisex' : true
    if (!matchCategory || !matchGender) return null
    const variants = product.variants.filter((variant) => filterVariant(variant, { color, size, minPrice, maxPrice }))
    if (variants.length === 0) return null
    return { ...product, variants }
  }).filter(Boolean)

  if (sort === 'price_asc') {
    products.sort((a, b) => (Math.min(...a.variants.map(v => v.price)) - Math.min(...b.variants.map(v => v.price))))
  }
  if (sort === 'price_desc') {
    products.sort((a, b) => (Math.max(...b.variants.map(v => v.price)) - Math.max(...a.variants.map(v => v.price))))
  }
  if (sort === 'new') {
    products.sort((a, b) => (a.id > b.id ? -1 : 1))
  }

  res.json(products)
})

router.get('/:id', (req, res) => {
  const product = db.products.find((item) => item.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

router.post('/check-stock', (req, res) => {
  const { items } = req.body || {}
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid items list' })

  const results = items.map((item) => {
    const product = db.products.find((p) => p.variants.some((v) => v.sku === item.sku))
    const variant = product && product.variants.find((v) => v.sku === item.sku)
    return {
      sku: item.sku,
      available: Boolean(variant && variant.stock >= item.quantity),
      stock: variant ? variant.stock : 0
    }
  })

  res.json({ items: results })
})

router.post('/reserve', (req, res) => {
  const { items } = req.body || {}
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Invalid items list' })

  const unavailable = []
  const updates = []

  items.forEach((item) => {
    const product = db.products.find((p) => p.variants.some((v) => v.sku === item.sku))
    const variant = product && product.variants.find((v) => v.sku === item.sku)
    if (!variant || variant.stock < item.quantity) {
      unavailable.push({ sku: item.sku, available: false, stock: variant ? variant.stock : 0 })
    } else {
      updates.push({ variant, qty: item.quantity })
    }
  })

  if (unavailable.length > 0) return res.status(409).json({ error: 'Some items are unavailable', unavailable })

  updates.forEach((update) => {
    update.variant.stock -= update.qty
  })
  writeDb(db)
  res.json({ ok: true })
})

module.exports = router
