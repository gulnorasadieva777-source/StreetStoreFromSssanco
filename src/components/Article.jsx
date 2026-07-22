import React from "react"
import { useParams } from "react-router-dom"
import { articles } from "../data/articles"

function renderMarkdownSimple(md) {
  return md.split('\n\n').map((blk, i) => {
    if (blk.startsWith('### ')) return <h3 key={i}>{blk.replace('### ', '')}</h3>
    if (blk.startsWith('- ')) return <ul key={i}>{blk.split('\n').map((li, k)=> li.startsWith('- ') ? <li key={k}>{li.replace('- ','')}</li> : null)}</ul>
    if (/^\d+\./.test(blk)) return <div key={i}>{blk.split('\n').map((ln,k)=> <p key={k}>{ln}</p>)}</div>
    return <p key={i}>{blk}</p>
  })
}

export default function Article() {
  const { slug } = useParams()
  const a = articles.find(x => x.slug === slug)
  if (!a) return <div style={{maxWidth:900,margin:'18px auto'}}>Статья не найдена</div>

  return (
    <section style={{maxWidth:900,margin:'18px auto',padding:'0 12px'}}>
      <h2>{a.title}</h2>
      <div style={{color:'var(--muted)',marginBottom:12}}>{a.excerpt}</div>
      <article style={{lineHeight:1.7}}>
        {renderMarkdownSimple(a.content)}
      </article>
    </section>
  )
}
