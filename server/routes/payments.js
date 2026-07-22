const express = require('express')
const axios = require('axios')
const multer = require('multer')
const FormData = require('form-data')
const { db, writeDb, generateId } = require('../data/store')
const router = express.Router()
const TELEGRAM_URL = 'https://api.telegram.org'
const upload = multer({ storage: multer.memoryStorage() })
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8769796716:AAGQJauSwD46_52ukg83o2G3MsE-M-hbvmk'
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1328876843'

function formatCurrency(value) {
  return Number(value).toLocaleString('ru-RU') + ' сум'
}

function buildNotificationText(invoice) {
  const itemsText = Array.isArray(invoice.items) && invoice.items.length > 0
    ? invoice.items.map((item, idx) => {
      const qty = item.quantity || 1
      const price = item.price ? formatCurrency(item.price) : '—'
      const name = item.name || item.title || item.description || 'Товар'
      const size = item.size ? `, размер ${item.size}` : ''
      const color = item.color ? `, цвет ${item.color}` : ''
      return `${idx + 1}. ${name}${color}${size} — ${qty} x ${price}`
    }).join('\n')
    : 'Нет данных по товарам.'

  const customer = invoice.customer || {}
  const customerText = [
    customer.name && `Имя: ${customer.name}`,
    customer.phone && `Телефон: ${customer.phone}`,
    customer.email && `Email: ${customer.email}`
  ].filter(Boolean).join('\n')

  const tgUser = customer.telegram ? customer.telegram.replace(/^@/, '') : null
  const tgText = tgUser ? `Telegram: <a href="https://t.me/${tgUser}">@${tgUser}</a>` : null

  return [
    `<b>Новый платёж принят</b>`,
    `Номер чека: <b>${invoice.id}</b>`,
    invoice.orderId ? `Заказ: <b>${invoice.orderId}</b>` : null,
    `Сумма: <b>${formatCurrency(invoice.total)}</b>`,
    `Статус: <b>${invoice.status}</b>`,
    invoice.receiptFileName ? `Файл чека: <b>${invoice.receiptFileName}</b>` : null,
    customerText ? `\n${customerText}` : null,
    tgText,
    `\nСостав заказа:\n${itemsText}`
  ].filter(Boolean).join('\n')
}

