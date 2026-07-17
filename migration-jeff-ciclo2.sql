-- ============================================================
-- Ciclo 2 do Jeff — troca dos 23 exercícios do split ABC
-- Rodar UMA VEZ no SQL Editor do Supabase.
-- Só mexe no perfil do Jeff. Nicole e Jô ficam intactas.
-- Os exercícios antigos são ARQUIVADOS (archived = true), nunca
-- deletados: os 128 logs de histórico continuam ligados a eles.
-- ============================================================

-- 1. Coluna de origem: liga o exercício novo ao antigo equivalente,
--    para o app sugerir a última carga na primeira sessão do ciclo.
alter table exercises
  add column if not exists origin_exercise_id uuid references exercises(id);

-- 2. Arquiva o ciclo 1 do Jeff.
update exercises
   set archived = true
 where profile_id = 'c0762401-7129-440f-84af-cb9437d5117d'
   and archived = false;

-- 3. Insere o ciclo 2.
--    A alternativa de cada exercício vai entre parênteses no nome
--    (mesma convenção do seed original).
--    A última coluna é o nome do exercício do ciclo 1 do qual a carga
--    é herdada — só onde o implemento bate (barra→barra, halter→halter,
--    mesma polia). NULL = começa do zero, série de reconhecimento.
insert into exercises (profile_id, workout_key, name, sets, reps, position, origin_exercise_id)
select
  'c0762401-7129-440f-84af-cb9437d5117d'::uuid,
  v.workout_key,
  v.name,
  v.sets,
  v.reps,
  v.position,
  (select o.id
     from exercises o
    where o.profile_id = 'c0762401-7129-440f-84af-cb9437d5117d'
      and o.name = v.origin
    limit 1)
from (values
  -- Treino A — Push (Peito, Ombros, Tríceps)
  ('treino_a', 'Supino inclinado com barra (ou halteres/Smith)',        4, '6–8',        0, 'Supino reto com barra'),
  ('treino_a', 'Supino reto com halteres (ou máquina articulada)',      3, '8–10',       1, 'Supino inclinado com halteres'),
  ('treino_a', 'Voador / peck deck (ou crossover na polia)',            3, '12–15',      2, null),
  ('treino_a', 'Desenvolvimento na máquina (ou halteres sentado)',      4, '8–10',       3, null),
  ('treino_a', 'Elevação lateral na polia (ou halteres)',               3, '12–15 cada', 4, 'Elevação lateral'),
  ('treino_a', 'Mergulho na máquina assistida (ou paralelas/banco)',    3, '8–10',       5, null),
  ('treino_a', 'Tríceps pulley pegada inversa (ou francês com halter)', 3, '12–15',      6, 'Tríceps na corda (polia alta)'),

  -- Treino B — Pull (Costas, Bíceps)
  ('treino_b', 'Puxada alta supinada (ou barra fixa supinada)',            4, '8–10',       0, 'Barra fixa (ou puxada alta na máquina)'),
  ('treino_b', 'Remada cavalinho / T-bar (ou remada curvada com barra)',   4, '8–10',       1, 'Remada curvada com barra'),
  ('treino_b', 'Remada unilateral com halter (ou remada baixa unilateral)',3, '10–12 cada', 2, null),
  ('treino_b', 'Pullover na polia alta (ou com halter no banco)',          3, '12–15',      3, null),
  ('treino_b', 'Crucifixo invertido na máquina (ou face pull na polia)',   3, '15',         4, null),
  ('treino_b', 'Rosca Scott na máquina (ou barra W no banco Scott)',       3, '10–12',      5, null),
  ('treino_b', 'Rosca inclinada com halteres (ou rosca direta com barra)', 3, '10–12',      6, 'Rosca alternada com halteres'),
  ('treino_b', 'Rosca martelo na corda (ou com halteres)',                 3, '12–15',      7, 'Rosca martelo'),

  -- Treino C — Legs + Core (trocou de aparelho em tudo: nada herda carga)
  ('treino_c', 'Agachamento hack (ou no Smith)',                      4, '8–10',       0, null),
  ('treino_c', 'Búlgaro com halteres (ou afundo/passada)',            3, '10–12 cada', 1, null),
  ('treino_c', 'Leg press unilateral (ou extensora unilateral)',      3, '12–15 cada', 2, null),
  ('treino_c', 'Elevação pélvica / hip thrust (ou stiff com halteres)',4, '8–10',      3, null),
  ('treino_c', 'Cadeira flexora sentada (ou mesa flexora deitada)',   3, '12–15',      4, null),
  ('treino_c', 'Panturrilha sentada (ou em pé / no leg press)',       4, '15–20',      5, null),
  ('treino_c', 'Abdominal na polia alta (ou no solo com anilha)',     3, '12–15',      6, null),
  ('treino_c', 'Prancha lateral',                                     3, '30–40 s/lado',7, null)
) as v(workout_key, name, sets, reps, position, origin);

-- 4. Conferência: deve listar 23 linhas ativas, 8 delas com origem preenchida.
select workout_key, position, name,
       (select o.name from exercises o where o.id = e.origin_exercise_id) as herda_carga_de
  from exercises e
 where e.profile_id = 'c0762401-7129-440f-84af-cb9437d5117d'
   and e.archived = false
 order by workout_key, position;
