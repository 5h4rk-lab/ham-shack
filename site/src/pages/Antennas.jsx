import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo } from 'react'
import TopicNav from '../components/TopicNav'
import LessonBody from '../components/LessonBody'
import { antennaLessons } from '../lib/guides'

// The antenna workshop: concepts, types, a picker, three cheap builds, troubleshooting, safety.
export default function Antennas() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const items = useMemo(() => antennaLessons(), [])
  const g = params.get('g')
  useEffect(() => {
    const el = g && document.getElementById(g)
    if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 80)
    else window.scrollTo({ top: 0 })
  }, [id, g])

  if (!id) {
    return (
      <div className="page learn">
        <header className="pagehead">
          <h1>Antenna workshop</h1>
          <p>What antennas are, which one to use for what, and three you can build this weekend for the price of a pizza. Works for every license class.</p>
          <div className="btnrow"><Link className="pb on" to="/antennas/picker">Which antenna should I use?</Link><Link className="pb" to="/antennas/build-dipole">Build a 10 m dipole</Link><a className="pb" href="./guides/Antenna-Handbook.pdf" download>Download the PDF</a></div>
        </header>
        <ul className="modules">
          {items.map((l) => (
            <li key={l.id}>
              <Link to={`/antennas/${l.id}`} className="rack module">
                <span className="mid">{l.badge}</span>
                <span className="mt"><strong>{l.title}</strong></span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  const i = items.findIndex((l) => l.id === id)
  const lesson = items[i]
  if (!lesson) return <div className="page"><p>No such section.</p><Link className="pb" to="/antennas">All antenna sections</Link></div>
  const prev = items[i - 1], next = items[i + 1]
  return (
    <div className="page lesson">
      <div className="learn-shell">
        <TopicNav items={items} base="/antennas" />
        <article className="lesson-main">
          <div className="lesson-top">
            <Link className="pb sm" to="/antennas">← All sections</Link>
            <nav className="crumbs" aria-label="Breadcrumb"><Link to="/antennas">Antennas</Link> › <b>{lesson.title}</b></nav>
          </div>
          <h1>{lesson.title}</h1>
          <LessonBody cert="antennas" html={lesson.html} />
          <div className="lesson-actions">
            <div className="pager">
              {prev ? <Link className="pb" to={`/antennas/${prev.id}`}>← {prev.title}</Link> : <span />}
              {next && <Link className="pb on" to={`/antennas/${next.id}`}>{next.title} →</Link>}
            </div>
            <Link className="link" to="/antennas">Back to all sections</Link>
          </div>
        </article>
      </div>
    </div>
  )
}
