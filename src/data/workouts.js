// Metadados dos perfis e treinos.
// Os EXERCÍCIOS agora vivem no banco (tabela `exercises`) e são editáveis no app.
// Aqui ficam só nome/foco/tag/agenda de cada treino.

export const PROFILES = [
  {
    key: 'jeff',
    name: 'Jeff',
    split: 'ABC',
    objective: 'Hipertrofia',
    objectiveDetail: 'Ganhar massa muscular com sobrecarga progressiva. Push/Pull/Legs sem dia fixo — treina na ordem A → B → C, na frequência que der.',
  },
  {
    key: 'nicole',
    name: 'Nicole',
    split: 'ABCD',
    objective: 'Glúteos e posterior',
    objectiveDetail: 'Ciclo do personal: 2 treinos de inferiores (glúteos, posterior e VMO) + 1 de superiores com HIIT. Extensora unilateral em 0°–30° nos dois inferiores, para puxar o VMO. Alterna Inferior A e Inferior B, com o de superiores entre eles.',
  },
  {
    key: 'jo',
    name: 'Jô',
    split: 'ABCD',
    objective: 'Performance no vôlei',
    objectiveDetail: 'Complementar o vôlei com foco em cadeia posterior (base para o salto), saúde do ombro e equilíbrio muscular. Treino sem falha (RIR 2–3), sem barra nas costas.',
  },
]

const jeffWorkouts = {
  treino_a: { key: 'treino_a', label: 'Treino A', focus: 'Peito, Ombros e Tríceps', tag: 'Push' },
  treino_b: { key: 'treino_b', label: 'Treino B', focus: 'Costas e Bíceps',          tag: 'Pull' },
  treino_c: { key: 'treino_c', label: 'Treino C', focus: 'Pernas e Core',            tag: 'Legs' },
}

const nicoleWorkouts = {
  treino_a: { key: 'treino_a', label: 'Inferior A', badge: 'A', focus: 'Glúteos, Posterior e VMO',         tag: 'Glutes' },
  treino_b: { key: 'treino_b', label: 'Superiores', badge: 'S', focus: 'Superiores + HIIT (2× na semana)', tag: 'Upper' },
  treino_c: { key: 'treino_c', label: 'Inferior B', badge: 'B', focus: 'Glúteos, Posterior e VMO',         tag: 'Legs' },
  // Saiu no ciclo 3 (eram 3 treinos de perna, agora são 2). Fica aqui só
  // para o histórico antigo mostrar "Treino D" em vez do workout_key cru.
  treino_d: { key: 'treino_d', label: 'Treino D', badge: 'D', focus: 'Glúteos', tag: 'Glutes', archived: true },
}

const grupoWorkouts = {
  treino_a: { key: 'treino_a', label: 'Treino A', focus: 'Peito, Ombros e Tríceps',        tag: 'Push' },
  treino_b: { key: 'treino_b', label: 'Treino B', focus: 'Pernas — Quadríceps e Adutores', tag: 'Legs' },
  treino_c: { key: 'treino_c', label: 'Treino C', focus: 'Costas, Bíceps e Core',          tag: 'Pull' },
  treino_d: { key: 'treino_d', label: 'Treino D', focus: 'Pernas — Glúteos e Posterior',   tag: 'Glutes' },
}

export const WORKOUTS = {
  jeff: jeffWorkouts,
  nicole: nicoleWorkouts,
  jo: grupoWorkouts,
}

export const TAG_COLORS = {
  Push:   { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Pull:   { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  Legs:   { bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/30' },
  Glutes: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  Upper:  { bg: 'bg-pink-500/20',   text: 'text-pink-400',   border: 'border-pink-500/30' },
}
