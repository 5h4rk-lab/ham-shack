import { NavLink } from 'react-router-dom'
import { stats, useStore } from '../lib/store'

// The map of the course. Always visible beside a lesson so you can jump anywhere in one click.
export function TopicList({ cert, items, pool, base = '/learn' }) {
  const { cards } = useStore()
  return (
    <ul className="topiclist">
      {items.map((l) => {
        const sub = l.id.length === 2 && !l.badge
        const list = sub ? pool?.bySub[l.id] || [] : []
        const s = stats(list, cards[cert])
        return (
          <li key={l.id}>
            <NavLink to={`${base}/${l.id}`} className={({ isActive }) => (isActive ? 'active' : '')}>
              <b>{l.badge ?? (sub ? l.id : l.id === 'start' ? '▶' : '★')}</b>
              <span>{l.title.replace(/\(\d+ exam questions?\)/, '')}</span>
              {sub && !l.badge && <i className="mini" style={{ '--p': `${s.total ? (s.mastered / s.total) * 100 : 0}%` }} />}
            </NavLink>
          </li>
        )
      })}
    </ul>
  )
}
export default function TopicNav(props) {
  return (
    <>
      <aside className="topic-aside" aria-label="Topics">
        <h2>Topics</h2>
        <TopicList {...props} />
      </aside>
      <details className="topic-drawer">
        <summary>Topics: jump to another lesson</summary>
        <TopicList {...props} />
      </details>
    </>
  )
}
