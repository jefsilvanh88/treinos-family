import { useState, useEffect } from 'react'
import { History, ChevronRight, Target, TrendingUp } from 'lucide-react'
import { WORKOUTS, TAG_COLORS } from '../data/workouts'
import { getRecentSessions } from '../lib/supabase'
import Avatar from '../components/Avatar'
import History_ from './History'
import Progress from './Progress'

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const MONTHS_FULL = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DAY_FULL = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function MonthActivity({ sessions }) {
  const today = new Date()
  const y = today.getFullYear()
  const m = today.getMonth()
  const daysInMonth = new Date(y, m + 1, 0).getDate()
  const todayDay = today.getDate()

  const workedDays = new Set(
    sessions
      .filter(s => {
        const [sy, sm] = s.date.split('-')
        return +sy === y && +sm === m + 1 && s.completed_at
      })
      .map(s => +s.date.split('-')[2])
  )
  const count = workedDays.size

  return (
    <div
      className="rounded-2xl mb-4"
      style={{ padding: '14px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <p className="text-xs font-ui font-semibold" style={{ color: 'var(--text-2)', letterSpacing: '0.07em' }}>
          {MONTHS_FULL[m].toUpperCase()}
        </p>
        <p className="text-xs font-ui font-semibold tabular-nums" style={{ color: count > 0 ? 'var(--accent)' : 'var(--text-2)' }}>
          {count} treino{count !== 1 ? 's' : ''}
        </p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${daysInMonth}, 1fr)`, gap: 3 }}>
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1
          const worked = workedDays.has(d)
          const isToday = d === todayDay
          const isFuture = d > todayDay
          return (
            <div
              key={d}
              title={`${d} ${MONTHS[m]}`}
              style={{
                aspectRatio: '1',
                borderRadius: 3,
                background: worked
                  ? 'var(--accent)'
                  : isFuture
                    ? 'rgba(255,255,255,0.02)'
                    : 'rgba(255,255,255,0.07)',
                outline: isToday && !worked ? '1.5px solid var(--accent-border)' : 'none',
                boxShadow: worked ? '0 1px 6px rgba(41,121,255,0.4)' : 'none',
                transition: 'background 0.2s',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

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

function WorkoutCard({ workout, onClick, left }) {
  const tagColors = TAG_COLORS[workout?.tag]
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-2xl"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        transition: 'background 0.2s var(--ease-out), border-color 0.2s var(--ease-out), transform 0.15s var(--ease-out)',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'var(--bg-card-hover)'
        e.currentTarget.style.borderColor = 'var(--accent-border)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'var(--bg-card)'
        e.currentTarget.style.borderColor = 'var(--border)'
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
  const [sessions, setSessions] = useState([])
  const today = new Date()
  const todayDow = today.getDay()

  const workouts = WORKOUTS[profile.key] || {}

  useEffect(() => {
    getRecentSessions(profile.id, 60).then(setSessions).catch(() => {})
  }, [profile.id])

  function renderFreeList() {
    return (
      <div className="space-y-2.5">
        <p className="text-xs font-ui font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-2)', letterSpacing: '0.1em' }}>
          Escolha seu treino
        </p>
        {Object.values(workouts).filter(w => !w.archived).map(w => (
          <WorkoutCard
            key={w.key}
            workout={w}
            onClick={() => onStartWorkout(w)}
            left={
              <div
                className="flex items-center justify-center shrink-0 rounded-xl"
                style={{ width: 48, height: 48, background: 'var(--accent-dim)' }}
              >
                <span className="font-display font-bold text-xl" style={{ color: 'var(--accent)' }}>
                  {w.badge || w.label.split(' ')[1]}
                </span>
              </div>
            }
          />
        ))}
      </div>
    )
  }

  if (view === 'history') return <History_ profile={profile} onBack={() => setView('dashboard')} />
  if (view === 'progress') return <Progress profile={profile} onBack={() => setView('dashboard')} />

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
          <div className="flex items-center gap-2">
            <IconBtn onClick={() => setView('progress')} label="Ver progresso">
              <TrendingUp size={18} />
            </IconBtn>
            <IconBtn onClick={() => setView('history')} label="Ver histórico">
              <History size={18} />
            </IconBtn>
          </div>
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pb-8 overflow-y-auto" style={{ overscrollBehavior: 'contain' }}>

        {/* Month activity */}
        <MonthActivity sessions={sessions} />

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

        {renderFreeList()}
      </div>
    </div>
  )
}
