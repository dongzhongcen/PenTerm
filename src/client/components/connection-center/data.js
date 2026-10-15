/**
 * pure helpers for the connection center (no store access, unit-testable)
 */

export const STAR_KEY = 'penterm-cc-starred'

export function filterBySearch (list, keyword) {
  const k = (keyword || '').trim().toLowerCase()
  if (!k) {
    return list
  }
  return list.filter(b => {
    return [b.title, b.host, b.url]
      .filter(Boolean)
      .some(v => String(v).toLowerCase().includes(k))
  })
}

// history entries carry the opened tab; a bookmark tab keeps srcId = bookmark id
export function historyStats (history = []) {
  const stats = {}
  for (const h of history) {
    const id = h && h.tab && h.tab.srcId
    if (!id) {
      continue
    }
    const s = stats[id] || { time: 0, count: 0 }
    s.time = Math.max(s.time, h.time || 0)
    s.count += h.count || 1
    stats[id] = s
  }
  return stats
}

export function selectBookmarks ({
  bookmarks = [],
  groups = [],
  groupKey = 'all',
  starred = [],
  history = [],
  keyword = ''
}) {
  let list = bookmarks
  if (groupKey === 'starred') {
    const set = new Set(starred)
    list = bookmarks.filter(b => set.has(b.id))
  } else if (groupKey === 'recent' || groupKey === 'frequent') {
    const stats = historyStats(history)
    const field = groupKey === 'recent' ? 'time' : 'count'
    list = bookmarks
      .filter(b => stats[b.id])
      .sort((a, b) => stats[b.id][field] - stats[a.id][field])
      .slice(0, 50)
  } else if (groupKey !== 'all') {
    const g = groups.find(g => g.id === groupKey)
    const ids = new Set((g && g.bookmarkIds) || [])
    list = bookmarks.filter(b => ids.has(b.id))
  }
  return filterBySearch(list, keyword)
}

// order groups as a tree: top-level first, children (bookmarkGroupIds) after their parent
export function orderGroups (groups = []) {
  const byId = Object.fromEntries(groups.map(g => [g.id, g]))
  const childIds = new Set()
  groups.forEach(g => (g.bookmarkGroupIds || []).forEach(id => childIds.add(id)))
  const out = []
  const seen = new Set()
  const walk = (g, depth) => {
    if (!g || seen.has(g.id)) {
      return
    }
    seen.add(g.id)
    out.push({ group: g, depth })
    ;(g.bookmarkGroupIds || []).forEach(id => walk(byId[id], depth + 1))
  }
  groups.filter(g => !childIds.has(g.id)).forEach(g => walk(g, 0))
  groups.forEach(g => walk(g, 0))
  return out
}
