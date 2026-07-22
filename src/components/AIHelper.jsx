import React, { useState } from "react"
import { useViewed } from "../context/ViewedContext"
import { useProfile } from "../context/ProfileContext"
import { useFavorites } from "../context/FavoritesContext"
import { useCart } from "../context/CartContext"
import { getRecommendations } from "../services/recommendations"
import { notify } from "../utils/notify"
import { generateLook } from "../services/looks"
import { sampleItems } from "../data/items"

export default function AIHelper() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState(() => [
    { role: 'assistant', content: 'Привет! Я ваш ИИ-стилист. Задайте вопрос — отвечу как чат.' }
  ])
  const [loading, setLoading] = useState(false)
  const { viewed } = useViewed() || { viewed: [] }
  const { profile } = useProfile() || { profile: {} }
  const { favorites } = useFavorites() || { favorites: [] }
  const { addItem } = useCart() || {}

  

  async function sendMessage() {
    const text = input.trim()
    if (!text) return
    const userMsg = { role: 'user', content: text }
    setMessages((m) => [...m, userMsg])
    setInput("")
    // In Vite use import.meta.env; also allow a window override for quick testing
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta.env?.VITE_OPENAI_KEY || import.meta.env?.REACT_APP_OPENAI_API_KEY)) || window.__OPENAI_KEY__

    // Local assistant fallback (no paid API) - will act like a ChatGPT-style helper
    async function localAssistant(query) {
      // quick intent matching
      const q = (query || '').toLowerCase()
      if (q.includes('собер') || q.includes('собрать образ') || q.includes('собери образ') || q.includes('подб') || q.includes('лук') || q.includes('образ')) {
        // Try to build a look from viewed/favorites first, fallback to catalog
        const pool = (viewed && viewed.length ? sampleItems.filter(i => viewed.includes(i.id)) : []).length ? sampleItems.filter(i => viewed.includes(i.id)) : sampleItems
        // default keywords to try to include common categories (ru/en substrings)
        const defaultKeywords = ['кросс', 'кроссовк', 'кеды', 'sneak', 'sneakers', 'рубаш', 'футбол', 'футболка', 'джин', 'jeans', 'pants', 'shirt', 'watch', 'часы', 'курт', 'пальто']
        const look = generateLook(pool, { count: 5, byCategory: true, keywords: defaultKeywords })
        if (!look || look.length === 0) return 'Не удалось собрать образ. Попробуйте изменить фильтры или добавить товаров в каталог.'
        const items = look.map(it => ({ id: it.id, name: it.name, price: it.price, image: it.image }))
        return { type: 'local-recs', title: 'Собранный образ:', items }
      }

      if (q.includes('размер') || q.includes('рост') || q.includes('вес')) {
        return 'Укажите ваш рост и приблизительный вес (в см/кг), и я подскажу подходящий размер и таблицу соответствия.'
      }

      if (q.includes('что носить') || q.includes('что одеть') || q.includes('для')) {
        // generic style tips
        return 'Подберите базу из нейтральных цветов и добавьте 1–2 ярких акцента. Для улицы подойдут кроссовки + худи + карго-брюки, для встречи — рубашка + джинсы + минималистичные кеды.'
      }

      // default helpful reply
      return 'Привет! Опишите, что вы хотите: подобрать лук, указать размер/рост или задать вопрос по стилю — и я помогу.'
    }

    // If no API key, use localAssistant instead of remote call
    if (!apiKey) {
      setMessages((m) => [...m, { role: 'assistant', content: 'Печатаю...', temp: true }])
      setLoading(true)
      try {
        const reply = await localAssistant(text)
        setMessages((m) => {
          const idx = m.findIndex(ms => ms.temp)
          if (idx === -1) return [...m, { role: 'assistant', content: reply }]
          const copy = m.slice()
          copy[idx] = { role: 'assistant', content: reply }
          return copy
        })
      } finally {
        setLoading(false)
      }
      return
    }

    // show temporary assistant placeholder so user sees immediate feedback
    setMessages((m) => [...m, { role: 'assistant', content: 'Печатаю...', temp: true }])
    setLoading(true)
    try {
      const systemPrompt = `You are a helpful, concise and friendly Russian-speaking assistant that answers like ChatGPT. When asked about clothing or style, provide clear outfit recommendations, list items, suggest sizes and price ranges if available, and offer an explicit short summary at the end. Ask one clarifying question if the user's request is ambiguous. Keep the answer readable and actionable.`

      // keep context small to avoid long prompts
      const smallProfile = profile ? {
        size: profile.size || null,
        budget: profile.budget || null,
        styles: profile.styles || []
      } : {}

      const smallViewed = (viewed || []).slice(-6)

      const body = {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'system', content: `profile:${JSON.stringify(smallProfile)}` },
          { role: 'system', content: `viewed:${JSON.stringify(smallViewed)}` },
          userMsg
        ],
        max_tokens: 600,
        temperature: 0.2
      }

      // Try server proxy first
      let data = null
      try {
        const proxyRes = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        })
        if (proxyRes.ok) {
          data = await proxyRes.json()
        } else {
          try { const txt = await proxyRes.text(); console.warn('Proxy returned', proxyRes.status, txt) } catch {}
        }
      } catch (e) {
        console.warn('Proxy request failed, will try direct OpenAI:', e && e.toString())
      }

      if (!data) {
        // fallback to direct OpenAI if client key available
        if (!apiKey) throw new Error('Нет прокси и ключа OpenAI на клиенте')
        const direct = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify(body)
        })
        if (!direct.ok) {
          const txt = await direct.text()
          throw new Error(txt || 'OpenAI direct error')
        }
        data = await direct.json()
      }

      const assistantText = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || (data?.message) || 'Извините, я сейчас не могу ответить.'
      // replace the temporary assistant message with the real content
      setMessages((m) => {
        const idx = m.findIndex(ms => ms.temp)
        if (idx === -1) return [...m, { role: 'assistant', content: assistantText }]
        const copy = m.slice()
        copy[idx] = { role: 'assistant', content: assistantText }
        return copy
      })
    } catch (err) {
      const text = (err && err.message) ? err.message : String(err)
      // If quota exceeded, fallback to local recommendations (MVP)
      if (text.toLowerCase().includes('insufficient_quota') || text.toLowerCase().includes('quota')) {
        const recs = getRecommendations({ profile, viewed, favorites, feedback: {} })
        const items = recs.slice(0,3).map(o => ({ id: o.main.id, name: o.main.name, price: o.main.price, image: o.main.image }))
        // replace temp with structured message so UI can render cards
        setMessages((m) => {
          const idx = m.findIndex(ms => ms.temp)
          const payload = { type: 'local-recs', items, title: 'Рекомендации из каталога:' }
          if (idx === -1) return [...m, { role: 'assistant', content: payload }]
          const copy = m.slice()
          copy[idx] = { role: 'assistant', content: payload }
          return copy
        })
        return
      }

      // replace temp with generic error message
      setMessages((m) => {
        const idx = m.findIndex(ms => ms.temp)
        const errMsg = 'Ошибка при обращении к API: ' + (text || err.toString())
        if (idx === -1) return [...m, { role: 'assistant', content: errMsg }]
        const copy = m.slice()
        copy[idx] = { role: 'assistant', content: errMsg }
        return copy
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {open && (
        <div style={{position:'fixed',right:86,bottom:16,width:420,maxWidth:'92vw',background: 'var(--card-glass)',border:'1px solid var(--glass-border)',borderRadius:12,boxShadow:'0 18px 50px rgba(2,6,23,0.5)',padding:12,zIndex:2200}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <strong>ИИ-консультант (ChatGPT-подобный режим)</strong>
            <button onClick={()=>setOpen(false)} className="shop-outline">✖</button>
          </div>
          <div style={{marginTop:8,maxHeight:320,overflow:'auto',padding:8,background:'rgba(255,255,255,0.01)',borderRadius:8}}>
            {messages.map((m, i) => {
              const isAssistant = m.role === 'assistant'
              // structured local recommendations
              if (m.content && typeof m.content === 'object' && m.content.type === 'local-recs') {
                return (
                  <div key={i} style={{marginBottom:8,textAlign:'left'}}>
                    <div style={{marginBottom:8,fontWeight:700}}>{m.content.title}</div>
                    <div style={{display:'flex',gap:8}}>
                      {m.content.items.map(it => (
                        <div key={it.id} style={{background:'rgba(255,255,255,0.02)',padding:8,borderRadius:8,minWidth:160}}>
                          <div style={{height:80,overflow:'hidden',borderRadius:8}}>
                            <img src={encodeURI('/img/' + it.image)} alt={it.name} style={{width:'100%',height:80,objectFit:'cover'}} />
                          </div>
                          <div style={{marginTop:8,fontWeight:700}}>{it.name}</div>
                          <div style={{color:'var(--muted)',marginTop:6}}>{it.price?.toLocaleString('ru-RU')} сум</div>
                          <div style={{marginTop:8,display:'flex',gap:8}}>
                            <button className="shop-cta" onClick={() => { addItem && addItem(it); notify && notify('Добавлено в корзину', { type: 'success' }) }}>В корзину</button>
                            <a href={`/product/${it.id}`} onClick={() => setOpen(false)} style={{marginLeft:'auto'}}>Открыть</a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }

              return (
                <div key={i} style={{marginBottom:8,textAlign:isAssistant?'left':'right'}}>
                  <div style={{display:'inline-block',background:isAssistant?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.06)',padding:'8px 10px',borderRadius:8,whiteSpace:'pre-wrap'}}>{m.content}</div>
                </div>
              )
            })}
          </div>
          <div style={{display:'flex',gap:8,marginTop:10}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); sendMessage() } }} placeholder="Напишите сообщение или спросите совет по образу..." style={{flex:1,padding:10,borderRadius:10,border:'1px solid rgba(255,255,255,0.04)',background:'transparent'}} />
            <button type="button" onClick={sendMessage} disabled={loading || !input.trim()} style={{padding:'10px 12px',borderRadius:10}}>{loading ? '...' : 'Отправить'}</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{position:'fixed',right:86,bottom:16,width:56,height:56,borderRadius:28,background:'var(--accent)',color:'#042230',border:0,boxShadow:'0 10px 30px rgba(2,6,23,0.4)',zIndex:2300}}>🤖</button>
    </div>
  )
}
