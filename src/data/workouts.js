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
    objective: 'Preservação muscular',
    objectiveDetail: 'Retorno ao treino com intensidade controlada (RIR 3 — longe da falha). Manter e recuperar massa sem sobrecarregar as articulações. Foco em compostos com halteres e máquinas.',
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

const grupoWorkouts = {
  treino_a: { key: 'treino_a', label: 'Treino A', focus: 'Peito, Ombros e Tríceps',        tag: 'Push' },
  treino_b: { key: 'treino_b', label: 'Treino B', focus: 'Pernas — Quadríceps e Adutores', tag: 'Legs' },
  treino_c: { key: 'treino_c', label: 'Treino C', focus: 'Costas, Bíceps e Core',          tag: 'Pull' },
  treino_d: { key: 'treino_d', label: 'Treino D', focus: 'Pernas — Glúteos e Posterior',   tag: 'Glutes' },
}

export const WORKOUTS = {
  jeff: jeffWorkouts,
  nicole: grupoWorkouts,
  jo: grupoWorkouts,
}

export const TAG_COLORS = {
  Push:   { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Pull:   { bg: 'bg-blue-500/20',   text: 'text-blue-400',   border: 'border-blue-500/30' },
  Legs:   { bg: 'bg-green-500/20',  text: 'text-green-400',  border: 'border-green-500/30' },
  Glutes: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
}
