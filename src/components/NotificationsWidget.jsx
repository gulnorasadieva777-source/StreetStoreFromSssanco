import React, { useEffect, useState } from "react"

export default function NotificationsWidget() {
  const [subscribed, setSubscribed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('subscribed')) || false } catch { return false }
  })
  const [toast, setToast] = useState(null)

  useEffect(() => {
    localStorage.setItem('subscribed', JSON.stringify(subscribed))
  }, [subscribed])

  useEffect(() => {
    let id
    if (subscribed) {
      // simulate new arrivals notification after a delay
      id = setTimeout(() => setToast('Новый товар в каталоге: свежие поступления!'), 6000)
    }
    return () => clearTimeout(id)
  }, [subscribed])

  return (
    <div>
      {toast && (
        <div style={{position:'fixed',right:16,top:16,background:'var(--primary)',color:'#042230',padding:12,borderRadius:10,boxShadow:'0 12px 30px rgba(2,6,23,0.4)',zIndex:1600}}>
          {toast}
          <button style={{marginLeft:12}} className="shop-outline" onClick={()=>setToast(null)}>Закрыть</button>
        </div>
      )}
      <div style={{position:'fixed',left:16,bottom:16,zIndex:1400}}>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <button className="shop-cta" onClick={()=>setSubscribed(s=>!s)}>{subscribed? 'Вы подписаны' : 'Подписаться на обновления'}</button>
        </div>
      </div>
    </div>
  )
}
