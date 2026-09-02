-- ============================================================
-- Ciclo 3 da Nicole: agora só DOIS treinos de perna (era três).
-- Rodar UMA VEZ no SQL Editor do Supabase.
-- Só mexe no perfil da Nicole. Jeff e Jô ficam intactos.
--
-- O que muda:
--   treino_a  -> Inferior A (Glúteos + Posterior + VMO)
--   treino_c  -> Inferior B (Glúteos + Posterior + VMO)
--   treino_d  -> DESATIVADO (não existe mais treino de perna nº 3)
--   treino_b  -> superiores + HIIT, NÃO É TOCADO por esta migration
--
-- Os exercícios antigos são ARQUIVADOS (archived = true), nunca
-- deletados: o histórico de sessões continua ligado a eles.
-- ============================================================

-- 1. Arquiva só os treinos de perna do ciclo 2. O treino_b (superiores)
--    continua ativo exatamente como está.
update exercises
   set archived = true
 where profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
   and archived = false
   and workout_key in ('treino_a', 'treino_c', 'treino_d');

-- 2. Insere o ciclo 3.
--    Convenção do seed: alternativa/observação entre parênteses no nome.
--    A última coluna é o nome do exercício antigo do qual a carga é
--    herdada. NULL = começa do zero, de propósito: ou o aparelho mudou,
--    ou o exercício virou unilateral (sugerir a carga bilateral seria
--    peso demais para uma perna só).
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
    order by o.created_at desc
    limit 1)
from (values
  -- Inferior A: Glúteos + Posterior + VMO
  ('treino_a', 'Hip thrust',                                         4, '10-12',  90, 0, 'Elevação pélvica (bi-set 1 — emenda no afundo)'),
  ('treino_a', 'Mesa flexora',                                       4, '10-12',  75, 1, 'Mesa flexora (pirâmide — sobe carga a cada série)'),
  ('treino_a', 'Cadeira extensora unilateral (0°–30°, foco no VMO)', 4, '15 cada', 60, 2, null),
  ('treino_a', 'Cadeira abdutora',                                   4, '15-20',  60, 3, 'Cadeira abdutora (segura 3 s aberta)'),
  ('treino_a', 'Glúteo coice na polia',                              3, '15 cada', 60, 4, 'Glúteo coice na polia (movimento vem do quadril)'),
  ('treino_a', 'Alongamento de posterior de coxa',                   3, '30 s',   30, 5, null),

  -- Inferior B: Glúteos + Posterior + VMO
  ('treino_c', 'Stiff com halteres ou barra',                        4, '10',     90, 0, 'Stiff no Smith (ou banco romano / pull through na polia)'),
  ('treino_c', 'Ponte de glúteo com peso (no chão)',                 4, '12-15',  75, 1, null),
  ('treino_c', 'Flexora sentada',                                    4, '12',     75, 2, null),
  ('treino_c', 'Cadeira extensora unilateral (0°–30°, foco no VMO)', 4, '15 cada', 60, 3, null),
  ('treino_c', 'Cadeira adutora',                                    4, '15',     60, 4, null),
  ('treino_c', 'Cadeira abdutora',                                   3, '20',     60, 5, 'Cadeira abdutora (segura 3 s aberta)'),
  ('treino_c', 'Alongamento de posterior de coxa',                   3, '30 s',   30, 6, null)
) as v(workout_key, name, sets, reps, rest, position, origin);

-- 3. Conferência A: deve listar 13 exercícios novos de perna,
--    6 deles com carga herdada (4 no Inferior A, 2 no Inferior B).
select workout_key, position, name, sets, reps, rest,
       (select o.name from exercises o where o.id = e.origin_exercise_id) as herda_carga_de
  from exercises e
 where e.profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
   and e.archived = false
   and e.workout_key in ('treino_a', 'treino_c')
 order by workout_key, position;

-- 4. Conferência B: o treino_b (superiores) tem que continuar ativo,
--    com os 7 exercícios de sempre. Se vier 0, algo saiu errado.
select count(*) as superiores_ativos
  from exercises
 where profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
   and archived = false
   and workout_key = 'treino_b';

-- 5. Conferência C: treino_d tem que estar zerado (nenhum ativo).
select count(*) as perna_3_ativos
  from exercises
 where profile_id = '2fd03f76-567f-4e74-ad65-ae71add138fc'
   and archived = false
   and workout_key = 'treino_d';
