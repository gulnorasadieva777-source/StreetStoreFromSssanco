import React from "react"
import { useParams } from "react-router-dom"
import { sampleItems } from "../data/items"
import { useCart } from "../context/CartContext"

export default function ProductPage() {
  const { id } = useParams()
  const prod = sampleItems.find((p) => String(p.id) === String(id))
  const { addItem } = useCart() || {}
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(t)
  }, [])

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
          <div style={{marginTop:12,fontWeight:700,color:'var(--primary)'}}>{prod.price.toLocaleString('ru-RU')} сум</div>
          <div style={{marginTop:12}}>
            <button onClick={() => addItem && addItem(prod)}>Добавить в корзину</button>
          </div>
        </div>
      </div>
    </section>
  )
}
