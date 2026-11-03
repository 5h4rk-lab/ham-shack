import { Link } from 'react-router-dom'
import { groupInfo, ruleInfo } from '../lib/rules'
import { useStore, stats } from '../lib/store'
import { usePool } from '../lib/usePool'

// Under every group heading: what the official syllabus says it covers, which FCC rules sit
// behind its questions, and a one-click way to practice just this group.
export default function GroupBar({ cert, group }) {
  const g = groupInfo(cert, group)
  const { cards } = useStore()
  const pool = usePool(cert)
  if (!g) return null
  const s = pool ? stats(pool.byGroup[group] || [], cards[cert]) : null
  return (
    <aside className="groupbar">
      {g.official && <p className="official"><b>Official syllabus:</b> {g.official}</p>}
      {g.refs.length > 0 && (
        <p className="rules"><b>Rules behind these questions:</b>{' '}
          {g.refs.map((r) => {
            const i = ruleInfo(r)
            return <a key={r} href={i.url} target="_blank" rel="noopener noreferrer" title={i.title}>{r.startsWith('97.') ? `§${r}` : r} {i.title}</a>
          })}
        </p>
      )}
      <p className="practice">
        <Link className="pb sm on" to={`/drill?group=${group}`}>Practice {group} ({g.n} questions)</Link>
        {s && <span>{s.mastered} of {s.total} mastered</span>}
      </p>
    </aside>
  )
}
