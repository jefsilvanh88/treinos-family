-- Fix: cargas não gravavam desde 2026-07-09 (commit 367e00a).
-- exercise_logs.exercise_index continuou NOT NULL depois que o app passou a
-- logar por exercise_id, então TODO insert de log falhava com 23502.

-- 1. exercise_index vira legado opcional (exercise_id é a chave agora)
alter table exercise_logs alter column exercise_index drop not null;

-- 2. UNIQUE real para o upsert ser atômico (hoje é SELECT-depois-INSERT, corre risco de corrida).
-- Índice completo (não parcial) porque ON CONFLICT do PostgREST só infere índice sem WHERE.
-- Linhas legadas com exercise_id null não colidem: NULL é distinto de NULL no unique.
create unique index if not exists uq_logs_session_exercise
  on exercise_logs (session_id, exercise_id);

-- Conferência
select 'logs total' t, count(*) from exercise_logs
union all select 'sem exercise_id', count(*) from exercise_logs where exercise_id is null
union all select 'sem exercise_index', count(*) from exercise_logs where exercise_index is null;
