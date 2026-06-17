import React, { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem("cart")
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items))
  }, [items])

  function addItem(product) {
    setItems((prev) => [...prev, product])
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((p, idx) => idx !== id))
  }

  function clear() {
    setItems([])
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
