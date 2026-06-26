import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  domains,
  allExercises,
  TOTAL_EXERCISES,
  XP_PER_EXERCISE,
} from '../data/domains.js'

const STORAGE_KEY = 'sec-labs:progress:v1'

const ProgressContext = createContext(null)

function loadCompleted() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed?.completed)) {
      // Keep only ids we still recognize, in case content changes.
      const valid = new Set(allExercises.map((e) => e.id))
      return parsed.completed.filter((id) => valid.has(id))
    }
    return []
  } catch {
    return []
  }
}

export function ProgressProvider({ children }) {
  const [completed, setCompleted] = useState(loadCompleted)

  // Persist on every change.
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ completed, updatedAt: Date.now() }),
      )
    } catch {
      // Storage may be unavailable (private mode); fail silently.
    }
  }, [completed])

  const completedSet = useMemo(() => new Set(completed), [completed])

  const isComplete = useCallback((id) => completedSet.has(id), [completedSet])

  // Within a domain, exercises unlock sequentially. The first exercise is
  // always unlocked; each subsequent one unlocks when its predecessor is done.
  const isUnlocked = useCallback(
    (domainId, exerciseId) => {
      const domain = domains.find((d) => d.id === String(domainId))
      if (!domain) return false
      const index = domain.exercises.findIndex((e) => e.id === String(exerciseId))
      if (index <= 0) return true
      const prev = domain.exercises[index - 1]
      return completedSet.has(prev.id)
    },
    [completedSet],
  )

  const completeExercise = useCallback((id) => {
    setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }, [])

  const uncompleteExercise = useCallback((id) => {
    setCompleted((prev) => prev.filter((x) => x !== id))
  }, [])

  const resetProgress = useCallback(() => setCompleted([]), [])

  // Per-domain completion counts.
  const domainProgress = useMemo(() => {
    const map = {}
    for (const domain of domains) {
      const total = domain.exercises.length
      const done = domain.exercises.filter((e) => completedSet.has(e.id)).length
      map[domain.id] = { done, total, complete: done === total }
    }
    return map
  }, [completedSet])

  const totalDone = completed.length
  const xp = totalDone * XP_PER_EXERCISE
  const readiness = Math.round((totalDone / TOTAL_EXERCISES) * 100)

  // The next incomplete exercise, respecting domain + sequence order.
  const nextExercise = useMemo(() => {
    for (const ex of allExercises) {
      if (!completedSet.has(ex.id)) return ex
    }
    return null
  }, [completedSet])

  const value = {
    completed,
    completedSet,
    isComplete,
    isUnlocked,
    completeExercise,
    uncompleteExercise,
    resetProgress,
    domainProgress,
    totalDone,
    totalExercises: TOTAL_EXERCISES,
    xp,
    readiness,
    nextExercise,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within a ProgressProvider')
  return ctx
}
