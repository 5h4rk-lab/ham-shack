import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { describe } from '../lib/bandplan'

// Hands-on explainers. Each one maps to exam questions, listed in the "exam" line.
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const fmt = (x, d = 2) => (Number.isFinite(x) ? +x.toFixed(d) : '—')

function Lab({ title, intro, exam, children }) {
  return (
    <section className="lab">
      <header><h3>{title}</h3><p>{intro}</p></header>
      <div className="lab-body">{children}</div>
      {exam && <footer>Exam questions this answers: {exam}</footer>}
    </section>
  )
}
const Slider = ({ label, value, set, min, max, step = 1, unit }) => (
  <label className="sl"><span>{label} <b>{fmt(value)} {unit}</b></span>
    <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(+e.target.value)} /></label>
)

/* ---------- Ohm's law, series and parallel ---------- */
function Flow({ d, i, color = '#ffb43a' }) {
  const dur = clamp(7 / Math.max(i, 0.02), 0.25, 8)
  return <path d={d} className="flow" style={{ animationDuration: `${dur}s`, stroke: color }} />
}
function Part({ x, y, w = 56, label, v, i }) {
  return (
    <g>
      <rect x={x - w / 2} y={y - 13} width={w} height={26} rx="4" fill="#14110e" stroke="#ece3cb" strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" className="svgt">{label}</text>
      {v !== undefined && <text x={x} y={y - 20} textAnchor="middle" className="svgs">{fmt(v)} V · {fmt(i)} A</text>}
    </g>
  )
}
export function OhmLab() {
  const [mode, setMode] = useState('single')
  const [V, setV] = useState(12)
  const [R1, setR1] = useState(8)
  const [R2, setR2] = useState(8)
  const r = useMemo(() => {
    if (mode === 'single') { const I = V / R1; return { I, P: V * I, parts: [{ v: V, i: I, p: V * I }] } }
    if (mode === 'series') { const I = V / (R1 + R2); return { I, P: V * I, parts: [{ v: I * R1, i: I }, { v: I * R2, i: I }], same: 'current' } }
    const I1 = V / R1, I2 = V / R2; return { I: I1 + I2, P: V * (I1 + I2), parts: [{ v: V, i: I1 }, { v: V, i: I2 }], same: 'voltage' }
  }, [mode, V, R1, R2])
  return (
    <Lab title="Circuit playground" intro="Drag the sliders. Watch the current dots speed up and the numbers follow E = I × R. Switch to series or parallel to see what stays the same."
      exam="T5D01 to T5D14, T5C08 to T5C11">
      <div className="seg-toggle" role="tablist">
        {[['single', 'One resistor'], ['series', 'Two in series'], ['parallel', 'Two in parallel']].map(([k, n]) => (
          <button key={k} className={`pb sm ${mode === k ? 'on' : ''}`} onClick={() => setMode(k)}>{n}</button>))}
      </div>
      <div className="lab-grid">
        <svg viewBox="0 0 340 150" className="circuit" role="img" aria-label="Animated circuit">
          {mode === 'single' && <><Flow d="M40,30 H170 M170,30 H300 V120 H40 V80 M40,60 V30" i={r.I} /><Part x={170} y={30} label={`${R1} Ω`} v={V} i={r.I} /></>}
          {mode === 'series' && <><Flow d="M40,30 H300 V120 H40 V80 M40,60 V30" i={r.I} /><Part x={120} y={30} label={`${R1} Ω`} v={r.parts[0].v} i={r.I} /><Part x={230} y={30} label={`${R2} Ω`} v={r.parts[1].v} i={r.I} /></>}
          {mode === 'parallel' && <>
            <Flow d="M40,58 V25 H110 V45" i={r.I} />
            <Flow d="M230,105 V128 H40 V82" i={r.I} />
            <Flow d="M110,45 V105" i={r.parts[1].i} />
            <Flow d="M230,45 V105" i={r.parts[0].i} />
            <Flow d="M110,45 H142 M198,45 H230" i={r.parts[0].i} />
            <Flow d="M110,105 H142 M198,105 H230" i={r.parts[1].i} />
            <Part x={170} y={45} label={`${R1} Ω`} v={V} i={r.parts[0].i} /><Part x={170} y={105} label={`${R2} Ω`} v={V} i={r.parts[1].i} /></>}
          <g><rect x="32" y="58" width="16" height="24" fill="#14110e" stroke="#ffb43a" strokeWidth="2" /><text x="40" y="74" textAnchor="middle" className="svgt">+</text></g>
          <text x="58" y="72" className="svgs">{V} V</text>
        </svg>
        <div className="lab-side">
          <Slider label="Battery" value={V} set={setV} min={1} max={24} unit="V" />
          <Slider label={mode === 'single' ? 'Resistor' : 'Resistor 1'} value={R1} set={setR1} min={1} max={100} unit="Ω" />
          {mode !== 'single' && <Slider label="Resistor 2" value={R2} set={setR2} min={1} max={100} unit="Ω" />}
          <dl className="readouts">
            <div><dt>Total current</dt><dd>{fmt(r.I)} A</dd></div>
            <div><dt>Power drawn</dt><dd>{fmt(r.P)} W</dd></div>
          </dl>
          {r.same && <p className="callout">In a <b>{mode}</b> circuit the <b>{r.same}</b> is the <b>same</b> through every part. That is the exam fact.</p>}
          <p className="small">P = I × E, so {fmt(r.I)} A × {V} V = {fmt(r.P)} W.</p>
        </div>
      </div>
    </Lab>
  )
}

