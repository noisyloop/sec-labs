import { useMemo, useState } from 'react'
import { Link, useParams, useNavigate, Navigate } from 'react-router-dom'
import { getDomain, getExercise } from '../data/domains.js'
import { useProgress } from '../context/ProgressContext.jsx'
import Badge from '../components/Badge.jsx'

function Section({ title, children, mono = false }) {
  return (
    <section className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-faint">
        {title}
      </h2>
      <div className={mono ? 'font-mono' : ''}>{children}</div>
    </section>
  )
}

function CodeBlock({ code }) {
  return (
    <pre className="mt-4 overflow-x-auto rounded-md border border-border bg-base p-4 font-mono text-[13px] leading-relaxed text-primary">
      <code>{code}</code>
    </pre>
  )
}

function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between gap-3 rounded-md border border-border bg-base px-4 py-3 transition-colors hover:border-accent/40 focus-accent"
    >
      <span className="text-sm text-primary group-hover:text-accent">{children}</span>
      <span className="shrink-0 font-mono text-xs text-faint group-hover:text-accent">
        ↗
      </span>
    </a>
  )
}

export default function Exercise() {
  const { domainId, exerciseId } = useParams()
  const navigate = useNavigate()
  const domain = getDomain(domainId)
  const exercise = getExercise(domainId, exerciseId)

  const { isComplete, isUnlocked, completeExercise, uncompleteExercise } =
    useProgress()

  // Local checklist state for the (non-graded) validation prompts.
  const [checked, setChecked] = useState({})

  const complete = exercise ? isComplete(exercise.id) : false
  const unlocked =
    exercise && domain ? isUnlocked(domain.id, exercise.id) : false

  // Determine the next exercise within the domain for a smooth "next" flow.
  const nextInDomain = useMemo(() => {
    if (!domain || !exercise) return null
    const idx = domain.exercises.findIndex((e) => e.id === exercise.id)
    return domain.exercises[idx + 1] ?? null
  }, [domain, exercise])

  if (!domain || !exercise) return <Navigate to="/" replace />

  // Guard against deep-linking into a locked exercise.
  if (!unlocked && !complete) {
    return <Navigate to={`/domain/${domain.id}`} replace />
  }

  const allChecked = exercise.prompts.every((_, i) => checked[i])

  function handleComplete() {
    completeExercise(exercise.id)
    navigate(`/domain/${domain.id}`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Link
          to={`/domain/${domain.id}`}
          className="inline-flex w-fit items-center gap-1 font-mono text-xs text-muted hover:text-accent focus-accent"
        >
          ‹ {domain.title}
        </Link>
        {complete && <Badge variant="complete">✓ Completed</Badge>}
      </div>

      {/* Title block */}
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-faint">{exercise.code}</span>
          <Badge variant="accent">Exam objective {exercise.examTieIn.code}</Badge>
          <span className="font-mono text-[11px] text-faint">+{exercise.xp} XP</span>
        </div>
        <h1 className="mt-2 font-mono text-2xl font-semibold text-primary">
          {exercise.title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          <span className="text-faint">Maps to objective {exercise.examTieIn.code}:</span>{' '}
          {exercise.examTieIn.text}
        </p>
      </div>

      {/* Concept */}
      <Section title="Concept">
        <div className="flex flex-col gap-4">
          {exercise.concept.map((para, i) => (
            <p key={i} className="text-[15px] leading-relaxed text-primary/90">
              {para}
            </p>
          ))}
        </div>
      </Section>

      {/* Lab directive */}
      <Section title="Lab Directive">
        <p className="text-sm leading-relaxed text-muted">{exercise.directive.intro}</p>
        <ol className="mt-4 flex flex-col gap-3">
          {exercise.directive.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-base font-mono text-[11px] text-accent">
                {i + 1}
              </span>
              <span className="text-[15px] leading-relaxed text-primary/90">
                {step}
              </span>
            </li>
          ))}
        </ol>
        {exercise.directive.snippet && (
          <CodeBlock code={exercise.directive.snippet} />
        )}
      </Section>

      {/* Resources */}
      <Section title="Resources">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {exercise.resources.map((r) => (
            <ExternalLink key={r.url} href={r.url}>
              {r.label}
            </ExternalLink>
          ))}
        </div>
      </Section>

      {/* Validation prompts checklist */}
      <Section title="Validation Prompts">
        <p className="mb-4 text-sm text-muted">
          Work through these as you go and check each off. They&rsquo;re for your own
          understanding — nothing here is auto-graded.
        </p>
        <ul className="flex flex-col gap-2">
          {exercise.prompts.map((prompt, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-base p-3 transition-colors hover:border-accent/30">
                <input
                  type="checkbox"
                  checked={!!checked[i]}
                  onChange={() =>
                    setChecked((prev) => ({ ...prev, [i]: !prev[i] }))
                  }
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
                />
                <span
                  className={`text-[15px] leading-relaxed ${
                    checked[i] ? 'text-faint line-through' : 'text-primary/90'
                  }`}
                >
                  {prompt}
                </span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-mono text-[11px] text-faint">
          {exercise.prompts.filter((_, i) => checked[i]).length}/
          {exercise.prompts.length} reflected on
        </p>
      </Section>

      {/* Action bar */}
      <div className="sticky bottom-0 -mx-4 border-t border-border bg-base/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            {complete
              ? 'Lab complete. Revisit anytime — your progress is saved.'
              : allChecked
                ? 'All prompts reflected on — mark this lab complete to earn XP.'
                : 'Tip: reflect on the validation prompts before marking complete.'}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            {complete ? (
              <>
                <button
                  type="button"
                  onClick={() => uncompleteExercise(exercise.id)}
                  className="rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-primary focus-accent"
                >
                  Mark incomplete
                </button>
                {nextInDomain ? (
                  <Link
                    to={`/exercise/${domain.id}/${nextInDomain.id}`}
                    className="rounded-md border border-accent/50 bg-accent/10 px-4 py-2 font-mono text-sm font-semibold text-accent transition-colors hover:bg-accent/20 focus-accent"
                  >
                    Next lab ›
                  </Link>
                ) : (
                  <Link
                    to={`/domain/${domain.id}`}
                    className="rounded-md border border-accent/50 bg-accent/10 px-4 py-2 font-mono text-sm font-semibold text-accent transition-colors hover:bg-accent/20 focus-accent"
                  >
                    Back to domain ›
                  </Link>
                )}
              </>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="rounded-md border border-accent/50 bg-accent px-5 py-2 font-mono text-sm font-semibold text-base transition-colors hover:bg-accent/90 focus-accent"
              >
                Mark Complete · +{exercise.xp} XP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
