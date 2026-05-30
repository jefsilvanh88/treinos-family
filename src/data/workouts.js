export const PROFILES = [
  {
    key: 'jeff',
    name: 'Jeff',
    split: 'ABC',
    scheduledDays: [2, 4, 6],
    objective: 'Hipertrofia',
    objectiveDetail: 'Ganhar massa muscular com sobrecarga progressiva. Treinos Push/Pull/Legs 3×/semana — intensidade alta, descansos longos nos compostos.',
  },
  {
    key: 'nicole',
    name: 'Nicole',
    split: 'ABCD',
    scheduledDays: null,
    objective: 'Preservação muscular',
    objectiveDetail: 'Retorno ao treino com intensidade controlada (RIR 3 — longe da falha). Manter e recuperar massa sem sobrecarregar as articulações. Foco em compostos com halteres e máquinas.',
  },
  {
    key: 'jo',
    name: 'Jô',
    split: 'ABCD',
    scheduledDays: null,
    objective: 'Performance no vôlei',
    objectiveDetail: 'Complementar o vôlei com foco em cadeia posterior (base para o salto), saúde do ombro e equilíbrio muscular. Treino sem falha (RIR 2–3), sem barra nas costas.',
  },
]

// Jeff — ABC Hipertrofia (intermediário)
const jeffWorkouts = {
  treino_a: {
    key: 'treino_a',
    label: 'Treino A',
    focus: 'Peito, Ombros e Tríceps',
    tag: 'Push',
    day: 'Terça-feira',
    goal: 'Ganho de massa nos músculos empurradores. Prioridade no supino pesado (6–8 reps) para sobrecarga progressiva no peitoral, depois volume em ombro e tríceps para completar o estímulo push.',
    exercises: [
      { name: 'Supino reto com barra', sets: 4, reps: '6–8', rest: 120, tip: 'Pegada na largura dos ombros, desça até o peito, empurre explosivo.' },
      { name: 'Supino inclinado com halteres', sets: 3, reps: '8–10', rest: 90, tip: 'Banco a ~30°. Controle a descida em 2–3 s.' },
      { name: 'Crossover na polia (ou crucifixo)', sets: 3, reps: '12–15', rest: 60, tip: 'Leve flexão nos cotovelos, foco na contração do peitoral.' },
      { name: 'Desenvolvimento de ombros com halteres', sets: 4, reps: '8–10', rest: 90, tip: 'Sentado, cotovelos levemente à frente do tronco.' },
      { name: 'Elevação lateral', sets: 4, reps: '12–15', rest: 60, tip: 'Leve inclinação para frente, cotovelos com leve flexão.' },
      { name: 'Tríceps na corda (polia alta)', sets: 3, reps: '10–12', rest: 60, tip: 'Cotovelos fixos ao lado do corpo, separe as mãos embaixo.' },
      { name: 'Tríceps testa com barra W (francês)', sets: 3, reps: '10–12', rest: 60, tip: 'Cotovelos apontados para o teto, desça até a testa.' },
    ],
  },
  treino_b: {
    key: 'treino_b',
    label: 'Treino B',
    focus: 'Costas e Bíceps',
    tag: 'Pull',
    day: 'Quinta-feira',
    goal: 'Espessura e largura de costas com barra fixa e remadas pesadas. Bíceps como músculo secundário com volume suficiente para crescimento. O face pull no final protege o manguito rotador.',
    exercises: [
      { name: 'Barra fixa (ou puxada alta na máquina)', sets: 4, reps: '6–10', rest: 120, tip: 'Pegada pronada, puxe até o queixo acima da barra.' },
      { name: 'Remada curvada com barra', sets: 4, reps: '8–10', rest: 90, tip: 'Tronco a ~45°, puxe até o abdômen, cotovel no bolso.' },
      { name: 'Remada baixa sentado (cabo)', sets: 3, reps: '10–12', rest: 90, tip: 'Pegada neutra, puxe até o umbigo, escápulas juntas.' },
      { name: 'Puxada na polia, pegada neutra', sets: 3, reps: '12', rest: 60, tip: 'Puxe até o peito alto, controle a subida.' },
      { name: 'Rosca direta com barra', sets: 4, reps: '8–10', rest: 60, tip: 'Cotovelos fixos, suba em 1 s, desça em 2 s.' },
      { name: 'Rosca alternada com halteres', sets: 3, reps: '10–12', rest: 60, tip: 'Gire o pulso ao subir (supinação), controle a descida.' },
      { name: 'Rosca martelo', sets: 3, reps: '12–15', rest: 60, tip: 'Polegar para cima, sem girar o pulso.' },
      { name: 'Face pull (saúde do ombro)', sets: 3, reps: '15', rest: 45, tip: 'Polia na altura do rosto, puxe até as orelhas, cotovelos altos.' },
    ],
  },
  treino_c: {
    key: 'treino_c',
    label: 'Treino C',
    focus: 'Pernas e Core',
    tag: 'Legs',
    day: 'Sábado',
    goal: 'Força e hipertrofia de quadríceps, isquiotibiais e glúteos. Agachamento pesado como exercício-rei. Panturrilha e core no final para equilíbrio estrutural e prevenir lesões na lombar.',
    exercises: [
      { name: 'Agachamento livre', sets: 4, reps: '6–8', rest: 150, tip: 'Pés na largura dos ombros, joelhos seguem os pés, desça até a paralela.' },
      { name: 'Leg press 45°', sets: 4, reps: '10–12', rest: 120, tip: 'Não trave os joelhos no topo, pés na largura dos ombros.' },
      { name: 'Cadeira extensora', sets: 3, reps: '12–15', rest: 60, tip: 'Controle a fase excêntrica (2–3 s na descida).' },
      { name: 'Levantamento terra romeno / Stiff', sets: 4, reps: '8–10', rest: 120, tip: 'Quadril para trás, coluna neutra, barra próxima às pernas.' },
      { name: 'Mesa flexora (ou cadeira flexora)', sets: 3, reps: '10–12', rest: 60, tip: 'Controle a fase excêntrica, não solte rápido.' },
      { name: 'Panturrilha em pé', sets: 4, reps: '12–15', rest: 45, tip: 'Suba até a ponta máxima, desça abaixo da plataforma.' },
      { name: 'Prancha abdominal', sets: 3, reps: '30–60 s', rest: 45, tip: 'Quadril alinhado com o corpo, respire normalmente.' },
      { name: 'Elevação de pernas (abdômen inferior)', sets: 3, reps: '12–15', rest: 45, tip: 'Lombar colada no banco, suba as pernas até 90°.' },
    ],
  },
}

