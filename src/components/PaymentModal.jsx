import React from "react"
import { merchant } from "../config/merchant"
import { notify } from "../utils/notify"

export default function PaymentModal({ open, onClose, amount, items, onSuccess }) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState('')
  const [receiptFile, setReceiptFile] = React.useState(null)
  const [telegram, setTelegram] = React.useState('')

  if (!open) return null

  const paymentItems = Array.isArray(items) && items.length > 0
    ? items
    : [{ name: 'Оплата заказа', price: amount || 0, quantity: 1 }]

  async function payInvoice() {
    if (loading) return
    if (!receiptFile) {
      setError('Загрузите файл чека перевода')
      return
    }
    if (!telegram || !telegram.toString().trim()) {
      setError('Укажите ваш Telegram username (например @username)')
      return
    }

    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('items', JSON.stringify(paymentItems))
      formData.append('total', amount)
      formData.append('customer', JSON.stringify({ telegram: telegram.startsWith('@') ? telegram : `@${telegram}` }))
      formData.append('receipt', receiptFile)

      const createResp = await fetch('/api/payments/pay-with-receipt', {
        method: 'POST',
        body: formData
      })

      const createText = await createResp.text()
      let createData = null
      try {
        createData = createText ? JSON.parse(createText) : null
      } catch (_) {
        throw new Error(createText || 'Ошибка сервера')
      }

      if (!createResp.ok || !createData?.ok) {
        throw new Error(createData?.error || createText || 'Ошибка оплаты')
      }

      notify('Платёж принят. Чек отправлен в Telegram.', { type: 'success' })
      try { onSuccess && onSuccess() } catch (e) {}
      onClose && onClose()
    } catch (err) {
      const message = err?.message || 'Ошибка оплаты. Попробуйте позже.'
      setError(message)
      notify(message, { type: 'error' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-modal" role="dialog" aria-modal="true">
      <div className="modal-dialog">
        <div className="modal-inner">
          <div className="modal-header">
            <h3 className="modal-title">Оплата</h3>
            <button className="header-button" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="modal-note">Сумма к оплате</div>
              <div style={{ fontWeight: 800, color: 'var(--primary)' }}>{amount?.toLocaleString('ru-RU') || '0'} сум</div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ background: 'rgba(0,0,0,0.03)', padding: 12, borderRadius: 8 }}>
                <div style={{ fontWeight: 700 }}>{merchant.name}</div>
                <div style={{ marginTop: 8 }}>Карта: <strong>{merchant.card}</strong></div>
                <div style={{ marginTop: 6 }}>Банк: {merchant.bank}</div>
                <div style={{ marginTop: 6, color: 'var(--muted)' }}>{merchant.comment.replace('{orderId}', '')}</div>
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Ваш Telegram username</label>
              <input
                className="telegram-input"
                type="text"
                placeholder="Например @username"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
              />
              <div className="modal-note" style={{ marginTop: 8 }}>
                Обязательно проверьте ваш Telegram username — мы отправим чек на этот аккаунт.
              </div>
              <div className="shop-notice" style={{ marginTop: 10 }}>
                <strong>Внимание:</strong> Владелец магазина свяжется с вами в Telegram после оплаты.
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Файл чека перевода</label>
              <label htmlFor="receipt-upload" className="file-input-button" style={{ gap: 12, minWidth: 220 }}>
                <span>{receiptFile ? receiptFile.name : 'Выбрать файл'}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>Загрузить</span>
              </label>
              <input
                id="receipt-upload"
                type="file"
                accept="image/*,.pdf"
                style={{ display: 'none' }}
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
              />
              {receiptFile && (
                <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <div style={{ color: '#c7f8d3', fontSize: 14, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{receiptFile.name}</div>
                  <button className="shop-outline file-remove-button" type="button" onClick={() => setReceiptFile(null)} disabled={loading}>Удалить</button>
                </div>
              )}
              <div className="modal-note" style={{ marginTop: 8 }}>
                Загрузите фотографию, скриншот или PDF чека перевода.
              </div>
            </div>

            {error && <div style={{ marginTop: 12, color: '#c00' }}>{error}</div>}
          </div>

          <div className="modal-footer">
            <button className="shop-outline" onClick={onClose} disabled={loading}>Отмена</button>
            <button className="shop-cta" onClick={payInvoice} disabled={loading}>{loading ? 'Обработка…' : 'Я перевёл(а) деньги'}</button>
          </div>
        </div>
      </div>
    </div>
  )
}
