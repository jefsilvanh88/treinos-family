-- ============================================================
-- Treinos da Família — migração p/ exercícios editáveis
-- Rode UMA vez no Supabase → SQL Editor. Idempotente.
-- ============================================================

-- 1. Tabela de exercícios (fonte da verdade; antes era hardcoded)
create table if not exists exercises (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  workout_key text not null,
  name        text not null,
  sets        int  not null default 3,
  reps        text not null default '',
  rest        int  not null default 60,
  position    int  not null default 0,
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);
create index if not exists idx_exercises_profile_workout on exercises(profile_id, workout_key);

-- 2. exercise_logs passa a referenciar exercise_id (uuid estável) em vez de posição
alter table exercise_logs add column if not exists exercise_id uuid references exercises(id) on delete cascade;
create index if not exists idx_logs_exercise on exercise_logs(exercise_id);

-- 3. RLS aberta (app família, sem auth) — igual às outras tabelas
alter table exercises enable row level security;
drop policy if exists "public exercises" on exercises;
create policy "public exercises" on exercises for all using (true) with check (true);

-- 4. Seed dos exercícios atuais (só se a tabela estiver vazia)
do $$
begin
  if not exists (select 1 from exercises) then
insert into exercises (profile_id, workout_key, name, sets, reps, rest, position) values
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Supino reto com barra', 4, '6–8', 60, 0),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Supino inclinado com halteres', 3, '8–10', 60, 1),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Crossover na polia (ou crucifixo)', 3, '12–15', 60, 2),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Desenvolvimento de ombros com halteres', 4, '8–10', 60, 3),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Elevação lateral', 4, '12–15', 60, 4),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Tríceps na corda (polia alta)', 3, '10–12', 60, 5),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_a', 'Tríceps testa com barra W (francês)', 3, '10–12', 60, 6),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Barra fixa (ou puxada alta na máquina)', 4, '6–10', 60, 0),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Remada curvada com barra', 4, '8–10', 60, 1),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Remada baixa sentado (cabo)', 3, '10–12', 60, 2),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Puxada na polia, pegada neutra', 3, '12', 60, 3),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Rosca direta com barra', 4, '8–10', 60, 4),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Rosca alternada com halteres', 3, '10–12', 60, 5),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Rosca martelo', 3, '12–15', 60, 6),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_b', 'Face pull (saúde do ombro)', 3, '15', 45, 7),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Agachamento livre', 4, '6–8', 60, 0),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Leg press 45°', 4, '10–12', 60, 1),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Cadeira extensora', 3, '12–15', 60, 2),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Levantamento terra romeno / Stiff', 4, '8–10', 60, 3),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Mesa flexora (ou cadeira flexora)', 3, '10–12', 60, 4),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Panturrilha em pé', 4, '12–15', 45, 5),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Prancha abdominal', 3, '30–60 s', 45, 6),
  ('c0762401-7129-440f-84af-cb9437d5117d', 'treino_c', 'Elevação de pernas (abdômen inferior)', 3, '12–15', 45, 7),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Supino com halteres', 3, '10–12', 90, 0),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Voador (peck deck)', 3, '12–15', 60, 1),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Desenvolvimento com halteres', 3, '10–12', 90, 2),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Elevação lateral', 3, '12–15', 60, 3),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Elevação frontal com halteres', 3, '12–15', 60, 4),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Tríceps na corda (polia)', 3, '12–15', 60, 5),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_a', 'Tríceps testa com barra (skull crusher)', 3, '10–12', 60, 6),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_b', 'Agachamento goblet (halter)', 3, '12–15', 90, 0),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_b', 'Leg press', 3, '12–15', 90, 1),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_b', 'Cadeira adutora', 3, '15', 60, 2),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_b', 'Cadeira extensora', 3, '15', 60, 3),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_b', 'Panturrilha em pé', 3, '15', 45, 4),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Puxada alta na máquina', 3, '10–12', 90, 0),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Remada baixa sentado (cabo)', 3, '10–12', 90, 1),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Puxada com triângulo (cabo)', 3, '10–12', 90, 2),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Rosca alternada com halteres', 3, '12–15', 60, 3),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Rosca martelo', 3, '12–15', 60, 4),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Prancha abdominal', 3, '30–45 s', 45, 5),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_c', 'Elevação de pernas', 3, '12', 45, 6),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_d', 'Hip thrust / Elevação pélvica', 4, '10–12', 90, 0),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_d', 'Stiff com halteres', 3, '12–15', 90, 1),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_d', 'Mesa flexora', 3, '12–15', 60, 2),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_d', 'Agachamento sumô com halter', 3, '12', 90, 3),
  ('2fd03f76-567f-4e74-ad65-ae71add138fc', 'treino_d', 'Abdução de quadril na máquina', 3, '15', 45, 4),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Supino com halteres', 3, '10–12', 90, 0),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Voador (peck deck)', 3, '12–15', 60, 1),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Desenvolvimento com halteres', 3, '10–12', 90, 2),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Elevação lateral', 3, '12–15', 60, 3),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Elevação frontal com halteres', 3, '12–15', 60, 4),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Tríceps na corda (polia)', 3, '12–15', 60, 5),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_a', 'Tríceps testa com barra (skull crusher)', 3, '10–12', 60, 6),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_b', 'Agachamento goblet (halter)', 3, '12–15', 90, 0),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_b', 'Leg press', 3, '12–15', 90, 1),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_b', 'Cadeira adutora', 3, '15', 60, 2),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_b', 'Cadeira extensora', 3, '15', 60, 3),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_b', 'Panturrilha em pé', 3, '15', 45, 4),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Puxada alta na máquina', 3, '10–12', 90, 0),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Remada baixa sentado (cabo)', 3, '10–12', 90, 1),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Puxada com triângulo (cabo)', 3, '10–12', 90, 2),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Rosca alternada com halteres', 3, '12–15', 60, 3),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Rosca martelo', 3, '12–15', 60, 4),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Prancha abdominal', 3, '30–45 s', 45, 5),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_c', 'Elevação de pernas', 3, '12', 45, 6),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_d', 'Hip thrust / Elevação pélvica', 4, '10–12', 90, 0),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_d', 'Stiff com halteres', 3, '12–15', 90, 1),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_d', 'Mesa flexora', 3, '12–15', 60, 2),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_d', 'Agachamento sumô com halter', 3, '12', 90, 3),
  ('f9885a2b-d5ad-4bc7-a653-25be91a8b611', 'treino_d', 'Abdução de quadril na máquina', 3, '15', 45, 4);
  end if;
end $$;

-- 5. Backfill: liga logs antigos ao exercise_id novo, casando por posição
update exercise_logs el
set exercise_id = ex.id
from workout_sessions ws
join exercises ex
  on ex.profile_id  = ws.profile_id
 and ex.workout_key = ws.workout_key
where el.session_id    = ws.id
  and ex.position      = el.exercise_index
  and el.exercise_id is null;

-- Conferência
select 'exercises' t, count(*) from exercises
union all select 'logs total', count(*) from exercise_logs
union all select 'logs sem exercise_id', count(*) from exercise_logs where exercise_id is null;
