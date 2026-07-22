import React from "react"
import { useCart } from "../context/CartContext"
import PaymentModal from "./PaymentModal"
import { useProfile } from "../context/ProfileContext"
import { notify } from "../utils/notify"

export default function Cart() {
  const { items, removeItem, clear, cleanupExpired } = useCart() || { items: [] }
  const { addOrder } = useProfile() || {}
  const [paymentOpen, setPaymentOpen] = React.useState(false)
  const [now, setNow] = React.useState(Date.now())

  React.useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  React.useEffect(() => {
    if (!cleanupExpired) return
    const expired = items.some((item) => item.reservedUntil && item.reservedUntil <= Date.now())
    if (expired) {
      cleanupExpired()
      notify('Срок бронирования дефицитных товаров истек — они вернулись в каталог.', { type: 'info' })
    }
  }, [items, cleanupExpired, now])

  const total = items.reduce((s, it) => s + (it.price || 0), 0)

  const reservedItems = items.filter((item) => item.reservedUntil && item.reservedUntil > now)
  const nextExpiry = reservedItems.reduce((min, item) => Math.min(min, item.reservedUntil), Infinity)

  function formatTimer(ms) {
    const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  function handleSuccessPayment() {
    try {
      const order = {
        id: Date.now().toString(),
        items,
        total,
        status: 'processing',
        tracking: null,
        createdAt: new Date().toISOString(),
      }
      addOrder && addOrder(order)
      clear && clear()
      notify('Заказ создан. Спасибо!', { type: 'success' })
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <section style={{ maxWidth: 900, margin: '0 auto' }}>
      <h2>Корзина</h2>
      {items.length === 0 ? (
        <div>Корзина пуста</div>
      ) : (
        <div>
          {reservedItems.length > 0 && (
            <div className="reserve-banner">
              <div className="reserve-badge">Успей забрать</div>
              <div>
                {reservedItems.length === 1 ? 'Этот дефицитный товар' : `Эти ${reservedItems.length} дефицитных товара`} забронирован{reservedItems.length === 1 ? ' ' : 'ы '}за вами на {formatTimer(nextExpiry - now)}.
                По истечении времени он вернётся в каталог.
              </div>
            </div>
          )}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((it, idx) => {
              const isReserved = it.reservedUntil && it.reservedUntil > now
              return (
                <li key={idx} style={{ marginBottom: 12, display: 'flex', alignItems: 'center' }}>
                  <img
                    src={it.image && (it.image.startsWith('http') || it.image.startsWith('/')) ? it.image : `/img/${it.image}`}
                    alt={it.name}
                    style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, marginRight: 12 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{it.name}</div>
                    <div style={{ color: '#666', marginTop: 4 }}>{it.price.toLocaleString('ru-RU')} сум</div>
                    {isReserved && (
                      <div className="reserved-tag">
                        Забронировано на {formatTimer(it.reservedUntil - now)}
                      </div>
                    )}
                  </div>
                  <div>
                    <button onClick={() => removeItem(idx)}>Удалить</button>
                  </div>
                </li>
              )
            })}
          </ul>
          <div style={{ marginTop: 12, fontWeight: 700 }}>Итого: {total.toLocaleString('ru-RU')} сум</div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={() => clear()}>Очистить</button>
            <button className="shop-cta" onClick={() => setPaymentOpen(true)}>Купить</button>
          </div>
        </div>
      )}

      <PaymentModal open={paymentOpen} onClose={() => setPaymentOpen(false)} amount={total} items={items} onSuccess={handleSuccessPayment} />
    </section>
  )
}
