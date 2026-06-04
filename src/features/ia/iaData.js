/* IA — roteiro de demonstração do AI Response System no protótipo.
 * Mapeia entradas/seleções → respostas ESTRUTURADAS (contrato do
 * AIResponseRenderer). Conteúdo clínico ilustrativo; o produto final
 * plugaria um backend no lugar deste roteiro. */

export const ILLUSTRATIVE =
  'Exemplo ilustrativo. Conteúdo clínico final deve ser validado pelo time médico.';

// Sugestões iniciais (estado vazio + fallback). value = token de roteiro.
export const STARTERS = [
  { label: 'dose de adrenalina?', value: 'q:adrena' },
  { label: 'paciente hipotenso', value: 'q:hipo' },
  { label: 'interpreta uma gasometria', value: 'q:gaso' },
  { label: 'noradrenalina vs dobutamina', value: 'q:noradobu' },
  { label: 'resume pra evolução', value: 'q:resumo' },
];

const RESPONSES = {
  // ---- Dose ambígua → Context Selector → Compact Answer ----
  'q:adrena': {
    intent: 'ambigua',
    title: 'Em qual contexto?',
    blocks: [
      {
        type: 'context_selector',
        question: 'A dose de adrenalina muda conforme a indicação. Selecione:',
        options: [
          { label: 'PCR', value: 'adrena:pcr' },
          { label: 'Anafilaxia', value: 'adrena:ana' },
          { label: 'Choque', value: 'adrena:choque' },
          { label: 'Pediatria (PCR)', value: 'adrena:ped' },
        ],
      },
    ],
  },
  'adrena:pcr': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina na PCR (adulto)',
    blocks: [
      { type: 'dose', value: '1 mg', unit: 'IV/IO', via: 'a cada 3–5 min' },
      { type: 'text', content: 'Sem teto de dose na parada. Manter RCP de alta qualidade entre as doses.' },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Ver ACLS' }, { label: 'Dose pediátrica', value: 'adrena:ped' }],
  },
  'adrena:ana': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina na anafilaxia',
    blocks: [
      { type: 'dose', value: '0,5 mg', unit: 'IM (1:1000)', via: 'face anterolateral da coxa · repetir 5–15 min' },
      { type: 'text', content: 'Via IM é a de escolha. IV apenas em choque refratário, com monitorização.' },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Dose pediátrica', value: 'adrena:ped' }],
  },
  'adrena:choque': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina em infusão (choque)',
    blocks: [
      { type: 'dose', value: '0,01–0,5', unit: 'mcg/kg/min', via: 'infusão contínua · titular pela PAM' },
      { type: 'text', content: 'Considerada em choque refratário; preferir noradrenalina como 1ª linha no choque séptico.' },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Comparar com noradrenalina', value: 'q:noradobu' }],
  },
  'adrena:ped': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina na PCR (pediátrica)',
    blocks: [
      { type: 'dose', value: '0,01 mg/kg', unit: 'IV/IO', via: 'máx 1 mg · a cada 3–5 min' },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },

  // ---- Triagem contextual → Guided Flow → Operational Response ----
  'q:hipo': {
    intent: 'triagem',
    title: 'Triagem guiada',
    blocks: [
      {
        type: 'context_selector',
        question: 'Qual cenário parece mais provável?',
        options: [
          { label: 'Sepse', value: 'hipo:sepse' },
          { label: 'Sangramento', value: 'hipo:sangramento' },
          { label: 'Cardiogênico', value: 'hipo:cardio' },
          { label: 'Anafilaxia', value: 'adrena:ana' },
          { label: 'Não sei', value: 'hipo:naosei' },
        ],
      },
    ],
  },
  'hipo:sepse': {
    intent: 'operacional',
    risk_level: 'alto',
    title: 'Choque séptico provável',
    context: 'Hipotensão + suspeita de foco infeccioso',
    blocks: [
      { type: 'primary_action', content: 'Iniciar noradrenalina — meta PAM ≥ 65 mmHg' },
      {
        type: 'checklist',
        tagLabel: 'Condutas paralelas',
        tagTone: 'atencao',
        items: ['ATB empírico < 1h + culturas', 'Reavaliar perfusão e lactato em 1h', 'Considerar acesso central'],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Calcular dose por peso' }, { label: 'Copiar conduta', value: 'q:resumo' }],
  },
  'hipo:sangramento': {
    intent: 'operacional',
    risk_level: 'alto',
    title: 'Choque hemorrágico provável',
    blocks: [
      { type: 'primary_action', content: 'Controle do foco + hemostasia. Acionar protocolo de transfusão maciça se instável.' },
      {
        type: 'checklist',
        tagLabel: 'Condutas paralelas',
        tagTone: 'atencao',
        items: ['2 acessos calibrosos', 'Ácido tranexâmico se < 3h', 'Tipagem + reserva de hemocomponentes'],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },
  'hipo:cardio': {
    intent: 'operacional',
    risk_level: 'alto',
    title: 'Choque cardiogênico provável',
    blocks: [
      { type: 'primary_action', content: 'Suporte inotrópico/vasopressor conforme perfil + tratar a causa (ex.: SCA).' },
      {
        type: 'checklist',
        tagLabel: 'Condutas paralelas',
        tagTone: 'atencao',
        items: ['ECG + troponina', 'Avaliar congestão x hipoperfusão', 'Cautela com volume'],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },
  'hipo:naosei': {
    intent: 'triagem',
    title: 'Vamos por dados objetivos',
    blocks: [
      { type: 'text', content: 'Sem hipótese fechada, seguimos pelos dados. O que você tem agora?' },
      {
        type: 'chips',
        label: 'Informe',
        items: [
          { label: 'PAM atual', value: 'hipo:sepse' },
          { label: 'Recebeu volume', value: 'hipo:sepse' },
          { label: 'Lactato', value: 'q:gaso' },
        ],
      },
    ],
  },

  // ---- Interpretação de exame ----
  'q:gaso': {
    intent: 'exame',
    title: 'Gasometria arterial',
    blocks: [
      {
        type: 'interpretation',
        columns: [
          { key: 'param', label: 'Parâmetro', emphasis: true },
          { key: 'valor', label: 'Valor', mono: true, align: 'right' },
          { key: 'status', label: '', align: 'right' },
        ],
        rows: [
          { param: 'pH', valor: '7.28', status: '↓ baixo' },
          { param: 'pCO₂', valor: '28', status: 'compensando' },
          { param: 'HCO₃', valor: '14', status: '↓ baixo' },
          { param: 'Lactato', valor: '5', status: '↑ alto' },
        ],
        reading: 'Acidose metabólica com compensação respiratória parcial e lactato elevado (hipoperfusão).',
        tone: 'atencao',
        chips: [
          { label: 'Calcular Winter' },
          { label: 'Ânion gap' },
          { label: 'Relacionar com sepse', value: 'hipo:sepse' },
        ],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },

  // ---- Comparação clínica ----
  'q:noradobu': {
    intent: 'comparacao',
    title: 'Noradrenalina × Dobutamina',
    blocks: [
      {
        type: 'table',
        columns: [
          { key: 'criterio', label: '', emphasis: true },
          { key: 'nora', label: 'Noradrenalina' },
          { key: 'dobu', label: 'Dobutamina' },
        ],
        rows: [
          { criterio: 'Ação', nora: 'Vasopressor (α)', dobu: 'Inotrópico (β1)' },
          { criterio: 'Efeito', nora: '↑ PA', dobu: '↑ débito' },
          { criterio: 'Quando', nora: 'Choque com PA baixa', dobu: 'Baixo débito com PA ok' },
        ],
      },
      { type: 'text', content: 'Regra prática: PA baixa → nora primeiro; débito baixo com PA mantida → dobuta.' },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },

  // ---- Resumo copiável ----
  'q:resumo': {
    intent: 'resumo',
    title: 'Resumo para evolução',
    blocks: [
      {
        type: 'copyable',
        variants: [
          { label: 'Prontuário', text: 'Paciente com choque séptico provável. PAM 58 mmHg após reposição volêmica, lactato 5 mmol/L. Iniciada noradrenalina (meta PAM ≥ 65) e ATB empírico < 1h.' },
          { label: 'Curto', text: 'Choque séptico provável. Nora em curso (meta PAM ≥ 65) + ATB empírico.' },
          { label: 'WhatsApp', text: 'Choque séptico provável 🚨 PAM 58 pós-volume, lactato 5. Iniciei nora (meta PAM ≥ 65) e ATB.' },
        ],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },
};

const FALLBACK = {
  intent: 'ambigua',
  title: 'Posso ajudar com alguns exemplos',
  blocks: [
    { type: 'text', content: 'Esta é uma demonstração do AI Response System. Toque em um exemplo:' },
    { type: 'chips', items: STARTERS },
  ],
};

// Casa texto livre com um token de roteiro (heurística simples de demonstração).
function matchText(text) {
  const t = (text || '').toLowerCase();
  if (t.includes('adrenalina') && t.includes('pcr')) return 'adrena:pcr';
  if (t.includes('adrenalina') && (t.includes('anafilax') || t.includes('alergi'))) return 'adrena:ana';
  if (t.includes('adrenalina')) return 'q:adrena';
  if (t.includes('hipotens') || t.includes('pressão baixa') || t.includes('pressao baixa')) return 'q:hipo';
  if (t.includes('noradrenalina') && t.includes('dobutamina')) return 'q:noradobu';
  if (t.includes('gaso') || t.includes('ph ') || (t.includes('hco3') || t.includes('hco₃'))) return 'q:gaso';
  if (t.includes('resume') || t.includes('resumo') || t.includes('evolu') || t.includes('prontuário') || t.includes('prontuario')) return 'q:resumo';
  return null;
}

/** Resolve uma entrada (token de roteiro OU texto livre) → resposta estruturada. */
export function respond(input) {
  if (RESPONSES[input]) return RESPONSES[input];
  const token = matchText(input);
  if (token && RESPONSES[token]) return RESPONSES[token];
  return FALLBACK;
}
