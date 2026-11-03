import { Link } from 'react-router-dom'
import SMeter from '../components/SMeter'
import { CERT_LIST, SUB_ORDER } from '../lib/certs'
import { usePool } from '../lib/usePool'
import { useStore, stats, resetAll } from '../lib/store'

function CertProgress({ c }) {
  const { cards, exams } = useStore()
  const pool = usePool(c.key)
  if (!pool) return <article className="rack progress-card"><h2>{c.name}</h2><p>Loading…</p></article>
  const s = stats(pool.questions, cards[c.key])
  const last = (exams[c.key] || [])[0]
  return (
    <article className="rack progress-card">
      <div className="pc-head">
        <div><h2>{c.name}</h2>
          <p>{s.seen} of {s.total} seen · {s.mastered} mastered{last ? ` · last exam ${last.score}/${last.total}` : ''}</p></div>
        <SMeter value={s.mastered / s.total} label="mastered" />
      </div>
      <ul className="subbars">
        {SUB_ORDER(c.key).map((k) => {
          const t = stats(pool.bySub[k] || [], cards[c.key])
          return (
            <li key={k}>
              <Link to={`/drill?sub=${k}`} title={`Drill ${k}`}><strong>{k}</strong> {c.subs[k]}</Link>
              <span className="bar"><i className="seen" style={{ width: `${(t.seen / t.total) * 100}%` }} /><i style={{ width: `${(t.mastered / t.total) * 100}%` }} /></span>
              <span className="n">{t.mastered}/{t.total}</span>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export default function Progress() {
  return (
    <div className="page progress">
      <header className="pagehead">
        <h1>Progress</h1>
        <p>Mastered means you answered it right three times in a row. Your progress lives in this browser only, nothing is uploaded.</p>
      </header>
      {CERT_LIST.map((c) => <CertProgress key={c.key} c={c} />)}
      <button className="link danger" onClick={() => window.confirm('Erase all progress in this browser?') && resetAll()}>Erase my progress</button>
    </div>
  )
}
