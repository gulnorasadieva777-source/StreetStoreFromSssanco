import React, { useState } from "react"
import { notify } from "../utils/notify"
import PaymentModal from "./PaymentModal"
import { useCart } from "../context/CartContext"

export default function Footer() {
  const [email, setEmail] = useState("")
  const [msg, setMsg] = useState("")
  const { items } = useCart() || { items: [] }
  const total = (items || []).reduce((s, it) => s + (it.price || 0), 0)
  const [paymentOpen, setPaymentOpen] = useState(false)

  function handleSubscribe(e) {
    // prevent any default navigation and handle empty input
    e && e.preventDefault && e.preventDefault()
    if (!email || !email.includes('@')) {
      setMsg('Введите корректную почту')
      return
    }
    // mock subscribe
    setMsg('Спасибо! Вы подписаны')
    setEmail('')
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-block">
              <span className="logo-street">Street</span>
              <span className="logo-store">Store</span>
            </div>
            <div className="footer-desc">Уличный стиль, curated коллекции и быстрые доставки</div>
          </div>

          <div className="footer-actions">
            <div className="newsletter" role="form" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                placeholder="Ваша почта для рассылки"
                aria-label="email"
              />
              <button type="button" className="shop-cta" onClick={handleSubscribe}>Подписаться</button>
            </div>
            <div style={{height:18, color:'var(--primary)', fontWeight:700}}>{msg}</div>
            <div className="footer-social" aria-hidden="false">
              <a href="https://t.me/ssskuf1" target="_blank" rel="noreferrer">Telegram</a>
              <a href="https://www.instagram.com/streetstoreuz?igsh=MTRjYXo1MHViaXkwZQ%3D%3D&utm_source=qr" target="_blank" rel="noreferrer">Instagram</a>
            </div>
          </div>
        </div>

        <div className="footer-links">
          <a className="footer-link" href="/blog">Блог</a>
          <a className="footer-link" href="#" onClick={async (e) => {
            e.preventDefault()
            // ask for geolocation
            if (!navigator.geolocation) {
              notify('Геолокация недоступна в вашем браузере', { type: 'error' })
              // fallback: open telegram with generic text
              const fallback = 'Здравствуйте! Хотел бы уточнить доставку. Пожалуйста, напишите инструкцию.'
              window.open('https://t.me/ssskuf1?text=' + encodeURIComponent(fallback), '_blank')
              return
            }

            notify('Определяю ваше местоположение...', { type: 'info' })
            navigator.geolocation.getCurrentPosition((pos) => {
              const lat = pos.coords.latitude
              const lon = pos.coords.longitude
              const msg = `Здравствуйте! Моя геолокация: https://maps.google.com/?q=${lat},${lon}. Прошу прислать инструкцию по доставке на этот адрес.`
              window.open('https://t.me/ssskuf1?text=' + encodeURIComponent(msg), '_blank')
              notify('Открыл Telegram для отправки геолокации', { type: 'success' })
            }, (err) => {
              console.warn('geo err', err)
              const msg = 'Здравствуйте! Я не разрешил(а) доступ к геолокации. Прошу прислать инструкцию для доставки — мой адрес: (вставьте адрес вручную).'
              window.open('https://t.me/ssskuf1?text=' + encodeURIComponent(msg), '_blank')
              notify('Не удалось определить местоположение — открыл Telegram для ручной отправки', { type: 'info' })
            }, { enableHighAccuracy: true, timeout: 8000 })
          }}>Доставка</a>
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); setPaymentOpen(true) }}>Оплата</a>
          <a className="footer-link" href="tel:+998938024673">+998 93 802 46 73</a>
        </div>

        <div className="footer-bottom">© {new Date().getFullYear()} Street Store — Все права защищены</div>
      </div>
      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} amount={total} onSuccess={() => { setPaymentOpen(false) }} />
    </footer>
  )
}
