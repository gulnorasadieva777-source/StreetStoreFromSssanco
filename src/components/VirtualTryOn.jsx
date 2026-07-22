import React from "react"
import { notify } from "../utils/notify"
import { useProfile } from "../context/ProfileContext"

export default function VirtualTryOn({ open, onClose, image: overlaySrc }) {
  const { saveTryOn } = useProfile()
  const [photo, setPhoto] = React.useState(null) // dataURL
  const [fileName, setFileName] = React.useState('')
  const [overlay, setOverlay] = React.useState(overlaySrc || '')
  const [tx, setTx] = React.useState(0)
  const [ty, setTy] = React.useState(0)
  const [scale, setScale] = React.useState(1)
  const [rot, setRot] = React.useState(0)

  const fileRef = React.useRef(null)
  const dragRef = React.useRef({ active: false, startX: 0, startY: 0, startTx: 0, startTy: 0 })
  React.useEffect(() => {
    setOverlay(overlaySrc || '')
  }, [overlaySrc])

  React.useEffect(() => {
    function onMove(e) {
      if (!dragRef.current.active) return
      const curX = e.touches ? e.touches[0].clientX : e.clientX
      const curY = e.touches ? e.touches[0].clientY : e.clientY
      const dx = curX - dragRef.current.startX
      const dy = curY - dragRef.current.startY
      setTx(Math.round(dragRef.current.startTx + dx))
      setTy(Math.round(dragRef.current.startTy + dy))
      if (e.touches) e.preventDefault()
    }

    function onUp() {
      if (dragRef.current.active) {
        dragRef.current.active = false
        document.body.style.cursor = ''
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove, { passive: false })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [])

  if (!open) return null

  function onFile(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      setFileName(f.name || '')
      setPhoto(reader.result)
    }
    reader.onerror = () => notify('Не удалось загрузить файл', { type: 'error' })
    reader.readAsDataURL(f)
  }

  async function saveScreenshot() {
    try {
      const bg = new Image()
      bg.src = photo || ''
      await new Promise((res, rej) => {
        bg.onload = res
        bg.onerror = () => rej(new Error('Не удалось загрузить фото'))
      })

      const ov = new Image()
      ov.src = overlay || ''
      await new Promise((res, rej) => {
        ov.onload = res
        ov.onerror = () => res() // overlay optional — ignore load error
      })

      const w = bg.width || 800
      const h = bg.height || 1000
      const canvas = document.createElement('canvas')
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0,0,w,h)
      ctx.drawImage(bg, 0, 0, w, h)

      if (ov && ov.width) {
        const ovW = ov.width * scale
        const ovH = ov.height * scale
        const cx = w/2 + tx
        const cy = h/3 + ty
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot * Math.PI / 180)
        ctx.drawImage(ov, -ovW/2, -ovH/2, ovW, ovH)
        ctx.restore()
      }

      const dataUrl = canvas.toDataURL('image/png')
      const id = 'tryon_' + Date.now()
      saveTryOn && saveTryOn({ id, dataUrl, title: 'Примерка ' + new Date().toLocaleString(), date: Date.now() })
      notify('Примерка сохранена', { type: 'success' })
      onClose && onClose()
    } catch (e) {
      console.error(e)
      notify('Не удалось сохранить примерку: ' + (e && e.message ? e.message : ''), { type: 'error' })
    }
  }

  async function loadModel() {
    return null
  }

  function clearAll() {
    setPhoto(null); setFileName(''); setTx(0); setTy(0); setScale(1); setRot(0)
  }

  return (
    <div className="app-modal" style={{zIndex:1300}} role="dialog" aria-modal="true">
      <div className="modal-dialog">
        <div className="modal-inner">
          <div className="modal-header">
            <h3 className="modal-title">Виртуальная примерка</h3>
            <button className="header-button" onClick={onClose}>✕</button>
          </div>

          <div className="modal-body">
            <div style={{display:'flex',gap:16,alignItems:'flex-start',flexWrap:'wrap'}}>
              <div style={{flex:'1 1 420px',minWidth:280}}>
                <div style={{background:'rgba(255,255,255,0.02)',borderRadius:10,overflow:'hidden',position:'relative'}}>
                  {photo ? (
                    <img src={photo} alt="user" style={{width:'100%',height:520,objectFit:'cover',display:'block'}} />
                  ) : (
                    <div style={{width:'100%',height:520,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--muted)'}}>Загрузите фото или сделайте снимок</div>
                  )}

                  {overlay && (
                    <img
                      src={overlay}
                      alt="overlay"
                      onMouseDown={(e)=>{
                        e.preventDefault();
                        dragRef.current.active = true;
                        dragRef.current.startX = e.clientX;
                        dragRef.current.startY = e.clientY;
                        dragRef.current.startTx = tx;
                        dragRef.current.startTy = ty;
                        document.body.style.cursor = 'grabbing'
                      }}
                      onTouchStart={(e)=>{
                        const t = e.touches[0];
                        dragRef.current.active = true;
                        dragRef.current.startX = t.clientX;
                        dragRef.current.startY = t.clientY;
                        dragRef.current.startTx = tx;
                        dragRef.current.startTy = ty;
                      }}
                      style={{position:'absolute',left:'50%',top:'33%',transform:`translate(-50%,-50%) translate(${tx}px, ${ty}px) scale(${scale}) rotate(${rot}deg)`,pointerEvents:'auto',cursor:'grab',touchAction:'none',maxWidth:'60%'}}
                    />
                  )}
                </div>
                <div style={{marginTop:10,color:'var(--muted)'}}>Совет: используйте фото в стоячем положении, чтобы наложение совпадало с силуэтом.</div>
              </div>

              <div style={{width:300,minWidth:260}}>
                <h4 style={{marginTop:0}}>Параметры</h4>

                <div style={{marginTop:8}}>
                  <label style={{display:'block',marginBottom:6}}>Фото (фотофайл)</label>
                  <div className="file-input-wrapper">
                    <input type="file" accept="image/*" onChange={onFile} ref={fileRef} style={{display:'none'}} />
                    <button className="file-input-button" onClick={()=>fileRef.current && fileRef.current.click()}>Выберите файл</button>
                    <div className="file-input-filename">{fileName || (photo ? 'Файл загружен' : 'Файл не выбран')}</div>
                  </div>
                </div>

                <div style={{marginTop:12}}>
                  <label>Сдвиг X</label>
                  <input type="range" min={-300} max={300} value={tx} onChange={e=>setTx(Number(e.target.value))} />
                  <label>Сдвиг Y</label>
                  <input type="range" min={-300} max={300} value={ty} onChange={e=>setTy(Number(e.target.value))} />
                  <label>Масштаб</label>
                  <input type="range" min={0.2} max={3} step={0.01} value={scale} onChange={e=>setScale(Number(e.target.value))} />
                  <label>Поворот</label>
                  <input type="range" min={-180} max={180} value={rot} onChange={e=>setRot(Number(e.target.value))} />
                </div>

                <div style={{marginTop:12,display:'flex',gap:8}}>
                  <button className="shop-outline" onClick={clearAll}>Сброс</button>
                  <button className="shop-outline" onClick={()=>{ setOverlay(''); notify('Слой удалён', {type:'info'}) }}>Удалить слой</button>
                </div>

                <div style={{marginTop:18,display:'flex',gap:8}}>
                  <button className="shop-outline" onClick={onClose}>Закрыть</button>
                  <button className="shop-cta" onClick={saveScreenshot}>Сохранить примерку</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