/* ---------- Decibels ---------- */
export function DbLab() {
  const [db, setDb] = useState(3)
  const ratio = 10 ** (db / 10)
  const watts = 5 * ratio
  return (
    <Lab title="Decibel slider" intro="You start with a 5 watt handheld. Slide the gain or loss and see the output." exam="T5B09, T5B10, T5B11">
      <Slider label="Change" value={db} set={setDb} min={-12} max={12} step={1} unit="dB" />
      <div className="dbbars">
        <div><span>In: 5 W</span><i style={{ width: '25%' }} /></div>
        <div><span>Out: {fmt(watts)} W</span><i className="out" style={{ width: `${clamp(watts / 80, 0.01, 1) * 100}%` }} /></div>
      </div>
      <p className="callout">{[[3, 'Double the power.'], [6, 'Four times the power.'], [10, 'Ten times the power.'], [-3, 'Half the power.'], [-6, 'One quarter of the power.'], [0, 'No change.']].find(([k]) => k === db)?.[1] || `${fmt(ratio, 2)}× the power.`}</p>
      <p className="small">Memorize three: +3 dB ×2, +6 dB ×4, +10 dB ×10. Negative numbers divide instead.</p>
    </Lab>
  )
}

/* ---------- Wavelength and antenna lengths ---------- */
export function WaveLab() {
  const [lf, setLf] = useState(Math.log10(146.52))
  const f = 10 ** lf
  const wl = 300 / f
  const info = describe(f, 'T')
  const cycles = 3
  const pts = Array.from({ length: 241 }, (_, i) => `${i * 1.4},${40 - 30 * Math.sin((i / 240) * Math.PI * 2 * cycles)}`).join(' ')
  return (
    <Lab title="Wavelength and antenna length" intro="Slide through the spectrum. Higher frequency means a shorter wave and a shorter antenna." exam="T3B05, T3B06, T3B07, T9A05, T9A08">
      <Slider label="Frequency" value={f} set={(v) => setLf(Math.log10(v))} min={1.8} max={450} step={0.01} unit="MHz" />
      <div className="presets">{[['HF 40 m', 7.15], ['10 m', 28.4], ['6 m', 52], ['2 m', 146.52], ['70 cm', 446]].map(([n, v]) => <button key={n} className="pb sm" onClick={() => setLf(Math.log10(v))}>{n}</button>)}</div>
      <svg viewBox="0 0 336 80" className="wave" role="img" aria-label="Three wave cycles"><polyline points={pts} fill="none" stroke="#ffb43a" strokeWidth="3" /></svg>
      <dl className="readouts four">
        <div><dt>Band</dt><dd>{info.band?.name || '—'}</dd></div>
        <div><dt>One wavelength</dt><dd>{wl >= 1 ? `${fmt(wl, 2)} m` : `${fmt(wl * 100, 1)} cm`}</dd></div>
        <div><dt>Half-wave dipole</dt><dd>{fmt(468 / f, 1)} ft</dd></div>
        <div><dt>Quarter-wave whip</dt><dd>{fmt((234 / f) * 12, 1)} in</dd></div>
      </dl>
      <p className="small">Wavelength (m) = 300 ÷ frequency (MHz). Park on 146 MHz: the quarter-wave whip is about 19 inches, the classic 2 meter antenna.</p>
    </Lab>
  )
}

/* ---------- Polarization ---------- */
export function PolarLab() {
  const [a, setA] = useState(0) // transmit antenna tilt: 0 = vertical, 90 = horizontal
  const loss = Math.cos((a * Math.PI) / 180) ** 2
  const db = loss < 0.001 ? -30 : 10 * Math.log10(loss)
  return (
    <Lab title="Polarization matching" intro="The receiving antenna stands upright. Tilt the transmitting antenna and watch the signal drop." exam="T3A03, T3A04, T3A05, T9A03">
      <Slider label="Transmit antenna tilt" value={a} set={setA} min={0} max={90} unit="°" />
      <div className="polar">
        <svg viewBox="0 0 300 120">
          <g transform="translate(60,100)"><line x1="0" y1="0" x2="0" y2="-80" stroke="#ece3cb" strokeWidth="5" style={{ transform: `rotate(${a}deg)`, transformOrigin: '0 0', transition: 'transform .15s' }} /><text x="0" y="14" textAnchor="middle" className="svgs">transmit</text></g>
          <path d="M100,50 q40,-30 80,0 q-40,30 -80,0" fill="none" stroke="#ffb43a" strokeOpacity={loss} strokeWidth="2" />
          <g transform="translate(240,100)"><line x1="0" y1="0" x2="0" y2="-80" stroke="#ece3cb" strokeWidth="5" /><text x="0" y="14" textAnchor="middle" className="svgs">receive</text></g>
        </svg>
        <div className="meter"><i style={{ width: `${loss * 100}%` }} /><span>{fmt(db, 1)} dB</span></div>
      </div>
      <p className="callout">{a < 10 ? 'Matched. Full signal. FM repeaters use vertical on both ends.' : a > 80 ? 'Cross-polarized: the received signal strength is reduced a lot (T3A04).' : 'Partly mismatched. Some loss.'}</p>
      <p className="small">Weak-signal SSB and CW on VHF/UHF is horizontal, FM and repeaters are vertical. Polarization is the direction of the electric field.</p>
    </Lab>
  )
}

