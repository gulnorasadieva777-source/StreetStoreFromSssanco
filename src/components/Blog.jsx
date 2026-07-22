import React from "react"
import { articles } from "../data/articles"

function renderMarkdownSimple(md) {
  return md.split('\n\n').map((blk, i) => {
    if (blk.startsWith('### ')) return <h3 key={i}>{blk.replace('### ', '')}</h3>
    if (blk.startsWith('- ')) return <ul key={i}>{blk.split('\n').map((li, k)=> li.startsWith('- ') ? <li key={k}>{li.replace('- ','')}</li> : null)}</ul>
    if (/^\d+\./.test(blk)) return <div key={i}>{blk.split('\n').map((ln,k)=> <p key={k}>{ln}</p>)}</div>
    return <p key={i}>{blk}</p>
  })
}

export default function Blog() {
  const [active, setActive] = React.useState(null)

  return (
    <section style={{maxWidth:1100,margin:'18px auto',padding:'0 12px'}}>
      <h2>Блог — Статьи</h2>

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:16,marginTop:12}}>
        {articles.map(a => (
          <article key={a.slug} className="card" style={{padding:0}}>
            <div style={{padding:16}}>
              <h3 style={{margin:'0 0 8px'}}>{a.title}</h3>
              <p style={{margin:0,color:'var(--muted)'}}>{a.excerpt}</p>
            </div>
            <div style={{padding:16,borderTop:'1px solid rgba(255,255,255,0.02)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <button className="shop-cta" onClick={() => setActive(a)}>Читать статью</button>
              <span style={{color:'var(--muted)',fontSize:13}}>Street Store</span>
            </div>
          </article>
        ))}
      </div>

      {active && (
        <div className="app-modal" role="dialog" aria-modal="true">
          <div className="modal-dialog">
            <div className="modal-inner">
              <div className="modal-header">
                <h3 className="modal-title">{active.title}</h3>
                <button className="header-button" onClick={() => setActive(null)}>✕</button>
              </div>

              <div className="modal-body" style={{maxHeight: '60vh', overflow: 'auto'}}>
                <div style={{color:'var(--muted)',marginBottom:12}}>{active.excerpt}</div>
                <article style={{lineHeight:1.7}}>
                  {renderMarkdownSimple(active.content)}
                </article>
              </div>

              <div className="modal-footer">
                <button className="shop-outline" onClick={() => setActive(null)}>Закрыть</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
