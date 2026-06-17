import { useCart } from "../context/CartContext"

export default function Cart() {
  const { items, removeItem, clear } = useCart() || { items: [] }

  const total = items.reduce((s, it) => s + (it.price || 0), 0)

  return (
    <section style={{maxWidth:900,margin:'0 auto'}}>
      <h2>Корзина</h2>
      {items.length === 0 ? (
        <div>Корзина пуста</div>
      ) : (
        <div>
          <ul>
            {items.map((it, idx) => (
              <li key={idx} style={{marginBottom:8}}>
                {it.name} — {it.price.toLocaleString('ru-RU')} сум <button onClick={() => removeItem(idx)}>Удалить</button>
              </li>
            ))}
          </ul>
          <div style={{marginTop:12,fontWeight:700}}>Итого: {total.toLocaleString('ru-RU')} сум</div>
          <div style={{marginTop:12}}>
            <button onClick={() => clear()}>Очистить</button>
          </div>
        </div>
      )}
    </section>
  )
}
