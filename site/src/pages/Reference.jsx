import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { BANDS, SEGMENTS, RANK } from '../lib/bandplan'
import ImageFig from '../components/ImageFig'

const QCODES = [['QRM', 'I am being interfered with (by other stations)'], ['QRN', 'I am troubled by static (natural noise)'], ['QRO', 'Increase power'], ['QRP', 'Reduce power (low power operation)'], ['QRL', 'The frequency is in use'], ['QRT', 'Stop sending / shutting down'], ['QRV', 'I am ready'], ['QRZ', 'Who is calling me?'], ['QSB', 'Your signal is fading'], ['QSL', 'I acknowledge receipt / confirm'], ['QSO', 'A contact between two stations'], ['QSY', 'Change frequency'], ['QTH', 'My location is …']]
const PHON = 'Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu'.split(' ')
const GLOSS = [
  ['Amateur Extra', 'The top US license class. Every privilege on every amateur band.'], ['ARES', 'Amateur Radio Emergency Service. Volunteers who register their skills and gear for emergencies. No government certification needed.'],
  ['APRS', 'Automatic Packet Reporting System. Shares position, weather, messages and telemetry on a map, on 144.390 MHz in North America.'], ['Band plan', 'A voluntary agreement about which modes and activities use which part of a band. It goes beyond what the FCC requires.'],
  ['Beacon', 'An automatic station that sends a signal so others can judge propagation. HF beacons live at 28.200 to 28.300 MHz.'], ['CTCSS', 'Continuous Tone-Coded Squelch System. A sub-audible tone sent with your voice that opens a repeater.'],
  ['CW', 'Continuous wave. Morse code. The narrowest mode, about 150 Hz.'], ['Control operator', 'The licensed person designated by the station licensee who is responsible for the station while it transmits.'],
  ['dB (decibel)', 'A ratio of power. +3 dB is double, +6 dB is four times, +10 dB is ten times.'], ['Deviation', 'How far an FM signal swings away from its center frequency when you talk.'],
  ['Dipole', 'A simple antenna of two equal elements, each a quarter wave. About 468 ÷ f(MHz) feet in total.'], ['Doppler shift', 'A change in received frequency caused by relative motion, like a satellite passing overhead.'],
  ['DTMF', 'Dual-tone multi-frequency. The touch-tone pad sounds. Two tones at once.'], ['Duty cycle', 'The percentage of time a transmitter is actually transmitting. It sets average RF exposure.'],
  ['DX', 'Distance. A far-away station, usually in another country.'], ['Elmer', 'A ham mentor who helps newcomers get started. Every ham remembers theirs.'],
  ['EME', 'Earth-Moon-Earth. Bouncing signals off the Moon.'], ['FCC', 'Federal Communications Commission. Regulates and enforces the Amateur Radio Service in the US.'],
  ['Feed line', 'The cable (usually 50 Ω coax) that carries RF from the radio to the antenna.'], ['FM', 'Frequency modulation. The voice mode of repeaters and handhelds. 10 to 15 kHz wide.'],
  ['FRN', 'FCC Registration Number. Free, and you need one before you take the exam.'], ['FT8', 'A digital mode for very weak signals. 15-second exchanges, part of the WSJT-X software.'],
  ['General', 'The middle US license class. Much of every HF band.'], ['Grid locator', 'A letter-number code for a location on Earth (Maidenhead system), like FN31.'],
  ['Ham', 'An amateur radio operator.'], ['HF', 'High frequency, 3 to 30 MHz. The bands for worldwide skywave contacts.'],
  ['Impedance', 'Opposition to AC current flow, in ohms. Radios and coax are normally 50 Ω.'], ['Ionosphere', 'Layers of charged gas high up that bend (refract) HF radio waves back to Earth.'],
  ['Line of sight', 'Straight-line travel. The usual path for VHF and UHF signals.'], ['Multipath', 'A signal arriving by several paths and adding or cancelling. It causes fading and "picket fencing".'],
  ['Net', 'A scheduled on-the-air meeting of stations, run by a net control station.'], ['Offset', 'The difference between a repeater\'s transmit and receive frequencies. 600 kHz on 2 m, 5 MHz on 70 cm.'],
  ['PEP', 'Peak envelope power. How FCC power limits are measured.'], ['PTT', 'Push to talk. Switches the radio from receive to transmit.'],
  ['Polarization', 'The orientation of a radio wave\'s electric field: vertical or horizontal.'], ['RACES', 'Radio Amateur Civil Emergency Service. A Part 97 service for civil defense communications. Needs civil defense enrollment.'],
  ['Repeater', 'A station that receives on one frequency and retransmits on another, extending range for handhelds and mobiles.'], ['RIT', 'Receiver incremental tuning. Shifts your receive frequency without moving your transmit frequency.'],
  ['SSB', 'Single sideband. A voice mode about 3 kHz wide that is efficient for weak-signal work.'], ['Simplex', 'Talking directly, radio to radio, on one frequency.'],
  ['Skip', 'HF radio waves being refracted back to Earth by the ionosphere.'], ['Sporadic E', 'Random clouds of ionization in the E layer that bounce 10 m, 6 m and 2 m signals far beyond the horizon.'],
  ['SWR', 'Standing wave ratio. A measure of how well the antenna is matched to the feed line. 1:1 is perfect.'], ['Squelch', 'A control that mutes the receiver speaker when there is no signal.'],
  ['Technician', 'The entry US license class. All VHF/UHF, plus limited HF.'], ['Third-party communication', 'A message from a control operator to another amateur on behalf of someone else.'],
  ['Transceiver', 'A transmitter and receiver in one box.'], ['UHF', 'Ultra high frequency, 300 MHz to 3 GHz.'], ['VE', 'Volunteer Examiner. Gives license exams in teams of three.'],
  ['VFO', 'Variable frequency oscillator. The circuit and knob that sets your frequency.'], ['VHF', 'Very high frequency, 30 to 300 MHz.'], ['Yagi', 'A directional beam antenna with a driven element, a reflector and directors.'],
  ['73', 'Best regards, a traditional ham sign-off.'],
]
const FORM = [['Ohm\'s law', 'E = I × R   I = E ÷ R   R = E ÷ I'], ['Power', 'P = I × E   P = I² × R   P = E² ÷ R'], ['Wavelength', 'λ (m) = 300 ÷ f (MHz)'], ['Half-wave dipole', 'length (ft) = 468 ÷ f (MHz)'], ['Quarter wave', 'length (ft) = 234 ÷ f (MHz)'], ['Decibels (power)', '+3 dB ×2 · +6 dB ×4 · +10 dB ×10 (negative divides)'], ['Battery run time', 'hours = amp-hours ÷ average current (A)'], ['Duty cycle', 'power density limit rises as duty cycle falls (50% duty = 2× the allowance)']]
const PREFIX = [['pico', 'p', '10⁻¹²'], ['nano', 'n', '10⁻⁹'], ['micro', 'µ', '10⁻⁶'], ['milli', 'm', '10⁻³'], ['kilo', 'k', '10³'], ['mega', 'M', '10⁶'], ['giga', 'G', '10⁹']]

