// Seven-segment readout drawn in SVG, with dim "ghost" segments like a real display.
const H = (y) => `6,${y} 9,${y - 3} 31,${y - 3} 34,${y} 31,${y + 3} 9,${y + 3}`
const V = (x, y0, y1) => `${x},${y0} ${x + 3},${y0 + 3} ${x + 3},${y1 - 3} ${x},${y1} ${x - 3},${y1 - 3} ${x - 3},${y0 + 3}`
const SEGS = { a: H(5), g: H(35), d: H(65), f: V(5, 8, 32), b: V(35, 8, 32), e: V(5, 38, 62), c: V(35, 38, 62) }
const DIGITS = { 0: 'abcdef', 1: 'bc', 2: 'abdeg', 3: 'abcdg', 4: 'bcfg', 5: 'acdfg', 6: 'acdefg', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', '-': 'g', ' ': '' }

export default function SevenSeg({ text, label }) {
  let x = 0
  const cells = []
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '.') {
      cells.push(<g key={i} transform="skewX(-5)"><circle cx={x - 1} cy={66} r={3.6} className="seg on" /></g>)
      x += 9
      continue
    }
    const on = DIGITS[ch] ?? ''
    cells.push(
      <g key={i} transform={`translate(${x},0) skewX(-5)`}>
        {Object.entries(SEGS).map(([k, pts]) => (
          <polygon key={k} points={pts} className={on.includes(k) ? 'seg on' : 'seg off'} />
        ))}
      </g>,
    )
    x += 46
  }
  return (
    <svg className="sevenseg" viewBox={`-4 -2 ${x + 4} 76`} role="img" aria-label={label || text}>
      {cells}
    </svg>
  )
}
