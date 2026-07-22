import React from "react"
import { useParams } from "react-router-dom"
import { sampleItems } from "../data/items"
import { useCart } from "../context/CartContext"
import PaymentModal from "./PaymentModal"
import { useViewed } from "../context/ViewedContext"
import Recommendations from "./Recommendations"
import VirtualTryOn from "./VirtualTryOn"
import { flyToCart } from "../utils/flyToCart"
import { useProfile } from "../context/ProfileContext"
import { recommendSize } from "../services/recommendations"
import { generateLook } from "../services/looks"
import LookModal from "./LookModal"

export default function ProductPage() {
  const { id } = useParams()
  const prod = sampleItems.find((p) => String(p.id) === String(id))
  const { addItem } = useCart() || {}
  const [mounted, setMounted] = React.useState(false)
  const [selectedSize, setSelectedSize] = React.useState(prod?.sizes?.[0] || '')
  const [paymentOpen, setPaymentOpen] = React.useState(false)
  const [tryOnOpen, setTryOnOpen] = React.useState(false)
  const [lookOpen, setLookOpen] = React.useState(false)
  const [lookItems, setLookItems] = React.useState([])

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(t)
  }, [])

  const { addViewed } = useViewed() || { addViewed: () => {} }

  const { profile } = useProfile() || { profile: {} }
  const suggestedSize = recommendSize(profile)
  const [cheaperOpen, setCheaperOpen] = React.useState(false)
  const [cheaperUrl, setCheaperUrl] = React.useState('')
  const [cheaperStatus, setCheaperStatus] = React.useState('')
  const [cheaperError, setCheaperError] = React.useState('')

  React.useEffect(() => {
    if (prod) addViewed && addViewed(prod.id)
  }, [prod])

  function handleCheaperSubmit(e) {
    e.preventDefault()
    setCheaperError('')
    if (!cheaperUrl || !cheaperUrl.startsWith('http')) {
      setCheaperError('Введите корректную ссылку на товар в другом магазине')
      return
    }
    const message = `Нашли дешевле: ${prod.name} (${prod.price.toLocaleString('ru-RU')} сум). Ссылка конкурента: ${cheaperUrl}. Прошу скидку.`
    const tgUrl = 'https://t.me/ssskuf1?text=' + encodeURIComponent(message)
    window.open(tgUrl, '_blank')
    setCheaperStatus('Спасибо! Мы получили ссылку и свяжемся с вами со скидкой.')
    setCheaperUrl('')
  }

  if (!prod) return <div>Товар не найден</div>

  return (
    <section className={`product-page ${mounted ? 'enter' : ''}`} style={{maxWidth:900,margin:'0 auto'}}>
      <h2>{prod.name}</h2>
      <div style={{display:'flex',gap:20,flexWrap:'wrap'}}>
        <div style={{flex:'1 1 380px',minWidth:300}}>
          <div className="product-image-wrapper">
            <img src={encodeURI('/img/' + prod.image)} alt={prod.name} className="product-image" />
          </div>
        </div>
        <div style={{flex:'1 1 300px',minWidth:260}}>
          <div>{prod.description}</div>
          {prod.sizes && (
            <div style={{marginTop:12}}>
              <label style={{fontWeight:700,display:'block',marginBottom:6}}>Размер:</label>
              <select value={selectedSize} onChange={(e)=>setSelectedSize(e.target.value)} style={{padding:8,borderRadius:8}}>
                {prod.sizes.map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
              {suggestedSize && prod.sizes && prod.sizes.includes(suggestedSize) ? (
                <div style={{marginTop:8,color:'#2b7a0b'}}>Рекомендуемый для вас размер: <strong>{suggestedSize}</strong></div>
              ) : null}
            </div>
          )}
          <div style={{marginTop:12,fontWeight:700,color:'var(--primary)'}}>{prod.price.toLocaleString('ru-RU')} сум</div>
          <div style={{marginTop:12,display:'flex',gap:8,flexWrap:'wrap'}}>
            <button onClick={(e) => { const img = document.querySelector('.product-image'); flyToCart(img); addItem && addItem(prod); }}>Добавить в корзину</button>
            <button className="shop-outline" style={{marginLeft:8}} onClick={()=>setPaymentOpen(true)}>Оплатить онлайн</button>
            <button className="shop-outline" onClick={()=>setTryOnOpen(true)}>Виртуальная примерка</button>
            <button className="shop-cta" onClick={() => {
              const others = sampleItems.filter(p => p.id !== prod.id)
              const look = generateLook([prod, ...others], { count: 5, byCategory: true })
              setLookItems(look)
              setLookOpen(true)
            }}>Собрать образ</button>
          </div>

          <div className="cheaper-cta-box" style={{marginTop:18}}>
            <button className="shop-outline cheaper-trigger" onClick={() => setCheaperOpen(v => !v)}>
              Нашли дешевле? Скиньте ссылку — сделаем скидку
            </button>
            {cheaperOpen && (
              <form className="cheaper-form" onSubmit={handleCheaperSubmit}>
                <input
                  type="url"
                  value={cheaperUrl}
                  onChange={(e) => setCheaperUrl(e.target.value)}
                  placeholder="Ссылка на товар у конкурента"
                  className="cheaper-input"
                />
                <button type="submit" className="shop-cta cheaper-submit">Отправить ссылку</button>
                {cheaperError && <div className="cheaper-error">{cheaperError}</div>}
                {cheaperStatus && <div className="cheaper-status">{cheaperStatus}</div>}
              </form>
            )}
          </div>
        </div>
      </div>

      <section style={{marginTop:22}}>
        <h3>Таблица размеров</h3>
        <table style={{width:'100%',borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={{textAlign:'left',padding:8}}>Размер</th>
              <th style={{textAlign:'left',padding:8}}>Обхват груди (см)</th>
              <th style={{textAlign:'left',padding:8}}>Длина (см)</th>
            </tr>
          </thead>
          <tbody>
            <tr><td style={{padding:8}}>S</td><td style={{padding:8}}>88-92</td><td style={{padding:8}}>66-68</td></tr>
            <tr><td style={{padding:8}}>M</td><td style={{padding:8}}>92-96</td><td style={{padding:8}}>68-70</td></tr>
            <tr><td style={{padding:8}}>L</td><td style={{padding:8}}>96-102</td><td style={{padding:8}}>70-72</td></tr>
            <tr><td style={{padding:8}}>XL</td><td style={{padding:8}}>102-108</td><td style={{padding:8}}>72-74</td></tr>
          </tbody>
        </table>
      </section>

      <PaymentModal open={paymentOpen} onClose={()=>setPaymentOpen(false)} amount={prod.price} />
      <VirtualTryOn open={tryOnOpen} onClose={()=>setTryOnOpen(false)} image={encodeURI('/img/' + prod.image)} />
      <LookModal open={lookOpen} onClose={()=>setLookOpen(false)} items={lookItems} />

      <Recommendations />
    </section>
  )
}
