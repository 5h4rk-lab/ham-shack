// Loads a question pool lazily and builds the lookups the pages need.
const loaders = {
  technician: () => import('../../../data/technician-2026-2030.json'),
  general: () => import('../../../data/general-2023-2027.json'),
  extra: () => import('../../../data/extra-2024-2028.json'),
}
const figureUrls = import.meta.glob('../../../data/figures/*.png', { eager: true, query: '?url', import: 'default' })
export const figureUrl = (name) => figureUrls[`../../../data/figures/${name}`]

const cache = {}
export function loadPool(cert) {
  if (!cache[cert]) {
    cache[cert] = loaders[cert]().then((m) => {
      const questions = m.default
      const bySub = {}, byGroup = {}, byId = {}
      for (const q of questions) {
        ;(bySub[q.id.slice(0, 2)] ||= []).push(q)
        ;(byGroup[q.id.slice(0, 3)] ||= []).push(q)
        byId[q.id] = q
      }
      return { questions, bySub, byGroup, byId, groups: Object.keys(byGroup).sort() }
    })
  }
  return cache[cert]
}

export const rand = (n) => Math.floor(Math.random() * n)
export function shuffle(a) {
  const b = a.slice()
  for (let i = b.length - 1; i > 0; i--) {
    const j = rand(i + 1)
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

// Answers like "All these choices are correct" only make sense in their original order.
const POSITIONAL = /\b(all|none|both)\b.*\b(choices|these|above)\b|\bnone of\b/i
export function presentQuestion(q) {
  const idx = q.answers.map((_, i) => i)
  const fixed = q.answers.some((a) => POSITIONAL.test(a))
  const order = fixed ? idx : shuffle(idx)
  return { ...q, order, shuffled: !fixed }
}

// One question from every group, which is how the real exam is assembled.
export function buildExam(pool) {
  return pool.groups.map((g) => {
    const list = pool.byGroup[g]
    return list[rand(list.length)]
  })
}
