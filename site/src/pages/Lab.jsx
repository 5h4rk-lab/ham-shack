import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { morseTimeline, MORSE } from '../lib/signals'
import { playMorse } from '../lib/audio'
import { describe } from '../lib/bandplan'

const KOCH = 'KMRSUAPTLOWI.NJEF0Y,VG5/Q9ZH38B?427C1D6X'
const PHONETIC = { A: 'Alfa', B: 'Bravo', C: 'Charlie', D: 'Delta', E: 'Echo', F: 'Foxtrot', G: 'Golf', H: 'Hotel', I: 'India', J: 'Juliett', K: 'Kilo', L: 'Lima', M: 'Mike', N: 'November', O: 'Oscar', P: 'Papa', Q: 'Quebec', R: 'Romeo', S: 'Sierra', T: 'Tango', U: 'Uniform', V: 'Victor', W: 'Whiskey', X: 'X-ray', Y: 'Yankee', Z: 'Zulu' }

let ctxShared
const audio = () => (ctxShared ||= new (window.AudioContext || window.webkitAudioContext)())

function Morse() {
  const [wpm, setWpm] = useState(15)
  const [level, setLevel] = useState(2)
  const [pitch, setPitch] = useState(600)
  const [target, setTarget] = useState('')
  const [guess, setGuess] = useState('')
  const [score, setScore] = useState({ right: 0, total: 0 })
  const [shown, setShown] = useState(false)
  const [free, setFree] = useState('CQ CQ DE N0CALL K')
  const chars = KOCH.slice(0, level)

  const play = (text) => {
    const ctx = audio(); ctx.resume()
    return playMorse(ctx, morseTimeline(text), 1.2 / wpm, pitch)
  }
  const newGroup = () => {
    const g = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
    setTarget(g); setGuess(''); setShown(false); play(g)
  }
  const check = (e) => {
    e.preventDefault(); if (!target) return
    const ok = guess.toUpperCase().replace(/\s/g, '') === target
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 })); setShown(true)
  }
  return (
    <div className="tool">
      <p>Morse is not on the Technician exam, but it is how hams got started and it gets you into the Technician HF CW segments. This trainer uses the Koch method: begin with two characters at full speed, add one at a time once you copy 90 percent.</p>
      <div className="fields">
        <label>Speed <b>{wpm} wpm</b><input type="range" min="5" max="35" value={wpm} onChange={(e) => setWpm(+e.target.value)} /></label>
        <label>Pitch <b>{pitch} Hz</b><input type="range" min="400" max="900" step="25" value={pitch} onChange={(e) => setPitch(+e.target.value)} /></label>
        <label>Characters learned <b>{level}</b><input type="range" min="2" max={KOCH.length} value={level} onChange={(e) => setLevel(+e.target.value)} /></label>
      </div>
      <p className="chars" aria-label="Characters in play">{chars.split('').map((c) => <span key={c}>{c}</span>)}</p>
      <form onSubmit={check} className="copy">
        <button type="button" className="pb on" onClick={newGroup}>{target ? 'Next group' : 'Play a group of five'}</button>
        <button type="button" className="pb" disabled={!target} onClick={() => play(target)}>Repeat</button>
        <input value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Type what you heard" aria-label="Your copy" autoComplete="off" spellCheck="false" disabled={!target} />
        <button className="pb" disabled={!target || shown}>Check</button>
      </form>
      {shown && <p className={`verdict ${guess.toUpperCase().replace(/\s/g, '') === target ? 'ok' : 'bad'}`}>It was <strong className="mono">{target.split('').join(' ')}</strong> <span className="mono dits">{target.split('').map((c) => MORSE[c]).join('  ')}</span></p>}
      <p className="score">Groups right: {score.right} of {score.total}</p>
      <hr />
      <h3>Send any text</h3>
      <div className="copy">
        <input value={free} onChange={(e) => setFree(e.target.value)} aria-label="Text to play" />
        <button className="pb" onClick={() => play(free)}>Play</button>
      </div>
    </div>
  )
}