/* ---------- Skywave ---------- */
export function SkyLab() {
  const [day, setDay] = useState(false)
  const [sun, setSun] = useState(0.7)
  const [f, setF] = useState(14)
  const MUF = day ? 14 + 22 * sun : 5 + 8 * sun
  const LUF = day ? 7.5 : 1.5
  const state = f < LUF ? 'absorbed' : f > MUF ? 'escapes' : 'refracts'
  const land = 120 + (f / MUF) * 130
  const ray = state === 'absorbed' ? 'M20,170 L112,86' : state === 'escapes' ? 'M20,170 L150,40 L205,-10' : `M20,170 Q${(20 + land) / 2},-6 ${land},170`
  return (
    <Lab title="Skywave explorer (simplified model)" intro="Pick day or night, solar activity, and a frequency. See whether the ionosphere absorbs, bends, or ignores your signal." exam="T3A11, T3C09, T3C10">
      <div className="seg-toggle">
        <button className={`pb sm ${!day ? 'on' : ''}`} onClick={() => setDay(false)}>Night</button>
        <button className={`pb sm ${day ? 'on' : ''}`} onClick={() => setDay(true)}>Day</button>
      </div>
      <div className="lab-grid">
        <svg viewBox="0 0 300 180" className="sky" role="img" aria-label="Signal path through the ionosphere">
          <rect width="300" height="180" fill={day ? '#243a4a' : '#0d1118'} rx="6" />
          {day && <rect y="76" width="300" height="20" fill="#7a5513" opacity=".35" />}
          <rect y="36" width="300" height="22" fill="#34595c" opacity={day ? 0.5 : 0.8} />
          <text x="296" y="52" textAnchor="end" className="svgs">F layer</text>
          {day && <text x="296" y="90" textAnchor="end" className="svgs">D layer absorbs low HF</text>}
          <path d="M0,176 Q150,160 300,176 V180 H0 Z" fill="#2d4a2f" />
          <path d={ray} fill="none" stroke="#ffb43a" strokeWidth="3" strokeDasharray="6 5" className="flow" style={{ animationDuration: '1.4s' }} />
          <circle cx="20" cy="170" r="5" fill="#ece3cb" />
          {state === 'refracts' && <circle cx={land} cy="170" r="5" fill="#a2d46f" />}
        </svg>
        <div className="lab-side">
          <Slider label="Frequency" value={f} set={setF} min={1.8} max={50} step={0.1} unit="MHz" />
          <Slider label="Solar activity" value={sun} set={setSun} min={0} max={1} step={0.05} unit="" />
          <dl className="readouts">
            <div><dt>Highest usable (MUF)</dt><dd>~{fmt(MUF, 0)} MHz</dd></div>
            <div><dt>Lowest usable (LUF)</dt><dd>~{fmt(LUF, 1)} MHz</dd></div>
          </dl>
          <p className="callout">{state === 'absorbed' ? 'Absorbed by the D layer. Low bands are weak by day.' : state === 'escapes' ? 'Too high: the signal passes through into space. No skip.' : 'Refracted back to Earth. Long-distance contact.'}</p>
        </div>
      </div>
      <p className="small">Real propagation is messier, but the exam ideas hold: 10 m and 6 m open when the sun is active, mostly in daylight; the ionosphere (not the troposphere) bends HF.</p>
    </Lab>
  )
}

/* ---------- SWR ---------- */
export function SwrLab() {
  const [rl, setRl] = useState(50)
  const gamma = (rl - 50) / (rl + 50)
  const swr = Math.max(rl, 50) / Math.min(rl, 50)
  const refl = gamma * gamma * 100
  return (
    <Lab title="SWR and the feed line" intro="Your radio and coax are 50 Ω. Change the antenna's impedance and see how much power bounces back." exam="T7C04, T7C05, T7C06, T9B12">
      <Slider label="Antenna impedance" value={rl} set={setRl} min={5} max={300} unit="Ω" />
      <dl className="readouts four">
        <div><dt>SWR</dt><dd>{fmt(swr, 2)} : 1</dd></div>
        <div><dt>Reflected</dt><dd>{fmt(refl, 1)} %</dd></div>
        <div><dt>Of 100 W</dt><dd>{fmt(refl, 1)} W back</dd></div>
        <div><dt>Delivered</dt><dd>{fmt(100 - refl, 1)} W</dd></div>
      </dl>
      <div className="swrbar"><i style={{ left: `${clamp((Math.log10(swr) / Math.log10(10)) * 100, 0, 100)}%` }} /><span>1:1</span><span>2:1</span><span>3:1</span><span>10:1</span></div>
      <p className="callout">{swr < 1.1 ? '1:1 is a perfect match.' : swr < 2 ? 'Excellent. Nobody worries below 1.5:1.' : swr < 3 ? 'Usable, but a mismatch. Some power reflected.' : 'High SWR is an impedance mismatch. A solid-state radio will fold back its power to protect the final transistors (T7C05).'}</p>
    </Lab>
  )
}

