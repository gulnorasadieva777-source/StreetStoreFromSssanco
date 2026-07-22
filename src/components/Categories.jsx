import React from "react"
import { useNavigate } from "react-router-dom"

const defaultCategories = [
  { id: 'tshirts', emoji: '👕', title: 'Футболки' },
  { id: 'sneakers', emoji: '👟', title: 'Кроссовки' },
  { id: 'hoodies', emoji: '🧥', title: 'Худи' },
  { id: 'jeans', emoji: '👖', title: 'Джинсы' },
  { id: 'accessories', emoji: '🎒', title: 'Аксессуары' },
]

export default function Categories({ categories = defaultCategories }) {
  const navigate = useNavigate()

  return (
    <section style={{ margin: '18px 0' }}>
      <h3 style={{ margin: '0 0 12px 0', color: 'var(--muted-2)' }}>Категории</h3>
      <div className="categories-grid">
        {categories.map(cat => (
          <button key={cat.id} className="category-card" onClick={() => navigate('/?category=' + encodeURIComponent(cat.id))}>
            <div className="category-emoji">{cat.emoji}</div>
            <div className="category-title">{cat.title}</div>
          </button>
        ))}
      </div>
    </section>
  )
}
