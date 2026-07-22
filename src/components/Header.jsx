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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth() || {}

  useEffect(() => {
    const raw = localStorage.getItem("shop_logo")
    if (raw) setLogo(raw)
  }, [])

  const toggleSearch = () => {
    setOpenSearch((s) => !s)
    if (!openSearch) {
      setTimeout(() => {
        const el = document.querySelector('.header-search-input')
        if (el) el.focus()
      }, 50)
    }
  }

  const toggleMobileMenu = () => setMobileMenuOpen((open) => !open)
  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="logo logo-link" onClick={closeMobileMenu}>
          <div className="logo-text">
            <span className="logo-title">Street Store</span>
          </div>
        </Link>

        <div className="header-main">
          <nav className="header-nav">
            <Link to="/" className="cart-link" onClick={closeMobileMenu}>Каталог</Link>
            <Link to="/blog" className="cart-link" onClick={closeMobileMenu}>Блог</Link>
            <Link to="/shop-info" className="cart-link" onClick={closeMobileMenu}>О магазине</Link>
          </nav>

          <div className="header-actions">
            <button className="header-button header-theme-toggle" onClick={onToggleTheme} aria-label="Переключить тему">
              {theme === 'dark' ? 'Cyberpunk' : 'Тёмная'}
            </button>
            <button className="header-button" onClick={toggleSearch} aria-label="Поиск">🔍</button>
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
            <button
              className={`burger-button ${mobileMenuOpen ? 'open' : ''}`}
              onClick={toggleMobileMenu}
              aria-label="Открыть меню"
              aria-expanded={mobileMenuOpen}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="mobile-menu">
            <nav className="mobile-nav">
              <Link to="/" className="cart-link" onClick={closeMobileMenu}>Каталог</Link>
              <Link to="/blog" className="cart-link" onClick={closeMobileMenu}>Блог</Link>
              <Link to="/shop-info" className="cart-link" onClick={closeMobileMenu}>О магазине</Link>
            </nav>
            <div className="mobile-menu-actions">
              <button className="header-button header-theme-toggle" onClick={onToggleTheme}>
                {theme === 'dark' ? 'Cyberpunk' : 'Тёмная'}
              </button>
              <button className="header-button" onClick={toggleSearch}>Поиск</button>
              <Link to="/profile" className="cart-link" onClick={closeMobileMenu}>👤 {user ? (user.name || 'Профиль') : ''}</Link>
              <Link to="/favorites" className="cart-link" onClick={closeMobileMenu}>❤️ ({favorites.length})</Link>
              <Link to="/cart" className="cart-link" onClick={closeMobileMenu}>🛒 ({items.length})</Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