/* ---------- Modulation and bandwidth ---------- */
const MODES = [['CW', 0.15, 'Morse code on and off. The narrowest signal, about 150 Hz.'], ['SSB', 3, 'One sideband of voice. About 3 kHz. Great for weak-signal work.'], ['FM voice', 12, 'Repeater audio. 10 to 15 kHz wide. One signal at a time.'], ['Fast-scan TV', 6000, 'Analog amateur TV. About 6 MHz, as wide as the 70 cm segment lets you.']]
export function ModLab() {
  const [i, setI] = useState(1)
  const [name, bw, text] = MODES[i]
  const fit = Math.floor(30 / bw)
  return (
    <Lab title="How wide is that signal?" intro="Each mode takes up a slice of spectrum. Pick a mode and see how many fit in a 30 kHz piece of the band." exam="T8A05 to T8A12">
      <div className="seg-toggle">{MODES.map(([n], k) => <button key={n} className={`pb sm ${i === k ? 'on' : ''}`} onClick={() => setI(k)}>{n}</button>)}</div>
      <p className="callout">{text}</p>
      <div className="slots" aria-label="Signals that fit in 30 kHz">
        {Array.from({ length: clamp(fit, 0, 60) }, (_, k) => <i key={k} style={{ width: `${Math.max(1.4, (bw / 30) * 100)}%` }} />)}
        {fit === 0 && <em>Does not fit. This mode needs more than 30 kHz.</em>}
      </div>
      <p className="small">{fit > 0 ? `About ${fit} ${name} signal${fit === 1 ? '' : 's'} fit side by side in 30 kHz.` : 'Wide modes live high up in the band (UHF and above) where there is room.'}</p>
    </Lab>
  )
}

/* ---------- Repeater access ---------- */
const RBANDS = {
  '2 m': { off: 0.6, outs: [{ f: 146.94, d: -1 }, { f: 147.18, d: 1 }, { f: 146.76, d: -1 }] },
  '70 cm': { off: 5, outs: [{ f: 442.5, d: 1 }, { f: 447.2, d: -1 }, { f: 444.1, d: 1 }] },
}
const TONES = [67, 88.5, 100, 123, 141.3, 162.2, 'none']
export function RepeaterLab() {
  const [band, setBand] = useState('2 m')
  const [ri, setRi] = useState(0)
  const [dir, setDir] = useState(1)
  const [tone, setTone] = useState(88.5)
  const [rev, setRev] = useState(false)
  const [keyed, setKeyed] = useState(null)
  const B = RBANDS[band]
  const rep = B.outs[ri]
  const repIn = rep.f + rep.d * B.off              // where this repeater listens
  const myTx = rev ? rep.f : rep.f + dir * B.off
  const myRx = rev ? rep.f + dir * B.off : rep.f
  const okFreq = Math.abs(myTx - repIn) < 1e-6
  const okTone = tone === 100
  const reset = (fn) => (e) => { fn(e); setKeyed(null) }
  return (
    <Lab title="Get into the repeater" intro="Each repeater transmits on its output and listens on an input that is 600 kHz away on 2 m or 5 MHz away on 70 cm, above or below. It also wants a 100 Hz CTCSS tone. Set your radio, then key up." exam="T2A01, T2A03, T2B01, T2B02, T2B04">
      <div className="seg-toggle">{Object.keys(RBANDS).map((b) => <button key={b} className={`pb sm ${band === b ? 'on' : ''}`} onClick={() => { setBand(b); setRi(0); setKeyed(null) }}>{b}</button>)}</div>
      <div className="rep-grid">
        <label>Repeater output (you listen)<select value={ri} onChange={reset((e) => setRi(+e.target.value))}>{B.outs.map((o, k) => <option key={o.f} value={k}>{o.f.toFixed(3)} MHz</option>)}</select></label>
        <label>Your offset<select value={dir} onChange={reset((e) => setDir(+e.target.value))}><option value={1}>+ (transmit higher)</option><option value={-1}>− (transmit lower)</option></select></label>
        <label>Your tone<select value={tone} onChange={reset((e) => setTone(e.target.value === 'none' ? 'none' : +e.target.value))}>{TONES.map((t) => <option key={t} value={t}>{t === 'none' ? 'no tone' : `${t} Hz`}</option>)}</select></label>
        <label className="check"><input type="checkbox" checked={rev} onChange={reset((e) => setRev(e.target.checked))} /> Reverse (REV) button</label>
      </div>
      <dl className="readouts four">
        <div><dt>You transmit</dt><dd>{fmt(myTx, 3)} MHz</dd></div>
        <div><dt>You receive</dt><dd>{fmt(myRx, 3)} MHz</dd></div>
        <div><dt>Repeater listens</dt><dd>{fmt(repIn, 3)} MHz</dd></div>
        <div><dt>Offset</dt><dd>{B.off === 0.6 ? '600 kHz' : '5 MHz'}</dd></div>
      </dl>
      <button className="pb on big" onClick={() => setKeyed(okFreq && okTone ? 'ok' : !okFreq ? 'freq' : 'tone')}>Key up</button>
      {keyed && <p className={`callout ${keyed === 'ok' ? 'good' : 'bad'}`}>
        {keyed === 'ok' ? 'The repeater keys up and you are heard.' : keyed === 'freq' ? (rev ? 'REV swaps your receive and transmit, so you are now talking on the repeater OUTPUT and the repeater never hears you. Use REV to listen on the input and check whether simplex will work (T2B01).' : `Your transmit frequency is not where this repeater listens (${fmt(repIn, 3)} MHz). Flip the offset direction.`) : 'Wrong or missing CTCSS tone. You hear the repeater but cannot open it (T2B04).'}</p>}
    </Lab>
  )
}