// Nicole — ABCD Preservação muscular / Retorno
const nicoleWorkouts = {
  treino_a: {
    key: 'treino_a',
    label: 'Treino A',
    focus: 'Peito, Ombros e Tríceps',
    tag: 'Push',
    goal: 'Reativar os músculos empurradores com intensidade controlada (RIR 3, longe da falha). Prioridade em reaprender o padrão de movimento com halteres, preservando as articulações na retomada.',
    exercises: [
      { name: 'Supino com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Banco reto, halteres na altura do peito, empurre para cima.' },
      { name: 'Supino inclinado com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Banco a ~30°, controle a descida em 2 s.' },
      { name: 'Desenvolvimento sentado com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Cotovelos a 90° na posição inicial, empurre para cima.' },
      { name: 'Elevação lateral', sets: 3, reps: '12–15', rest: 60, tip: 'Leve inclinação para frente, cotovelos levemente flexionados.' },
      { name: 'Tríceps na corda (polia)', sets: 3, reps: '12–15', rest: 60, tip: 'Cotovelos fixos, separe as mãos embaixo.' },
    ],
  },
  treino_b: {
    key: 'treino_b',
    label: 'Treino B',
    focus: 'Costas e Bíceps',
    tag: 'Pull',
    goal: 'Fortalecer a cadeia posterior do tronco e melhorar postura. Volume moderado em puxadas e remadas para recuperar a massa de costas sem sobrecarregar a coluna. Face pull fecha o treino protegendo os ombros.',
    exercises: [
      { name: 'Puxada alta na máquina', sets: 3, reps: '10–12', rest: 90, tip: 'Pegada um pouco mais larga que os ombros, puxe até o peito.' },
      { name: 'Remada baixa sentado (cabo)', sets: 3, reps: '10–12', rest: 90, tip: 'Pegada neutra, puxe até o umbigo.' },
      { name: 'Remada unilateral com haltere', sets: 3, reps: '10–12', rest: 90, tip: 'Joelho e mão no banco, puxe o cotovelo para o bolso.' },
      { name: 'Rosca alternada com halteres', sets: 3, reps: '12–15', rest: 60, tip: 'Gire o pulso ao subir, controle a descida.' },
      { name: 'Face pull', sets: 3, reps: '15', rest: 45, tip: 'Polia na altura do rosto, cotovelos altos.' },
    ],
  },
  treino_c: {
    key: 'treino_c',
    label: 'Treino C',
    focus: 'Pernas 1 — Quadríceps e Core',
    tag: 'Legs',
    goal: 'Recuperar força e tônus nos quadríceps com exercícios seguros (sem carga axial pesada). Goblet e leg press permitem boa ativação sem risco na coluna. Core ao final para estabilidade geral.',
    exercises: [
      { name: 'Agachamento goblet (halter)', sets: 3, reps: '12–15', rest: 90, tip: 'Segure o halter no peito, pés na largura dos ombros.' },
      { name: 'Leg press', sets: 3, reps: '12–15', rest: 90, tip: 'Não trave os joelhos, amplitude controlada.' },
      { name: 'Cadeira extensora', sets: 3, reps: '15', rest: 60, tip: 'Controle a fase excêntrica (2–3 s).' },
      { name: 'Panturrilha em pé', sets: 3, reps: '15', rest: 45, tip: 'Amplitude completa, suba e desça devagar.' },
      { name: 'Prancha abdominal', sets: 3, reps: '30 s', rest: 45, tip: 'Quadril alinhado, respire normalmente.' },
    ],
  },
  treino_d: {
    key: 'treino_d',
    label: 'Treino D',
    focus: 'Pernas 2 — Glúteos e Posterior',
    tag: 'Glutes',
    goal: 'Ativar e tonificar glúteos e isquiotibiais — cadeia frequentemente subutilizada no dia a dia. Hip thrust é o exercício principal. Avanço e abdução completam o estímulo multi-angular do glúteo.',
    exercises: [
      { name: 'Hip thrust / Elevação pélvica', sets: 3, reps: '12–15', rest: 90, tip: 'Ombros no banco, quadril sobe até a linha do joelho.' },
      { name: 'Stiff com halteres', sets: 3, reps: '12–15', rest: 90, tip: 'Quadril para trás, joelhos levemente flexionados.' },
      { name: 'Mesa flexora', sets: 3, reps: '12–15', rest: 60, tip: 'Controle a descida, não solte rápido.' },
      { name: 'Avanço com halteres', sets: 3, reps: '12/lado', rest: 90, tip: 'Passo largo, joelho da frente não passa do pé.' },
      { name: 'Abdução de quadril na máquina', sets: 3, reps: '15', rest: 45, tip: 'Controle a fase de retorno.' },
    ],
  },
}

