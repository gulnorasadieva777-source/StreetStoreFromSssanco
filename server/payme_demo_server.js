// Простая демонстрация сервера для интеграции локального шлюза (Payme-like)
// Как использовать: `node server/payme_demo_server.js` (нужен node >=14)
// Для теста с вебхуками используйте ngrok или публичный HTTPS.

const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')

const app = express()
app.use(bodyParser.json())

// In-memory storage for demo invoices
const INVOICES = {}

function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2,8) }

// Create invoice: client calls this when пользователь нажал "Купить"
// Request: { items: [...], total }
// Response: { invoiceId, payUrl }
app.post('/api/create-invoice', (req, res) => {
  const { items, total } = req.body || {}
  const id = genId()
  const invoice = { id, items: items || [], total: total || 0, status: 'pending', createdAt: new Date().toISOString() }
  INVOICES[id] = invoice

  // In real integration, here you would call Payme API to register the invoice
  // and get back a payment URL. For demo we simulate a payment page URL which
  // client can open. We'll provide a simple demo URL that when opened shows
  // instructions and a button which triggers the webhook below.

  const payUrl = `${req.protocol}://${req.get('host')}/pay/${id}`
  res.json({ invoiceId: id, payUrl })
})

// Simple demo payment page: user opens and clicks "Оплатить", which calls webhook
app.get('/pay/:id', (req, res) => {
  const id = req.params.id
  const inv = INVOICES[id]
  if (!inv) return res.status(404).send('Invoice not found')
  res.send(`
    <html><body style="font-family:Arial,Helvetica,sans-serif;padding:24px">
      <h2>Демо-оплата — счёт ${id}</h2>
      <p>Сумма: <strong>${Number(inv.total).toLocaleString('ru-RU')} сум</strong></p>
      <p>Нажмите кнопку, чтобы симулировать успешный платёж (в реальном мире пользователь оплатит в приложении банка).</p>
      <form method="post" action="/api/demo-pay/${id}">
        <button type="submit" style="padding:12px 18px;font-size:16px">Оплатить (демо)</button>
      </form>
    </body></html>
  `)
})

// Simulate provider calling webhook to notify about payment.
app.post('/api/demo-pay/:id', (req, res) => {
  const id = req.params.id
  const inv = INVOICES[id]
  if (!inv) return res.status(404).send('Invoice not found')
  inv.status = 'paid'

  // In a real integration the provider would POST to your /api/webhook endpoint.
  // For demo we call the webhook handler internally to simulate that behaviour.
  // The webhook payload structure depends on provider; here we use a simple shape.
  const payload = { invoiceId: id, status: 'paid', total: inv.total }
  // call webhook handler
  try {
    // For demo we just mark and log
    console.log('Demo: triggering webhook for invoice', id)
  } catch (e) {
    console.error(e)
  }

  res.send(`<html><body style="font-family:Arial,Helvetica,sans-serif;padding:24px"><h2>Оплата выполнена (демо)</h2><p>Закройте это окно и вернитесь на сайт.</p></body></html>`)
})

// Webhook endpoint that a real provider would call.
// Implement verification (IP, signature, secret) in production.
app.post('/api/webhook', (req, res) => {
  const { invoiceId, status } = req.body || {}
  if (!invoiceId) return res.status(400).send('Missing invoiceId')
  const inv = INVOICES[invoiceId]
  if (!inv) return res.status(404).send('Invoice not found')
  inv.status = status || 'paid'
  console.log('Webhook received for', invoiceId, 'status', inv.status)

  // In a real app you would update order in DB and possibly notify user.

  res.json({ ok: true })
})

// Simple status endpoint
app.get('/api/invoice/:id', (req, res) => {
  const id = req.params.id
  const inv = INVOICES[id]
  if (!inv) return res.status(404).send('Invoice not found')
  res.json(inv)
})

const port = process.env.PORT || 4001
app.listen(port, () => console.log(`Payme-demo server running on http://localhost:${port}`))
