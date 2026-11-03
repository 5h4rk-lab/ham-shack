import { Link } from 'react-router-dom'
import Dial from '../components/Dial'
import { CERT_LIST } from '../lib/certs'
import { setCert } from '../lib/store'
import ImageFig from '../components/ImageFig'

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <div>
          <h1>Tune the dial.<br />Learn the band plan.<br />Pass the exam.</h1>
          <p className="lede">
            This is a working transceiver front panel. Turn the knob and the display tells you what band you are on and who
            is allowed to transmit there. The same facts show up on the Technician, General, and Extra exams.
          </p>
        </div>
        <div className="hero-photo"><ImageFig name="shack" caption="A ham shack at night. Yours will look like this soon." /></div>
      </section>

      <Dial />

      <section className="certs" aria-label="Choose a license class">
        {CERT_LIST.map((c, i) => (
          <article key={c.key} className="rack cert">
            <h2>{c.name}</h2>
            <p>{c.blurb}</p>
            <dl>
              <div><dt>Exam</dt><dd>{c.exam} questions, {c.pass} to pass</dd></div>
              <div><dt>Pool</dt><dd>{c.pool}</dd></div>
            </dl>
            <div className="btnrow">
              <Link className="pb on" to="/learn" onClick={() => setCert(c.key)}>{i === 0 ? 'Start here' : 'Study'}</Link>
              <Link className="pb" to="/drill" onClick={() => setCert(c.key)}>Drill</Link>
              <Link className="pb" to="/exam" onClick={() => setCert(c.key)}>Mock exam</Link>
            </div>
          </article>
        ))}
      </section>

      <section className="how">
        <h2>How the pieces fit</h2>
        <ol>
          <li><strong>Learn</strong> one subelement at a time with the study guide. Short, and tied to the real question pool.</li>
          <li><strong>Drill</strong> questions. Misses come back sooner, so you spend time where you are weak.</li>
          <li><strong>Mock exam</strong> builds a test exactly like the real one: one question from every group.</li>
          <li><strong>Lab</strong> has a Morse trainer and calculators for Ohm's law, wavelength, and decibels.</li>
        </ol>
      </section>
    </div>
  )
}