/* ---------- Schematic symbols ---------- */
const SYM = {
  Resistor: 'M0,30 H25 l5,-12 l10,24 l10,-24 l10,24 l10,-24 l5,12 H100',
  'Variable resistor': 'M0,30 H25 l5,-12 l10,24 l10,-24 l10,24 l10,-24 l5,12 H100 M30,52 L72,8 M72,8 l-9,3 M72,8 l-3,9',
  Capacitor: 'M0,30 H44 M44,10 V50 M56,10 V50 M56,30 H100',
  Inductor: 'M0,30 H20 a10,12 0 0 1 20,0 a10,12 0 0 1 20,0 a10,12 0 0 1 20,0 H100',
  Diode: 'M0,30 H35 M35,12 V48 L65,30 Z M65,12 V48 M65,30 H100',
  LED: 'M0,30 H35 M35,12 V48 L65,30 Z M65,12 V48 M65,30 H100 M50,10 L62,0 M58,14 L70,4 M62,0 l-6,1 M70,4 l-6,1',
  Transistor: 'M0,30 H36 M36,14 V46 M36,24 L64,8 V0 M36,36 L64,52 V60 M64,52 l-8,-1 M64,52 l-3,-8 M20,30 a0,0 0 0 0 0,0',
  Battery: 'M0,30 H38 M38,10 V50 M48,20 V40 M58,10 V50 M68,20 V40 M68,30 H100',
  Lamp: 'M0,30 H34 M66,30 H100 M50,14 a16,16 0 1 0 0.01,0 M39,19 L61,41 M61,19 L39,41',
  Antenna: 'M50,60 V22 M50,22 L28,2 M50,22 L72,2',
  Transformer: 'M0,12 H22 a6,6 0 0 1 0,12 a6,6 0 0 1 0,12 a6,6 0 0 1 0,12 H0 M45,8 V52 M55,8 V52 M78,12 a6,6 0 0 0 0,12 a6,6 0 0 0 0,12 a6,6 0 0 0 0,12 M78,12 H100 M78,48 H100',
  Fuse: 'M0,30 H30 M30,23 H70 V37 H30 Z M30,30 H70 M70,30 H100',
  'Switch (SPST)': 'M0,40 H30 M30,40 L68,16 M72,40 H100',
  Ground: 'M50,6 V30 M28,30 H72 M37,39 H63 M45,48 H55',
}
const NAMES = Object.keys(SYM)
export function SymbolLab() {
  const pick = () => { const k = NAMES[Math.floor(Math.random() * NAMES.length)]; const o = new Set([k]); while (o.size < 4) o.add(NAMES[Math.floor(Math.random() * NAMES.length)]); return { k, o: [...o].sort(() => Math.random() - 0.5) } }
  const [q, setQ] = useState(pick)
  const [sel, setSel] = useState(null)
  const [s, setS] = useState({ right: 0, total: 0, run: 0 })
  const choose = (o) => { if (sel) return; setSel(o); const ok = o === q.k; setS((x) => ({ right: x.right + ok, total: x.total + 1, run: ok ? x.run + 1 : 0 })) }
  return (
    <Lab title="Name that symbol" intro="Schematics are the one place the exam shows you a picture. Learn the shapes and group T6C is free points." exam="T6C01 to T6C12, T6D10, T6A09">
      <div className="sym-quiz">
        <svg viewBox="-6 -8 112 76" className="sym"><path d={SYM[q.k]} fill="none" stroke="#ece3cb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
        <div className="answers">
          {q.o.map((o) => <button key={o} className={`ans ${sel ? (o === q.k ? 'right' : o === sel ? 'wrong' : 'dim') : ''}`} onClick={() => choose(o)}><span>{o}</span></button>)}
        </div>
      </div>
      <div className="copy"><button className="pb on" disabled={!sel} onClick={() => { setQ(pick()); setSel(null) }}>Next symbol</button><span className="score">Right: {s.right} of {s.total} · streak {s.run}</span></div>
      <p className="small">Simplified drawings. The exam's real figures T-1, T-2 and T-3 are shown below this lab.</p>
    </Lab>
  )
}


