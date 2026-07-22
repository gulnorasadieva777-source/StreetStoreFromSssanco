import React from "react"
import { Link } from "react-router-dom"

export default function LookModal({ open, onClose, items = [] }) {
  if (!open) return null

  const total = items.reduce((s, i) => s + (i.price || 0), 0)

  return (
    <div className="app-modal" role="dialog" aria-modal="true">
      <div className="modal-dialog">
        <div className="modal-inner">
          <div className="modal-header">
            <h3 className="modal-title">Собранный образ</h3>
            <button className="header-button" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12}}>
              {items.map(it => (
                <div key={it.id} className="card" style={{padding:8}}>
                  <div style={{height:140,overflow:'hidden',borderRadius:10}}>
                    <img src={encodeURI('/img/' + it.image)} alt={it.name} style={{width:'100%',height:'140px',objectFit:'cover'}} />
                  </div>
                  <div style={{padding:'8px 6px'}}>
                    <div style={{fontWeight:800}}>{it.name}</div>
                    <div style={{color:'var(--muted)',marginTop:6}}>{it.price?.toLocaleString('ru-RU')} сум</div>
                    <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
                      <Link to={`/product/${it.id}`} onClick={onClose}>Открыть</Link>
                      <a href={`/img/${it.image}`} target="_blank" rel="noreferrer" style={{marginLeft:'auto'}}>Просмотр</a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{marginTop:14,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{color:'var(--muted)'}}>Итого: <strong style={{color:'var(--primary)'}}>{total.toLocaleString('ru-RU')} сум</strong></div>
              <div>
                <button className="shop-outline" onClick={onClose}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
