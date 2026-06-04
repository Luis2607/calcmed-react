/* IA — roteiro de demonstração do AI Response System no protótipo.
 * Mapeia entradas/seleções → respostas ESTRUTURADAS (contrato do
 * AIResponseRenderer). Conteúdo clínico ilustrativo; o produto final
 * plugaria um backend no lugar deste roteiro. */

export const ILLUSTRATIVE = 'Confira no protocolo do seu serviço.';
// Ressalva mais forte para dose/conduta crítica (não anestesiar por repetição).
export const ILLUSTRATIVE_DOSE = 'Valide a dose no protocolo do seu serviço antes de aplicar.';

// Sugestões iniciais (estado vazio + fallback). value = token de roteiro.
// Cobrem a amplitude dos patterns: ambígua, triagem, crítico, exame, protocolo,
// aprendizado e resumo. Comparação é alcançável por texto/ações.
// Sugestões iniciais — curadas pelo MAIOR valor de plantão, cada uma uma
// capacidade distinta (dose · conduta · exame · comparação · protocolo · resumo),
// ordenadas por urgência. Poucas e de propósito: a faixa rola na horizontal.
export const STARTERS = [
  { label: 'dose de adrenalina?', value: 'q:adrena' },
  { label: 'paciente hipotenso', value: 'q:hipo' },
  { label: 'interpreta uma gasometria', value: 'q:gaso' },
  { label: 'noradrenalina ou dobutamina?', value: 'q:noradobu' },
  { label: 'protocolo de PCR', value: 'proto:pcr' },
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
      { type: 'text', content: '**Sem teto de dose** na parada. Manter **RCP de alta qualidade** entre as doses.' },
      { type: 'limitation', content: ILLUSTRATIVE_DOSE },
    ],
    actions: [{ label: 'Ver ACLS', value: 'stub:tool' }, { label: 'Dose pediátrica', value: 'adrena:ped' }],
  },
  'adrena:ana': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina na anafilaxia (adulto)',
    blocks: [
      { type: 'dose', value: '0,5 mg', unit: 'IM (1:1000)', via: 'face anterolateral da coxa · repetir 5–15 min' },
      { type: 'text', content: 'Via **IM** é a de escolha. **IV** apenas em choque refratário, com monitorização.' },
      { type: 'limitation', content: ILLUSTRATIVE_DOSE },
    ],
    actions: [{ label: 'Refratário → infusão', value: 'adrena:choque' }],
  },
  'adrena:choque': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina em infusão (choque)',
    blocks: [
      { type: 'dose', value: '0,01–0,5', unit: 'mcg/kg/min', via: 'infusão contínua · titular pela PAM' },
      { type: 'text', content: 'Considerada em choque refratário; preferir noradrenalina como 1ª linha no choque séptico.' },
      { type: 'limitation', content: ILLUSTRATIVE_DOSE },
    ],
    actions: [{ label: 'Comparar com noradrenalina', value: 'q:noradobu' }],
  },
  'adrena:ped': {
    intent: 'dose',
    risk_level: 'alto',
    title: 'Adrenalina na PCR (pediátrica)',
    blocks: [
      { type: 'dose', value: '0,01 mg/kg', unit: 'IV/IO', via: 'máx 1 mg · a cada 3–5 min' },
      { type: 'limitation', content: ILLUSTRATIVE_DOSE },
    ],
    actions: [{ label: 'Dose adulto (PCR)', value: 'adrena:pcr' }, { label: 'Protocolo de PCR', value: 'proto:pcr' }],
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
      { type: 'primary_action', content: 'Iniciar **noradrenalina** — meta **PAM ≥ 65 mmHg**' },
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
    actions: [{ label: 'Calcular dose por peso', value: 'stub:tool' }, { label: 'Copiar conduta', value: 'q:resumo' }],
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
    actions: [{ label: 'Comparar nora × dobuta', value: 'q:noradobu' }, { label: 'Copiar conduta', value: 'q:resumo' }],
  },
  'hipo:naosei': {
    intent: 'triagem',
    title: 'Vamos por dados objetivos',
    blocks: [
      { type: 'text', content: 'Sem hipótese fechada, deixe o perfil guiar — ou um exame pra orientar.' },
      {
        type: 'chips',
        label: 'Perfil mais provável',
        items: [
          { label: 'Séptico', value: 'hipo:sepse' },
          { label: 'Hemorrágico', value: 'hipo:sangramento' },
          { label: 'Cardiogênico', value: 'hipo:cardio' },
          { label: 'Interpretar gasometria', value: 'q:gaso' },
        ],
      },
    ],
  },

  // ---- Interpretação de exame ----
  'q:gaso': {
    intent: 'exame',
    risk_level: 'medio',
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
          { label: 'K alto / ECG', value: 'crit:k' },
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
      { type: 'text', content: '**Regra prática:** PA baixa → **nora** primeiro; débito baixo com PA mantida → **dobuta**.' },
      { type: 'limitation', content: ILLUSTRATIVE },
    ],
    actions: [{ label: 'Paciente em choque', value: 'q:hipo' }, { label: 'Resumir conduta', value: 'q:resumo' }],
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
      { type: 'primary_action', tone: 'critico', content: '**Gluconato de cálcio 10% IV** — estabiliza a membrana (não baixa o K⁺).' },
      {
        type: 'checklist',
        tagLabel: 'Em seguida',
        tagTone: 'critico',
        items: ['Insulina regular + glicose (desloca K⁺ p/ dentro)', 'Beta-2 agonista inalatório', 'Monitorização contínua + ECG seriado'],
      },
      { type: 'limitation', content: ILLUSTRATIVE_DOSE },
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
      { type: 'text', content: 'Em uma frase: **disfunção orgânica** por resposta desregulada à infecção, com **hipotensão** que exige vasopressor e/ou **lactato elevado** mesmo após volume adequado.' },
      { type: 'divider' },
      { type: 'heading', icon: 'busca', text: 'Como reconhecer' },
      {
        type: 'list',
        items: [
          'Sepse **+ vasopressor** para manter **PAM ≥ 65 mmHg**',
          '**Lactato > 2 mmol/L** apesar de ressuscitação volêmica adequada',
        ],
      },
      { type: 'divider' },
      { type: 'heading', icon: 'seringa', text: 'Por que noradrenalina primeiro' },
      { type: 'text', content: 'É o vasopressor de **1ª linha**: eleva a PAM com **menor risco arritmogênico** que a dopamina e mantém a perfusão sem taquicardia excessiva.' },
      { type: 'expandable', title: 'E quando associar vasopressina?', content: 'Como 2º agente quando a noradrenalina sobe além de doses moderadas, para reduzir a dose total de catecolamina — conforme protocolo institucional.' },
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
    actions: [{ label: 'Conduta no choque', value: 'q:hipo' }, { label: 'Interpretar gasometria', value: 'q:gaso' }],
  },
};

