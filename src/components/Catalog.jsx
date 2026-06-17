import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { sampleItems } from "../data/items"
import { useCart } from "../context/CartContext"

export default function Catalog() {
  const [page, setPage] = useState(1)
  const perPage = 4
  const pages = Math.ceil(sampleItems.length / perPage)
  const { addItem } = useCart() || {}

  const start = (page - 1) * perPage
  const items = sampleItems.slice(start, start + perPage)

  const navigate = useNavigate()
  const [animatingId, setAnimatingId] = useState(null)

  function handleOpen(id, e) {
    e?.preventDefault()
    setAnimatingId(id)
    setTimeout(() => navigate(`/product/${id}`), 180)
  }

  return (
    <section className="catalog">
      <h2>Каталог одежды</h2>
      <div className="items">
        {items.map((it) => (
          <div key={it.id} className="card">
            <div className={`image-placeholder ${animatingId === it.id ? 'clicked' : ''}`} onClick={(e) => handleOpen(it.id, e)} style={{cursor:'pointer'}}>
              <img className="card-image" src={encodeURI('/img/' + it.image)} alt={it.name} />
            </div>
            <div className="card-body">
              <div className="name">{it.name}</div>
              <div className="price">{it.price.toLocaleString('ru-RU')} сум</div>
              <div style={{marginTop:8}}>
                <button onClick={() => addItem && addItem(it)}>Добавить в корзину</button>
                <Link to={`/product/${it.id}`} style={{marginLeft:8}}>Открыть</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          Назад
        </button>
        <span>
          {page} / {pages}
        </span>
        <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
          Вперёд
        </button>
      </div>
    </section>
  )
}
