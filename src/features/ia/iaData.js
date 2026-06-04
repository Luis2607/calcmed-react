/* IA — roteiro de demonstração do AI Response System no protótipo.
 * Mapeia entradas/seleções → respostas ESTRUTURADAS (contrato do
 * AIResponseRenderer). Conteúdo clínico ilustrativo; o produto final
 * plugaria um backend no lugar deste roteiro. */

export const ILLUSTRATIVE =
  'Exemplo ilustrativo. Conteúdo clínico final deve ser validado pelo time médico.';

// Sugestões iniciais (estado vazio + fallback). value = token de roteiro.
// Cobrem a amplitude dos patterns: ambígua, triagem, crítico, exame, protocolo,
// aprendizado e resumo. Comparação é alcançável por texto/ações.
export const STARTERS = [
  { label: 'dose de adrenalina?', value: 'q:adrena' },
  { label: 'paciente hipotenso', value: 'q:hipo' },
  { label: 'K 7,1 com QRS largo', value: 'crit:k' },
  { label: 'interpreta uma gasometria', value: 'q:gaso' },
  { label: 'protocolo de PCR', value: 'proto:pcr' },
  { label: 'me explica sepse', value: 'learn:sepse' },
  { label: 'resume pra evolução', value: 'q:resumo' },
];