// Stub de ferramenta: ações de calculadora/referência que, no produto, abririam
// a ferramenta correspondente. Na demo, respondem de forma intencional.
const TOOL_STUB = {
  intent: 'aprendizado',
  title: 'Cálculo por peso',
  blocks: [
    { type: 'text', content: 'A dose é ajustada ao peso do paciente (mg/kg) — informe o peso para fechar o número.' },
    { type: 'chips', label: 'Continuar', items: STARTERS },
  ],
};

const FALLBACK = {
  intent: 'ambigua',
  title: 'Não consegui interpretar',
  blocks: [
    { type: 'text', content: 'Reformule em uma linha. Funciono melhor com dose, conduta, exame, protocolo ou resumo — por exemplo:' },
    { type: 'chips', items: STARTERS },
  ],
};

// Casa texto livre com um token de roteiro (heurística simples de demonstração).
// Ordem importa: específicos e críticos primeiro.
function matchText(text) {
  const t = (typeof text === 'string' ? text : '').toLowerCase();
  const has = (...keys) => keys.some((k) => t.includes(k));
  // palavra inteira (evita falso negativo no fim da frase e match dentro de palavras)
  const word = (...ws) => ws.some((w) => new RegExp(`\\b${w}\\b`).test(t));
  const explica = has('explica', 'explique', 'o que é', 'o que e', 'aprend', 'mecanismo', 'por que');

  // Adrenalina (por contexto) — palavra inteira: "noradrenalina" NÃO casa
  // "adrenalina" (substring), senão roubaria a comparação de vasopressores.
  const adre = word('adrenalina');
  if (adre && t.includes('pcr')) return 'adrena:pcr';
  if (adre && has('anafilax', 'alergi')) return 'adrena:ana';
  if (adre && has('choque', 'infus')) return 'adrena:choque';
  if (adre) return 'q:adrena';

  // Alerta crítico de hipercalemia — pattern MAIS grave: cobertura ampla.
  const kAlto = /\bk\+?\s*\.?\s*[6-9]/.test(t) || /(pot[aá]ssio)\W{0,6}[6-9]/.test(t);
  if (has('hipercalem', 'qrs largo', 'potássio alto', 'potassio alto') || kAlto) return 'crit:k';

  // Aprendizado (antes da conduta operacional)
  if (explica && has('sepse', 'séptico', 'septico')) return 'learn:sepse';

  // Protocolo guiado
  if (has('protocolo', 'acls', 'parada cardio', 'reanima')) return 'proto:pcr';

  // Comparação — só com DOIS agentes OU sinal explícito de comparação
  // (evita "dose de noradrenalina" cair na tabela comparativa).
  const compara = has(' ou ', ' vs', 'versus', 'comparar', 'compara', 'diferença', 'diferenca', 'melhor');
  if (t.includes('noradrenalina') && t.includes('dobutamina')) return 'q:noradobu';
  if (has('noradrenalina', 'dobutamina', 'vasopressor') && compara) return 'q:noradobu';

  // Conduta crítica ANTES do marcador laboratorial isolado
  // (sepse/choque vencem "lactato": "lactato 5 no choque séptico" → conduta, não gaso).
  if (has('séptico', 'septico', 'sepse')) return 'hipo:sepse';
  if (has('hipotens', 'pressão baixa', 'pressao baixa', 'paciente ruim', 'choque') || word('pam')) return 'q:hipo';

  // Interpretação de exame
  if (has('gaso', 'gasometria', 'hco3', 'hco₃', 'lactato', 'ânion', 'anion') || word('ph')) return 'q:gaso';

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
