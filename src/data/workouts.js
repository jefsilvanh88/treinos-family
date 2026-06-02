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
      { name: 'Supino reto com barra', sets: 4, reps: '6–8', rest: 60, tip: 'Pegada na largura dos ombros, desça até o peito, empurre explosivo.' },
      { name: 'Supino inclinado com halteres', sets: 3, reps: '8–10', rest: 60, tip: 'Banco a ~30°. Controle a descida em 2–3 s.' },
      { name: 'Crossover na polia (ou crucifixo)', sets: 3, reps: '12–15', rest: 60, tip: 'Leve flexão nos cotovelos, foco na contração do peitoral.' },
      { name: 'Desenvolvimento de ombros com halteres', sets: 4, reps: '8–10', rest: 60, tip: 'Sentado, cotovelos levemente à frente do tronco.' },
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
      { name: 'Barra fixa (ou puxada alta na máquina)', sets: 4, reps: '6–10', rest: 60, tip: 'Pegada pronada, puxe até o queixo acima da barra.' },
      { name: 'Remada curvada com barra', sets: 4, reps: '8–10', rest: 60, tip: 'Tronco a ~45°, puxe até o abdômen, cotovel no bolso.' },
      { name: 'Remada baixa sentado (cabo)', sets: 3, reps: '10–12', rest: 60, tip: 'Pegada neutra, puxe até o umbigo, escápulas juntas.' },
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
      { name: 'Agachamento livre', sets: 4, reps: '6–8', rest: 60, tip: 'Pés na largura dos ombros, joelhos seguem os pés, desça até a paralela.' },
      { name: 'Leg press 45°', sets: 4, reps: '10–12', rest: 60, tip: 'Não trave os joelhos no topo, pés na largura dos ombros.' },
      { name: 'Cadeira extensora', sets: 3, reps: '12–15', rest: 60, tip: 'Controle a fase excêntrica (2–3 s na descida).' },
      { name: 'Levantamento terra romeno / Stiff', sets: 4, reps: '8–10', rest: 60, tip: 'Quadril para trás, coluna neutra, barra próxima às pernas.' },
      { name: 'Mesa flexora (ou cadeira flexora)', sets: 3, reps: '10–12', rest: 60, tip: 'Controle a fase excêntrica, não solte rápido.' },
      { name: 'Panturrilha em pé', sets: 4, reps: '12–15', rest: 45, tip: 'Suba até a ponta máxima, desça abaixo da plataforma.' },
      { name: 'Prancha abdominal', sets: 3, reps: '30–60 s', rest: 45, tip: 'Quadril alinhado com o corpo, respire normalmente.' },
      { name: 'Elevação de pernas (abdômen inferior)', sets: 3, reps: '12–15', rest: 45, tip: 'Lombar colada no banco, suba as pernas até 90°.' },
    ],
  },
}

