import { Timer, X } from 'lucide-react'

export default function RestTimer({ seconds, running, progress, onStart, onStop, restSeconds }) {
  const r = 27
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - progress)
  const urgent = seconds <= 5 && running
  const color = urgent ? '#ef4444' : 'var(--accent)'

  if (!running && seconds === 0) {
    return (
      <button
        onClick={() => onStart(restSeconds)}
        aria-label={`Iniciar descanso de ${restSeconds} segundos`}
        className="flex items-center gap-2 font-ui font-semibold text-xs rounded-xl"
        style={{
          padding: '10px 14px',
          background: 'var(--accent-dim)',
          color: 'var(--accent)',
          border: '1px solid var(--accent-border)',
          transition: 'background 0.2s var(--ease-out)',
          minHeight: 40,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(41,121,255,0.2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--accent-dim)' }}
      >
        <Timer size={13} strokeWidth={2.5} />
        Descanso {restSeconds}s
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0" style={{ width: 56, height: 56 }}>
        <svg className="w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 64 64">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="4" />
          <circle
            cx="32" cy="32" r={r}
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s var(--ease-out)' }}
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center font-display font-bold text-sm tabular-nums"
          style={{ color }}
        >
          {seconds}
        </span>
      </div>
      <div className="flex-1">
        <p className="text-xs font-body" style={{ color: 'var(--text-2)' }}>Descansando…</p>
        <p className="text-sm font-ui font-semibold" style={{ color: 'var(--text-0)' }}>{restSeconds}s</p>
      </div>
      <button
        onClick={onStop}
        aria-label="Cancelar descanso"
        className="flex items-center justify-center rounded-full"
        style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.06)', color: 'var(--text-2)', transition: 'background 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
