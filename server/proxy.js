require('dotenv').config()
const express = require('express')
const axios = require('axios')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())

app.post('/api/chat', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_KEY
    if (!apiKey) return res.status(500).json({ error: 'No API key on server' })

    const response = await axios.post('https://api.openai.com/v1/chat/completions', req.body, {
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' }
    })

    res.json(response.data)
  } catch (e) {
    console.error('Proxy error', e && e.toString())
    if (e.response && e.response.data) return res.status(e.response.status || 500).json(e.response.data)
    res.status(500).json({ error: e.toString() })
  }
})

const port = process.env.PORT || 5179
app.listen(port, () => console.log('OpenAI proxy listening on', port))
