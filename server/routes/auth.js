const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { db, writeDb, generateId } = require('../data/store')
const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'
const TOKEN_EXPIRES = '7d'

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES })
}

function normalizeUser(user) {
  if (!user) return null
  user.favorites = user.favorites || []
  user.cart = user.cart || []
  user.profile = user.profile || {
    gender: '',
    height: '',
    weight: '',
    size: '',
    styles: [],
    budget: '',
    bonus: 0,
    cashback: 0,
    savedTryOns: []
  }
  return user
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Token missing' })
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

function makeUserData(user) {
  const normalized = normalizeUser(user)
  return {
    id: normalized.id,
    email: normalized.email,
    name: normalized.name,
    favorites: normalized.favorites,
    cart: normalized.cart,
    profile: normalized.profile
  }
}

router.post('/register', async (req, res) => {
  const { email, password, name } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const existing = db.users.find((u) => u.email === email)
  if (existing) return res.status(409).json({ error: 'Email already used' })

  const hash = await bcrypt.hash(password, 10)
  const user = {
    id: generateId('usr-'),
    email,
    name: name || '',
    passwordHash: hash,
    createdAt: new Date().toISOString(),
    favorites: [],
    cart: [],
    profile: {
      gender: '',
      height: '',
      weight: '',
      size: '',
      styles: [],
      budget: '',
      bonus: 0,
      cashback: 0,
      savedTryOns: []
    }
  }
  db.users.push(user)
  writeDb(db)
  const token = signToken({ id: user.id, email: user.email })
  res.json({ token, user: makeUserData(user) })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' })
  const user = db.users.find((u) => u.email === email)
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken({ id: user.id, email: user.email })
  res.json({ token, user: makeUserData(user) })
})

router.get('/me', verifyToken, (req, res) => {
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(makeUserData(user))
})

router.post('/profile', verifyToken, (req, res) => {
  const { profile } = req.body || {}
  if (!profile || typeof profile !== 'object') return res.status(400).json({ error: 'Profile required' })
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  normalizeUser(user)
  user.profile = { ...user.profile, ...profile }
  writeDb(db)
  res.json({ profile: user.profile })
})

router.post('/cart', verifyToken, (req, res) => {
  const { cart } = req.body || {}
  if (!Array.isArray(cart)) return res.status(400).json({ error: 'Cart must be an array' })
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  normalizeUser(user)
  user.cart = cart
  writeDb(db)
  res.json({ cart: user.cart })
})

router.post('/favorite', verifyToken, (req, res) => {
  const { sku } = req.body || {}
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (!sku) return res.status(400).json({ error: 'sku required' })
  normalizeUser(user)
  if (!user.favorites.includes(sku)) user.favorites.push(sku)
  writeDb(db)
  res.json({ favorites: user.favorites })
})

router.delete('/favorite', verifyToken, (req, res) => {
  const { sku, clear } = req.body || {}
  const user = db.users.find((u) => u.id === req.user.id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  normalizeUser(user)
  if (clear) {
    user.favorites = []
    writeDb(db)
    return res.json({ favorites: user.favorites })
  }
  user.favorites = user.favorites.filter((item) => item !== sku)
  writeDb(db)
  res.json({ favorites: user.favorites })
})

module.exports = router
module.exports.verifyToken = verifyToken