/* ---------- Antenna picker ---------- */
const GOALS = [
  { id: 'repeater', q: 'Talk on my local FM repeater from home', picks: [['groundplane', 'Cheapest and simplest. Omni and vertical, which matches FM.', 'build-groundplane'], ['jpole', 'No radials. Easy to hang in a window, attic or tree.', 'build-jpole'], ['yagi', 'Aim a small vertical Yagi if the repeater is 30 miles or more away.']], skip: 'A horizontal dipole or loop: the polarization is wrong for FM.' },
  { id: 'handheld', q: 'Get more range from my handheld', picks: [['whips', 'Swap the rubber duck for a 19 inch quarter-wave whip. Biggest upgrade per dollar in ham radio.'], ['groundplane', 'At home, a real antenna on a window or balcony beats the duck by a mile.', 'build-groundplane'], ['jpole', 'A roll-up J-pole in a window works from a hotel room too.', 'build-jpole']], skip: 'Holding the radio inside a car with no outside antenna. The metal body shields it.' },
  { id: 'hf', q: 'Get on HF with a Technician license (10 m voice, CW on 40 and 15 m)', picks: [['dipole', 'A 10 meter dipole is only 16 feet long and gives you SSB voice at 28.3 to 28.5 MHz.', 'build-dipole'], ['efhw', 'An end-fed half-wave gives you several bands on one wire.'], ['groundplane', 'A vertical with elevated radials is low-profile and has a low takeoff angle (HF versions need many radials).']], skip: 'Large multi-band beams and towers, until you want to chase distance on higher classes.' },
  { id: 'satellite', q: 'Work satellites like the ISS or the FM satellites', picks: [['yagi', 'A small handheld Yagi, aimed by hand as the satellite passes. Circular polarization is best.'], ['satellite', 'Read how Doppler shift and spin fading change your operating.']], skip: 'A fixed, low-gain whip: you will only hear the strongest passes.' },
  { id: 'weak', q: 'Weak-signal VHF and UHF (SSB, CW, 6 m, 2 m)', picks: [['yagi', 'Horizontal Yagi, aimed. This is why weak-signal work is horizontal.'], ['quad', 'A quad gives similar gain, is quiet, and handles ice and wind.']], skip: 'A vertical omni. Wrong polarization and no gain.' },
  { id: 'scanner', q: 'Receive everything (scanner or SDR)', picks: [['discone', 'A discone covers a huge range of frequencies in one antenna.'], ['logperiodic', 'A log-periodic gives gain and covers a wide band when you need to hear far.']], skip: 'A tuned single-band antenna. It will be deaf outside its band.' },
  { id: 'apartment', q: 'I live in an apartment or have an HOA', picks: [['magloop', 'Compact, indoors or on a balcony. Narrow bandwidth, so you retune it.'], ['jpole', 'A roll-up J-pole in a window works well on VHF/UHF.', 'build-jpole'], ['dipole', 'A 10 meter dipole is only 16 feet. It fits across a balcony or in an attic.', 'build-dipole']], skip: 'Towers and big beams. Check your lease or HOA first; PRB-1 does not override private contracts.' },
  { id: 'portable', q: 'Emergency, go-bag, or camping', picks: [['jpole', 'The roll-up J-pole weighs ounces and needs no radials.', 'build-jpole'], ['efhw', 'One wire, one support, several bands.'], ['whips', 'Telescoping whip on the handheld for quick setups.']], skip: 'Heavy Yagis or big loops.' },
  { id: 'fox', q: 'Hunt a hidden transmitter (direction finding)', picks: [['yagi', 'A small handheld Yagi tells you which way the signal is strongest.'], ['quad', 'A small loop is another favorite for close-in hunting.']], skip: 'Omni antennas. They cannot tell you which direction anything is.' },
  { id: 'cheap', q: 'Spend as little as possible', picks: [['groundplane', 'About $10 for 2 meters.', 'build-groundplane'], ['dipole', 'About $20 for HF.', 'build-dipole'], ['jpole', 'About $15, rolls up in your pocket.', 'build-jpole']], skip: 'Anything with a rotator. That is where the money goes.' },
]
export function AntPicker() {
  const [g, setG] = useState(GOALS[0])
  return (
    <Lab title="Antenna picker" intro="Pick what you want to do." exam="T9A, T3A, T8B">
      <div className="presets">{GOALS.map((x) => <button key={x.id} className={`pb sm ${g.id === x.id ? 'on' : ''}`} onClick={() => setG(x)}>{x.q}</button>)}</div>
      <h4 className="pickhead">Best choices for: {g.q}</h4>
      <ol className="picks">
        {g.picks.map(([id, why, build], i) => (
          <li key={id}>
            <b>{i + 1}</b>
            <span><Link to={`/antennas/types?g=${id}`}>{id === 'whips' ? 'Mobile whip or telescoping whip' : id === 'efhw' ? 'End-fed half-wave' : id === 'logperiodic' ? 'Log-periodic' : id === 'magloop' ? 'Magnetic loop' : id === 'groundplane' ? 'Ground plane' : id === 'jpole' ? 'J-pole / Slim Jim' : id === 'satellite' ? 'Satellite notes' : id.charAt(0).toUpperCase() + id.slice(1)}</Link>. {why}
              {build && <> <Link className="pb sm on" to={`/antennas/${build}`}>Build it</Link></>}</span>
          </li>))}
      </ol>
      <p className="callout bad"><b>Skip:</b> {g.skip}</p>
    </Lab>
  )
}

