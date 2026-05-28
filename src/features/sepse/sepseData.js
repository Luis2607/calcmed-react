/* ============================================================
   Sepse · DADOS CLÍNICOS + cálculos puros
   Porte 1:1 do golden calcmed/src/protocolos/sepse/sepse.js
   (SSC 2026). NUNCA aproximar — paridade obrigatória (plano A7).
   ============================================================ */

// ── SOFA · 6 sistemas · pts === idx (0..4) ────────────────────
export const SOFA_SISTEMAS = [
  {
    key: 'resp', nome: 'Respiração', parametro: 'PaO₂/FiO₂',
    niveis: [
      { desc: 'PaO₂/FiO₂ ≥ 400', pts: 0 },
      { desc: '300 a 399', pts: 1 },
      { desc: '200 a 299', pts: 2 },
      { desc: '100 a 199 + VM', pts: 3 },
      { desc: '< 100 + VM', pts: 4 },
    ],
  },
  {
    key: 'coag', nome: 'Coagulação', parametro: 'Plaquetas ×10³',
    niveis: [
      { desc: 'Plaquetas ≥ 150 ×10³', pts: 0 },
      { desc: '100 a 149 ×10³', pts: 1 },
      { desc: '50 a 99 ×10³', pts: 2 },
      { desc: '20 a 49 ×10³', pts: 3 },
      { desc: '< 20 ×10³', pts: 4 },
    ],
  },
  {
    key: 'figado', nome: 'Fígado', parametro: 'Bilirrubina mg/dL',
    niveis: [
      { desc: 'Bilirrubina < 1,2 mg/dL', pts: 0 },
      { desc: '1,2 a 1,9 mg/dL', pts: 1 },
      { desc: '2,0 a 5,9 mg/dL', pts: 2 },
      { desc: '6,0 a 11,9 mg/dL', pts: 3 },
      { desc: '≥ 12 mg/dL', pts: 4 },
    ],
  },
  {
    key: 'cardio', nome: 'Cardiovascular', parametro: 'PAM / drogas',
    niveis: [
      { desc: 'PAM ≥ 70 mmHg', pts: 0 },
      { desc: 'PAM < 70 mmHg', pts: 1 },
      { desc: 'Dopamina ≤ 5 mcg/kg/min', pts: 2 },
      { desc: 'Dopamina > 5 ou Nora/Adre ≤ 0,1', pts: 3 },
      { desc: 'Dopamina > 15 ou Nora/Adre > 0,1', pts: 4 },
    ],
  },
  {
    key: 'neuro', nome: 'Neurológico', parametro: 'Glasgow',
    niveis: [
      { desc: 'Glasgow 15', pts: 0 },
      { desc: 'Glasgow 13 a 14', pts: 1 },
      { desc: 'Glasgow 10 a 12', pts: 2 },
      { desc: 'Glasgow 6 a 9', pts: 3 },
      { desc: 'Glasgow < 6', pts: 4 },
    ],
  },
  {
    key: 'renal', nome: 'Renal', parametro: 'Creatinina mg/dL ou DU',
    niveis: [
      { desc: 'Creatinina < 1,2 mg/dL', pts: 0 },
      { desc: '1,2 a 1,9 mg/dL', pts: 1 },
      { desc: '2,0 a 3,4 mg/dL', pts: 2 },
      { desc: '3,5 a 4,9 mg/dL ou DU < 500 mL/dia', pts: 3 },
      { desc: '≥ 5 mg/dL ou DU < 200 mL/dia', pts: 4 },
    ],
  },
];

// ── SIRS · 4 critérios booleanos · 1 pt cada ──────────────────
export const SIRS_ITENS = [
  { key: 'temp', label: 'Temperatura > 38 °C ou < 36 °C' },
  { key: 'fc', label: 'FC > 90 bpm' },
  { key: 'fr', label: 'FR > 20 irpm (ou PaCO₂ < 32)' },
  { key: 'leuco', label: 'Leucócitos > 12.000, < 4.000 ou bastões > 10%' },
];

