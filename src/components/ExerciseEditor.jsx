import { useState } from 'react'

const FIELD = {
  border: '1px solid var(--border)',
  background: 'rgba(255,255,255,0.03)',
  color: 'var(--text-0)',
  borderRadius: 12,
  height: 44,
  padding: '0 12px',
  fontSize: 15,
  width: '100%',
  outline: 'none',
}

export default function ExerciseEditor({ exercise, onSave, onClose }) {
  const isEdit = !!exercise?.id
  const [name, setName] = useState(exercise?.name ?? '')
  const [sets, setSets] = useState(exercise?.sets ?? 3)
  const [reps, setReps] = useState(exercise?.reps ?? '10–12')
  const [rest, setRest] = useState(exercise?.rest ?? 60)
  const [busy, setBusy] = useState(false)

  const valid = name.trim().length > 0 && Number(sets) >= 1

  async function handleSave() {
    if (!valid || busy) return
    setBusy(true)
    await onSave({
      name: name.trim(),
      sets: Math.max(1, parseInt(sets) || 1),
      reps: reps.trim(),
      rest: Math.max(0, parseInt(rest) || 0),
    })
    setBusy(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] px-5 pb-8 safe-bottom animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
          <div className="p-5 space-y-4">
            <p className="font-ui font-bold text-base text-white">
              {isEdit ? 'Editar exercício' : 'Novo exercício'}
            </p>

            <label className="block">
              <span className="text-xs font-ui font-semibold" style={{ color: 'var(--text-2)' }}>Nome</span>
              <input
                autoFocus={!isEdit}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Ex: Supino reto com barra"
                className="mt-1.5"
                style={FIELD}
              />
            </label>

            <div className="flex gap-3">
              <label className="block flex-1">
                <span className="text-xs font-ui font-semibold" style={{ color: 'var(--text-2)' }}>Séries</span>
                <input
                  type="number" inputMode="numeric" min="1" step="1"
                  value={sets}
                  onChange={e => setSets(e.target.value)}
                  className="mt-1.5"
                  style={{ ...FIELD, textAlign: 'center' }}
                />
              </label>
              <label className="block flex-[1.4]">
                <span className="text-xs font-ui font-semibold" style={{ color: 'var(--text-2)' }}>Reps</span>
                <input
                  value={reps}
                  onChange={e => setReps(e.target.value)}
                  placeholder="8–10"
                  className="mt-1.5"
                  style={{ ...FIELD, textAlign: 'center' }}
                />
              </label>
              <label className="block flex-1">
                <span className="text-xs font-ui font-semibold" style={{ color: 'var(--text-2)' }}>Desc. (s)</span>
                <input
                  type="number" inputMode="numeric" min="0" step="5"
                  value={rest}
                  onChange={e => setRest(e.target.value)}
                  className="mt-1.5"
                  style={{ ...FIELD, textAlign: 'center' }}
                />
              </label>
            </div>
          </div>

          <div className="flex" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              onClick={onClose}
              className="flex-1 py-4 font-ui font-semibold text-sm"
              style={{ color: 'var(--text-1)' }}
            >
              Cancelar
            </button>
            <div style={{ width: 1, background: 'var(--border)' }} />
            <button
              onClick={handleSave}
              disabled={!valid || busy}
              className="flex-1 py-4 font-ui font-bold text-sm disabled:opacity-40"
              style={{ color: 'var(--accent)' }}
            >
              {busy ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