/* ---------- Cut-length calculator ---------- */
const inch = (ft) => {
  const total = ft * 12
  if (total < 24) return `${fmt(total, 1)} in`
  const f = Math.floor(ft), i = (ft - f) * 12
  return `${f} ft ${fmt(i, 1)} in`
}
const PRE = [['10 m', 28.4], ['15 m (CW)', 21.1], ['40 m (CW)', 7.05], ['6 m', 52], ['2 m', 146.52], ['70 cm', 446]]
export function AntCalc({ initial }) {
  const [kind, setKind] = useState(initial || 'dipole')
  const [f, setF] = useState(initial === 'ground' || initial === 'jpole' ? 146.52 : 28.4)
  const [vf, setVf] = useState(0.91)
  const lam_in = 11811 / f
  const D = { total: 468 / f, leg: 234 / f }
  const G = { vert: 234 / f, radial: (234 / f) * 1.05 }
  const J = { stub: (0.25 * lam_in * vf) / 12, rad: (0.5 * lam_in * 0.95) / 12 }
  const diagram = {
    dipole: <svg viewBox="0 0 300 90"><line x1="20" y1="30" x2="280" y2="30" stroke="#ece3cb" strokeWidth="4" /><rect x="140" y="24" width="20" height="12" fill="#ffb43a" /><line x1="150" y1="36" x2="150" y2="80" stroke="#8fa398" strokeWidth="3" /><text x="80" y="20" className="svgs">leg {inch(D.leg)}</text><text x="200" y="20" className="svgs">leg {inch(D.leg)}</text><text x="158" y="76" className="svgs">coax + choke</text></svg>,
    ground: <svg viewBox="0 0 300 150"><line x1="150" y1="10" x2="150" y2="85" stroke="#ece3cb" strokeWidth="4" />{[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a], k) => <line key={k} x1="150" y1="85" x2={150 + a * 80} y2="130" stroke="#8fa398" strokeWidth="3" opacity={k > 1 ? 0.5 : 1} />)}<text x="160" y="40" className="svgs">vertical {inch(G.vert)}</text><text x="205" y="118" className="svgs">4 radials, {inch(G.radial)}</text><circle cx="150" cy="85" r="5" fill="#ffb43a" /></svg>,
    jpole: <svg viewBox="0 0 300 170"><line x1="130" y1="10" x2="130" y2="150" stroke="#ece3cb" strokeWidth="4" /><line x1="160" y1="100" x2="160" y2="150" stroke="#8fa398" strokeWidth="4" /><line x1="130" y1="150" x2="160" y2="150" stroke="#ffb43a" strokeWidth="4" /><circle cx="145" cy="132" r="4" fill="#e5432d" /><text x="172" y="60" className="svgs">radiator {inch(J.rad)}</text><text x="172" y="128" className="svgs">stub {inch(J.stub)}</text><text x="172" y="145" className="svgs">feed tap ~1.5 in above the short</text></svg>,
  }
  return (
    <Lab title="Cut-length calculator" intro="Pick the antenna, pick your frequency. It gives the lengths. Cut a little long, then trim while you watch the SWR meter." exam="T3B06, T9A05, T9A08">
      <div className="seg-toggle">{[['dipole', 'Dipole'], ['ground', 'Ground plane'], ['jpole', 'J-pole (ladder line)']].map(([k, n]) => <button key={k} className={`pb sm ${kind === k ? 'on' : ''}`} onClick={() => setKind(k)}>{n}</button>)}</div>
      <div className="presets">{PRE.map(([n, v]) => <button key={n} className="pb sm" onClick={() => setF(v)}>{n} {v}</button>)}</div>
      <Slider label="Frequency" value={f} set={setF} min={1.8} max={450} step={0.05} unit="MHz" />
      {kind === 'jpole' && <label className="sl"><span>Line velocity factor</span><select value={vf} onChange={(e) => setVf(+e.target.value)}><option value={0.91}>450 Ω window line (0.91)</option><option value={0.82}>300 Ω twin-lead (0.82)</option><option value={0.95}>Spaced wire in air (0.95)</option></select></label>}
      <div className="lab-grid">
        <div className="calcsvg">{diagram[kind]}</div>
        <dl className="readouts">
          {kind === 'dipole' && <><div><dt>Total length</dt><dd>{inch(D.total)}</dd></div><div><dt>Each leg</dt><dd>{inch(D.leg)}</dd></div><div><dt>Cut each leg (5% long)</dt><dd>{inch(D.leg * 1.05)}</dd></div></>}
          {kind === 'ground' && <><div><dt>Vertical element</dt><dd>{inch(G.vert)}</dd></div><div><dt>Cut it</dt><dd>{inch(G.vert + 0.25 / 12)}</dd></div><div><dt>Each radial (4)</dt><dd>{inch(G.radial)}</dd></div></>}
          {kind === 'jpole' && <><div><dt>Stub (both wires)</dt><dd>{inch(J.stub)}</dd></div><div><dt>Radiator (one wire)</dt><dd>{inch(J.rad)}</dd></div><div><dt>Cut the line to</dt><dd>{inch(J.stub + J.rad + 3 / 12)}</dd></div></>}
        </dl>
      </div>
      <p className="small">{kind === 'dipole' ? 'Total length = 468 ÷ MHz feet. Each leg is half. Start 5% long, fold the ends back, and trim.' : kind === 'ground' ? 'Vertical = 234 ÷ MHz feet. Radials a little longer and drooped about 45 degrees.' : 'Stub = 0.25 wavelength × velocity factor; radiator = 0.5 wavelength × 0.95. Starting values: every build trims a bit differently.'}</p>
    </Lab>
  )
}

