import React, { useEffect, useState } from "react"
import { useProfile } from "../context/ProfileContext"
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { recommendSize } from "../services/recommendations"
import { notify } from "../utils/notify"

export default function Profile() {
  const { profile, updateProfile } = useProfile() || { profile: {}, updateProfile: () => {} }
  const { user, loading, error, login, register, logout, setError } = useAuth() || {}
  const [tab, setTab] = useState('login')
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '' })
  const [profileForm, setProfileForm] = useState(profile)

  useEffect(() => {
    if (user) {
      setProfileForm(profile)
      setError && setError(null)
    }
  }, [user, profile, setError])

  function handleChange(field, value) {
    setAuthForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleAuthSubmit(e) {
    e.preventDefault()
    if (tab === 'login') {
      const ok = await login({ email: authForm.email, password: authForm.password })
      if (!ok) return
    } else {
      const ok = await register({ email: authForm.email, password: authForm.password, name: authForm.name })
      if (!ok) return
    }
    setAuthForm({ email: '', password: '', name: '' })
  }

  function save(e) {
    e.preventDefault()
    updateProfile(profileForm)
    notify('Профиль сохранён', { type: 'success' })
  }

  const suggested = recommendSize(profileForm)

  return (
    <section className="profile-section" style={{ maxWidth: 900, margin: '18px auto', padding: '0 12px' }}>
      <h2>Личный кабинет</h2>
      {loading ? (
        <div style={{ padding: 20 }}>Загрузка...</div>
      ) : user ? (
        <>
          <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Привет, {user.name || user.email}</div>
              <div style={{ color: 'var(--muted)' }}>Email: {user.email}</div>
              <div style={{ color: 'var(--muted)' }}>Баланс бонусов: <span style={{ color: 'var(--primary)' }}>{profile.bonus || 0}</span></div>
              <div style={{ color: 'var(--muted)' }}>Кешбэк доступен: {profile.cashback || 0} сум</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/orders" className="shop-outline">История заказов</Link>
              <Link to="/favorites" className="shop-outline">Список желаний</Link>
              <button type="button" className="shop-outline" onClick={logout}>Выйти</button>
            </div>
          </div>

          <form onSubmit={save} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <input placeholder="Пол" value={profileForm.gender || ''} onChange={e => setProfileForm({ ...profileForm, gender: e.target.value })} />
              <input placeholder="Рост (см)" value={profileForm.height || ''} onChange={e => setProfileForm({ ...profileForm, height: e.target.value })} />
              <input placeholder="Вес (кг)" value={profileForm.weight || ''} onChange={e => setProfileForm({ ...profileForm, weight: e.target.value })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <select value={profileForm.size || ''} onChange={e => setProfileForm({ ...profileForm, size: e.target.value })}>
                <option value="">Размер</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
              </select>
              <input placeholder="Бюджет (сум)" value={profileForm.budget || ''} onChange={e => setProfileForm({ ...profileForm, budget: e.target.value })} />
            </div>
            <div>
              <label>Предпочитаемые стили (через запятую)</label>
              <input value={(profileForm.styles || []).join(', ')} onChange={e => setProfileForm({ ...profileForm, styles: e.target.value.split(',').map(s => s.trim()) })} />
            </div>
            <div>
              <button className="shop-cta" type="submit">Сохранить профиль</button>
            </div>
            {suggested ? (
              <div style={{ marginTop: 8, color: '#2b7a0b' }}>Рекомендуемый размер: <strong>{suggested}</strong></div>
            ) : null}
          </form>
        </>
      ) : (
        <div style={{ display: 'grid', gap: 18 }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <button className={tab === 'login' ? 'shop-cta' : 'shop-outline'} type="button" onClick={() => setTab('login')}>Вход</button>
            <button className={tab === 'register' ? 'shop-cta' : 'shop-outline'} type="button" onClick={() => setTab('register')}>Регистрация</button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ display: 'grid', gap: 12 }}>
            <input
              type="email"
              placeholder="Email"
              value={authForm.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Пароль"
              value={authForm.password}
              onChange={(e) => handleChange('password', e.target.value)}
              required
            />
            {tab === 'register' && (
              <input
                type="text"
                placeholder="Имя"
                value={authForm.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            )}
            <div>
              <button className="shop-cta" type="submit">{tab === 'login' ? 'Войти' : 'Зарегистрироваться'}</button>
            </div>
            {error ? <div style={{ color: '#e03d3d' }}>{error}</div> : null}
          </form>

          <div style={{ color: 'var(--muted)' }}>
            <p>Войдите, чтобы сохранить корзину и избранное на своём аккаунте.</p>
            <p>После входа данные будут доступны на любом устройстве.</p>
          </div>
        </div>
      )}
    </section>
  )
}