// Jô — ABCD Atleta de Vôlei (12–14 anos)
const joWorkouts = {
  treino_a: {
    key: 'treino_a',
    label: 'Treino A',
    focus: 'Empurrar + Saúde do Ombro',
    tag: 'Push',
    goal: 'Desenvolver força empurradora para o ataque no vôlei e blindar o ombro contra lesões. O face pull é obrigatório: equilibra os rotadores e compensa o volume de arremesso dos treinos de quadra.',
    exercises: [
      { name: 'Supino com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Banco reto, controle o movimento.' },
      { name: 'Desenvolvimento com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Sentada, cotovelos a 90° na posição inicial.' },
      { name: 'Elevação lateral', sets: 3, reps: '12–15', rest: 60, tip: 'Leve inclinação, cotovelos flexionados.' },
      { name: 'Tríceps na corda', sets: 3, reps: '10–12', rest: 60, tip: 'Cotovelos fixos ao lado do corpo.' },
      { name: 'Face pull', sets: 3, reps: '15', rest: 45, tip: 'Essencial para saúde do ombro — não pule!' },
    ],
  },
  treino_b: {
    key: 'treino_b',
    label: 'Treino B',
    focus: 'Costas e Core',
    tag: 'Pull',
    goal: 'Fortalecer a cadeia posterior do tronco e o core — base de estabilidade para todos os movimentos do vôlei. Puxadas e remadas melhoram a postura e compensam o desequilíbrio gerado pelo saque e ataque.',
    exercises: [
      { name: 'Puxada alta na máquina', sets: 3, reps: '8–10', rest: 90, tip: 'Pegada na largura dos ombros, puxe até o peito.' },
      { name: 'Remada baixa sentado (cabo)', sets: 3, reps: '10–12', rest: 90, tip: 'Pegada neutra, escápulas no final.' },
      { name: 'Remada unilateral com haltere', sets: 3, reps: '10–12', rest: 60, tip: 'Costas retas, puxe o cotovelo para cima.' },
      { name: 'Rosca direta com halteres', sets: 3, reps: '10–12', rest: 60, tip: 'Cotovelos fixos, controle a descida.' },
      { name: 'Prancha abdominal', sets: 3, reps: '30–45 s', rest: 45, tip: 'Quadril neutro, não deixe afundar.' },
      { name: 'Elevação de pernas', sets: 3, reps: '12', rest: 45, tip: 'Lombar colada no banco, suba as pernas retas.' },
    ],
  },
  treino_c: {
    key: 'treino_c',
    label: 'Treino C',
    focus: 'Pernas 1 — Quadríceps e Funcional',
    tag: 'Legs',
    goal: 'Construir força de quadríceps e controle de movimento para saltos, bloqueios e mudanças de direção. Avanço treina estabilidade unilateral — habilidade crítica na quadra. Panturrilha forte reduz risco de entorse.',
    exercises: [
      { name: 'Agachamento goblet (halter)', sets: 3, reps: '10–12', rest: 120, tip: 'Segure o halter no peito, boa profundidade.' },
      { name: 'Leg press', sets: 3, reps: '10–12', rest: 120, tip: 'Amplitude controlada, não trave os joelhos.' },
      { name: 'Avanço com halteres', sets: 3, reps: '10/lado', rest: 90, tip: 'Passo largo, controle o tronco.' },
      { name: 'Cadeira extensora', sets: 3, reps: '12–15', rest: 60, tip: 'Fase excêntrica de 2–3 s.' },
      { name: 'Panturrilha em pé', sets: 3, reps: '15', rest: 45, tip: 'Amplitude completa para base de salto.' },
    ],
  },
  treino_d: {
    key: 'treino_d',
    label: 'Treino D',
    focus: 'Pernas 2 — Glúteos e Base de Salto',
    tag: 'Glutes',
    goal: 'Maximizar a potência do salto vertical — o ativo mais importante no vôlei. Glúteos fortes geram força propulsiva; isquiotibiais absorvem o impacto da aterrissagem. Hip thrust com 4 séries é o foco principal.',
    exercises: [
      { name: 'Hip thrust / Elevação pélvica', sets: 4, reps: '10–12', rest: 90, tip: 'Fundamental para potência no salto — foco na contração.' },
      { name: 'Stiff com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Quadril para trás, coluna neutra.' },
      { name: 'Mesa flexora', sets: 3, reps: '10–12', rest: 60, tip: 'Controle a fase de retorno.' },
      { name: 'Abdução de quadril na máquina', sets: 3, reps: '15', rest: 45, tip: 'Movimento controlado, não jogue a perna.' },
      { name: 'Agachamento sumô com halter', sets: 3, reps: '12', rest: 90, tip: 'Pés bem abertos, ponta dos pés para fora, desça fundo.' },
    ],
  },
}

export const WORKOUTS = {
  jeff: jeffWorkouts,
  nicole: nicoleWorkouts,
  jo: joWorkouts,
}

// Day of week → workout key for Jeff (1=Mon…7=Sun, using JS getDay: 0=Sun,1=Mon...)
// Jeff: Tue(2)=treino_a, Thu(4)=treino_b, Sat(6)=treino_c, Fri(5)=natação
export const JEFF_SCHEDULE = {
  2: 'treino_a',
  4: 'treino_b',
  6: 'treino_c',
}

export const TAG_COLORS = {
  Push: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
  Pull: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  Legs: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  Glutes: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
}
