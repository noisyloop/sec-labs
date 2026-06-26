import { Link, useParams, Navigate } from 'react-router-dom'
import { getDomain } from '../data/domains.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import Badge from '../components/Badge.jsx'

function ExerciseRow({ domainId, exercise, index }) {
  const { isComplete, isUnlocked } = useProgress()
  const complete = isComplete(exercise.id)
  const unlocked = isUnlocked(domainId, exercise.id)

  const stateIcon = complete ? '✓' : unlocked ? String(index + 1) : '🔒'

  const inner = (
    <div className="flex items-center gap-4">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-mono text-sm ${
          complete
            ? 'border-accent/50 bg-accent/10 text-accent'
            : unlocked
              ? 'border-border bg-elevated text-primary'
              : 'border-border bg-surface text-faint'
        }`}
      >
        {stateIcon}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={`font-mono text-sm font-semibold ${
            unlocked ? 'text-primary' : 'text-faint'
          }`}
        >
          {exercise.code} — {exercise.title}
        </p>
        <p
          className={`mt-0.5 truncate text-xs ${
            unlocked ? 'text-muted' : 'text-faint'
          }`}
        >
          {exercise.concept[0]}
        </p>
      </div>
      <div className="hidden shrink-0 items-center gap-2 sm:flex">
        <Badge variant={complete ? 'complete' : 'default'}>
          obj {exercise.examTieIn.code}
        </Badge>
        {complete ? (
          <span className="font-mono text-[11px] text-accent">+{exercise.xp} XP</span>
        ) : unlocked ? (
          <span className="font-mono text-[11px] text-faint">{exercise.xp} XP</span>
        ) : (
          <span className="font-mono text-[11px] text-faint">locked</span>
        )}
      </div>
    </div>
  )

  if (!unlocked) {
    return (
      <div
        className="cursor-not-allowed rounded-lg border border-border bg-surface/50 p-4 opacity-70"
        title="Complete the previous lab to unlock this one"
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      to={`/exercise/${domainId}/${exercise.id}`}
      className="block rounded-lg border border-border bg-surface p-4 transition-colors hover:border-accent/40 focus-accent"
    >
      {inner}
    </Link>
  )
}

export default function Domain() {
  const { id } = useParams()
  const domain = getDomain(id)
  const { domainProgress } = useProgress()

  if (!domain) return <Navigate to="/" replace />

  const p = domainProgress[domain.id]

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1 font-mono text-xs text-muted hover:text-accent focus-accent"
      >
        ‹ Dashboard
      </Link>

      <div className="flex flex-col gap-5 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs text-faint">{domain.code}</span>
            <Badge>{domain.weight}% of exam</Badge>
            {p.complete && <Badge variant="complete">✓ Complete</Badge>}
          </div>
          <h1 className="mt-2 font-mono text-2xl font-semibold text-primary">
            {domain.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            {domain.description}
          </p>
        </div>
        <ProgressRing value={p.done} max={p.total} size={84} stroke={5} />
      </div>

      <div>
        <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-faint">
          Lab Exercises
        </h2>
        <div className="flex flex-col gap-3">
          {domain.exercises.map((ex, i) => (
            <ExerciseRow key={ex.id} domainId={domain.id} exercise={ex} index={i} />
          ))}
        </div>
        <p className="mt-3 font-mono text-[11px] text-faint">
          Exercises unlock in order — finish one to open the next.
        </p>
      </div>
    </div>
  )
}
