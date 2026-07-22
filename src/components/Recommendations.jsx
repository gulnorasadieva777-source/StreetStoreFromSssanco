import React, { useMemo } from "react"
import { sampleItems } from "../data/items"
import { useViewed } from "../context/ViewedContext"

export default function Recommendations({ limit = 4 }) {
  const { viewed } = useViewed() || { viewed: [] }

  const recs = useMemo(() => {
    if (!viewed.length) return sampleItems.slice(0, limit)
    // simple heuristic: recommend items that share colors or close price with last viewed
    const lastId = viewed[0]
    const last = sampleItems.find((s) => s.id === lastId) || sampleItems[0]
    const similar = sampleItems
      .filter((s) => s.id !== last.id)
      .map((s) => {
        let score = 0
        if ((s.colors || []).some((c) => (last.colors || []).includes(c))) score += 2
        const priceDiff = Math.abs(s.price - last.price)
        score += Math.max(0, 2 - Math.floor(priceDiff / 60000))
        return { s, score }
      })
      .sort((a, b) => b.score - a.score)
      .map((x) => x.s)
    return similar.slice(0, limit)
  }, [viewed, limit])

  return (
    <section style={{marginTop:18}}>
      <h3>Рекомендуем для вас</h3>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginTop:8}}>
        {recs.map((it) => (
          <div key={it.id} className="card">
            <div style={{height:140,overflow:'hidden'}}>
              <img src={encodeURI('/img/' + it.image)} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div className="card-body">
              <div className="name">{it.name}</div>
              <div className="price">{it.price.toLocaleString('ru-RU')} сум</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
