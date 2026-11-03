import { figureUrl } from '../lib/pool'

// A question presented like a QSL card; answers are push-buttons.
export default function QuestionCard({ q, picked, onPick, revealed, index, total }) {
  const letters = ['A', 'B', 'C', 'D']
  return (
    <article className="qsl">
      <header>
        <span className="stamp" title={q.refs}><b>{q.id}</b>{q.refs && <small>{q.refs.replace(/[[\]]/g, '')}</small>}</span>
        {total ? <span className="qn">Question {index + 1} of {total}</span> : null}
      </header>
      <h2 className="qtext">{q.question}</h2>
      {q.figure && <img className="qfig" src={figureUrl(q.figure)} alt={`Figure for question ${q.id}`} />}
      <div className="answers" role="group" aria-label="Answers">
        {q.order.map((orig, pos) => {
          const isRight = orig === q.correct
          let cls = 'ans'
          if (revealed) cls += isRight ? ' right' : picked === orig ? ' wrong' : ' dim'
          else if (picked === orig) cls += ' picked'
          return (
            <button key={orig} className={cls} disabled={revealed} onClick={() => onPick(orig)} aria-pressed={picked === orig}>
              <kbd>{letters[pos]}</kbd><span>{q.answers[orig]}</span>
            </button>
          )
        })}
      </div>
    </article>
  )
}