async function notifyTelegram(invoice, receiptFile) {
  if (!BOT_TOKEN || !CHAT_ID) {
    const message = 'Telegram bot token or chat ID is not configured'
    console.error(message)
    return { ok: false, error: message }
  }

  try {
    await axios.post(`${TELEGRAM_URL}/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: buildNotificationText(invoice),
      parse_mode: 'HTML'
    })

    if (receiptFile) {
      const form = new FormData()
      form.append('chat_id', CHAT_ID)
      const isImage = receiptFile.mimetype?.startsWith('image/')

      if (isImage) {
        form.append('photo', receiptFile.buffer, {
          filename: receiptFile.originalname,
          contentType: receiptFile.mimetype
        })
        form.append('caption', 'Чек оплаты')
        await axios.post(`${TELEGRAM_URL}/bot${BOT_TOKEN}/sendPhoto`, form, {
          headers: form.getHeaders()
        })
      } else {
        form.append('document', receiptFile.buffer, {
          filename: receiptFile.originalname,
          contentType: receiptFile.mimetype
        })
        await axios.post(`${TELEGRAM_URL}/bot${BOT_TOKEN}/sendDocument`, form, {
          headers: form.getHeaders()
        })
      }
    }

    return { ok: true }
  } catch (error) {
    const err = error?.response?.data || error?.message || error?.toString()
    console.error('Telegram notify failed', err)
    return { ok: false, error: err }
  }
}

router.post('/create-invoice', (req, res) => {
  let { items, total, orderId, customer, receiptUrl } = req.body || {}
  if (typeof customer === 'string') {
    try { customer = JSON.parse(customer) } catch (e) { /* ignore */ }
  }
  if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Items are required' })
  if (typeof total !== 'number') return res.status(400).json({ error: 'Total must be a number' })

  const invoiceId = generateId('inv-')
  const invoice = {
    id: invoiceId,
    orderId: orderId || invoiceId,
    customer: customer || {},
    items,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
    payUrl: `/api/payments/pay/${invoiceId}`,
    receiptUrl: receiptUrl || null
  }
  db.invoices.push(invoice)
  writeDb(db)
  res.json({ invoiceId, payUrl: invoice.payUrl })
})

router.post('/pay-with-receipt', upload.single('receipt'), async (req, res) => {
  try {
    let { items, total, orderId, customer } = req.body || {}
    if (typeof customer === 'string') {
      try { customer = JSON.parse(customer) } catch (e) { /* ignore */ }
    }
    const receiptFile = req.file

    if (typeof items === 'string') {
      try {
        items = JSON.parse(items)
      } catch (err) {
        return res.status(400).json({ error: 'Invalid items format' })
      }
    }

    if (!Array.isArray(items) || items.length === 0) return res.status(400).json({ error: 'Items are required' })
    total = typeof total === 'string' ? parseFloat(total) : total
    if (typeof total !== 'number' || Number.isNaN(total)) return res.status(400).json({ error: 'Total must be a number' })
    if (!receiptFile) return res.status(400).json({ error: 'Receipt file is required' })

    const invoiceId = generateId('inv-')
    const invoice = {
      id: invoiceId,
      orderId: orderId || invoiceId,
      customer: customer || {},
      items,
      total,
      status: 'paid',
      createdAt: new Date().toISOString(),
      paidAt: new Date().toISOString(),
      receiptFileName: receiptFile.originalname
    }

    db.invoices.push(invoice)
    writeDb(db)

    if (invoice.orderId) {
      const order = db.orders.find((o) => o.id === invoice.orderId)
      if (order) {
        order.status = 'paid'
        order.updatedAt = new Date().toISOString()
        writeDb(db)
      }
    }

    const notifyResult = await notifyTelegram(invoice, receiptFile)
    if (!notifyResult.ok) {
      return res.status(500).json({ error: notifyResult.error })
    }

    res.json({ ok: true })
  } catch (err) {
    console.error('Pay with receipt failed', err)
    res.status(500).json({ error: err?.message || 'Internal server error' })
  }
})

router.get('/invoice/:id', (req, res) => {
  const invoice = db.invoices.find((inv) => inv.id === req.params.id)
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' })
  res.json(invoice)
})

router.get('/pay/:id', (req, res) => {
  const invoice = db.invoices.find((inv) => inv.id === req.params.id)
  if (!invoice) return res.status(404).send('Invoice not found')
  res.send(`
    <html><body style="font-family:Arial,Helvetica,sans-serif;padding:24px">
      <h2>Оплатить заказ ${invoice.id}</h2>
      <p>Сумма: <strong>${Number(invoice.total).toLocaleString('ru-RU')} сум</strong></p>
      <form method="post" action="/api/payments/demo-pay/${invoice.id}">
        <button type="submit" style="padding:12px 18px;font-size:16px">Оплатить (демо)</button>
      </form>
    </body></html>
  `)
})

router.post('/demo-pay/:id', async (req, res) => {
  const invoiceId = req.params.id
  console.log('[DEMO-PAY] Received payment request for invoice:', invoiceId)
  
  const invoice = db.invoices.find((inv) => inv.id === invoiceId)
  if (!invoice) {
    console.log('[DEMO-PAY] Invoice not found:', invoiceId)
    return res.status(404).send('Invoice not found')
  }
  
  invoice.status = 'paid'
  invoice.paidAt = new Date().toISOString()
  console.log('[DEMO-PAY] Invoice marked as paid:', invoice.id)

  if (invoice.orderId) {
    const order = db.orders.find((o) => o.id === invoice.orderId)
    if (order) {
      order.status = 'paid'
      order.updatedAt = new Date().toISOString()
      console.log('[DEMO-PAY] Order marked as paid:', order.id)
    }
  }

  writeDb(db)
  console.log('[DEMO-PAY] Sending Telegram notification for invoice:', invoice.id)
  const notifyResult = await notifyTelegram(invoice)
  console.log('[DEMO-PAY] Telegram result:', notifyResult)
  
  const notifyMessage = notifyResult.ok
    ? 'Уведомление отправлено в Telegram.'
    : `Не удалось отправить уведомление в Telegram: ${notifyResult.error}`

  res.send(`
    <html><body style="font-family:Arial,Helvetica,sans-serif;padding:24px">
      <h2>Оплата выполнена (демо)</h2>
      <p>Закройте это окно и вернитесь на сайт.</p>
      <p style="margin-top:16px;color:${notifyResult.ok ? '#0a0' : '#c00'}">${notifyMessage}</p>
    </body></html>
  `)
})

router.post('/webhook', async (req, res) => {
  const { invoiceId, status } = req.body || {}
  if (!invoiceId || !status) return res.status(400).json({ error: 'invoiceId and status required' })

  const invoice = db.invoices.find((inv) => inv.id === invoiceId)
  if (!invoice) return res.status(404).json({ error: 'Invoice not found' })

  invoice.status = status
  invoice.updatedAt = new Date().toISOString()
  if (invoice.orderId) {
    const order = db.orders.find((o) => o.id === invoice.orderId)
    if (order) {
      order.status = status === 'paid' ? 'paid' : order.status
      order.updatedAt = new Date().toISOString()
    }
  }

  writeDb(db)
  if (status === 'paid') await notifyTelegram(invoice)
  res.json({ ok: true })
})

module.exports = router