const num = (v) => (v === '' || isNaN(+v) || +v <= 0 ? null : +v)
function si(x) {
  if (x === null || !isFinite(x)) return '—'
  const a = Math.abs(x)
  const [d, p] = a >= 1e6 ? [1e6, 'M'] : a >= 1e3 ? [1e3, 'k'] : a >= 1 ? [1, ''] : a >= 1e-3 ? [1e-3, 'm'] : [1e-6, 'µ']
  return `${+(x / d).toPrecision(4)} ${p}`
}
function Ohm() {
  const [f, setF] = useState({ V: '12', I: '', R: '8', P: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const given = Object.entries(f).filter(([, v]) => num(v) !== null)
  let out = null
  if (given.length >= 2) {
    const [[a, av], [b, bv]] = given.slice(-2).map(([k, v]) => [k, num(v)])
    const k = [a, b].sort().join('')
    const x = { [a]: av, [b]: bv }
    const r = { IV: () => ({ R: x.V / x.I, P: x.V * x.I }), RV: () => ({ I: x.V / x.R, P: (x.V * x.V) / x.R }), IR: () => ({ V: x.I * x.R, P: x.I * x.I * x.R }),
      PV: () => ({ I: x.P / x.V, R: (x.V * x.V) / x.P }), IP: () => ({ V: x.P / x.I, R: x.P / (x.I * x.I) }), PR: () => ({ V: Math.sqrt(x.P * x.R), I: Math.sqrt(x.P / x.R) }) }[k]
    out = { ...x, ...r() }
  }
  const unit = { V: 'V', I: 'A', R: 'Ω', P: 'W' }
  const name = { V: 'Voltage (E)', I: 'Current (I)', R: 'Resistance (R)', P: 'Power (P)' }
  return (
    <div className="tool">
      <p>Fill in any two values. The newest two win. Try 12 V and 8 Ω, or 13.8 V and 10 A. Exam groups T5C and T5D are these formulas.</p>
      <div className="fields grid4">
        {Object.keys(f).map((k) => (
          <label key={k}>{name[k]}
            <input inputMode="decimal" value={f[k]} onChange={set(k)} placeholder="blank" />
          </label>
        ))}
      </div>
      <div className="results grid4">
        {['V', 'I', 'R', 'P'].map((k) => <div key={k} className={out ? 'res on' : 'res'}><span>{name[k]}</span><strong>{out ? `${si(out[k])}${unit[k]}` : '—'}</strong></div>)}
      </div>
      <pre className="triangle">{`  E = I × R       I = E ÷ R       R = E ÷ I\n  P = I × E       P = I² × R      P = E² ÷ R`}</pre>
    </div>
  )
}

function Wave() {
  const [mhz, setMhz] = useState('146.52')
  const f = num(mhz)
  const info = f ? describe(f, 'T') : null
  return (
    <div className="tool">
      <p>Enter a frequency. Band names are roughly the wavelength in meters (T3B06, T3B07), and a dipole is a half wave long (T9A).</p>
      <label className="one">Frequency in MHz<input inputMode="decimal" value={mhz} onChange={(e) => setMhz(e.target.value)} /></label>
      {f && (
        <div className="results grid4">
          <div className="res on"><span>Wavelength</span><strong>{(300 / f).toFixed(3)} m</strong></div>
          <div className="res on"><span>Half-wave dipole</span><strong>{(468 / f).toFixed(2)} ft</strong></div>
          <div className="res on"><span>Quarter-wave vertical</span><strong>{(234 / f).toFixed(2)} ft ({((234 / f) * 12).toFixed(1)} in)</strong></div>
          <div className="res on"><span>Band</span><strong>{info.band?.name || 'Not a ham band'}</strong></div>
        </div>
      )}
      <p className="note">Formulas: wavelength in meters = 300 ÷ MHz. Half-wave dipole in feet = 468 ÷ MHz. Quarter wave = 234 ÷ MHz. The quarter wave on 146 MHz comes out near 19 inches, which is exam question T9A08.</p>
    </div>
  )
}

function Decibel() {
  const [p1, setP1] = useState('5'), [p2, setP2] = useState('10'), [db, setDb] = useState('6')
  const a = num(p1), b = num(p2)
  const d = a && b ? 10 * Math.log10(b / a) : null
  const r = isNaN(+db) || db === '' ? null : 10 ** (+db / 10)
  return (
    <div className="tool">
      <p>Three numbers to know: <b>3 dB is double</b>, <b>6 dB is four times</b>, <b>10 dB is ten times</b>. Negative means the same factor in reverse (T5B09 to T5B11).</p>
      <h3>Two power levels to dB</h3>
      <div className="fields grid4">
        <label>Start (watts)<input inputMode="decimal" value={p1} onChange={(e) => setP1(e.target.value)} /></label>
        <label>End (watts)<input inputMode="decimal" value={p2} onChange={(e) => setP2(e.target.value)} /></label>
        <div className="res on"><span>Change</span><strong>{d === null ? '—' : `${d > 0 ? '+' : ''}${d.toFixed(2)} dB`}</strong></div>
      </div>
      <h3>dB to power ratio</h3>
      <div className="fields grid4">
        <label>Decibels<input inputMode="decimal" value={db} onChange={(e) => setDb(e.target.value)} /></label>
        <div className="res on"><span>Power ratio</span><strong>{r === null ? '—' : `× ${+r.toPrecision(4)}`}</strong></div>
      </div>
    </div>
  )
}

function Phonetic() {
  const letters = Object.keys(PHONETIC)
  const make = () => {
    const l = letters[Math.floor(Math.random() * 26)]
    const opts = new Set([l]); while (opts.size < 4) opts.add(letters[Math.floor(Math.random() * 26)])
    return { l, opts: [...opts].sort(() => Math.random() - 0.5) }
  }
  const [q, setQ] = useState(make)
  const [pick, setPick] = useState(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const choose = (o) => { if (pick) return; setPick(o); setScore((s) => ({ right: s.right + (o === q.l ? 1 : 0), total: s.total + 1 })) }
  return (
    <div className="tool">
      <p>The ITU phonetic alphabet is the one hams use on the air. Pick the word for the letter.</p>
      <div className="phon">
        <div className="bigletter">{q.l}</div>
        <div className="answers">
          {q.opts.map((o) => (
            <button key={o} className={`ans ${pick ? (o === q.l ? 'right' : o === pick ? 'wrong' : 'dim') : ''}`} onClick={() => choose(o)}><kbd>{o}</kbd><span>{PHONETIC[o]}</span></button>
          ))}
        </div>
      </div>
      <div className="copy"><button className="pb on" disabled={!pick} onClick={() => { setQ(make()); setPick(null) }}>Next letter</button><span className="score">Right: {score.right} of {score.total}</span></div>
    </div>
  )
}

const TOOLS = [['morse', 'Morse trainer', Morse], ['ohm', "Ohm's law", Ohm], ['wave', 'Wavelength and antennas', Wave], ['db', 'Decibels', Decibel], ['phonetic', 'Phonetic alphabet', Phonetic]]

export default function Lab() {
  const { tool = 'morse' } = useParams()
  const Tool = (TOOLS.find((t) => t[0] === tool) || TOOLS[0])[2]
  return (
    <div className="page lab">
      <header className="pagehead"><h1>Lab bench</h1><p>Small tools for the parts of the exam that are easier to feel than to read.</p></header>
      <div className="toolbar" role="tablist">
        {TOOLS.map(([k, n]) => <NavLink key={k} to={`/lab/${k}`} className={`pb ${k === tool ? 'on' : ''}`}>{n}</NavLink>)}
      </div>
      <section className="rack toolpanel"><Tool /></section>
    </div>
  )
}
