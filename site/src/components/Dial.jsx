import { useEffect, useMemo, useRef, useState } from 'react'
import SevenSeg from './SevenSeg'
import Knob from './Knob'
import Waterfall from './Waterfall'
import { BANDS, describe } from '../lib/bandplan'
import { Receiver } from '../lib/audio'
import { useStore, setClass, completeQuest } from '../lib/store'

const STEPS = [[10, '10 Hz'], [100, '100 Hz'], [1000, '1 kHz'], [10000, '10 kHz'], [100000, '100 kHz'], [1000000, '1 MHz']]
const SPANS = [[6, '6 kHz'], [24, '24 kHz'], [96, '96 kHz'], [500, '500 kHz']]
const MIN = 530000, MAX = 470000000

const pad = (n, w, c = '0') => String(n).padStart(w, c)
export function formatHz(hz) {
  return `${pad(Math.floor(hz / 1e6), 3, ' ')}.${pad(Math.floor((hz % 1e6) / 1000), 3)}.${pad(Math.round((hz % 1000) / 10), 2)}`
}

// Each quest is tied to a real exam fact, so tuning around doubles as studying.
const QUESTS = [
  { id: 'calling2m', text: 'Find the 2 meter national FM calling frequency.', ref: 'T2A02', test: (m) => Math.abs(m - 146.52) < 0.0015, go: 146.52 },
  { id: 'techvoice', text: 'Find the only HF segment where a Technician may use voice.', ref: 'T1B01', test: (m) => m >= 28.3 && m < 28.5, go: 28.4 },
  { id: 'beacons', text: 'Land inside the 10 meter beacon sub-band.', ref: 'T1A06', test: (m) => m >= 28.2 && m < 28.3, go: 28.2005 },
  { id: 'ft8', text: 'Tune the 20 meter FT8 watering hole.', ref: 'FT8', test: (m) => Math.abs(m - 14.074) < 0.002, go: 14.074 },
  { id: 'cw6', text: 'Find the CW-only slice of 6 meters.', ref: 'T1B07', test: (m) => m >= 50.0 && m < 50.1, go: 50.05 },
  { id: 'thirty', text: 'Find the band where phone and images are prohibited.', ref: 'G1A02', test: (m) => m >= 10.1 && m <= 10.15, go: 10.12 },
  { id: 'extra40', text: 'Park on 40 meters where only Extra class may use phone.', ref: 'G1A05', test: (m) => m >= 7.125 && m < 7.175, go: 7.15 },
  { id: 'calling70', text: 'Find the 70 centimeter FM calling frequency.', ref: 'T2A02', test: (m) => Math.abs(m - 446.0) < 0.0015, go: 446.0 },
]

