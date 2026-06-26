import { Link, useNavigate } from 'react-router-dom'
import { domains } from '../data/domains.js'
import { useProgress } from '../context/ProgressContext.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import Badge from '../components/Badge.jsx'

function ReadinessHeader() {
  const { readiness, totalDone, totalExercises, xp } = useProgress()
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-5">
        <ProgressRing
          value={readiness}
          max={100}
          size={88}
          stroke={5}
          label={`${readiness}%`}
        />
        <div>
          <h1 className="font-mono text-xl font-semibold text-primary">
            Exam Readiness
          </h1>
          <p className="mt-1 text-sm text-muted">
            {totalDone} of {totalExercises} hands-on labs complete
          </p>
          <p className="mt-0.5 text-xs text-faint">
            CompTIA Security+ · SY0-701 · 5 domains
          </p>
        </div>
      </div>
      <div className="flex items-center gap-6 sm:flex-col sm:items-end sm:gap-1">
        <div className="text-right">
          <p className="font-mono text-2xl font-semibold text-accent">{xp}</p>
          <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
            Total XP
          </p>
        </div>
      </div>
    </div>
  )
}

function ContinueCard() {
  const { nextExercise, totalDone, totalExercises } = useProgress()
  const navigate = useNavigate()

  if (!nextExercise) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-accent/40 bg-accent/5 p-5">
        <div>
          <p className="font-mono text-sm font-semibold text-accent">
            All {totalExercises} labs complete
          </p>
          <p className="mt-0.5 text-sm text-muted">
            You&rsquo;ve worked every domain. Review, reset, or sit the exam.
          </p>
        </div>
        <span className="font-mono text-2xl text-accent">100%</span>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() =>
        navigate(`/exercise/${nextExercise.domainId}/${nextExercise.id}`)
      }
      className="group flex w-full items-center justify-between rounded-lg border border-border bg-surface p-5 text-left transition-colors hover:border-accent/50 focus-accent"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
          {totalDone === 0 ? 'Start here' : 'Continue where you left off'}
        </p>
        <p className="mt-1 font-mono text-base font-semibold text-primary">
          {nextExercise.code} — {nextExercise.title}
        </p>
      </div>
      <span className="ml-4 shrink-0 font-mono text-sm text-accent transition-transform group-hover:translate-x-0.5">
        ›
      </span>
    </button>
  )
}

function DomainCard({ domain }) {
  const { domainProgress } = useProgress()
  const p = domainProgress[domain.id]
  return (
    <Link
      to={`/domain/${domain.id}`}
      className="group flex flex-col gap-4 rounded-lg border border-border bg-surface p-5 transition-colors hover:border-accent/40 focus-accent"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-faint">{domain.code}</span>
            <Badge>{domain.weight}% of exam</Badge>
          </div>
          <h2 className="mt-2 font-mono text-base font-semibold leading-snug text-primary">
            {domain.title}
          </h2>
        </div>
        <ProgressRing value={p.done} max={p.total} size={56} stroke={4} />
      </div>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted">
        {domain.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-1">
        {p.complete ? (
          <Badge variant="complete">✓ Domain complete</Badge>
        ) : (
          <span className="font-mono text-xs text-faint">
            {p.done}/{p.total} labs done
          </span>
        )}
        <span className="font-mono text-sm text-accent opacity-0 transition-opacity group-hover:opacity-100">
          ›
        </span>
      </div>
    </Link>
  )
}

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <ReadinessHeader />
      <ContinueCard />
      <div>
        <h2 className="mb-3 font-mono text-sm uppercase tracking-widest text-faint">
          Domains
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {domains.map((d) => (
            <DomainCard key={d.id} domain={d} />
          ))}
        </div>
      </div>
    </div>
  )
}
