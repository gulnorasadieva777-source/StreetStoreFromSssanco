export function flyToCart(imgEl) {
  try {
    if (!document) return
    // compute start position from image element center if available
    const rect = imgEl && imgEl.getBoundingClientRect ? imgEl.getBoundingClientRect() : { left: window.innerWidth/2, top: window.innerHeight/2, width: 40, height: 40 }
    const size = Math.max(28, Math.min(56, Math.round(Math.min(rect.width, rect.height) * 0.35)))
    const body = document.body

    const emoji = document.createElement('div')
    emoji.className = 'fly-emoji'
    emoji.textContent = '✈️'
    emoji.style.position = 'fixed'
    emoji.style.left = (rect.left + rect.width/2 - size/2) + 'px'
    emoji.style.top = (rect.top + rect.height/2 - size/2) + 'px'
    emoji.style.width = size + 'px'
    emoji.style.height = size + 'px'
    emoji.style.fontSize = Math.round(size * 0.9) + 'px'
    emoji.style.lineHeight = emoji.style.height
    emoji.style.textAlign = 'center'
    emoji.style.zIndex = 9999
    emoji.style.pointerEvents = 'none'
    emoji.style.transition = 'transform 1200ms cubic-bezier(.22,.9,.3,1), opacity 1200ms'
    emoji.style.willChange = 'transform,opacity'
    body.appendChild(emoji)

    const cart = document.querySelector('a[href="/cart"]') || document.querySelector('.site-header .cart-link')
    const targetRect = cart ? cart.getBoundingClientRect() : { left: window.innerWidth - 40, top: 20, width: 24, height: 24 }

    const deltaX = targetRect.left + targetRect.width / 2 - (rect.left + rect.width / 2)
    const deltaY = targetRect.top + targetRect.height / 2 - (rect.top + rect.height / 2)
    const rotate = 25
    const scale = 0.9

    // animate with slight arc using translate and small upward offset
    requestAnimationFrame(() => {
      // translate + rotate + scale
      emoji.style.transform = `translate(${deltaX}px, ${deltaY - 20}px) rotate(${rotate}deg) scale(${scale})`
      emoji.style.opacity = '0.95'
    })

    emoji.addEventListener('transitionend', () => {
      try { emoji.remove() } catch (e) {}
      if (cart) {
        cart.classList.add('cart-bump')
        setTimeout(() => cart.classList.remove('cart-bump'), 300)
      }
    }, { once: true })
  } catch (e) {
    // fail silently
  }
}
