import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import CertTabs from '../components/CertTabs'
import QuestionCard from '../components/QuestionCard'
import { CERTS } from '../lib/certs'
import { usePool } from '../lib/usePool'
import { buildExam, presentQuestion } from '../lib/pool'
import { useStore, grade, saveExam } from '../lib/store'

export default function Exam() {
  const { cert, exams } = useStore()
  const c = CERTS[cert]
  const pool = usePool(cert)
  const [run, setRun] = useState(null) // { qs, answers, i, done }

  // Keyboard: A-D or 1-4 answer, arrows move between questions.
  useEffect(() => {
    const onKey = (e) => {
      if (!run || run.done || e.metaKey || e.ctrlKey || ['SELECT', 'INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const k = e.key.toLowerCase(), q = run.qs[run.i]
      const idx = 'abcd'.indexOf(k) >= 0 ? 'abcd'.indexOf(k) : '1234'.indexOf(k)
      if (k.length === 1 && idx >= 0 && idx < 4) {
        setRun((r) => ({ ...r, answers: r.answers.map((a, n) => (n === r.i ? q.order[idx] : a)) }))
      } else if (e.key === 'ArrowRight') setRun((r) => ({ ...r, i: Math.min(r.qs.length - 1, r.i + 1) }))
      else if (e.key === 'ArrowLeft') setRun((r) => ({ ...r, i: Math.max(0, r.i - 1) }))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [run])

  const start = () => {
    const qs = buildExam(pool).map(presentQuestion)
    setRun({ qs, answers: Array(qs.length).fill(null), i: 0, done: false })
    window.scrollTo({ top: 0 })
  }
  const result = useMemo(() => {
    if (!run?.done) return null
    let score = 0; const bySub = {}, missed = []
    run.qs.forEach((q, n) => {
      const ok = run.answers[n] === q.correct
      const s = q.id.slice(0, 2); bySub[s] ||= { right: 0, total: 0 }
      bySub[s].total++; if (ok) { bySub[s].right++; score++ } else missed.push({ q, picked: run.answers[n] })
    })
    return { score, bySub, missed }
  }, [run])

  const finish = () => {
    run.qs.forEach((q, n) => { if (run.answers[n] !== null) grade(cert, q.id, run.answers[n] === q.correct) })
    const score = run.qs.reduce((a, q, n) => a + (run.answers[n] === q.correct ? 1 : 0), 0)
    saveExam(cert, { t: Date.now(), score, total: run.qs.length })
    setRun({ ...run, done: true }); window.scrollTo({ top: 0 })
  }

  if (!run) {
    const hist = exams[cert] || []
    return (
      <div className="page exam">
        <CertTabs />
        <header className="pagehead">
          <h1>Mock exam</h1>
          <p>{c.exam} questions, one drawn from each of the {c.exam} question groups, the way a VE team builds the real thing. You need {c.pass} correct ({Math.round((c.pass / c.exam) * 100)}%). No timer, and you can go back and change answers. Keys: A–D to answer, arrow keys to move.</p>
          <button className="pb on big" disabled={!pool} onClick={start}>{pool ? 'Start the exam' : 'Loading…'}</button>
        </header>
        {hist.length > 0 && (
          <section className="history"><h2>Your last runs</h2>
            <ul>{hist.slice(0, 8).map((h) => (
              <li key={h.t} className={h.score >= c.pass ? 'pass' : ''}>
                <strong>{h.score}/{h.total}</strong> <span>{h.score >= c.pass ? 'pass' : 'not yet'}</span>
                <time>{new Date(h.t).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</time>
              </li>))}</ul>
          </section>
        )}
      </div>
    )
  }

  if (run.done) {
    const pass = result.score >= c.pass
    return (
      <div className="page exam result">
        <CertTabs />
        <section className={`rack scorecard ${pass ? 'pass' : 'fail'}`}>
          <div className="big-score">{result.score}<small>/{run.qs.length}</small></div>
          <div>
            <h1>{pass ? 'Pass. 73!' : 'Not yet.'}</h1>
            <p>{pass ? `You cleared the ${c.pass}-question line by ${result.score - c.pass}.` : `You need ${c.pass}. You are ${c.pass - result.score} short. The misses below are your study list.`}</p>
            <div className="btnrow"><button className="pb on" onClick={start}>Another exam</button><Link className="pb" to="/progress">Progress</Link></div>
          </div>
        </section>
        <section className="breakdown"><h2>By subelement</h2>
          <ul>{Object.entries(result.bySub).sort().map(([s, v]) => (
            <li key={s}><Link to={`/learn/${s}`}><strong>{s}</strong> {c.subs[s]}</Link><span>{v.right}/{v.total}</span></li>))}</ul>
        </section>
        {result.missed.length > 0 && <section><h2>Missed questions</h2>
          {result.missed.map(({ q, picked }) => (
            <div key={q.id} className="missed">
              <QuestionCard q={q} picked={picked ?? -1} onPick={() => {}} revealed />
            </div>))}
        </section>}
      </div>
    )
  }

  const q = run.qs[run.i]
  const answered = run.answers.filter((a) => a !== null).length
  const set = (orig) => { const a = run.answers.slice(); a[run.i] = orig; setRun({ ...run, answers: a }) }
  return (
    <div className="page exam running">
      <div className="examgrid" role="navigation" aria-label="Question navigator">
        {run.qs.map((x, n) => (
          <button key={x.id} className={`cell ${n === run.i ? 'cur' : ''} ${run.answers[n] !== null ? 'ans' : ''}`} onClick={() => setRun({ ...run, i: n })} aria-label={`Question ${n + 1}${run.answers[n] !== null ? ', answered' : ''}`}>{n + 1}</button>
        ))}
      </div>
      <QuestionCard key={q.id} q={q} picked={run.answers[run.i]} onPick={set} revealed={false} index={run.i} total={run.qs.length} />
      <div className="exam-actions">
        <button className="pb" disabled={run.i === 0} onClick={() => setRun({ ...run, i: run.i - 1 })}>Previous</button>
        <button className="pb" disabled={run.i === run.qs.length - 1} onClick={() => setRun({ ...run, i: run.i + 1 })}>Next</button>
        <span className="spacer" />
        <span className="count">{answered} of {run.qs.length} answered</span>
        <button className="pb on" onClick={() => (answered === run.qs.length || window.confirm(`${run.qs.length - answered} unanswered. Grade the exam anyway?`)) && finish()}>Grade exam</button>
      </div>
    </div>
  )
}
