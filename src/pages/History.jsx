import { useState, useEffect, useRef } from 'react'
import { Calendar, CheckCircle2, Clock, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { getRecentSessions, getExerciseLogs, deleteSession } from '../lib/supabase'
import { WORKOUTS } from '../data/workouts'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${parseInt(d)} ${MONTHS[parseInt(m) - 1]} ${y}`
}

const SWIPE_THRESHOLD = 72
const DELETE_WIDTH = 80

function SwipeRow({ children, onDelete }) {
  const [offsetX, setOffsetX] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const startX = useRef(null)
  const rowRef = useRef(null)

  function onTouchStart(e) {
    startX.current = e.touches[0].clientX
  }

  function onTouchMove(e) {
    if (startX.current === null) return
    const dx = e.touches[0].clientX - startX.current
    if (dx > 0 && !revealed) return
    const base = revealed ? -DELETE_WIDTH : 0
    const next = Math.max(-DELETE_WIDTH, Math.min(0, base + dx))
    setOffsetX(next)
  }

  function onTouchEnd() {
    startX.current = null
    if (offsetX < -SWIPE_THRESHOLD) {
      setOffsetX(-DELETE_WIDTH)
      setRevealed(true)
    } else {
      setOffsetX(0)
      setRevealed(false)
    }
  }

  function handleDelete() {
    rowRef.current?.animate([{ opacity: 1, transform: 'translateX(0)' }, { opacity: 0, transform: 'translateX(-100%)' }], { duration: 220, easing: 'ease-in', fill: 'forwards' })
    setTimeout(onDelete, 200)
  }

  return (
    <div ref={rowRef} className="relative overflow-hidden rounded-2xl">
      {/* Delete button behind */}
      <div
        className="absolute inset-y-0 right-0 flex items-center justify-center"
        style={{ width: DELETE_WIDTH, background: '#ef4444' }}
      >
        <button
          onClick={handleDelete}
          aria-label="Apagar sessão"
          className="flex flex-col items-center gap-1 w-full h-full justify-center"
        >
          <Trash2 size={18} className="text-white" />
          <span className="text-white text-xs font-ui font-semibold">Apagar</span>
        </button>
      </div>

      {/* Swipeable content */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{
          transform: `translateX(${offsetX}px)`,
          transition: startX.current === null ? 'transform 0.25s var(--ease-out)' : 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default function History({ profile, onBack }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)
  const [sessionLogs, setSessionLogs] = useState({})

  const workouts = WORKOUTS[profile.key] || {}

  useEffect(() => { load() }, [profile.id])

  async function load() {
    try {
      const data = await getRecentSessions(profile.id, 20)
      setSessions(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function toggleSession(session) {
    if (expanded === session.id) { setExpanded(null); return }
    setExpanded(session.id)
    if (!sessionLogs[session.id]) {
      try {
        const logs = await getExerciseLogs(session.id)
        setSessionLogs(prev => ({ ...prev, [session.id]: logs }))
      } catch (e) { console.error(e) }
    }
  }

  async function handleDelete(sessionId) {
    setSessions(prev => prev.filter(s => s.id !== sessionId))
    if (expanded === sessionId) setExpanded(null)
    try { await deleteSession(sessionId) } catch (e) { console.error(e) }
  }

  return (
    <div
      className="min-h-screen flex flex-col safe-top"
      style={{ background: 'linear-gradient(160deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4">
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
            <Calendar size={20} style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="font-display font-bold text-2xl" style={{ color: 'var(--text-0)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Histórico
            </h1>
            <p className="text-xs font-body" style={{ color: 'var(--text-2)' }}>
              {profile.name} · deslize para apagar
            </p>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 px-5 pb-8 space-y-3 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>
        {loading && (
          <div className="flex justify-center pt-8">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--accent-border)', borderTopColor: 'var(--accent)' }}
            />
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center pt-16 px-4">
            <p className="font-ui font-semibold text-lg" style={{ color: 'var(--text-1)' }}>
              Nenhum treino registrado ainda.
            </p>
            <p className="text-sm font-body mt-1" style={{ color: 'var(--text-2)' }}>
              Complete seu primeiro treino!
            </p>
          </div>
        )}

        {sessions.map(session => {
          const workout = workouts[session.workout_key]
          const logs = sessionLogs[session.id] || []
          const isOpen = expanded === session.id
          const done = !!session.completed_at

          return (
            <SwipeRow key={session.id} onDelete={() => handleDelete(session.id)}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16 }}>
                <button
                  onClick={() => toggleSession(session)}
                  aria-expanded={isOpen}
                  aria-label={`${workout?.label || session.workout_key} — ${formatDate(session.date)}`}
                  className="w-full text-left"
                  style={{ minHeight: 64, transition: 'background 0.15s var(--ease-out)', borderRadius: isOpen ? '16px 16px 0 0' : 16 }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '' }}
                >
                  <div className="p-4 flex items-center gap-3">
                    <div
                      className="flex items-center justify-center shrink-0 rounded-xl"
                      style={{ width: 40, height: 40, background: done ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.05)' }}
                    >
                      {done
                        ? <CheckCircle2 size={20} style={{ color: '#4ade80' }} />
                        : <Clock size={20} style={{ color: 'var(--text-2)' }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-ui font-semibold" style={{ color: 'var(--text-0)' }}>
                        {workout?.label || session.workout_key}
                      </p>
                      <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--text-2)' }}>
                        {formatDate(session.date)}
                        {' · '}
                        <span style={{ color: done ? '#4ade80' : 'var(--text-2)' }}>
                          {done ? 'Concluído' : 'Em andamento'}
                        </span>
                      </p>
                    </div>
                    {isOpen
                      ? <ChevronUp size={18} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                      : <ChevronDown size={18} style={{ color: 'var(--text-2)', flexShrink: 0 }} />
                    }
                  </div>
                </button>

                {isOpen && (
                  <div
                    className="px-4 pb-4 space-y-1 animate-fade-in"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <p className="text-xs font-ui font-semibold pt-3 mb-2" style={{ color: 'var(--accent)' }}>
                      Cargas registradas
                    </p>
                    {logs.length === 0 ? (
                      <p className="text-sm font-body py-2" style={{ color: 'var(--text-2)' }}>
                        Nenhuma carga registrada.
                      </p>
                    ) : (
                      logs.map(log => (
                        <div
                          key={log.id}
                          className="flex items-center justify-between py-2"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        >
                          <p className="text-sm font-body flex-1 pr-3 leading-snug" style={{ color: 'var(--text-1)' }}>
                            {log.exercises?.name || 'Exercício'}
                          </p>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-xs font-body" style={{ color: 'var(--text-2)' }}>
                              {log.sets_done}{log.exercises?.sets ? `/${log.exercises.sets}` : ''} séries
                            </span>
                            {log.load_kg != null && (
                              <span className="text-xs font-ui font-semibold" style={{ color: 'var(--accent)' }}>
                                {log.load_kg} kg
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </SwipeRow>
          )
        })}
      </div>
    </div>
  )
}
