import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../context/CartContext"

export default function Header() {
  const [logo, setLogo] = useState(null)
  const { items } = useCart() || { items: [] }

  useEffect(() => {
    const raw = localStorage.getItem("shop_logo")
    if (raw) setLogo(raw)
  }, [])

  const heroBg = '/img/header.jpg'

  return (
    <header className="site-hero" style={{backgroundImage: `url(${heroBg})`}}>
      <div className="hero-overlay" />
      <div className="hero-content">
        <div className="hero-left">
          {logo ? (
            <img src={logo} alt="logo" className="hero-logo" />
          ) : (
            <div className="hero-name">Магазин Одежды</div>
          )}
        </div>
        <div className="hero-center">
          <h1>Магазин Одежды</h1>
          <p>Качественная одежда и готовые наборы — выберите свой стиль.</p>
        </div>
        <div className="hero-right">
          <Link to="/cart" className="cart-link">Корзина ({items.length})</Link>
        </div>
      </div>
    </header>
  )
}
