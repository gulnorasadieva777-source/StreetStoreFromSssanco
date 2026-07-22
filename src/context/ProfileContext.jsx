import React, { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"

const ProfileContext = createContext(null)

const defaultProfile = {
  gender: '',
  height: '',
  weight: '',
  size: '',
  styles: [],
  budget: '',
  bonus: 0,
  cashback: 0,
  savedTryOns: []
}

export function ProfileProvider({ children }) {
  const { user, token, updateUser } = useAuth() || {}
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem('profile')
      return raw ? JSON.parse(raw) : defaultProfile
    } catch { return defaultProfile }
  })

  const [orders, setOrders] = useState(() => {
    try {
      const raw = localStorage.getItem('orders')
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    if (user && user.profile) {
      setProfile({ ...defaultProfile, ...user.profile })
    }
  }, [user?.profile])

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile))
  }, [profile])

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders])

  async function updateProfile(p) {
    const nextProfile = { ...profile, ...p }
    setProfile(nextProfile)
    if (token && user) {
      try {
        const res = await fetch('/api/auth/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ profile: nextProfile })
        })
        if (res.ok) {
          const data = await res.json()
          updateUser && updateUser({ profile: data.profile })
        }
      } catch (error) {
        console.error('Profile sync failed', error)
      }
    }
  }

  function saveTryOn(tryOn) {
    setProfile(prev => ({ ...prev, savedTryOns: [tryOn, ...(prev.savedTryOns || [])] }))
  }

  function addOrder(order) {
    setOrders((prev) => [order, ...prev])
    const cb = Math.round((order.total || 0) * 0.01)
    setProfile((prev) => ({ ...prev, cashback: (Number(prev.cashback) || 0) + cb, bonus: (Number(prev.bonus) || 0) + Math.round(cb / 10) }))
  }

  function updateOrderStatus(id, status) {
    setOrders((prev) => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, saveTryOn, orders, addOrder, updateOrderStatus }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
