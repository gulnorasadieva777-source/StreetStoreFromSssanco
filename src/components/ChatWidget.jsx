import React, { useState } from "react"

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState(() => [{ from: 'bot', text: 'Привет! Я консультант. Чем помочь?' }])
  const [text, setText] = useState('')

  function send() {
    if (!text.trim()) return
    const t = text.trim()
    setMsgs((m) => [...m, { from: 'user', text: t }])
    setText('')
    setTimeout(() => setMsgs((m) => [...m, { from: 'bot', text: 'Спасибо! Мы ответим в ближайшее время.' }]), 800)
  }

  return (
    <div>
      {open && (
        <div style={{position:'fixed',right:16,bottom:80,width:320,maxWidth:'90vw',background:'var(--card-glass)',border:'1px solid var(--glass-border)',borderRadius:12,boxShadow:'0 18px 50px rgba(2,6,23,0.5)',zIndex:1300}}>
          <div style={{padding:10,borderBottom:'1px solid rgba(255,255,255,0.03)',fontWeight:800}}>Онлайн-чат — консультант</div>
          <div style={{padding:10,maxHeight:240,overflow:'auto'}}>
            {msgs.map((m, i) => (
              <div key={i} style={{marginBottom:8,textAlign:m.from==='bot'?'left':'right'}}>
                <div style={{display:'inline-block',background:m.from==='bot'?'rgba(255,255,255,0.03)':'rgba(255,255,255,0.06)',padding:'8px 10px',borderRadius:8}}>{m.text}</div>
              </div>
            ))}
          </div>
          <div style={{display:'flex',gap:8,padding:10,borderTop:'1px solid rgba(255,255,255,0.03)'}}>
            <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Напишите сообщение..." style={{flex:1,padding:8,borderRadius:8,border:'1px solid rgba(255,255,255,0.04)',background:'transparent',color:'inherit'}} />
            <button onClick={send} style={{padding:'8px 10px',borderRadius:8}}>Отправить</button>
          </div>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{position:'fixed',right:16,bottom:16,width:56,height:56,borderRadius:28,background:'var(--primary)',color:'#042230',border:0,boxShadow:'0 10px 30px rgba(2,6,23,0.4)',zIndex:1400}}>💬</button>
    </div>
  )
}
