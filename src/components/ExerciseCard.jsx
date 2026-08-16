import { useEffect, useRef, useState } from 'react'
import { Check, Pencil, Trash2 } from 'lucide-react'

// Aceita vírgula (teclado pt-BR). Campo vazio ou meio digitado ("12,") vira null.
function parseLoad(text) {
  const n = parseFloat(String(text).replace(',', '.'))
  return Number.isFinite(n) ? n : null
}

export default function ExerciseCard({
  exercise, index, log, onLogChange,
  readOnly = false, lastLoad = null,
  editing = false, onEdit, onDelete,
}) {
  const setsDone  = log?.sets_done ?? 0
  const savedLoad = log?.load_kg ?? null
  const allDone   = setsDone >= exercise.sets

  // draft = texto enquanto digita; null = espelha o valor salvo
  const [draft, setDraft] = useState(null)
  const loadText = draft ?? (savedLoad == null ? '' : String(savedLoad))

  const timer = useRef(null)
  const setsRef = useRef(setsDone)
  useEffect(() => { setsRef.current = setsDone }, [setsDone])
  useEffect(() => () => clearTimeout(timer.current), [])

  function commitLoad(text) {
    clearTimeout(timer.current)
    setDraft(null)
    onLogChange(exercise.id, setsRef.current, parseLoad(text))
  }

  function handleSetToggle(setIdx) {
    if (readOnly || editing) return
    const newSetsDone = setIdx < setsDone ? setIdx : setIdx + 1
    onLogChange(exercise.id, newSetsDone, parseLoad(loadText))
  }

  // Grava 600ms depois da última tecla, em vez de a cada dígito
  function handleLoad(e) {
    const val = e.target.value
    setDraft(val)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => commitLoad(val), 600)
  }

  function handleLoadBlur() {
    if (draft !== null) commitLoad(draft)
  }

  return (
    <div
      className={`rounded-2xl overflow-hidden ${allDone && !editing ? 'opacity-80' : ''}`}
      style={{
        background: allDone && !editing ? 'linear-gradient(135deg, #132918, #0f2214)' : 'var(--bg-card)',
        border:     allDone && !editing ? '1px solid rgba(34,197,94,0.2)' : '1px solid var(--border)',
        transition: 'opacity 0.3s var(--ease-out)',
      }}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="flex items-center justify-center shrink-0 rounded-lg text-sm font-ui font-bold"
            style={{
              width: 36, height: 36,
              background: allDone && !editing ? 'rgba(34,197,94,0.15)' : 'var(--accent-dim)',
              color:      allDone && !editing ? '#4ade80' : 'var(--accent)',
              transition: 'background 0.25s var(--ease-out), color 0.25s var(--ease-out)',
            }}
          >
            {allDone && !editing ? <Check size={16} strokeWidth={2.5} /> : index + 1}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-ui font-semibold leading-snug" style={{ color: allDone && !editing ? '#86efac' : 'var(--text-0)' }}>
              {exercise.name}
            </p>
            <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--text-1)' }}>
              {exercise.sets} séries · {exercise.reps} reps
            </p>
          </div>

          {/* Edit controls */}
          {editing && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(exercise)}
                aria-label="Editar exercício"
                className="flex items-center justify-center rounded-lg"
                style={{ width: 36, height: 36, background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(exercise)}
                aria-label="Remover exercício"
                className="flex items-center justify-center rounded-lg"
                style={{ width: 36, height: 36, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        {/* Sets row — hidden in edit mode */}
        {!editing && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {Array.from({ length: exercise.sets }).map((_, i) => {
              const done = i < setsDone
              return (
                <button
                  key={i}
                  onClick={() => handleSetToggle(i)}
                  aria-label={`Série ${i + 1}${done ? ' — feita' : ''}`}
                  className="font-ui font-semibold text-sm rounded-xl"
                  style={{
                    width: 44, height: 44,
                    background:  done ? '#22c55e' : 'rgba(255,255,255,0.05)',
                    border:      done ? 'none' : '1px solid var(--border)',
                    color:       done ? '#fff' : 'var(--text-1)',
                    boxShadow:   done ? '0 4px 12px rgba(34,197,94,0.3)' : 'none',
                    transition:  'background 0.2s var(--ease-out), box-shadow 0.2s var(--ease-out)',
                  }}
                >
                  {done ? <Check size={16} className="mx-auto" strokeWidth={2.5} /> : i + 1}
                </button>
              )
            })}

            {/* Load */}
            <div className="flex items-center gap-1.5 ml-auto">
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  enterKeyHint="done"
                  value={loadText}
                  onChange={handleLoad}
                  onBlur={handleLoadBlur}
                  placeholder={lastLoad != null ? String(lastLoad) : '0'}
                  readOnly={readOnly}
                  aria-label="Carga em kg"
                  className="font-ui font-semibold text-center bg-transparent outline-none rounded-xl"
                  style={{
                    width: 60, height: 44,
                    border: '1px solid var(--border)',
                    background: 'rgba(255,255,255,0.03)',
                    color: 'var(--text-0)',
                    fontSize: 15,
                  }}
                />
                {lastLoad != null && !loadText && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 font-ui text-[9px] font-semibold"
                    style={{ color: 'var(--text-2)', bottom: 4, pointerEvents: 'none', whiteSpace: 'nowrap' }}
                  >
                    última: {lastLoad}
                  </span>
                )}
              </div>
              <span className="text-xs font-body" style={{ color: 'var(--text-1)' }}>kg</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
