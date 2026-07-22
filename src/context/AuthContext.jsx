import React, { createContext, useContext, useEffect, useState } from "react"
import { notify } from "../utils/notify"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '')
  const [loading, setLoading] = useState(Boolean(token))
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    async function fetchMe() {
      setLoading(true)
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (!res.ok) {
          logout()
          return
        }
        const body = await res.json()
        setUser(body)
      } catch (err) {
        console.error('Auth load failed', err)
        logout()
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [token])

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token)
    } else {
      localStorage.removeItem('auth_token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  function logout() {
    setToken('')
    setUser(null)
    setError(null)
  }

  function updateUser(updates) {
    setUser((prev) => (prev ? { ...prev, ...updates } : prev))
  }

  async function login({ email, password }) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error || 'Ошибка входа')
        notify(body.error || 'Ошибка входа', { type: 'error' })
        return false
      }
      setToken(body.token)
      setUser(body.user)
      notify('Вы вошли в аккаунт', { type: 'success' })
      return true
    } catch (err) {
      console.error(err)
      setError('Сервис недоступен')
      notify('Сервис недоступен', { type: 'error' })
      return false
    } finally {
      setLoading(false)
    }
  }

  async function register({ email, password, name }) {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      })
      const body = await res.json()
      if (!res.ok) {
        setError(body.error || 'Ошибка регистрации')
        notify(body.error || 'Ошибка регистрации', { type: 'error' })
        return false
      }
      setToken(body.token)
      setUser(body.user)
      notify('Аккаунт создан', { type: 'success' })
      return true
    } catch (err) {
      console.error(err)
      setError('Сервис недоступен')
      notify('Сервис недоступен', { type: 'error' })
      return false
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout, updateUser, setError }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