function BandChart() {
  return (
    <div className="bandchart">
      <p className="legend"><i className="t" /> Technician and up <i className="g" /> General and up <i className="e" /> Extra only <small>Bars show US privileges by frequency, left to right across each band.</small></p>
      {BANDS.map((b) => (
        <div key={b.name} className="bandrow">
          <div className="bn"><b>{b.name}</b><small>{b.lo}–{b.hi} MHz</small></div>
          <div className="bbar">
            {SEGMENTS.filter((s) => s.hi > b.lo && s.lo < b.hi).map((s, i) => {
              const L = Math.max(s.lo, b.lo), H = Math.min(s.hi, b.hi)
              return <i key={i} className={['', 't', 'g', 'e'][RANK[s.min]]} title={`${s.lo}–${s.hi} MHz: ${s.mode}${s.tech ? ` (Tech: ${s.tech})` : ''}`}
                style={{ left: `${((L - b.lo) / (b.hi - b.lo)) * 100}%`, width: `${Math.max(0.8, ((H - L) / (b.hi - b.lo)) * 100)}%` }} />
            })}
          </div>
        </div>
      ))}
      <p className="small">Power: 1500 W PEP, except 200 W on 30 m and for Technicians on HF. Technician HF: CW on 80, 40 and 15 m; CW, data and SSB on 10 m (voice only 28.300–28.500 MHz).</p>
      <ImageFig name="spectrum" caption="A vintage poster of the electromagnetic spectrum. Ham bands are a thin slice of it." wide />
    </div>
  )
}

export default function Reference() {
  const { tab = 'bands' } = useParams()
  const [q, setQ] = useState('')
  const gl = useMemo(() => GLOSS.filter(([t, d]) => (t + d).toLowerCase().includes(q.toLowerCase())).sort((a, b) => a[0].localeCompare(b[0])), [q])
  const TABS = [['bands', 'Band chart'], ['q', 'Q codes'], ['phonetic', 'Phonetic alphabet'], ['formulas', 'Formulas'], ['glossary', 'Glossary']]
  return (
    <div className="page ref">
      <header className="pagehead"><h1>Reference</h1><p>For revision and for the shack wall. Everything here is on one screen, nothing to click through.</p></header>
      <div className="toolbar">{TABS.map(([k, n]) => <NavLink key={k} to={`/ref/${k}`} className={`pb ${tab === k ? 'on' : ''}`}>{n}</NavLink>)}</div>
      <section className="rack toolpanel">
        {tab === 'bands' && <BandChart />}
        {tab === 'q' && <table className="reftable"><thead><tr><th>Code</th><th>Meaning</th></tr></thead><tbody>{QCODES.map(([c, m]) => <tr key={c}><td><b>{c}</b></td><td>{m}</td></tr>)}</tbody></table>}
        {tab === 'phonetic' && <div className="phongrid">{PHON.map((w) => <div key={w}><b>{w[0]}</b><span>{w}</span></div>)}</div>}
        {tab === 'formulas' && <>
          <table className="reftable"><thead><tr><th>What</th><th>Formula</th></tr></thead><tbody>{FORM.map(([a, b]) => <tr key={a}><td>{a}</td><td className="mono">{b}</td></tr>)}</tbody></table>
          <h3>Metric prefixes</h3>
          <table className="reftable"><thead><tr><th>Prefix</th><th>Symbol</th><th>Times</th></tr></thead><tbody>{PREFIX.map(([a, b, c]) => <tr key={a}><td>{a}</td><td className="mono">{b}</td><td className="mono">{c}</td></tr>)}</tbody></table></>}
        {tab === 'glossary' && <>
          <label className="one">Search the glossary<input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Try squelch, SWR, Elmer…" /></label>
          <dl className="gloss">{gl.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}{!gl.length && <p>No match. Try another word.</p>}</dl></>}
      </section>
    </div>
  )
}
