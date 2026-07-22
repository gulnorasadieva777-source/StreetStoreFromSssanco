import React from "react"
import Header from "./components/Header"
import Catalog from "./components/Catalog"
import Footer from "./components/Footer"
import ProductPage from "./components/ProductPage"
import Cart from "./components/Cart"
import ShopInfo from "./components/ShopInfo"
import Categories from "./components/Categories"
import Favorites from "./components/Favorites"
import Blog from "./components/Blog"
import Article from "./components/Article"
import AIHelper from "./components/AIHelper"
import NotificationsWidget from "./components/NotificationsWidget"
import Profile from "./components/Profile"
import Orders from "./components/Orders"
import StyleQuiz from "./components/StyleQuiz"
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import { FavoritesProvider } from "./context/FavoritesContext"
import { ViewedProvider } from "./context/ViewedContext"
import { ProfileProvider } from "./context/ProfileContext"
import { AuthProvider } from "./context/AuthContext"

function Home() {
  const navigate = useNavigate()

  function goToCatalog(e) {
    e?.preventDefault()
    const el = document.getElementById("catalog")
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <>
      <section className="site-hero" aria-label="Главная">
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-left">
            <span className="hero-pill">Коллекции 2026</span>
            <div className="hero-stat">
              <strong>1200+</strong>
              <span>трендовых вещей</span>
            </div>
          </div>

          <div className="hero-center">
            <p className="hero-subtitle">Уличный стиль без компромиссов</p>
            <h1>Street Store — твой образ, твои правила</h1>
            <p>Эксклюзивные новинки, удобный выбор и вдохновение в каждом образе.</p>
            <div className="hero-actions">
              <button className="shop-cta" onClick={goToCatalog}>Открыть каталог</button>
              <button className="shop-outline" onClick={() => navigate('/blog')}>Читать блог</button>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card">
              <span>Рекомендация</span>
              <strong>Ультра-комфортный худи</strong>
            </div>
          </div>
        </div>
      </section>

      <StyleQuiz />
      <ShopInfo />
      <Categories />
      <Catalog />
    </>
  )
}

export default function App() {
  const [theme, setTheme] = React.useState(() => {
    const stored = localStorage.getItem('site_theme')
    return stored === 'cyber' ? 'cyber' : 'dark'
  })

  React.useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-cyber')
    document.body.classList.add(`theme-${theme}`)
    localStorage.setItem('site_theme', theme)
  }, [theme])

  function toggleTheme() {
    setTheme((current) => current === 'dark' ? 'cyber' : 'dark')
  }

  return (
    <BrowserRouter>
      <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
        <ViewedProvider>
        <ProfileProvider>
        <div className="app">
          <Header theme={theme} onToggleTheme={toggleTheme} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop-info" element={<ShopInfo />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<Article />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
            </Routes>
          </main>
          <Footer />
          <AIHelper />
          <NotificationsWidget />
        </div>
        </ProfileProvider>
        </ViewedProvider>
        </FavoritesProvider>
      </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
