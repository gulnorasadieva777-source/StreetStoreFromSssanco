export function notify(message, { type = 'success', duration = 3000 } = {}) {
  try {
    const root = document.createElement('div')
    root.className = `nice-toast nice-toast-${type}`
    root.style.position = 'fixed'
    root.style.right = '16px'
    root.style.top = '16px'
    root.style.zIndex = 99999
    root.style.pointerEvents = 'auto'

    root.innerHTML = `
      <div class="nice-toast-inner">
        <div class="nice-toast-icon">${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</div>
        <div class="nice-toast-body">${String(message)}</div>
        <button class="nice-toast-close" aria-label="Закрыть">✕</button>
      </div>
    `

    document.body.appendChild(root)

    const remove = () => {
      try {
        root.classList.remove('show')
        setTimeout(() => { root.remove() }, 360)
      } catch (e) {}
    }

    root.querySelector('.nice-toast-close').addEventListener('click', remove)
    // auto remove
    setTimeout(remove, duration)
    // show animation (use CSS class)
    requestAnimationFrame(() => { root.classList.add('show') })
  } catch (e) {
    console.error('notify error', e)
    try { alert(message) } catch (e) {}
  }
}

export default notify
