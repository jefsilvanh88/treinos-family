import { useState, useEffect } from 'react'
import { Dumbbell, WifiOff } from 'lucide-react'
import { PROFILES } from '../data/workouts'
import { getProfiles, upsertProfile, isConfigured } from '../lib/supabase'
import Avatar from '../components/Avatar'

export default function ProfileSelect({ onSelect }) {
  const [dbProfiles, setDbProfiles] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadProfiles() }, [])

  async function loadProfiles() {
    try {
      const rows = await getProfiles()
      const map = {}
      rows.forEach(r => { map[r.name.toLowerCase()] = r })
      setDbProfiles(map)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleSelect(profileDef) {
    let dbProfile = dbProfiles[profileDef.key] || dbProfiles[profileDef.name.toLowerCase()]
    if (!dbProfile) {
      const localKey = `localProfile_${profileDef.key}`
      const stored = localStorage.getItem(localKey)
      const localId = stored || crypto.randomUUID()
      if (!stored) localStorage.setItem(localKey, localId)
      try {
        dbProfile = await upsertProfile({ id: localId, name: profileDef.name })
      } catch {
        dbProfile = { id: localId, name: profileDef.name }
      }
      setDbProfiles(prev => ({ ...prev, [profileDef.key]: dbProfile }))
    }
    const merged = { ...profileDef, ...dbProfile }
    localStorage.setItem('lastProfileId', dbProfile.id)
    localStorage.setItem('lastProfileKey', profileDef.key)
    onSelect(merged)
  }

  const splitLabel = { ABC: '3 dias / semana', ABCD: '4 treinos disponíveis' }

  return (
    <div className="min-h-screen flex flex-col safe-top" style={{ background: 'linear-gradient(160deg, var(--bg-1) 0%, var(--bg-0) 100%)' }}>

      {!isConfigured && (
        <div className="mx-5 mt-4 px-3 py-2.5 rounded-xl flex items-center gap-2 text-xs"
          style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)', color: '#fbbf24' }}>
          <WifiOff size={13} />
          Supabase não configurado — dados ficam apenas neste dispositivo.
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col items-center pt-14 pb-8 px-6">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
          style={{ background: 'linear-gradient(135deg, var(--accent), #1565d6)' }}
        >
          <Dumbbell size={28} className="text-white" strokeWidth={2.5} />
        </div>
        <h1
          className="font-display text-3xl font-bold tracking-tight text-white"
          style={{ letterSpacing: '-0.02em' }}
        >
          Treinos da Família
        </h1>
        <p className="text-sm mt-1.5 font-body" style={{ color: 'var(--text-1)' }}>
          Quem vai treinar hoje?
        </p>
      </div>

      {/* Profiles */}
      <div className="flex-1 px-5 space-y-3 pb-8">
        {loading ? (
          <div className="flex justify-center pt-8">
            <div
              className="w-8 h-8 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--accent-border)', borderTopColor: 'var(--accent)' }}
            />
          </div>
        ) : (
          PROFILES.map((p, i) => {
            const db = dbProfiles[p.key] || dbProfiles[p.name.toLowerCase()] || {}
            const merged = { ...p, ...db }
            return (
              <button
                key={p.key}
                onClick={() => handleSelect(p)}
                className="w-full flex items-center gap-4 rounded-2xl text-left animate-slide-up"
                style={{
                  padding: '14px 16px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  animationDelay: `${i * 0.07}s`,
                  transition: 'background 0.2s var(--ease-out), border-color 0.2s var(--ease-out), transform 0.15s var(--ease-out)',
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
                <Avatar profile={merged} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="font-ui font-semibold text-lg leading-tight" style={{ color: 'var(--text-0)' }}>
                    {p.name}
                  </p>
                  <p className="text-xs mt-0.5 font-body" style={{ color: 'var(--text-1)' }}>
                    Split {p.split} · {splitLabel[p.split]}
                  </p>
                  {p.objective && (
                    <p className="text-xs mt-1 font-ui font-semibold" style={{ color: 'var(--accent)' }}>
                      {p.objective}
                    </p>
                  )}
                </div>
                <div
                  aria-hidden="true"
                  className="flex items-center justify-center shrink-0"
                  style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent-dim)' }}
                >
                  <span style={{ color: 'var(--accent)', fontSize: 20, lineHeight: 1, paddingBottom: 1 }}>›</span>
                </div>
              </button>
            )
          })
        )}
      </div>

      <p className="text-center text-xs pb-6 safe-bottom font-body" style={{ color: 'var(--text-2)' }}>
        Seu treino, suas regras
      </p>
    </div>
  )
}
