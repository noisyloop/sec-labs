import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { domains } from '../data/domains.js'
import { useProgress } from '../context/ProgressContext.jsx'

function Logo() {
  return (
    <NavLink to="/" className="flex items-center gap-2 focus-accent rounded">
      <span className="flex h-8 w-8 items-center justify-center rounded border border-border bg-elevated font-mono text-accent">
        {'>'}
      </span>
      <span className="font-mono text-lg font-semibold tracking-tight text-primary">
        sec<span className="text-accent">-</span>labs
      </span>
    </NavLink>
  )
}

function DomainLinks({ onNavigate }) {
  const { domainProgress } = useProgress()
  return (
    <nav className="flex flex-col gap-0.5">
      <p className="px-3 pb-2 pt-1 font-mono text-[11px] uppercase tracking-widest text-faint">
        Domains
      </p>
      {domains.map((d) => {
        const p = domainProgress[d.id]
        return (
          <NavLink
            key={d.id}
            to={`/domain/${d.id}`}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors focus-accent ${
                isActive
                  ? 'bg-elevated text-primary'
                  : 'text-muted hover:bg-surface hover:text-primary'
              }`
            }
          >
            <span className="font-mono text-xs text-faint">{d.id}</span>
            <span className="flex-1 truncate leading-tight">{d.title}</span>
            <span
              className={`font-mono text-[11px] ${
                p.complete ? 'text-accent' : 'text-faint'
              }`}
            >
              {p.done}/{p.total}
            </span>
          </NavLink>
        )
      })}
    </nav>
  )
}

function XpBadge() {
  const { xp, readiness } = useProgress()
  return (
    <div className="rounded border border-border bg-surface p-3">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-faint">
          Total XP
        </span>
        <span className="font-mono text-sm font-semibold text-accent">{xp}</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${readiness}%` }}
        />
      </div>
      <p className="mt-1.5 font-mono text-[11px] text-muted">{readiness}% exam-ready</p>
    </div>
  )
}

function SidebarBody({ onNavigate }) {
  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Logo />
      <DomainLinks onNavigate={onNavigate} />
      <div className="mt-auto flex flex-col gap-3">
        <XpBadge />
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded px-3 py-2 text-sm transition-colors focus-accent ${
              isActive ? 'bg-elevated text-primary' : 'text-muted hover:text-primary'
            }`
          }
        >
          <span className="font-mono text-xs text-faint">⚙</span> Settings
        </NavLink>
      </div>
    </div>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close the mobile drawer on route change.
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-base/95 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle navigation"
          aria-expanded={open}
          className="flex h-9 w-9 items-center justify-center rounded border border-border text-muted focus-accent"
        >
          <span className="font-mono text-lg leading-none">{open ? '×' : '≡'}</span>
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-border bg-base">
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop fixed sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-border bg-base md:fixed md:inset-y-0 md:left-0 md:block">
        <SidebarBody />
      </aside>
    </>
  )
}
