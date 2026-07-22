import { sampleItems } from "../data/items"

// Simple heuristic recommender: match size, preferred styles/colors, budget and viewed items
export function getRecommendations({ profile, viewed = [], favorites = [], feedback = {} } = {}) {
  // score items
  const prefs = profile || {}
  const budget = Number(prefs.budget) || 99999999
  const prefStyles = (prefs.styles || []).map(s => s.toLowerCase())

  const scored = sampleItems.map(item => {
    let score = 0
    // size match
    if (prefs.size && item.sizes && item.sizes.includes(prefs.size)) score += 3
    // price proximity
    const diff = Math.abs(item.price - (Number(budget) || 0))
    score += Math.max(0, 3 - Math.floor(diff / (budget ? (budget/3||1) : 60000)))
    // style match via name/description
    const text = (item.name + ' ' + item.description).toLowerCase()
    prefStyles.forEach(ps => { if (ps && text.includes(ps)) score += 2 })
    // viewed penalty to diversify
    if (viewed.includes(item.id)) score -= 0.5
    // favorites boost
    if (favorites.includes(item.id)) score += 2
    // feedback adjustment
    if (feedback[item.id] === 'like') score += 2
    if (feedback[item.id] === 'dislike') score -= 2
    return { item, score }
  })

  scored.sort((a,b) => b.score - a.score)

  // create simple outfits: pair top with bottom if possible
  const outfits = scored.slice(0, 8).map(s => ({ main: s.item, companions: scored.filter(x=>x.item.id !== s.item.id).slice(0,2).map(x=>x.item) }))
  return outfits
}

// Heuristic size recommendation based on profile (height см, weight кг, gender)
export function recommendSize(profile = {}) {
  try {
    const h = Number(profile.height) || 0
    const w = Number(profile.weight) || 0
    const gender = (profile.gender || '').toLowerCase()

    // If user explicitly selected size, prefer it
    if (profile.size) return profile.size

    if (!h || !w) return ''

    // Simple mapping using height and weight ranges
    // These thresholds are approximate and can be tuned later
    if (h < 165 && w < 60) return 'S'
    if (h < 175 && w < 75) return 'M'
    if (h < 185 && w < 90) return 'L'
    return 'XL'
  } catch (e) {
    return ''
  }
}
