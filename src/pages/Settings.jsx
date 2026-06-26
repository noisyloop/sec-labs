import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProgress } from '../context/ProgressContext.jsx'
import Badge from '../components/Badge.jsx'

export default function Settings() {
  const { resetProgress, totalDone, totalExercises, xp, readiness, examAttempts } =
    useProgress()
  const [confirming, setConfirming] = useState(false)
  const hasProgress = totalDone > 0 || examAttempts.length > 0

  function handleReset() {
    resetProgress()
    setConfirming(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        to="/"
        className="inline-flex w-fit items-center gap-1 font-mono text-xs text-muted hover:text-accent focus-accent"
      >
        ‹ Dashboard
      </Link>

      <div>
        <h1 className="font-mono text-2xl font-semibold text-primary">Settings</h1>
        <p className="mt-1 text-sm text-muted">
          sec-labs stores all progress locally in your browser — no account, no server.
        </p>
      </div>

      <section className="rounded-lg border border-border bg-surface p-6">
        <h2 className="font-mono text-sm uppercase tracking-widest text-faint">
          Your progress
        </h2>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div>
            <p className="font-mono text-2xl font-semibold text-primary">
              {totalDone}
              <span className="text-base text-faint">/{totalExercises}</span>
            </p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
              Labs done
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-accent">{xp}</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
              Total XP
            </p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold text-primary">{readiness}%</p>
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">
              Exam-ready
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-6">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-sm uppercase tracking-widest text-faint">
            Reset progress
          </h2>
          <Badge variant="locked">irreversible</Badge>
        </div>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          This clears every completed lab, your XP, exam attempt history, and
          locked/unlocked state from this browser. It cannot be undone.
        </p>

        {!confirming ? (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!hasProgress}
            className="mt-4 rounded-md border border-border bg-base px-4 py-2 font-mono text-sm text-muted transition-colors hover:border-red-500/40 hover:text-red-400 focus-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reset all progress
          </button>
        ) : (
          <div className="mt-4 flex flex-col gap-3 rounded-md border border-red-500/30 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-sm text-red-300">
              Erase all progress? This can&rsquo;t be undone.
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="rounded-md border border-border bg-surface px-4 py-2 font-mono text-sm text-muted transition-colors hover:text-primary focus-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-md border border-red-500/50 bg-red-500/20 px-4 py-2 font-mono text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/30 focus-accent"
              >
                Yes, reset everything
              </button>
            </div>
          </div>
        )}
      </section>

      <p className="font-mono text-[11px] leading-relaxed text-faint">
        sec-labs is a personal study tool. All labs are for authorized, educational use
        only — only ever test systems and accounts you own or have written permission to
        test.
      </p>
    </div>
  )
}
