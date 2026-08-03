-- ============================================================
-- Ciclo 2 da Nicole — treino novo do personal (25 exercícios, ABCD)
-- Rodar UMA VEZ no SQL Editor do Supabase.
-- Só mexe no perfil da Nicole. Jeff e Jô ficam intactos.
-- Os exercícios antigos são ARQUIVADOS (archived = true), nunca
-- deletados: as 45 sessões de histórico continuam ligadas a eles.
--
-- Os dias da semana do plano original viraram A/B/C/D. Terça e
-- quinta eram o MESMO treino de superiores → viraram o Treino B.
-- Ordem da semana: A → B → C → B → D.
-- ============================================================

-- 1. Coluna de origem (já existe se a migration do Jeff rodou).
--    Liga o exercício novo ao antigo equivalente, para o app
--    sugerir a última carga na primeira sessão do ciclo.
alter table exercises
  add column if not exists origin_exercise_id uuid references exercises(id);

-- 2. Arquiva o ciclo 1 da Nicole.
update exercises
   set archived = true
 where profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
   and archived = false;

-- 3. Insere o ciclo 2.
--    Convenção do seed: alternativa/observação entre parênteses no nome.
--    Bi-set = dois exercícios seguidos; o primeiro tem rest 0 (emenda
--    direto no segundo) e o segundo carrega o descanso do par.
--    A última coluna é o nome do exercício do ciclo 1 do qual a carga
--    é herdada — só onde o implemento bate. NULL = começa do zero.
insert into exercises (profile_id, workout_key, name, sets, reps, rest, position, origin_exercise_id)
select
  '2fd03f76-567f-4e74-ad65-ae71add138fc'::uuid,
  v.workout_key,
  v.name,
  v.sets,
  v.reps,
  v.rest,
  v.position,
  (select o.id
     from exercises o
    where o.profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
      and o.archived = true
      and o.name = v.origin
    limit 1)
from (values
  -- Treino A — Posterior de Coxa e Glúteos
  ('treino_a', 'Mesa flexora (pirâmide — sobe carga a cada série)',              4, '15/12/10/8', 75,  0, 'Mesa flexora'),
  ('treino_a', 'Cadeira flexora unilateral',                                     3, '10 cada',    60,  1, null),
  ('treino_a', 'Stiff no Smith (ou banco romano / pull through na polia)',       4, '12',         90,  2, null),
  ('treino_a', 'Elevação pélvica (bi-set 1 — emenda no afundo)',                 3, '12',         0,   3, 'Hip thrust / Elevação pélvica'),
  ('treino_a', 'Afundo passada atrás (bi-set 2 — sem descanso)',                 3, '12 cada',    90,  4, null),
  ('treino_a', 'Leg press horizontal unilateral (pé alto na plataforma)',        4, '12 cada',    75,  5, null),

  -- Treino B — Superiores (repete 2× na semana) + HIIT
  ('treino_b', 'Puxada com triângulo (pirâmide — sobe carga a cada série)',      4, '15/12/10/8', 75,  0, 'Puxada com triângulo (cabo)'),
  ('treino_b', 'Pulldown na polia alta (bi-set 1 — emenda no tríceps)',          3, '10',         0,   1, null),
  ('treino_b', 'Tríceps pulley (bi-set 2 — sem descanso)',                       3, '10',         75,  2, 'Tríceps na corda (polia)'),
  ('treino_b', 'Desenvolvimento com halteres sentada (pirâmide)',                3, '15/12/10',   75,  3, 'Desenvolvimento com halteres'),
  ('treino_b', 'Supino inclinado com halteres ~30° (bi-set 1 — emenda na rosca)',3, '12',         0,   4, 'Supino com halteres'),
  ('treino_b', 'Rosca martelo (bi-set 2 — sem descanso)',                        3, '12',         75,  5, 'Rosca martelo'),
  ('treino_b', 'Esteira HIIT — 1 min caminhada + 1 min corrida',                 1, '10 ciclos (20 min)', 0, 6, null),

  -- Treino C — Quadríceps e Glúteos
  ('treino_c', 'Leg press (pirâmide — última série pesada)',                     4, '20/15/12/8', 90,  0, 'Leg press'),
  ('treino_c', 'Afundo no Smith (passo longo = mais glúteo)',                    4, '10 cada',    75,  1, null),
  ('treino_c', 'Cadeira extensora (bi-set 1 — emenda no agachamento)',           4, '12',         0,   2, 'Cadeira extensora'),
  ('treino_c', 'Agachamento livre sem peso (bi-set 2 — sem descanso)',           4, '20',         90,  3, null),
  ('treino_c', 'Cadeira abdutora (segura 3 s aberta)',                           3, '20',         60,  4, 'Abdução de quadril na máquina'),
  ('treino_c', 'Glúteo coice na polia (movimento vem do quadril)',               4, '12 cada',    60,  5, null),

  -- Treino D — Glúteos
  ('treino_d', 'Agachamento sumô com halter (pirâmide)',                         4, '15/12/10/8', 90,  0, 'Agachamento sumô com halter'),
  ('treino_d', 'Búlgaro com halteres (pé de trás no banco)',                     3, '10 cada',    75,  1, null),
  ('treino_d', 'Elevação pélvica na máquina (segura 1–2 s no topo)',             4, '12',         90,  2, null),
  ('treino_d', 'Glúteo coice na polia (bi-set 1 — emenda na abdução)',           3, '12 cada',    0,   3, null),
  ('treino_d', 'Abdução de quadril na polia (bi-set 2 — sem descanso)',          3, '12 cada',    75,  4, null),
  ('treino_d', 'Cadeira abdutora — dropset (20 reps + 2 quedas de carga)',       3, '20 + drops', 75,  5, 'Abdução de quadril na máquina')
) as v(workout_key, name, sets, reps, rest, position, origin);

-- 4. Conferência: deve listar 25 linhas ativas, 12 delas com origem preenchida.
select workout_key, position, name, sets, reps,
       (select o.name from exercises o where o.id = e.origin_exercise_id) as herda_carga_de
  from exercises e
 where e.profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
   and e.archived = false
 order by workout_key, position;
