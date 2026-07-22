const express = require('express')
const { db, writeDb, generateId } = require('../data/store')
const { verifyToken } = require('./auth')
const router = express.Router()

const ORDER_STATUSES = ['created', 'awaiting_payment', 'paid', 'shipped', 'delivered', 'cancelled']

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
}

router.post('/', verifyToken, (req, res) => {
  const { customer, delivery, items, promoCode } = req.body || {}
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Order items required' })

  const unavailable = []
  const orderItems = []

  items.forEach((item) => {
    const product = db.products.find((p) => p.variants.some((v) => v.sku === item.sku))
    const variant = product && product.variants.find((v) => v.sku === item.sku)
    if (!variant || variant.stock < item.quantity) {
      unavailable.push({ sku: item.sku, available: Boolean(variant), stock: variant ? variant.stock : 0 })
    } else {
      orderItems.push({ sku: item.sku, name: product.name, color: variant.color, size: variant.size, price: variant.price, quantity: item.quantity, image: variant.image })
    }
  })

  if (unavailable.length) return res.status(409).json({ error: 'Some items are unavailable', unavailable })

  orderItems.forEach((item) => {
    const product = db.products.find((p) => p.variants.some((v) => v.sku === item.sku))
    const variant = product.variants.find((v) => v.sku === item.sku)
    variant.stock -= item.quantity
  })

  let total = calculateTotal(orderItems)
  let discount = 0
  if (promoCode === 'STREET10') {
    discount = Math.round(total * 0.1)
    total -= discount
  }

  const order = {
    id: generateId('ord-'),
    userId: req.user.id,
    customer: customer || {},
    delivery: delivery || {},
    items: orderItems,
    promoCode: promoCode || null,
    discount,
    total,
    status: 'created',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  db.orders.push(order)
  writeDb(db)

  res.json(order)
})

router.get('/:id', verifyToken, (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id && o.userId === req.user.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

router.get('/', verifyToken, (req, res) => {
  const orders = db.orders.filter((o) => o.userId === req.user.id)
  res.json(orders)
})

router.patch('/:id/status', verifyToken, (req, res) => {
  const { status } = req.body || {}
  if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid order status' })

  const order = db.orders.find((o) => o.id === req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  order.status = status
  order.updatedAt = new Date().toISOString()
  writeDb(db)
  res.json(order)
})

module.exports = router
