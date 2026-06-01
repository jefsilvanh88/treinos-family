import { useState, useEffect } from 'react'
import { History, ChevronRight, Waves, Target } from 'lucide-react'
import { WORKOUTS, JEFF_SCHEDULE, TAG_COLORS } from '../data/workouts'
import { getRecentSessions } from '../lib/supabase'
import Avatar from '../components/Avatar'
import History_ from './History'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const DAY_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function formatDate(d) { return `${d.getDate()} de ${MONTHS[d.getMonth()]}` }

function IconBtn({ onClick, label, children }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex items-center justify-center rounded-xl"
      style={{
        width: 44, height: 44,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid var(--border)',
        transition: 'background 0.2s var(--ease-out)',
        color: 'var(--text-1)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
    >
      {children}
    </button>
  )
}

function WorkoutCard({ workout, onClick, left, isToday }) {
  const tagColors = TAG_COLORS[workout?.tag]
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl"
      style={{
        background: isToday ? 'linear-gradient(135deg, #101838, #0c1330)' : 'var(--bg-card)',
        border: isToday ? '1px solid var(--accent-border)' : '1px solid var(--border)',
        transition: 'background 0.2s var(--ease-out), border-color 0.2s var(--ease-out), transform 0.15s var(--ease-out)',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = isToday ? 'linear-gradient(135deg, #172044, #12183a)' : 'var(--bg-card-hover)'
        e.currentTarget.style.borderColor = 'var(--accent-border)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = isToday ? 'linear-gradient(135deg, #101838, #0c1330)' : 'var(--bg-card)'
        e.currentTarget.style.borderColor = isToday ? 'var(--accent-border)' : 'var(--border)'
      }}
      onPointerDown={e => { e.currentTarget.style.transform = 'scale(0.985)' }}
      onPointerUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Day pill */}
        {left}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-ui font-semibold" style={{ color: 'var(--text-0)' }}>{workout.label}</span>
            {tagColors && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-ui font-semibold ${tagColors.bg} ${tagColors.text} border ${tagColors.border}`}>
                {workout.tag}
              </span>
            )}
          </div>
          <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--text-1)' }}>{workout.focus}</p>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--accent)', flexShrink: 0 }} />
      </div>
    </button>
  )
}

export default function Dashboard({ profile, onStartWorkout, onBack }) {
  const [view, setView] = useState('dashboard')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const today = new Date()
  const todayDow = today.getDay()

  const workouts = WORKOUTS[profile.key] || {}

  useEffect(() => {
    getRecentSessions(profile.id, 1).catch(() => {})
  }, [profile.id])

  function renderJeffSchedule() {
    const days = [
      { dow: 2, label: 'Terça',  workoutKey: 'treino_a' },
      { dow: 4, label: 'Quinta', workoutKey: 'treino_b' },
      { dow: 5, label: 'Sexta',  workoutKey: null, swim: true },
      { dow: 6, label: 'Sáb',    workoutKey: 'treino_c' },
    ]

    return (
      <div className="space-y-2.5">
        <p className="text-xs font-ui font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.1em' }}>
          Esta semana
        </p>
        {days.map(({ dow, label, workoutKey, swim }) => {
          const isToday = todayDow === dow
          const w = workoutKey ? workouts[workoutKey] : null

          const dayPill = (
            <div
              className="flex flex-col items-center justify-center shrink-0 rounded-xl"
              style={{
                width: 48, height: 48,
                background: isToday ? 'var(--accent-dim)' : 'rgba(255,255,255,0.04)',
              }}
            >
              <span className="text-xs font-ui font-semibold" style={{ color: isToday ? 'var(--accent)' : 'var(--text-2)' }}>
                {label.slice(0, 3)}
              </span>
              {isToday && (
                <span className="mt-0.5 rounded-full" style={{ width: 5, height: 5, background: 'var(--accent)' }} />
              )}
            </div>
          )

          if (swim) {
            return (
              <div
                key={dow}
                className="flex items-center gap-3 p-4 rounded-2xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', opacity: 0.65 }}
              >
                {dayPill}
                <Waves size={15} style={{ color: '#5c9bff' }} />
                <span className="font-ui font-medium text-sm" style={{ color: '#7dd3fc' }}>Natação</span>
              </div>
            )
          }

          if (!w) return null

          return (
            <WorkoutCard
              key={dow}
              workout={w}
              onClick={() => onStartWorkout(w)}
              isToday={isToday}
              left={dayPill}
            />
          )
        })}
      </div>
    )
  }

  function renderFreeList() {
    return (
      <div className="space-y-2.5">
        <p className="text-xs font-ui font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.1em' }}>
          Escolha seu treino
        </p>
        {Object.values(workouts).map((w, i) => (
          <WorkoutCard
            key={w.key}
            workout={w}
            onClick={() => onStartWorkout(w)}
            isToday={false}
            left={
              <div
                className="flex items-center justify-center shrink-0 rounded-xl"
                style={{ width: 48, height: 48, background: 'var(--accent-dim)' }}
              >
                <span className="font-display font-bold text-xl" style={{ color: 'var(--accent)' }}>
                  {w.label.split(' ')[1]}
                </span>
              </div>
            }
          />
        ))}
      </div>
    )
  }

  if (view === 'history') return <History_ profile={profile} onBack={() => setView('dashboard')} />

  return (
    <div className="min-h-screen flex flex-col safe-top" style={{ background: 'linear-gradient(160deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}>

      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={onBack}
            className="text-sm font-body"
            style={{ color: 'var(--text-1)', minHeight: 44, display: 'flex', alignItems: 'center' }}
          >
            ← Trocar perfil
          </button>
          <IconBtn onClick={() => setView('history')} label="Ver histórico">
            <History size={18} />
          </IconBtn>
        </div>

        {/* Profile card */}
        <div
          className="flex items-center gap-4 rounded-2xl"
          style={{ padding: '16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <Avatar
            profile={{ ...profile, avatar_url: avatarUrl }}
            size="lg"
            editable
            onUpdated={url => setAvatarUrl(url)}
          />
          <div className="min-w-0">
            <p className="font-display font-bold text-2xl" style={{ color: 'var(--text-0)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              Olá, {profile.name}!
            </p>
            <p className="text-sm mt-1 font-body" style={{ color: 'var(--text-1)' }}>
              {DAY_FULL[todayDow]}, {formatDate(today)}
            </p>
            {profile.key === 'jeff' && JEFF_SCHEDULE[todayDow] && (
              <div className="mt-2 flex items-center gap-1.5">
                <span className="rounded-full animate-pulse" style={{ width: 7, height: 7, background: 'var(--accent)', display: 'inline-block' }} />
                <span className="text-xs font-ui font-semibold" style={{ color: 'var(--accent)' }}>Dia de treino!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>

        {/* Objective */}
        {profile.objective && (
          <div
            className="flex gap-3 rounded-2xl mb-4"
            style={{
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(41,121,255,0.07), rgba(41,121,255,0.03))',
              border: '1px solid var(--accent-border)',
            }}
          >
            <div
              className="flex items-center justify-center shrink-0 rounded-xl"
              style={{ width: 36, height: 36, background: 'var(--accent-dim)' }}
            >
              <Target size={15} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="text-xs font-ui font-bold uppercase tracking-wider" style={{ color: 'var(--accent)', letterSpacing: '0.08em' }}>
                {profile.objective}
              </p>
              <p className="text-xs mt-1 font-body leading-relaxed" style={{ color: 'var(--text-1)' }}>
                {profile.objectiveDetail}
              </p>
            </div>
          </div>
        )}

        {profile.key === 'jeff' ? renderJeffSchedule() : renderFreeList()}
      </div>
    </div>
  )
}
