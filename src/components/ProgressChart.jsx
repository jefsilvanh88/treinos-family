import { useMemo } from 'react'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function fmtDate(dateStr) {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]}`
}

function fmtMonth(dateStr) {
  const [y, m] = dateStr.split('-')
  return `${MONTHS[parseInt(m) - 1]}/${y.slice(2)}`
}

const PAD = { top: 24, right: 20, bottom: 36, left: 40 }
const W = 340

export default function ProgressChart({ data, height = 160, monthly = false }) {
  const filtered = useMemo(() => (data || []).filter(d => d.load_kg != null), [data])

  if (filtered.length < 2) {
    return (
      <div
        className="flex items-center justify-center font-body text-sm"
        style={{ height, color: 'var(--text-2)' }}
      >
        {filtered.length === 1 ? '1 registro — faça mais treinos para ver o gráfico' : 'Sem dados ainda'}
      </div>
    )
  }

  const innerW = W - PAD.left - PAD.right
  const innerH = height - PAD.top - PAD.bottom

  const maxKg = Math.max(...filtered.map(d => d.load_kg))
  const minKg = Math.min(...filtered.map(d => d.load_kg))
  const range = maxKg - minKg || maxKg * 0.1 || 1

  const pts = filtered.map((d, i) => ({
    x: PAD.left + (i / (filtered.length - 1)) * innerW,
    y: PAD.top + innerH - ((d.load_kg - minKg) / range) * innerH,
    ...d,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts[pts.length - 1].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} L${pts[0].x.toFixed(1)},${(PAD.top + innerH).toFixed(1)} Z`

  const last = pts[pts.length - 1]
  const first = pts[0]
  const gained = last.load_kg - first.load_kg
  const gainedSign = gained > 0 ? '+' : ''

  const yTicks = [minKg, maxKg]
  if (range > 0) {
    const mid = Math.round((minKg + maxKg) / 2)
    if (mid !== minKg && mid !== maxKg) yTicks.splice(1, 0, mid)
  }

  return (
    <div>
      {gained !== 0 && (
        <p className="text-xs font-ui font-semibold mb-2" style={{ color: gained >= 0 ? '#4ade80' : '#f87171' }}>
          {gainedSign}{gained.toFixed(1)} kg desde o início
        </p>
      )}
      <svg viewBox={`0 0 ${W} ${height}`} width="100%" height={height} style={{ overflow: 'visible', display: 'block' }}>
        <defs>
          <linearGradient id="pcFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2979ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#2979ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid */}
        {yTicks.map(v => {
          const cy = PAD.top + innerH - ((v - minKg) / range) * innerH
          return (
            <g key={v}>
              <line
                x1={PAD.left} y1={cy.toFixed(1)}
                x2={W - PAD.right} y2={cy.toFixed(1)}
                stroke="rgba(255,255,255,0.06)" strokeWidth={1}
              />
              <text
                x={PAD.left - 6} y={cy.toFixed(1)}
                textAnchor="end" dominantBaseline="middle"
                fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="'Barlow', system-ui"
              >
                {v}
              </text>
            </g>
          )
        })}

        {/* Area + line */}
        <path d={areaPath} fill="url(#pcFill)" />
        <path d={linePath} fill="none" stroke="#2979ff" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />

        {/* Dots — all small, last prominent */}
        {pts.map((p, i) => {
          const isLast = i === pts.length - 1
          return (
            <circle
              key={i}
              cx={p.x.toFixed(1)} cy={p.y.toFixed(1)}
              r={isLast ? 5 : 3}
              fill={isLast ? '#2979ff' : 'var(--bg-0)'}
              stroke="#2979ff" strokeWidth={2}
            />
          )
        })}

        {/* Last value label */}
        <text
          x={last.x.toFixed(1)} y={(last.y - 12).toFixed(1)}
          textAnchor={last.x > W - PAD.right - 30 ? 'end' : 'middle'}
          fill="#5c9bff" fontSize={12} fontWeight="700" fontFamily="'Barlow', system-ui"
        >
          {last.load_kg} kg
        </text>

        {/* X labels */}
        {monthly ? (
          pts.map((p, i) => (
            <text
              key={i}
              x={p.x.toFixed(1)} y={height - 4}
              textAnchor={i === 0 ? 'start' : i === pts.length - 1 ? 'end' : 'middle'}
              fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="'Barlow', system-ui"
            >
              {fmtMonth(p.date)}
            </text>
          ))
        ) : (
          <>
            <text
              x={first.x.toFixed(1)} y={height - 4}
              textAnchor="middle"
              fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="'Barlow', system-ui"
            >
              {fmtDate(first.date)}
            </text>
            {filtered.length > 2 && (
              <text
                x={last.x.toFixed(1)} y={height - 4}
                textAnchor="middle"
                fill="rgba(255,255,255,0.3)" fontSize={10} fontFamily="'Barlow', system-ui"
              >
                {fmtDate(last.date)}
              </text>
            )}
          </>
        )}
      </svg>
    </div>
  )
}
