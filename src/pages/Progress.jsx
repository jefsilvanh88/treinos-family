import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'
import { WORKOUTS } from '../data/workouts'
import { getExercises, getExerciseHistory } from '../lib/supabase'
import ProgressChart from '../components/ProgressChart'

function groupByMonth(data) {
  const map = {}
  ;(data || []).forEach(d => {
    if (d.load_kg == null) return
    const key = d.date.slice(0, 7)
    if (!map[key] || d.load_kg > map[key].load_kg) {
      map[key] = { ...d, date: key + '-01' }
    }
  })
  return Object.values(map).sort((a, b) => a.date.localeCompare(b.date))
}

export default function Progress({ profile, onBack }) {
  const workoutList = Object.values(WORKOUTS[profile.key] || {})
  const [activeKey, setActiveKey] = useState(workoutList[0]?.key || null)
  const [exByWorkout, setExByWorkout] = useState({}) // workoutKey -> exercises[]
  const [expanded, setExpanded] = useState(null)      // exercise id
  const [cache, setCache] = useState({})              // exercise id -> history[]
  const [loading, setLoading] = useState({})

  const exercises = exByWorkout[activeKey] || []

  // Carrega lista de exercícios do treino ativo
  useEffect(() => {
    if (!activeKey || exByWorkout[activeKey]) return
    getExercises(profile.id, activeKey)
      .then(list => setExByWorkout(prev => ({ ...prev, [activeKey]: list })))
      .catch(() => setExByWorkout(prev => ({ ...prev, [activeKey]: [] })))
  }, [activeKey, profile.id, exByWorkout])

  const loadHistory = useCallback(async (exerciseId) => {
    if (cache[exerciseId] !== undefined || loading[exerciseId]) return
    setLoading(prev => ({ ...prev, [exerciseId]: true }))
    try {
      const data = await getExerciseHistory(profile.id, exerciseId)
      setCache(prev => ({ ...prev, [exerciseId]: data }))
    } catch {
      setCache(prev => ({ ...prev, [exerciseId]: [] }))
    } finally {
      setLoading(prev => ({ ...prev, [exerciseId]: false }))
    }
  }, [profile.id, cache, loading])

  // Pré-carrega histórico dos exercícios do treino ativo
  useEffect(() => {
    exercises.forEach(ex => loadHistory(ex.id))
  }, [exercises]) // eslint-disable-line react-hooks/exhaustive-deps

  function handleExpand(id) {
    if (expanded === id) { setExpanded(null); return }
    setExpanded(id)
    loadHistory(id)
  }

  return (
    <div
      className="min-h-screen flex flex-col safe-top"
      style={{ background: 'linear-gradient(160deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <button
          onClick={onBack}
          className="font-body text-sm mb-4 block"
          style={{ color: 'var(--text-1)', minHeight: 44, display: 'flex', alignItems: 'center' }}
        >
          ← Voltar
        </button>
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center shrink-0 rounded-xl"
            style={{ width: 40, height: 40, background: 'var(--accent-dim)' }}
          >
            <TrendingUp size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-0)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Progresso
            </h1>
            <p className="text-xs font-body" style={{ color: 'var(--text-2)' }}>
              {profile.name} · carga máxima por mês, por exercício
            </p>
          </div>
        </div>
      </div>

      {/* Workout tabs */}
      <div className="px-5 pb-3">
        <div className="flex gap-2 flex-wrap">
          {workoutList.map(w => (
            <button
              key={w.key}
              onClick={() => { setActiveKey(w.key); setExpanded(null) }}
              className="font-ui font-semibold text-sm rounded-xl px-4"
              style={{
                height: 36,
                background: activeKey === w.key ? 'var(--accent-dim)' : 'rgba(255,255,255,0.05)',
                color: activeKey === w.key ? 'var(--accent)' : 'var(--text-2)',
                border: activeKey === w.key ? '1px solid var(--accent-border)' : '1px solid var(--border)',
                transition: 'all 0.2s var(--ease-out)',
              }}
            >
              {w.label}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise list */}
      <div className="flex-1 px-5 pb-8 space-y-2 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
        {exercises.map((ex, i) => {
          const history = cache[ex.id] || []
          const isLoading = loading[ex.id]
          const isOpen = expanded === ex.id
          const lastLoad = history.slice(-1)[0]?.load_kg ?? null
          const hasData = history.length >= 2

          return (
            <div
              key={ex.id}
              className="rounded-2xl overflow-hidden animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s`, background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => handleExpand(ex.id)}
                aria-expanded={isOpen}
                className="w-full text-left"
                style={{ minHeight: 64 }}
              >
                <div className="p-4 flex items-center gap-3">
                  <div
                    className="flex items-center justify-center shrink-0 rounded-lg"
                    style={{ width: 36, height: 36, background: hasData ? 'var(--accent-dim)' : 'rgba(255,255,255,0.04)' }}
                  >
                    <TrendingUp size={16} style={{ color: hasData ? 'var(--accent)' : 'var(--text-2)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-ui font-semibold text-sm leading-snug" style={{ color: 'var(--text-0)' }}>
                      {ex.name}
                    </p>
                    <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--text-2)' }}>
                      {isLoading
                        ? 'Carregando…'
                        : history.length > 0
                          ? `${history.length} registro${history.length > 1 ? 's' : ''}${lastLoad ? ` · último: ${lastLoad} kg` : ''}`
                          : 'Sem registros ainda'}
                    </p>
                  </div>
                  {isOpen
                    ? <ChevronUp size={16} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                    : <ChevronDown size={16} style={{ color: 'var(--text-2)', flexShrink: 0 }} />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 animate-fade-in" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="pt-3">
                    {isLoading ? (
                      <div className="flex justify-center" style={{ height: 160, alignItems: 'center' }}>
                        <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent-border)', borderTopColor: 'var(--accent)' }} />
                      </div>
                    ) : (
                      <ProgressChart data={groupByMonth(history)} height={160} monthly />
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {exercises.length === 0 && (
          <p className="text-center text-sm font-body pt-10" style={{ color: 'var(--text-2)' }}>
            Sem exercícios neste treino.
          </p>
        )}
      </div>
    </div>
  )
}
