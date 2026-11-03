import { useEffect, useRef } from 'react'
import { stationsBetween, level, widthKHz } from '../lib/signals'
import { SEGMENTS, RANK } from '../lib/bandplan'

const W = 960, H = 250, SH = 44

function color(v) {
  // dark panel -> amber -> pale cream
  v = Math.max(0, Math.min(1, v))
  const stops = [[0, 14, 20, 17], [0.35, 70, 46, 10], [0.65, 255, 180, 58], [1, 255, 244, 214]]
  for (let i = 1; i < stops.length; i++) {
    if (v <= stops[i][0]) {
      const a = stops[i - 1], b = stops[i], t = (v - a[0]) / (b[0] - a[0])
      return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, a[3] + (b[3] - a[3]) * t]
    }
  }
  return [255, 244, 214]
}

function niceStep(spanKHz) {
  const target = spanKHz / 8
  for (const s of [0.1, 0.5, 1, 2, 5, 10, 20, 50, 100]) if (s >= target) return s
  return 100
}

const ROW_DT = 0.07

// One waterfall row for time t: noise floor plus every station's instantaneous level.
function rowInto(L, t, buf, data, off) {
  const spanHz = L.spanKHz * 1000, lo = L.centerHz - spanHz / 2
  for (let x = 0; x < W; x++) buf[x] = 0.04 + Math.random() * 0.09
  for (const s of L.stations) {
    const lv = level(s, t); if (lv < 0.02) continue
    const w = Math.max(1.6, (widthKHz[s.kind] / L.spanKHz) * W)
    const start = s.kind === 'ssb' ? s.f * 1e6 : s.f * 1e6 - ((w / W) * spanHz) / 2
    const x0 = Math.floor(((start - lo) / spanHz) * W), x1 = Math.ceil(x0 + w)
    for (let x = Math.max(0, x0); x < Math.min(W, x1); x++) {
      const edge = s.kind === 'ssb' ? 0.55 + 0.45 * Math.sin(((x - x0) / w) * Math.PI * 0.9 + 0.3) : 1
      buf[x] += lv * edge * 0.9
    }
  }
  for (let x = 0; x < W; x++) {
    const [r, g, b] = color(buf[x]); const i = off + x * 4
    data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = 255
  }
}
const refresh = (L) => {
  const spanHz = L.spanKHz * 1000, lo = L.centerHz - spanHz / 2
  L.stations = stationsBetween((lo - 3000) / 1e6, (lo + spanHz + 3000) / 1e6); L.at = Date.now() / 1000
}

export default function Waterfall({ centerHz, spanKHz, cls, onTuneHz, still }) {
  const cv = useRef(null), scale = useRef(null)
  const live = useRef({ centerHz, spanKHz, stations: [], at: 0 })

  // Signals are a pure function of time, so when the dial moves we can repaint the whole
  // history for the new frequency instead of sliding old pixels around.
  const repaint = (ctx) => {
    const L = live.current, now = Date.now() / 1000
    const img = ctx.createImageData(W, H), buf = new Float32Array(W)
    for (let y = 0; y < H; y++) rowInto(L, now - y * ROW_DT, buf, img.data, y * W * 4)
    ctx.putImageData(img, 0, 0)
  }
  useEffect(() => {
    const L = live.current; L.centerHz = centerHz; L.spanKHz = spanKHz; refresh(L)
    repaint(cv.current.getContext('2d'))
  }, [centerHz, spanKHz]) // eslint-disable-line

  useEffect(() => {
    if (still) return
    const ctx = cv.current.getContext('2d')
    const row = ctx.createImageData(W, 1), buf = new Float32Array(W)
    const id = setInterval(() => {
      const L = live.current, now = Date.now() / 1000
      if (now - L.at > 0.4) refresh(L)
      rowInto(L, now, buf, row.data, 0)
      ctx.drawImage(cv.current, 0, 1)
      ctx.putImageData(row, 0, 0)
    }, ROW_DT * 1000)
    return () => clearInterval(id)
  }, [still])

  // Frequency scale plus a ribbon showing where your license class may transmit.
  useEffect(() => {
    const ctx = scale.current.getContext('2d')
    const spanMHz = spanKHz / 1000, lo = centerHz / 1e6 - spanMHz / 2, hi = lo + spanMHz
    const X = (mhz) => ((mhz - lo) / spanMHz) * W
    ctx.clearRect(0, 0, W, SH)
    ctx.fillStyle = '#121a16'; ctx.fillRect(0, 0, W, SH)
    // ribbon
    for (const s of SEGMENTS) {
      if (s.hi < lo || s.lo > hi) continue
      const ok = RANK[cls] >= RANK[s.min]
      ctx.fillStyle = ok ? '#8fbf6a' : '#5b4a2a'
      ctx.fillRect(X(s.lo), 0, Math.max(2, X(s.hi) - X(s.lo)), 7)
    }
    // ticks + labels
    const step = niceStep(spanKHz) / 1000
    ctx.strokeStyle = '#7c8b82'; ctx.fillStyle = '#c3cec6'; ctx.font = '600 13px "IBM Plex Mono", monospace'; ctx.textAlign = 'center'
    for (let f = Math.ceil(lo / step) * step; f <= hi; f += step) {
      const x = X(f)
      ctx.beginPath(); ctx.moveTo(x, 9); ctx.lineTo(x, 22); ctx.stroke()
      const label = spanKHz >= 90 ? f.toFixed(3) : f.toFixed(4)
      ctx.fillText(label, Math.min(W - 34, Math.max(34, x)), 38)
    }
    ctx.strokeStyle = '#4a574f'
    for (let f = Math.ceil(lo / (step / 5)) * (step / 5); f <= hi; f += step / 5) {
      const x = X(f); ctx.beginPath(); ctx.moveTo(x, 9); ctx.lineTo(x, 15); ctx.stroke()
    }
  }, [centerHz, spanKHz, cls])

  const click = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const frac = (e.clientX - r.left) / r.width
    const hz = centerHz + (frac - 0.5) * spanKHz * 1000
    onTuneHz(Math.round(hz / 10) * 10)
  }
  return (
    <div className="wf" onClick={click}>
      <canvas ref={scale} width={W} height={SH} className="wf-scale" aria-hidden="true" />
      <canvas ref={cv} width={W} height={H} className="wf-canvas" role="img"
        aria-label="Waterfall display. Click a signal trace to tune to it." />
      <div className="wf-needle" aria-hidden="true" />
    </div>
  )
}
