const express = require('express')
const axios = require('axios')
const router = express.Router()
const TELEGRAM_URL = 'https://api.telegram.org'
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || ''
const CHAT_ID = process.env.TELEGRAM_CHAT_ID || ''

function telegramError(res, error) {
  console.error(error)
  return res.status(500).json({ error: 'Telegram send failed' })
}

router.post('/send', async (req, res) => {
  const { message, customer, photoUrl, sourceUrl } = req.body || {}
  if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ error: 'Telegram is not configured' })

  let text = `Новая заявка от клиента:\n` +
    `${customer?.name ? `Имя: ${customer.name}\n` : ''}` +
    `${customer?.phone ? `Телефон: ${customer.phone}\n` : ''}` +
    `${customer?.email ? `Email: ${customer.email}\n` : ''}` +
    `${sourceUrl ? `Источник: ${sourceUrl}\n` : ''}` +
    `${message ? `Сообщение: ${message}\n` : ''}`

  try {
    const sendText = await axios.post(`${TELEGRAM_URL}/bot${BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML'
    })

    if (photoUrl) {
      await axios.post(`${TELEGRAM_URL}/bot${BOT_TOKEN}/sendPhoto`, {
        chat_id: CHAT_ID,
        photo: photoUrl,
        caption: 'Фото клиента для администратора'
      })
    }

    res.json({ ok: true, telegram: sendText.data })
  } catch (error) {
    telegramError(res, error)
  }
})

module.exports = router
