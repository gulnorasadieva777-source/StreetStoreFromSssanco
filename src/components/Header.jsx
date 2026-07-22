import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useFavorites } from "../context/FavoritesContext"
import { useAuth } from "../context/AuthContext"

export default function Header({ theme, onToggleTheme }) {
  const [logo, setLogo] = useState('/img/logo.jpg')
  const { items } = useCart() || { items: [] }
  const { favorites } = useFavorites() || { favorites: [] }
  const [openSearch, setOpenSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { user, logout } = useAuth() || {}

  useEffect(() => {
    const raw = localStorage.getItem("shop_logo")
    if (raw) setLogo(raw)
  }, [])

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="logo logo-link">
          <div className="logo-text">
            <span className="logo-title">Street Store</span>
          </div>
        </Link>

        <nav className="header-nav">
          <Link to="/" className="cart-link">Каталог</Link>
          <Link to="/blog" className="cart-link">Блог</Link>
          <Link to="/shop-info" className="cart-link">О магазине</Link>
        </nav>

        <div className="header-actions">
          <button className="header-button header-theme-toggle" onClick={onToggleTheme} aria-label="Переключить тему">
            {theme === 'dark' ? 'Cyberpunk' : 'Тёмная'}
          </button>
          <button className="header-button" onClick={() => { setOpenSearch(s => !s); if (!openSearch) { setTimeout(() => { const el = document.querySelector('.header-search-input'); if (el) el.focus() }, 50) } }} aria-label="Поиск">🔍</button>
          {openSearch && (
            <input
              autoFocus
              className="header-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { navigate(`/?q=${encodeURIComponent(searchQuery)}`); setOpenSearch(false) } }}
              placeholder="Поиск товаров..."
            />
          )}
          <Link to="/profile" className="cart-link">👤 {user ? (user.name || 'Профиль') : ''}</Link>
          <Link to="/favorites" className="cart-link">❤️ ({favorites.length})</Link>
          <Link to="/cart" className="cart-link">🛒 ({items.length})</Link>
        </div>
      </div>
    </header>
  )
}
