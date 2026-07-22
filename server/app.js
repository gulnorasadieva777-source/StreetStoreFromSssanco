const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()

const catalogRouter = require('./routes/catalog')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const telegramRouter = require('./routes/telegram')
const paymentsRouter = require('./routes/payments')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// API маршруты
app.use('/api/catalog', catalogRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/auth', authRouter)
app.use('/api/telegram', telegramRouter)
app.use('/api/payments', paymentsRouter)

app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

// Раздача статических файлов (фронтенд)
app.use(express.static(path.join(__dirname, '../dist')))

// SPA маршрут: все остальные запросы идут на index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

const port = process.env.PORT || 4001
app.listen(port, () => console.log(`Backend server running on http://localhost:${port}`))
