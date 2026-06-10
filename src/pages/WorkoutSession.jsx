import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, Trophy, Plus } from 'lucide-react'
import { TAG_COLORS } from '../data/workouts'
import { getOrCreateSession, getExerciseLogs, upsertExerciseLog, completeSession, getLastWorkoutLogs } from '../lib/supabase'
import ExerciseCard from '../components/ExerciseCard'

export default function WorkoutSession({ profile, workout, onBack }) {
  const [sessionId, setSessionId] = useState(null)
  const [logs, setLogs] = useState({})
  const [lastLogs, setLastLogs] = useState({})
  const [saving, setSaving] = useState(false)
  const [finished, setFinished] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const tagColors = TAG_COLORS[workout.tag]

  useEffect(() => { initSession() }, [profile.id, workout.key])

  async function initSession() {
    try {
      const [session, prevLogs] = await Promise.all([
        getOrCreateSession(profile.id, workout.key, today),
        getLastWorkoutLogs(profile.id, workout.key),
      ])
      setSessionId(session.id)
      setLastLogs(prevLogs)
      if (session.completed_at) setFinished(true)
      const exerciseLogs = await getExerciseLogs(session.id)
      const map = {}
      exerciseLogs.forEach(l => { map[l.exercise_index] = l })
      setLogs(map)
    } catch (e) { console.error('Session init failed', e) }
  }

  const handleLogChange = useCallback(async (exerciseIndex, setsDone, loadKg) => {
    setLogs(prev => ({ ...prev, [exerciseIndex]: { sets_done: setsDone, load_kg: loadKg } }))
    if (!sessionId) return
    try { await upsertExerciseLog(sessionId, exerciseIndex, setsDone, loadKg) }
    catch (e) { console.error('Log save failed', e) }
  }, [sessionId])

  const totalExercises = workout.exercises.length
  const completedEx = workout.exercises.filter((_, i) => (logs[i]?.sets_done ?? 0) >= workout.exercises[i].sets).length
  const pct = totalExercises > 0 ? completedEx / totalExercises : 0

  async function handleFinish() {
    if (!sessionId) return
    setSaving(true)
    try { await completeSession(sessionId); setFinished(true) }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  /* ── Finished ─────────────────────────────────────── */
  if (finished) {
    return (
      <div
        className="min-h-screen flex flex-col safe-top"
        style={{ background: 'linear-gradient(160deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}
      >
        {/* Header */}
        <div
          className="px-5 pt-5 pb-4 sticky top-0 z-10"
          style={{ background: 'rgba(10,20,35,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
        >
          <button
            onClick={onBack}
            className="font-body text-sm mb-3 block"
            style={{ color: 'var(--text-1)', minHeight: 44, display: 'flex', alignItems: 'center' }}
          >
            ← Voltar
          </button>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center shrink-0 rounded-full"
              style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 0 24px rgba(34,197,94,0.4)' }}
            >
              <Trophy size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-white" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Treino concluído!
              </h1>
              <p className="text-xs font-body mt-0.5" style={{ color: 'var(--text-2)' }}>
                {workout.label} · {completedEx}/{totalExercises} exercícios
              </p>
            </div>
          </div>
        </div>

        {/* Exercise summary — read-only */}
        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto" style={{ paddingBottom: 120, overscrollBehavior: 'contain' }}>
          {workout.exercises.map((ex, i) => (
            <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <ExerciseCard
                exercise={ex}
                index={i}
                sessionId={sessionId}
                log={logs[i]}
                onLogChange={() => {}}
                readOnly
              />
            </div>
          ))}
        </div>

        {/* Novo treino CTA */}
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-6 safe-bottom"
          style={{ background: 'linear-gradient(0deg, var(--bg-0) 60%, transparent)' }}
        >
          <button
            onClick={onBack}
            className="w-full font-ui font-bold text-white text-base rounded-2xl flex items-center justify-center gap-2"
            style={{
              padding: '16px',
              background: 'linear-gradient(135deg, var(--accent), #1565d6)',
              boxShadow: '0 8px 24px rgba(41,121,255,0.4), 0 0 0 1px rgba(41,121,255,0.15)',
              transition: 'transform 0.15s var(--ease-out)',
            }}
            onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.98)' }}
            onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <Plus size={20} strokeWidth={2.5} />
            Novo treino
          </button>
        </div>
      </div>
    )
  }

  /* ── Session ──────────────────────────────────────── */
  return (
    <div
      className="min-h-screen flex flex-col safe-top"
      style={{ background: 'linear-gradient(160deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}
    >
      {/* Sticky header */}
      <div
        className="px-5 pt-5 pb-3 sticky top-0 z-10"
        style={{ background: 'rgba(10,20,35,0.92)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        <div className="flex items-center mb-3">
          <button
            onClick={onBack}
            className="font-body text-sm"
            style={{ color: 'var(--text-1)', minHeight: 44, display: 'flex', alignItems: 'center', paddingRight: 12 }}
          >
            ← Voltar
          </button>
          <div className="flex-1" />
          {tagColors && (
            <span className={`text-[11px] px-2.5 py-1 rounded-full font-ui font-semibold ${tagColors.bg} ${tagColors.text} border ${tagColors.border}`}>
              {workout.tag}
            </span>
          )}
        </div>

        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-0)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {workout.label}
        </h1>
        <p className="text-sm font-body mt-0.5" style={{ color: 'var(--text-1)' }}>{workout.focus}</p>

        {/* Progress */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 5, background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct * 100}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent-light))',
                transition: 'width 0.5s var(--ease-out)',
              }}
            />
          </div>
          <span className="text-xs font-ui font-semibold tabular-nums" style={{ color: 'var(--text-1)' }}>
            {completedEx}/{totalExercises}
          </span>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto" style={{ paddingBottom: 120, overscrollBehavior: 'contain' }}>
        {workout.exercises.map((ex, i) => (
          <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
            <ExerciseCard exercise={ex} index={i} sessionId={sessionId} log={logs[i]} onLogChange={handleLogChange} lastLoad={lastLogs[i] ?? null} />
          </div>
        ))}
      </div>

      {/* Finish CTA */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-6 safe-bottom"
        style={{ background: 'linear-gradient(0deg, var(--bg-0) 60%, transparent)' }}
      >
        <button
          onClick={handleFinish}
          disabled={saving}
          className="w-full font-ui font-bold text-white text-base rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60"
          style={{
            padding: '16px',
            background: pct === 1
              ? 'linear-gradient(135deg, #22c55e, #16a34a)'
              : 'linear-gradient(135deg, var(--accent), #1565d6)',
            boxShadow: pct === 1
              ? '0 8px 24px rgba(34,197,94,0.4), 0 0 0 1px rgba(34,197,94,0.2)'
              : '0 8px 24px rgba(41,121,255,0.35), 0 0 0 1px rgba(41,121,255,0.15)',
            transition: 'transform 0.15s var(--ease-out)',
          }}
          onPointerDown={e => { if (!saving) e.currentTarget.style.transform = 'scale(0.98)' }}
          onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          <CheckCircle2 size={20} strokeWidth={2.5} />
          {saving ? 'Salvando…' : pct === 1 ? 'Concluir treino' : `Finalizar (${completedEx}/${totalExercises})`}
        </button>
      </div>
    </div>
  )
}
