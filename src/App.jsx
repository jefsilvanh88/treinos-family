import { useState, useEffect } from 'react'
import ProfileSelect from './pages/ProfileSelect'
import Dashboard from './pages/Dashboard'
import WorkoutSession from './pages/WorkoutSession'
import { PROFILES } from './data/workouts'
import { getProfiles } from './lib/supabase'

export default function App() {
  const [screen, setScreen] = useState('loading') // loading | profile-select | dashboard | workout
  const [profile, setProfile] = useState(null)
  const [currentWorkout, setCurrentWorkout] = useState(null)

  useEffect(() => {
    restoreSession()
  }, [])

  async function restoreSession() {
    const savedId = localStorage.getItem('lastProfileId')
    const savedKey = localStorage.getItem('lastProfileKey')
    if (savedId && savedKey) {
      const profileDef = PROFILES.find(p => p.key === savedKey)
      if (profileDef) {
        try {
          const rows = await getProfiles()
          const dbProfile = rows.find(r => r.id === savedId)
          if (dbProfile) {
            setProfile({ ...profileDef, ...dbProfile })
            setScreen('dashboard')
            return
          }
        } catch (_) {
          // Supabase not reachable — restore from local data
          setProfile({ ...profileDef, id: savedId, name: profileDef.name })
          setScreen('dashboard')
          return
        }
        // Supabase returned no matching profile — use local
        setProfile({ ...profileDef, id: savedId, name: profileDef.name })
        setScreen('dashboard')
        return
      }
    }
    setScreen('profile-select')
  }

  function handleProfileSelect(p) {
    setProfile(p)
    setScreen('dashboard')
  }

  function handleStartWorkout(workout) {
    setCurrentWorkout(workout)
    setScreen('workout')
  }

  function handleBackToDashboard() {
    setCurrentWorkout(null)
    setScreen('dashboard')
  }

  function handleBackToProfiles() {
    localStorage.removeItem('lastProfileId')
    localStorage.removeItem('lastProfileKey')
    setProfile(null)
    setScreen('profile-select')
  }

  if (screen === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0d1b2a' }}>
        <div className="w-10 h-10 rounded-full border-2 border-orange-500/30 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  if (screen === 'profile-select') {
    return <ProfileSelect onSelect={handleProfileSelect} />
  }

  if (screen === 'dashboard' && profile) {
    return (
      <Dashboard
        profile={profile}
        onStartWorkout={handleStartWorkout}
        onBack={handleBackToProfiles}
      />
    )
  }

  if (screen === 'workout' && profile && currentWorkout) {
    return (
      <WorkoutSession
        profile={profile}
        workout={currentWorkout}
        onBack={handleBackToDashboard}
      />
    )
  }

  return null
}
