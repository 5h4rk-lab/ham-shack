import { Link, NavLink, Outlet } from 'react-router-dom'
import { useStore } from '../lib/store'

const LINKS = [['/', 'Shack', true], ['/learn', 'Learn'], ['/drill', 'Drill'], ['/exam', 'Exam'], ['/lab', 'Lab'], ['/antennas', 'Antennas'], ['/ref', 'Reference'], ['/progress', 'Progress']]

export default function Layout() {
  const { streak } = useStore()
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="The Shack, home">
          <svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true">
            <circle cx="20" cy="20" r="18" fill="#14110e" stroke="#ffb43a" strokeWidth="2.5" />
            <path d="M20 6v11" stroke="#ffb43a" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
          <span>The Shack</span>
        </NavLink>
        <nav aria-label="Main">
          {LINKS.map(([to, name, end]) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}><i />{name}</NavLink>
          ))}
        </nav>
        {streak.n > 1 && <span className="streak" title="Days in a row you practiced">{streak.n} day streak</span>}
      </header>
      <main id="main"><Outlet /></main>
      <footer className="foot">
        <p>Question pools are public domain, published by the NCVEC Question Pool Committee. Checked against the pools effective for exams today. Always confirm dates with your VE team. 73 and good luck. <Link to="/credits">Photo credits</Link>.</p>
      </footer>
    </>
  )
}
