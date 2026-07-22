import React from "react"
import { useNavigate } from "react-router-dom"

export default function ShopInfo() {
  const navigate = useNavigate()

  function goToCatalog(e) {
    e?.preventDefault()
    navigate("/")
    const el = document.getElementById("catalog")
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function openContact() {
    const el = document.querySelector('.site-footer')
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="shop-info">
      <div className="shop-card">
        <div className="shop-header">
          <div className="shop-emoji">🛍️</div>
          <div>
            <h2>Street Store — стиль для нового поколения</h2>
            <p className="shop-tag">Street Store — носи стиль, создавай тренды! ✨</p>
          </div>
        </div>

        <div className="shop-body">
          <p>
            Street Store — один из самых популярных магазинов молодежной одежды в
            Ташкенте. Здесь собраны самые актуальные коллекции для подростков и
            молодых людей, которые следят за модой и хотят выделяться своим стилем. 😎
          </p>

          <p>
            В ассортименте магазина представлены оверсайз футболки, худи,
            свитшоты, карго-брюки, джинсы, кроссовки, аксессуары и другие элементы
            современного streetwear-стиля. Мы тщательно подбираем модели,
            вдохновляясь мировыми трендами и уличной модой. 👟🧢
          </p>

          <p>
            Street Store предлагает качественную одежду по доступным ценам,
            помогая каждому создать уникальный образ для учебы, прогулок, встреч
            с друзьями и активного отдыха.
          </p>

          <p>
            Наш магазин — это место, где подростки могут найти самые модные
            новинки сезона, выразить свою индивидуальность и чувствовать себя
            уверенно каждый день.
          </p>

          <div className="shop-history" style={{marginTop:18, padding:12, background:'rgba(255,255,255,0.01)', borderRadius:10}}>
            <h3 style={{margin:'0 0 8px 0'}}>🏙️ Наша история</h3>
            <p>Street Store появился из любви к уличной культуре, свободе самовыражения и современному стилю.</p>
            <p>Мы заметили, что молодым людям сложно находить одежду, которая одновременно выглядит стильно, соответствует мировым трендам и остаётся доступной по цене. Поэтому мы решили создать место, где каждый сможет собрать свой уникальный образ без переплат.</p>
            <p>Нас вдохновляют улицы больших городов, музыка, спорт, творчество и люди, которые не боятся быть собой. Мы тщательно отбираем модели, следим за трендами и постоянно пополняем ассортимент новыми коллекциями.</p>
            <p>Для нас одежда — это не просто вещи. Это способ показать свой характер, настроение и индивидуальность.</p>
            <p><strong>Street Store — носи стиль, создавай тренды.</strong> ✨</p>
          </div>

          <div className="shop-actions">
            <button className="shop-cta" onClick={goToCatalog}>Перейти в каталог — Посмотреть новинки</button>
            <button className="shop-outline" onClick={() => navigate('/blog')}>Блог 📝</button>
            <button className="shop-outline" onClick={openContact}>Контакты ✉️</button>
          </div>

          <div className="shop-notice" style={{marginTop:16}}>
            <strong>Важно:</strong>
            <ul style={{margin: '8px 0 0 18px'}}>
              <li>Доставка занимает 15–20 дней.</li>
              <li>Товары, приобретённые на этом сайте, <strong>не подлежат возврату</strong>.</li>
              <li>При оплате менеджер получит уведомление через Telegram с деталями заказа.</li>
              <li>Хотите заказать вещь, которую увидели в TikTok или Instagram? Пришлите ссылку или скриншот — мы постараемся найти аналог или привезти такую же модель.</li>
            </ul>
            <div style={{marginTop:10,display:'flex',gap:8}}>
              <button className="shop-outline" onClick={() => window.open('https://t.me/ssskuf1', '_blank')}>Написать в Telegram</button>
              <button className="shop-outline" onClick={openContact}>Контакты ✉️</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
