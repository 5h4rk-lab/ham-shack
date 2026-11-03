import { useSyncExternalStore } from 'react'

const KEY = 'shack.v1'
const empty = { cards: {}, exams: {}, cls: 'T', cert: 'technician', quests: {}, streak: { day: '', n: 0 } }
let state = (() => {
  try { return { ...empty, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return empty }
})()
const subs = new Set()
function commit(next) {
  state = next
  try { localStorage.setItem(KEY, JSON.stringify(state)) } catch {}
  subs.forEach((f) => f())
}
export const useStore = () => useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => state)

const today = () => new Date().toISOString().slice(0, 10)

// Leitner boxes 1..5. Right = up a box, wrong = back to box 1.
export function grade(cert, id, right) {
  const c = state.cards[cert]?.[id] || { box: 0, right: 0, wrong: 0 }
  const box = right ? Math.min(5, Math.max(1, c.box) + 1) : 1
  const t = today()
  const streak = state.streak.day === t ? state.streak
    : { day: t, n: state.streak.day === new Date(Date.now() - 864e5).toISOString().slice(0, 10) ? state.streak.n + 1 : 1 }
  commit({
    ...state, streak,
    cards: { ...state.cards, [cert]: { ...state.cards[cert], [id]: {
      box, right: c.right + (right ? 1 : 0), wrong: c.wrong + (right ? 0 : 1), t: Date.now() } } },
  })
}
export function saveExam(cert, result) {
  commit({ ...state, exams: { ...state.exams, [cert]: [result, ...(state.exams[cert] || [])].slice(0, 30) } })
}
export const setClass = (cls) => commit({ ...state, cls })
export const setCert = (cert) => commit({ ...state, cert })
export const completeQuest = (id) => { if (!state.quests[id]) commit({ ...state, quests: { ...state.quests, [id]: Date.now() } }) }
export const resetAll = () => commit({ ...empty })

// Weighted pick that favours unseen and weak cards.
const W = { 0: 3, 1: 4, 2: 2, 3: 1, 4: 0.35, 5: 0.1 }
export function pickNext(list, cards = {}, skipId) {
  const pool = list.filter((q) => q.id !== skipId)
  const items = pool.length ? pool : list
  const ws = items.map((q) => W[cards[q.id]?.box ?? 0])
  let r = Math.random() * ws.reduce((a, b) => a + b, 0)
  for (let i = 0; i < items.length; i++) { r -= ws[i]; if (r <= 0) return items[i] }
  return items[items.length - 1]
}
export function stats(list, cards = {}) {
  let seen = 0, mastered = 0
  for (const q of list) {
    const b = cards[q.id]?.box || 0
    if (b > 0) seen++
    if (b >= 4) mastered++
  }
  return { total: list.length, seen, mastered }
}
