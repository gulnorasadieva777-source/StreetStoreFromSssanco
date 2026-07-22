// Simple look generator (Variant 4)
// Works with products array. If products have `type` property, uses it;
// otherwise assigns pseudo-types based on id.

const typePool = ['hoodie','shirt','jacket','pants','cargo','sneakers','boots','cap']

const defaultCategoryGroups = [
  { id: 'tshirts', categories: ['tshirts', 'tshirts-women'] },
  { id: 'hoodies', categories: ['hoodies'] },
  { id: 'sneakers', categories: ['sneakers'] },
  { id: 'jeans', categories: ['jeans'] },
  { id: 'accessories', categories: ['accessories'] },
]

function inferType(item) {
  if (item.type) return item.type
  // infer from name (very simple)
  const n = (item.name || '').toLowerCase()
  if (n.includes('hood')) return 'hoodie'
  if (n.includes('sneak') || n.includes('shoe')) return 'sneakers'
  if (n.includes('cargo')) return 'cargo'
  if (n.includes('jacket') || n.includes('coat')) return 'jacket'
  if (n.includes('pant')) return 'pants'
  // fallback deterministic by id
  const id = Number(item.id) || 0
  return typePool[id % typePool.length]
}

function normalizeCategory(value) {
  return (value || '').toString().toLowerCase()
}

function getId(item) {
  return item && (item.id ?? item._id ?? item.sku ?? item.name)
}

function isAvailable(item) {
  if (!item) return false
  if (typeof item.stock === 'number') return item.stock > 0
  if (typeof item.available === 'boolean') return item.available
  return true
}

function pickRandom(array) {
  if (!Array.isArray(array) || array.length === 0) return null
  return array[Math.floor(Math.random() * array.length)]
}

function matchesKeywords(item, keywords) {
  if (!keywords.length) return false
  const name = (item.name || '').toLowerCase()
  const desc = (item.description || '').toLowerCase()
  return keywords.some((kw) => name.includes(kw) || desc.includes(kw))
}

export function generateLookByCategories(products = [], options = {}) {
  const count = Number(options.count) || defaultCategoryGroups.length
  const groups = Array.isArray(options.categoryGroups) ? options.categoryGroups : defaultCategoryGroups
  const keywords = Array.isArray(options.keywords) ? options.keywords.map(k => (k || '').toLowerCase()) : []
  if (!Array.isArray(products) || products.length === 0) return []

  const pool = products.filter(isAvailable)
  const picked = []
  const usedIds = new Set()

  for (const group of groups) {
    if (picked.length >= count) break
    const categoryKeys = (group.categories || []).map(normalizeCategory)
    const groupItems = pool.filter((item) => {
      const category = normalizeCategory(item.category)
      return categoryKeys.includes(category) && !usedIds.has(getId(item))
    })
    if (groupItems.length === 0) continue

    let choice = null
    if (keywords.length) {
      const matches = groupItems.filter((item) => matchesKeywords(item, keywords))
      if (matches.length > 0) choice = pickRandom(matches)
    }
    if (!choice) choice = pickRandom(groupItems)
    const id = getId(choice)
    if (id && !usedIds.has(id)) {
      usedIds.add(id)
      picked.push(choice)
    }
  }

  if (picked.length < count) {
    const remainder = pool.filter((item) => {
      const id = getId(item)
      return id && !usedIds.has(id)
    })
    for (const item of remainder) {
      if (picked.length >= count) break
      const id = getId(item)
      usedIds.add(id)
      picked.push(item)
    }
  }

  return picked.slice(0, count)
}

export function generateLook(products = [], options = {}) {
  const count = Number(options.count) || 4
  const keywords = Array.isArray(options.keywords) ? options.keywords.map(k => (k || '').toLowerCase()) : []

  if (!Array.isArray(products) || products.length === 0) return []

  if (options.byCategory || options.groupByCategory) {
    return generateLookByCategories(products, { ...options, count, keywords })
  }

  const pool = products.slice()
  const picked = []
  const usedIds = new Set()

  // If keywords provided, try to pick one random matching product per keyword
  for (const kw of keywords) {
    if (picked.length >= count) break
    const matches = pool.filter((it) => {
      if (!isAvailable(it)) return false
      const name = (it.name || '').toLowerCase()
      const desc = (it.description || '').toLowerCase()
      return name.includes(kw) || desc.includes(kw)
    })
    if (matches.length === 0) continue
    const choice = matches[Math.floor(Math.random() * matches.length)]
    const id = getId(choice)
    if (id && !usedIds.has(id)) {
      usedIds.add(id)
      picked.push(choice)
    }
  }

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = pool[i]
    pool[i] = pool[j]
    pool[j] = tmp
  }

  for (let i = 0; i < pool.length && picked.length < count; i++) {
    const item = pool[i]
    if (!isAvailable(item)) continue
    const id = getId(item)
    if (!id) continue
    if (usedIds.has(id)) continue
    usedIds.add(id)
    picked.push(item)
  }

  return picked
}

export default { generateLook, generateLookByCategories }
