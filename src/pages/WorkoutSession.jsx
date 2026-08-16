import { useState, useEffect, useCallback } from 'react'
import { CheckCircle2, Trophy, Plus, Pencil, Check, AlertTriangle } from 'lucide-react'
import { TAG_COLORS } from '../data/workouts'
import {
  getOrCreateSession, getExerciseLogs, upsertExerciseLog, completeSession,
  getLastLoads, getExercises, addExercise, updateExercise, archiveExercise,
} from '../lib/supabase'
import ExerciseCard from '../components/ExerciseCard'
import ExerciseEditor from '../components/ExerciseEditor'

export default function WorkoutSession({ profile, workout, onBack }) {
  const [sessionId, setSessionId] = useState(null)
  const [exercises, setExercises] = useState([])
  const [logs, setLogs] = useState({})           // keyed by exercise_id
  const [lastLoads, setLastLoads] = useState({})  // keyed by exercise_id
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [finished, setFinished] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editorEx, setEditorEx] = useState(null)  // null=fechado, {}=novo, {..}=editar
  const [saveError, setSaveError] = useState(false)

  const today = new Date().toISOString().split('T')[0]
  const tagColors = TAG_COLORS[workout.tag]

  useEffect(() => { initSession() }, [profile.id, workout.key])

  async function initSession() {
    setLoading(true)
    try {
      const [session, prevLoads, exList] = await Promise.all([
        getOrCreateSession(profile.id, workout.key, today),
        getLastLoads(profile.id, workout.key),
        getExercises(profile.id, workout.key),
      ])
      setSessionId(session.id)
      setLastLoads(prevLoads)
      setExercises(exList)
      if (session.completed_at) setFinished(true)
      const exerciseLogs = await getExerciseLogs(session.id)
      const map = {}
      exerciseLogs.forEach(l => { if (l.exercise_id) map[l.exercise_id] = l })
      setLogs(map)
    } catch (e) { console.error('Session init failed', e) }
    finally { setLoading(false) }
  }

  const handleLogChange = useCallback(async (exerciseId, setsDone, loadKg) => {
    setLogs(prev => ({ ...prev, [exerciseId]: { sets_done: setsDone, load_kg: loadKg } }))
    if (!sessionId) return
    try {
      await upsertExerciseLog(sessionId, exerciseId, setsDone, loadKg)
      setSaveError(false)
    } catch (e) {
      // Silenciar aqui já custou 5 semanas de treino sem carga gravada
      console.error('Log save failed', e)
      setSaveError(true)
    }
  }, [sessionId])

  async function handleSaveExercise(fields) {
    try {
      if (editorEx?.id) {
        const updated = await updateExercise(editorEx.id, fields)
        setExercises(prev => prev.map(e => e.id === updated.id ? updated : e))
      } else {
        const created = await addExercise(profile.id, workout.key, fields)
        setExercises(prev => [...prev, created])
      }
      setEditorEx(null)
    } catch (e) { console.error('Save exercise failed', e); alert('Não deu pra salvar. Tente de novo.') }
  }

  async function handleDeleteExercise(ex) {
    if (!confirm(`Remover "${ex.name}"?`)) return
    try {
      await archiveExercise(ex.id)
      setExercises(prev => prev.filter(e => e.id !== ex.id))
    } catch (e) { console.error('Delete exercise failed', e) }
  }

  const totalExercises = exercises.length
  const completedEx = exercises.filter(ex => (logs[ex.id]?.sets_done ?? 0) >= ex.sets).length
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

        <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto" style={{ paddingBottom: 120, overscrollBehavior: 'contain' }}>
          {exercises.map((ex, i) => (
            <div key={ex.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.03}s` }}>
              <ExerciseCard exercise={ex} index={i} log={logs[ex.id]} onLogChange={() => {}} readOnly />
            </div>
          ))}
        </div>

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
          <button
            onClick={() => setEditing(v => !v)}
            className="flex items-center gap-1.5 rounded-xl px-3 font-ui font-semibold text-xs"
            style={{
              height: 36,
              background: editing ? 'var(--accent-dim)' : 'rgba(255,255,255,0.05)',
              color: editing ? 'var(--accent)' : 'var(--text-1)',
              border: editing ? '1px solid var(--accent-border)' : '1px solid var(--border)',
            }}
          >
            {editing ? <><Check size={14} strokeWidth={2.5} /> Concluir</> : <><Pencil size={14} /> Editar</>}
          </button>
        </div>

        <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-0)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          {workout.label}
        </h1>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-sm font-body" style={{ color: 'var(--text-1)' }}>{workout.focus}</p>
          {tagColors && (
            <span className={`text-[11px] px-2 py-0.5 rounded-full font-ui font-semibold ${tagColors.bg} ${tagColors.text} border ${tagColors.border}`}>
              {workout.tag}
            </span>
          )}
        </div>

        {/* Progress — só no modo treino */}
        {!editing && (
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
        )}

        {saveError && (
          <div
            className="mt-3 flex items-center gap-2 rounded-xl px-3 py-2"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            <AlertTriangle size={15} style={{ color: '#f87171', flexShrink: 0 }} />
            <p className="text-xs font-body" style={{ color: '#fca5a5' }}>
              Não deu pra salvar no servidor. Sem internet? O que você marcar agora pode se perder.
            </p>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto" style={{ paddingBottom: 120, overscrollBehavior: 'contain' }}>
        {loading ? (
          <div className="flex justify-center pt-10">
            <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: 'var(--accent-border)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : exercises.length === 0 ? (
          <div className="text-center pt-16 px-4">
            <p className="font-ui font-semibold text-lg" style={{ color: 'var(--text-1)' }}>Nenhum exercício ainda.</p>
            <p className="text-sm font-body mt-1" style={{ color: 'var(--text-2)' }}>Toque em “Adicionar exercício”.</p>
          </div>
        ) : (
          exercises.map((ex, i) => (
            <div key={ex.id} className="animate-slide-up" style={{ animationDelay: `${i * 0.04}s` }}>
              <ExerciseCard
                exercise={ex}
                index={i}
                log={logs[ex.id]}
                onLogChange={handleLogChange}
                lastLoad={lastLoads[ex.id] ?? null}
                editing={editing}
                onEdit={setEditorEx}
                onDelete={handleDeleteExercise}
              />
            </div>
          ))
        )}

        {/* Add exercise — só no modo edição */}
        {editing && !loading && (
          <button
            onClick={() => setEditorEx({})}
            className="w-full rounded-2xl flex items-center justify-center gap-2 font-ui font-semibold text-sm"
            style={{ padding: 16, background: 'rgba(255,255,255,0.03)', border: '1px dashed var(--accent-border)', color: 'var(--accent)' }}
          >
            <Plus size={18} strokeWidth={2.5} /> Adicionar exercício
          </button>
        )}
      </div>

      {/* Finish CTA — escondido no modo edição */}
      {!editing && (
        <div
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-5 pb-6 safe-bottom"
          style={{ background: 'linear-gradient(0deg, var(--bg-0) 60%, transparent)' }}
        >
          <button
            onClick={() => setShowConfirm(true)}
            disabled={saving || totalExercises === 0}
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
      )}

      {/* Exercise editor sheet */}
      {editorEx !== null && (
        <ExerciseEditor
          exercise={editorEx}
          onSave={handleSaveExercise}
          onClose={() => setEditorEx(null)}
        />
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.65)' }}
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-[480px] px-5 pb-8 safe-bottom animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
              <div className="p-5">
                <p className="font-ui font-bold text-base text-white mb-1">
                  {pct === 1 ? 'Concluir treino?' : 'Finalizar treino?'}
                </p>
                {pct < 1 && (
                  <p className="text-sm font-body" style={{ color: 'var(--text-1)' }}>
                    {completedEx} de {totalExercises} exercícios concluídos.
                  </p>
                )}
              </div>
              <div className="flex" style={{ borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-4 font-ui font-semibold text-sm"
                  style={{ color: 'var(--text-1)' }}
                >
                  Cancelar
                </button>
                <div style={{ width: 1, background: 'var(--border)' }} />
                <button
                  onClick={() => { setShowConfirm(false); handleFinish() }}
                  className="flex-1 py-4 font-ui font-bold text-sm"
                  style={{ color: pct === 1 ? '#4ade80' : 'var(--accent)' }}
                >
                  {pct === 1 ? 'Concluir' : 'Finalizar assim'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
