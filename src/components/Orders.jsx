import React from "react"
import { useProfile } from "../context/ProfileContext"

export default function Orders() {
  const { orders, updateOrderStatus } = useProfile() || { orders: [] }

  if (!orders || !orders.length) return (
    <section style={{maxWidth:900,margin:'18px auto',padding:'0 12px',textAlign:'center'}}>
      <h2>История заказов</h2>
      <p>У вас пока нет заказов.</p>
    </section>
  )

  return (
    <section style={{maxWidth:900,margin:'18px auto',padding:'0 12px'}}>
      <h2>История заказов</h2>
      <div style={{display:'grid',gap:12,marginTop:12}}>
        {orders.map((o) => (
          <div key={o.id} style={{padding:14,borderRadius:12,background:'var(--card-glass)',border:'1px solid rgba(255,255,255,0.03)'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div>
                <div style={{fontWeight:800}}>Заказ #{o.id}</div>
                <div style={{color:'var(--muted)'}}>{o.items.length} товаров — {o.total.toLocaleString('ru-RU')} сум</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div style={{fontWeight:800,color:o.status === 'delivered' ? 'var(--primary)' : 'var(--muted)'}}>{o.status}</div>
                <div style={{marginTop:8}}>
                  {o.tracking ? (
                    <a className="shop-outline" href={o.tracking} target="_blank" rel="noreferrer">Отследить</a>
                  ) : (
                    <button className="shop-outline" onClick={()=>updateOrderStatus(o.id,'shipped')}>Отправить</button>
                  )}
                </div>
              </div>
            </div>

            <div style={{marginTop:10,display:'flex',gap:10,flexWrap:'wrap'}}>
              {o.items.map(it => (
                <div key={it.id} style={{minWidth:120}}>
                  <img src={encodeURI('/img/' + it.image)} alt={it.name} style={{width:120,height:120,objectFit:'cover',borderRadius:8}} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