// ── NEWS / NEWS2 · 7 critérios · idx→pts (pts ≠ idx) ──────────
export const NEWS_SISTEMAS = [
  {
    key: 'fr', nome: 'FR', parametro: 'irpm',
    niveis: [
      { desc: '12 a 20 irpm', pts: 0 },
      { desc: '9 a 11 ou 21 a 24 irpm', pts: 1 },
      { desc: '≤ 8 ou ≥ 25 irpm', pts: 3 },
    ],
  },
  {
    key: 'spo2', nome: 'SpO₂', parametro: '%',
    niveis: [
      { desc: '≥ 96 %', pts: 0 },
      { desc: '94 a 95 %', pts: 1 },
      { desc: '92 a 93 %', pts: 2 },
      { desc: '≤ 91 %', pts: 3 },
    ],
  },
  {
    key: 'o2supl', nome: 'O₂ suplementar', parametro: '',
    niveis: [
      { desc: 'Ar ambiente', pts: 0 },
      { desc: 'Em O₂', pts: 2 },
    ],
  },
  {
    key: 'temp', nome: 'Temperatura', parametro: '°C',
    niveis: [
      { desc: '36,1 a 38,0 °C', pts: 0 },
      { desc: '35,1 a 36,0 ou 38,1 a 39,0 °C', pts: 1 },
      { desc: '> 39,0 °C', pts: 2 },
      { desc: '≤ 35,0 °C', pts: 3 },
    ],
  },
  {
    key: 'pas', nome: 'PAS', parametro: 'mmHg',
    niveis: [
      { desc: '111 a 219 mmHg', pts: 0 },
      { desc: '101 a 110 mmHg', pts: 1 },
      { desc: '91 a 100 mmHg', pts: 2 },
      { desc: '≤ 90 ou ≥ 220 mmHg', pts: 3 },
    ],
  },
  {
    key: 'fc', nome: 'FC', parametro: 'bpm',
    niveis: [
      { desc: '51 a 90 bpm', pts: 0 },
      { desc: '41 a 50 ou 91 a 110 bpm', pts: 1 },
      { desc: '111 a 130 bpm', pts: 2 },
      { desc: '≤ 40 ou ≥ 131 bpm', pts: 3 },
    ],
  },
  {
    key: 'consciencia', nome: 'Consciência', parametro: 'AVPU / Glasgow',
    niveis: [
      { desc: 'Alerta', pts: 0 },
      { desc: 'Alterado', pts: 3 },
    ],
  },
];

// ── MEWS · 5 critérios · idx→pts ──────────────────────────────
export const MEWS_SISTEMAS = [
  {
    key: 'pas', nome: 'PAS', parametro: 'mmHg',
    niveis: [
      { desc: '101 a 199 mmHg', pts: 0 },
      { desc: '81 a 100 mmHg', pts: 1 },
      { desc: '71 a 80 ou ≥ 200 mmHg', pts: 2 },
      { desc: '≤ 70 mmHg', pts: 3 },
    ],
  },
  {
    key: 'fc', nome: 'FC', parametro: 'bpm',
    niveis: [
      { desc: '51 a 100 bpm', pts: 0 },
      { desc: '41 a 50 ou 101 a 110 bpm', pts: 1 },
      { desc: '< 40 ou 111 a 129 bpm', pts: 2 },
      { desc: '≥ 130 bpm', pts: 3 },
    ],
  },
  {
    key: 'fr', nome: 'FR', parametro: 'irpm',
    niveis: [
      { desc: '9 a 14 irpm', pts: 0 },
      { desc: '15 a 20 irpm', pts: 1 },
      { desc: '< 9 ou 21 a 29 irpm', pts: 2 },
      { desc: '≥ 30 irpm', pts: 3 },
    ],
  },
  {
    key: 'temp', nome: 'Temperatura', parametro: '°C',
    niveis: [
      { desc: '35,0 a 38,4 °C', pts: 0 },
      { desc: '< 35,0 ou ≥ 38,5 °C', pts: 2 },
    ],
  },
  {
    key: 'consciencia', nome: 'Consciência', parametro: 'AVPU / Glasgow',
    niveis: [
      { desc: 'Alerta · Glasgow 15', pts: 0 },
      { desc: 'Glasgow 13 a 14', pts: 1 },
      { desc: 'Glasgow 9 a 12', pts: 2 },
      { desc: 'Glasgow < 9', pts: 3 },
    ],
  },
];

// ── Descritores roxos por escore (trocarTabScore) ─────────────
export const SCORE_DESCRITORES = {
  sirs: 'SIRS (SSC 2026): Sensibilidade superior a qSOFA. 2 critérios = positivo.',
  news: 'NEWS (SSC 2026): Padrão-ouro para screening. Score ≥ 5 = risco moderado/alto, avalie SOFA.',
  mews: 'MEWS: Escore intermediário de 5 parâmetros. Score ≥ 5 = risco aumentado.',
  sofa: 'SOFA (Sepsis-3): Score ≥ 2 = disfunção orgânica. Infecção + SOFA ≥2 = sepse. Calcule após pedir exames laboratoriais.',
};

