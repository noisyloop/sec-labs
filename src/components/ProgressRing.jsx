// Thin SVG arc that fills as exercises complete — the app's signature element.
// Renders a faint full track plus an accent arc representing `value/max`.
export default function ProgressRing({
  value = 0,
  max = 1,
  size = 72,
  stroke = 4,
  showLabel = true,
  label,
  className = '',
}) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const ratio = max > 0 ? Math.min(Math.max(value / max, 0), 1) : 0
  const dash = circumference * ratio
  const center = size / 2
  const complete = ratio >= 1

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#272c35"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#00d4ff"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          style={{ transition: 'stroke-dasharray 600ms cubic-bezier(0.22, 1, 0.36, 1)' }}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono font-semibold leading-none ${
              complete ? 'text-accent' : 'text-primary'
            }`}
            style={{ fontSize: size * 0.26 }}
          >
            {label ?? `${value}/${max}`}
          </span>
        </div>
      )}
    </div>
  )
}
