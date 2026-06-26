// Small monospace pill, used for exam objective codes and status tags.
export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'border-border bg-surface text-muted',
    accent: 'border-accent/40 bg-accent/10 text-accent',
    complete: 'border-accent/40 bg-accent/10 text-accent',
    locked: 'border-border bg-surface text-faint',
  }
  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[11px] font-medium tracking-wide ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
