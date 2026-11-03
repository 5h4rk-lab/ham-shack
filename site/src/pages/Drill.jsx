import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import CertTabs from '../components/CertTabs'
import QuestionCard from '../components/QuestionCard'
import { CERTS, SUB_ORDER } from '../lib/certs'
import { usePool } from '../lib/usePool'
import { presentQuestion } from '../lib/pool'
import { useStore, grade, pickNext, stats } from '../lib/store'
import { parseRefs, groupInfo } from '../lib/rules'

export default function Drill() {
  const { cert, cards } = useStore()
  const c = CERTS[cert]
  const pool = usePool(cert)
  const [params, setParams] = useSearchParams()
  const group = params.get('group') || ''
  const sub = group ? group.slice(0, 2) : params.get('sub') || 'all'
  const review = params.get('review') === '1'
  const [q, setQ] = useState(null)
  const [picked, setPicked] = useState(null)
  const [session, setSession] = useState({ right: 0, total: 0 })

  // Everything in the chosen topic, and the part of it you have not mastered yet.
  const scope = useMemo(() => {
    if (!pool) return []
    if (group) return pool.byGroup[group] || []
    return sub === 'all' ? pool.questions : pool.bySub[sub] || []
  }, [pool, sub, group])
  const st = stats(scope, cards[cert])
  const left = useMemo(() => scope.filter((x) => (cards[cert]?.[x.id]?.box || 0) < 4), [scope, cards, cert])
  const finished = scope.length > 0 && left.length === 0 && !review && picked === null
  const pickFrom = review ? scope : left

  const next = useCallback((skip) => {
    if (!pickFrom.length) { setQ(null); setPicked(null); return }
    setQ(presentQuestion(pickNext(pickFrom, cards[cert], skip))); setPicked(null)
  }, [pickFrom, cards, cert])
  // New topic: draw a fresh question. (Not on every grade, or the card would change under you.)
  useEffect(() => { if (scope.length) { setSession({ right: 0, total: 0 }); next() } }, [scope, review]) // eslint-disable-line

  const answer = useCallback((orig) => {
    if (picked !== null || !q) return
    setPicked(orig)
    const right = orig === q.correct
    grade(cert, q.id, right)
    setSession((s) => ({ right: s.right + (right ? 1 : 0), total: s.total + 1 }))
  }, [picked, q, cert])

  useEffect(() => {
    const onKey = (e) => {
      if (!q || e.metaKey || e.ctrlKey || ['SELECT', 'INPUT'].includes(e.target.tagName)) return
      const k = e.key.toLowerCase(), i = 'abcd'.indexOf(k) >= 0 ? 'abcd'.indexOf(k) : '1234'.indexOf(k)
      if (picked === null && k.length === 1 && i >= 0 && i < 4) answer(q.order[i])
      else if (picked !== null && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight')) { e.preventDefault(); next(q.id) }
    }
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey)
  }, [q, picked, answer, next])

  const go = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => v && p.set(k, v)); setParams(p) }
  const subs = SUB_ORDER(cert)
  const topicName = group ? `${group} · ${groupInfo(cert, group)?.official?.split(';')[0] || ''}` : sub === 'all' ? 'Everything' : `${sub} · ${c.subs[sub]}`
  const groupsOfSub = pool && sub !== 'all' ? Object.keys(pool.byGroup).filter((g) => g.startsWith(sub)).sort() : []
  const nextSub = sub !== 'all' ? subs[subs.indexOf(sub) + 1] : null
  const unseen = scope.length - st.seen

  return (
    <div className="page drill">
      <CertTabs />
      <header className="pagehead">
        <h1>Drill</h1>
        <p>Pick a topic. Questions you miss come back sooner. A–D or 1–4 to answer, Enter for the next one.</p>
      </header>

      <nav className="chips" aria-label="Choose a topic">
        <button className={`chip ${sub === 'all' && !group ? 'on' : ''}`} onClick={() => go({})}>All topics</button>
        {pool && subs.map((s) => {
          const t = stats(pool.bySub[s] || [], cards[cert])
          return <button key={s} className={`chip ${sub === s ? 'on' : ''}`} onClick={() => go({ sub: s })} title={c.subs[s]}>
            {s}<em>{t.total - t.mastered} left</em></button>
        })}
      </nav>
      {groupsOfSub.length > 0 && (
        <nav className="chips small" aria-label="Narrow to a group">
          <button className={`chip ${!group ? 'on' : ''}`} onClick={() => go({ sub })}>All of {sub}</button>
          {groupsOfSub.map((g) => { const t = stats(pool.byGroup[g], cards[cert]); return <button key={g} className={`chip ${group === g ? 'on' : ''}`} onClick={() => go({ group: g })}>{g}<em>{t.total - t.mastered} left</em></button> })}
        </nav>
      )}

      <section className="topicbar rack" aria-live="polite">
        <div>
          <h2>{topicName}</h2>
          <p><b>{left.length}</b> left to master · {unseen} not yet seen · {st.mastered} of {st.total} mastered{session.total ? ` · this session ${session.right}/${session.total}` : ''}</p>
        </div>
        <span className="bar"><i style={{ width: `${st.total ? (st.mastered / st.total) * 100 : 0}%` }} /></span>
        <div className="btnrow">
          {sub !== 'all' && <Link className="pb sm" to={`/learn/${sub}${group ? `?g=${group}` : ''}`}>Read the lesson</Link>}
          <label className="check"><input type="checkbox" checked={review} onChange={(e) => { const p = new URLSearchParams(params); e.target.checked ? p.set('review', '1') : p.delete('review'); setParams(p) }} /> Include mastered</label>
        </div>
      </section>

      {!pool && <p className="loading">Warming up the receiver…</p>}
      {finished && (
        <section className="rack done">
          <h2>Topic cleared.</h2>
          <p>All {st.total} questions here are mastered (answered right three times in a row). Nice work.</p>
          <div className="btnrow">
            {nextSub && <button className="pb on" onClick={() => go({ sub: nextSub })}>Next: {nextSub} {c.subs[nextSub]}</button>}
            <button className="pb" onClick={() => { const p = new URLSearchParams(params); p.set('review', '1'); setParams(p) }}>Review them anyway</button>
            <Link className="pb" to="/exam">Take a mock exam</Link>
          </div>
        </section>
      )}
      {q && !finished && <QuestionCard q={q} picked={picked} onPick={answer} revealed={picked !== null} />}
      {q && !finished && picked !== null && (
        <div className={`verdict ${picked === q.correct ? 'ok' : 'bad'}`} role="status">
          <div>
            <strong>{picked === q.correct ? 'Correct.' : 'Not quite.'}</strong>
            {picked !== q.correct && <span> The right answer is in green.</span>}
            <div className="rulechips">
              {parseRefs(q.refs).map((r) => (
                <a key={r.ref} href={r.url} target="_blank" rel="noopener noreferrer" title="Open this rule on ecfr.gov">
                  {r.ref.startsWith('97.') ? `§${r.ref}${r.sub}` : r.ref} <span>{r.title}</span></a>))}
              <Link to={`/learn/${q.id.slice(0, 2)}?g=${q.id.slice(0, 3)}`}>Read the concept ({q.id.slice(0, 3)})</Link>
            </div>
          </div>
          <span className="spacer" />
          <button className="pb on" onClick={() => next(q.id)} autoFocus>Next question</button>
        </div>
      )}
    </div>
  )
}