/* ---------- Trim the dipole ---------- */
export function TrimLab() {
  const target = 28.4
  const [leg, setLeg] = useState(104) // inches, deliberately long, like a first cut
  const f0 = 234 / (leg / 12)
  const swr = (f) => {
    const X = 580 * (f / f0 - f0 / f), R = 55
    const g = Math.sqrt(((R - 50) ** 2 + X * X) / ((R + 50) ** 2 + X * X))
    return (1 + g) / (1 - g)
  }
  const lo = 27.6, hi = 29.2, W = 520, H = 170
  const X = (f) => ((f - lo) / (hi - lo)) * W
  const Y = (v) => H - ((Math.min(v, 6) - 1) / 5) * (H - 28) - 8
  const pts = Array.from({ length: 161 }, (_, i) => { const f = lo + ((hi - lo) * i) / 160; return `${X(f)},${Y(swr(f))}` }).join(' ')
  const at = swr(target)
  const hint = Math.abs(f0 - target) < 0.04 ? 'Resonant right on target. Lock it down.' : f0 < target ? `Resonance is at ${fmt(f0, 2)} MHz, below your target: the antenna is too long. Shorten each leg about ${fmt(Math.abs(leg - (234 / target) * 12), 1)} inches.` : `Resonance is at ${fmt(f0, 2)} MHz, above your target: too short. Lengthen each leg about ${fmt(Math.abs(leg - (234 / target) * 12), 1)} inches.`
  return (
    <Lab title="Trim the dipole" intro="Your first cut is deliberately long. Slide each leg shorter and watch where the SWR dip lands. The green strip is the Technician 10 meter voice segment." exam="T7C04, T7C06, T9A05">
      <Slider label="Length of each leg" value={leg} set={setLeg} min={92} max={110} step={0.25} unit="in" />
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="trim" role="img" aria-label="SWR against frequency">
        <rect x={X(28.3)} y="0" width={X(28.5) - X(28.3)} height={H} fill="#2c4a1d" opacity=".7" />
        {[1, 2, 3, 6].map((v) => <g key={v}><line x1="0" x2={W} y1={Y(v)} y2={Y(v)} stroke="#34453d" /><text x="4" y={Y(v) - 3} className="svgs">{v}:1</text></g>)}
        {[27.8, 28.0, 28.2, 28.4, 28.6, 28.8, 29.0].map((f) => <text key={f} x={X(f)} y={H + 16} textAnchor="middle" className="svgs">{f}</text>)}
        <line x1={X(target)} x2={X(target)} y1="0" y2={H} stroke="#e5432d" strokeDasharray="4 4" />
        <polyline points={pts} fill="none" stroke="#ffb43a" strokeWidth="3" />
      </svg>
      <dl className="readouts four"><div><dt>Leg length</dt><dd>{inch(leg / 12)}</dd></div><div><dt>Resonates at</dt><dd>{fmt(f0, 2)} MHz</dd></div><div><dt>SWR at 28.4</dt><dd>{fmt(at, 2)} : 1</dd></div></dl>
      <p className={`callout ${at < 1.5 ? 'good' : ''}`}>{hint}</p>
      <p className="small">Simplified model of a wire dipole. Real antennas shift with height, nearby metal and wire type, which is exactly why you trim against a meter.</p>
    </Lab>
  )
}

/* ---------- Radiation patterns ---------- */
const PAT = {
  Dipole: { f: (p) => Math.abs(Math.cos(p)), gain: '2.15 dBi', note: 'Figure-eight. Strongest broadside to the wire (up and down in this top view), nulls off the ends. Exam: T9A10.' },
  Vertical: { f: () => 1, gain: '0 to 3 dBi', note: 'Omnidirectional in the horizontal plane: the same in every compass direction. Perfect for repeaters.' },
  Yagi: { f: (p) => 0.07 + 0.93 * ((1 + Math.cos(p)) / 2) ** 4, gain: 'about 6 to 12 dBi', note: 'A forward lobe with a small tail behind. More elements, a narrower lobe, more gain. Has to be aimed.' },
  Loop: { f: (p) => Math.abs(Math.cos(p)), gain: 'about 1 to 2 dBi', note: 'A small loop has a figure-eight too, with deep nulls off its sides. Handy for rejecting local noise and for direction finding.' },
}
export function PatternsLab() {
  const [k, setK] = useState('Dipole')
  const R = 86
  const pts = Array.from({ length: 121 }, (_, i) => { const p = (i / 120) * Math.PI * 2; const r = PAT[k].f(p); return `${110 + R * r * Math.sin(p)},${110 - R * r * Math.cos(p)}` }).join(' ')
  return (
    <Lab title="Radiation patterns" intro="Top-down view. The antenna sits in the middle. The bigger the shape in a direction, the stronger the signal that way." exam="T9A01, T9A10, T9A11">
      <div className="seg-toggle">{Object.keys(PAT).map((n) => <button key={n} className={`pb sm ${k === n ? 'on' : ''}`} onClick={() => setK(n)}>{n}</button>)}</div>
      <div className="lab-grid">
        <svg viewBox="0 0 220 220" className="polarplot" role="img" aria-label={`${k} pattern`}>
          {[0.33, 0.66, 1].map((r) => <circle key={r} cx="110" cy="110" r={R * r} fill="none" stroke="#34453d" />)}
          <line x1="110" y1="14" x2="110" y2="206" stroke="#34453d" /><line x1="14" y1="110" x2="206" y2="110" stroke="#34453d" />
          <polygon points={pts} fill="#ffb43a" fillOpacity=".25" stroke="#ffb43a" strokeWidth="3" />
          <circle cx="110" cy="110" r="4" fill="#ece3cb" /><text x="112" y="12" className="svgs">N</text>
        </svg>
        <div className="lab-side"><dl className="readouts"><div><dt>Typical gain</dt><dd>{PAT[k].gain}</dd></div></dl><p className="callout">{PAT[k].note}</p></div>
      </div>
    </Lab>
  )
}

export const LABS = { ohm: OhmLab, db: DbLab, wave: WaveLab, polar: PolarLab, sky: SkyLab, swr: SwrLab, mod: ModLab, repeater: RepeaterLab, symbols: SymbolLab, antpicker: AntPicker, antcalc: AntCalc, trim: TrimLab, patterns: PatternsLab }
