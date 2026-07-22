import React, { createContext, useContext, useEffect, useRef, useState } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext(null)

function mergeCart(serverCart, localCart) {
  const merged = [...serverCart.map((item) => ({ ...item }))]
  localCart.forEach((localItem) => {
    const existing = merged.find((item) => item.sku === localItem.sku)
    if (existing) {
      existing.quantity = Math.max(Number(existing.quantity) || 1, Number(localItem.quantity) || 1)
    } else {
      merged.push(localItem)
    }
  })
  return merged
}

export function CartProvider({ children }) {
  const { user, token } = useAuth() || {}
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart")
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const syncRef = useRef(false)

  useEffect(() => {
    if (!token || !user) return

    const serverCart = Array.isArray(user.cart) ? user.cart : []

    if (items.length === 0 && serverCart.length > 0) {
      setItems(serverCart)
      return
    }

    if (items.length > 0 && serverCart.length === 0) {
      saveCartToServer(items, token)
      syncRef.current = true
      return
    }

    if (items.length > 0 && serverCart.length > 0 && !syncRef.current) {
      const merged = mergeCart(serverCart, items)
      setItems(merged)
      saveCartToServer(merged, token)
      syncRef.current = true
      return
    }
  }, [token, user?.cart])

  useEffect(() => {
    if (token) return
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items, token])

  useEffect(() => {
    if (!token || !user) return
    saveCartToServer(items, token)
  }, [items, token])

  function addItem(product) {
    const now = Date.now()
    const reservedUntil = typeof product.stock === 'number' && product.stock <= 3 ? now + 15 * 60 * 1000 : null
    const item = reservedUntil ? { ...product, reservedUntil } : product
    setItems((prev) => [...prev, item])
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((p, idx) => idx !== id))
  }

  function cleanupExpired() {
    setItems((prev) => prev.filter((item) => !item.reservedUntil || item.reservedUntil > Date.now()))
  }

  function clear() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, cleanupExpired, clear }}>
      {children}
    </CartContext.Provider>
  )
}

async function saveCartToServer(cart, token) {
  if (!token) return
  try {
    await fetch('/api/auth/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ cart })
    })
  } catch (error) {
    console.error('Cart sync failed', error)
  }
}

export function useCart() {
  return useContext(CartContext)
}
