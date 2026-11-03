import { useMemo, useState } from 'react'
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

export const LABS = { ohm: OhmLab, db: DbLab, wave: WaveLab, polar: PolarLab, sky: SkyLab, swr: SwrLab, mod: ModLab, repeater: RepeaterLab, symbols: SymbolLab }