// ── Esquemas empíricos por foco (ESQUEMAS) ────────────────────
export const ESQUEMAS = {
  pac: {
    nome: 'Pulmonar (PAC)', drogas: [
      { nome: 'Ceftriaxona', dose: '1 a 2 g IV q24h, infusão prolongada 3 a 4 h.' },
      { nome: '+ Azitromicina', dose: '500 mg IV ou VO q24h.' },
    ],
  },
  urinario: {
    nome: 'Urinário', drogas: [
      { nome: 'Ceftriaxona', dose: '2 g IV q24h.' },
    ],
  },
  abdominal: {
    nome: 'Abdominal', drogas: [
      { nome: 'Piperacilina-tazobactam', dose: '4,5 g IV q6h.' },
      { nome: '+ Metronidazol', dose: '500 mg IV q8h (se necessário cobertura extra).' },
    ],
  },
  snc: {
    nome: 'SNC / Meningite', drogas: [
      { nome: 'Ceftriaxona', dose: '2 g IV q12h.' },
      { nome: '+ Vancomicina', dose: '15 a 20 mg/kg IV q8 a 12h.' },
      { nome: '+ Ampicilina', dose: '2 g IV q4h se Listeria suspeita.' },
    ],
  },
  pele: {
    nome: 'Pele e partes moles', drogas: [
      { nome: 'Cefazolina', dose: '2 g IV q8h.' },
    ],
  },
  desconhecido: {
    nome: 'Foco desconhecido', drogas: [
      { nome: 'Piperacilina-tazobactam', dose: '4,5 g IV q6h.' },
      { nome: '+ Vancomicina', dose: '15 a 20 mg/kg IV q8 a 12h (cobertura ampla).' },
    ],
  },
};

export const FOCOS = [
  { value: 'pac', label: 'Pulmonar (PAC)', description: 'Pneumonia adquirida na comunidade' },
  { value: 'urinario', label: 'Urinário', description: 'ITU / pielonefrite' },
  { value: 'abdominal', label: 'Abdominal', description: 'Peritonite, colangite, abscesso' },
  { value: 'snc', label: 'SNC / Meningite', description: 'Meningite, abscesso cerebral' },
  { value: 'pele', label: 'Pele e partes moles', description: 'Celulite, erisipela, fasciíte' },
  { value: 'desconhecido', label: 'Foco desconhecido', description: 'Origem não identificada' },
];

export const RISCO_MRSA = [
  { key: 'mrsa-internacao', label: 'Internação recente (< 90 dias)' },
  { key: 'mrsa-atb', label: 'Antibiótico IV recente (< 90 dias)' },
  { key: 'mrsa-dialise', label: 'Hemodiálise' },
  { key: 'mrsa-colonizacao', label: 'Colonização prévia conhecida' },
  { key: 'mrsa-dispositivo', label: 'Dispositivo intravascular' },
];

export const RISCO_MDR = [
  { key: 'mdr-esbl', label: 'ESBL · beta-lactamase de espectro estendido' },
  { key: 'mdr-kpc', label: 'KPC / CRE · resistência a carbapenêmicos' },
  { key: 'mdr-vre', label: 'VRE · Enterococcus resistente à vancomicina' },
  { key: 'mdr-pseudomonas', label: 'Pseudomonas MDR' },
  { key: 'mdr-internacao', label: 'UTI prolongada / ATB amplo recente' },
];

// ── Bundle (grupos + labels timeline) ─────────────────────────
export const BUNDLE_PRIMEIRA_HORA = ['hemocultura', 'lactato', 'atb', 'cristaloide'];
export const BUNDLE_ACOMPANHAMENTO = ['vasopressor', 'reavaliacao', 'procal', 'foco', 'hidrocort'];

export const BUNDLE_LABELS = {
  hemocultura: 'Hemocultura × 2',
  lactato: 'Lactato sérico',
  atb: 'Antibiótico IV',
  cristaloide: 'Cristaloide 30 mL/kg',
  vasopressor: 'Vasopressor para PAM',
  reavaliacao: 'Reavaliar Lactato 2-4h',
  procal: 'Procalcitonina',
  foco: 'Foco infeccioso identificado',
  hidrocort: 'Hidrocortisona',
};

export const BUNDLE_TIMELINE_LABEL = {
  hemocultura: 'Hemocultura · 2 amostras (aeróbio + anaeróbio)',
  lactato: 'Lactato sérico colhido',
  atb: 'ATB IV de amplo espectro',
  cristaloide: 'Cristaloide 30 mL/kg iniciado',
};

