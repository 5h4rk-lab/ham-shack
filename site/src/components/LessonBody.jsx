import GroupBar from './GroupBar'
import ImageFig from './ImageFig'
import { LABS } from './labs'

const MARK = /<!--\s*(lab|img|group):([\w-]+)(?:\s+([^>]*?))?\s*-->/g

// Lesson HTML with <!-- lab:x -->, <!-- img:x caption -->, <!-- group:T1A --> turned into widgets.
export default function LessonBody({ cert, html }) {
  const out = []
  let last = 0, m, n = 0
  MARK.lastIndex = 0
  while ((m = MARK.exec(html))) {
    if (m.index > last) out.push(<div key={n++} className="prose" dangerouslySetInnerHTML={{ __html: html.slice(last, m.index) }} />)
    const [, kind, name, extra] = m
    if (kind === 'lab') { const L = LABS[name]; if (L) out.push(<L key={n++} initial={extra} />) }
    else if (kind === 'img') out.push(<ImageFig key={n++} name={name} caption={extra} />)
    else out.push(<GroupBar key={n++} cert={cert} group={name} />)
    last = m.index + m[0].length
  }
  out.push(<div key={n++} className="prose" dangerouslySetInnerHTML={{ __html: html.slice(last) }} />)
  return <div className="lessonbody">{out}</div>
}
