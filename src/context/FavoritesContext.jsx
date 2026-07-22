import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const { user, token } = useAuth() || {}
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem("favorites")
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (user && Array.isArray(user.favorites)) {
      setFavorites(user.favorites)
    }
  }, [user?.favorites])

  useEffect(() => {
    if (token) {
      localStorage.removeItem("favorites")
      return
    }
    localStorage.setItem("favorites", JSON.stringify(favorites))
  }, [favorites, token])

  async function toggleFavorite(id) {
    if (token && user) {
      const isFavorite = favorites.includes(id)
      try {
        const res = await fetch('/api/auth/favorite', {
          method: isFavorite ? 'DELETE' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ sku: id })
        })
        if (!res.ok) throw new Error('Не удалось обновить избранное')
        const data = await res.json()
        setFavorites(data.favorites || [])
        return
      } catch (error) {
        console.error(error)
      }
    }
    setFavorites((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  async function clearFavorites() {
    if (token && user) {
      try {
        const res = await fetch('/api/auth/favorite', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ clear: true })
        })
        if (!res.ok) throw new Error('Не удалось очистить избранное')
        const data = await res.json()
        setFavorites(data.favorites || [])
        return
      } catch (error) {
        console.error(error)
      }
    }
    setFavorites([])
  }

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  return useContext(FavoritesContext)
}