export const METAS_ITENS = [
  { key: 'pam', label: 'PAM ≥ 65 mmHg' },
  { key: 'lactato', label: 'Lactato em queda' },
  { key: 'du', label: 'Débito urinário ≥ 0,5 mL/kg/h' },
  { key: 'crt', label: 'Enchimento capilar < 3 s' },
  { key: 'spo2', label: 'SpO₂ 92-96%' },
];

export const ICU_ITENS = [
  { key: 'tvp', label: 'Profilaxia TVP · HBPM ou HNF' },
  { key: 'ibp', label: 'Profilaxia gástrica · IBP' },
  { key: 'cabeceira', label: 'Cabeceira a 30°' },
  { key: 'sedacao', label: 'Sedação leve · RASS -1 a 0' },
  { key: 'reab', label: 'Mobilização precoce' },
  { key: 'glicemia', label: 'Glicemia < 180 mg/dL' },
];

export const CLASSIF_LABEL = {
  definida: 'Sepse definida',
  provavel: 'Sepse provável',
  possivel: 'Sepse possível',
  improvavel: 'Sepse improvável',
};

// ============================================================
// CÁLCULOS PUROS (1:1 sepse.js)
// ============================================================

export function parseNum(raw) {
  if (raw == null) return NaN;
  const s = String(raw).replace(',', '.').trim();
  return s === '' ? NaN : parseFloat(s);
}

export function pontosSIRS(sirs = {}) {
  return ['temp', 'fc', 'fr', 'leuco'].reduce((acc, k) => acc + (sirs[k] ? 1 : 0), 0);
}

export function pontosNEWS(news = {}) {
  return NEWS_SISTEMAS.reduce((acc, sis) => {
    const idx = news[sis.key];
    if (typeof idx === 'number' && sis.niveis[idx]) return acc + sis.niveis[idx].pts;
    return acc;
  }, 0);
}

export function pontosMEWS(mews = {}) {
  return MEWS_SISTEMAS.reduce((acc, sis) => {
    const idx = mews[sis.key];
    if (typeof idx === 'number' && sis.niveis[idx]) return acc + sis.niveis[idx].pts;
    return acc;
  }, 0);
}

export function somaSofa(sofa = {}) {
  return Object.values(sofa).reduce((acc, v) => acc + (typeof v === 'number' ? v : 0), 0);
}

export function totalScoreAtivo(scoreAtivo, estado) {
  switch (scoreAtivo) {
    case 'sirs': return pontosSIRS(estado.sirs);
    case 'news': return pontosNEWS(estado.news);
    case 'mews': return pontosMEWS(estado.mews);
    case 'sofa': default: return somaSofa(estado.sofa);
  }
}

// Retorna { texto, sev } — regras do Gustavo (statusScoreAtivo no golden)
export function statusScoreAtivo(scoreAtivo, total, estado = {}) {
  switch (scoreAtivo) {
    case 'sirs':
      if (total === 0) return { texto: 'Aguardando preenchimento', sev: 'neutro' };
      if (total <= 1) return { texto: 'SIRS improvável', sev: 'sucesso' };
      if (total === 2) return { texto: 'SIRS presente', sev: 'atencao' };
      if (total === 3) return { texto: 'Resposta inflamatória importante', sev: 'atencao' };
      return { texto: 'Resposta inflamatória intensa', sev: 'critico' };
    case 'news': {
      const news = estado.news || {};
      const preenchidos = Object.keys(news).filter((k) => k !== 'versao' && typeof news[k] === 'number').length;
      if (total === 0 && preenchidos === 0) return { texto: 'Aguardando preenchimento', sev: 'neutro' };
      if (total <= 4) return { texto: 'Baixo risco de deterioração clínica', sev: 'sucesso' };
      if (total <= 6) return { texto: 'Risco MODERADO · avaliar SOFA se suspeita infecciosa', sev: 'atencao' };
      return { texto: 'Risco ALTO de deterioração · avaliar sepse', sev: 'critico' };
    }
    case 'mews': {
      const mews = estado.mews || {};
      const preenchidos = Object.keys(mews).filter((k) => typeof mews[k] === 'number').length;
      if (total === 0 && preenchidos === 0) return { texto: 'Aguardando preenchimento', sev: 'neutro' };
      if (total <= 4) return { texto: 'Baixo risco de deterioração clínica', sev: 'sucesso' };
      return { texto: 'Risco ALTO · avaliar SOFA se suspeita infecciosa', sev: 'critico' };
    }
    case 'sofa':
    default:
      if (total === 0) return { texto: 'Aguardando preenchimento', sev: 'neutro' };
      if (total < 2) return { texto: 'Ausência de disfunção orgânica · manter vigilância', sev: 'sucesso' };
      if (total < 6) return { texto: 'Disfunção orgânica · iniciar Bundle 1 hora', sev: 'atencao' };
      return { texto: 'Disfunção grave · iniciar Bundle e avaliar choque', sev: 'critico' };
  }
}