const PCR_STEPS = [
  'Checar responsividade e pulso',
  'RCP 30:2 + monitor/desfibrilador',
  'Analisar o ritmo',
  'Chocável? desfibrilar; adrenalina',
  'RCE → cuidados pós-parada',
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
    actions: [{ label: 'Ver ACLS', value: 'stub:tool' }, { label: 'Dose pediátrica', value: 'adrena:ped' }],
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
    actions: [{ label: 'Calcular dose por peso', value: 'stub:tool' }, { label: 'Copiar conduta', value: 'q:resumo' }],
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
          { label: 'Calcular Winter', value: 'stub:tool' },
          { label: 'Ânion gap', value: 'stub:tool' },
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

  // ---- Alerta crítico (Critical Alert) ----
  'crit:k': {
    intent: 'critico',
    risk_level: 'alto',
    title: 'Hipercalemia com alteração no ECG',
    context: 'K⁺ 7,1 mEq/L · QRS alargado',
    blocks: [
      { type: 'alert', level: 'critical', title: 'Risco de arritmia / PCR', content: 'QRS largo indica instabilidade de membrana — agir agora.' },
      { type: 'primary_action', tone: 'critico', content: 'Gluconato de cálcio 10% IV — estabiliza a membrana (não baixa o K⁺).' },
      {
        type: 'checklist',
        tagLabel: 'Em seguida',
        tagTone: 'critico',
        items: ['Insulina regular + glicose (desloca K⁺ p/ dentro)', 'Beta-2 agonista inalatório', 'Monitorização contínua + ECG seriado'],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Doses por peso', value: 'stub:tool' }, { label: 'Copiar conduta', value: 'q:resumo' }],
  },

  // ---- Protocolo guiado (Protocol Stepper) ----
  'proto:pcr': {
    intent: 'protocolo',
    risk_level: 'alto',
    title: 'Protocolo de PCR · ACLS',
    blocks: [
      { type: 'stepper', label: 'PCR', current: 2, steps: PCR_STEPS },
      { type: 'primary_action', content: 'Próxima decisão: o ritmo é chocável?' },
      {
        type: 'chips',
        label: 'Ramificar',
        items: [
          { label: 'Chocável (FV/TVSP)', value: 'proto:pcr:choca' },
          { label: 'Não-chocável (AESP/Assist.)', value: 'proto:pcr:naochoca' },
        ],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },
  'proto:pcr:choca': {
    intent: 'protocolo',
    risk_level: 'alto',
    title: 'Ritmo chocável (FV / TV sem pulso)',
    blocks: [
      { type: 'stepper', label: 'PCR', current: 3, steps: PCR_STEPS },
      { type: 'primary_action', content: 'Desfibrilar (bifásico 120–200 J) → retomar RCP por 2 min.' },
      {
        type: 'checklist',
        tagLabel: 'Drogas',
        tagTone: 'atencao',
        items: ['Adrenalina 1 mg IV/IO a cada 3–5 min', 'Amiodarona 300 mg após o 3º choque'],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Dose de adrenalina', value: 'adrena:pcr' }],
  },
  'proto:pcr:naochoca': {
    intent: 'protocolo',
    risk_level: 'alto',
    title: 'Ritmo não-chocável (AESP / Assistolia)',
    blocks: [
      { type: 'stepper', label: 'PCR', current: 3, steps: PCR_STEPS },
      { type: 'primary_action', content: 'RCP de alta qualidade + adrenalina 1 mg a cada 3–5 min.' },
      {
        type: 'checklist',
        tagLabel: 'Buscar causas reversíveis (5H/5T)',
        tagTone: 'atencao',
        items: ['5H: hipovolemia, hipóxia, H⁺ (acidose), hipo/hipercalemia, hipotermia', '5T: pneumotórax hipertensivo, tamponamento, toxinas, trombose (TEP/IAM)'],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Dose de adrenalina', value: 'adrena:pcr' }],
  },

  // ---- Aprendizado (Learning Layer) ----
  'learn:sepse': {
    intent: 'aprendizado',
    title: 'Choque séptico — em camadas',
    blocks: [
      { type: 'text', content: 'Resumo: disfunção orgânica por resposta desregulada à infecção, com hipotensão que exige vasopressor e/ou lactato elevado apesar de volume adequado.' },
      { type: 'expandable', title: 'Por que noradrenalina é a 1ª linha?', content: 'Vasopressor potente (α1) que eleva a PAM com menor risco arritmogênico que a dopamina — mantém a perfusão sem taquicardia excessiva.' },
      { type: 'expandable', title: 'Como reconhecer (critérios)', content: 'Sepse + necessidade de vasopressor para manter PAM ≥ 65 mmHg + lactato > 2 mmol/L apesar de ressuscitação volêmica adequada.' },
      {
        type: 'chips',
        label: 'Aprofundar',
        items: [
          { label: 'Conduta no plantão', value: 'hipo:sepse' },
          { label: 'Comparar vasopressores', value: 'q:noradobu' },
        ],
      },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
  },
};

// Stub de ferramenta: ações de calculadora/referência que, no produto, abririam
// a ferramenta correspondente. Na demo, respondem de forma intencional.
const TOOL_STUB = {
  intent: 'aprendizado',
  title: 'Ferramenta em demonstração',
  blocks: [
    { type: 'text', content: 'No produto, este passo abriria a calculadora ou a referência correspondente. Esta tela demonstra o sistema de respostas.' },
    { type: 'chips', label: 'Continuar', items: STARTERS },
  ],
};

const FALLBACK = {
  intent: 'ambigua',
  title: 'Posso ajudar com isso',
  blocks: [
    { type: 'text', content: 'Esta é uma demonstração do AI Response System do CalcMed. Reconheço dose, conduta, exame, protocolo, comparação e resumo — toque em um exemplo para ver:' },
    { type: 'chips', items: STARTERS },
  ],
};

// Casa texto livre com um token de roteiro (heurística simples de demonstração).
// Ordem importa: específicos e críticos primeiro.
function matchText(text) {
  const t = (text || '').toLowerCase();
  const has = (...keys) => keys.some((k) => t.includes(k));
  const explica = has('explica', 'explique', 'o que é', 'o que e', 'aprend', 'mecanismo', 'por que');

  // Adrenalina (por contexto)
  if (t.includes('adrenalina') && t.includes('pcr')) return 'adrena:pcr';
  if (t.includes('adrenalina') && has('anafilax', 'alergi')) return 'adrena:ana';
  if (t.includes('adrenalina') && has('choque', 'infus')) return 'adrena:choque';
  if (t.includes('adrenalina')) return 'q:adrena';

  // Alerta crítico
  if (has('hipercalem', 'k 7', 'k7', 'k+ 7', 'potássio alto', 'potassio alto', 'qrs largo')) return 'crit:k';

  // Aprendizado (antes da conduta operacional)
  if (explica && has('sepse', 'séptico', 'septico')) return 'learn:sepse';

  // Protocolo guiado
  if (has('protocolo', 'acls', 'parada cardio', 'reanima')) return 'proto:pcr';

  // Comparação
  if (t.includes('noradrenalina') && t.includes('dobutamina')) return 'q:noradobu';
  if (has('noradrenalina', 'dobutamina', 'vasopressor')) return 'q:noradobu';

  // Interpretação de exame
  if (has('gaso', 'gasometria', 'ph ', 'hco3', 'hco₃', 'lactato', 'ânion', 'anion')) return 'q:gaso';

  // Conduta operacional / triagem
  if (has('séptico', 'septico', 'sepse')) return 'hipo:sepse';
  if (has('hipotens', 'pressão baixa', 'pressao baixa', 'paciente ruim', 'choque', 'pam ')) return 'q:hipo';

  // Resumo copiável
  if (has('resume', 'resumo', 'evolu', 'prontuário', 'prontuario', 'passagem', 'whatsapp')) return 'q:resumo';

  return null;
}

/** Resolve uma entrada (token de roteiro OU texto livre) → resposta estruturada. */
export function respond(input) {
  if (input === 'stub:tool') return TOOL_STUB;
  if (RESPONSES[input]) return RESPONSES[input];
  const token = matchText(input);
  if (token && RESPONSES[token]) return RESPONSES[token];
  return FALLBACK;
}
