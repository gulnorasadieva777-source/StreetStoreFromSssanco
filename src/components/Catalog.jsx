import React, { useMemo, useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Link, useNavigate } from "react-router-dom"
import { sampleItems } from "../data/items"
import { generateLook } from "../services/looks"
import LookModal from "./LookModal"
import { useViewed } from "../context/ViewedContext"
import { useCart } from "../context/CartContext"
import { flyToCart } from "../utils/flyToCart"
import { useFavorites } from "../context/FavoritesContext"

export default function Catalog() {
  const [page, setPage] = useState(1)
  const perPage = 4
  // pages depends on filtered items so compute after filters
  const { addItem } = useCart() || {}
  const { addViewed } = useViewed() || { addViewed: () => {} }
  const { favorites, toggleFavorite } = useFavorites() || { favorites: [], toggleFavorite: () => {} }

  const [filterSize, setFilterSize] = useState("")
  const [filterColor, setFilterColor] = useState("")
  const [filterGender, setFilterGender] = useState("")
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(99999999)

  const location = useLocation()
  const q = new URLSearchParams(location.search).get('q') || ''
  const categoryQ = new URLSearchParams(location.search).get('category') || ''
  const genderQ = new URLSearchParams(location.search).get('gender') || ''

  useEffect(() => {
    setFilterGender(genderQ)
  }, [genderQ])

  const filtered = useMemo(() => {
    return sampleItems.filter((it) => {
      if (categoryQ) {
        const catField = (it.category || '').toString().toLowerCase()
        const imgPath = (it.image || '').toString().toLowerCase()
        const catMatch = catField === categoryQ.toLowerCase() || imgPath.startsWith(categoryQ.toLowerCase() + '/')
        if (!catMatch) return false
      }
      const isAccessory = (it.category || '').toLowerCase() === 'accessories'
      if (!isAccessory && genderQ && genderQ !== 'all') {
        if ((it.gender || '').toLowerCase() !== genderQ.toLowerCase()) return false
      }
      if (q && !it.name.toLowerCase().includes(q.toLowerCase())) return false
      if (filterSize && !(it.sizes || []).includes(filterSize)) return false
      if (filterColor && !(it.colors || []).includes(filterColor)) return false
      if (it.price < minPrice) return false
      if (it.price > maxPrice) return false
      return true
    })
  }, [q, categoryQ, genderQ, filterGender, filterSize, filterColor, minPrice, maxPrice])

  const shuffledItems = useMemo(() => {
    const items = [...filtered]
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[items[i], items[j]] = [items[j], items[i]]
    }
    return items
  }, [filtered])

  const pages = Math.max(1, Math.ceil(shuffledItems.length / perPage))

  useEffect(() => {
    setPage(1)
  }, [categoryQ, genderQ])

  const start = (page - 1) * perPage
  const items = shuffledItems.slice(start, start + perPage)

  const navigate = useNavigate()
  const [animatingId, setAnimatingId] = useState(null)
  const [lookOpen, setLookOpen] = useState(false)
  const [lookItems, setLookItems] = useState([])
  const catalogRef = React.useRef(null)

  const telegramLink = 'https://t.me/ssskuf1?text=' + encodeURIComponent(
    'Привет! Я не нашел свой размер или увидел крутой образ в Reels/TikTok. Скидываю скриншот, помогите привезти это.'
  )

  function goToPage(newPage) {
    setPage(newPage)
    const el = catalogRef.current || document.getElementById('catalog')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleOpen(id, e) {
    e?.preventDefault()
    setAnimatingId(id)
    setTimeout(() => { navigate(`/product/${id}`); addViewed && addViewed(id) }, 180)
  }

  return (
    <>
    <section id="catalog" className="catalog" ref={catalogRef}>
      <h2>Каталог одежды</h2>
      <div className="filter-controls" style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:12,alignItems:'center'}}>
        <label style={{fontWeight:700}}>Фильтры:</label>
        <select value={filterSize} onChange={(e)=>{setFilterSize(e.target.value); setPage(1)}}>
          <option value="">Все размеры</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
        <select value={filterColor} onChange={(e)=>{setFilterColor(e.target.value); setPage(1)}}>
          <option value="">Все цвета</option>
          {Array.from(new Set(sampleItems.flatMap(i=>i.colors || []))).map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="number" placeholder="Мин цена" value={minPrice} onChange={(e)=>setMinPrice(Number(e.target.value||0))} style={{width:120}} />
        <input type="number" placeholder="Макс цена" value={maxPrice} onChange={(e)=>setMaxPrice(Number(e.target.value||99999999))} style={{width:140}} />
        <button className="shop-outline filter-reset" onClick={()=>{setFilterSize('');setFilterColor('');setFilterGender('');setMinPrice(0);setMaxPrice(99999999);setPage(1)}}>Сброс</button>
        
        {categoryQ === 'tshirts' && (
          <button className="shop-outline" onClick={() => { navigate('/?category=tshirts-women'); setPage(1); }}>Перейти в женский отдел</button>
        )}
        {categoryQ === 'tshirts-women' && (
          <button className="shop-outline" onClick={() => { navigate('/?category=tshirts'); setPage(1); }}>Перейти в мужской отдел</button>
        )}
        {categoryQ === 'sneakers' && (
          <button className="shop-outline" onClick={() => {
            const nextGender = genderQ === 'women' ? 'men' : 'women'
            setFilterGender(nextGender)
            setPage(1)
            navigate(`/?category=sneakers&gender=${nextGender}`)
          }}>
            {genderQ === 'women' ? 'Перейти в мужской отдел' : 'Перейти в женский отдел'}
          </button>
        )}
        {categoryQ === 'hoodies' && (
          <button className="shop-outline" onClick={() => {
            const nextGender = genderQ === 'women' ? 'men' : 'women'
            setFilterGender(nextGender)
            setPage(1)
            navigate(`/?category=hoodies&gender=${nextGender}`)
          }}>
            {genderQ === 'women' ? 'Перейти в мужской отдел' : 'Перейти в женский отдел'}
          </button>
        )}
        {categoryQ === 'jeans' && (
          <button className="shop-outline" onClick={() => {
            const nextGender = genderQ === 'women' ? 'men' : 'women'
            setFilterGender(nextGender)
            setPage(1)
            navigate(`/?category=jeans&gender=${nextGender}`)
          }}>
            {genderQ === 'women' ? 'Перейти в мужской отдел' : 'Перейти в женский отдел'}
          </button>
        )}
      </div>
      <div className="items">
        {items.map((it) => (
          <div key={it.id} className="card">
            <div className={`image-placeholder ${animatingId === it.id ? 'clicked' : ''}`} onClick={(e) => handleOpen(it.id, e)} style={{cursor:'pointer'}}>
              <img className="card-image" src={encodeURI('/img/' + it.image)} alt={it.name} />
            </div>
            <div className="card-body">
              <div className="name">{it.name}</div>
              <div className="price">{it.price.toLocaleString('ru-RU')} сум</div>
              <div style={{marginTop:8,display:'flex',gap:8,alignItems:'center'}}>
                <button onClick={(e) => { const img = e.currentTarget.closest('.card').querySelector('img'); flyToCart(img); addItem && addItem(it); }}>Добавить в корзину</button>
                <Link to={`/product/${it.id}`} style={{marginLeft:8}}>Открыть</Link>
                <button className="shop-outline" onClick={()=>toggleFavorite(it.id)} style={{marginLeft:'auto'}}>{favorites.includes(it.id)?'❤️ В избранном':'♡ В избранное'}</button>
              </div>
            </div>
          </div>
        ))}

        <div className="card telegram-card">
          <div className="card-body">
            <div>
              <div className="name">Нашли в TikTok?</div>
              <p className="telegram-desc">
                Не нашли свой размер или увидели крутой лук в Reels? Скиньте скриншот нашему админу — привезём это специально для вас.
              </p>
            </div>
            <a className="shop-cta telegram-cta" href={telegramLink} target="_blank" rel="noreferrer">
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
      <div className="pagination">
        <button onClick={() => goToPage(Math.max(1, page - 1))} disabled={page === 1}>
          Назад
        </button>
        <span>
          {page} / {pages}
        </span>
        <button onClick={() => goToPage(Math.min(pages, page + 1))} disabled={page === pages}>
          Вперёд
        </button>
      </div>
    </section>
    <LookModal open={lookOpen} onClose={()=>setLookOpen(false)} items={lookItems} />
    </>
  )
}
