// Deterministic fake-but-plausible signals so the waterfall and audio feel alive.
import { SEGMENTS, OTHER, FT8, modeAt } from './bandplan'

const hash = (n) => {
  let x = (Math.imul(Math.floor(n) ^ 0x9e3779b9, 2654435761) >>> 0)
  x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13
  return (x >>> 0) / 4294967296
}

const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-',
  L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--',
  X: '-..-', Y: '-.--', Z: '--..', 0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....',
  7: '--...', 8: '---..', 9: '----.', '/': '-..-.', '?': '..--..', '.': '.-.-.-', ',': '--..--' }
export { MORSE }

// Build an on/off timeline (in dot units) for a message.
export function morseTimeline(text) {
  const out = []
  for (const w of text.toUpperCase().split(' ')) {
    for (const ch of w) {
      const code = MORSE[ch]
      if (!code) continue
      for (const s of code) { out.push([1, s === '.' ? 1 : 3]); out.push([0, 1]) }
      out.push([0, 2])
    }
    out.push([0, 4])
  }
  return out
}
const cache = new Map()
function timeline(text) {
  if (!cache.has(text)) {
    const t = morseTimeline(text); const total = t.reduce((a, b) => a + b[1], 0)
    cache.set(text, { t, total })
  }
  return cache.get(text)
}
const CALLS = ['K1ABC', 'W5XYZ', 'N7QRP', 'KD2HAM', 'W1AW', 'VE3NEA', 'JA1YXP', 'DL2ABC', 'G4FON', 'K9LA', 'WB6NOA', 'AA7BQ']
const call = (r) => CALLS[Math.floor(r * CALLS.length)]

function keyed(st, tNow) {
  const { t, total } = timeline(st.text)
  const unit = 1.2 / st.wpm
  const pos = ((tNow / unit + st.phase * total) % total + total) % total
  let acc = 0
  for (const [on, len] of t) { acc += len; if (pos < acc) return on }
  return 0
}

export function stationsBetween(lo, hi, now = Date.now() / 1000) {
  const list = []
  const k0 = Math.floor(lo * 1000), k1 = Math.ceil(hi * 1000)
  for (let k = k0; k <= k1; k++) {
    const r = hash(k), f = (k + hash(k + 77) * 0.8) / 1000
    if (f < lo || f > hi) continue
    const other = OTHER.find(([a, b]) => f >= a && f <= b)
    const mode = modeAt(f)
    if (mode === 'cw' && r < 0.2) {
      list.push({ id: k, f, kind: 'cw', amp: 0.35 + hash(k + 5) * 0.65, wpm: 12 + Math.floor(hash(k + 9) * 18), phase: hash(k + 3),
        text: `CQ CQ DE ${call(hash(k + 1))} ${call(hash(k + 1))} K` })
    } else if (mode === 'ssb' && r < 0.1) {
      list.push({ id: k, f, kind: 'ssb', amp: 0.3 + hash(k + 5) * 0.7, rate: 2 + hash(k + 8) * 3, phase: hash(k + 6) * 100 })
    } else if (mode === 'fm' && f > 144.5 && r < 0.012) {
      list.push({ id: k, f: Math.round(f * 200) / 200, kind: 'fm', amp: 0.5 + hash(k + 5) * 0.5, rate: 3 + hash(k + 8) * 3, phase: hash(k + 6) * 100 })
    } else if (other && other[2].includes('broadcast') && k % 5 === 0) {
      list.push({ id: k, f: Math.round(f * 200) / 200, kind: 'bcast', amp: 0.8 })
    } else if (other && other[2].includes('WWV') && Math.abs(f - Math.round(f)) < 0.0012) {
      list.push({ id: k, f: Math.round(f), kind: 'wwv', amp: 1 })
    }
  }
  // Pinned landmarks
  for (const base of FT8) {
    if (base + 0.003 < lo || base > hi) continue
    for (let i = 0; i < 18; i++) {
      const f = base + (0.2 + hash(base * 100 + i) * 2.6) / 1000
      list.push({ id: `ft8${base}-${i}`, f, kind: 'ft8', amp: 0.4 + hash(i + base) * 0.6, seed: i + base * 1000 })
    }
  }
  if (lo < 28.3 && hi > 28.2) {
    list.push({ id: 'beacon', f: 28.2005, kind: 'cw', amp: 1, wpm: 14, phase: 0, text: 'VVV DE W1AW/B FN31 ' })
  }
  if (lo < 146.52 && hi > 146.52) list.push({ id: 'calling', f: 146.52, kind: 'fm', amp: 0.9, rate: 3.5, phase: 7 })
  return list
}

// 0..1 instantaneous strength for the waterfall.
export function level(st, now = Date.now() / 1000) {
  switch (st.kind) {
    case 'cw': return keyed(st, now) * st.amp
    case 'ssb': {
      const s = Math.sin(now * st.rate + st.phase) * Math.sin(now * st.rate * 0.37 + st.phase * 2)
      return Math.max(0, s + 0.15) * st.amp
    }
    case 'fm': return (Math.sin(now * st.rate + st.phase) > -0.6 ? 1 : 0.15) * st.amp
    case 'ft8': {
      const cyc = (now + st.seed * 0.1) % 15
      return cyc < 12.64 ? st.amp : 0
    }
    default: return st.amp
  }
}
export const widthKHz = { cw: 0.12, ssb: 2.7, fm: 7, bcast: 9, wwv: 0.2, ft8: 0.05 }
export function ft8Tone(st, now) {
  const slot = Math.floor(((now + st.seed * 0.1) % 15) / 0.16)
  return Math.floor(hash(st.seed * 31 + slot) * 8)
}
