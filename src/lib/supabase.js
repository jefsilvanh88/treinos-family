import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = Boolean(
  supabaseUrl && supabaseUrl !== 'https://xxxxxxxxxxxx.supabase.co' &&
  supabaseAnonKey && supabaseAnonKey !== 'your-anon-key-here'
)

export const supabase = isConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// ── Profiles ──────────────────────────────────────────────

export async function getProfiles() {
  if (!supabase) return []
  const { data, error } = await supabase.from('profiles').select('*')
  if (error) throw error
  return data
}

export async function upsertProfile(profile) {
  if (!supabase) {
    return { id: crypto.randomUUID(), ...profile }
  }
  const { data, error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function uploadAvatar(profileId, file) {
  if (!supabase) throw new Error('Supabase não configurado')
  const ext = file.name.split('.').pop()
  const path = `${profileId}.${ext}`
  const { error: upErr } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })
  if (upErr) throw upErr

  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  const avatarUrl = `${data.publicUrl}?t=${Date.now()}`
  await upsertProfile({ id: profileId, avatar_url: avatarUrl })
  return avatarUrl
}

// ── Workout Sessions ──────────────────────────────────────

export async function getOrCreateSession(profileId, workoutKey, date) {
  if (!supabase) return { id: `local-${profileId}-${workoutKey}-${date}`, profile_id: profileId, workout_key: workoutKey, date, completed_at: null }

  const { data: existing } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('profile_id', profileId)
    .eq('workout_key', workoutKey)
    .eq('date', date)
    .maybeSingle()

  if (existing) return existing

  const { data, error } = await supabase
    .from('workout_sessions')
    .insert({ profile_id: profileId, workout_key: workoutKey, date })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function completeSession(sessionId) {
  if (!supabase) return
  const { error } = await supabase
    .from('workout_sessions')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', sessionId)
  if (error) throw error
}

export async function getRecentSessions(profileId, limit = 10) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('workout_sessions')
    .select('*')
    .eq('profile_id', profileId)
    .order('date', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

// ── Exercise Logs ─────────────────────────────────────────

export async function getExerciseLogs(sessionId) {
  if (!supabase || String(sessionId).startsWith('local-')) return []
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('session_id', sessionId)
  if (error) throw error
  return data
}

export async function deleteSession(sessionId) {
  if (!supabase) return
  const { error } = await supabase.from('workout_sessions').delete().eq('id', sessionId)
  if (error) throw error
}

export async function upsertExerciseLog(sessionId, exerciseIndex, setsDone, loadKg) {
  if (!supabase || String(sessionId).startsWith('local-')) return

  const { data: existing } = await supabase
    .from('exercise_logs')
    .select('id')
    .eq('session_id', sessionId)
    .eq('exercise_index', exerciseIndex)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('exercise_logs')
      .update({ sets_done: setsDone, load_kg: loadKg })
      .eq('id', existing.id)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('exercise_logs')
      .insert({ session_id: sessionId, exercise_index: exerciseIndex, sets_done: setsDone, load_kg: loadKg })
    if (error) throw error
  }
}
