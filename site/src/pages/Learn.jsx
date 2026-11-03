import { Link, useParams } from 'react-router-dom'
import { useMemo } from 'react'
import CertTabs from '../components/CertTabs'
import { CERTS, SUB_ORDER } from '../lib/certs'
import { lessons } from '../lib/guides'
import { usePool } from '../lib/usePool'
import { useStore, stats } from '../lib/store'
import { figureUrl } from '../lib/pool'

const PDF = { technician: 'Technician-Study-Guide.pdf', general: 'General-Study-Guide.pdf', extra: 'Extra-Study-Guide.pdf' }

export default function Learn() {
  const { id } = useParams()
  const { cert, cards } = useStore()
  const c = CERTS[cert]
  const pool = usePool(cert)
  const all = useMemo(() => lessons(cert), [cert])
  const ordered = useMemo(() => {
    const map = Object.fromEntries(all.map((l) => [l.id, l]))
    return [map.start, ...SUB_ORDER(cert).map((s) => map[s]), map.cram].filter(Boolean)
  }, [all, cert])

  if (id) {
    const i = ordered.findIndex((l) => l.id === id)
    const lesson = ordered[i]
    if (!lesson) return <div className="page"><CertTabs /><p>No such lesson in this guide.</p><Link to="/learn" className="pb">Back to lessons</Link></div>
    const prev = ordered[i - 1], next = ordered[i + 1]
    const qs = pool?.bySub[id] || []
    const figs = [...new Set(qs.filter((q) => q.figure).map((q) => q.figure))]
    return (
      <div className="page lesson">
        <CertTabs />
        <nav className="crumbs"><Link to="/learn">All lessons</Link></nav>
        <h1>{lesson.id.length === 2 ? <span className="subid">{lesson.id}</span> : null}{lesson.title}</h1>
        <article className="prose" dangerouslySetInnerHTML={{ __html: lesson.html }} />
        {figs.length > 0 && (
          <section className="figs">
            <h2>Figures used in this subelement</h2>
            <p>Questions refer to these by name. Study the symbols.</p>
            <div className="figgrid">{figs.map((f) => <figure key={f}><img src={figureUrl(f)} alt={f} /><figcaption>{f.replace('.png', '').toUpperCase()}</figcaption></figure>)}</div>
          </section>
        )}
        <div className="lesson-actions">
          {lesson.id.length === 2 && <Link className="pb on big" to={`/drill?sub=${id}`}>Drill {id} ({qs.length || '…'} questions)</Link>}
          <div className="btnrow">
            {prev && <Link className="pb" to={`/learn/${prev.id}`}>Previous: {prev.id.length === 2 ? prev.id : prev.title}</Link>}
            {next && <Link className="pb" to={`/learn/${next.id}`}>Next: {next.id.length === 2 ? next.id : next.title}</Link>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page learn">
      <CertTabs />
      <header className="pagehead">
        <h1>{c.name} study guide</h1>
        <p>{c.exam} questions on the exam, {c.pass} to pass. One question comes from each group, so every subelement matters about as much as its size.</p>
        <a className="pb" href={`./guides/${PDF[cert]}`} download>Download the PDF</a>
      </header>
      <ul className="modules">
        {ordered.map((l) => {
          const sub = l.id.length === 2
          const list = pool?.bySub[l.id] || []
          const s = stats(list, cards[cert])
          return (
            <li key={l.id}>
              <Link to={`/learn/${l.id}`} className="rack module">
                <span className="mid">{sub ? l.id : l.id === 'start' ? '▶' : '★'}</span>
                <span className="mt">
                  <strong>{l.title}</strong>
                  <small>{sub ? `${l.examQs ?? ''} on the exam · ${list.length || '…'} in the pool` : l.id === 'start' ? 'How the exam works and a study plan' : 'One page to read the night before'}</small>
                </span>
                {sub && <span className="bar" aria-label={`${s.mastered} of ${s.total} mastered`}><i style={{ width: `${s.total ? (s.mastered / s.total) * 100 : 0}%` }} /></span>}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