export default function Dial() {
  const { cls, quests } = useStore()
  const [hz, setHz] = useState(14250000)
  const [step, setStep] = useState(1000)
  const [span, setSpan] = useState(24)
  const [listening, setListening] = useState(false)
  const [vol, setVol] = useState(0.8)
  const rx = useRef(null)
  const mhz = hz / 1e6
  const info = useMemo(() => describe(mhz, cls), [mhz, cls])
  const reduced = useMemo(() => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches, [])

  const tune = (v) => setHz(Math.min(MAX, Math.max(MIN, Math.round(v / 10) * 10)))
  const stepBy = (n) => setHz((h) => Math.min(MAX, Math.max(MIN, Math.round((h + n * step) / 10) * 10)))

  useEffect(() => { rx.current?.tune(mhz) }, [mhz])
  useEffect(() => () => rx.current?.stop(), [])
  useEffect(() => { rx.current?.setVolume(vol) }, [vol])
  useEffect(() => { for (const q of QUESTS) if (q.test(mhz)) completeQuest(q.id) }, [mhz])

  async function toggleListen() {
    if (listening) { rx.current.stop(); setListening(false); return }
    rx.current = new Receiver(); rx.current.tune(mhz); rx.current.setVolume(vol)
    await rx.current.start(); setListening(true)
  }
  const done = QUESTS.filter((q) => quests[q.id]).length
  const label = info.band ? info.band.name : 'No ham band'
  const modeText = info.seg ? (cls === 'T' && info.seg.tech ? `${info.seg.mode} (Tech: ${info.seg.tech})` : info.seg.mode) : '—'

  return (
    <section className="rack dial" aria-label="Transceiver simulator">
      <div className="dial-head">
        <div className="freq">
          <SevenSeg text={formatHz(hz)} label={`${mhz.toFixed(4)} megahertz`} />
          <span className="unit">MHz</span>
        </div>
        <div className="readout" aria-live="polite">
          <div className="band">{label}</div>
          <div className="segmode">{modeText}</div>
          <div className="lamps" role="group" aria-label="Who may transmit on this frequency">
            {[['T', 'Technician'], ['G', 'General'], ['E', 'Extra']].map(([k, n]) => (
              <span key={k} className={`lamp ${info.allowed[k] ? 'lit' : ''}`}><i />{n}</span>
            ))}
          </div>
          <p className="note">{info.note}</p>
          {info.nearEdge && <p className="warn">Close to a segment edge. Your signal has width, so stay inside by a margin (T1B09).</p>}
        </div>
      </div>

      <Waterfall centerHz={hz} spanKHz={span} cls={cls} onTuneHz={tune} still={reduced} />

      <div className="controls">
        <div className="knob-col">
          <Knob onStep={stepBy} valueNow={Math.round(mhz * 1e4) / 1e4} min={0.53} max={470} valueText={`${mhz.toFixed(4)} megahertz`} />
          <p className="hint">Drag the knob in circles, scroll over it, or use arrow keys. Click the waterfall to jump to a signal.</p>
        </div>

        <div className="ctl-col">
          <div className="ctl-group">
            <span className="ctl-label">Tuning step</span>
            <div className="btnrow">
              {STEPS.map(([v, n]) => <button key={v} className={`pb ${step === v ? 'on' : ''}`} onClick={() => setStep(v)}>{n}</button>)}
            </div>
          </div>
          <div className="ctl-group">
            <span className="ctl-label">Waterfall width</span>
            <div className="btnrow">
              {SPANS.map(([v, n]) => <button key={v} className={`pb ${span === v ? 'on' : ''}`} onClick={() => setSpan(v)}>{n}</button>)}
            </div>
          </div>
          <div className="ctl-group">
            <span className="ctl-label">I hold a</span>
            <div className="btnrow">
              {[['T', 'Technician'], ['G', 'General'], ['E', 'Extra']].map(([k, n]) => (
                <button key={k} className={`pb ${cls === k ? 'on' : ''}`} onClick={() => setClass(k)}>{n}</button>
              ))}
            </div>
          </div>
          <div className="ctl-group listen">
            <button className={`pb big ${listening ? 'on' : ''}`} onClick={toggleListen} aria-pressed={listening}>
              {listening ? 'Receiver on' : 'Turn on audio'}
            </button>
            <label className="vol">Volume
              <input type="range" min="0" max="1" step="0.05" value={vol} onChange={(e) => setVol(+e.target.value)} />
            </label>
          </div>
        </div>

        <div className="bands-col">
          <span className="ctl-label">Jump to a band</span>
          <div className="bandgrid">
            {BANDS.map((b) => (
              <button key={b.name} className={`pb sm ${info.band?.name === b.name ? 'on' : ''}`} onClick={() => tune(b.jump * 1e6)}>{b.name}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="quests">
        <div className="quests-head">
          <h3>Tuning quests</h3>
          <span>{done} of {QUESTS.length} found</span>
        </div>
        <ul>
          {QUESTS.map((q) => (
            <li key={q.id} className={quests[q.id] ? 'done' : ''}>
              <i className="tick" aria-hidden="true" />
              <span className="qtext">{q.text} <em>{q.ref}</em></span>
              <button className="link" onClick={() => tune(q.go * 1e6)}>Show me</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
