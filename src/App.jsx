import React from "react"
import Header from "./components/Header"
import Catalog from "./components/Catalog"
import Footer from "./components/Footer"
import ProductPage from "./components/ProductPage"
import Cart from "./components/Cart"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="app">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Catalog />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
