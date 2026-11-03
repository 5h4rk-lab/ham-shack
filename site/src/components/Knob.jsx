import { useRef, useState } from 'react'

// Tuning knob: drag in a circle, scroll, or use arrow keys. One detent every 6 degrees.
export default function Knob({ onStep, valueText, valueNow, min, max }) {
  const ref = useRef(null)
  const drag = useRef(null)
  const [deg, setDeg] = useState(0)

  const turn = (n) => { if (n) { setDeg((d) => d + n * 6); onStep(n) } }
  const angleOf = (e) => {
    const r = ref.current.getBoundingClientRect()
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI
  }
  const down = (e) => { ref.current.setPointerCapture(e.pointerId); drag.current = { a: angleOf(e), rem: 0 } }
  const move = (e) => {
    const d = drag.current; if (!d) return
    const a = angleOf(e); let delta = a - d.a
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    d.a = a; d.rem += delta
    const n = Math.trunc(d.rem / 6)
    if (n) { d.rem -= n * 6; turn(n) }
  }
  const up = () => { drag.current = null }
  const wheel = (e) => { e.preventDefault(); turn(e.deltaY < 0 ? 1 : -1) }
  const key = (e) => {
    const map = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }
    if (map[e.key]) { e.preventDefault(); turn(map[e.key]) }
  }
  const ridges = Array.from({ length: 60 }, (_, i) => i * 6)
  return (
    <div className="knob-wrap">
      <svg ref={ref} className="knob" viewBox="0 0 200 200" tabIndex={0} role="slider"
        aria-label="Tuning knob" aria-valuemin={min} aria-valuemax={max} aria-valuenow={valueNow} aria-valuetext={valueText}
        onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onWheel={wheel} onKeyDown={key}>
        <defs>
          <radialGradient id="kb" cx="38%" cy="32%" r="80%">
            <stop offset="0" stopColor="#3b342c" /><stop offset=".6" stopColor="#1a1612" /><stop offset="1" stopColor="#0c0a08" />
          </radialGradient>
          <radialGradient id="kd" cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor="#2c2620" /><stop offset="1" stopColor="#14110e" />
          </radialGradient>
        </defs>
        <circle cx="100" cy="100" r="98" fill="#0a0806" />
        <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: '100px 100px', transition: drag.current ? 'none' : 'transform .12s cubic-bezier(.3,1.5,.5,1)' }}>
          <circle cx="100" cy="100" r="94" fill="url(#kb)" />
          {ridges.map((a) => (
            <rect key={a} x="98.5" y="6" width="3" height="11" rx="1.5" fill="#050403" opacity=".85" transform={`rotate(${a} 100 100)`} />
          ))}
          <circle cx="100" cy="100" r="66" fill="url(#kd)" stroke="#000" strokeWidth="2" />
          <circle cx="100" cy="100" r="58" fill="none" stroke="#3a332a" strokeWidth="1" />
          <rect x="96" y="38" width="8" height="26" rx="3" fill="#ffb43a" />
        </g>
        <circle cx="100" cy="100" r="98" fill="none" stroke="#51473a" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
