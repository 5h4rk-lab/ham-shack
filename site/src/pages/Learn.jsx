import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import CertTabs from '../components/CertTabs'
import TopicNav from '../components/TopicNav'
import GroupBar from '../components/GroupBar'
import ImageFig from '../components/ImageFig'
import { LABS } from '../components/labs'
import { CERTS, SUB_ORDER } from '../lib/certs'
import { lessons } from '../lib/guides'
import { usePool } from '../lib/usePool'
import { useStore, stats } from '../lib/store'
import { figureUrl } from '../lib/pool'

const PDF = { technician: 'Technician-Study-Guide.pdf', general: 'General-Study-Guide.pdf', extra: 'Extra-Study-Guide.pdf' }
const Notice = ({ cert }) => cert === 'technician' ? null : (
  <p className="notice"><b>Heads up:</b> the {cert === 'general' ? 'General' : 'Extra'} lessons are condensed summaries of the big ideas, not a full concept-by-concept course like Technician. The Drill and Mock exam cover <b>every</b> question in the pool, and each answer links to the rule behind it.</p>
)
const MARK = /<!--\s*(lab|img|group):([\w-]+)(?:\s+([^>]*?))?\s*-->/g

// Lesson HTML with <!-- lab:x -->, <!-- img:x caption -->, <!-- group:T1A --> turned into widgets.
function LessonBody({ cert, html }) {
  const out = []
  let last = 0, m, n = 0
  MARK.lastIndex = 0
  while ((m = MARK.exec(html))) {
    if (m.index > last) out.push(<div key={n++} className="prose" dangerouslySetInnerHTML={{ __html: html.slice(last, m.index) }} />)
    const [, kind, name, extra] = m
    if (kind === 'lab') { const L = LABS[name]; if (L) out.push(<L key={n++} />) }
    else if (kind === 'img') out.push(<ImageFig key={n++} name={name} caption={extra} />)
    else out.push(<GroupBar key={n++} cert={cert} group={name} />)
    last = m.index + m[0].length
  }
  out.push(<div key={n++} className="prose" dangerouslySetInnerHTML={{ __html: html.slice(last) }} />)
  return <div className="lessonbody">{out}</div>
}

export default function Learn() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const { cert, cards } = useStore()
  const c = CERTS[cert]
  const pool = usePool(cert)
  const all = useMemo(() => lessons(cert), [cert])
  const ordered = useMemo(() => {
    const map = Object.fromEntries(all.map((l) => [l.id, l]))
    return [map.start, ...SUB_ORDER(cert).map((s) => map[s]), map.cram].filter(Boolean)
  }, [all, cert])

  const g = params.get('g')
  useEffect(() => {
    if (!id) return
    const el = g && document.getElementById(g)
    if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 60)
    else window.scrollTo({ top: 0 })
  }, [id, g, cert])

  if (id) {
    const i = ordered.findIndex((l) => l.id === id)
    const lesson = ordered[i]
    if (!lesson) return <div className="page"><CertTabs /><p>No such lesson in this guide.</p><Link to="/learn" className="pb">All topics</Link></div>
    const prev = ordered[i - 1], next = ordered[i + 1]
    const qs = pool?.bySub[id] || []
    const st = stats(qs, cards[cert])
    const figs = [...new Set(qs.filter((q) => q.figure).map((q) => q.figure))]
    const sub = lesson.id.length === 2
    return (
      <div className="page lesson">
        <CertTabs />
        <div className="learn-shell">
          <TopicNav cert={cert} items={ordered} pool={pool} />
          <article className="lesson-main">
            <div className="lesson-top">
              <Link className="pb sm" to="/learn">← All topics</Link>
              <nav className="crumbs" aria-label="Breadcrumb"><Link to="/learn">Learn</Link> › {c.name} › <b>{sub ? lesson.id : lesson.title}</b></nav>
            </div>
            <h1>{sub ? <span className="subid">{lesson.id}</span> : null}{lesson.title}</h1>
            {sub && (
              <div className="topic-status">
                <span>{st.mastered} of {st.total} questions mastered</span>
                <span className="bar"><i style={{ width: `${st.total ? (st.mastered / st.total) * 100 : 0}%` }} /></span>
                <Link className="pb sm on" to={`/drill?sub=${id}`}>Practice all of {id}</Link>
              </div>
            )}
            {lesson.groupIds.length > 1 && (
              <nav className="groupjump" aria-label="Jump to a section">
                <span>Jump to:</span>
                {lesson.groupIds.map((gid) => <a key={gid} href={`#/learn/${id}?g=${gid}`}>{gid}</a>)}
              </nav>
            )}
            <Notice cert={cert} />
            <LessonBody cert={cert} html={lesson.html} />
            {figs.length > 0 && (
              <section className="figs">
                <h2>Figures used in this topic</h2>
                <p>Questions refer to these by name. Study the symbols.</p>
                <div className="figgrid">{figs.map((f) => <figure key={f}><img src={figureUrl(f)} alt={f} /><figcaption>{f.replace('.png', '').toUpperCase()}</figcaption></figure>)}</div>
              </section>
            )}
            <div className="lesson-actions">
              {sub && <Link className="pb on big" to={`/drill?sub=${id}`}>Test yourself on {id} ({qs.length || '…'} questions)</Link>}
              <div className="pager">
                {prev ? <Link className="pb" to={`/learn/${prev.id}`}>← {prev.id.length === 2 ? `${prev.id} ` : ''}{prev.title}</Link> : <span />}
                {next && <Link className="pb on" to={`/learn/${next.id}`}>{next.id.length === 2 ? `${next.id} ` : ''}{next.title} →</Link>}
              </div>
              <Link className="link" to="/learn">Back to all topics</Link>
            </div>
          </article>
        </div>
      </div>
    )
  }

  return (
    <div className="page learn">
      <CertTabs />
      <header className="pagehead">
        <h1>{c.name} topics</h1>
        <p>{c.exam} questions on the exam, {c.pass} to pass. One question comes from each group, so every topic matters. Start at the top and work down, or jump to what scares you.</p>
        <a className="pb" href={`./guides/${PDF[cert]}`} download>Download the PDF</a>
      </header>
      <Notice cert={cert} />
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
                  <small>{sub ? `${l.examQs ?? ''} on the exam · ${list.length || '…'} in the pool · ${s.mastered} mastered` : l.id === 'start' ? 'How the exam works and a study plan' : 'One page to read the night before'}</small>
                </span>
                {sub && <span className="bar" aria-label={`${s.mastered} of ${s.total} mastered`}><i style={{ width: `${s.total ? (s.mastered / s.total) * 100 : 0}%` }} /></span>}
              </Link>
            </li>
          )
        })}
      </ul>
      <p className="small"><Link to="/ref">Reference</Link> has the band chart, Q codes, formulas and a searchable glossary. The <Link to="/lab">Lab</Link> has a Morse trainer.</p>
    </div>
  )
}
