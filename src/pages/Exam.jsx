import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  examQuestions,
  shuffle,
  isAnswerCorrect,
  EXAM_DURATION_SECONDS,
  PASS_PERCENT,
  EXAM_PASS_XP,
  TOTAL_EXAM_QUESTIONS,
} from '../data/examQuestions.js'
import { domains } from '../data/domains.js'
import { useProgress } from '../context/ProgressContext.jsx'
import Badge from '../components/Badge.jsx'
import ProgressRing from '../components/ProgressRing.jsx'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

function formatTime(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
}

function requiredCount(q) {
  return q.type === 'multi' ? 2 : 1
}

function isAnswered(q, selected) {
  return (selected?.length || 0) >= requiredCount(q)
}

// ---- Intro / start screen ------------------------------------------------

function HistoryRow({ attempt }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-base px-4 py-3">
      <div className="flex items-center gap-3">
        <Badge variant={attempt.passed ? 'complete' : 'locked'}>
          {attempt.passed ? '✓ Pass' : '✗ Fail'}
        </Badge>
        <span className="font-mono text-sm text-primary">
          {attempt.score}/{attempt.total}
        </span>
        <span className="font-mono text-xs text-faint">{attempt.percent}%</span>
      </div>
      <span className="font-mono text-[11px] text-faint">
        {new Date(attempt.date).toLocaleDateString()}
      </span>
    </div>
  )
}

