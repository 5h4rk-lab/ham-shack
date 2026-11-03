import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import CertTabs from '../components/CertTabs'
import QuestionCard from '../components/QuestionCard'
import { CERTS, SUB_ORDER } from '../lib/certs'
import { usePool } from '../lib/usePool'
import { presentQuestion } from '../lib/pool'
import { useStore, grade, pickNext, stats } from '../lib/store'

export default function Drill() {
  const { cert, cards } = useStore()
  const c = CERTS[cert]
  const pool = usePool(cert)
  const [params, setParams] = useSearchParams()
  const sub = params.get('sub') || 'all'
  const weak = params.get('weak') === '1'
  const [q, setQ] = useState(null)
  const [picked, setPicked] = useState(null)
  const [session, setSession] = useState({ right: 0, total: 0 })

  const list = useMemo(() => {
    if (!pool) return []
    let l = sub === 'all' ? pool.questions : pool.bySub[sub] || []
    if (weak) { const w = l.filter((x) => (cards[cert]?.[x.id]?.box || 0) === 1); if (w.length) l = w }
    return l
  }, [pool, sub, weak, cert]) // eslint-disable-line

  const next = useCallback((skip) => {
    if (!list.length) return
    setQ(presentQuestion(pickNext(list, cards[cert], skip))); setPicked(null)
  }, [list, cards, cert])
  useEffect(() => { if (list.length) next() }, [list]) // eslint-disable-line

  const answer = useCallback((orig) => {
    if (picked !== null || !q) return
    setPicked(orig)
    const right = orig === q.correct
    grade(cert, q.id, right)
    setSession((s) => ({ right: s.right + (right ? 1 : 0), total: s.total + 1 }))
  }, [picked, q, cert])

  useEffect(() => {
    const onKey = (e) => {
      if (!q || e.metaKey || e.ctrlKey || e.target.tagName === 'SELECT') return
      const k = e.key.toLowerCase(), i = 'abcd'.indexOf(k) >= 0 ? 'abcd'.indexOf(k) : '1234'.indexOf(k)
      if (picked === null && i >= 0 && i < 4) answer(q.order[i])
      else if (picked !== null && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) { e.preventDefault(); next(q.id) }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [q, picked, answer, next])

  const st = stats(list, cards[cert])
  const set = (k, v) => { const p = new URLSearchParams(params); v ? p.set(k, v) : p.delete(k); setParams(p, { replace: true }) }

  return (
    <div className="page drill">
      <CertTabs />
      <header className="pagehead row">
        <div>
          <h1>Drill</h1>
          <p>Questions you miss come back sooner. Keys: A–D or 1–4 to answer, Enter for the next one.</p>
        </div>
        <div className="filters">
          <label>Subelement
            <select value={sub} onChange={(e) => set('sub', e.target.value === 'all' ? '' : e.target.value)}>
              <option value="all">Everything</option>
              {SUB_ORDER(cert).map((s) => <option key={s} value={s}>{s} · {c.subs[s]}</option>)}
            </select>
          </label>
          <label className="check"><input type="checkbox" checked={weak} onChange={(e) => set('weak', e.target.checked ? '1' : '')} /> Weak spots only</label>
        </div>
      </header>

      <div className="meterline" aria-live="polite">
        <span>{st.mastered} of {st.total} mastered</span>
        <span className="bar"><i style={{ width: `${st.total ? (st.mastered / st.total) * 100 : 0}%` }} /></span>
        <span>This session: {session.right}/{session.total}</span>
      </div>

      {!pool && <p className="loading">Warming up the receiver…</p>}
      {q && <QuestionCard q={q} picked={picked} onPick={answer} revealed={picked !== null} />}
      {q && picked !== null && (
        <div className={`verdict ${picked === q.correct ? 'ok' : 'bad'}`} role="status">
          <strong>{picked === q.correct ? 'Correct.' : 'Not quite.'}</strong>
          {picked !== q.correct && <span> The answer is highlighted in green.</span>}
          {q.refs && <span className="ref"> Rule reference {q.refs.replace(/[[\]]/g, '')}.</span>}
          <span className="spacer" />
          <Link className="link" to={`/learn/${q.id.slice(0, 2)}`}>Read this section</Link>
          <button className="pb on" onClick={() => next(q.id)} autoFocus>Next question</button>
        </div>
      )}
    </div>
  )
}
