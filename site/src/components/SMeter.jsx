// Analog S-meter: needle swings from S1 to S9+40 as readiness rises.
export default function SMeter({ value = 0, label }) {
  const v = Math.max(0, Math.min(1, value))
  const ang = -52 + v * 104
  const marks = [['1', 0], ['3', 0.14], ['5', 0.28], ['7', 0.42], ['9', 0.56], ['+20', 0.76], ['+40', 0.96]]
  const pt = (f, r) => {
    const a = ((-52 + f * 104 - 90) * Math.PI) / 180
    return [150 + r * Math.cos(a), 150 + r * Math.sin(a)]
  }
  const s = Math.round(1 + v * 8)
  const text = v < 0.56 ? `S${Math.max(1, s)}` : v < 0.76 ? 'S9' : `S9+${v < 0.96 ? 20 : 40}`
  return (
    <figure className="smeter">
      <svg viewBox="0 0 300 170" role="img" aria-label={`${label}: ${Math.round(v * 100)} percent, reads ${text}`}>
        <rect x="2" y="2" width="296" height="166" rx="10" fill="#e9dfc2" />
        <rect x="2" y="2" width="296" height="166" rx="10" fill="none" stroke="#0e0c0a" strokeWidth="3" />
        {marks.map(([n, f]) => {
          const [x1, y1] = pt(f, 112), [x2, y2] = pt(f, 124), [tx, ty] = pt(f, 98)
          return <g key={n}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={f > 0.56 ? '#b3261e' : '#2a251c'} strokeWidth="2.5" />
            <text x={tx} y={ty + 4} textAnchor="middle" fontFamily="Barlow, sans-serif" fontWeight="600" fontSize="15" fill={f > 0.56 ? '#b3261e' : '#2a251c'}>{n}</text>
          </g>
        })}
        <path d={`M ${pt(0, 118)[0]} ${pt(0, 118)[1]} A 118 118 0 0 1 ${pt(1, 118)[0]} ${pt(1, 118)[1]}`} fill="none" stroke="#2a251c" strokeWidth="1.5" />
        <text x="150" y="136" textAnchor="middle" fontFamily="Barlow, sans-serif" fontWeight="700" fontSize="13" fill="#4a4333">readiness</text>
        <g className="needle-g" style={{ transform: `rotate(${ang}deg)`, transformOrigin: '150px 150px' }}>
          <line x1="150" y1="150" x2="150" y2="40" stroke="#c0392b" strokeWidth="2.5" strokeLinecap="round" />
        </g>
        <circle cx="150" cy="150" r="9" fill="#14110e" />
        <rect x="0" y="150" width="300" height="20" fill="#e9dfc2" opacity="0" />
      </svg>
      <figcaption><strong>{text}</strong> {label}</figcaption>
    </figure>
  )
}
