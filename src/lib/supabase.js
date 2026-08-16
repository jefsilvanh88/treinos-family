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

// ── Exercises (editáveis, fonte da verdade no banco) ──────

export async function getExercises(profileId, workoutKey) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('exercises')
    .select('*')
    .eq('profile_id', profileId)
    .eq('workout_key', workoutKey)
    .eq('archived', false)
    .order('position', { ascending: true })
  if (error) throw error
  return data
}

export async function addExercise(profileId, workoutKey, fields) {
  if (!supabase) throw new Error('Supabase não configurado')
  const { data: last } = await supabase
    .from('exercises')
    .select('position')
    .eq('profile_id', profileId)
    .eq('workout_key', workoutKey)
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle()
  const position = (last?.position ?? -1) + 1
  const { data, error } = await supabase
    .from('exercises')
    .insert({ profile_id: profileId, workout_key: workoutKey, position, ...fields })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateExercise(id, patch) {
  if (!supabase) return
  const { data, error } = await supabase
    .from('exercises')
    .update(patch)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// Soft-delete: mantém o histórico de cargas ligado ao exercício
export async function archiveExercise(id) {
  if (!supabase) return
  const { error } = await supabase
    .from('exercises')
    .update({ archived: true })
    .eq('id', id)
  if (error) throw error
}

// ── Exercise Logs ─────────────────────────────────────────

// Logs da sessão + nome do exercício (p/ histórico, resolve até arquivados)
export async function getExerciseLogs(sessionId) {
  if (!supabase || String(sessionId).startsWith('local-')) return []
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*, exercises(name, sets)')
    .eq('session_id', sessionId)
  if (error) throw error
  return data
}

export async function deleteSession(sessionId) {
  if (!supabase) return
  const { error } = await supabase.from('workout_sessions').delete().eq('id', sessionId)
  if (error) throw error
}

// Última carga por exercício — QUALQUER sessão (não exige finalizada).
// Corrige bug: antes só olhava sessões com completed_at, então quase nunca aparecia.
export async function getLastLoads(profileId, workoutKey) {
  if (!supabase) return {}
  const { data: sessions } = await supabase
    .from('workout_sessions')
    .select('id, date')
    .eq('profile_id', profileId)
    .eq('workout_key', workoutKey)
    .order('date', { ascending: false })
  if (!sessions?.length) return {}
  const sessionIds = sessions.map(s => s.id)
  const dateMap = Object.fromEntries(sessions.map(s => [s.id, s.date]))
  const { data: logs, error } = await supabase
    .from('exercise_logs')
    .select('session_id, exercise_id, load_kg')
    .in('session_id', sessionIds)
    .not('load_kg', 'is', null)
    .not('exercise_id', 'is', null)
  if (error) return {}
  // p/ cada exercise_id, mantém a carga da sessão mais recente
  const map = {}
  logs.forEach(l => {
    const d = dateMap[l.session_id]
    if (!map[l.exercise_id] || d > map[l.exercise_id].date) {
      map[l.exercise_id] = { date: d, load: l.load_kg }
    }
  })
  const out = {}
  Object.entries(map).forEach(([exId, v]) => { out[exId] = v.load })
  // Exercício sem log próprio herda a carga do exercício de origem (troca de ciclo)
  const { data: derived } = await supabase
    .from('exercises')
    .select('id, origin_exercise_id')
    .eq('profile_id', profileId)
    .eq('workout_key', workoutKey)
    .not('origin_exercise_id', 'is', null)
  derived?.forEach(e => {
    if (out[e.id] == null && out[e.origin_exercise_id] != null) out[e.id] = out[e.origin_exercise_id]
  })
  return out
}

export async function getExerciseHistory(profileId, exerciseId, limit = 60) {
  if (!supabase || !exerciseId) return []
  const { data: logs, error } = await supabase
    .from('exercise_logs')
    .select('load_kg, sets_done, workout_sessions(date)')
    .eq('exercise_id', exerciseId)
    .not('load_kg', 'is', null)
    .limit(limit)
  if (error) return []
  return logs
    .map(l => ({ date: l.workout_sessions?.date, load_kg: l.load_kg, sets_done: l.sets_done }))
    .filter(l => l.date)
    .sort((a, b) => a.date.localeCompare(b.date))
}

export async function upsertExerciseLog(sessionId, exerciseId, setsDone, loadKg) {
  if (!supabase || String(sessionId).startsWith('local-') || !exerciseId) return

  const { error } = await supabase
    .from('exercise_logs')
    .upsert(
      { session_id: sessionId, exercise_id: exerciseId, sets_done: setsDone, load_kg: loadKg },
      { onConflict: 'session_id,exercise_id' },
    )
  if (error) throw error
}
