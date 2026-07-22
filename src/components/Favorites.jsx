import React from "react"
import { sampleItems } from "../data/items"
import { useFavorites } from "../context/FavoritesContext"
import { useCart } from "../context/CartContext"
import { flyToCart } from "../utils/flyToCart"

export default function Favorites() {
  const { favorites, toggleFavorite, clearFavorites } = useFavorites() || { favorites: [] }
  const { addItem } = useCart() || {}

  const favItems = sampleItems.filter((s) => favorites.includes(s.id))

  if (!favItems.length) return (
    <section style={{maxWidth:900,margin:'0 auto'}}>
      <h2>Избранное ❤️</h2>
      <div>Пока пусто — добавьте товары в избранное.</div>
    </section>
  )

  return (
    <section style={{maxWidth:1100,margin:'0 auto'}}>
      <h2>Избранное ❤️</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:16}}>
        {favItems.map((it) => (
          <div key={it.id} className="card">
            <div style={{height:180,overflow:'hidden'}}>
              <img src={encodeURI('/img/' + it.image)} alt={it.name} style={{width:'100%',height:'100%',objectFit:'cover'}} />
            </div>
            <div className="card-body">
              <div className="name">{it.name}</div>
              <div className="price">{it.price.toLocaleString('ru-RU')} сум</div>
              <div style={{marginTop:8,display:'flex',gap:8}}>
                <button onClick={(e) => { const img = e.currentTarget.closest('.card').querySelector('img'); flyToCart(img); addItem && addItem(it); }}>Добавить в корзину</button>
                <button className="shop-outline" onClick={() => toggleFavorite(it.id)}>Убрать</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div style={{marginTop:12}}>
        <button className="shop-outline" onClick={clearFavorites}>Очистить избранное</button>
      </div>
    </section>
  )
}