function ExamIntro({ practiceMode, setPracticeMode, onStart, attempts }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-lg border border-border bg-surface p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-faint">Practice Exam</span>
          <Badge variant="accent">SY0-701</Badge>
          <span className="font-mono text-[11px] text-faint">+{EXAM_PASS_XP} XP on first pass</span>
        </div>
        <h1 className="mt-2 font-mono text-2xl font-semibold text-primary">
          90-Question Practice Exam
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A full-length, domain-weighted CompTIA Security+ practice test. {TOTAL_EXAM_QUESTIONS}{' '}
          scenario-based questions, a 90-minute timer, and a {PASS_PERCENT}% pass line
          (modeled on the 750/900 scaled score). Your answers and progress stay in this
          browser.
        </p>

        <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ['Questions', String(TOTAL_EXAM_QUESTIONS)],
            ['Time limit', '90 min'],
            ['Pass mark', `${PASS_PERCENT}%`],
            ['Domains', '5'],
          ].map(([label, value]) => (
            <div key={label} className="rounded-md border border-border bg-base p-3">
              <dd className="font-mono text-xl font-semibold text-primary">{value}</dd>
              <dt className="font-mono text-[11px] uppercase tracking-widest text-faint">
                {label}
              </dt>
            </div>
          ))}
        </dl>

        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-md border border-border bg-base p-4 transition-colors hover:border-accent/30">
          <input
            type="checkbox"
            checked={practiceMode}
            onChange={(e) => setPracticeMode(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-accent"
          />
          <span>
            <span className="font-mono text-sm font-semibold text-primary">
              Practice Mode
            </span>
            <span className="mt-0.5 block text-sm text-muted">
              No timer. The correct answer and explanation are revealed immediately after
              you answer each question. (Practice attempts don&rsquo;t award the XP bonus.)
            </span>
          </span>
        </label>

        <button
          type="button"
          onClick={onStart}
          className="mt-6 w-full rounded-md border border-accent/50 bg-accent px-5 py-3 font-mono text-sm font-semibold text-base transition-colors hover:bg-accent/90 focus-accent sm:w-auto"
        >
          {practiceMode ? 'Start practice exam' : 'Start timed exam · 90:00'}
        </button>
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-mono text-sm uppercase tracking-widest text-faint">
          Recent attempts
        </h2>
        {attempts.length === 0 ? (
          <p className="mt-4 text-sm text-muted">
            No attempts yet. Your last three results will appear here.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-2">
            {attempts.map((a, i) => (
              <HistoryRow key={i} attempt={a} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Question navigator grid --------------------------------------------

function QuestionGrid({ order, answers, flagged, current, onJump, reviewResult }) {
  return (
    <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
      {order.map((q, i) => {
        const answered = isAnswered(q, answers[q.id])
        const isFlagged = flagged.has(q.id)
        const isCurrent = i === current

        let cls =
          'border-border bg-base text-faint hover:border-accent/40 hover:text-primary'
        if (reviewResult) {
          const correct = isAnswerCorrect(q, answers[q.id] || [])
          cls = correct
            ? 'border-accent/50 bg-accent/10 text-accent'
            : 'border-red-500/50 bg-red-500/10 text-red-300'
        } else if (answered) {
          cls = 'border-accent/50 bg-accent/10 text-accent'
        }
        if (isCurrent) cls += ' ring-1 ring-accent ring-offset-1 ring-offset-base'

        return (
          <button
            key={q.id}
            type="button"
            onClick={() => onJump(i)}
            className={`relative flex h-8 items-center justify-center rounded border font-mono text-[11px] transition-colors focus-accent ${cls}`}
            aria-label={`Question ${i + 1}${answered ? ', answered' : ''}${
              isFlagged ? ', flagged' : ''
            }`}
          >
            {i + 1}
            {isFlagged && !reviewResult && (
              <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        )
      })}
    </div>
  )
}

// ---- Single question card -----------------------------------------------

function QuestionCard({
  question,
  index,
  total,
  selected,
  onSelect,
  revealed,
  flagged,
  onToggleFlag,
  displayOrder,
}) {
  const correctSet = useMemo(() => new Set(question.answers), [question])
  const selectedSet = useMemo(() => new Set(selected || []), [selected])
  // Display positions -> original option indices. Selections are always stored
  // as ORIGINAL indices so scoring and history stay stable.
  const dOrder = displayOrder || question.options.map((_, i) => i)

  return (
    <div className="rounded-lg border border-border bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-faint">
            Question {index + 1} / {total}
          </span>
          <Badge>Domain {question.domain}</Badge>
          {question.type === 'multi' && (
            <Badge variant="accent">Choose TWO</Badge>
          )}
        </div>
        {onToggleFlag && (
          <button
            type="button"
            onClick={onToggleFlag}
            className={`rounded border px-2.5 py-1 font-mono text-[11px] transition-colors focus-accent ${
              flagged
                ? 'border-amber-400/50 bg-amber-400/10 text-amber-300'
                : 'border-border bg-base text-faint hover:text-primary'
            }`}
          >
            {flagged ? '⚑ Flagged' : '⚐ Flag for review'}
          </button>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-relaxed text-primary/90">
        {question.question}
      </p>

      <ul className="mt-5 flex flex-col gap-2">
        {dOrder.map((origIdx, pos) => {
          const opt = question.options[origIdx]
          const isSelected = selectedSet.has(origIdx)
          const isCorrect = correctSet.has(origIdx)

          let optCls = 'border-border bg-base hover:border-accent/40'
          let markCls = 'border-border text-faint'
          if (revealed) {
            if (isCorrect) {
              optCls = 'border-accent/50 bg-accent/10'
              markCls = 'border-accent/50 bg-accent/20 text-accent'
            } else if (isSelected) {
              optCls = 'border-red-500/50 bg-red-500/10'
              markCls = 'border-red-500/50 bg-red-500/20 text-red-300'
            }
          } else if (isSelected) {
            optCls = 'border-accent/50 bg-accent/10'
            markCls = 'border-accent/50 bg-accent/20 text-accent'
          }

          return (
            <li key={origIdx}>
              <button
                type="button"
                disabled={revealed}
                onClick={() => onSelect(origIdx)}
                className={`flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors focus-accent disabled:cursor-default ${optCls}`}
              >
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded border font-mono text-[11px] ${markCls}`}
                >
                  {LETTERS[pos]}
                </span>
                <span className="text-[15px] leading-relaxed text-primary/90">
                  {opt}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      {revealed && (
        <div className="mt-4 rounded-md border border-border bg-base p-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
            {isAnswerCorrect(question, selected || []) ? (
              <span className="text-accent">Correct</span>
            ) : (
              <span className="text-red-300">Incorrect</span>
            )}
            {' · '}Explanation
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  )
}

// ---- Results screen ------------------------------------------------------

function DomainBreakdown({ perDomain }) {
  return (
    <div className="flex flex-col gap-3">
      {domains.map((d) => {
        const r = perDomain[d.id] || { correct: 0, total: 0 }
        const pct = r.total ? Math.round((r.correct / r.total) * 100) : 0
        return (
          <div key={d.id}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted">
                <span className="text-faint">D{d.id}</span> {d.title}
              </span>
              <span className="font-mono text-xs text-primary">
                {r.correct}/{r.total} · {pct}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
              <div
                className={`h-full rounded-full transition-[width] duration-700 ${
                  pct >= PASS_PERCENT ? 'bg-accent' : 'bg-amber-400'
                }`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ExamResults({ result, awardedXp, onReview, onRetake }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-5">
          <ProgressRing
            value={result.percent}
            max={100}
            size={96}
            stroke={6}
            label={`${result.percent}%`}
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-xl font-semibold text-primary">
                {result.passed ? 'Passed' : 'Not yet'}
              </h1>
              <Badge variant={result.passed ? 'complete' : 'locked'}>
                {result.passed ? '✓ Pass' : '✗ Fail'}
              </Badge>
            </div>
            <p className="mt-1 font-mono text-sm text-muted">
              {result.score} / {result.total} correct
            </p>
            <p className="mt-0.5 font-mono text-xs text-faint">
              Pass line {PASS_PERCENT}% · time taken {formatTime(result.timeTaken)}
            </p>
          </div>
        </div>
        {awardedXp > 0 && (
          <div className="rounded-md border border-accent/40 bg-accent/10 px-4 py-3 text-center">
            <p className="font-mono text-lg font-semibold text-accent">+{awardedXp} XP</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
              First pass bonus
            </p>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-border bg-surface p-6">
        <h2 className="mb-4 font-mono text-sm uppercase tracking-widest text-faint">
          Per-domain breakdown
        </h2>
        <DomainBreakdown perDomain={result.perDomain} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onReview}
          className="rounded-md border border-accent/50 bg-accent/10 px-5 py-2.5 font-mono text-sm font-semibold text-accent transition-colors hover:bg-accent/20 focus-accent"
        >
          Review all answers ›
        </button>
        <button
          type="button"
          onClick={onRetake}
          className="rounded-md border border-border bg-surface px-5 py-2.5 font-mono text-sm text-muted transition-colors hover:text-primary focus-accent"
        >
          Retake exam
        </button>
        <Link
          to="/"
          className="rounded-md border border-border bg-surface px-5 py-2.5 text-center font-mono text-sm text-muted transition-colors hover:text-primary focus-accent"
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  )
}

// ---- Main page -----------------------------------------------------------

const PHASE = {
  INTRO: 'intro',
  ACTIVE: 'active',
  RESULTS: 'results',
  REVIEW: 'review',
}

export default function Exam() {
  const { recordExamAttempt, examPassed, examAttempts } = useProgress()

  const [phase, setPhase] = useState(PHASE.INTRO)
  const [practiceMode, setPracticeMode] = useState(false)

  const [order, setOrder] = useState([])
  const [optionOrders, setOptionOrders] = useState({})
  const [answers, setAnswers] = useState({})
  const [flagged, setFlagged] = useState(() => new Set())
  const [revealed, setRevealed] = useState(() => new Set()) // practice mode only
  const [current, setCurrent] = useState(0)

  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS)
  const [result, setResult] = useState(null)
  const [awardedXp, setAwardedXp] = useState(0)

  const startTsRef = useRef(0)
  const submitRef = useRef(() => {})

  const startExam = useCallback(() => {
    const shuffled = shuffle(examQuestions)
    setOrder(shuffled)
    // Randomize option order per question so correct answers aren't positionally
    // predictable; store the display->original index map for the whole attempt.
    const orders = {}
    for (const q of shuffled) {
      orders[q.id] = shuffle(q.options.map((_, i) => i))
    }
    setOptionOrders(orders)
    setAnswers({})
    setFlagged(new Set())
    setRevealed(new Set())
    setCurrent(0)
    setTimeLeft(EXAM_DURATION_SECONDS)
    setResult(null)
    setAwardedXp(0)
    startTsRef.current = Date.now()
    setPhase(PHASE.ACTIVE)
  }, [])

  const handleSubmit = useCallback(() => {
    setPhase((prevPhase) => {
      if (prevPhase !== PHASE.ACTIVE) return prevPhase

      let score = 0
      const perDomain = {}
      for (const q of order) {
        if (!perDomain[q.domain]) perDomain[q.domain] = { correct: 0, total: 0 }
        perDomain[q.domain].total += 1
        if (isAnswerCorrect(q, answers[q.id] || [])) {
          score += 1
          perDomain[q.domain].correct += 1
        }
      }
      const total = order.length
      const percent = total ? Math.round((score / total) * 100) : 0
      const passed = percent >= PASS_PERCENT
      const timeTaken = Math.min(
        EXAM_DURATION_SECONDS,
        Math.floor((Date.now() - startTsRef.current) / 1000),
      )

      const summary = {
        score,
        total,
        percent,
        passed,
        timeTaken,
        perDomain,
        practice: practiceMode,
        date: Date.now(),
      }
      setResult(summary)

      // Award the one-time pass bonus only on a real (timed) passing attempt,
      // and only if it hasn't already been earned.
      if (passed && !practiceMode && !examPassed) {
        setAwardedXp(EXAM_PASS_XP)
      } else {
        setAwardedXp(0)
      }
      // Persist every completed attempt (practice or timed) to history.
      recordExamAttempt(summary)

      return PHASE.RESULTS
    })
  }, [order, answers, practiceMode, examPassed, recordExamAttempt])

  // Keep a ref to the latest submit handler so the timer can call it.
  useEffect(() => {
    submitRef.current = handleSubmit
  }, [handleSubmit])

  // Countdown timer (timed mode only). Auto-submits at zero.
  useEffect(() => {
    if (phase !== PHASE.ACTIVE || practiceMode) return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          submitRef.current()
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [phase, practiceMode])

  const handleSelect = useCallback(
    (questionId, optionIndex, question) => {
      if (revealed.has(questionId)) return

      setAnswers((prev) => {
        const cur = prev[questionId] || []
        let next
        if (question.type === 'multi') {
          if (cur.includes(optionIndex)) {
            next = cur.filter((x) => x !== optionIndex)
          } else if (cur.length < 2) {
            next = [...cur, optionIndex]
          } else {
            next = cur // already two selected; ignore extra
          }
        } else {
          next = [optionIndex]
        }

        // Practice mode: reveal as soon as the question is fully answered.
        if (practiceMode && next.length >= requiredCount(question)) {
          setRevealed((r) => new Set(r).add(questionId))
        }
        return { ...prev, [questionId]: next }
      })
    },
    [practiceMode, revealed],
  )

  const toggleFlag = useCallback((questionId) => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) next.delete(questionId)
      else next.add(questionId)
      return next
    })
  }, [])

  const allAnswered = useMemo(
    () => order.length > 0 && order.every((q) => isAnswered(q, answers[q.id])),
    [order, answers],
  )
  const answeredCount = useMemo(
    () => order.filter((q) => isAnswered(q, answers[q.id])).length,
    [order, answers],
  )

  // ---- Render --------------------------------------------------------

  if (phase === PHASE.INTRO) {
    return (
      <div className="flex flex-col gap-6">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-1 font-mono text-xs text-muted hover:text-accent focus-accent"
        >
          ‹ Dashboard
        </Link>
        <ExamIntro
          practiceMode={practiceMode}
          setPracticeMode={setPracticeMode}
          onStart={startExam}
          attempts={examAttempts}
        />
      </div>
    )
  }

  if (phase === PHASE.RESULTS && result) {
    return (
      <ExamResults
        result={result}
        awardedXp={awardedXp}
        onReview={() => {
          setCurrent(0)
          setPhase(PHASE.REVIEW)
        }}
        onRetake={() => setPhase(PHASE.INTRO)}
      />
    )
  }

  const isReview = phase === PHASE.REVIEW
  const q = order[current]
  if (!q) return null

  const selected = answers[q.id] || []
  // In review every question is revealed; in practice mode, per the revealed set.
  const showAnswer = isReview || revealed.has(q.id)

  return (
    <div className="flex flex-col gap-5">
      {/* Header: timer / status bar */}
      <div className="sticky top-0 z-20 -mx-4 flex items-center justify-between gap-3 border-b border-border bg-base/95 px-4 py-3 backdrop-blur sm:mx-0 sm:rounded-lg sm:border">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="font-mono text-xs text-muted hover:text-accent focus-accent"
            title="Exit exam"
          >
            ‹ Exit
          </Link>
          <span className="font-mono text-xs text-faint">
            {isReview ? 'Review' : practiceMode ? 'Practice' : 'Timed exam'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-faint">
            {answeredCount}/{order.length} answered
          </span>
          {!isReview && !practiceMode && (
            <span
              className={`rounded border px-3 py-1 font-mono text-sm font-semibold tabular-nums ${
                timeLeft <= 300
                  ? 'border-red-500/50 bg-red-500/10 text-red-300'
                  : 'border-border bg-surface text-accent'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          )}
        </div>
      </div>

      <QuestionCard
        question={q}
        index={current}
        total={order.length}
        selected={selected}
        onSelect={(origIdx) => handleSelect(q.id, origIdx, q)}
        revealed={showAnswer}
        flagged={flagged.has(q.id)}
        onToggleFlag={isReview ? null : () => toggleFlag(q.id)}
        displayOrder={optionOrders[q.id]}
      />

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-primary focus-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          ‹ Prev
        </button>
        {current < order.length - 1 ? (
          <button
            type="button"
            onClick={() => setCurrent((c) => Math.min(order.length - 1, c + 1))}
            className="rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-primary focus-accent"
          >
            Next ›
          </button>
        ) : isReview ? (
          <button
            type="button"
            onClick={() => setPhase(PHASE.RESULTS)}
            className="rounded-md border border-accent/50 bg-accent/10 px-4 py-2 font-mono text-sm font-semibold text-accent transition-colors hover:bg-accent/20 focus-accent"
          >
            Back to results ›
          </button>
        ) : (
          <span className="font-mono text-xs text-faint">End of exam</span>
        )}
      </div>

      {/* Question grid + submit */}
      <div className="rounded-lg border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-mono text-[11px] uppercase tracking-widest text-faint">
            {isReview ? 'Jump to question' : 'Question navigator'}
          </h2>
          {!isReview && (
            <span className="font-mono text-[11px] text-faint">
              <span className="text-amber-300">⚑</span> flagged ·{' '}
              <span className="text-accent">▣</span> answered
            </span>
          )}
        </div>
        <QuestionGrid
          order={order}
          answers={answers}
          flagged={flagged}
          current={current}
          onJump={setCurrent}
          reviewResult={isReview}
        />

        {!isReview && (
          <div className="mt-5 border-t border-border pt-4">
            {allAnswered ? (
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full rounded-md border border-accent/50 bg-accent px-5 py-3 font-mono text-sm font-semibold text-base transition-colors hover:bg-accent/90 focus-accent"
              >
                Submit exam · {order.length} answered
              </button>
            ) : (
              <p className="text-center font-mono text-xs text-faint">
                Answer all {order.length} questions to submit
                {!practiceMode && ' (or wait for the timer)'} —{' '}
                {order.length - answeredCount} remaining.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
