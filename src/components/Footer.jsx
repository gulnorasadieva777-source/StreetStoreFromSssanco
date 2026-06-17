import React from "react"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-title">О магазине</div>
          <div className="footer-text">Магазин Одежды — готовые наборы и стильные решения для любого случая.</div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Контакты</div>
          <a className="footer-link" href="https://t.me/ssskuf1" target="_blank" rel="noreferrer">Telegram: @ssskuf1</a>
          <a className="footer-link" href="tel:+998938024671">Телефон: +998 93 802 46 71</a>
          <div className="footer-text">Адрес: г. Ленина</div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Помощь</div>
          <a className="footer-link" href="#">Доставка</a>
          <a className="footer-link" href="#">Оплата</a>
          <a className="footer-link" href="#">Возврат</a>
        </div>
      </div>

      <div className="footer-bottom">© {new Date().getFullYear()} Магазин Одежды — Все права защищены</div>
    </footer>
  )
}