// Nicole + Jô — ABCD compartilhado (treinam juntas)
// Sem barra nas costas, face pull obrigatório em A, funcional em C, hip thrust 4x em D
const grupoWorkouts = {
  treino_a: {
    key: 'treino_a',
    label: 'Treino A',
    focus: 'Peito, Ombros e Tríceps',
    tag: 'Push',
    goal: 'Ativar os músculos empurradores com intensidade controlada. Face pull obrigatório ao final para saúde do ombro.',
    exercises: [
      { name: 'Supino com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Banco reto, halteres na altura do peito. Controle a descida em 2 s — não solte rápido.' },
      { name: 'Supino inclinado com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Banco a ~30°. Desça até sentir o alongamento no peitoral, empurre para cima sem trancar os cotovelos.' },
      { name: 'Desenvolvimento com halteres', sets: 3, reps: '10–12', rest: 90, tip: 'Sentada, cotovelos a 90° na posição inicial. Empurre até quase travar, desça controlado.' },
      { name: 'Elevação lateral', sets: 3, reps: '12–15', rest: 60, tip: 'Leve inclinação para frente, cotovelos com leve flexão. Suba até a altura do ombro — sem balanço.' },
      { name: 'Tríceps na corda (polia)', sets: 3, reps: '12–15', rest: 60, tip: 'Cotovelos fixos ao lado do corpo. Separe as mãos embaixo e controle a subida.' },
      { name: 'Face pull', sets: 3, reps: '15', rest: 45, tip: 'Polia na altura do rosto, puxe até as orelhas com cotovelos altos. Protege o manguito rotador — não pule esse!' },
    ],
  },
  treino_b: {
    key: 'treino_b',
    label: 'Treino B',
    focus: 'Costas, Bíceps e Core',
    tag: 'Pull',
    goal: 'Fortalecer a cadeia posterior do tronco, melhorar postura e construir core. Base de estabilidade para todos os movimentos.',
    exercises: [
      { name: 'Puxada alta na máquina', sets: 3, reps: '10–12', rest: 90, tip: 'Pegada um pouco mais larga que os ombros. Puxe até o peito alto, controle a subida.' },
      { name: 'Remada baixa sentado (cabo)', sets: 3, reps: '10–12', rest: 90, tip: 'Pegada neutra, puxe até o umbigo. Junte as escápulas no final do movimento.' },
      { name: 'Remada unilateral com haltere', sets: 3, reps: '10–12', rest: 90, tip: 'Joelho e mão apoiados no banco. Costas retas, puxe o cotovelo para o bolso.' },
      { name: 'Rosca alternada com halteres', sets: 3, reps: '12–15', rest: 60, tip: 'Cotovelos fixos ao lado do corpo. Gire o pulso ao subir (supinação), controle a descida em 2 s.' },
      { name: 'Prancha abdominal', sets: 3, reps: '30–45 s', rest: 45, tip: 'Quadril alinhado com o corpo — nem levantado nem caído. Respire normalmente.' },
      { name: 'Elevação de pernas', sets: 3, reps: '12', rest: 45, tip: 'Lombar colada no banco, suba as pernas retas até 90°. Desça sem bater.' },
    ],
  },
  treino_c: {
    key: 'treino_c',
    label: 'Treino C',
    focus: 'Pernas 1 — Quadríceps e Funcional',
    tag: 'Legs',
    goal: 'Força de quadríceps e controle unilateral. Avanço treina estabilidade e equilíbrio — habilidade essencial no dia a dia e no esporte.',
    exercises: [
      { name: 'Agachamento goblet (halter)', sets: 3, reps: '12–15', rest: 90, tip: 'Segure o halter no peito com as duas mãos. Pés na largura dos ombros, desça até a paralela.' },
      { name: 'Leg press', sets: 3, reps: '12–15', rest: 90, tip: 'Amplitude controlada. Não trave os joelhos no topo, pés na largura dos ombros.' },
      { name: 'Cadeira adutora', sets: 3, reps: '15', rest: 60, tip: 'Controle a fase de abertura (excêntrica). Não deixe o peso abrir rápido — o retorno lento é onde o músculo trabalha.' },
      { name: 'Cadeira extensora', sets: 3, reps: '15', rest: 60, tip: 'Controle a fase excêntrica (2–3 s na descida). Não solte rápido.' },
      { name: 'Panturrilha em pé', sets: 3, reps: '15', rest: 45, tip: 'Amplitude completa — sobe até a ponta máxima, desce abaixo da plataforma.' },
    ],
  },
  treino_d: {
    key: 'treino_d',
    label: 'Treino D',
    focus: 'Pernas 2 — Glúteos e Posterior',
    tag: 'Glutes',
    goal: 'Glúteos e isquiotibiais — cadeia posterior completa. Hip thrust é o principal; os demais complementam e equilibram.',
    exercises: [
      { name: 'Hip thrust / Elevação pélvica', sets: 4, reps: '10–12', rest: 90, tip: 'Ombros apoiados no banco. Suba o quadril até formar linha reta com os joelhos. Contraia o glúteo no topo por 1 s.' },
      { name: 'Stiff com halteres', sets: 3, reps: '12–15', rest: 90, tip: 'Quadril para trás, joelhos levemente flexionados, coluna neutra. Desça até sentir o alongamento nos isquiotibiais.' },
      { name: 'Mesa flexora', sets: 3, reps: '12–15', rest: 60, tip: 'Controle a fase excêntrica — não solte rápido. Flexione até 90° ou o máximo confortável.' },
      { name: 'Agachamento sumô com halter', sets: 3, reps: '12', rest: 90, tip: 'Pés bem abertos, pontas para fora. Segure o halter pendurado entre as pernas, desça fundo.' },
      { name: 'Abdução de quadril na máquina', sets: 3, reps: '15', rest: 45, tip: 'Movimento controlado — não jogue a perna. Controle a fase de retorno.' },
    ],
  },
}

const nicoleWorkouts = grupoWorkouts
const joWorkouts = grupoWorkouts

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