// sev → risk do ScoreResult ('baixo'|'moderado'|'alto')
export function sevToRisk(sev) {
  if (sev === 'critico') return 'alto';
  if (sev === 'atencao') return 'moderado';
  return 'baixo';
}

// Peso ajustado p/ obeso (IMC ≥ 30) · fórmula confirmada c/ cliente
export function calcularPesoAjustado({ imcObeso, peso, altura, sexo }) {
  if (!imcObeso || !peso || !altura || !sexo) return null;
  const base = sexo === 'masc' ? 50 : 45.5;
  const pesoIdeal = base + 0.906 * (altura - 152.4);
  const ajustado = pesoIdeal + 0.4 * (peso - pesoIdeal);
  return Math.max(0, Math.round(ajustado));
}

// Volume cristaloide (30 mL/kg) · usa peso ajustado se houver
export function calcularVolume({ peso, pesoAjustado }) {
  const pesoUsado = pesoAjustado ?? peso;
  if (!pesoUsado) return null;
  return { pesoUsado, volumeMl: Math.round(pesoUsado * 30) };
}

// ── Prescrições de vasopressor (ampolas + diluente + vazão BIC) ──
// Noradrenalina: 4 amp (4mg/4mL) + 234 mL SG5% = 16mg/250mL = 64 mcg/mL
//   vazão (mL/h) = mcg/kg/min × peso × 60 / 64
export function prescricaoNoradrenalina(mcgKg, peso) {
  const dose = typeof mcgKg === 'number' ? mcgKg : 0.10;
  const doseFmt = dose.toFixed(2).replace('.', ',');
  const base = { droga: 'Noradrenalina', amp: '4 mg/4 mL', preparo: '4 amp + 234 mL SG 5%', doseFmt };
  if (!peso) return { ...base, vazao: null };
  const vazao = (dose * peso * 60 / 64).toFixed(1).replace('.', ',');
  return { ...base, vazao };
}

// Adrenalina: 12 amp (1mg/mL) + 188 mL SG5% = 12mg/200mL = 60 mcg/mL
//   vazão (mL/h) = mcg/kg/min × peso
export function prescricaoAdrenalina(mcgKg, peso) {
  const dose = typeof mcgKg === 'number' ? mcgKg : 0.05;
  const doseFmt = dose.toFixed(2).replace('.', ',');
  const base = { droga: 'Adrenalina', amp: '1 mg/mL', preparo: '12 ampolas + 188 mL SG 5%', doseFmt };
  if (!peso) return { ...base, vazao: null };
  const vazao = (dose * peso).toFixed(1).replace('.', ',');
  return { ...base, vazao };
}

// Dobutamina: 4 amp (250mg/20mL) + 170 mL SG5% = 1000mg/250mL = 4000 mcg/mL
//   vazão (mL/h) = mcg/kg/min × peso × 0,015
export function prescricaoDobutamina(mcgKg, peso) {
  const dose = typeof mcgKg === 'number' ? mcgKg : 5;
  const doseFmt = dose.toFixed(1).replace('.', ',');
  const base = { droga: 'Dobutamina', amp: '250 mg/20 mL', preparo: '4 ampolas + 170 mL SG 5%', doseFmt };
  if (!peso) return { ...base, vazao: null };
  const vazao = (dose * peso * 0.015).toFixed(1).replace('.', ',');
  return { ...base, vazao };
}

// Próximo passo da NE conforme dose (atualizarDoseNE)
export function proximoPassoNE(mcgKg) {
  const dose = typeof mcgKg === 'number' ? mcgKg : 0;
  if (dose < 0.25) return 'Escalonar NE até 0,25 mcg/kg/min antes de associar Vasopressina.';
  if (dose < 0.5) return 'NE ≥ 0,25 · associe Vasopressina (0,03 U/min IV, dose fixa).';
  return 'Dose alta · associe Adrenalina e inicie Hidrocortisona 200 mg/dia IV.';
}
